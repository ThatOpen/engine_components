/* eslint-disable no-dupe-class-members */
import * as THREE from "three";
import * as OBC from "@thatopen/components";
import { DataMap } from "@thatopen/fragments";
import * as FRAGS from "@thatopen/fragments";
import { HighlighterConfig, HighlightEvents } from "./src";

/**
 * This component allows highlighting and selecting fragments in a 3D scene. 📕 [Tutorial](https://docs.thatopen.com/Tutorials/Components/Front/Highlighter). 📘 [API](https://docs.thatopen.com/api/@thatopen/components-front/classes/Highlighter).
 */
export class Highlighter
  extends OBC.Component
  implements OBC.Disposable, OBC.Eventable
{
  /**
   * A unique identifier for the component.
   * This UUID is used to register the component within the Components system.
   */
  static readonly uuid = "cb8a76f2-654a-4b50-80c6-66fd83cafd77" as const;

  /** {@link OBC.Disposable.onDisposed} */
  readonly onDisposed = new OBC.Event();

  /** {@link OBC.Updateable.onBeforeUpdate} */
  readonly onBeforeUpdate = new OBC.Event<Highlighter>();

  /** {@link OBC.Updateable.onAfterUpdate} */
  readonly onAfterUpdate = new OBC.Event<Highlighter>();

  /** Event triggered when the Highlighter is setup. */
  readonly onSetup = new OBC.Event<Highlighter>();

  /** Indicates whether the Highlighter is setup. */
  isSetup = false;

  /** {@link OBC.Component.enabled} */
  enabled = true;

  /** Stores the events triggered by the Highlighter. */
  events: HighlightEvents = {};

  /** Determines the multiple selection behavior. */
  multiple: "none" | "shiftKey" | "ctrlKey" = "ctrlKey";

  /** Zoom factor applied when zooming to selection. */
  zoomFactor = 1.5;

  /** Indicates whether to zoom to the selection when highlighting. */
  zoomToSelection = false;

  /** Stores the backup color before selection. */
  backupColor: THREE.Color | null = null;

  /** Stores the current selection. */
  selection: {
    [selectionID: string]: OBC.ModelIdMap;
  } = {};

  /** Stores the configuration options for the Highlighter. */
  config: Required<HighlighterConfig> = {
    selectName: "select",
    selectionColor: null,
    autoHighlightOnClick: true,
    world: null,
    selectEnabled: true,
    selectMaterialDefinition: {
      color: new THREE.Color("#BCF124"),
      renderedFaces: FRAGS.RenderedFaces.ONE,
      opacity: 1,
      transparent: false,
    },
  };

  /** Stores the styles used for highlighting selections. If null, the highlighter won't color geometries (useful for selection without coloring). */
  readonly styles = new DataMap<
    string,
    Omit<FRAGS.MaterialDefinition, "customId"> | null
  >();

  /** Styles with auto toggle will be unselected when selected twice. */
  autoToggle = new Set<string>();

  /** Position of the mouse on mouseDown. */
  private mouseDownPosition = { x: 0, y: 0 };

  /** Threshhold on how much the mouse have to move until its considered movement */
  mouseMoveThreshold = 5;

  /** If defined, only the specified elements will be selected by the specified style. */
  selectable: { [name: string]: OBC.ModelIdMap } = {};

  /** Manager to easily toggle and reset all events. */
  eventManager = new OBC.EventManager();

  private _mouseState = {
    down: false,
    moved: false,
  };

  constructor(components: OBC.Components) {
    super(components);
    this.components.add(Highlighter.uuid, this);
    this.eventManager.list.add(this.onSetup);
    this.eventManager.list.add(this.onDisposed);
    this.setStyleEvents();
  }

  private setStyleEvents() {
    this.styles.onBeforeDelete.add(async ({ key: style }) => {
      await this.clear(style);
      delete this.selection[style];
      if (!(style in this.events)) return;
      const { onClear, onHighlight, onBeforeHighlight } = this.events[style];
      this.eventManager.list.delete(onClear);
      this.eventManager.list.delete(onHighlight);
      this.eventManager.list.delete(onBeforeHighlight);
      delete this.events[style];
    });

    this.styles.onItemSet.add(({ key: style }) => {
      this.selection[style] = {};
      const onHighlight = new OBC.Event();
      const onBeforeHighlight = new OBC.Event();
      const onClear = new OBC.Event();
      this.events[style] = {
        onHighlight,
        onClear,
        onBeforeHighlight,
      };
      this.eventManager.add([onClear, onHighlight, onBeforeHighlight]);
    });
  }

  /** {@link Disposable.dispose} */
  async dispose() {
    this.setupEvents(false);
    this.onBeforeUpdate.reset();
    this.onAfterUpdate.reset();

    this.selection = {};
    this.styles.clear();

    this.onDisposed.trigger(Highlighter.uuid);
    this.eventManager.reset();
    this.isSetup = false;
  }
  /**
   * Adds a new selection with the given name and color.
   * Throws an error if a selection with the same name already exists.
   *
   * @param name - The name of the new selection.
   * @param color - The color to be used for highlighting the selection.
   *
   * @throws Will throw an error if a selection with the same name already exists.
   * @deprecated Use highlighter.styles.set() instead
   */
  add(style: FRAGS.MaterialDefinition & { customId: string }): void;
  add(customId: string): void;
  add(arg: (FRAGS.MaterialDefinition & { customId: string }) | string): void {
    console.warn(
      "highlighter.add() is deprecated, use highlighter.styles.set() instead",
    );
    if (typeof arg === "string") {
      this.styles.set(arg, null);
    } else {
      const { customId } = arg;
      this.styles.set(customId, arg);
    }
  }

  /**
   * Removes the specified selection.
   *
   * @param name - The name of the new selection.
   * @deprecated use highlighter.styles.delete
   */
  async remove(name: string) {
    console.warn(
      "highlighter.remove() is deprecated, use highlighter.styles.delete() instead",
    );
    this.styles.delete(name);
  }

  /**
   * Highlights a fragment based on a raycast from the mouse position.
   *
   * @param name - The name of the selection.
   * @param removePrevious - Whether to remove previous highlights.
   * @param zoomToSelection - Whether to zoom to the highlighted selection.
   * @param exclude - Fragments to exclude from the highlight.
   *
   * @returns The highlighted fragment and its ID, or null if no fragment was highlighted.
   *
   * @throws Will throw an error if the world or a required component is not found.
   * @throws Will throw an error if the selection does not exist.
   * @throws Will throw an error if the fragment or its geometry is not found.
   * @throws Will throw an error if the item ID is not found.
   * @throws Will throw an error if the fragment does not belong to a FragmentsGroup.
   */
  async highlight(
    name: string,
    removePrevious = true,
    zoomToSelection = this.zoomToSelection,
    exclude: OBC.ModelIdMap | null = null,
  ) {
    if (!this.enabled) return;

    if (!this.config.world) {
      throw new Error("No world found in config!");
    }

    const world = this.config.world;

    if (!this.selection[name]) {
      throw new Error(`Selection ${name} does not exist.`);
    }

    // TODO: Adapt clip mesh higlight to new 3D system
    // Make clip mesh inside fragments? E.g. add the clipped face to the fragment mesh
    const casters = this.components.get(OBC.Raycasters);
    const caster = casters.get(world);
    // TODO: Fix type error
    const result = (await caster.castRay()) as any;

    // const mesh = result.object as FragmentMesh;

    if (!result || result.localId === undefined || result.localId === null) {
      if (removePrevious) this.clear(name);
      return;
    }

    const {
      localId,
      fragments: { modelId },
    } = result;

    const found: OBC.ModelIdMap = { [modelId]: new Set([localId]) };

    await this.highlightByID(
      name,
      found,
      removePrevious,
      zoomToSelection,
      exclude,
      true,
    );
  }

  private _fromHighlight = false;

  // TODO: Make parameters an object?

  /**
   * Highlights a fragment based on a given fragment ID map.
   *
   * @param name - The name of the selection.
   * @param modelIdMap - The fragment ID map to highlight.
   * @param removePrevious - Whether to remove previous highlights.
   * @param zoomToSelection - Whether to zoom to the highlighted selection.
   * @param exclude - Fragments to exclude from the highlight.
   * @param fillMesh - The fill mesh to also highlight, if any.
   * @param isPicking - Whether this function is called when picking with the mouse.
   *
   * @returns Promise that resolves when the highlighting is complete.
   *
   * @throws Will throw an error if the selection does not exist.
   * @throws Will throw an error if the fragment or its geometry is not found.
   * @throws Will throw an error if the item ID is not found.
   * @throws Will throw an error if the fragment does not belong to a FragmentsGroup.
   */
  async highlightByID(
    name: string,
    modelIdMap: OBC.ModelIdMap,
    removePrevious = true,
    zoomToSelection = this.zoomToSelection,
    exclude: OBC.ModelIdMap | null = null,
    isPicking = false,
  ) {
    if (!this.enabled) return;
    this._fromHighlight = true;

    this.events[name].onBeforeHighlight.trigger(this.selection[name]);

    if (removePrevious) {
      await this.clear(name);
    }

    let map = OBC.ModelIdMapUtils.clone(modelIdMap);
    const fragments = this.components.get(OBC.FragmentsManager)

    // Include the delta model ids in the parent modelIdMap
    for (const [modelId, ids] of Object.entries(modelIdMap)) {
      const model = fragments.list.get(modelId)
      if (!(model?.isDeltaModel && model.parentModelId)) continue
      OBC.ModelIdMapUtils.add(map, {[model.parentModelId]: ids})
    }

    const selectables = this.selectable?.[name];
    if (selectables) {
      // Include the parent modelIds in the delta modelIdMap from selectables
      const selectable = OBC.ModelIdMapUtils.clone(selectables)
      for (const [modelId, ids] of Object.entries(selectable)) {
        const model = fragments.list.get(modelId)
        if (!model?.deltaModelId) continue
        OBC.ModelIdMapUtils.add(selectable, {[model.deltaModelId]: ids})
      }
      
      map = OBC.ModelIdMapUtils.intersect([map, selectable])
    }
    
    if (exclude) {
      // Include the parent modelIds in the exclusion modelIdMap from exclude
      const exclusion = OBC.ModelIdMapUtils.clone(exclude)
      for (const [modelId, ids] of Object.entries(exclusion)) {
        const model = fragments.list.get(modelId)
        if (!model?.deltaModelId) continue
        OBC.ModelIdMapUtils.add(exclusion, {[model.deltaModelId]: ids})
      }

      map = OBC.ModelIdMapUtils.intersect([map, exclude])
    }

    // Apply autotoggle when picking with the mouse
    if (isPicking && this.autoToggle.has(name)) {
      const clearedItems: { [key: string]: Set<number> } = {};
      let clearedItemsFound = false;

      for (const modelId in map) {
        const selected = this.selection[name][modelId];
        if (!selected) continue;
        const ids = map[modelId];
        for (const id of ids) {
          if (selected.has(id)) {
            selected.delete(id);
            let items = clearedItems[modelId];
            if (!items) {
              items = new Set();
              clearedItems[modelId] = items;
            }
            items.add(id);
            clearedItemsFound = true;
          } else {
            selected.add(id);
          }
        }
        map[modelId] = selected;
      }
      if (clearedItemsFound) {
        this.events[name].onClear.trigger(clearedItems);
        if (name === this.config.selectName) {
          this.restorePreviousColors(clearedItems);
        }
      }
    }

    this.updateStyleMap(name, map);
    this.events[name].onHighlight.trigger(this.selection[name]);

    // TODO: Adapt clip mesh higlight to new 3D system
    // Make clip mesh inside fragments? E.g. add the clipped face to the fragment mesh

    this._fromHighlight = false;
    await this.updateColors();
    if (zoomToSelection) await this.zoomSelection(map);
  }

  /**
   * Updates the colors of highlighted fragments based on the current selection and styles.
   * @returns Resolves when all highlight updates and core state updates are completed.
   */
  async updateColors() {
    const fragments = this.components.get(OBC.FragmentsManager);
    const promises = [fragments.resetHighlight()];
    for (const [style, modelIdMap] of Object.entries(this.selection)) {
      const definition = this.styles.get(style);
      if (!definition) continue;
      const map =
        style === "select" || !this.styles.get(this.config.selectName)
          ? modelIdMap
          : this.getMapWithoutSelection(style);
      if (!map) continue;
      promises.push(
        fragments.highlight({ ...definition, customId: style }, map),
      );
    }
    promises.push(fragments.core.update(true));
    await Promise.allSettled(promises);
  }

  private updateStyleMap(name: string, selection: OBC.ModelIdMap) {
    const modelIdMap = this.selection[name];

    // Update the style selection based
    for (const modelId in selection) {
      let items = modelIdMap[modelId];
      if (!items) {
        items = new Set();
        modelIdMap[modelId] = items;
      }
      const ids = selection[modelId];
      for (const id of ids) {
        items.add(id);
      }
    }

    // Removes the style selection from all other styles, except the select style
    if (name === this.config.selectName) return;
    for (const [style, selectionMap] of Object.entries(this.selection)) {
      if (style === this.config.selectName || style === name) continue;

      const styleSelection = selectionMap;
      for (const [modelId, ids] of Object.entries(modelIdMap)) {
        const styleIds = styleSelection[modelId];
        if (!styleIds) continue;

        for (const id of ids) {
          styleIds.delete(id);
        }
      }
    }
  }

  /**
   * Retrieves a map of model IDs to element IDs, excluding elements that are also present in the selection map
   * specified by `this.config.selectName`. Optionally filters the results based on a provided filter map.
   *
   * @param style - The style name to retrieve the selection from.
   * @param filter - An optional map of model IDs to element IDs used to further filter the results. If provided,
   *                 only elements present in this filter will be included in the result.
   * @returns A map of model IDs to element IDs, excluding selected elements and optionally filtered elements.
   *          Returns `null` if the resulting map is empty.
   * @throws Error - If the specified style does not exist in the selection.
   */
  private getMapWithoutSelection(style: string, filter?: OBC.ModelIdMap) {
    const styleSelection = this.selection[style];
    if (!styleSelection) {
      throw new Error(`Style ${style} does not exist.`);
    }

    const selectSelection = this.selection[this.config.selectName] ?? {};
    const result: OBC.ModelIdMap = {};

    for (const modelId in styleSelection) {
      const styleIds = styleSelection[modelId];
      const selectIds =
        style === this.config.selectName
          ? new Set<number>() // If the style is "select", don't remove elements from itself
          : selectSelection[modelId] ?? new Set<number>();

      const filteredIds = Array.from(styleIds).filter(
        (id) => !selectIds.has(id) && (!filter || filter[modelId]?.has(id)),
      );

      if (filteredIds.length > 0) {
        result[modelId] = new Set(filteredIds);
      }
    }

    return Object.keys(result).length > 0 ? result : null;
  }

  /**
   * Clears the selection for the given name or all selections if no name is provided.
   *
   * @param name - The name of the selection to clear. If not provided, clears all selections.
   * @param filter - The only items to unselect. If not provided, all items will be unselected.
   *
   */
  async clear(name?: string, _filter?: OBC.ModelIdMap) {
    const styles = name ? [name] : Object.keys(this.selection);
    const filter = _filter ?? undefined;

    for (const style of styles) {
      const modelIdMap = this.selection[style] ?? {};
      const map = filter ?? modelIdMap;
      if (style === this.config.selectName) this.restorePreviousColors();
      const clearedItems: Record<string, Set<number>> = {};
      for (const [modelId, localIds] of Object.entries(map)) {
        const ids = modelIdMap[modelId];
        if (!ids) continue;
        for (const id of localIds) {
          const wasDeleted = ids.delete(id);
          if (!wasDeleted) continue;
          let items = clearedItems[modelId];
          if (!items) {
            items = new Set();
            clearedItems[modelId] = items;
          }
          items.add(id);
        }
      }
      if (Object.keys(clearedItems).length > 0) {
        this.events[style].onClear.trigger(clearedItems);
      }

      // Clean up selection map for this style
      this.selection[style] = {};
    }

    if (!this._fromHighlight) {
      await this.updateColors();
    }
  }

  /**
   * Sets up the Highlighter with the provided configuration.
   *
   * @param config - Optional configuration for the Highlighter.
   * If not provided, the Highlighter will use the default configuration.
   *
   * @throws Will throw an error if the world or a required component is not found.
   * @throws Will throw an error if the selection already exists.
   * @throws Will throw an error if the fragment or its geometry is not found.
   * @throws Will throw an error if the item ID is not found.
   * @throws Will throw an error if the fragment does not belong to a FragmentsGroup.
   */
  setup(config?: Partial<HighlighterConfig>) {
    if (this.isSetup) return;
    this.config = { ...this.config, ...config };
    const { selectName, selectionColor, selectMaterialDefinition } =
      this.config;

    if (this.config.world) {
      this.components.get(OBC.Raycasters).get(this.config.world);
    }

    if (selectMaterialDefinition) {
      if (selectionColor) {
        console.warn(
          "highlighter.config.selectionColor is deprecated, use selectMaterialDefinition instead",
        );
        selectMaterialDefinition.color = selectionColor;
      }
      this.styles.set(selectName, selectMaterialDefinition);
    } else {
      this.styles.set(selectName, null);
    }

    this.autoToggle.add(this.config.selectName);
    this.setupEvents(true);
    this.enabled = true;
    this.isSetup = true;
    this.onSetup.trigger(this);
  }

  private async zoomSelection(items: OBC.ModelIdMap) {
    if (!this.config.world) {
      throw new Error("No world found in config!");
    }
    const world = this.config.world;

    let hasObjects = false;
    for (const modelId in items) {
      if (items[modelId].size > 0) {
        hasObjects = true;
        break;
      }
    }

    if (!hasObjects) {
      return;
    }

    if (!world.camera.hasCameraControls()) {
      return;
    }

    const fragments = this.components.get(OBC.FragmentsManager);
    const bboxes = (await fragments.getBBoxes(items)) as THREE.Box3[];

    const sphere = new THREE.Sphere();
    const bbox = new THREE.Box3();
    for (const box of bboxes) {
      bbox.union(box);
    }
    bbox.getBoundingSphere(sphere);

    const i = Infinity;
    const mi = -Infinity;
    const { x, y, z } = sphere.center;
    const isInf = sphere.radius === i || x === i || y === i || z === i;
    const isMInf = sphere.radius === mi || x === mi || y === mi || z === mi;
    const isZero = sphere.radius === 0;
    if (isInf || isMInf || isZero) {
      return;
    }

    sphere.radius *= this.zoomFactor;
    const camera = world.camera;
    await camera.controls.fitToSphere(sphere, true);
  }

  private restorePreviousColors = (modelIdMap = this.selection.select) => {
    for (const [style, selectionMap] of Object.entries(this.selection)) {
      if (style === this.config.selectName) continue;
      const definition = this.styles.get(style);
      if (!definition) continue;
      const styleSelection: OBC.ModelIdMap = {};
      for (const [modelId, localIds] of Object.entries(modelIdMap)) {
        const highlightedIds = selectionMap[modelId]; // currently highligthed items
        if (!highlightedIds) continue;
        const filteredItems = [...localIds].filter((id) =>
          highlightedIds.has(id),
        );
        if (filteredItems.length === 0) continue;
        styleSelection[modelId] = new Set(filteredItems);
      }
    }
  };

  private setupEvents(active: boolean) {
    if (!this.config.world) {
      console.log("No world found while setting up events!");
      return;
    }

    if (this.config.world.isDisposing) {
      return;
    }

    if (!this.config.world.renderer) {
      throw new Error("The given world doesn't have a renderer!");
    }

    const container = this.config.world.renderer.three.domElement;

    container.removeEventListener("mousedown", this.onMouseDown);
    container.removeEventListener("mouseup", this.onMouseUp);
    container.removeEventListener("pointermove", this.onMouseMove);

    if (active) {
      container.addEventListener("mousedown", this.onMouseDown);
      container.addEventListener("mouseup", this.onMouseUp);
      container.addEventListener("pointermove", this.onMouseMove);
    }
  }

  private onMouseDown = (e: MouseEvent) => {
    if (!this.enabled) return;
    if (this.debounceTimeout) clearTimeout(this.debounceTimeout);
    this.mouseDownPosition = { x: e.clientX, y: e.clientY };
    this._mouseState.down = true;
  };

  private debounceTimeout: number | null = null;

  private onMouseUp = async (event: MouseEvent) => {
    if (!this.enabled) return;

    const { world, autoHighlightOnClick, selectEnabled } = this.config;
    if (!world) {
      throw new Error("No world found!");
    }
    if (!world.renderer) {
      throw new Error("This world doesn't have a renderer!");
    }
    if (event.target !== world.renderer.three.domElement) return;
    this._mouseState.down = false;
    if (this._mouseState.moved || event.button !== 0) {
      this._mouseState.moved = false;
      return;
    }
    this._mouseState.moved = false;
    if (autoHighlightOnClick && selectEnabled) {
      const mult = this.multiple === "none" ? true : !event[this.multiple];
      await this.highlight(this.config.selectName, mult, this.zoomToSelection);
    }
  };

  private onMouseMove = async (e: MouseEvent) => {
    if (!this.enabled) return;

    // Calculate the distance the mouse has moved since mouse down
    const dx = e.clientX - this.mouseDownPosition.x;
    const dy = e.clientY - this.mouseDownPosition.y;
    const moveDistance = Math.sqrt(dx * dx + dy * dy);

    if (this._mouseState.moved) {
      return;
    }

    // If the distance is greater than the threshold, set dragging to true
    if (moveDistance > this.mouseMoveThreshold) {
      this._mouseState.moved = this._mouseState.down;
    }
  };
}

export * from "./src";
