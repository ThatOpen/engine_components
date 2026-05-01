import * as THREE from "three";
import { Components } from "../../Components";
import { Component, Event, World, Disposable } from "../../Types";
import { Mouse } from "../../Raycasters/src/mouse";
import { FragmentsManager } from "../../../fragments";

/**
 * GPU-readback picker that identifies what's under a screen position
 * without going through the worker raycast. Two granularities, same
 * render pass:
 *
 * - {@link getModelAt} returns the model id under the cursor.
 * - {@link getItemAt} returns the item itself (`modelId` + `localId`).
 *
 * The fragments tile geometry already carries a per-vertex `id`
 * attribute (the internal item id). We render the BIM scene to an
 * offscreen target with a shader that packs `(modelByte, itemId)` into
 * RGBA, then `readPixels` at the cursor and decode. One render plus
 * one 4-byte readback per call. No worker round-trip for the model
 * lookup; the first time we resolve a given `itemId` to a `localId`
 * we ask the worker, and afterwards that lookup is cached.
 *
 * Encoding (one pixel):
 *   R = modelByte (1..254, 0 = void / unwritten)
 *   G = (itemId >> 16) & 0xff
 *   B = (itemId >> 8)  & 0xff
 *   A = (itemId)       & 0xff
 *
 * `modelByte` is assigned per-pick from a `byteToModelId` map; the
 * picker re-allocates bytes each call so the assignment is stable for
 * the duration of the pick but doesn't grow over the session.
 */
export class FastModelPicker implements Disposable {
  /** {@link Component.enabled} */
  enabled = true;

  /** Components instance this picker belongs to. */
  components: Components;

  /** {@link Disposable.onDisposed} */
  readonly onDisposed = new Event();

  /** Position helper bound to the world's canvas. */
  readonly mouse: Mouse;

  /** World this picker renders against. */
  world: World;

  /**
   * When `true`, mirrors the id render to a debug canvas pinned in the
   * top-right corner. Each model shows up as a near-uniform red band
   * (the model byte) modulated by varying greens / blues from the
   * per-item id encoding.
   */
  debugMode = false;

  /**
   * Maximum models the picker can disambiguate in a single pick. Capped
   * by the 8-bit `modelByte`. In practice we never approach this.
   */
  static readonly MAX_MODELS = 254;

  private _renderTarget?: THREE.WebGLRenderTarget;
  private _renderTargetSize = new THREE.Vector2();

  private _debugCanvas?: HTMLCanvasElement;
  private _debugContainer?: HTMLDivElement;

  /**
   * Single shared shader for the id pass. The same program runs across
   * every model; we flip the `modelByte` uniform between per-model
   * render passes inside one pick to disambiguate which model owns a
   * pixel.
   */
  private _idMaterial: THREE.ShaderMaterial;

  /**
   * Depth-encoding shader used by {@link getPointAt}. Written via
   * `scene.overrideMaterial` for one render of the BIM scene, packs
   * `gl_FragCoord.z` into the four bytes of the color attachment using
   * three's `packing` chunk. The packed value is robust to round-trip
   * through an `UNSIGNED_BYTE` target.
   */
  private _depthMaterial: THREE.ShaderMaterial;

  /**
   * World-space normal-encoding shader used by {@link getNormalAt}.
   * Writes `(normal * 0.5 + 0.5)` into RGB, alpha = 1. Decode side maps
   * `(rgb * 2 - 1)` and renormalizes. Naive packing wastes alpha and
   * gives ~1° precision per axis, which is plenty for surface
   * alignment, orbit-around-clicked-point, and snapping. Octahedral
   * packing would buy us another bit per axis but isn't worth the
   * complexity until a consumer actually needs sub-degree accuracy.
   */
  private _normalMaterial: THREE.ShaderMaterial;

  /**
   * Cached original materials for the swap-render-restore pass.
   * Populated in {@link applyIdMaterial}, drained in
   * {@link restoreOriginalMaterials} after the render.
   */
  private _originalMaterials = new Map<
    THREE.Mesh,
    THREE.Material | THREE.Material[]
  >();

  /**
   * LOD line meshes don't carry the per-vertex `id` attribute and would
   * write whatever color their normal shader produces into the id
   * buffer, faking hits. Hidden for the duration of the id render and
   * restored after.
   */
  private _hiddenLods: THREE.Object3D[] = [];


  constructor(components: Components, world: World) {
    if (!world.renderer) {
      throw new Error("A renderer is needed for the FastModelPicker to work!");
    }
    this.world = world;
    this.mouse = new Mouse(world.renderer.three.domElement);
    this.components = components;
    this._idMaterial = this.buildIdMaterial();
    this._depthMaterial = this.buildDepthMaterial();
    this._normalMaterial = this.buildNormalMaterial();
    this.setupRenderTarget();
  }

  /**
   * Returns the model id under the given screen position, or `null` if
   * the cursor is over empty space.
   *
   * Cheaper than {@link getItemAt} because we don't resolve the
   * `localId`; we just read the model byte from the same render.
   *
   * @param position - Normalized device coords. Defaults to the
   *   picker's last known mouse position.
   */
  async getModelAt(position?: THREE.Vector2): Promise<string | null> {
    const result = await this.runIdPass(position);
    if (!result) return null;
    return result.modelId;
  }

  /**
   * Returns `{ modelId, localId }` for the item under the given screen
   * position, or `null` if the cursor is over empty space.
   *
   * Pure main-thread resolution: fragments now stores the user-facing
   * `localId` directly in each tile's per-vertex `id` attribute, so
   * the encoded RGBA pixel decodes straight to the localId. No worker
   * round-trip, no cache.
   *
   * @param position - Normalized device coords. Defaults to the
   *   picker's last known mouse position.
   */
  async getItemAt(
    position?: THREE.Vector2,
  ): Promise<{ modelId: string; localId: number } | null> {
    const result = await this.runIdPass(position);
    if (!result) return null;
    return { modelId: result.modelId, localId: result.itemId };
  }

  /**
   * Returns the world-space point under the given screen position, or
   * `null` if the cursor is over empty space.
   *
   * Renders the BIM scene with a depth-encoding override material that
   * packs `gl_FragCoord.z` into the color buffer, reads four bytes at
   * the cursor pixel, and unprojects through the camera matrices to a
   * world point. One render pass, one 4-byte readback, no worker
   * round-trip. Useful for things like "set camera orbit center to
   * what the user just clicked on".
   *
   * Cheaper than {@link getItemAt} because we don't differentiate
   * models — one render covers the whole BIM scene at once. We don't
   * resolve any item id either.
   *
   * @param position - Normalized device coords. Defaults to the
   *   picker's last known mouse position.
   */
  async getPointAt(
    position?: THREE.Vector2,
  ): Promise<THREE.Vector3 | null> {
    if (!this.enabled) return null;
    if (!this._renderTarget || !this.world.renderer) return null;

    const fragments = this.components.get(FragmentsManager);
    if (!fragments.initialized || fragments.list.size === 0) return null;

    this.renderDepthPass();

    const pos = position ?? this.mouse.position;
    const pixel = this.readPixelAt(pos);
    if (!pixel) return null;
    if (
      pixel[0] === 0 &&
      pixel[1] === 0 &&
      pixel[2] === 0 &&
      pixel[3] === 0
    ) {
      return null; // cleared / void — nothing was drawn here
    }

    const depth = unpackDepthFromRGBA(pixel);
    // depth ≈ 1 means the far plane: nothing in front of the camera at
    // that pixel. Treat as void rather than returning a point on the
    // far plane.
    if (depth >= 1.0 - 1e-6) return null;

    return unprojectToWorld(pos, depth, this.world.camera.three);
  }

  /**
   * Returns the world-space surface normal under the cursor, or `null`
   * if the cursor is over empty space.
   *
   * Mirrors {@link getPointAt}'s structure: one `scene.overrideMaterial`
   * render with the normal-encoding shader, one 4-byte readback,
   * decode and renormalize.
   */
  async getNormalAt(
    position?: THREE.Vector2,
  ): Promise<THREE.Vector3 | null> {
    if (!this.enabled) return null;
    if (!this._renderTarget || !this.world.renderer) return null;
    const fragments = this.components.get(FragmentsManager);
    if (!fragments.initialized || fragments.list.size === 0) return null;

    this.renderNormalPass();

    const pos = position ?? this.mouse.position;
    const pixel = this.readPixelAt(pos);
    if (!pixel) return null;
    if (pixel[3] === 0) return null; // void pixel — nothing rendered here

    const x = (pixel[0] / 255) * 2 - 1;
    const y = (pixel[1] / 255) * 2 - 1;
    const z = (pixel[2] / 255) * 2 - 1;
    const n = new THREE.Vector3(x, y, z);
    if (n.lengthSq() < 1e-8) return null;
    return n.normalize();
  }

  /**
   * One-shot pick that produces the full result shape consumers need:
   * `{ modelId, localId, point, normal, distance }`. Routes through the
   * three GPU passes (id, depth, normal) and composes the output. No
   * worker round-trip.
   *
   * Returns `null` if the cursor is over empty space, the id pass
   * decodes to the void sentinel, or the depth round-trip yields the
   * far plane.
   */
  async getFullPick(position?: THREE.Vector2): Promise<{
    modelId: string;
    localId: number;
    point: THREE.Vector3;
    normal: THREE.Vector3 | null;
    distance: number;
  } | null> {
    const item = await this.getItemAt(position);
    if (!item) return null;
    const point = await this.getPointAt(position);
    if (!point) return null;
    const normal = await this.getNormalAt(position);
    const distance = point.distanceTo(this.world.camera.three.position);
    return { ...item, point, normal, distance };
  }

  /**
   * Toggle the debug overlay. When enabled the picker mirrors its id
   * render to a small canvas pinned in the top-right corner so you can
   * see what the readback sees.
   */
  setDebugMode(enabled: boolean) {
    this.debugMode = enabled;
    if (enabled) this.setupDebugCanvas();
    else this.removeDebugCanvas();
  }

  /** {@link Disposable.dispose} */
  dispose() {
    this.mouse.dispose();
    this.removeDebugCanvas();
    this._idMaterial.dispose();
    this._depthMaterial.dispose();
    this._normalMaterial.dispose();
    if (this._renderTarget) this._renderTarget.dispose();
    this._renderTarget = undefined;
    this._originalMaterials.clear();
    this._hiddenLods.length = 0;
    this.onDisposed.trigger();
    this.onDisposed.reset();
  }

  // ---------------------------------------------------------------------------
  // Shared pick path
  // ---------------------------------------------------------------------------

  /**
   * Runs the id render and returns the raw decoded `(modelId, itemId)`
   * for the cursor pixel. Both public entry points lean on this.
   */
  private async runIdPass(
    position?: THREE.Vector2,
  ): Promise<{ modelId: string; itemId: number } | null> {
    if (!this.enabled) return null;
    if (!this._renderTarget || !this.world.renderer) return null;

    const fragments = this.components.get(FragmentsManager);
    if (!fragments.initialized || fragments.list.size === 0) return null;

    const byteToModel = this.applyIdMaterial();
    if (byteToModel.size === 0) {
      // Nothing to render; restore (in case anything was hidden) and bail.
      this.restoreOriginalMaterials();
      return null;
    }

    this.renderIdPass(byteToModel);
    this.restoreOriginalMaterials();

    if (this.debugMode && this._debugCanvas) this.updateDebugCanvas();

    const pos = position ?? this.mouse.position;
    const pixel = this.readPixelAt(pos);
    if (!pixel) return null;

    const modelByte = pixel[0];
    if (modelByte === 0) return null; // void

    const modelId = byteToModel.get(modelByte);
    if (!modelId) return null;

    // eslint-disable-next-line no-bitwise
    const itemId = (pixel[1] << 16) | (pixel[2] << 8) | pixel[3];
    // 0 is the sentinel fragments writes for samples whose two-step
    // localId lookup misses (no `meshes_items` entry, or `local_ids`
    // returns null). Treat decoded 0 as void rather than a real pick.
    if (itemId === 0) return null;
    return { modelId, itemId };
  }

  /**
   * Walks every fragments model. For each shell mesh that carries the
   * per-vertex `id` attribute, stashes the original material and swaps
   * in the shared id-encoding shader. Hides LOD line meshes (which
   * lack `id`) so they don't pollute the id buffer. Returns the
   * temporary `byte → modelId` map the render pass uses to
   * disambiguate models.
   */
  private applyIdMaterial(): Map<number, string> {
    const fragments = this.components.get(FragmentsManager);
    const byteToModel = new Map<number, string>();
    let nextByte = 1;

    for (const [modelId, model] of fragments.list) {
      if (nextByte > FastModelPicker.MAX_MODELS) break;
      const byte = nextByte;
      nextByte += 1;
      let any = false;

      model.object.traverse((child) => {
        if (!(child instanceof THREE.Mesh)) return;
        const geom = child.geometry as THREE.BufferGeometry | undefined;
        if (!geom) return;
        if (!geom.attributes || !geom.attributes.id) {
          // No id attribute: LOD line mesh or similar. Hide so its
          // normal shader doesn't write into our id target.
          if (child.visible) {
            this._hiddenLods.push(child);
            child.visible = false;
          }
          return;
        }
        this._originalMaterials.set(child, child.material);
        child.material = this._idMaterial;
        any = true;
      });

      if (any) byteToModel.set(byte, modelId);
    }

    return byteToModel;
  }

  /**
   * Renders the world scene to the id target one model at a time,
   * flipping the `modelByte` uniform between renders. The depth buffer
   * is shared across the per-model passes so the front-most item still
   * wins each pixel regardless of which model it belongs to.
   *
   * Non-BIM meshes in the world scene (the user's own helpers, ground
   * planes, hover proxies, anything else) are hidden for the duration
   * of the render. Without this, their normal materials write whatever
   * colour they happen to produce into the id target, which decodes as
   * a bogus `(modelByte, itemId)` pair when the cursor lands on one.
   */
  private renderIdPass(byteToModel: Map<number, string>) {
    const renderer = this.world.renderer!.three;
    const scene = this.world.scene.three;
    const camera = this.world.camera.three;
    const fragments = this.components.get(FragmentsManager);

    // Sync clipping planes onto the id shader so it discards clipped
    // geometry — without this the picker would happily return items
    // that are hidden by an active section plane.
    const planes = renderer.clippingPlanes ?? [];
    this._idMaterial.clippingPlanes = planes;
    this._idMaterial.clipping = planes.length > 0;

    const prevTarget = renderer.getRenderTarget();
    const prevAutoClear = renderer.autoClear;
    const prevClearColor = renderer.getClearColor(new THREE.Color());
    const prevClearAlpha = renderer.getClearAlpha();

    renderer.setRenderTarget(this._renderTarget!);
    renderer.setClearColor(0x000000, 0);
    renderer.autoClear = false;
    renderer.clear(true, true, false);

    // Collect every BIM model's root object so we can (a) toggle them
    // individually during the per-model passes and (b) recognise them
    // when filtering non-BIM meshes below.
    const objectsByModel = new Map<string, THREE.Object3D>();
    for (const [modelId, model] of fragments.list) {
      objectsByModel.set(modelId, model.object);
    }
    const bimRoots = new Set<THREE.Object3D>(objectsByModel.values());

    // Hide every non-BIM mesh in the world scene for the duration of
    // the id render. Anything below a BIM root is left alone (the BIM
    // roots themselves are toggled per pass below).
    const nonBimVisibility = new Map<THREE.Object3D, boolean>();
    const inBimSubtree = (obj: THREE.Object3D) => {
      let p: THREE.Object3D | null = obj;
      while (p) {
        if (bimRoots.has(p)) return true;
        p = p.parent;
      }
      return false;
    };
    scene.traverse((child) => {
      if (child === scene) return;
      if (!(child as THREE.Mesh).isMesh) return;
      if (inBimSubtree(child)) return;
      nonBimVisibility.set(child, child.visible);
      child.visible = false;
    });

    const bimVisibilityBefore = new Map<THREE.Object3D, boolean>();
    for (const obj of objectsByModel.values()) {
      bimVisibilityBefore.set(obj, obj.visible);
      obj.visible = false;
    }

    for (const [byte, modelId] of byteToModel) {
      const obj = objectsByModel.get(modelId);
      if (!obj) continue;
      obj.visible = true;
      this._idMaterial.uniforms.modelByte.value = byte;
      renderer.render(scene, camera);
      obj.visible = false;
    }

    for (const [obj, was] of bimVisibilityBefore) obj.visible = was;
    for (const [obj, was] of nonBimVisibility) obj.visible = was;

    renderer.setRenderTarget(prevTarget);
    renderer.autoClear = prevAutoClear;
    renderer.setClearColor(prevClearColor, prevClearAlpha);
  }

  /**
   * Renders the picker's color target with the BIM tile shells using
   * the given override-style material, swapped in **per-mesh** rather
   * than via `scene.overrideMaterial`.
   *
   * Why per-mesh swap and not `scene.overrideMaterial`: fragments runs
   * its own LOD/visibility logic on tile shells (`mesh.visible`
   * toggled internally based on current LOD stage and frustum). At
   * the moment we render, most tile shells are flagged invisible —
   * `overrideMaterial` then renders nothing and we read back a
   * cleared pixel. Per-mesh swap mirrors what {@link renderIdPass}
   * does; we also force each shell visible for the duration of the
   * render so fragments' culling decisions don't blank our output.
   *
   * Honours the renderer's clipping planes so picked depth/normal
   * match what's actually rendered on screen.
   */
  private renderWithTileMaterial(material: THREE.ShaderMaterial) {
    const renderer = this.world.renderer!.three;
    const scene = this.world.scene.three;
    const camera = this.world.camera.three;
    const fragments = this.components.get(FragmentsManager);

    // Sync clipping planes onto the swap material.
    const planes = renderer.clippingPlanes ?? [];
    material.clippingPlanes = planes;
    material.clipping = planes.length > 0;

    const prevTarget = renderer.getRenderTarget();
    const prevAutoClear = renderer.autoClear;
    const prevClearColor = renderer.getClearColor(new THREE.Color());
    const prevClearAlpha = renderer.getClearAlpha();

    // Per-mesh material + visibility swap. We only touch shells that
    // carry the `id` attribute — those are the BIM tile shells.
    // LOD-stage line meshes (no `id`) are hidden so they don't write
    // into our pick buffer.
    // Only touch shells that fragments currently has visible. Forcing
    // hidden tiles visible leaks stale LOD-stage geometry into the
    // pick — those tiles sit at slightly different depths than the
    // active ones and would dominate `gl_FragCoord.z` at the cursor.
    const matSwap = new Map<
      THREE.Mesh,
      THREE.Material | THREE.Material[]
    >();
    const hiddenLines: THREE.Object3D[] = [];
    for (const [, model] of fragments.list) {
      model.object.traverse((child) => {
        if (!(child instanceof THREE.Mesh)) return;
        const geom = child.geometry as THREE.BufferGeometry | undefined;
        if (!geom) return;
        if (!geom.attributes || !geom.attributes.id) {
          if (child.visible) {
            hiddenLines.push(child);
            child.visible = false;
          }
          return;
        }
        // Mirror the id pass: we only rasterize tiles fragments has
        // currently flagged visible. Forcing hidden tiles visible
        // would render stale LOD-stage geometry that sits at slightly
        // different depths than the active tiles.
        if (!child.visible) return;
        matSwap.set(child, child.material);
        child.material = material;
      });
    }

    // Hide non-BIM meshes for the duration of the render.
    const bimRoots = new Set<THREE.Object3D>();
    for (const [, model] of fragments.list) bimRoots.add(model.object);
    const inBimSubtree = (obj: THREE.Object3D) => {
      let p: THREE.Object3D | null = obj;
      while (p) {
        if (bimRoots.has(p)) return true;
        p = p.parent;
      }
      return false;
    };
    const nonBimVisibility = new Map<THREE.Object3D, boolean>();
    scene.traverse((child) => {
      if (child === scene) return;
      if (!(child as THREE.Mesh).isMesh) return;
      if (inBimSubtree(child)) return;
      nonBimVisibility.set(child, child.visible);
      child.visible = false;
    });

    renderer.setRenderTarget(this._renderTarget!);
    renderer.setClearColor(0x000000, 0);
    renderer.autoClear = false;
    renderer.clear(true, true, false);
    renderer.render(scene, camera);

    // Restore everything.
    for (const [mesh, mat] of matSwap) mesh.material = mat;
    for (const obj of hiddenLines) obj.visible = true;
    for (const [obj, was] of nonBimVisibility) obj.visible = was;

    renderer.setRenderTarget(prevTarget);
    renderer.autoClear = prevAutoClear;
    renderer.setClearColor(prevClearColor, prevClearAlpha);
  }

  private renderDepthPass() {
    this.renderWithTileMaterial(this._depthMaterial);
  }

  private renderNormalPass() {
    this.renderWithTileMaterial(this._normalMaterial);
  }

  private restoreOriginalMaterials() {
    for (const [mesh, mat] of this._originalMaterials) {
      mesh.material = mat;
    }
    this._originalMaterials.clear();

    for (const obj of this._hiddenLods) obj.visible = true;
    this._hiddenLods.length = 0;
  }

  private readPixelAt(ndc: THREE.Vector2): Uint8Array | null {
    const renderer = this.world.renderer!.three;
    const size = this._renderTargetSize;
    // NDC [-1..1] → pixel [0..size-1]. Y is bottom-up in WebGL textures.
    const x = Math.floor((ndc.x + 1) * 0.5 * size.x);
    const y = Math.floor((ndc.y + 1) * 0.5 * (size.y - 1));
    const cx = Math.max(0, Math.min(size.x - 1, x));
    const cy = Math.max(0, Math.min(size.y - 1, y));
    const pixels = new Uint8Array(4);
    renderer.readRenderTargetPixels(
      this._renderTarget!,
      cx,
      cy,
      1,
      1,
      pixels,
    );
    return pixels;
  }

  // ---------------------------------------------------------------------------
  // Setup / teardown
  // ---------------------------------------------------------------------------

  private buildIdMaterial(): THREE.ShaderMaterial {
    // Clipping planes are honoured manually rather than via three's
    // `<clipping_planes_*>` chunk includes — those don't reliably
    // resolve in `ShaderMaterial` (we already saw `<packing>` silently
    // fail to expand). We replicate three's convention exactly so the
    // `clippingPlanes` uniform three auto-sets when `material.clipping
    // = true && clippingPlanes.length > 0` works as expected:
    //   `vClipPosition = -(modelViewMatrix * position).xyz`
    //   discard when `dot(vClipPosition, plane.xyz) > plane.w`
    // `NUM_CLIPPING_PLANES` is the define three injects automatically
    // based on `material.clippingPlanes.length`.
    return new THREE.ShaderMaterial({
      uniforms: { modelByte: { value: 1 } },
      vertexShader: `
        attribute float id;
        varying float vId;
        #if NUM_CLIPPING_PLANES > 0
          varying vec3 vClipPosition;
        #endif
        void main() {
          vId = id;
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          #if NUM_CLIPPING_PLANES > 0
            vClipPosition = -mvPosition.xyz;
          #endif
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        precision highp float;
        uniform float modelByte;
        varying float vId;
        #if NUM_CLIPPING_PLANES > 0
          varying vec3 vClipPosition;
          uniform vec4 clippingPlanes[NUM_CLIPPING_PLANES];
        #endif
        void main() {
          #if NUM_CLIPPING_PLANES > 0
            for (int i = 0; i < NUM_CLIPPING_PLANES; i++) {
              vec4 plane = clippingPlanes[i];
              if (dot(vClipPosition, plane.xyz) > plane.w) discard;
            }
          #endif
          float id = vId;
          float b1 = floor(id / 65536.0);
          float b2 = floor(mod(id / 256.0, 256.0));
          float b3 = mod(id, 256.0);
          gl_FragColor = vec4(
            modelByte / 255.0,
            b1 / 255.0,
            b2 / 255.0,
            b3 / 255.0
          );
        }
      `,
      side: THREE.DoubleSide,
    });
  }

  /**
   * Builds the depth-encoding override material used by
   * {@link renderDepthPass}. Includes three's `packing` chunk to reuse
   * the standard `packDepthToRGBA` helper, which is robust to the
   * round-trip through an `UNSIGNED_BYTE` color attachment (the chunk
   * pre-multiplies by `256/255` so `depth = 1.0` decodes back exactly
   * to `1.0`). Decode side mirrors this with the same scaling factors;
   * see {@link unpackDepthFromRGBA} below.
   */
  private buildDepthMaterial(): THREE.ShaderMaterial {
    // Depth packed manually instead of via three's `#include <packing>`
    // chunk — `ShaderMaterial` doesn't reliably resolve chunk includes
    // for custom shaders, and we were silently getting back unrelated
    // bytes that decoded to garbage.
    //
    // Convention (must mirror `unpackDepthFromRGBA` below):
    //   r = fract(v * 256^3)  (least significant)
    //   g = fract(v * 256^2)
    //   b = fract(v * 256)
    //   a = v                 (most significant)
    // The `r.yzw -= r.xyz / 256` step shaves the residual from each
    // higher component so the encoded value is exact. The final
    // `* 256/255` upscale ensures `v = 1.0` lands at all-255 bytes
    // rather than rolling over to 0.
    return new THREE.ShaderMaterial({
      uniforms: {},
      vertexShader: `
        #if NUM_CLIPPING_PLANES > 0
          varying vec3 vClipPosition;
        #endif
        void main() {
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          #if NUM_CLIPPING_PLANES > 0
            vClipPosition = -mvPosition.xyz;
          #endif
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        #if NUM_CLIPPING_PLANES > 0
          varying vec3 vClipPosition;
          uniform vec4 clippingPlanes[NUM_CLIPPING_PLANES];
        #endif
        void main() {
          #if NUM_CLIPPING_PLANES > 0
            for (int i = 0; i < NUM_CLIPPING_PLANES; i++) {
              vec4 plane = clippingPlanes[i];
              if (dot(vClipPosition, plane.xyz) > plane.w) discard;
            }
          #endif
          float v = gl_FragCoord.z;
          vec4 r = vec4(
            fract(v * 16777216.0),
            fract(v * 65536.0),
            fract(v * 256.0),
            v
          );
          r.yzw -= r.xyz * (1.0 / 256.0);
          gl_FragColor = r * (256.0 / 255.0);
        }
      `,
      side: THREE.DoubleSide,
    });
  }

  /**
   * World-space normal in RGB. Handles backfaces by flipping the
   * encoded normal so consumers always get the surface they're looking
   * at. Decode side: `(rgb * 2 - 1)` → renormalize.
   */
  private buildNormalMaterial(): THREE.ShaderMaterial {
    return new THREE.ShaderMaterial({
      uniforms: {},
      vertexShader: `
        varying vec3 vWorldNormal;
        #if NUM_CLIPPING_PLANES > 0
          varying vec3 vClipPosition;
        #endif
        void main() {
          vWorldNormal = normalize(
            (modelMatrix * vec4(normal, 0.0)).xyz
          );
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          #if NUM_CLIPPING_PLANES > 0
            vClipPosition = -mvPosition.xyz;
          #endif
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        varying vec3 vWorldNormal;
        #if NUM_CLIPPING_PLANES > 0
          varying vec3 vClipPosition;
          uniform vec4 clippingPlanes[NUM_CLIPPING_PLANES];
        #endif
        void main() {
          #if NUM_CLIPPING_PLANES > 0
            for (int i = 0; i < NUM_CLIPPING_PLANES; i++) {
              vec4 plane = clippingPlanes[i];
              if (dot(vClipPosition, plane.xyz) > plane.w) discard;
            }
          #endif
          vec3 n = normalize(vWorldNormal);
          if (!gl_FrontFacing) n = -n;
          gl_FragColor = vec4(n * 0.5 + 0.5, 1.0);
        }
      `,
      side: THREE.DoubleSide,
    });
  }

  private setupRenderTarget() {
    const renderer = this.world.renderer!.three;
    const size = renderer.getSize(new THREE.Vector2());
    this._renderTargetSize.copy(size);

    this._renderTarget = new THREE.WebGLRenderTarget(size.x, size.y, {
      format: THREE.RGBAFormat,
      type: THREE.UnsignedByteType,
      minFilter: THREE.NearestFilter,
      magFilter: THREE.NearestFilter,
      depthBuffer: true,
    });

    if (this.debugMode) this.setupDebugCanvas();

    this.world.renderer!.onResize.add((newSize) => {
      this._renderTargetSize.copy(newSize);
      this._renderTarget!.setSize(newSize.x, newSize.y);
      if (this._debugCanvas) {
        this._debugCanvas.width = newSize.x;
        this._debugCanvas.height = newSize.y;
      }
    });
  }

  private setupDebugCanvas() {
    if (this._debugCanvas) return;
    const size = this.world.renderer!.three.getSize(new THREE.Vector2());

    this._debugContainer = document.createElement("div");
    this._debugContainer.style.position = "fixed";
    this._debugContainer.style.top = "10px";
    this._debugContainer.style.right = "10px";
    this._debugContainer.style.width = "300px";
    this._debugContainer.style.height = "300px";
    this._debugContainer.style.border = "2px solid #fff";
    this._debugContainer.style.backgroundColor = "#000";
    this._debugContainer.style.zIndex = "10000";
    this._debugContainer.style.pointerEvents = "none";

    this._debugCanvas = document.createElement("canvas");
    this._debugCanvas.width = size.x;
    this._debugCanvas.height = size.y;
    this._debugCanvas.style.width = "100%";
    this._debugCanvas.style.height = "100%";
    this._debugCanvas.style.imageRendering = "pixelated";
    this._debugContainer.appendChild(this._debugCanvas);
    document.body.appendChild(this._debugContainer);
  }

  private removeDebugCanvas() {
    if (this._debugContainer) {
      this._debugContainer.remove();
      this._debugContainer = undefined;
      this._debugCanvas = undefined;
    }
  }

  private updateDebugCanvas() {
    if (!this._debugCanvas || !this._renderTarget || !this.world.renderer) {
      return;
    }
    const renderer = this.world.renderer.three;
    const size = this._renderTargetSize;

    const pixels = new Uint8Array(size.x * size.y * 4);
    renderer.readRenderTargetPixels(
      this._renderTarget,
      0,
      0,
      size.x,
      size.y,
      pixels,
    );

    const ctx = this._debugCanvas.getContext("2d");
    if (!ctx) return;
    const imageData = ctx.createImageData(size.x, size.y);
    // Flip Y axis: WebGL has Y=0 at bottom, canvas 2D has Y=0 at top.
    const rowSize = size.x * 4;
    for (let y = 0; y < size.y; y++) {
      const srcRow = y;
      const dstRow = size.y - 1 - y;
      const srcOffset = srcRow * rowSize;
      const dstOffset = dstRow * rowSize;
      imageData.data.set(
        pixels.subarray(srcOffset, srcOffset + rowSize),
        dstOffset,
      );
    }
    ctx.putImageData(imageData, 0, 0);
  }
}

// ---------------------------------------------------------------------------
// Depth helpers
// ---------------------------------------------------------------------------

/**
 * Inverse of three's `packDepthToRGBA` GLSL helper. The shader chunk
 * pre-multiplies its packed bytes by `256/255` (so `depth = 1.0` round-
 * trips to `(255, 255, 255, 255)`); we mirror that with `255/256` here
 * and the reciprocals of the chunk's `PackFactors`.
 */
function unpackDepthFromRGBA(pixels: Uint8Array): number {
  const r = pixels[0] / 255;
  const g = pixels[1] / 255;
  const b = pixels[2] / 255;
  const a = pixels[3] / 255;
  const downscale = 255 / 256;
  return (
    downscale *
    (r / (256 * 256 * 256) + g / (256 * 256) + b / 256 + a)
  );
}

/**
 * Convert a cursor `ndc` and a `[0..1]` depth-buffer sample to a
 * world-space point. NDC z lives in `[-1..1]` so we expand the depth
 * sample before unprojecting through the camera's matrices.
 */
function unprojectToWorld(
  ndc: THREE.Vector2,
  depth: number,
  camera: THREE.Camera,
): THREE.Vector3 {
  const v = new THREE.Vector3(ndc.x, ndc.y, depth * 2 - 1);
  v.unproject(camera);
  return v;
}

