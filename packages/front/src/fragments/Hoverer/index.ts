import * as THREE from "three";
import * as OBC from "@thatopen/components";

/**
 * Per-tile vertex/index range entry returned by
 * `FragmentsModel.getItemDrawChunks`. We re-declare the shape here
 * rather than importing it so we don't tie the Hoverer's signatures to
 * an internal fragments type.
 */
interface ItemDrawChunks {
  tileId: number;
  position: Uint32Array;
  size: Uint32Array;
}

/**
 * How the Hoverer reacts to cursor input.
 *
 * - {@link HovererMode.MOUSE_STOP}: hover detection runs once the
 *   cursor has settled briefly. Matches the classic "wait for the user
 *   to stop moving" feel: less jittery, useful when hover is paired
 *   with a heavy reaction.
 * - {@link HovererMode.MOUSE_MOVE}: hover detection runs continuously
 *   as the cursor moves, throttled to one pick per animation frame.
 *   Snappier, ideal now that GPU-readback picking is sub-millisecond.
 */
export enum HovererMode {
  MOUSE_STOP = "mousestop",
  MOUSE_MOVE = "mousemove",
}

/**
 * The `Hoverer` component applies a material overlay to whichever
 * fragment item is under the cursor. It identifies the hovered item
 * via the GPU-readback picker (no worker raycast) and visualizes it by
 * attaching small proxy meshes that share the source tiles' geometry
 * attributes — no `Mesher.get`, no fresh `BufferGeometry` per hover, no
 * GPU memory allocation per item.
 *
 * Per-hover cost when the chunks cache is warm: one picker render +
 * 4-byte readback + a couple of proxy attach/detach calls. First hover
 * on a new item adds one worker round-trip for the chunks query; the
 * result is cached forever (until the model unloads). 📕 [Tutorial](https://docs.thatopen.com/Tutorials/Components/Front/Hoverer). 📘 [API](https://docs.thatopen.com/api/@thatopen/components-front/classes/Hoverer).
 */
export class Hoverer extends OBC.Component implements OBC.Disposable {
  static uuid = "26fbd870-b1b2-4b71-b747-4063d484de1b" as const;

  readonly onHoverStarted = new OBC.Event<Hoverer>();
  readonly onHoverEnded = new OBC.Event<Hoverer>();
  readonly onDisposed = new OBC.Event();

  /**
   * Cursor-input mode. See {@link HovererMode}. Defaults to
   * `MOUSE_MOVE` — picking is fast enough that there's no reason to
   * wait for the cursor to settle.
   */
  mode: HovererMode = HovererMode.MOUSE_MOVE;

  /**
   * When `true`, fade the hover material's opacity in and out over
   * {@link fadeDuration}. When `false`, the visualization pops in and
   * out instantly with no animation.
   */
  fade = true;

  /** Fade animation duration in milliseconds. Ignored when {@link fade} is `false`. */
  fadeDuration = 200;

  /**
   * Internal key for stashing the material's max opacity on its
   * `userData`, so the fade animation can scale to whatever ceiling
   * the user configured.
   */
  private HOVERER_OPACITY_KEY = "_maxHoverOpacity";

  /**
   * Settle window for {@link HovererMode.MOUSE_STOP} mode. Hardcoded
   * because it's a definition-of-stopped threshold, not a user-facing
   * latency knob; tweaking it doesn't make hover faster, only
   * jitter-vs-responsiveness within the same mode. Apps that care
   * about "instant" should use {@link HovererMode.MOUSE_MOVE}.
   */
  private static readonly MOUSE_STOP_SETTLE_MS = 30;

  /**
   * Hysteresis on null picks: how many consecutive `getItemAt`
   * returning `null` we tolerate before declaring "no item under
   * cursor" and starting the unhover.
   *
   * Pixel-precise GPU picking can briefly miss an item at sub-pixel
   * sample boundaries even while the cursor is still visually on it.
   * Without this, the brief miss tears the hover down and the next
   * frame's successful pick rebuilds it, producing a blink. At 60Hz
   * `MOUSE_MOVE`, two missed frames is ~33 ms — invisible to the
   * user, enough to absorb the typical jitter.
   */
  private static readonly NULL_PICK_TOLERANCE = 2;

  private _world: OBC.World | null = null;
  set world(value: OBC.World | null) {
    if (value === this._world) return;
    this.detachAll();
    this._world = value;
    this.setupEvents(this._enabled && !!value);
  }

  get world() {
    return this._world;
  }

  private _enabled = false;
  set enabled(value: boolean) {
    this._enabled = value;
    this.setupEvents(value && !!this._world);
    if (!value) this.detachAll();
  }

  get enabled() {
    return this._enabled;
  }

  /**
   * Material applied to the hover proxies. Defaults to a translucent
   * white overlay that draws on top of the source geometry. Setting a
   * new material caches its `opacity` as the fade animation peak and
   * disposes the previous one.
   */
  private _material: THREE.Material = new THREE.MeshBasicMaterial({
    color: 0xffffff,
    transparent: true,
    opacity: 0.5,
    depthTest: false,
    side: THREE.DoubleSide,
    userData: { [this.HOVERER_OPACITY_KEY]: 0.5 },
  });

  set material(value: THREE.Material) {
    if (value === this._material) return;
    value.userData[this.HOVERER_OPACITY_KEY] = value.opacity;
    // Re-apply to all currently attached proxies so the change is
    // immediate. The proxies' material array always holds exactly one
    // entry; mutating it in place keeps the same array reference.
    for (const proxy of this._proxies) {
      (proxy.material as THREE.Material[])[0] = value;
    }
    this._material.dispose();
    this._material = value;
  }

  get material() {
    return this._material;
  }

  // ---------------------------------------------------------------------------
  // Internals
  // ---------------------------------------------------------------------------

  /**
   * Currently-attached proxy meshes. Each shares its tile's
   * `geometry.attributes` and `index`; their wrapper `BufferGeometry`
   * carries `geometry.groups` covering only the hovered item's slices.
   */
  private _proxies = new Set<THREE.Mesh>();

  /**
   * Last-hovered item, or `null` when the cursor is over empty space.
   * Used to skip work when the cursor stays on the same item across
   * mousemoves.
   */
  private _current: { modelId: string; localId: number } | null = null;

  /**
   * Cache of `getItemDrawChunks` results, keyed by model id then local
   * id. The chunks query is the only worker call the Hoverer makes per
   * never-before-seen item; once cached, hovering the same item again
   * stays pure main thread.
   *
   * Cleared per-model when the fragment model is removed from the
   * manager (see {@link setupFragmentListeners}).
   */
  private _chunksCache = new Map<string, Map<number, ItemDrawChunks[]>>();

  private _fadeAnimation: {
    startTime: number;
    duration: number;
    fadeIn: boolean;
  } | null = null;

  /**
   * Generation counter incremented every time the hovered item
   * changes. The async chunks fetch checks this against the value it
   * captured at start; if they don't match, a newer hover has
   * superseded this one and the result is discarded.
   */
  private _hoverGen = 0;

  /**
   * Settle timer for {@link HovererMode.MOUSE_STOP}: cleared on every
   * mousemove and re-armed for {@link MOUSE_STOP_SETTLE_MS} ms. Fires
   * once the cursor pauses, kicks off one hover detection.
   */
  private _settleTimer: number | null = null;

  /**
   * RAF gate for {@link HovererMode.MOUSE_MOVE}: set when a mousemove
   * has scheduled a hover for the next animation frame, so additional
   * mousemoves coalesce into a single call. Caps detection at
   * 60 picks/sec regardless of mousemove rate.
   */
  private _moveScheduled = false;

  /**
   * In-flight guard for {@link HovererMode.MOUSE_MOVE}: prevents a new
   * hover detection from starting while a previous one is still
   * awaiting the picker, so a slow render can't pile up behind a
   * flurry of mousemoves.
   */
  private _moveInflight = false;

  /**
   * Consecutive null-pick counter. Reset on any successful pick.
   * When it exceeds {@link NULL_PICK_TOLERANCE} we treat the cursor
   * as truly off-item and run the unhover.
   */
  private _nullPicks = 0;

  /**
   * True while the user is actively dragging the camera (orbit,
   * pan). Set on `controlstart`, cleared on `controlend`. Listening
   * to camera-controls' user-input events directly (rather than
   * watching `update` or the camera matrix) means the Hoverer
   * resumes the moment the user releases the mouse — without
   * waiting for damping inertia to fully decay, which the previous
   * matrix-equality gate suffered from.
   */
  private _dragging = false;

  /**
   * True while wheel events are arriving at the canvas. Camera-
   * controls doesn't surface a wheel-start / wheel-end event pair,
   * so we debounce on the canvas-level `wheel` event: every wheel
   * pulse keeps this `true`; a brief idle window
   * ({@link WHEEL_IDLE_MS}) flips it back to `false`. Like
   * `_dragging`, this is independent of damping — picks resume as
   * soon as the user stops scrolling.
   */
  private _wheeling = false;
  private _wheelIdleTimer: number | null = null;
  private static readonly WHEEL_IDLE_MS = 80;

  /** Listeners stashed so we can detach on world-change / disable. */
  private _onCtrlStart: (() => void) | null = null;
  private _onCtrlEnd: (() => void) | null = null;
  private _onWheel: ((e: WheelEvent) => void) | null = null;

  constructor(components: OBC.Components) {
    super(components);
    components.add(Hoverer.uuid, this);
    this.setupFragmentListeners();
  }

  /**
   * Manually detach the current hover visualization. The next
   * mousemove will identify a fresh item and re-attach.
   */
  clear() {
    this.cancelTimers();
    this._current = null;
    this._nullPicks = 0;
    this._fadeAnimation = null;
    this.detachAll();
  }

  /** {@link Disposable.dispose} */
  dispose() {
    this._enabled = false;
    this.setupEvents(false);
    this.cancelTimers();
    this.detachAll();
    this._chunksCache.clear();
    this._fadeAnimation = null;
    this.onHoverStarted.reset();
    this.onHoverEnded.reset();
    this.onDisposed.trigger();
  }

  /**
   * Run a single hover detection at the current mouse position. Public
   * so callers can drive it manually if they're not using the
   * automatic mousemove listener.
   */
  async hover() {
    if (!this._enabled) return;
    if (!this._world) return;

    // MOUSE_MOVE mode runs picks back-to-back; serialize so a slow
    // render can't pile up behind quick mousemoves. The RAF gate
    // already throttles to one call per frame; this is the second
    // line of defence in case a single pick takes longer than a
    // frame. MOUSE_STOP can't overlap with itself anyway.
    if (this.mode === HovererMode.MOUSE_MOVE && this._moveInflight) return;
    this._moveInflight = this.mode === HovererMode.MOUSE_MOVE;

    try {
      // Skip picks while the user is actively driving the camera —
      // dragging or wheel-scrolling. Both flags are bound to user-
      // input events, not damping decay, so hover resumes the moment
      // the user releases the mouse / stops scrolling. Damping inertia
      // continues to animate the camera in the background; that's
      // fine — picks during inertia are at most one frame stale,
      // which is invisible at hover speed.
      if (this._dragging || this._wheeling) return;

      // Picker is per-world; we pull it lazily so apps that toggle
      // pickers / worlds don't trip on stale references.
      const pickers = this.components.get(OBC.FastModelPickers);
      const picker = pickers.get(this._world);
      const result = await picker.getItemAt();

      if (!result) {
        // Sub-pixel misses at item boundaries can briefly return null
        // even when the cursor is still visually on the item.
        // Tolerate a few consecutive nulls before tearing down the
        // hover; otherwise a clean cursor sweep on one item flickers
        // every time it crosses a sample seam.
        this._nullPicks += 1;
        if (this._nullPicks > Hoverer.NULL_PICK_TOLERANCE) {
          this.beginUnhover();
        }
        return;
      }
      this._nullPicks = 0;

      if (
        this._current &&
        this._current.modelId === result.modelId &&
        this._current.localId === result.localId
      ) {
        // Same item as last hover; nothing to do.
        return;
      }

      // New item under cursor. Tear down the existing visualization
      // and attach the new one as soon as chunks are available.
      // Bumping the generation invalidates any in-flight chunks fetch
      // from the previous hover.
      this.detachAll();
      this._current = result;
      this._hoverGen += 1;
      await this.attachForCurrent(this._hoverGen);
    } finally {
      this._moveInflight = false;
    }
  }

  private beginUnhover() {
    if (!this._current) return;
    this._current = null;
    this._nullPicks = 0;
    this._hoverGen += 1;
    if (this._proxies.size === 0) return;
    if (!this.fade || !this.material.transparent) {
      this.detachAll();
      return;
    }
    // Animate the existing proxies' shared material from current
    // opacity down to 0, then detach.
    this._fadeAnimation = {
      startTime: Date.now(),
      duration: this.fadeDuration,
      fadeIn: false,
    };
    this.animate();
  }

  private async attachForCurrent(gen: number) {
    if (gen !== this._hoverGen) return;
    if (!this._current || !this._world) return;
    const fragments = this.components.get(OBC.FragmentsManager);
    const model = fragments.list.get(this._current.modelId);
    if (!model) return;

    // Cache lookup before the worker call. First hover on a new item
    // pays one round-trip; subsequent hovers on the same item are
    // resolved synchronously from the cache.
    const chunks = await this.getOrFetchChunks(
      model,
      this._current.modelId,
      this._current.localId,
    );
    // Re-check generation after the await: the user may have moved
    // the cursor onto a different item while we were fetching.
    if (gen !== this._hoverGen) return;
    if (!chunks || chunks.length === 0) return;

    for (const entry of chunks) {
      const tile = model.tiles.get(entry.tileId);
      if (!tile) continue;
      const proxy = this.buildProxy(tile, entry.position, entry.size);
      this._world.scene.three.add(proxy);
      this._proxies.add(proxy);
    }

    if (this._proxies.size === 0) return;

    const maxOpacity =
      this.material.userData[this.HOVERER_OPACITY_KEY] ?? 1;

    if (this.fade && this.material.transparent) {
      // Fade in on every new item, including item-to-item
      // transitions. The picker returns a stable localId per logical
      // item, so a transition is a real "different thing" and the
      // user expects the fade to play.
      this._fadeAnimation = {
        startTime: Date.now(),
        duration: this.fadeDuration,
        fadeIn: true,
      };
      this.onHoverStarted.trigger(this);
      this.animate();
    } else {
      // No fade: jump straight to full opacity.
      this.material.opacity = maxOpacity;
      this.onHoverStarted.trigger(this);
    }
  }

  private async getOrFetchChunks(
    model: any,
    modelId: string,
    localId: number,
  ): Promise<ItemDrawChunks[] | null> {
    let modelCache = this._chunksCache.get(modelId);
    if (modelCache?.has(localId)) return modelCache.get(localId)!;

    let result: ItemDrawChunks[];
    try {
      result = (await model.getItemDrawChunks([
        localId,
      ])) as ItemDrawChunks[];
    } catch {
      return null;
    }

    if (!modelCache) {
      modelCache = new Map();
      this._chunksCache.set(modelId, modelCache);
    }
    modelCache.set(localId, result);
    return result;
  }

  /**
   * Build a single proxy mesh for one tile + its outlined chunks.
   * Aliases the source geometry's attributes/index, so the proxy
   * carries no GPU memory of its own. Material is wrapped in a
   * one-element array because three only honours `geometry.groups`
   * when the mesh's material is `Material[]`.
   */
  private buildProxy(
    tile: THREE.Mesh,
    positions: Uint32Array,
    sizes: Uint32Array,
  ): THREE.Mesh {
    const sourceGeom = tile.geometry;
    const proxyGeom = new THREE.BufferGeometry();
    proxyGeom.attributes = sourceGeom.attributes;
    if (sourceGeom.index) proxyGeom.setIndex(sourceGeom.index);
    proxyGeom.boundingBox = sourceGeom.boundingBox;
    proxyGeom.boundingSphere = sourceGeom.boundingSphere;

    const n = Math.min(positions.length, sizes.length);
    for (let i = 0; i < n; i++) {
      const start = positions[i];
      const raw = sizes[i];
      const count = raw === 0xffffffff ? Infinity : raw;
      proxyGeom.addGroup(start, count, 0);
    }

    const proxy = new THREE.Mesh(proxyGeom, [this._material]);
    proxy.matrixAutoUpdate = false;
    proxy.matrixWorldAutoUpdate = false;
    proxy.frustumCulled = false; // matrix is owned by source
    proxy.matrixWorld.copy(tile.matrixWorld);
    // Track the source so we can sync matrices each frame if needed
    // (the source's matrixWorld is updated by three when the model is
    // transformed; we mirror it on the next animation tick).
    proxy.userData.__hoverSource = tile;
    return proxy;
  }

  /**
   * Detach every active proxy. The proxy `BufferGeometry` is **not**
   * disposed: its attributes and index are aliased from the source
   * tile's geometry, and `BufferGeometry.dispose()` would tell three's
   * `WebGLAttributes` to free the GPU buffers, breaking the source
   * tile. We let the wrapper itself be GC'd.
   */
  private detachAll() {
    for (const proxy of this._proxies) {
      proxy.removeFromParent();
    }
    this._proxies.clear();
  }

  private cancelTimers() {
    if (this._settleTimer !== null) {
      clearTimeout(this._settleTimer);
      this._settleTimer = null;
    }
    this._moveScheduled = false;
  }

  private setupEvents(active: boolean) {
    if (!this._world || this._world.isDisposing) return;
    if (!this._world.renderer) return;

    const container = this._world.renderer.three.domElement;
    container.removeEventListener("mousemove", this.onMouseMove);
    container.removeEventListener("mouseleave", this.onMouseLeave);

    // Detach previously-registered camera + wheel listeners (if any)
    // before we either re-attach them or leave them off.
    const controls = (this._world.camera as any)?.controls;
    if (this._onCtrlStart && controls) {
      controls.removeEventListener("controlstart", this._onCtrlStart);
    }
    if (this._onCtrlEnd && controls) {
      controls.removeEventListener("controlend", this._onCtrlEnd);
    }
    if (this._onWheel) {
      container.removeEventListener("wheel", this._onWheel);
    }
    this._onCtrlStart = null;
    this._onCtrlEnd = null;
    this._onWheel = null;
    if (this._wheelIdleTimer !== null) {
      clearTimeout(this._wheelIdleTimer);
      this._wheelIdleTimer = null;
    }
    this._dragging = false;
    this._wheeling = false;

    if (!active) return;
    container.addEventListener("mousemove", this.onMouseMove);
    container.addEventListener("mouseleave", this.onMouseLeave);

    // Camera-controls drag start / end. We intentionally do NOT
    // listen to "update" — that fires throughout damping inertia
    // after the user has already released, which would suppress
    // picks for the full damping tail. The user-input pair only
    // covers the period the user is actually moving the camera.
    if (controls) {
      this._onCtrlStart = () => {
        this._dragging = true;
      };
      this._onCtrlEnd = () => {
        this._dragging = false;
      };
      controls.addEventListener("controlstart", this._onCtrlStart);
      controls.addEventListener("controlend", this._onCtrlEnd);
    }

    // Wheel zoom doesn't fire control* events, so we debounce on
    // the canvas wheel event. The first pulse flips `_wheeling`
    // true; each subsequent pulse re-arms the idle timer; once
    // pulses stop arriving for `WHEEL_IDLE_MS` we resume.
    this._onWheel = () => {
      this._wheeling = true;
      if (this._wheelIdleTimer !== null) clearTimeout(this._wheelIdleTimer);
      this._wheelIdleTimer = window.setTimeout(() => {
        this._wheeling = false;
        this._wheelIdleTimer = null;
      }, Hoverer.WHEEL_IDLE_MS);
    };
    container.addEventListener("wheel", this._onWheel, { passive: true });
  }

  private setupFragmentListeners() {
    const fragments = this.components.get(OBC.FragmentsManager);
    fragments.list.onItemDeleted.add((modelId) => {
      this._chunksCache.delete(modelId);
      // If the disposed model is the one currently hovered, drop the
      // visualization to avoid touching dead tile geometry.
      if (this._current && this._current.modelId === modelId) {
        this.clear();
      }
    });
  }

  private onMouseMove = () => {
    if (this.mode === HovererMode.MOUSE_MOVE) {
      // Coalesce mousemoves into one hover() per animation frame so
      // we don't spam the GPU faster than the display can refresh.
      if (this._moveScheduled) return;
      this._moveScheduled = true;
      requestAnimationFrame(() => {
        this._moveScheduled = false;
        void this.hover();
      });
      return;
    }

    // MOUSE_STOP: re-arm the settle window. Fires once the cursor
    // has been still for `MOUSE_STOP_SETTLE_MS`.
    if (this._settleTimer !== null) clearTimeout(this._settleTimer);
    this._settleTimer = window.setTimeout(() => {
      this._settleTimer = null;
      void this.hover();
    }, Hoverer.MOUSE_STOP_SETTLE_MS);
  };

  private onMouseLeave = () => {
    // Without this, a pending settle timer can still fire after the
    // pointer has left the canvas, running hover() with the stale
    // mouse position and showing a hover for an element the pointer
    // is no longer over (issue #712).
    this.cancelTimers();
    this.beginUnhover();
  };

  private animate = () => {
    if (!this._fadeAnimation) return;
    const { startTime, duration, fadeIn } = this._fadeAnimation;
    const elapsed = Date.now() - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const value = fadeIn ? progress : 1 - progress;
    const maxOpacity = this.material.userData[this.HOVERER_OPACITY_KEY] ?? 1;
    this.material.opacity = value * maxOpacity;

    // Sync proxy matrices from their sources so the overlay tracks
    // model transforms. Cheap: bounded by proxies attached to one
    // hovered item (typically 1–3).
    for (const proxy of this._proxies) {
      const source = proxy.userData.__hoverSource as THREE.Mesh | undefined;
      if (source) proxy.matrixWorld.copy(source.matrixWorld);
    }

    if (progress < 1) {
      requestAnimationFrame(this.animate);
    } else {
      if (!fadeIn) this.detachAll();
      this._fadeAnimation = null;
      this.onHoverEnded.trigger(this);
    }
  };
}
