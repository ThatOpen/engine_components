import * as OBC from "@thatopen/components";
import * as THREE from "three";
import { DataSet } from "@thatopen/fragments";
import { Highlighter } from "../Highlighter";
import { PostproductionRenderer } from "../../core";

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
  }

  /** Thickness for the default group. */
  get thickness() {
    return this.getRenderer().postproduction.outlinePass.thickness;
  }

  set thickness(value: number) {
    this.getRenderer().postproduction.outlinePass.thickness = value;
  }

  /** Fill color for the default group. */
  get fillColor() {
    return this.getRenderer().postproduction.outlinePass.fillColor;
  }

  set fillColor(value: THREE.Color) {
    this.getRenderer().postproduction.outlinePass.fillColor = value;
  }

  /** Fill opacity for the default group. */
  get fillOpacity() {
    return this.getRenderer().postproduction.outlinePass.fillOpacity;
  }

  set fillOpacity(value: number) {
    this.getRenderer().postproduction.outlinePass.fillOpacity = value;
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

    this.detachAll(group);
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
    await this.updateGroup(group, modelIdMap);
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
   * Updates outline meshes for a given group, or for the default if omitted.
   *
   * When `modelIdMap` is provided and differs from the group's current map,
   * meshes for that delta are appended (existing group meshes stay).
   */
  async update(modelIdMap?: OBC.ModelIdMap, group = DEFAULT_GROUP) {
    if (modelIdMap === undefined) {
      await this.updateGroup(group);
    } else {
      await this.updateGroup(group, modelIdMap);
    }
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
      this.detachAll(state);
      if (group === DEFAULT_GROUP) this.cleanPoints();
      return;
    }

    for (const [, state] of this._groups) {
      state.map = {};
      state.activeStyles.clear();
      this.detachAll(state);
    }
    this.cleanPoints();
  }

  /** {@link Disposable.dispose} */
  dispose() {
    this.styles.clear();
    for (const [, unbind] of this._tileListeners) unbind();
    this._tileListeners.clear();
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
  private async updateGroup(name: string, _delta?: OBC.ModelIdMap) {
    const state = this.ensureGroup(name);
    if (!this.world) return;
    const renderer = this.getRenderer();
    const pass = renderer.postproduction.outlinePass;

    // Make sure the pass knows about this group (palette + material +
    // container). The Outliner's ensureGroup only tracks selection state.
    if (!pass.hasGroup(name)) pass.addGroup(name);

    if (name === DEFAULT_GROUP && this.outlinePositions) {
      await this.updatePoints();
    }

    const fragments = this.components.get(OBC.FragmentsManager);
    const map = state.map;

    // Snapshot current attachments so we can diff after the queries.
    const previouslyAttached = new Map<string, Set<THREE.Mesh>>();
    for (const [modelId, tiles] of state.attached) {
      previouslyAttached.set(modelId, new Set(tiles));
    }
    const nextAttached = new Map<string, Set<THREE.Mesh>>();

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
          const chunks = (await (model as any).getItemDrawChunks(
            localIds,
          )) as Array<{
            tileId: number;
            position: Uint32Array;
            size: Uint32Array;
          }>;
          return { modelId, chunks };
        })(),
      );
    }

    const results = await Promise.all(queries);

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

    // Detach proxies that were attached before but aren't in the new
    // result. Covers item removal and items that moved to a different
    // group.
    for (const [modelId, prev] of previouslyAttached) {
      const next = nextAttached.get(modelId) ?? new Set<THREE.Mesh>();
      for (const tile of prev) {
        if (!next.has(tile)) pass.detachOutlinedTile(tile);
      }
    }

    state.attached = nextAttached;
  }

  /**
   * Detach every proxy this group has attached and clear the tracking
   * map. Used by `clean` and `remove`.
   */
  private detachAll(state: OutlineGroupState) {
    if (!this.world) {
      state.attached = new Map();
      return;
    }
    const pass = this.getRenderer().postproduction.outlinePass;
    for (const [, tiles] of state.attached) {
      for (const tile of tiles) pass.detachOutlinedTile(tile);
    }
    state.attached = new Map();
  }

  /**
   * Subscribe to a model's tile lifecycle events so we can refresh
   * outline proxies when tiles load (LOD swap, viewport change, etc.)
   * or unload. Idempotent per model id.
   */
  private bindModelTileEvents(modelId: string) {
    if (this._tileListeners.has(modelId)) return;
    const fragments = this.components.get(OBC.FragmentsManager);
    const model = fragments.list.get(modelId);
    if (!model) return;
    const refresh = () => {
      // Re-sync any group whose selection still references this model.
      // Cheap for groups that don't.
      for (const [groupName, state] of this._groups) {
        const localIds = state.map[modelId];
        if (localIds && localIds.size > 0) {
          void this.updateGroup(groupName);
        }
      }
    };
    model.tiles.onItemSet.add(refresh);
    model.tiles.onItemDeleted.add(refresh);
    this._tileListeners.set(modelId, () => {
      model.tiles.onItemSet.remove(refresh);
      model.tiles.onItemDeleted.remove(refresh);
    });
  }

  private cleanPoints() {
    if (this._mesh) {
      const disposer = this.components.get(OBC.Disposer);
      disposer.destroy(this._mesh, true, true);
    }
    this._mesh = null;
  }

  private async updatePoints() {
    const defaultMap = this._groups.get(DEFAULT_GROUP)?.map ?? {};
    let items = 0;

    for (const [, localIds] of Object.entries(defaultMap)) {
      items += localIds.size;
    }

    this._points.geometry.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(new Float32Array(items * 3), 3),
    );

    const fragments = this.components.get(OBC.FragmentsManager);
    const positions = await fragments.getPositions(defaultMap);

    for (let i = 0; i < positions.length; i++) {
      const { x, y, z } = positions[i];
      this._points.geometry.attributes.position.array[i * 3] = x;
      this._points.geometry.attributes.position.array[i * 3 + 1] = y;
      this._points.geometry.attributes.position.array[i * 3 + 2] = z;
    }

    this._points.geometry.attributes.position.needsUpdate = true;
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
