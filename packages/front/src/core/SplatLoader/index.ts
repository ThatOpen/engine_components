import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import * as OBC from "@thatopen/components";
import { PostproductionRenderer } from "../PostproductionRenderer";
import type { OcclusionPass } from "../PostproductionRenderer";
import { GSplat } from "./gsplat/renderer";
import { GSplatStream } from "./gsplat/stream";
import type { ISplatRenderer } from "./gsplat/types";
import { parsePly, parseCompressedPly, parseFqChunk, flipToYUp, type SplatData } from "./gsplat/ply";
import { mkSplatDepthMaterial } from "./gsplat/shaders";
import { prepareWebgpuSplats } from "./gsplat/webgpu-splats";

/**
 * A 3D Gaussian splat source. Either:
 *  - a URL to a `.ply` / `.compressed.ply` file (INRIA 3DGS or its compressed variant), or its raw bytes, or
 *  - several LOD levels (`lodUrls`, finest → coarsest) concatenated into one global-sort buffer.
 *
 * The bytes are decoded on the CPU (covariance precompute + Y-up flip) and uploaded to GPU
 * textures by the in-house WebGL2 renderer ({@link GSplat}) — no external splat engine.
 */
export interface SplatSource {
  url?: string;
  /** Several LOD levels (finest first). Picked per spatial cell by camera distance. */
  lodUrls?: string[];
  /** OUT-OF-CORE streaming source: the folder containing `lod-meta.json` (a B-tree LOD manifest of
   * on-disk SOG chunks). Streamed by {@link GSplatStream} with a fixed GPU budget (fetch/evict +
   * global sort) instead of fully resident. A `url` ending in `lod-meta.json` is also detected. */
  manifestUrl?: string;
  /** Resident splat budget for the streaming path (default ~6M). */
  streamBudget?: number;
  fileBytes?: Uint8Array;
  /** Optional fetch adapter (platform hidden files, S3 Range, signed URLs). Mirrors
   * {@link PointCloudLoader}'s `requestManager` — the component decodes, the app fetches. */
  requestManager?: SplatRequestManager;
}

/** The byte-fetching contract, app-supplied so the transport is fully pluggable. */
export interface SplatRequestManager {
  getUrl(url: string): string | Promise<string>;
  fetch(input: RequestInfo | URL, init?: RequestInit): Promise<Response>;
}

/** A loaded splat handle returned by {@link SplatLoader.load}. */
export interface LoadedSplat {
  readonly id: string;
  /** Kept for API symmetry (every dataset is in-core global-sort now → always false). */
  readonly streamed: boolean;
  /** World anchor the splat was placed at (for BIM co-location). */
  readonly anchor: THREE.Vector3;
  /** World-space bounding box (filled once the dataset is decoded + placed). */
  readonly box: THREE.Box3;
  /** Live count of gaussians currently drawn (shrinks/grows with LOD + frustum cull). */
  readonly splatCount: number;
  /** The underlying renderer for this dataset — the in-core {@link GSplat} or the streaming
   * {@link GSplatStream} (both implement {@link ISplatRenderer}). */
  readonly object: ISplatRenderer;
}

/**
 * Streams 3D Gaussian splats THROUGH the world's deferred {@link PostproductionRenderer} as a
 * first-class citizen of the pipeline.
 *
 * The splats are drawn by the in-house WebGL2 {@link GSplat} renderer (EWA covariance billboards,
 * a worker-driven global depth sort, a 10³ cell grid for distance LOD + frustum culling). They
 * are rendered into the deferred occlusion seam in LAYER mode (premultiplied over the finished
 * frame); critically, every splat writes its CENTRE's reversed-Z depth and the material depth-
 * TESTS (`GreaterEqualDepth`, no depth write) against the BIM depth borrowed by the seam — so BIM
 * geometry occludes the splats with NO shader patching, exactly as a real mesh would.
 *
 * This replaces the previous Spark + 3d-tiles-renderer implementation; those optional peer
 * dependencies are no longer needed.
 */
export class SplatLoader extends OBC.Component implements OBC.Disposable {
  static uuid = "b2f7d4e3-8a5c-4b02-ad3f-4e6a9c1b7f25" as const;

  /** {@link OBC.Disposable.onDisposed} */
  readonly onDisposed = new OBC.Event();

  /** Fires once a splat source has finished loading + been added to the splat scene. */
  readonly onSplatLoaded = new OBC.Event<LoadedSplat>();

  /** Loaded splats, keyed by id. */
  readonly list = new Map<string, LoadedSplat>();

  /**
   * Minimum projected splat size (px). Splats below it are skipped in the vertex stage, but their
   * opacity now ramps down over the band just above the threshold, so they FADE out instead of
   * blinking out — no hard boundary travelling with the camera. ~2-3 px is a common default
   * and a real perf lever on dense scenes: larger = cheaper and blurrier at distance.
   * With {@link subPixelDetail} on, this becomes a size FLOOR instead and larger values cost MORE.
   */
  minPixelSize = 3;

  /**
   * Keep sub-pixel splats instead of dropping them: each is grown to {@link minPixelSize} and has
   * its opacity scaled by the area it gained, so its contribution is preserved.
   *
   * This is the only mode in which extra streamed detail actually reaches the screen. Measured on
   * the FCC capture: with it OFF, raising {@link lodQuality} from 0.55 to 2.0 drew 20% more splats
   * and produced a bit-identical image — everything the finer LOD added fell under the size
   * threshold and was culled on arrival. With it ON, the same change alters the image.
   *
   * Off by default because it is the expensive path: +18.8 ms at 4.07M drawn (0/15 paired trials
   * — it lost every one). {@link subPixelMinAlpha} claws back roughly half of that. Turn it on
   * for stills, inspection and close work.
   */
  subPixelDetail = false;

  /**
   * With {@link subPixelDetail} on, the alpha at which a grown splat is finally dropped.
   *
   * This is the cost dial for that mode, and it is safe in a way a size threshold is not: opacity
   * decays CONTINUOUSLY with distance, so raising this only makes splats disappear once they have
   * already faded to nothing. It cannot recreate the hard edge the whole change exists to remove.
   *
   * 0.1 by default, chosen from measurement rather than taste: against a 1/255 cut it recovers
   * **8.7 ms of the mode's 18.8 ms** (14/15 paired trials, p = 0.0005) while the rendered frame
   * moves by 0.875/255 on average — about 0.3%. 0.05 was not worth it (-2.3 ms, p = 0.06). Drop it
   * to 1/255 for maximum fidelity in a still.
   */
  subPixelMinAlpha = 0.1;

  /**
   * LOD-distance QUALITY factor (× dataset radius) applied to every splat's `lodBase`
   * each frame. Higher = LOD stays high-detail farther from the camera (more quality,
   * slower); lower = detail drops off sooner (faster). 0.55 is the tuned default (the
   * value each renderer initialises `lodBase` to). Live: read per-frame in `_occlusion`.
   */
  lodQuality = 0.55;

  /**
   * How much VIEW-DEPENDENT colour to apply, 0..1. Gaussian splats store colour as spherical
   * harmonics; the flat DC term alone gives a splat the same colour from every angle, and the
   * higher bands carry the specular response — wet asphalt, glass, polished stone — that reads as
   * "detail" next to a viewer which renders them. 1 = as captured, 0 = flat (identical to the
   * pre-SH look). Applies only to datasets converted WITH `.sh` sidecars; others ignore it.
   * Live: a uniform write, not a re-stream.
   */
  shStrength = 1;

  /**
   * Distance, in world units, past which the view-dependent term fades out. 0 (the default) means
   * no limit. Specular response only reads as such on a surface you are close enough to resolve;
   * beyond that it is per-splat work paying for nothing, and a splat past the limit skips its
   * texture fetch entirely. Ramped over the last 20% so nothing changes colour as it crosses.
   *
   * Left at 0 deliberately: this is an ABSOLUTE distance, and no absolute value is right for both
   * a room scan and a 500 m site. Guidance from the FCC capture (radius 365 m), where savings and
   * visual cost both ordered monotonically with the limit: ~0.3x the dataset radius (110 m) saved
   * 0.6 ms and moved 5% of pixels by >8/255; 0.14x (50 m) saved 1.3 ms and moved 14%.
   */
  shMaxDistance = 0;

  private _world: OBC.World | null = null;
  private _enabled = true;
  private _wired = false;

  /** The world's renderer is a WebGPU one, so the splats are drawn by the node material. */
  private _webgpu = false;

  private readonly _scene = new THREE.Scene();
  private readonly _splats = new Map<string, ISplatRenderer>(); // id -> renderer (in-core | stream)
  private readonly _placements = new Map<string, THREE.Matrix4>(); // id -> local→world (no gScale)
  private _gaussianScale = 1;

  // Depth contributor: makes splats pickable by the world's FastModelPicker
  // (dynamic camera anchor). Registered in _wire, removed in _unwire.
  private _pickPicker: OBC.FastModelPicker | null = null;
  private _pickContributor:
    | ((ctx: {
        renderer: THREE.WebGLRenderer;
        camera: THREE.Camera;
        target: THREE.WebGLRenderTarget;
        scissor: THREE.Vector4;
      }) => void)
    | null = null;
  /** Per-splat-mesh depth-pack material (mesh uuid → material), sharing the mesh's
   * display-material uniforms by reference so the depth surface tracks the render. */
  private readonly _pickDepthMats = new Map<string, THREE.RawShaderMaterial>();

  // Optional CRISP pick proxy: a low-poly collision mesh per splat (generated by
  // splat-transform `-K smooth`, emitted in the SOG frame). When present, the pick
  // depth pass draws these opaque surfaces instead of the fuzzy gaussian depth, so
  // orbit anchors / measurements land on a hard surface. Scene + id→root.
  private readonly _collisionScene = new THREE.Scene();
  private readonly _collisions = new Map<string, THREE.Object3D>();

  // Section-clipping scratch: reused per-frame to avoid allocation.
  private readonly _clipScratch = Array.from({ length: 8 }, () => new THREE.Vector4());
  private readonly _scratchPlane = new THREE.Plane();

  constructor(components: OBC.Components) {
    super(components);
    components.add(SplatLoader.uuid, this);
  }

  /** The world this loader draws into. Setting it registers the occlusion hook on the world's
   * deferred renderer (LAYER mode); clearing it unregisters it. */
  set world(value: OBC.World | null) {
    if (value === this._world) return;
    this._unwire();
    this._world = value;
    if (value && this._enabled) this._wire();
  }

  get world() {
    return this._world;
  }

  /** When false, splats stop drawing (they stay loaded). */
  set enabled(value: boolean) {
    if (value === this._enabled) return;
    this._enabled = value;
    if (value && this._world) this._wire();
    else this._unwire();
  }

  get enabled() {
    return this._enabled;
  }

  /** Live total of gaussians currently drawn across every dataset. */
  get splatCount(): number {
    let n = 0;
    for (const s of this._splats.values()) n += s.drawn;
    return n;
  }

  /** Uniform scale of every splat dataset (sizes + spacing together) — fits the reconstruction
   * to BIM real-world units. */
  get gaussianScale(): number {
    return this._gaussianScale;
  }

  set gaussianScale(value: number) {
    this._gaussianScale = Math.max(0.01, value);
    for (const id of this._splats.keys()) this._place(id);
  }

  /**
   * Load a gaussian splat source and add it to the splat scene.
   * `options.anchor` (or the full `options.transform`) places it for BIM co-location.
   */
  async load(
    source: SplatSource | string,
    options?: {
      anchor?: THREE.Vector3;
      id?: string;
      /** Full TRS placement (dataset-local → world), e.g. a BIM-alignment matrix. Supersedes
       * `anchor`. Update later via {@link setTransform}. */
      transform?: THREE.Matrix4;
    },
  ): Promise<LoadedSplat> {
    if (!this._world) {
      throw new Error("SplatLoader: set `world` before calling load().");
    }
    if (!this._renderer()) {
      throw new Error("SplatLoader: the world's renderer is not a PostproductionRenderer.");
    }
    // Resolve the node material BEFORE any dataset is built: `mkSplatMaterial` is synchronous and
    // runs inside both renderers' constructors, so a dataset created while the import was still in
    // flight would get a GLSL material no WebGPU driver can compile.
    if ((this._renderer()!.three as any).isWebGPURenderer) {
      await prepareWebgpuSplats();
      this._webgpu = true;
    }
    const src: SplatSource = typeof source === "string" ? { url: source } : source;
    const manifestUrl = this._manifestUrl(src);
    const id =
      options?.id ?? src.url ?? src.lodUrls?.[0] ?? manifestUrl ?? `splat-${this._splats.size}`;

    // STREAMING path: build the out-of-core renderer from the manifest (no full CPU decode here —
    // chunks stream in on demand). Otherwise decode one or more levels in-core.
    let gsplat: ISplatRenderer;
    if (manifestUrl) {
      const baseUrl = manifestUrl.replace(/\/?lod-meta\.json$/, "");
      const fetcher = this._manifestFetchFn(src);
      this.remove(id);
      gsplat = await GSplatStream.create(baseUrl, fetcher, { budget: src.streamBudget });
    } else {
      // decode one or more levels → SplatData[] (Y-up flipped, covariance precomputed downstream)
      const datas = await this._decodeSource(src);
      if (!datas.length) throw new Error("SplatLoader: no splat data decoded from source.");
      this.remove(id); // replace any source already under this id
      gsplat = new GSplat(datas);
    }
    this._scene.add(gsplat.object);
    this._splats.set(id, gsplat);

    // placement (local→world) WITHOUT the global gaussianScale — that is composed on top in
    // _place(). A full transform supersedes the position-only anchor.
    const placement = options?.transform
      ? options.transform.clone()
      : new THREE.Matrix4().setPosition(options?.anchor ?? new THREE.Vector3());
    this._placements.set(id, placement);

    const anchor = new THREE.Vector3().setFromMatrixPosition(placement);
    const handle: LoadedSplat = {
      id,
      streamed: false,
      anchor,
      box: new THREE.Box3(),
      object: gsplat,
      get splatCount() {
        return gsplat.drawn;
      },
    };
    this.list.set(id, handle);
    this._place(id); // composes the matrix + fills handle.box
    this.onSplatLoaded.trigger(handle);
    return handle;
  }

  /** (Re)compose a dataset's object matrix from its stored placement (local→world) with the
   * global gaussianScale applied on top, then refresh its handle box. The single placement path. */
  private _place(id: string) {
    const g = this._splats.get(id);
    const placement = this._placements.get(id);
    if (!g || !placement) return;
    placement.decompose(g.object.position, g.object.quaternion, g.object.scale);
    g.object.scale.multiplyScalar(this._gaussianScale);
    g.object.updateMatrix();
    g.object.updateMatrixWorld(true);
    // Keep the crisp pick proxy locked to the same placement × gaussianScale.
    const col = this._collisions.get(id);
    if (col) {
      placement.decompose(col.position, col.quaternion, col.scale);
      col.scale.multiplyScalar(this._gaussianScale);
      col.updateMatrixWorld(true);
    }
    const handle = this.list.get(id);
    if (handle) {
      (handle.box as THREE.Box3)
        .setFromCenterAndSize(
          g.center,
          new THREE.Vector3(g.radius * 2, g.radius * 2, g.radius * 2),
        )
        .applyMatrix4(g.object.matrixWorld);
    }
  }

  /** Remove a loaded splat source and free it. */
  remove(id: string): void {
    const gsplat = this._splats.get(id);
    if (gsplat) {
      this._scene.remove(gsplat.object);
      gsplat.dispose();
      this._splats.delete(id);
    }
    this.removeCollisionProxy(id);
    this._placements.delete(id);
    this.list.delete(id);
  }

  /**
   * Set a dataset's full TRS placement (dataset-local → world), e.g. a BIM-alignment matrix.
   * With no `id`, applies to every loaded dataset. Updates the handle box too.
   */
  setTransform(matrix: THREE.Matrix4, id?: string): void {
    const apply = (key: string) => {
      if (!this._splats.has(key)) return;
      this._placements.set(key, matrix.clone());
      this._place(key);
    };
    if (id) apply(id);
    else for (const key of this._splats.keys()) apply(key);
  }

  /** The current placement matrix (local→world, WITHOUT the global gaussianScale) of a dataset
   * (defaults to the first loaded), or null. Symmetric with {@link setTransform}. */
  getTransform(id?: string): THREE.Matrix4 | null {
    const key = id ?? this._splats.keys().next().value;
    if (!key) return null;
    const p = this._placements.get(key);
    return p ? p.clone() : null;
  }

  /**
   * Attach a CRISP pick proxy to a loaded splat: a low-poly collision mesh (GLB,
   * from splat-transform `-K smooth`, in the splat's SOG frame). While a proxy is
   * attached, the FastModelPicker depth pass draws these opaque surfaces instead of
   * the fuzzy gaussian depth, so orbit anchors and measurements snap to a hard
   * surface. The proxy inherits the splat's placement × gaussianScale automatically.
   *
   * @param id - a loaded splat id.
   * @param source - the GLB as a URL or raw bytes (e.g. a platform hidden file the
   *   app has resolved to a signed URL / fetched).
   */
  async setCollisionProxy(
    id: string,
    source: { url?: string; bytes?: ArrayBuffer },
  ): Promise<void> {
    if (!this._splats.has(id)) throw new Error(`[splat] setCollisionProxy: no splat "${id}"`);
    if (!this._world) throw new Error("[splat] setCollisionProxy: no world");

    const loader = new GLTFLoader();
    const gltf = source.bytes
      ? await new Promise<any>((res, rej) =>
          loader.parse(source.bytes as ArrayBuffer, "", res, rej),
        )
      : await loader.loadAsync(source.url as string);
    const root = gltf.scene as THREE.Object3D;

    // Opaque depth-pack material (mesh variant of the point-cloud contributor): a
    // trivial vertex stage + the picker's shared `depthPackBody`, so the picker's
    // unpack decodes it exactly. ShaderMaterial (not Raw) for the injected
    // modelViewMatrix / projectionMatrix / position.
    const picker = this.components.get(OBC.FastModelPickers).get(this._world);
    const packBody = picker.depthPackBody;
    const depthMat = new THREE.ShaderMaterial({
      blending: THREE.NoBlending,
      depthTest: true,
      depthWrite: true,
      side: THREE.DoubleSide,
      vertexShader: /* glsl */ `
        precision highp float;
        void main(){ gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
      fragmentShader: /* glsl */ `
        precision highp float;
        void main(){ ${packBody} gl_FragColor = packedDepth; }`,
    });
    root.traverse((o: any) => {
      if (o.isMesh) { o.material = depthMat; o.frustumCulled = false; }
    });

    this.removeCollisionProxy(id); // replace any existing
    this._collisions.set(id, root);
    this._collisionScene.add(root);
    this._place(id); // apply placement × gaussianScale to the new proxy
  }

  /** Detach + dispose a splat's crisp pick proxy (falls back to gaussian depth). */
  removeCollisionProxy(id: string): void {
    const root = this._collisions.get(id);
    if (!root) return;
    this._collisionScene.remove(root);
    root.traverse((o: any) => {
      if (o.isMesh) { o.geometry?.dispose?.(); o.material?.dispose?.(); }
    });
    this._collisions.delete(id);
  }

  /** {@link OBC.Disposable.dispose} */
  dispose(): void {
    this._unwire();
    for (const id of [...this._splats.keys()]) this.remove(id);
    this._world = null;
    this.onSplatLoaded.reset();
    this.onDisposed.trigger();
    this.onDisposed.reset();
  }

  // ---------------------------------------------------------------------------
  // Decoding
  // ---------------------------------------------------------------------------

  /** A streaming manifest URL if the source is one: explicit `manifestUrl`, or a `url` ending in
   * `lod-meta.json`. Returns the manifest folder/file URL, else null (in-core path). */
  private _manifestUrl(src: SplatSource): string | null {
    if (src.manifestUrl) return src.manifestUrl;
    if (src.url && /lod-meta\.json$/.test(src.url)) return src.url;
    return null;
  }

  /** Adapt the optional requestManager into the `(url) => Promise<Response>` shape GSplatStream +
   * loadSOGChunkData expect (resolve URL → fetch), or undefined for plain `fetch`. */
  private _manifestFetchFn(
    src: SplatSource,
  ): ((url: string) => Promise<Response>) | undefined {
    const rm = src.requestManager;
    if (!rm) return undefined;
    return async (url: string) => rm.fetch(await rm.getUrl(url));
  }

  private async _decodeSource(src: SplatSource): Promise<SplatData[]> {
    const fetchBytes = async (url: string): Promise<Uint8Array> => {
      if (src.requestManager) {
        const resolved = await src.requestManager.getUrl(url);
        const res = await src.requestManager.fetch(resolved);
        return new Uint8Array(await res.arrayBuffer());
      }
      const res = await fetch(url);
      if (!res.ok) throw new Error(`fetch ${url} → HTTP ${res.status}`);
      return new Uint8Array(await res.arrayBuffer());
    };

    if (src.lodUrls?.length) {
      const out: SplatData[] = [];
      for (const u of src.lodUrls) out.push(this._decodeBytes(await fetchBytes(u)));
      return out;
    }
    if (src.fileBytes) return [this._decodeBytes(src.fileBytes)];
    if (src.url) return [this._decodeBytes(await fetchBytes(src.url))];
    return [];
  }

  /** Decode .ply / .compressed.ply / .fq bytes → SplatData (Y-up). Auto-detects our FQC1
   * flat-quant node blob by magic, else the compressed (chunk-packed) variant by
   * probing the header for an `element chunk`, else plain INRIA .ply. */
  private _decodeBytes(bytes: Uint8Array): SplatData {
    const buf = bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength);
    let data: SplatData;
    if (bytes.length >= 4 && bytes[0] === 0x46 && bytes[1] === 0x51 && bytes[2] === 0x43 && bytes[3] === 0x31) {
      data = parseFqChunk(buf); // "FQC1"
    } else {
      const head = new TextDecoder().decode(bytes.subarray(0, Math.min(bytes.length, 2048)));
      data = /element\s+chunk\s+\d+/.test(head) ? parseCompressedPly(buf) : parsePly(buf);
    }
    flipToYUp(data);
    return data;
  }

  // ---------------------------------------------------------------------------
  // Deferred-seam wiring
  // ---------------------------------------------------------------------------

  private _renderer(): PostproductionRenderer | null {
    const r = this._world?.renderer as any;
    if (r && r.postproduction && r.onBeforeUpdate) return r as PostproductionRenderer;
    return null;
  }

  private _wire() {
    if (this._wired) return;
    const renderer = this._renderer();
    if (!renderer) return;
    renderer.postproduction.addOcclusionPass(this._occlusion, false); // premultiplied LAYER seam
    this._registerPickContributor();
    this._wired = true;
  }

  private _unwire() {
    if (!this._wired) return;
    const renderer = this._renderer();
    if (renderer) renderer.postproduction.removeOcclusionPass(this._occlusion);
    this._unregisterPickContributor();
    this._wired = false;
  }

  /** Register the depth contributor with THIS world's FastModelPicker so the
   * dynamic camera anchor (which calls `picker.getPointAt`) can pick splats. */
  private _registerPickContributor() {
    if (!this._world || this._pickContributor) return;
    const picker = this.components.get(OBC.FastModelPickers).get(this._world);
    this._pickPicker = picker;
    this._pickContributor = ({ renderer, camera }) =>
      this._renderPickDepth(renderer, camera);
    picker.pickDepthContributors.add(this._pickContributor);
  }

  private _unregisterPickContributor() {
    if (this._pickPicker && this._pickContributor) {
      this._pickPicker.pickDepthContributors.delete(this._pickContributor);
    }
    this._pickPicker = null;
    this._pickContributor = null;
    for (const m of this._pickDepthMats.values()) m.dispose();
    this._pickDepthMats.clear();
  }

  /**
   * Depth-contributor render: draw the splat scene into the picker's target
   * (already bound + scissored) with a depth-pack material — the shared EWA vertex
   * stage (same reversed-Z centre depth as the display splats) + a fragment that
   * computes the gaussian coverage and discards the faint tails (`B < 0.5`), so
   * only each gaussian's solid front surface writes depth. depthTest+depthWrite
   * resolve occlusion (against BIM and between splats) without the display sort.
   * Per-mesh material swap so the mesh's own instanced draw + shared uniforms are
   * used; the picker restores render target / scissor / clear afterwards.
   */
  private _renderPickDepth(renderer: THREE.WebGLRenderer, camera: THREE.Camera) {
    if (!this._pickPicker || this._splats.size === 0) return;
    // ⚠️ NOT DONE UNDER WEBGPU, AND SAID RATHER THAN FAKED. The pick surface is the SAME EWA vertex stage
    // with a depth-PACKING fragment, and that pack body is GLSL the picker hands over as source.
    // Under WebGPU it would have to be a second node material fed by the picker's own node pack,
    // which is the picker's WebGPU work, not this one. Until then splats are drawn but not picked here;
    // a dataset with a collision proxy still picks through the proxy path below.
    if (this._webgpu && this._collisions.size === 0) return;

    // CRISP path: if any splat has a collision proxy, draw the opaque proxy surfaces
    // (already carrying their depth-pack material) instead of the fuzzy gaussian
    // depth. Depth-test resolves occlusion against BIM + earlier contributors.
    // (v1: proxies-present ⇒ proxies represent ALL splats here; a scene mixing
    // proxied + un-proxied splats would leave the un-proxied ones un-pickable.)
    if (this._collisions.size > 0) {
      this._collisionScene.updateMatrixWorld(true);
      renderer.render(this._collisionScene, camera);
      return;
    }

    const packBody = this._pickPicker.depthPackBody;
    // NO per-pick LOD/cull/sort: depth-test handles occlusion, so drawing the
    // last display frame's visible+sorted subset (mesh.instanceCount / aSlot are
    // already set) is exactly right. Cheaper, and it never disturbs the display's
    // sort cadence. Just make sure world matrices are current.
    this._scene.updateMatrixWorld(true);

    const swaps: Array<[THREE.Mesh, THREE.Material | THREE.Material[]]> = [];
    const live = new Set<string>();
    this._scene.traverse((child) => {
      if (!(child as THREE.Mesh).isMesh) return;
      const mesh = child as THREE.Mesh;
      const src = mesh.material as THREE.RawShaderMaterial;
      if (!src || !(src as any).uniforms) return;
      live.add(mesh.uuid);
      let depthMat = this._pickDepthMats.get(mesh.uuid);
      if (!depthMat) {
        // Share the display material's uniform OBJECTS (textures + per-frame
        // uViewport/uFocal/uMinPx) by reference so depth == what's drawn.
        depthMat = mkSplatDepthMaterial(src.uniforms, packBody);
        this._pickDepthMats.set(mesh.uuid, depthMat);
      }
      swaps.push([mesh, mesh.material]);
      mesh.material = depthMat;
    });

    renderer.render(this._scene, camera);

    for (const [mesh, mat] of swaps) mesh.material = mat;
    for (const [uuid, m] of this._pickDepthMats) {
      if (!live.has(uuid)) {
        m.dispose();
        this._pickDepthMats.delete(uuid);
      }
    }
  }

  /** Drive every dataset's LOD/cull/sort, then draw the splat scene into the deferred occlusion
   * layer (depth-tested against the borrowed BIM depth → BIM occludes the splats). Once per frame. */
  private _occlusion: OcclusionPass = (ctx) => {
    if (!this._enabled || this._splats.size === 0) return;
    const camera = ctx.camera as THREE.PerspectiveCamera;
    for (const g of this._splats.values()) {
      g.lodBase = this.lodQuality * g.radius; // global LOD-distance quality knob
      if (g.shBands) {
        g.shStrength = this.shStrength;
        g.shMaxDistance = this.shMaxDistance;
      }
      if (g.subPixelDetail !== undefined) {
        g.subPixelDetail = this.subPixelDetail;
        g.subPixelMinAlpha = this.subPixelMinAlpha;
      }
      g.setFrameUniforms(ctx.width, ctx.height, camera, this.minPixelSize);
      g.update(camera);
      // streaming datasets flush their pending partial-row texture uploads with the live renderer
      // (we only have a WebGLRenderer here) before the draw.
      g.flushUploads?.(ctx.renderer);
    }
    this._updateClipUniforms(camera);
    // 🔴 THE BIM DEPTH, HANDED TO THE MATERIAL RATHER THAN ATTACHED TO THE TARGET. WebGL lends the
    // capture's depth to the occlusion layer and lets the depth unit hide gaussians behind walls;
    // WebGPU cannot lend it, so the node material samples it and discards per fragment (see
    // `webgpu-splats.ts`). Re-read every frame because a resize reallocates it.
    if (this._webgpu) {
      const depth = (ctx as unknown as { sceneDepth?: THREE.Texture }).sceneDepth;
      if (depth) {
        this._scene.traverse((child) => {
          const u = ((child as THREE.Mesh).material as any)?.uniforms;
          if (u?.sceneDepth) u.sceneDepth.value = depth;
        });
      }
    }
    this._scene.updateMatrixWorld(true);
    ctx.renderer.setRenderTarget(ctx.target);
    ctx.renderer.render(this._scene, camera);
  };

  /**
   * Push the world's active section-clipping planes into every splat material as
   * VIEW-SPACE `uCutPlanes` (+ `uNumClip`), so gaussians are cut by the same planes
   * that cut BIM. The vertex stage culls a splat when its centre is on the clipped
   * side (splat-granular). Convention matches three's material clipping: store the
   * view-space plane as (−normal, constant) so the shader's `dot(viewPos, n) > w`
   * discards exactly the side three discards. Picks clip too (the pick depth material
   * shares these uniform objects). Runs once per frame; no allocation.
   */
  private _updateClipUniforms(camera: THREE.Camera) {
    const r = this._world?.renderer as unknown as {
      clippingPlanes?: THREE.Plane[];
      three?: { clippingPlanes?: THREE.Plane[] };
    } | undefined;
    const local = r?.clippingPlanes ?? [];
    const global = r?.three?.clippingPlanes ?? [];
    const planes = local.length ? local : global;
    const n = Math.min(planes.length, 8);
    for (let i = 0; i < n; i++) {
      const vp = this._scratchPlane.copy(planes[i]).applyMatrix4(camera.matrixWorldInverse);
      this._clipScratch[i].set(-vp.normal.x, -vp.normal.y, -vp.normal.z, vp.constant);
    }
    this._scene.traverse((child) => {
      const mat = (child as THREE.Mesh).material as THREE.RawShaderMaterial | undefined;
      const u = mat?.uniforms;
      if (!u?.uCutPlanes || !u.uNumClip) return;
      for (let i = 0; i < n; i++) (u.uCutPlanes.value[i] as THREE.Vector4).copy(this._clipScratch[i]);
      u.uNumClip.value = n;
    });
  }
}
