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

  /**
   * `itemId → localId` cache keyed by model id. Populated lazily on
   * first resolve; cleared when a model is disposed.
   */
  private _localIdCache = new Map<string, Map<number, number>>();

  constructor(components: Components, world: World) {
    if (!world.renderer) {
      throw new Error("A renderer is needed for the FastModelPicker to work!");
    }
    this.world = world;
    this.mouse = new Mouse(world.renderer.three.domElement);
    this.components = components;
    this._idMaterial = this.buildIdMaterial();
    this.setupRenderTarget();
    this.setupFragmentListeners();
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
   * The first time a given `(modelId, itemId)` pair is hit the picker
   * calls into the fragments worker to resolve `itemId → localId` and
   * caches the result. Subsequent hits on the same item are
   * worker-free.
   *
   * @param position - Normalized device coords. Defaults to the
   *   picker's last known mouse position.
   */
  async getItemAt(
    position?: THREE.Vector2,
  ): Promise<{ modelId: string; localId: number } | null> {
    const result = await this.runIdPass(position);
    if (!result) return null;
    const localId = await this.resolveLocalId(result.modelId, result.itemId);
    if (localId === null) return null;
    return { modelId: result.modelId, localId };
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
    if (this._renderTarget) this._renderTarget.dispose();
    this._renderTarget = undefined;
    this._localIdCache.clear();
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
   */
  private renderIdPass(byteToModel: Map<number, string>) {
    const renderer = this.world.renderer!.three;
    const scene = this.world.scene.three;
    const camera = this.world.camera.three;
    const fragments = this.components.get(FragmentsManager);

    const prevTarget = renderer.getRenderTarget();
    const prevAutoClear = renderer.autoClear;
    const prevClearColor = renderer.getClearColor(new THREE.Color());
    const prevClearAlpha = renderer.getClearAlpha();

    renderer.setRenderTarget(this._renderTarget!);
    renderer.setClearColor(0x000000, 0);
    renderer.autoClear = false;
    renderer.clear(true, true, false);

    const objectsByModel = new Map<string, THREE.Object3D>();
    for (const [modelId, model] of fragments.list) {
      objectsByModel.set(modelId, model.object);
    }
    const visibilityBefore = new Map<THREE.Object3D, boolean>();
    for (const obj of objectsByModel.values()) {
      visibilityBefore.set(obj, obj.visible);
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

    for (const [obj, was] of visibilityBefore) obj.visible = was;

    renderer.setRenderTarget(prevTarget);
    renderer.autoClear = prevAutoClear;
    renderer.setClearColor(prevClearColor, prevClearAlpha);
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

  private async resolveLocalId(
    modelId: string,
    itemId: number,
  ): Promise<number | null> {
    let cache = this._localIdCache.get(modelId);
    if (cache?.has(itemId)) return cache.get(itemId)!;

    const fragments = this.components.get(FragmentsManager);
    const model = fragments.list.get(modelId);
    if (!model) return null;

    // `getLocalIdsFromItemIds` is a fragments worker call returning a
    // parallel array. One round-trip per first-time hit per item;
    // afterwards the cache covers it.
    const localIds = await model.getLocalIdsFromItemIds([itemId]);
    if (!localIds || localIds.length === 0) return null;
    const localId = localIds[0];
    if (typeof localId !== "number") return null;

    if (!cache) {
      cache = new Map();
      this._localIdCache.set(modelId, cache);
    }
    cache.set(itemId, localId);
    return localId;
  }

  // ---------------------------------------------------------------------------
  // Setup / teardown
  // ---------------------------------------------------------------------------

  private buildIdMaterial(): THREE.ShaderMaterial {
    return new THREE.ShaderMaterial({
      uniforms: { modelByte: { value: 1 } },
      vertexShader: `
        attribute float id;
        varying float vId;
        void main() {
          vId = id;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        precision highp float;
        uniform float modelByte;
        varying float vId;

        void main() {
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

  private setupFragmentListeners() {
    const fragments = this.components.get(FragmentsManager);
    fragments.list.onItemDeleted.add((modelId) => {
      this._localIdCache.delete(modelId);
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
