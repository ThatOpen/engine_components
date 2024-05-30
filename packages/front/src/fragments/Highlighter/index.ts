import * as THREE from "three";
import * as FRAGS from "@thatopen/fragments";
import * as OBC from "@thatopen/components";
import { FragmentIdMap, FragmentMesh } from "@thatopen/fragments";
// import { FragmentManager, World } from "@thatopen/components";
// import { PostproductionRenderer } from "../../core";

// TODO: Clean up and document

interface HighlightEvents {
  [highlighterName: string]: {
    onHighlight: OBC.Event<FRAGS.FragmentIdMap>;
    onClear: OBC.Event<null>;
  };
}

export interface HighlighterConfig {
  selectName: string;
  hoverName: string;
  selectionColor: THREE.Color;
  hoverColor: THREE.Color;
  autoHighlightOnClick: boolean;
  world: OBC.World | null;
}

export class Highlighter
  extends OBC.Component
  implements OBC.Disposable, OBC.Configurable<HighlighterConfig>
{
  static readonly uuid = "cb8a76f2-654a-4b50-80c6-66fd83cafd77" as const;

  readonly onDisposed = new OBC.Event();

  readonly onBeforeUpdate = new OBC.Event<Highlighter>();

  readonly onAfterUpdate = new OBC.Event<Highlighter>();

  readonly onSetup = new OBC.Event<Highlighter>();

  isSetup = false;

  enabled = true;

  events: HighlightEvents = {};

  multiple: "none" | "shiftKey" | "ctrlKey" = "ctrlKey";

  zoomFactor = 1.5;

  zoomToSelection = false;

  backupColor: THREE.Color | null = null;

  selection: {
    [selectionID: string]: FRAGS.FragmentIdMap;
  } = {};

  config: Required<HighlighterConfig> = {
    selectName: "select",
    hoverName: "hover",
    selectionColor: new THREE.Color("#BCF124"),
    hoverColor: new THREE.Color("#6528D7"),
    autoHighlightOnClick: true,
    world: null,
  };

  colors = new Map<string, THREE.Color>();

  private _mouseState = {
    down: false,
    moved: false,
  };

  constructor(components: OBC.Components) {
    super(components);
    this.components.add(Highlighter.uuid, this);
  }

  async dispose() {
    this.setupEvents(false);
    this.onBeforeUpdate.reset();
    this.onAfterUpdate.reset();

    this.selection = {};
    for (const name in this.events) {
      this.events[name].onClear.reset();
      this.events[name].onHighlight.reset();
    }
    this.onSetup.reset();
    this.events = {};
    this.onDisposed.trigger(Highlighter.uuid);
    this.onDisposed.reset();
  }

  add(name: string, color: THREE.Color) {
    if (this.selection[name] || this.colors.has(name)) {
      throw new Error("A selection with that name already exists!");
    }
    this.colors.set(name, color);
    this.selection[name] = {};
    this.events[name] = {
      onHighlight: new OBC.Event(),
      onClear: new OBC.Event(),
    };
  }

  async highlight(
    name: string,
    removePrevious = true,
    zoomToSelection = this.zoomToSelection,
    exclude: FragmentIdMap = {},
  ) {
    if (!this.enabled) {
      return null;
    }

    if (!this.config.world) {
      throw new Error("No world found in config!");
    }

    const world = this.config.world;

    if (!this.selection[name]) {
      throw new Error(`Selection ${name} does not exist.`);
    }

    const fragments = this.components.get(OBC.FragmentsManager);
    const meshes = fragments.meshes;

    const casters = this.components.get(OBC.Raycasters);
    const caster = casters.get(world);
    const result = caster.castRay(meshes);

    if (!result || !result.face) {
      this.clear(name);
      return null;
    }

    const mesh = result.object as FragmentMesh;
    const geometry = mesh.geometry;
    const instanceID = result.instanceId;
    if (!geometry || instanceID === undefined) {
      return null;
    }

    const itemID = mesh.fragment.getItemID(instanceID);
    if (itemID === null) {
      throw new Error("Item ID not found!");
    }

    const group = mesh.fragment.group;
    if (!group) {
      throw new Error("Fragment must belong to a FragmentsGroup!");
    }

    const found = group.getFragmentMap([itemID]);

    const filtered: FragmentIdMap = {};

    for (const fragID in found) {
      const ids = found[fragID];
      const excludeFrag = exclude[fragID];

      for (const id of ids) {
        if (!excludeFrag || !excludeFrag.has(id)) {
          if (!filtered[fragID]) {
            filtered[fragID] = new Set();
          }
          filtered[fragID].add(id);
        }
      }
    }

    await this.highlightByID(name, filtered, removePrevious, zoomToSelection);

    return { id: itemID, fragments: found };
  }

  async highlightByID(
    name: string,
    ids: FragmentIdMap,
    removePrevious = true,
    zoomToSelection = this.zoomToSelection,
  ) {
    if (!this.enabled) return;

    if (removePrevious) {
      this.clear(name);
    }

    const fragments = this.components.get(OBC.FragmentsManager);

    const color = this.colors.get(name);
    if (!color) {
      throw new Error("Color for selection not found!");
    }

    for (const fragID in ids) {
      const fragment = fragments.list.get(fragID);
      if (!fragment) {
        continue;
      }
      if (!this.selection[name][fragID]) {
        this.selection[name][fragID] = new Set<number>();
      }
      const itemIDs = ids[fragID];
      for (const itemID of itemIDs) {
        this.selection[name][fragID].add(itemID);
        fragment.setColor(color, [itemID]);
      }
    }

    this.events[name].onHighlight.trigger(this.selection[name]);

    if (zoomToSelection) {
      await this.zoomSelection(name);
    }
  }

  /**
   * Clears any selection previously made by calling {@link highlight}.
   */
  clear(name?: string) {
    const names = name ? [name] : Object.keys(this.selection);
    for (const name of names) {
      const fragments = this.components.get(OBC.FragmentsManager);

      const selected = this.selection[name];

      for (const fragID in this.selection[name]) {
        const fragment = fragments.list.get(fragID);

        if (!fragment) continue;
        const ids = selected[fragID];
        if (!ids) continue;
        if (this.backupColor) {
          fragment.setColor(this.backupColor);
        } else {
          fragment.resetColor(ids);
        }
      }

      this.events[name].onClear.trigger(null);
      this.selection[name] = {};
    }
  }

  setup(config?: Partial<HighlighterConfig>) {
    this.config = { ...this.config, ...config };
    this.add(this.config.selectName, this.config.selectionColor);
    this.add(this.config.hoverName, this.config.hoverColor);
    this.setupEvents(true);
    this.enabled = true;
    this.isSetup = true;
    this.onSetup.trigger(this);
  }

  private async zoomSelection(name: string) {
    if (!this.config.world) {
      throw new Error("No world found in config!");
    }
    const world = this.config.world;

    if (!world.camera.hasCameraControls()) {
      return;
    }

    const bbox = this.components.get(OBC.BoundingBoxer);
    const fragments = this.components.get(OBC.FragmentsManager);
    bbox.reset();

    const selected = this.selection[name];
    if (!Object.keys(selected).length) {
      return;
    }

    for (const fragID in selected) {
      const fragment = fragments.list.get(fragID);
      if (!fragment) continue;
      const ids = selected[fragID];
      bbox.addMesh(fragment.mesh, ids);
    }

    const sphere = bbox.getSphere();
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

  private setupEvents(active: boolean) {
    if (!this.config.world) {
      throw new Error("No world found while setting up events!");
    }

    if (this.config.world.isDisposing) {
      return;
    }

    if (!this.config.world.renderer) {
      throw new Error("The given world doesn't have a renderer!");
    }

    const container = this.config.world.renderer.three.domElement;

    const onHighlight = this.events[this.config.selectName].onHighlight;
    onHighlight.remove(this.clearHover);

    container.removeEventListener("mousedown", this.onMouseDown);
    container.removeEventListener("mouseup", this.onMouseUp);
    container.removeEventListener("mousemove", this.onMouseMove);

    if (active) {
      onHighlight.add(this.clearHover);
      container.addEventListener("mousedown", this.onMouseDown);
      container.addEventListener("mouseup", this.onMouseUp);
      container.addEventListener("mousemove", this.onMouseMove);
    }
  }

  private clearHover = () => {
    this.selection[this.config.hoverName] = {};
  };

  private onMouseDown = () => {
    if (!this.enabled) return;
    this._mouseState.down = true;
  };

  private onMouseUp = async (event: MouseEvent) => {
    const world = this.config.world;
    if (!world) {
      throw new Error("No world found!");
    }
    if (!world.renderer) {
      throw new Error("This world doesn't have a renderer!");
    }
    if (!this.enabled) return;
    if (event.target !== world.renderer.three.domElement) return;
    this._mouseState.down = false;
    if (this._mouseState.moved || event.button !== 0) {
      this._mouseState.moved = false;
      return;
    }
    this._mouseState.moved = false;
    if (this.config.autoHighlightOnClick) {
      const mult = this.multiple === "none" ? true : !event[this.multiple];
      await this.highlight(this.config.selectName, mult, this.zoomToSelection);
    }
  };

  private onMouseMove = async () => {
    if (!this.enabled) return;
    if (this._mouseState.moved) {
      this.clear(this.config.hoverName);
      return;
    }

    this._mouseState.moved = this._mouseState.down;
    const excluded = this.selection[this.config.selectName];
    await this.highlight(this.config.hoverName, true, false, excluded);
  };
}
