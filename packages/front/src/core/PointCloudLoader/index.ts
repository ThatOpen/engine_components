import * as THREE from "three";
import * as OBC from "@thatopen/components";
import { PostproductionRenderer } from "../PostproductionRenderer";
import type { OcclusionPass } from "../PostproductionRenderer";
import {
  prepareWebgpuPoints,
  createWebgpuPointMaterial,
  instancedPointGeometry,
} from "./webgpu-points";
import { writeVisibleNodeTable } from "./visible-node-table";

/**
 * A pluggable source for a point-cloud octree. The app supplies the URL and,
 * optionally, a request manager (e.g. a Range / signed-url adapter). Loaders stay
 * EXTERNAL to the loader: the component draws, the app decides how bytes are
 * fetched (local server, S3 Range, signed URLs…).
 */
export interface PointCloudSource {
  /** Base URL of the folder containing the Potree 2.0 `metadata.json`. */
  url: string;
  /** Metadata file name within `url`. Defaults to `"metadata.json"`. */
  metadata?: string;
  /** Optional fetch adapter: resolve URLs + perform the (Range) request. When
   * omitted, a plain `fetch` (cache: "no-store") relative to `url` is used. */
  requestManager?: PointCloudRequestManager;
}

/** The byte-fetching contract potree-core drives. App-supplied so the transport
 * (local server, S3 Range, signed-URL re-mint) is fully pluggable. */
export interface PointCloudRequestManager {
  getUrl(url: string): string | Promise<string>;
  fetch(input: RequestInfo | URL, init?: RequestInit): Promise<Response>;
}

/** Quality / performance knobs for point rendering. Live-settable; the loader
 * reads them per frame, so changes take effect on the next frame with no reload. */
export interface PointCloudSettings {
  /** Visible-point budget — the PRIMARY fps governor (fewer points = faster). */
  pointBudget: number;
  /** Min on-screen node size (px) used for LOD selection — the "detail" knob. */
  minNodePixelSize: number;
  /** Point over-size factor (the overdraw lever): ~1.0 perf .. 1.7 quality. */
  overlap: number;
  /** Max point size (px) clamp — caps the large-near-point overdraw tail. */
  maxSize: number;
  /** Eye-dome lighting: shades sparse points so they read as a lit surface. */
  edl: boolean;
  /** EDL darkening strength (only used while {@link edl} is on). */
  edlStrength: number;
  /** EDL neighbour-sample radius in px (only used while {@link edl} is on). */
  edlRadius: number;
  /** Point sprite shape. */
  shape: "circle" | "square";
  /** Dark-rim outline strength (0 = none). */
  outline: number;
}

/** Default quality settings — the measured "balanced" sweet spot (overlap 1.2,
 * ~1.5M budget = steady ~90fps + good coverage on a typical scan). */
export const defaultPointCloudSettings: PointCloudSettings = {
  pointBudget: 1_500_000,
  minNodePixelSize: 260,
  overlap: 1.2,
  maxSize: 50,
  edl: false,
  edlStrength: 0.4,
  edlRadius: 1.4,
  shape: "circle",
  outline: 0.18,
};

/** A loaded point cloud handle returned by {@link PointCloudLoader.load}. */
export interface LoadedPointCloud {
  readonly id: string;
  /**
   * The float64 world anchor the cloud was rebased to. Georeferenced clouds have
   * coordinates in the millions; the loader subtracts this anchor so the cloud
   * lives in a small local origin (no float32 cancellation). Share this anchor
   * with BIM so both sit in the same local space. If `load` wasn't given an
   * anchor, this is the cloud's own centre — align other data to it.
   */
  readonly anchor: THREE.Vector3;
  /** World-space bounding box of the (rebased) cloud — use it to frame the camera. */
  readonly box: THREE.Box3;
  /** Points currently selected/visible (changes each frame with LOD). */
  readonly visiblePointCount: number;
  /** The underlying potree-core point-cloud object. */
  readonly object: any;
}

/** Internal per-cloud state. */
interface CloudState {
  id: string;
  pco: any;
  anchor: THREE.Vector3;
  box: THREE.Box3;
  spacing: number;
  /** Wrapper THREE.Points by source-node uuid (mirrors potree's visible nodes). */
  wrappers: Map<string, THREE.Points>;
  /** Per-cloud visibility texture (the getLOD lookup the shader walks). */
  vnData: Uint8Array;
  vnTexture: THREE.DataTexture;
  /** Whether the cloud has been centred on its data centroid yet. The initial
   * load uses the metadata bbox centre (skewed by outliers); once the root node
   * streams in we refine to the robust point centroid. Skipped when the caller
   * passed an explicit anchor (they control placement). */
  centered: boolean;
}

const VN_W = 2048;

function nodeName(node: any): string {
  return node.geometryNode?.name ?? node.name ?? "r";
}
function nodeLevel(node: any): number {
  const gn = node.geometryNode || node;
  if (typeof gn.level === "number") return gn.level;
  return Math.max(0, nodeName(node).length - 1);
}

/**
 * Builds the tuned point ShaderMaterial: adaptive octree point sizing
 * (per-vertex `getLOD` walk over the visibility texture) with the overdraw lever
 * (`uOverlap`), max-size clamp, round/square shape, and a faded dark-rim outline.
 * DEFERRED variant: the fragment outputs OPAQUE alpha (=1) for the premultiplied
 * occlusion composite, or the linear eye-depth in alpha when feeding the EDL pass.
 */
/** The point uniforms schema — shared by the display material and the pick
 * depth-pack material so both size + place each point identically. */
function pointUniforms() {
  return {
    visibleNodes: { value: null as THREE.Texture | null },
    uOctreeSize: { value: 1 },
    uOctreeSpacing: { value: 1 },
    uScreenHeight: { value: 1 },
    fov: { value: 1 },
    // Orthographic camera: point size must be distance-INDEPENDENT (no perspective
    // foreshortening). uOrtho toggles the ortho sizing path; uOrthoWorldHeight is the
    // world-space height the viewport spans = (top-bottom)/zoom. Set per-frame.
    uOrtho: { value: 0 },
    uOrthoWorldHeight: { value: 1 },
    size: { value: 1 },
    smallestSize: { value: 2 },
    maxSize: { value: 50 },
    uOverlap: { value: 1.2 },
    uLevel: { value: 0 },
    uVNStart: { value: 0 },
    uCircle: { value: 1 },
    uOutline: { value: 0.18 },
    uEmitDepth: { value: 0 }, // 1 -> emit eye-depth in alpha for the EDL pass
    // Section clipping (view-space planes), updated per-frame by the loader. The pick
    // depth material shares this uniforms object by reference, so picks clip too.
    uCutPlanes: { value: Array.from({ length: 8 }, () => new THREE.Vector4()) },
    uNumClip: { value: 0 },
  };
}

/** The point vertex shader (adaptive octree sizing +`gl_PointSize`/`gl_Position`).
 * Factored out so the pick depth-pack material re-uses the EXACT same sizing +
 * placement — the depth surface is then identical to what's drawn on screen. */
const POINT_VERT = /* glsl */ `
      precision highp float;
      precision highp int;
      attribute vec4 rgba;
      uniform float uScreenHeight, fov, size, minSize, maxSize, uOverlap;
      uniform float uOctreeSpacing, uOctreeSize, uLevel, uVNStart;
      uniform float uOrtho, uOrthoWorldHeight;   // ortho camera: distance-independent sizing
      uniform sampler2D visibleNodes;
      uniform vec4 uCutPlanes[8];   // active section planes in VIEW space (xyz=normal, w=const)
      uniform int uNumClip;          // 0 = clipping off
      varying vec3 vColor;
      varying float vSize;
      varying float vViewZ;

      float rnd(float x){ return floor(x + 0.5); }
      vec3 rnd3(vec3 v){ return floor(v + 0.5); }
      int numberOfOnes(int number, int index){
        int numOnes = 0; int tmp = 128;
        for(int i = 7; i >= 0; i--){
          if(number >= tmp){ number = number - tmp; if(i <= index){ numOnes++; } }
          tmp = tmp / 2;
        }
        return numOnes;
      }
      bool isBitSet(int number, int index){
        int powi = 1;
        if(index == 1) powi = 2; else if(index == 2) powi = 4; else if(index == 3) powi = 8;
        else if(index == 4) powi = 16; else if(index == 5) powi = 32;
        else if(index == 6) powi = 64; else if(index == 7) powi = 128;
        int tmp = number / powi;
        return (tmp - (tmp / 2) * 2) == 1;
      }
      float getLOD(){
        vec3 offset = vec3(0.0);
        int iOffset = int(uVNStart);
        float depth = uLevel;
        for(float i = 0.0; i <= 30.0; i++){
          float nodeSizeAtLevel = uOctreeSize / pow(2.0, i + uLevel);
          vec3 index3d = (position - offset) / nodeSizeAtLevel;
          index3d = rnd3(index3d);
          int index = int(rnd(4.0 * index3d.x + 2.0 * index3d.y + index3d.z));
          vec4 value = texture2D(visibleNodes, vec2(float(iOffset) / 2048.0, 0.0));
          int mask = int(rnd(value.r * 255.0));
          if(isBitSet(mask, index)){
            int advanceG = int(rnd(value.g * 255.0)) * 256;
            int advanceB = int(rnd(value.b * 255.0));
            int advanceChild = numberOfOnes(mask, index - 1);
            iOffset = iOffset + advanceG + advanceB + advanceChild;
            depth = depth + 1.0;
          } else {
            float lodOffset = (255.0 * value.a) / 10.0 - 10.0;
            return depth + lodOffset;
          }
          offset = offset + (vec3(1.0) * nodeSizeAtLevel * 0.5) * index3d;
        }
        return depth;
      }
      void main(){
        vColor = rgba.rgb;
        vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
        // Section clipping: cull the point when it's on the clipped side of any active
        // plane (view-space; matches three's convention: discard dot(viewPos,n) > const).
        for (int ci = 0; ci < 8; ci++) {
          if (ci >= uNumClip) break;
          if (dot(mvPosition.xyz, uCutPlanes[ci].xyz) > uCutPlanes[ci].w) {
            gl_Position = vec4(0.0, 0.0, 2.0, 1.0); gl_PointSize = 0.0; return;
          }
        }
        gl_Position = projectionMatrix * mvPosition;
        vViewZ = -mvPosition.z;                         // linear eye distance (EDL alpha)
        // World→pixel scale for the point sprite. PERSPECTIVE: foreshortened (∝ 1/depth).
        // ORTHOGRAPHIC: distance-INDEPENDENT — a constant pixels-per-world-unit given by
        // the viewport height in pixels over the world height it spans. Using the
        // perspective factor under ortho makes far points shrink → the cloud looks sparse
        // and the adaptive LOD-size compensation (which rides on projFactor) breaks, so
        // node boundaries stop blending (the rectangular density seams).
        float projFactor;
        if (uOrtho > 0.5) {
          projFactor = uScreenHeight / uOrthoWorldHeight;
        } else {
          float slope = tan(fov / 2.0);
          projFactor = -0.5 * uScreenHeight / (slope * mvPosition.z);
        }
        float r = uOctreeSpacing * uOverlap;            // overdraw lever
        float lod = getLOD();
        float worldSpaceSize = size * r / pow(2.0, lod);
        float pointSize = worldSpaceSize * projFactor;
        pointSize = max(minSize, pointSize);
        pointSize = min(maxSize, pointSize);
        gl_PointSize = pointSize;
        vSize = pointSize;
      }`;

const POINT_FRAG = /* glsl */ `
      precision highp float;
      uniform float uCircle, uOutline, uEmitDepth;
      varying vec3 vColor;
      varying float vSize;
      varying float vViewZ;
      void main(){
        vec3 col = vColor;
        float r = length(gl_PointCoord - 0.5) * 2.0;
        if (uCircle > 0.5 && r > 1.0) discard;          // round points
        // Dark-rim outline is a RADIAL fade (uses r), so it only reads correctly on
        // ROUND points — on a square sprite it would draw a circle inside the quad.
        // Gate it on the round shape (+ a >0 strength so it's fully skippable).
        if (uCircle > 0.5 && uOutline > 0.0) {
          float ol = uOutline * smoothstep(3.0, 8.0, vSize);
          col = mix(col, col * 0.25, smoothstep(1.0 - ol, 1.0, r)); // dark rim (faded for small)
        }
        // uEmitDepth=1 (EDL pass): alpha = linear eye depth; uEmitDepth=0: OPAQUE alpha=1.
        gl_FragColor = vec4(col, uEmitDepth > 0.5 ? vViewZ : 1.0);
      }`;

function createPointMaterial(): THREE.ShaderMaterial {
  return new THREE.ShaderMaterial({
    blending: THREE.NoBlending,
    uniforms: pointUniforms(),
    vertexShader: POINT_VERT,
    fragmentShader: POINT_FRAG,
  });
}

/**
 * The PICK depth-pack material for points: same {@link POINT_VERT} (so points are
 * sized + placed identically to the display) but the picker's shared depth-pack
 * fragment, wrapped so the round-point `discard` is preserved (only the disc
 * writes depth, matching the visible sprite). Points are OPAQUE, so plain
 * depth-test + depth-write gives a clean surface. `uEmitDepth` is forced to 0 so
 * a wrapper cloned while EDL is on still packs window depth (not eye-Z).
 *
 * It is a {@link THREE.ShaderMaterial} (NOT the picker's RawShaderMaterial helper)
 * because POINT_VERT relies on three-injected `modelViewMatrix` / `projectionMatrix`
 * / `position` / the `rgba` attribute. The KEY invariant — the depth PACKING —
 * comes verbatim from `packBody` (the picker's `depthPackBody`, which declares
 * `vec4 packedDepth` from `gl_FragCoord.z`), so the picker's unpack decodes it
 * exactly. Clipping is left OFF (the point VERT never writes `vClipPosition`).
 */
function createPointDepthMaterial(
  packBody: string,
  uniforms: { [name: string]: THREE.IUniform },
): THREE.ShaderMaterial {
  return new THREE.ShaderMaterial({
    blending: THREE.NoBlending,
    depthTest: true,
    depthWrite: true,
    uniforms, // SAME references as the display material → per-frame updates propagate
    vertexShader: POINT_VERT,
    fragmentShader: /* glsl */ `
      precision highp float;
      uniform float uCircle;
      void main(){
        float r = length(gl_PointCoord - 0.5) * 2.0;
        if (uCircle > 0.5 && r > 1.0) discard;   // round points: match the visible disc
        ${packBody}
        gl_FragColor = packedDepth;
      }`,
  });
}

/**
 * Loads and streams out-of-core point clouds (Potree 2.0 octrees) and draws them
 * THROUGH the world's deferred {@link PostproductionRenderer}: points stream by LOD
 * and are drawn into the deferred occlusion seam, so they are correctly occluded by
 * BIM geometry with no shader patching. Georeferenced precision (float64 anchor) and
 * the tuned point material (adaptive sizing, overlap, max-size clamp, EDL) are
 * handled internally — the app just points it at an octree.
 *
 * `potree-core` is an OPTIONAL PEER DEPENDENCY — it is loaded lazily inside
 * {@link load}, so apps that never load point clouds don't need it installed.
 */
export class PointCloudLoader
  extends OBC.Component
  implements OBC.Disposable
{
  static uuid = "a1e6c3d2-7f4b-4a91-9c2e-3d5f8b0a6e14" as const;

  /** {@link OBC.Disposable.onDisposed} */
  readonly onDisposed = new OBC.Event();

  /** Fires once a cloud's root has streamed in and it's been anchored + measured. */
  readonly onCloudLoaded = new OBC.Event<LoadedPointCloud>();

  /** Loaded clouds, keyed by id. */
  readonly list = new Map<string, LoadedPointCloud>();

  /** Live quality / performance settings (see {@link PointCloudSettings}). */
  settings: PointCloudSettings = { ...defaultPointCloudSettings };

  private _world: OBC.World | null = null;
  private _enabled = true;
  private _wired = false;

  /** One Potree data layer drives all clouds (pointBudget is global). */
  private _potree: any = null;
  private readonly _clouds = new Map<string, CloudState>();
  /** Shared scene holding every cloud's wrapper points; drawn by the occlusion hook. */
  private readonly _scene = new THREE.Scene();
  // Section-clipping scratch (reused per-frame, no allocation).
  private readonly _clipScratch = Array.from({ length: 8 }, () => new THREE.Vector4());
  private readonly _scratchPlane = new THREE.Plane();
  /** Shared base material; each wrapper clones it (independent uniforms). */
  private readonly _matBase = createPointMaterial();

  /**
   * True once the WebGPU point road is ready to build materials. The two roads
   * are not a style choice: WebGPU has no `gl_PointSize`, so its points are
   * instanced quads (see `webgpu-points.ts`).
   */
  private _webgpuPoints = false;

  /** The renderer is a WebGPU one. Known at wiring time; see `_wire`. */
  private _webgpu = false;

  /**
   * Which seam the occlusion pass takes. Opaque points self-occlude in their own
   * depth, so DIRECT is both correct and cheaper; EDL needs the premultiplied
   * LAYER seam, because its shade pass writes transparent where no point landed.
   *
   * ⚠️ EDL IS THE WebGL ROAD ONLY. Its shade pass is a GLSL `ShaderMaterial` over
   * a render target whose depth is BORROWED from the capture, and neither exists
   * under WebGPU (the borrow is what the composition's overlay layers document as
   * impossible: the scene pass destroys its depth texture under any other target).
   * So the WebGPU road stays DIRECT whatever the setting says, and draws the
   * points unshaded rather than pretending to shade them.
   */
  private _directSeam() {
    return this._webgpu || !this.settings.edl;
  }

  // Depth contributor: makes points pickable by the world's FastModelPicker
  // (dynamic camera anchor). Registered in _wire, removed in _unwire; renders the
  // visible wrappers depth-packed into the picker's small scissor box each pick.
  private _pickPicker: OBC.FastModelPicker | null = null;
  private _pickContributor:
    | ((ctx: {
        renderer: THREE.WebGLRenderer;
        camera: THREE.Camera;
        target: THREE.WebGLRenderTarget;
        scissor: THREE.Vector4;
      }) => void)
    | null = null;
  /** Per-wrapper depth-pack material (uuid → material), sharing the wrapper's
   * display-material uniforms by reference so per-frame sizing stays current. */
  private readonly _pickDepthMats = new Map<string, THREE.ShaderMaterial>();

  // EDL (lazy): half-float RT for points + a fullscreen shade pass.
  private _edlRT: THREE.WebGLRenderTarget | null = null;
  private _edlMat: THREE.ShaderMaterial | null = null;
  private _edlScene: THREE.Scene | null = null;
  private _edlCam: THREE.OrthographicCamera | null = null;

  constructor(components: OBC.Components) {
    super(components);
    components.add(PointCloudLoader.uuid, this);
  }

  /**
   * The world this loader draws into. Setting it wires the per-frame LOD update
   * and registers the occlusion hook on the world's deferred renderer; clearing it
   * unwires both.
   */
  set world(value: OBC.World | null) {
    if (value === this._world) return;
    this._unwire();
    this._world = value;
    if (value && this._enabled) this._wire();
  }

  get world() {
    return this._world;
  }

  /** When false, the loader stops selecting LOD + drawing points (clouds stay loaded). */
  set enabled(value: boolean) {
    if (value === this._enabled) return;
    this._enabled = value;
    if (value && this._world) this._wire();
    else this._unwire();
  }

  get enabled() {
    return this._enabled;
  }

  /**
   * Load a Potree 2.0 octree and stream it into the world's deferred occlusion
   * seam. `options.anchor` rebases the cloud (share it with BIM so both live in one
   * small local origin); if omitted, the cloud's own centre is used and returned on
   * the {@link LoadedPointCloud} so the app can align other data to it.
   * `options.fitCamera` (default FALSE) frames the camera on the loaded cloud — off
   * by default so the loader never moves the app's camera unless asked.
   */
  async load(
    source: PointCloudSource | string,
    options?: { anchor?: THREE.Vector3; id?: string; fitCamera?: boolean },
  ): Promise<LoadedPointCloud> {
    if (!this._world) {
      throw new Error("PointCloudLoader: set `world` before calling load().");
    }
    const src: PointCloudSource =
      typeof source === "string" ? { url: source } : source;
    const id = options?.id ?? src.url;
    const baseUrl = src.url.endsWith("/") ? src.url : `${src.url}/`;
    const metaName = src.metadata ?? "metadata.json";
    const rm = src.requestManager ?? defaultRequestManager(baseUrl);

    // Lazy-load the optional peer dependency.
    const { Potree } = await import("potree-core");
    if (!this._potree) this._potree = new Potree();
    this._potree.pointBudget = this.settings.pointBudget;

    const pco = await this._potree.loadPointCloud(metaName, rm);

    pco.rotation.x = -Math.PI / 2; // Potree clouds are Z-up; the viewer is Y-up.
    pco.minNodePixelSize = this.settings.minNodePixelSize;
    pco.updateMatrixWorld(true);

    // FLOAT64 ANCHOR (the correct rebase). potree places the octree at its
    // georeferenced offset (million-scale world coords) → float32 cancellation AND
    // the cloud is off-frame (so it can't even stream until you look at the original
    // spot).
    //
    // `anchor` is a GEOGRAPHIC point: RAW LAS frame (Easting, Northing, height —
    // the same convention as `pco.position`'s own offset, and the convention any
    // caller-supplied `options.anchor` must use so it's directly comparable/
    // convertible via the source CRS). It is NEVER rotated — rotation only affects
    // how geometry renders, not what a real-world point's coordinates are.
    //
    // The RENDER offset subtracted from `pco.position` is a different vector: since
    // three composes `matrixWorld = position + rotation·localVertex`, landing
    // `anchor` at world (0,0,0) requires rotating its RAW-frame delta from
    // `pco.position` into the (already-applied) up-fix rotation first. Conflating
    // these two (subtracting `anchor` from `pco.position` directly, unrotated) was
    // the bug: it happened to look right for the default anchor (the octree box is
    // cubified, so its symmetric center survives either way) but silently broke for
    // any real, asymmetric caller-supplied anchor (e.g. a true LAS point centroid).
    const octreeBox = (pco.pcoGeometry.boundingBox as THREE.Box3).clone();
    const localCenter = octreeBox.getCenter(new THREE.Vector3());
    const originalPosition = pco.position.clone();
    const defaultAnchor = localCenter.clone().add(originalPosition);
    const anchor = options?.anchor ? options.anchor.clone() : defaultAnchor;
    const rotationOnly = new THREE.Matrix4().extractRotation(pco.matrixWorld);
    // `localAnchorPoint` is the anchor's delta from potree's own (huge, UTM-scale)
    // position, i.e. the small local-frame point that must render at world (0,0,0).
    // Landing it there means REPLACING position with -(R·localAnchorPoint), not
    // subtracting that small vector from the old huge position (which barely moves
    // it — the bug: subtracting the offset from the position left the cloud at UTM scale).
    const localAnchorPoint = anchor.clone().sub(originalPosition);
    pco.position.copy(localAnchorPoint).applyMatrix4(rotationOnly).negate();
    pco.updateMatrixWorld(true);

    const box = octreeBox.applyMatrix4(pco.matrixWorld);
    const spacing = pco.pcoGeometry?.spacing || 0;

    const vnData = new Uint8Array(VN_W * 4);
    const vnTexture = new THREE.DataTexture(
      vnData,
      VN_W,
      1,
      THREE.RGBAFormat,
      THREE.UnsignedByteType,
    );
    vnTexture.minFilter = THREE.NearestFilter;
    vnTexture.magFilter = THREE.NearestFilter;
    vnTexture.generateMipmaps = false;
    vnTexture.needsUpdate = true;

    const state: CloudState = {
      id,
      pco,
      anchor,
      box,
      spacing,
      wrappers: new Map(),
      vnData,
      vnTexture,
      centered: !!options?.anchor, // explicit anchor => caller controls placement
    };
    this.remove(id); // replace any cloud already under this id
    this._clouds.set(id, state);

    if (options?.fitCamera) this._fit(box);

    const handle: LoadedPointCloud = {
      id,
      anchor,
      box,
      object: pco,
      get visiblePointCount() {
        return pco.numVisiblePoints ?? 0;
      },
    };
    this.list.set(id, handle);
    this.onCloudLoaded.trigger(handle);
    return handle;
  }

  /** Remove a loaded cloud and free its wrappers + visibility texture. */
  remove(id: string): void {
    const state = this._clouds.get(id);
    if (state) {
      for (const w of state.wrappers.values()) {
        this._scene.remove(w);
        (w.material as THREE.Material).dispose();
      }
      state.wrappers.clear();
      state.vnTexture.dispose();
      this._clouds.delete(id);
    }
    this.list.delete(id);
  }

  /** {@link OBC.Disposable.dispose} */
  dispose(): void {
    this._unwire();
    for (const id of [...this._clouds.keys()]) this.remove(id);
    this._matBase.dispose();
    this._edlRT?.dispose();
    this._edlMat?.dispose();
    this._world = null;
    this._potree = null;
    this.onCloudLoaded.reset();
    this.onDisposed.trigger();
    this.onDisposed.reset();
  }

  // ---------------------------------------------------------------------------
  // Internals
  // ---------------------------------------------------------------------------

  private _renderer(): PostproductionRenderer | null {
    // Duck-type rather than `instanceof`: a published consumer always has a single
    // PostproductionRenderer, but mixed builds (our src example vs the dist bundle)
    // would make `instanceof` falsely fail. Any renderer exposing the deferred
    // occlusion hook + the per-frame event is what we need.
    const r = this._world?.renderer as any;
    if (r && r.postproduction && r.onBeforeUpdate) {
      return r as PostproductionRenderer;
    }
    return null;
  }

  /**
   * potree-core asks the renderer `capabilities.logarithmicDepthBuffer`, twice:
   * once per material update and once per EDL pass. `WebGPURenderer` has no
   * `capabilities` at all, so both reads threw and the cloud never drew — the
   * same shape as the EdgeProjector's `maxTextureSize` crash, except that read
   * is ours to guard and this one lives inside the dependency.
   *
   * So the answer is supplied here rather than the dependency patched. It is
   * `false` because it is TRUE: the WebGPU path has no logarithmic depth buffer,
   * and potree's shader branch for it would be wrong. Only the field potree
   * reads is defined, and only when the renderer has none — a fuller fake would
   * read as "this is a WebGL renderer" to anything else that sniffs it.
   */
  private static teachCapabilities(three: any) {
    if (!three || three.capabilities) return;
    three.capabilities = { logarithmicDepthBuffer: false };
  }

  private _wire() {
    if (this._wired) return;
    const renderer = this._renderer();
    if (!renderer) return;
    PointCloudLoader.teachCapabilities(renderer.three);
    // A WebGPU renderer has no `WEBGL_*` extensions object; that is the cheapest
    // honest tell, and it decides which point road the wrappers take.
    if ((renderer.three as any).isWebGPURenderer) {
      // Known SYNCHRONOUSLY, because the seam is registered right below and its
      // direct/layer flag is compiled into the pipeline. `_webgpuPoints` cannot
      // do it: it only turns on once the TSL module has loaded, which is a
      // frame or two later, and a wrong flag now means a remount later.
      this._webgpu = true;
      void prepareWebgpuPoints().then(() => {
        this._webgpuPoints = true;
      });
    }
    renderer.onBeforeUpdate.add(this._update);
    renderer.postproduction.addOcclusionPass(this._occlusion, this._directSeam());
    this._registerPickContributor();
    this._wired = true;
  }

  private _unwire() {
    if (!this._wired) return;
    const renderer = this._renderer();
    if (renderer) {
      renderer.onBeforeUpdate.remove(this._update);
      renderer.postproduction.removeOcclusionPass(this._occlusion);
    }
    this._unregisterPickContributor();
    this._wired = false;
  }

  /** Register the depth contributor with THIS world's FastModelPicker so the
   * dynamic camera anchor (which calls `picker.getPointAt`) can pick points. */
  private _registerPickContributor() {
    if (!this._world || this._pickContributor) return;
    const picker = this.components.get(OBC.FastModelPickers).get(this._world);
    this._pickPicker = picker;
    this._pickContributor = ({ renderer }) => this._renderPickDepth(renderer);
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
   * Depth-contributor render: re-draw the currently-visible point wrappers into
   * the picker's target (already bound + scissored by the picker) with each
   * wrapper's depth-pack material. The pack fragment is the picker's own
   * `depthPackBody`, so the packed depth decodes identically to the BIM depth;
   * opaque points → plain depth-test/-write picks the nearest surface. We render
   * each wrapper individually (a temp single-object pass) so per-node uniforms —
   * held on each wrapper's shared display-material uniform objects — are correct.
   * The picker restores render target / scissor / clear afterwards.
   */
  private _renderPickDepth(renderer: THREE.WebGLRenderer) {
    if (!this._pickPicker || this._clouds.size === 0) return;
    const camera = this._world?.camera.three;
    if (!camera) return;
    const packBody = this._pickPicker.depthPackBody;
    const live = new Set<string>();
    for (const state of this._clouds.values()) {
      for (const w of state.wrappers.values()) {
        if (!w.visible) continue;
        live.add(w.uuid);
        let depthMat = this._pickDepthMats.get(w.uuid);
        if (!depthMat) {
          // Share the wrapper's display-material uniform OBJECTS by reference so
          // uLevel / uVNStart / sizing stay in lockstep with what's on screen.
          const u = (w.material as THREE.ShaderMaterial).uniforms;
          depthMat = createPointDepthMaterial(packBody, u);
          this._pickDepthMats.set(w.uuid, depthMat);
        }
        const original = w.material;
        w.material = depthMat;
        // Render just this wrapper: the picker's scissor + target binding are
        // still active, so this writes packed depth into the read pixel only.
        renderer.render(w, camera);
        w.material = original;
      }
    }
    // Drop depth materials for wrappers that no longer exist.
    for (const [uuid, m] of this._pickDepthMats) {
      if (!live.has(uuid)) {
        m.dispose();
        this._pickDepthMats.delete(uuid);
      }
    }
  }

  /** Per-frame: select LOD for every cloud, mirror visible nodes, apply settings. */
  private _update = () => {
    if (!this._enabled || !this._world || this._clouds.size === 0) return;
    const potree = this._potree;
    const renderer = this._renderer();
    if (!potree || !renderer) return;

    potree.pointBudget = this.settings.pointBudget;
    renderer.postproduction.setOcclusionDirect(this._occlusion, this._directSeam());

    const camera = this._world.camera.three as
      | THREE.PerspectiveCamera
      | THREE.OrthographicCamera;
    const pcos: any[] = [];
    for (const state of this._clouds.values()) {
      state.pco.minNodePixelSize = this.settings.minNodePixelSize;
      pcos.push(state.pco);
    }
    potree.updatePointClouds(pcos, camera, renderer.three);
    for (const state of this._clouds.values()) this._syncCloud(state, camera);
    this._applySettings();
  };

  /** Mirror a cloud's potree visible nodes into wrapper THREE.Points in `_scene`. */
  private _syncCloud(
    state: CloudState,
    camera: THREE.PerspectiveCamera | THREE.OrthographicCamera,
  ) {
    const { pco } = state;
    pco.updateMatrixWorld(true);
    if (!state.centered) this._centerOnCentroid(state);
    const vis = (pco.visibleNodes || []) as any[];
    const offsets = this._buildVisibilityTexture(state, vis);
    const tmp = new THREE.Vector3();
    const octreeSize = (pco.pcoGeometry?.boundingBox as THREE.Box3).getSize(tmp).x;
    const fovRad = THREE.MathUtils.degToRad(
      (camera as THREE.PerspectiveCamera).fov ?? 60,
    );
    // Orthographic camera → distance-independent point sizing. The world height the
    // viewport spans is (top-bottom)/zoom; the shader turns it into pixels-per-world-unit.
    const ortho = (camera as THREE.OrthographicCamera).isOrthographicCamera === true;
    const oc = camera as THREE.OrthographicCamera;
    const orthoWorldHeight = ortho ? (oc.top - oc.bottom) / (oc.zoom || 1) : 1;
    const live = new Set<string>();
    for (const node of vis) {
      const o = node.sceneNode;
      if (!o || !o.geometry?.attributes?.rgba) continue;
      live.add(o.uuid);
      let w = state.wrappers.get(o.uuid);
      if (!w) {
        // TWO ROADS, and the difference is the object, not just the material:
        // three's `PointsNodeMaterial` only expands sized quads when what it
        // draws is NOT a `THREE.Points` (WebGPU has no `gl_PointSize`).
        const m = this._webgpuPoints
          ? createWebgpuPointMaterial(state.vnTexture)
          : this._matBase.clone();
        m.uniforms.visibleNodes.value = state.vnTexture;
        m.uniforms.uOctreeSpacing.value = state.spacing;
        w = (
          this._webgpuPoints
            ? new THREE.Mesh(instancedPointGeometry(o.geometry), m)
            : new THREE.Points(o.geometry, m)
        ) as unknown as THREE.Points;
        w.matrixAutoUpdate = false;
        w.frustumCulled = false; // reversed-Z deferred camera: three's cull is unreliable
        state.wrappers.set(o.uuid, w);
        this._scene.add(w);
      }
      const u = (w.material as THREE.ShaderMaterial).uniforms;
      u.uOctreeSize.value = octreeSize;
      u.fov.value = fovRad;
      u.uOrtho.value = ortho ? 1 : 0;
      u.uOrthoWorldHeight.value = orthoWorldHeight;
      u.uLevel.value = nodeLevel(node);
      u.uVNStart.value = offsets.get(node) ?? 0;
      w.matrix.copy(o.matrixWorld);
      w.matrixWorldNeedsUpdate = true;
    }
    for (const [uuid, w] of state.wrappers) {
      if (!live.has(uuid)) {
        this._scene.remove(w);
        (w.material as THREE.Material).dispose();
        state.wrappers.delete(uuid);
      }
    }
  }

  /**
   * One-time refinement: shift the cloud so its ROBUST DATA CENTROID lands at the
   * origin. The initial load anchored to the metadata bbox centre, which is skewed
   * by outlier points (sky/noise) — the root node's point centroid is barely moved
   * by a few outliers, so it's the true visual centre. Runs once the root node has
   * streamed in; updates the reported anchor + box accordingly.
   */
  private _centerOnCentroid(state: CloudState) {
    const { pco } = state;
    let root: any = null;
    for (const n of (pco.visibleNodes || []) as any[]) {
      if (nodeLevel(n) === 0 && n.sceneNode?.geometry?.attributes?.position) {
        root = n.sceneNode;
        break;
      }
    }
    if (!root) root = (pco.visibleNodes || [])[0]?.sceneNode;
    if (!root?.geometry?.attributes?.position?.count) return; // not streamed yet

    root.updateMatrixWorld(true);
    const pos = root.geometry.attributes.position;
    const v = new THREE.Vector3();
    const centroid = new THREE.Vector3();
    for (let i = 0; i < pos.count; i++) {
      v.fromBufferAttribute(pos, i).applyMatrix4(root.matrixWorld);
      centroid.add(v);
    }
    centroid.multiplyScalar(1 / pos.count);

    pco.position.sub(centroid); // shift the data centroid to the origin (render frame — fine as-is)
    pco.updateMatrixWorld(true);
    // `centroid` is in the RENDER (rotated, Y-up) frame; `state.anchor` is a
    // GEOGRAPHIC point (raw LAS frame — see `load()`). Rotate it back before
    // folding it in, or this silently swaps magnitudes between height and
    // Northing (the same bug class fixed in `load()`).
    const rotationOnly = new THREE.Matrix4().extractRotation(pco.matrixWorld);
    const geoCentroidDelta = centroid.clone().applyMatrix4(rotationOnly.clone().invert());
    state.anchor.add(geoCentroidDelta);
    state.box.translate(centroid.clone().negate());
    state.centered = true;
  }

  /** The visibility texture: per-node visible-child bitmask + child
   * offset + density lodOffset, sorted breadth-first; the shader walks it for the
   * per-point deepest LOD. */
  private _buildVisibilityTexture(
    state: CloudState,
    nodes: any[],
  ): Map<any, number> {
    const { vnData, vnTexture } = state;
    const offsets = writeVisibleNodeTable(
      nodes,
      vnData,
      nodeName,
      (node) => node.geometryNode?.density,
    );
    vnTexture.needsUpdate = true;
    return offsets;
  }

  /** Write live settings into the base material + every wrapper clone. */
  private _applySettings() {
    const s = this.settings;
    const apply = (u: any) => {
      u.maxSize.value = s.maxSize;
      u.uOverlap.value = s.overlap;
      u.uCircle.value = s.shape === "circle" ? 1 : 0;
      u.uOutline.value = s.outline;
      // Alpha carries the eye depth for the EDL shade pass. Under WebGPU there is
      // no such pass (`_directSeam`), and an alpha holding metres instead of
      // coverage would make the composite blend the points by their distance.
      u.uEmitDepth.value = s.edl && !this._webgpu ? 1 : 0;
    };
    apply(this._matBase.uniforms);
    for (const state of this._clouds.values()) {
      for (const w of state.wrappers.values()) {
        apply((w.material as THREE.ShaderMaterial).uniforms);
      }
    }
  }

  /**
   * Fill `_clipScratch` with the world's active section-clipping planes in VIEW space
   * and return the count (≤8). Convention matches three's material clipping: store the
   * view-space plane as (−normal, constant) so the shader's `dot(viewPos,n) > w` discards
   * exactly the side three discards — so points are cut by the same planes that cut BIM.
   */
  private _computeClipPlanes(camera: THREE.Camera): number {
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
    return n;
  }

  /** The occlusion hook: draw the points into the deferred seam (borrowed BIM depth,
   * reversed-Z). Direct = opaque points straight in; EDL = points -> half-float RT
   * (alpha = eye-Z), then a shade pass composited into the seam. */
  private _occlusion: OcclusionPass = (ctx) => {
    const nClip = this._computeClipPlanes(ctx.camera);
    for (const state of this._clouds.values()) {
      for (const w of state.wrappers.values()) {
        const u = (w.material as THREE.ShaderMaterial).uniforms;
        u.uScreenHeight.value = ctx.height;
        for (let i = 0; i < nClip; i++) (u.uCutPlanes.value[i] as THREE.Vector4).copy(this._clipScratch[i]);
        u.uNumClip.value = nClip;
      }
    }
    if (this._directSeam()) {
      ctx.renderer.render(this._scene, ctx.camera);
      return;
    }
    const rt = this._ensureEdl(ctx.width, ctx.height, ctx.depth);
    const gl = ctx.renderer.getContext() as WebGL2RenderingContext;
    ctx.renderer.setRenderTarget(rt);
    gl.clearBufferfv(gl.COLOR, 0, [0, 0, 0, 0]); // clear colour only; keep borrowed BIM depth
    ctx.renderer.render(this._scene, ctx.camera);
    const edlMat = this._edlMat!;
    edlMat.uniforms.uColor.value = rt.texture;
    edlMat.uniforms.uDrawnPixels.value.set(ctx.width, ctx.height);
    edlMat.uniforms.uStrength.value = this.settings.edlStrength;
    edlMat.uniforms.uRadius.value = this.settings.edlRadius;
    ctx.renderer.setRenderTarget(ctx.target);
    ctx.renderer.render(this._edlScene!, this._edlCam!);
  };

  private _ensureEdl(
    w: number,
    h: number,
    depth: THREE.DepthTexture,
  ): THREE.WebGLRenderTarget {
    if (!this._edlMat) {
      this._edlMat = new THREE.ShaderMaterial({
        blending: THREE.NoBlending,
        depthTest: false,
        depthWrite: false,
        transparent: true,
        uniforms: {
          uColor: { value: null as THREE.Texture | null },
          uDrawnPixels: { value: new THREE.Vector2(1, 1) },
          uStrength: { value: this.settings.edlStrength },
          uRadius: { value: this.settings.edlRadius },
        },
        vertexShader: /* glsl */ `
          varying vec2 vUv;
          void main(){ vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }`,
        fragmentShader: /* glsl */ `
          precision highp float;
          uniform sampler2D uColor; uniform vec2 uDrawnPixels;
          uniform float uStrength, uRadius;
          varying vec2 vUv;
          void main(){
            vec4 c = texture2D(uColor, vUv);
            if (c.a <= 0.0) { gl_FragColor = vec4(0.0); return; } // no point -> transparent
            float lz = log2(c.a);
            vec2 px = uRadius / uDrawnPixels;
            float resp = 0.0; float n = 0.0;
            for (int i = 0; i < 4; i++) {
              vec2 o = i == 0 ? vec2(1.,0.) : i == 1 ? vec2(-1.,0.) : i == 2 ? vec2(0.,1.) : vec2(0.,-1.);
              float za = texture2D(uColor, vUv + o * px).a;
              if (za <= 0.0) continue;
              resp += max(0.0, lz - log2(za)); n += 1.0;
            }
            resp = n > 0.0 ? resp / n : 0.0;
            float shade = exp(-resp * uStrength * 300.0);
            gl_FragColor = vec4(c.rgb * shade, 1.0);        // OPAQUE where points exist
          }`,
      });
      this._edlScene = new THREE.Scene();
      this._edlCam = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
      this._edlScene.add(
        new THREE.Mesh(new THREE.PlaneGeometry(2, 2), this._edlMat),
      );
    }
    if (this._edlRT && this._edlRT.width === w && this._edlRT.height === h) {
      this._edlRT.depthTexture = depth; // re-borrow (capture may have realloc'd)
      return this._edlRT;
    }
    if (this._edlRT) {
      this._edlRT.depthTexture = null as unknown as THREE.DepthTexture;
      this._edlRT.dispose();
    }
    this._edlRT = new THREE.WebGLRenderTarget(w, h, {
      type: THREE.HalfFloatType, // alpha holds eye-Z in metres (unbounded)
      format: THREE.RGBAFormat,
      minFilter: THREE.NearestFilter,
      magFilter: THREE.NearestFilter,
      depthBuffer: true,
    });
    this._edlRT.depthTexture = depth; // BORROW the BIM depth so points occlude correctly
    return this._edlRT;
  }

  /** Frame the camera on a cloud's bounding box (sets near/far + fits the controls). */
  private _fit(box: THREE.Box3) {
    const world = this._world;
    if (!world) return;
    const camera = world.camera.three as
      | THREE.PerspectiveCamera
      | THREE.OrthographicCamera;
    const center = box.getCenter(new THREE.Vector3());
    const size = box.getSize(new THREE.Vector3());
    const r = Math.max(size.x, size.y, size.z) || 10;
    if ((camera as THREE.PerspectiveCamera).isPerspectiveCamera) {
      camera.near = r / 1000;
      camera.far = r * 100;
      camera.updateProjectionMatrix();
    }
    const controls = (world.camera as any).controls;
    if (controls?.fitToBox) {
      controls.fitToBox(box, true);
    } else if (controls?.setLookAt) {
      controls.setLookAt(
        center.x + r * 0.7,
        center.y + r * 0.7,
        center.z + r * 0.7,
        center.x,
        center.y,
        center.z,
        true,
      );
    }
  }
}

/** Default transport: resolve URLs relative to `baseUrl`, fetch with cache bypass
 * (potree-core's Range requests throw the browser's ERR_CACHE_OPERATION_NOT_SUPPORTED
 * when they hit the HTTP cache). */
function defaultRequestManager(baseUrl: string): PointCloudRequestManager {
  return {
    getUrl(url: string) {
      return baseUrl + url;
    },
    fetch(input: RequestInfo | URL, init?: RequestInit) {
      return fetch(input, { ...(init || {}), cache: "no-store" });
    },
  };
}
