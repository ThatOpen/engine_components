import * as OBC from "@thatopen/components";
import { DataSet } from "@thatopen/fragments";
import * as THREE from "three";
import { PostproductionRenderer } from "../../core";
import { Highlighter } from "../Highlighter";

const DEFAULT_GROUP = "default";

/**
 * Per-group visual configuration for the outliner.
 */
export interface OutlineGroupConfig {
  color?: THREE.Color;
  fillColor?: THREE.Color;
  fillOpacity?: number;
  thickness?: number;
  /**
   * Higher priority groups win at coplanar pixels (z-fighting resolution
   * between groups). Default is 0. Use integer steps; a difference of 1 is
   * enough to resolve typical coplanar cases.
   */
  priority?: number;
}

interface OutlineGroupState {
  map: OBC.ModelIdMap;
  /**
   * Tile meshes currently attached as outline proxies for this group,
   * grouped by model id. Used to diff against subsequent chunk queries
   * so we can detach tiles that no longer belong to the group.
   */
  attached: Map<string, Set<THREE.Mesh>>;
  /**
   * Bumped by every update request and whenever every proxy is detached
   * ({@link Outliner.clean}, {@link Outliner.remove}). An update applies its
   * result only if the revision it started with is still current when its
   * queries return, so the latest request supersedes any still running and a
   * superseded one changes nothing.
   */
  revision: number;
  /**
   * The latest update requested for this group; superseded updates settle with
   * it. Cleared when every proxy is detached, so an update superseded that way
   * never settles with itself.
   */
  update?: Promise<void>;
  activeStyles: Set<string>;
  styleCallbacks: {
    [style: string]: {
      onHighlight: () => void;
      onClear: (map: OBC.ModelIdMap) => void;
    };
  };
}

/**
 * This component allows adding colored outlines with thickness to fragments in
 * a 3D scene. Supports multiple named outline groups so different selections
 * can be outlined with different colors / thicknesses at the same time. 📕
 * [Tutorial](https://docs.thatopen.com/Tutorials/Components/Front/Outliner). 📘
 * [API](https://docs.thatopen.com/api/@thatopen/components-front/classes/Outliner).
 */
export class Outliner extends OBC.Component implements OBC.Disposable {
  private _world?: OBC.World;

  /**
   * The world where the outliner operates.
   */
  set world(value: OBC.World | undefined) {
    this._world = value;
    if (!value) return;
    const renderer = this.getRenderer();
    renderer.postproduction.excludedObjectsPass.addExcludedMaterial(
      this._points.material,
    );
  }

  get world() {
    return this._world;
  }

  /**
   * A set of Highlighter styles linked with the default outline group.
   * @remarks Use this or addItems directly but avoid using both at the same
   * time to prevent unwanted results. For per-group routing, wire the
   * Highlighter events manually with a group name:
   * `highlighter.events.select.onHighlight.add(m => outliner.addItems(m, "my-group"))`
   */
  styles = new DataSet<string>();

  // display a point for very far elements
  outlinePositions = false;

  private _mesh: THREE.Points<
    THREE.BufferGeometry,
    THREE.PointsMaterial
  > | null = null;

  private get _points() {
    if (!this._mesh) {
      this._mesh = new THREE.Points(
        new THREE.BufferGeometry(),
        new THREE.PointsMaterial({
          size: 10,
          sizeAttenuation: false,
          depthTest: false,
        }),
      );
    }
    return this._mesh;
  }

  /** {@link OBC.Component.enabled} */
  get enabled() {
    if (!this.world || this.world.isDisposing) {
      return false;
    }

    const renderer = this.getRenderer();
    return renderer.postproduction.outlinesEnabled;
  }

  /** {@link OBC.Component.enabled} */
  set enabled(value: boolean) {
    if (!this.world || this.world.isDisposing) {
      return;
    }

    const renderer = this.getRenderer();
    renderer.postproduction.outlinesEnabled = value;

    if (this.outlinePositions) {
      this._points.material.color = this.color;
      this.world.scene.three.add(this._points);
    }
  }

  /** Outline color for the default group. */
  get color() {
    return this.getRenderer().postproduction.outlinePass.outlineColor;
  }

  set color(value: THREE.Color) {
    const pass = this.getRenderer().postproduction.outlinePass;
    pass.outlineColor = value;
    this._points.material.color.copy(value);
    this.wake();
  }

  /** Thickness for the default group. */
  get thickness() {
    return this.getRenderer().postproduction.outlinePass.thickness;
  }

  set thickness(value: number) {
    this.getRenderer().postproduction.outlinePass.thickness = value;
    this.wake();
  }

  /** Fill color for the default group. */
  get fillColor() {
    return this.getRenderer().postproduction.outlinePass.fillColor;
  }

  set fillColor(value: THREE.Color) {
    this.getRenderer().postproduction.outlinePass.fillColor = value;
    this.wake();
  }

  /** Fill opacity for the default group. */
  get fillOpacity() {
    return this.getRenderer().postproduction.outlinePass.fillOpacity;
  }

  set fillOpacity(value: number) {
    this.getRenderer().postproduction.outlinePass.fillOpacity = value;
    this.wake();
  }

  private _resolutionScale = 1;

  /**
   * Internal render resolution of the selection outline (mask + edge/fill
   * composite) as a fraction of the canvas (0.25 to 1). 1 = full quality;
   * lower (e.g. 0.5) renders the outline at reduced resolution and upscales
   * it over the full-resolution scene: about 4x cheaper at 0.5, slightly
   * softer, to hold the framerate when a selection covers much of the
   * screen. Passthrough to the outline pass (WebGL).
   */
  get resolutionScale() {
    return this._resolutionScale;
  }

  set resolutionScale(value: number) {
    this._resolutionScale = Math.min(1, Math.max(0.25, value));
    if (!this.world || this.world.isDisposing) return;
    try {
      this.getRenderer().postproduction.outlinePass.resolutionScale =
        this._resolutionScale;
      this.wake();
    } catch {
      // Outline pass not initialized yet: applied again when a group syncs.
    }
  }

  /**
   * Debounce (ms) for the re-sync after a model's tiles or view change.
   * Small enough that an outline re-appears almost immediately once the
   * camera settles, large enough to coalesce a burst of tile events during
   * continuous camera motion into one trailing pass.
   */
  viewSyncDebounce = 60;

  /**
   * Asks for a frame after a change in how the outline looks: in MANUAL
   * renderer mode nothing else would (a no-op in AUTO, which renders every
   * frame anyway).
   */
  private wake() {
    if (!this.world || this.world.isDisposing) return;
    try {
      this.getRenderer().needsUpdate = true;
    } catch {
      // Renderer not ready or not a postproduction renderer; nothing to poke.
    }
  }

  readonly onDisposed = new OBC.Event();

  /**
   * A unique identifier for the component.

   * This UUID is used to register the component within the Components system.
   */
  static readonly uuid = "2fd3bcc5-b3b6-4ded-9f64-f47a02854a10" as const;

  private _groups = new Map<string, OutlineGroupState>();
  /**
   * Per-model unsubscribe handles for the tile lifecycle listeners
   * registered in {@link bindModelTileEvents}. Run on dispose so we
   * don't leak references after the Outliner goes away.
   */
  private _tileListeners = new Map<string, () => void>();

  /** Pending debounced re-sync timers, keyed by model id (see `scheduleViewSync`). */
  private _viewSyncTimers = new Map<string, ReturnType<typeof setTimeout>>();

  constructor(components: OBC.Components) {
    super(components);
    components.add(Outliner.uuid, this);
    this.ensureGroup(DEFAULT_GROUP);
    this.setupEvents();
  }

  // ---------------------------------------------------------------------------
  // Group API
  // ---------------------------------------------------------------------------

  /**
   * Creates (or reconfigures) a named outline group. Each group renders with
   * its own outline color, fill and thickness independently of the others.
   *
   * @param name - Unique group name. "default" is reserved for the legacy
   * singular API and cannot be removed.
   * @param config - Optional visual configuration.
   */
  create(name: string, config: OutlineGroupConfig = {}) {
    if (this.world) {
      this.getRenderer().postproduction.outlinePass.addGroup(
        name,
        this.toPassConfig(config),
      );
    }
    this.ensureGroup(name);
  }

  /**
   * Updates an existing group's visual configuration.
   */
  configure(name: string, config: OutlineGroupConfig) {
    if (!this.world) return;
    this.getRenderer().postproduction.outlinePass.configureGroup(
      name,
      this.toPassConfig(config),
    );
  }

  /**
   * Removes a group together with all items routed to it.
   */
  remove(name: string) {
    if (name === DEFAULT_GROUP) return;
    const group = this._groups.get(name);
    if (!group) return;

    const highlighter = this.components.get(Highlighter);
    for (const style of Object.keys(group.styleCallbacks)) {
      const { onHighlight, onClear } = group.styleCallbacks[style];
      const events = highlighter.events[style];
      if (events) {
        events.onHighlight.remove(onHighlight);
        events.onClear.remove(onClear);
      }
    }

    this.detachAll(group, name);
    this._groups.delete(name);

    if (this.world) {
      this.getRenderer().postproduction.outlinePass.removeGroup(name);
    }
  }

  /** Returns the names of all currently created groups. */
  list() {
    return [...this._groups.keys()];
  }

  /**
   * Wires a Highlighter style to a specific outline group. Equivalent to
   * `outliner.styles.add(style)` but routes the items to the given group
   * instead of the default.
   */
  bindStyle(style: string, group = DEFAULT_GROUP) {
    const highlighter = this.components.get(Highlighter);
    if (!highlighter.styles.has(style)) return false;
    this.ensureGroup(group);
    this.wireStyle(style, group);
    return true;
  }

  // ---------------------------------------------------------------------------
  // Items API
  // ---------------------------------------------------------------------------

  /**
   * Adds items to be outlined in a specific group (defaults to "default").
   */
  async addItems(modelIdMap: OBC.ModelIdMap, group = DEFAULT_GROUP) {
    const state = this.ensureGroup(group);
    OBC.ModelIdMapUtils.add(state.map, modelIdMap);
    await this.updateGroup(group);
  }

  /**
   * Removes items from a specific group (defaults to "default").
   */
  async removeItems(modelIdMap: OBC.ModelIdMap, group = DEFAULT_GROUP) {
    const state = this._groups.get(group);
    if (!state) return;
    OBC.ModelIdMapUtils.remove(state.map, modelIdMap);
    await this.updateGroup(group);
  }

  /**
   * Adds `modelIdMap` to the group's selection (the default group if omitted)
   * and refreshes that group's outline. Identical to {@link addItems}; calling
   * it with no map just refreshes the group without changing what it holds.
   *
   * Note this changed: `modelIdMap` used to be accepted and ignored, so the
   * call was always a plain refresh and the group's selection only ever came
   * from {@link addItems}. It now joins the group's map, which is what the
   * argument always claimed to do. Pass nothing for the old behaviour.
   *
   * @deprecated call {@link addItems} instead.
   */
  async update(modelIdMap?: OBC.ModelIdMap, group?: string) {
    await this.addItems(modelIdMap ?? {}, group);
  }

  // ---------------------------------------------------------------------------
  // Cleanup
  // ---------------------------------------------------------------------------

  /**
   * Cleans up outlines. Without arguments, clears every group. With a group
   * name, clears that group only.
   */
  clean(group?: string) {
    if (group !== undefined) {
      const state = this._groups.get(group);
      if (!state) return;
      state.map = {};
      state.activeStyles.clear();
      this.detachAll(state, group);
      if (group === DEFAULT_GROUP) this.cleanPoints();
      return;
    }

    for (const [name, state] of this._groups) {
      state.map = {};
      state.activeStyles.clear();
      this.detachAll(state, name);
    }
    this.cleanPoints();
  }

  /** {@link Disposable.dispose} */
  dispose() {
    this.styles.clear();
    for (const [, unbind] of this._tileListeners) unbind();
    this._tileListeners.clear();
    for (const [, timer] of this._viewSyncTimers) clearTimeout(timer);
    this._viewSyncTimers.clear();
    for (const name of [...this._groups.keys()]) {
      if (name === DEFAULT_GROUP) continue;
      this.remove(name);
    }
    this.clean();
    this.onDisposed.trigger(Outliner.uuid);
  }

  // ---------------------------------------------------------------------------
  // Internals
  // ---------------------------------------------------------------------------

  private toPassConfig(config: OutlineGroupConfig) {
    return {
      outlineColor: config.color,
      fillColor: config.fillColor,
      fillOpacity: config.fillOpacity,
      thickness: config.thickness,
      priority: config.priority,
    };
  }

  private ensureGroup(name: string): OutlineGroupState {
    let state = this._groups.get(name);
    if (state) return state;
    state = {
      map: {},
      attached: new Map(),
      revision: 0,
      activeStyles: new Set(),
      styleCallbacks: {},
    };
    this._groups.set(name, state);
    return state;
  }

  private setupEvents() {
    const highlighter = this.components.get(Highlighter);

    // Only add the style if it exists in the highlighter
    this.styles.guard = (style) => {
      return highlighter.styles.has(style);
    };

    this.styles.onItemAdded.add((style) => {
      this.wireStyle(style, DEFAULT_GROUP);
    });

    this.styles.onBeforeDelete.add((style) => {
      this.unwireStyle(style, DEFAULT_GROUP);
    });

    highlighter.styles.onItemDeleted.add((style) => {
      this.styles.delete(style);
      // Also tear down any named-group wirings for this style.
      for (const [name] of this._groups) this.unwireStyle(style, name);
    });
  }

  private wireStyle(style: string, groupName: string) {
    const highlighter = this.components.get(Highlighter);
    const events = highlighter.events[style];
    if (!events) return;

    const state = this.ensureGroup(groupName);
    if (state.styleCallbacks[style]) return; // already wired

    const onHighlight = () => {
      state.activeStyles.add(style);
      this.updateFromStyles(groupName);
    };
    const onClear = () => {
      state.activeStyles.delete(style);
      this.updateFromStyles(groupName);
    };
    state.styleCallbacks[style] = { onHighlight, onClear };
    events.onHighlight.add(onHighlight);
    events.onClear.add(onClear);
  }

  private unwireStyle(style: string, groupName: string) {
    const state = this._groups.get(groupName);
    if (!state) return;
    const callbacks = state.styleCallbacks[style];
    if (!callbacks) return;
    const highlighter = this.components.get(Highlighter);
    const events = highlighter.events[style];
    if (events) {
      events.onHighlight.remove(callbacks.onHighlight);
      events.onClear.remove(callbacks.onClear);
    }
    state.activeStyles.delete(style);
    delete state.styleCallbacks[style];
  }

  private async updateFromStyles(groupName: string) {
    const highlighter = this.components.get(Highlighter);
    const state = this._groups.get(groupName);
    if (!state) return;
    const maps: OBC.ModelIdMap[] = [];
    for (const style of state.activeStyles) {
      const map = highlighter.selection[style];
      if (!map) continue;
      maps.push(map);
    }
    state.map = OBC.ModelIdMapUtils.join(maps);
    await this.updateGroup(groupName);
  }

  /**
   * Brings the group's proxies in line with its map.
   *
   * Requests arrive from many places at once — adding or removing items,
   * highlighter styles, and every tile a model streams in or evicts — so each
   * request supersedes the update still running: only the latest applies its
   * result. A superseded request settles with the one that replaced it, so
   * callers awaiting it resume once the outline reflects their change.
   */
  private updateGroup(name: string): Promise<void> {
    const state = this.ensureGroup(name);
    const revision = ++state.revision;
    state.update = this.syncGroup(name, state, revision)
      .catch((error) => {
        // A superseded update's failure is moot: none of its result would apply.
        if (state.revision === revision) throw error;
      })
      .then(() => (state.revision === revision ? undefined : state.update));
    return state.update;
  }

  /**
   * Resolves the group's current selection into per-tile index chunks
   * via {@link FragmentsModel.getItemDrawChunks}, then asks the pass to
   * attach a proxy per affected tile. Tiles that previously had a proxy
   * but no longer match the selection are detached.
   *
   * Cost is bounded by the number of affected tiles (not selected items)
   * and by one worker round-trip per model in the selection. Adding
   * thousands of items costs the same as adding one if they all live in
   * the same tile, and a few thousand items spread across the model
   * still hits at most a few hundred tiles.
   *
   * Outline color, fill, and thickness come from the pass's group config.
   * The Outliner only feeds it the geometry slices.
   */
  private async syncGroup(
    name: string,
    state: OutlineGroupState,
    revision: number,
  ) {
    if (!this.world) return;
    const renderer = this.getRenderer();
    const pass = renderer.postproduction.outlinePass;

    // Make sure the pass knows about this group (palette + material +
    // container). The Outliner's ensureGroup only tracks selection state.
    if (!pass.hasGroup(name)) pass.addGroup(name);
    // A scale set before the pass existed reaches it here.
    if (
      this._resolutionScale !== 1 &&
      pass.resolutionScale !== this._resolutionScale
    ) {
      pass.resolutionScale = this._resolutionScale;
    }

    const fragments = this.components.get(OBC.FragmentsManager);
    const map = state.map;
    const nextAttached = new Map<string, Set<THREE.Mesh>>();

    // Fetched alongside the chunk queries and applied with their result, so
    // points follow the same revision check as the tiles.
    const points =
      name === DEFAULT_GROUP && this.outlinePositions
        ? fragments.getPositions(map)
        : undefined;

    // Run the chunk query per model in parallel. Each query returns one
    // entry per affected tile with parallel `position` / `size` arrays.
    const queries: Array<
      Promise<{
        modelId: string;
        chunks: Array<{
          tileId: number;
          position: Uint32Array;
          size: Uint32Array;
        }>;
      }>
    > = [];
    for (const [modelId, localIds] of Object.entries(map)) {
      if (localIds.size === 0) continue;
      const model = fragments.list.get(modelId);
      if (!model) continue;
      this.bindModelTileEvents(modelId);
      queries.push(
        (async () => {
          // `getItemDrawChunks` accepts an iterable; we pass the Set
          // straight through to avoid materializing an array for very
          // large selections.
          const chunks = await model.getItemDrawChunks(localIds);
          return { modelId, chunks };
        })(),
      );
    }

    const [results, positions] = await Promise.all([
      Promise.all(queries),
      points,
    ]);

    // Superseded while the queries ran, by a newer update or by a clean or
    // remove: the result is stale, and the attachments and points are no
    // longer ours to change.
    if (state.revision !== revision) return;

    if (positions) {
      const attribute = new THREE.Float32BufferAttribute(
        new Float32Array(positions.length * 3),
        3,
      );

      for (let i = 0; i < positions.length; i++) {
        const { x, y, z } = positions[i];
        attribute.setXYZ(i, x, y, z);
      }

      this._points.geometry.setAttribute("position", attribute);
    }

    // Attach (or refresh) every tile that came back; track attachments
    // for next-time diffs.
    for (const { modelId, chunks } of results) {
      const model = fragments.list.get(modelId);
      if (!model) continue;
      const attached = new Set<THREE.Mesh>();
      for (const entry of chunks) {
        const tile = model.tiles.get(entry.tileId);
        if (!tile) continue;
        pass.attachOutlinedTile(
          tile,
          { position: entry.position, size: entry.size },
          name,
        );
        attached.add(tile);
      }
      nextAttached.set(modelId, attached);
    }

    // Detach proxies attached before but not in the new result. Covers item
    // removal and items that moved to a different group. Read now, not before
    // the queries: nothing awaits between here and the revision check, so this
    // is exactly what is drawn.
    for (const [modelId, prev] of state.attached) {
      const next = nextAttached.get(modelId) ?? new Set<THREE.Mesh>();
      for (const tile of prev) {
        if (!next.has(tile)) pass.detachOutlinedTile(tile, name);
      }
    }

    state.attached = nextAttached;
    // The change shows at once in MANUAL renderer mode too.
    this.wake();
  }

  /**
   * Detach every proxy this group has attached and clear the tracking
   * map. Used by `clean` and `remove`.
   */
  private detachAll(state: OutlineGroupState, group = DEFAULT_GROUP) {
    state.revision++;
    state.update = undefined;
    if (!this.world) {
      state.attached = new Map();
      return;
    }
    const pass = this.getRenderer().postproduction.outlinePass;
    for (const [, tiles] of state.attached) {
      for (const tile of tiles) pass.detachOutlinedTile(tile, group);
    }
    state.attached = new Map();
    this.wake();
  }

  /**
   * Subscribe to a model's tile lifecycle and view events so we can refresh
   * outline proxies when tiles load (LOD swap, viewport change, etc.) or
   * unload, and after each settled view/cull cycle, so outlines survive
   * culls and pick up rebuilt tiles. Idempotent per model id.
   *
   * All of these go through the debounced path: a camera rotation churns a
   * burst of tile events, and re-syncing on each one would fire a worker
   * round trip per tile while something is outlined. The debounce coalesces
   * the burst into one trailing re-sync once motion settles.
   */
  private bindModelTileEvents(modelId: string) {
    if (this._tileListeners.has(modelId)) return;
    const fragments = this.components.get(OBC.FragmentsManager);
    const model = fragments.list.get(modelId);
    if (!model) return;
    const onChange = () => this.scheduleViewSync(modelId);
    model.tiles.onItemSet.add(onChange);
    model.tiles.onItemDeleted.add(onChange);
    model.onViewUpdated.add(onChange);
    this._tileListeners.set(modelId, () => {
      model.tiles.onItemSet.remove(onChange);
      model.tiles.onItemDeleted.remove(onChange);
      model.onViewUpdated.remove(onChange);
      const timer = this._viewSyncTimers.get(modelId);
      if (timer !== undefined) clearTimeout(timer);
      this._viewSyncTimers.delete(modelId);
    });
  }

  /** Re-syncs every group whose selection still references the given model. */
  private resyncModel(modelId: string) {
    // Cheap for groups that don't reference it.
    for (const [groupName, state] of this._groups) {
      const localIds = state.map[modelId];
      if (localIds && localIds.size > 0) {
        this.updateGroup(groupName).catch(() => undefined);
      }
    }
  }

  /**
   * Debounced {@link resyncModel}: collapses a burst of tile and view events
   * (continuous camera motion) into a single trailing re-sync once motion
   * settles ({@link viewSyncDebounce} ms).
   */
  private scheduleViewSync(modelId: string) {
    const existing = this._viewSyncTimers.get(modelId);
    if (existing !== undefined) clearTimeout(existing);
    const timer = setTimeout(() => {
      this._viewSyncTimers.delete(modelId);
      this.resyncModel(modelId);
    }, this.viewSyncDebounce);
    this._viewSyncTimers.set(modelId, timer);
  }

  private cleanPoints() {
    if (this._mesh) {
      const disposer = this.components.get(OBC.Disposer);
      disposer.destroy(this._mesh, true, true);
    }
    this._mesh = null;
  }

  private getRenderer() {
    if (!this.world) {
      throw new Error("You must set a world to use the outliner!");
    }

    const renderer = this.world.renderer as PostproductionRenderer;
    if (!renderer.postproduction) {
      throw new Error(
        "The world given to the outliner must use the postproduction renderer.",
      );
    }

    return renderer;
  }
}
