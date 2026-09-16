import * as THREE from "three";
import { FragmentsManager } from "../../../fragments/FragmentsManager";
import type { Components } from "../../Components";
import { Mouse } from "../../Raycasters/src/mouse";
import { Component } from "../../Types/src/component";
import { Event } from "../../Types/src/event";
import type { Disposable } from "../../Types/src/interfaces";
import type { World } from "../../Types/src/world";

/**
 * Attachment index of each pick output in the pick render target. Matches
 * the `layout(location)` of that output in
 * {@link FastModelPicker.buildPickMaterial}. Adding an output takes a key
 * here, an `out` in the shader and a decoder below; WebGL2 guarantees at
 * least 4 draw buffers.
 */
const PickOutput = { id: 0, depth: 1, normal: 2 } as const;

type PickOutputName = keyof typeof PickOutput;

const PICK_OUTPUT_NAMES = Object.keys(PickOutput) as PickOutputName[];

/** The outputs {@link FastModelPicker.renderPick} reads back. */
type PickRequest = Readonly<Partial<Record<PickOutputName, boolean>>>;

/** One RGBA pixel per output, filled by {@link FastModelPicker.renderPick}. */
type PickBuffers = Readonly<Record<PickOutputName, Uint8Array>>;

interface PickFrame {
  /** The byte each model was drawn with. */
  byteToModel: ReadonlyMap<number, string>;
  /**
   * The camera the pick was rendered with, a snapshot of the world camera.
   * Decode against it rather than `world.camera`, which may have moved on.
   * Reused by the next pick, so decode before awaiting anything.
   */
  camera: THREE.Camera;
  /** Center of the read pixel, in {@link camera}'s NDC. */
  ndc: THREE.Vector2;
}

const ID_REQUEST: PickRequest = { id: true };
const DEPTH_REQUEST: PickRequest = { depth: true };
const NORMAL_REQUEST: PickRequest = { normal: true };
const FULL_REQUEST: PickRequest = { id: true, depth: true, normal: true };
const NO_REQUEST: PickRequest = {};

const ORIGIN = new THREE.Vector2();

// ---------------------------------------------------------------------------
// Render target / scene helpers
// ---------------------------------------------------------------------------

/** A render target with one RGBA8 attachment per {@link PickOutput}. */
function createPickTarget(width: number, height: number) {
  return new THREE.WebGLRenderTarget(width, height, {
    count: PICK_OUTPUT_NAMES.length,
    format: THREE.RGBAFormat,
    type: THREE.UnsignedByteType,
    minFilter: THREE.NearestFilter,
    magFilter: THREE.NearestFilter,
    depthBuffer: true,
  });
}

/** Whether three draws `object` itself, as opposed to only its children. */
function isRenderable(object: THREE.Object3D) {
  const flags = object as Partial<
    Record<"isMesh" | "isLine" | "isPoints" | "isSprite", boolean>
  >;
  return Boolean(
    flags.isMesh || flags.isLine || flags.isPoints || flags.isSprite,
  );
}

// ---------------------------------------------------------------------------
// Decoders
// ---------------------------------------------------------------------------

/**
 * Inverse of the depth packing in {@link FastModelPicker.buildPickMaterial}.
 * The shader pre-multiplies its packed bytes by `256/255` (so `depth = 1.0`
 * round-trips to `(255, 255, 255, 255)`); we mirror that with `255/256`
 * here.
 */
function unpackDepthFromRGBA(pixels: Uint8Array): number {
  const r = pixels[0] / 255;
  const g = pixels[1] / 255;
  const b = pixels[2] / 255;
  const a = pixels[3] / 255;
  const downscale = 255 / 256;
  return downscale * (r / (256 * 256 * 256) + g / (256 * 256) + b / 256 + a);
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

/**
 * Decodes the {@link PickOutput.id} pixel into the picked item, or `null`
 * over empty space.
 */
function decodeId(pixel: Uint8Array, byteToModel: ReadonlyMap<number, string>) {
  // Byte 0 is the cleared / void value and is never assigned to a model.
  const modelId = byteToModel.get(pixel[0]);
  if (!modelId) return null;
  // The shader keeps the lower three bytes of `itemId + 1`; 0 means no item.
  // eslint-disable-next-line no-bitwise
  const encoded = (pixel[1] << 16) | (pixel[2] << 8) | pixel[3];
  if (encoded === 0) return null;
  return { modelId, itemId: encoded - 1 };
}

/**
 * Decodes the {@link PickOutput.depth} pixel into the world-space point it
 * describes, or `null` over empty space.
 */
function decodePoint(pixel: Uint8Array, frame: PickFrame) {
  if (pixel[0] === 0 && pixel[1] === 0 && pixel[2] === 0 && pixel[3] === 0) {
    return null; // cleared / void — nothing was drawn here
  }
  const depth = unpackDepthFromRGBA(pixel);
  // depth ≈ 1 means the far plane: nothing in front of the camera at
  // that pixel. Treat as void rather than returning a point on the
  // far plane.
  if (depth >= 1.0 - 1e-6) return null;
  return unprojectToWorld(frame.ndc, depth, frame.camera);
}

/**
 * Decodes the {@link PickOutput.normal} pixel into a unit world-space
 * normal, or `null` over empty space.
 */
function decodeNormal(pixel: Uint8Array) {
  if (pixel[3] === 0) return null; // void pixel — nothing rendered here
  // No zero-length guard: the shader writes a unit normal, and byte
  // quantization can't land all three channels within 1/255 of the origin,
  // so the shortest vector this can decode is still well clear of zero.
  return new THREE.Vector3(
    (pixel[0] / 255) * 2 - 1,
    (pixel[1] / 255) * 2 - 1,
    (pixel[2] / 255) * 2 - 1,
  ).normalize();
}

async function itemIdToLocalId(
  fragments: FragmentsManager,
  modelId: string,
  itemId: number,
) {
  const model = fragments.list.get(modelId);
  if (!model) return null;
  const localIds = await model.getLocalIdsFromItemIds([itemId]);
  const localId = localIds?.[0];
  return localId ?? null;
}

/**
 * GPU-readback picker that identifies what's under a screen position
 * without going through the worker raycast.
 *
 * - {@link getModelAt} returns the model id under the cursor.
 * - {@link getItemAt} returns the item itself (`modelId` + `localId`).
 * - {@link getPointAt} / {@link getNormalAt} return the surface point and
 *   normal.
 * - {@link getFullPick} returns all of the above from the same pick.
 *
 * Every query goes through {@link renderPick}: one render of the BIM scene
 * into a 1×1 multiple-render-target, through a camera whose frustum covers
 * only the pixel under the cursor. The pick shader writes the item id,
 * depth and normal of that pixel into one attachment each, so they always
 * describe the same fragment; each query reads back only the attachments
 * it needs.
 *
 * What can be picked is what is drawn. An item that fragments currently draws
 * at a reduced LOD — a line mesh carrying no `id` attribute — is not pickable,
 * and the pick resolves to whatever is behind it; the worker raycast tests the
 * authored geometry instead, so the two can disagree on small or distant
 * items, see {@link collectPickables}.
 *
 * Item id encoding (one pixel). The id is written as `itemId + 1` so that
 * an unwritten pixel (all zeroes) decodes as "no item" rather than item 0:
 *   R = modelByte (1..254, 0 = void / unwritten)
 *   G = ((itemId + 1) >> 16) & 0xff
 *   B = ((itemId + 1) >> 8)  & 0xff
 *   A = (itemId + 1)         & 0xff
 *
 * `modelByte` is assigned per-pick, so the assignment is stable for the
 * duration of the pick but doesn't grow over the session.
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
   * When `true`, mirrors the id output of the whole viewport to a debug
   * canvas pinned in the top-right corner. Each model shows up as a
   * near-uniform red band (the model byte) modulated by varying greens /
   * blues from the per-item id encoding.
   */
  debugMode = false;

  /**
   * Maximum models the picker can disambiguate in a single pick. Capped
   * by the 8-bit `modelByte`. In practice we never approach this.
   */
  static readonly MAX_MODELS = 254;

  /** The 1×1 target every pick renders into. */
  private _pickTarget?: THREE.WebGLRenderTarget = createPickTarget(1, 1);

  /** Viewport-sized target for the debug overlay, created on demand. */
  private _debugTarget?: THREE.WebGLRenderTarget;

  private _pickBuffers: PickBuffers = {
    id: new Uint8Array(4),
    depth: new Uint8Array(4),
    normal: new Uint8Array(4),
  };

  private _debugCanvas?: HTMLCanvasElement;
  private _debugContainer?: HTMLDivElement;

  /**
   * Writes every {@link PickOutput} on each draw. Set as the scene's
   * `overrideMaterial` for the pick render, so fragments' materials are
   * never swapped.
   */
  private _pickMaterial: THREE.ShaderMaterial;

  /** Snapshot of the world camera with a narrowed projection. */
  private _pickCamera = new THREE.Camera();
  private _pickMatrix = new THREE.Matrix4();
  private _pickNdc = new THREE.Vector2();
  private _viewportSize = new THREE.Vector2();
  private _clearColor = new THREE.Color();

  /**
   * Per-pick state filled by {@link collectPickables}. `_meshBytes` is read
   * by the pick material while drawing; `_byteToModel` outlives the render
   * so the caller can decode the id output.
   */
  private _meshBytes = new Map<THREE.Object3D, number>();
  private _byteToModel = new Map<number, string>();
  private _modelBytes = new Map<string, number>();
  private _modelRoots = new Map<THREE.Object3D, string>();

  /** Undo log for {@link collectPickables}, drained by {@link restorePickables}. */
  private _hidden: THREE.Object3D[] = [];
  private _forcedOverrides: THREE.Material[] = [];

  private _walkNodes: THREE.Object3D[] = [];
  private _walkOwners: (string | null)[] = [];

  constructor(components: Components, world: World) {
    if (!world.renderer) {
      throw new Error("A renderer is needed for the FastModelPicker to work!");
    }
    this.world = world;
    this.mouse = new Mouse(world.renderer.three.domElement);
    this.components = components;
    this._pickMaterial = this.buildPickMaterial();
    // The matrices are copied from the world camera on every pick; keep
    // `render()` from recomputing them out of the unused local transform.
    this._pickCamera.matrixAutoUpdate = false;
    this._pickCamera.matrixWorldAutoUpdate = false;
  }

  /**
   * Returns the model id under the given screen position, or `null` if
   * the cursor is over empty space.
   *
   * Cheaper than {@link getItemAt} because we don't resolve the
   * `localId`; we just read the model byte.
   *
   * @param position - Normalized device coords. Defaults to the
   *   picker's last known mouse position.
   */
  getModelAt(position?: THREE.Vector2): string | null {
    const frame = this.pick(position, ID_REQUEST);
    if (!frame) return null;
    return decodeId(this._pickBuffers.id, frame.byteToModel)?.modelId ?? null;
  }

  /**
   * Returns `{ modelId, localId }` for the item under the given screen
   * position, or `null` if the cursor is over empty space.
   *
   * The vertex `id` attribute encodes the internal **itemId** (the
   * FlatBuffer `sample.item()` index, key for `boxes.sampleOf`) rather
   * than the user-facing localId, which unblocks the snap path's O(1)
   * sample lookup. The trade-off: resolving `localId` takes one worker
   * round-trip. Internal consumers that only need itemId (e.g. snap) can
   * read it from the result directly.
   *
   * @param position - Normalized device coords. Defaults to the
   *   picker's last known mouse position.
   */
  async getItemAt(
    position?: THREE.Vector2,
  ): Promise<{ modelId: string; localId: number; itemId: number } | null> {
    const frame = this.pick(position, ID_REQUEST);
    if (!frame) return null;
    const hit = decodeId(this._pickBuffers.id, frame.byteToModel);
    if (!hit) return null;
    const fragments = this.components.get(FragmentsManager);
    const localId = await itemIdToLocalId(fragments, hit.modelId, hit.itemId);
    if (localId === undefined || localId === null) return null;
    return { modelId: hit.modelId, localId, itemId: hit.itemId };
  }

  /**
   * Returns the world-space point under the given screen position, or
   * `null` if the cursor is over empty space.
   *
   * Reads the packed `gl_FragCoord.z` of the picked pixel and unprojects
   * it through the pick camera. Useful for things like "set camera orbit
   * center to what the user just clicked on".
   *
   * @param position - Normalized device coords. Defaults to the
   *   picker's last known mouse position.
   */
  getPointAt(position?: THREE.Vector2): THREE.Vector3 | null {
    const frame = this.pick(position, DEPTH_REQUEST);
    if (!frame) return null;
    return decodePoint(this._pickBuffers.depth, frame);
  }

  /**
   * Returns the world-space surface normal under the cursor, or `null`
   * if the cursor is over empty space.
   *
   * @param position - Normalized device coords. Defaults to the
   *   picker's last known mouse position.
   */
  getNormalAt(position?: THREE.Vector2): THREE.Vector3 | null {
    const frame = this.pick(position, NORMAL_REQUEST);
    if (!frame) return null;
    return decodeNormal(this._pickBuffers.normal);
  }

  /**
   * One-shot pick that produces the full result shape consumers need:
   * `{ modelId, localId, point, normal, distance }`, all from the same
   * render.
   *
   * Returns `null` if the cursor is over empty space, the id output
   * decodes to the void sentinel, or the depth round-trip yields the
   * far plane.
   */
  async getFullPick(position?: THREE.Vector2): Promise<{
    modelId: string;
    localId: number;
    /**
     * Internal item index (FlatBuffer `sample.item()`). Exposed so
     * SnapResolver and other internal consumers can hit fragments'
     * itemId-keyed fast paths (`boxes.sampleOf`) without paying a
     * second worker round-trip to translate back from localId.
     */
    itemId: number;
    point: THREE.Vector3;
    normal: THREE.Vector3 | null;
    distance: number;
  } | null> {
    /**
     * Decode everything before the first await, against the frame's camera
     * snapshot, so a camera that moves while `localId` resolves can't drift
     * the point or distance.
     */
    const frame = this.pick(position, FULL_REQUEST);
    if (!frame) return null;
    const buffers = this._pickBuffers;
    const hit = decodeId(buffers.id, frame.byteToModel);
    if (!hit) return null;
    const point = decodePoint(buffers.depth, frame);
    if (!point) return null;
    const normal = decodeNormal(buffers.normal);
    const cameraPosition = new THREE.Vector3().setFromMatrixPosition(
      frame.camera.matrixWorld,
    );
    const distance = point.distanceTo(cameraPosition);

    const fragments = this.components.get(FragmentsManager);
    const localId = await itemIdToLocalId(fragments, hit.modelId, hit.itemId);

    if (localId === undefined || localId === null) return null;
    return {
      modelId: hit.modelId,
      itemId: hit.itemId,
      localId,
      point,
      normal,
      distance,
    };
  }

  /**
   * Toggle the debug overlay. When enabled the picker mirrors the id
   * output of the whole viewport to a small canvas pinned in the
   * top-right corner so you can see what the picks see.
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
    this._pickMaterial.dispose();
    this._pickTarget?.dispose();
    this._pickTarget = undefined;
    this._debugTarget?.dispose();
    this._debugTarget = undefined;
    this.onDisposed.trigger();
    this.onDisposed.reset();
  }

  // ---------------------------------------------------------------------------
  // Pick path
  // ---------------------------------------------------------------------------

  private pick(
    position: THREE.Vector2 | undefined,
    request: PickRequest,
  ): PickFrame | null {
    if (!this._pickTarget) return null;
    if (this.debugMode) this.updateDebugCanvas();
    const ndc = position ?? this.mouse.position;
    return this.renderPick(ndc, request, this._pickTarget, this._pickBuffers);
  }

  /**
   * Renders every {@link PickOutput} for the region around `ndc` in a single
   * render, then reads the outputs named in `request` from the centre pixel of
   * `target` into `out`.
   *
   * `target` needs one attachment per output. Its size is the size of the
   * rendered region in viewport pixels: 1×1 for a pick, the whole viewport
   * centred on the origin for the debug overlay.
   *
   * The scene is left exactly as found, even if rendering throws.
   */
  private renderPick(
    ndc: THREE.Vector2,
    request: PickRequest,
    target: THREE.WebGLRenderTarget,
    out: PickBuffers,
  ): PickFrame | null {
    if (!this.enabled || !this.world.renderer) return null;
    // `overrideMaterial` only applies to a `THREE.Scene`.
    const scene = this.world.scene.three as THREE.Scene;
    if (!scene.isScene) return null;
    const fragments = this.components.get(FragmentsManager);
    if (!fragments.initialized || fragments.list.size === 0) return null;

    const renderer = this.world.renderer.three;
    const viewport = renderer.getSize(this._viewportSize);
    if (viewport.x === 0 || viewport.y === 0) return null;

    const camera = this.snapshotCamera(ndc, viewport, target);

    const material = this._pickMaterial;
    const planes = renderer.clippingPlanes ?? [];
    material.clippingPlanes = planes;
    material.clipping = planes.length > 0;

    const prevTarget = renderer.getRenderTarget();
    const prevAutoClear = renderer.autoClear;
    const prevClearColor = renderer.getClearColor(this._clearColor);
    const prevClearAlpha = renderer.getClearAlpha();
    const prevBackground = scene.background;
    const prevOverrideMaterial = scene.overrideMaterial;
    const { shadowMap } = renderer;
    const prevShadowAutoUpdate = shadowMap.autoUpdate;
    const prevShadowNeedsUpdate = shadowMap.needsUpdate;

    try {
      this.collectPickables(scene, fragments);
      if (this._byteToModel.size === 0) return null;

      // A non-null scene background makes three force-clear colour AND depth
      // on render() and paints the background colour into pixels with no
      // geometry, which then decode to a bogus hit instead of void
      // (issues #737 / #773).
      scene.background = null;
      scene.overrideMaterial = material;
      // `render()` refreshes shadow maps every call. The pick reads no
      // shadows, and must not consume a refresh the app requested.
      shadowMap.autoUpdate = false;
      shadowMap.needsUpdate = false;

      renderer.setRenderTarget(target);
      renderer.setClearColor(0x000000, 0);
      renderer.autoClear = false;
      renderer.clear(true, true, false);
      renderer.render(scene, camera);
    } finally {
      this.restorePickables();
      shadowMap.autoUpdate = prevShadowAutoUpdate;
      shadowMap.needsUpdate = prevShadowNeedsUpdate;
      scene.overrideMaterial = prevOverrideMaterial;
      scene.background = prevBackground;
      renderer.setRenderTarget(prevTarget);
      renderer.autoClear = prevAutoClear;
      renderer.setClearColor(prevClearColor, prevClearAlpha);
    }

    // `readRenderTargetPixels` is the one synchronous GPU sync of the pick;
    // reading the other attachments afterwards is a plain copy.
    const x = Math.floor(target.width / 2);
    const y = Math.floor(target.height / 2);
    for (const name of PICK_OUTPUT_NAMES) {
      if (!request[name]) continue;
      const pixel = out[name];
      // clear the previous pick.
      pixel.fill(0);
      const attachment = PickOutput[name];
      renderer.readRenderTargetPixels(
        target,
        x,
        y,
        1,
        1,
        pixel,
        undefined,
        attachment,
      );
    }

    this._pickNdc.set(
      ((x + 0.5) / target.width) * 2 - 1,
      ((y + 0.5) / target.height) * 2 - 1,
    );
    return { byteToModel: this._byteToModel, camera, ndc: this._pickNdc };
  }

  /**
   * Copies the world camera into the pick camera and narrows its projection
   * to a `target`-sized region of the viewport centred on `ndc`, the
   * classic pick matrix: `P' = M · P`.
   *
   * - Frustum culling then skips every mesh whose bounds miss that region,
   *   so only meshes under the cursor are drawn at all.
   * - `M` leaves the depth row alone, so depth decodes as usual.
   * - The centre of a 1×1 target is exactly `ndc`: no NDC → pixel rounding,
   *   no scissor, no device pixel ratio to account for.
   * - The world camera is never modified, and custom projections work.
   */
  private snapshotCamera(
    ndc: THREE.Vector2,
    viewport: THREE.Vector2,
    target: THREE.WebGLRenderTarget,
  ) {
    const source = this.world.camera.three;
    source.updateWorldMatrix(true, false);

    const camera = this._pickCamera;
    camera.matrixWorld.copy(source.matrixWorld);
    camera.matrixWorldInverse.copy(source.matrixWorldInverse);
    camera.layers.mask = source.layers.mask;

    const sx = viewport.x / target.width;
    const sy = viewport.y / target.height;
    // prettier-ignore
    this._pickMatrix.set(
      sx, 0, 0, -ndc.x * sx,
      0, sy, 0, -ndc.y * sy,
      0, 0, 1, 0,
      0, 0, 0, 1,
    );
    camera.projectionMatrix.multiplyMatrices(
      this._pickMatrix,
      source.projectionMatrix,
    );
    camera.projectionMatrixInverse.copy(camera.projectionMatrix).invert();
    return camera;
  }

  /**
   * Walks the scene once and decides what the pick render draws:
   *
   * - Shells owned by a model, i.e. meshes carrying the per-vertex `id`
   *   attribute, are drawn and tagged with their model's byte. Ownership
   *   is the nearest model root above the mesh: a delta model's object is
   *   parented under its parent model's object (see the fragments
   *   EditHelper) but keeps its own byte.
   * - Every other renderable is hidden:
   *   - LOD line meshes, which fragments draws in place of small or distant
   *     items, carry no `id`. Drawn, the missing attribute would read as
   *     `(0, 0, 0, 1)` and write `itemId + 1 = 1`, i.e. a false hit on item 0,
   *     while occluding the real shell behind it. Hidden, the item they stand
   *     for simply isn't pickable, though the worker raycast still reports it.
   *   - Non-BIM objects (helpers, grids, annotation lines, sprites) would
   *     write their own colors into the pick outputs.
   *
   * Invisible subtrees are skipped: three won't draw them, and it leaves
   * fragments' own tile visibility (stale LOD stages, hidden items) as is.
   */
  private collectPickables(scene: THREE.Scene, fragments: FragmentsManager) {
    this._byteToModel.clear();
    this._modelBytes.clear();
    for (const [modelId, model] of fragments.list) {
      this._modelRoots.set(model.object, modelId);
    }

    const nodes = this._walkNodes;
    const owners = this._walkOwners;
    nodes.push(scene);
    owners.push(null);
    while (nodes.length) {
      const node = nodes.pop()!;
      const inherited = owners.pop() as string | null;
      if (!node.visible) continue;
      const owner = this._modelRoots.get(node) ?? inherited;

      if (isRenderable(node)) {
        const byte = owner === null ? 0 : this.pickableByte(node, owner);
        if (!byte) {
          node.visible = false;
          this._hidden.push(node);
          continue;
        }
        this._meshBytes.set(node, byte);
      }

      for (const child of node.children) {
        nodes.push(child);
        owners.push(owner);
      }
    }
  }

  /**
   * The byte to draw `node` with, or 0 if it isn't a pickable shell of
   * `modelId`. Bytes are handed out on a model's first shell, so models with
   * nothing on screen don't use one up.
   */
  private pickableByte(node: THREE.Object3D, modelId: string) {
    const mesh = node as THREE.Mesh;
    if (!mesh.isMesh || !mesh.geometry?.attributes?.id) return 0;

    let byte = this._modelBytes.get(modelId);
    if (byte === undefined) {
      byte = this._byteToModel.size + 1;
      if (byte > FastModelPicker.MAX_MODELS) return 0;
      this._modelBytes.set(modelId, byte);
      this._byteToModel.set(byte, modelId);
    }

    this.allowOverride(mesh.material);
    return byte;
  }

  /**
   * Three skips `scene.overrideMaterial` for materials with
   * `allowOverride === false`, which would draw a shell with its own shader
   * into the pick outputs.
   */
  private allowOverride(material: THREE.Material | THREE.Material[]) {
    if (Array.isArray(material)) {
      for (const entry of material) this.allowOverride(entry);
      return;
    }
    if (!material || material.allowOverride !== false) return;
    material.allowOverride = true;
    this._forcedOverrides.push(material);
  }

  private restorePickables() {
    for (const object of this._hidden) object.visible = true;
    for (const material of this._forcedOverrides) {
      material.allowOverride = false;
    }
    this._hidden.length = 0;
    this._forcedOverrides.length = 0;
    this._walkNodes.length = 0;
    this._walkOwners.length = 0;
    this._meshBytes.clear();
    this._modelRoots.clear();
  }

  // ---------------------------------------------------------------------------
  // Setup / teardown
  // ---------------------------------------------------------------------------

  /**
   * The pick shader. Writes one output per {@link PickOutput} attachment:
   *
   * - `id`: `(modelByte, idMid, idLo1, idLo0)`. The vertex `id` attribute
   *   holds the four bytes of `itemId + 1` (big-endian, non-normalized
   *   `Uint8Array`, so each component is 0–255 as a float). `itemId` is
   *   bounded by the item count per model, so its high byte is always 0
   *   and R is free for the model byte, set per draw from
   *   {@link collectPickables}.
   * - `depth`: `gl_FragCoord.z` packed into four bytes, inverse of
   *   {@link unpackDepthFromRGBA}:
   *     r = fract(v * 256^3)  (least significant)
   *     g = fract(v * 256^2)
   *     b = fract(v * 256)
   *     a = v                 (most significant)
   *   `r.yzw -= r.xyz / 256` shaves the residual from each higher component
   *   so the encoded value is exact, and the final `* 256/255` upscale lands
   *   `v = 1.0` at all-255 bytes rather than rolling over to 0. Packed by
   *   hand: `ShaderMaterial` doesn't reliably resolve three's `packing`
   *   chunk for custom shaders.
   * - `normal`: world-space normal as `normal * 0.5 + 0.5` in RGB, alpha 1.
   *   Flipped on backfaces so consumers get the surface they're looking at.
   *   ~1° precision per axis, plenty for surface alignment, orbiting and
   *   snapping.
   *
   * Every output is written on every draw: rasterizing one pixel, the only
   * per-output cost worth saving is the readback, which
   * {@link renderPick} skips for outputs it wasn't asked for. Per-request
   * shader variants would each cost a program compile instead.
   */
  private buildPickMaterial(): THREE.ShaderMaterial {
    const material = new THREE.ShaderMaterial({
      glslVersion: THREE.GLSL3,
      uniforms: { modelByte: { value: 0 } },
      vertexShader: `
        attribute vec4 id;
        varying vec4 vId;
        varying vec3 vWorldNormal;
        #if NUM_CLIPPING_PLANES > 0
          varying vec3 vClipPosition;
        #endif
        void main() {
          vId = id;
          vWorldNormal = normalize((modelMatrix * vec4(normal, 0.0)).xyz);
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
        varying vec4 vId;
        varying vec3 vWorldNormal;
        #if NUM_CLIPPING_PLANES > 0
          varying vec3 vClipPosition;
          uniform vec4 clippingPlanes[NUM_CLIPPING_PLANES];
        #endif
        layout(location = ${PickOutput.id}) out highp vec4 outId;
        layout(location = ${PickOutput.depth}) out highp vec4 outDepth;
        layout(location = ${PickOutput.normal}) out highp vec4 outNormal;
        void main() {
          #if NUM_CLIPPING_PLANES > 0
            for (int i = 0; i < NUM_CLIPPING_PLANES; i++) {
              vec4 plane = clippingPlanes[i];
              if (dot(vClipPosition, plane.xyz) > plane.w) discard;
            }
          #endif
          outId = vec4(modelByte / 255.0, vId.y / 255.0, vId.z / 255.0, vId.w / 255.0);

          float v = gl_FragCoord.z;
          vec4 r = vec4(
            fract(v * 16777216.0),
            fract(v * 65536.0),
            fract(v * 256.0),
            v
          );
          r.yzw -= r.xyz * (1.0 / 256.0);
          outDepth = r * (256.0 / 255.0);

          vec3 n = normalize(vWorldNormal);
          if (!gl_FrontFacing) n = -n;
          outNormal = vec4(n * 0.5 + 0.5, 1.0);
        }
      `,
      side: THREE.DoubleSide,
    });

    // One material draws every model, so the model byte is set per draw.
    material.onBeforeRender = (
      _renderer,
      _scene,
      _camera,
      _geometry,
      object,
    ) => {
      material.uniforms.modelByte.value = this._meshBytes.get(object) ?? 0;
      material.uniformsNeedUpdate = true;
    };

    return material;
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

  /**
   * Renders the pick for the whole viewport into {@link _debugTarget} and
   * mirrors its id output to the debug canvas.
   */
  private updateDebugCanvas() {
    if (!this._debugCanvas || !this.world.renderer) return;
    const renderer = this.world.renderer.three;
    const size = renderer.getSize(new THREE.Vector2());
    const width = Math.floor(size.x);
    const height = Math.floor(size.y);
    if (width === 0 || height === 0) return;

    this._debugTarget ??= createPickTarget(width, height);
    const target = this._debugTarget;
    target.setSize(width, height);
    if (!this.renderPick(ORIGIN, NO_REQUEST, target, this._pickBuffers)) return;

    const pixels = new Uint8Array(width * height * 4);
    renderer.readRenderTargetPixels(
      target,
      0,
      0,
      width,
      height,
      pixels,
      undefined,
      PickOutput.id,
    );

    const canvas = this._debugCanvas;
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const imageData = ctx.createImageData(width, height);
    // Flip Y axis: WebGL has Y=0 at bottom, canvas 2D has Y=0 at top.
    const rowSize = width * 4;
    for (let y = 0; y < height; y++) {
      const srcOffset = y * rowSize;
      const dstOffset = (height - 1 - y) * rowSize;
      imageData.data.set(
        pixels.subarray(srcOffset, srcOffset + rowSize),
        dstOffset,
      );
    }
    ctx.putImageData(imageData, 0, 0);
  }
}
