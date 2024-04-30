import * as THREE from "three";
import * as FRAGS from "bim-fragment";
import * as OBC from "@thatopen/components";
import { Fragment, FragmentIdMap, FragmentMesh } from "bim-fragment";
import { World } from "@thatopen/components";
import { PostproductionRenderer } from "../../navigation";

// TODO: Clean up and document

interface HighlightEvents {
  [highlighterName: string]: {
    onHighlight: OBC.Event<FRAGS.FragmentIdMap>;
    onClear: OBC.Event<null>;
  };
}

interface HighlightMaterials {
  [name: string]: THREE.Material[] | undefined;
}

export interface FragmentHighlighterConfig {
  selectName: string;
  hoverName: string;
  selectionMaterial: THREE.Material;
  hoverMaterial: THREE.Material;
  autoHighlightOnClick: boolean;
  cullHighlightMeshes: boolean;
  world: OBC.World | null;
}

export class FragmentHighlighter
  extends OBC.Component
  implements OBC.Disposable, OBC.Configurable<FragmentHighlighterConfig>
{
  static readonly uuid = "cb8a76f2-654a-4b50-80c6-66fd83cafd77" as const;

  readonly onDisposed = new OBC.Event();

  readonly onBeforeUpdate = new OBC.Event<FragmentHighlighter>();

  readonly onAfterUpdate = new OBC.Event<FragmentHighlighter>();

  readonly onSetup = new OBC.Event<FragmentHighlighter>();

  needsUpdate = false;

  isSetup = false;

  enabled = true;
  highlightMats: HighlightMaterials = {};
  events: HighlightEvents = {};

  multiple: "none" | "shiftKey" | "ctrlKey" = "ctrlKey";
  zoomFactor = 1.5;
  zoomToSelection = false;

  selection: {
    [selectionID: string]: FRAGS.FragmentIdMap;
  } = {};

  excludeOutline = new Set<string>();

  fillEnabled = true;

  outlineMaterial = new THREE.MeshBasicMaterial({
    color: "white",
    transparent: true,
    depthTest: false,
    depthWrite: false,
    opacity: 0.4,
  });

  private _eventsActive = false;

  private _outlineEnabled = true;

  private _outlinedMeshes: { [fragID: string]: THREE.InstancedMesh } = {};
  private _invisibleMaterial = new THREE.MeshBasicMaterial({ visible: false });

  private _tempMatrix = new THREE.Matrix4();

  config: Required<FragmentHighlighterConfig> = {
    selectName: "select",
    hoverName: "hover",
    selectionMaterial: new THREE.MeshBasicMaterial({
      color: "#BCF124",
      transparent: true,
      opacity: 0.85,
      depthTest: true,
    }),
    hoverMaterial: new THREE.MeshBasicMaterial({
      color: "#6528D7",
      transparent: true,
      opacity: 0.2,
      depthTest: true,
    }),
    autoHighlightOnClick: true,
    cullHighlightMeshes: true,
    world: null,
  };

  private _mouseState = {
    down: false,
    moved: false,
  };

  constructor(components: OBC.Components) {
    super(components);
    this.components.add(FragmentHighlighter.uuid, this);
    const fragmentManager = components.get(OBC.FragmentManager);
    fragmentManager.onFragmentsDisposed.add(this.onFragmentsDisposed);
  }

  private onFragmentsDisposed = (data: {
    groupID: string;
    fragmentIDs: string[];
  }) => {
    this.disposeOutlinedMeshes(data.fragmentIDs);
  };

  getOutlineEnabled() {
    return this._outlineEnabled;
  }

  setOutlineEnabled(value: boolean, world: OBC.World) {
    this._outlineEnabled = value;
    if (!value) {
      const postproduction = this.getPostproduction(world);
      delete postproduction.customEffects.outlinedMeshes.fragments;
    }
  }

  getHoveredSelection() {
    return this.selection[this.config.hoverName];
  }

  private disposeOutlinedMeshes(fragmentIDs: string[]) {
    for (const id of fragmentIDs) {
      const mesh = this._outlinedMeshes[id];
      if (!mesh) continue;
      mesh.geometry.dispose();
      delete this._outlinedMeshes[id];
    }
  }

  async dispose() {
    this.setupEvents(false);
    this.config.hoverMaterial.dispose();
    this.config.selectionMaterial.dispose();
    this.onBeforeUpdate.reset();
    this.onAfterUpdate.reset();
    for (const matID in this.highlightMats) {
      const mats = this.highlightMats[matID] || [];
      for (const mat of mats) {
        mat.dispose();
      }
    }
    this.disposeOutlinedMeshes(Object.keys(this._outlinedMeshes));
    this.outlineMaterial.dispose();
    this._invisibleMaterial.dispose();
    this.highlightMats = {};
    this.selection = {};
    for (const name in this.events) {
      this.events[name].onClear.reset();
      this.events[name].onHighlight.reset();
    }
    this.onSetup.reset();
    const fragmentManager = this.components.get(OBC.FragmentManager);
    fragmentManager.onFragmentsDisposed.remove(this.onFragmentsDisposed);
    this.events = {};
    this.onDisposed.trigger(FragmentHighlighter.uuid);
    this.onDisposed.reset();
  }

  add(name: string, material?: THREE.Material[]) {
    if (this.highlightMats[name]) {
      throw new Error("A highlight with this name already exists.");
    }

    this.highlightMats[name] = material;
    this.selection[name] = {};
    this.events[name] = {
      onHighlight: new OBC.Event(),
      onClear: new OBC.Event(),
    };

    this.updateHighlight();
  }

  updateHighlight() {
    if (!this.fillEnabled) {
      return;
    }
    this.onBeforeUpdate.trigger(this);
    const fragments = this.components.get(OBC.FragmentManager);
    for (const [id, fragment] of fragments.list) {
      this.addHighlightToFragment(fragment);
      const outlinedMesh = this._outlinedMeshes[id];
      if (outlinedMesh) {
        fragment.mesh.updateMatrixWorld(true);
        outlinedMesh.position.set(0, 0, 0);
        outlinedMesh.rotation.set(0, 0, 0);
        outlinedMesh.scale.set(1, 1, 1);
        outlinedMesh.applyMatrix4(fragment.mesh.matrixWorld);
      }
    }
    this.onAfterUpdate.trigger(this);
  }

  async highlight(
    name: string,
    removePrevious = true,
    zoomToSelection = this.zoomToSelection,
  ) {
    if (!this.enabled) return null;
    if (!this.config.world) {
      throw new Error("No world found in config!");
    }

    const world = this.config.world;
    this.checkSelection(name);

    const fragments = this.components.get(OBC.FragmentManager);
    const fragList: Fragment[] = [];
    const meshes = fragments.meshes;

    const casters = this.components.get(OBC.Raycasters);
    const caster = casters.get(world);
    const result = caster.castRay(meshes);

    if (!result || !result.face) {
      this.clear(world, name);
      return null;
    }

    const mesh = result.object as FragmentMesh;
    const geometry = mesh.geometry;
    const index = result.face.a;
    const instanceID = result.instanceId;
    if (!geometry || index === undefined || instanceID === undefined) {
      return null;
    }

    if (removePrevious) {
      this.clear(world, name);
    }

    if (!this.selection[name][mesh.fragment.id]) {
      this.selection[name][mesh.fragment.id] = new Set<number>();
    }

    fragList.push(mesh.fragment);

    const itemID = mesh.fragment.getItemID(instanceID);
    if (itemID === null) {
      throw new Error("Item ID not found!");
    }

    this.selection[name][mesh.fragment.id].add(itemID);
    await this.regenerate(name, mesh.fragment.id, world);

    const group = mesh.fragment.group;
    if (group) {
      const data = group.data.get(itemID);
      if (!data) {
        throw new Error("Data not found!");
      }
      const keys = data[0];
      for (let i = 0; i < keys.length; i++) {
        const fragKey = keys[i];
        const fragID = group.keyFragments.get(fragKey);

        if (!fragID) {
          throw new Error("Fragment ID not found!");
        }

        if (fragID === mesh.fragment.id) continue;
        const fragment = fragments.list.get(fragID);
        if (!fragment) {
          throw new Error("Fragment not found!");
        }
        fragList.push(fragment);

        if (!this.selection[name][fragID]) {
          this.selection[name][fragID] = new Set<number>();
        }

        this.selection[name][fragID].add(itemID);
        await this.regenerate(name, fragID, world);
      }
    }

    this.events[name].onHighlight.trigger(this.selection[name]);

    if (zoomToSelection) {
      await this.zoomSelection(name, world);
    }

    return { id: itemID, fragments: fragList };
  }

  async highlightByID(
    name: string,
    ids: FragmentIdMap,
    removePrevious = true,
    zoomToSelection = this.zoomToSelection,
  ) {
    if (!this.enabled) return;

    if (!this.config.world) {
      throw new Error("No world found in config!");
    }

    const world = this.config.world;

    if (removePrevious) {
      this.clear(world, name);
    }

    const styles = this.selection[name];
    for (const fragID in ids) {
      if (!styles[fragID]) {
        styles[fragID] = new Set<number>();
      }

      for (const id of ids[fragID]) {
        styles[fragID].add(id);
      }

      await this.regenerate(name, fragID, world);
    }

    this.events[name].onHighlight.trigger(this.selection[name]);

    if (zoomToSelection) {
      await this.zoomSelection(name, world);
    }
  }

  /**
   * Clears any selection previously made by calling {@link highlight}.
   */
  clear(world: World, name?: string) {
    this.clearFills(name);
    if (!name || !this.excludeOutline.has(name)) {
      this.clearOutlines(world);
    }
  }

  setup(config?: Partial<FragmentHighlighterConfig>) {
    if (config?.selectionMaterial) {
      this.config.selectionMaterial.dispose();
    }
    if (config?.hoverMaterial) {
      this.config.hoverMaterial.dispose();
    }

    this.config = { ...this.config, ...config };
    this.outlineMaterial.color.set(0xf0ff7a);
    this.excludeOutline.add(this.config.hoverName);
    this.add(this.config.selectName, [this.config.selectionMaterial]);
    this.add(this.config.hoverName, [this.config.hoverMaterial]);
    this.setupEvents(true);
    this.enabled = true;
    this.isSetup = true;
    this.onSetup.trigger(this);
  }

  private async regenerate(name: string, fragID: string, world: OBC.World) {
    if (this.fillEnabled) {
      await this.updateFragmentFill(name, fragID);
    }
    if (this._outlineEnabled) {
      await this.updateFragmentOutline(name, fragID, world);
    }
  }

  private async zoomSelection(name: string, world: OBC.World) {
    if (!this.fillEnabled && !this._outlineEnabled) {
      return;
    }

    if (!world.camera.hasCameraControls()) {
      return;
    }

    const bbox = this.components.get(OBC.FragmentBoundingBox);
    const fragments = this.components.get(OBC.FragmentManager);
    bbox.reset();

    const selected = this.selection[name];
    if (!Object.keys(selected).length) {
      return;
    }
    for (const fragID in selected) {
      const fragment = fragments.list.get(fragID);
      if (!fragment) continue;
      if (this.fillEnabled) {
        const highlight = fragment.fragments[name];
        if (highlight) {
          bbox.addMesh(highlight.mesh);
        }
      }

      if (this._outlineEnabled && this._outlinedMeshes[fragID]) {
        bbox.addMesh(this._outlinedMeshes[fragID]);
      }
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

  private clearStyle(name: string) {
    const fragments = this.components.get(OBC.FragmentManager);

    for (const fragID in this.selection[name]) {
      const fragment = fragments.list.get(fragID);
      if (!fragment) continue;
      const selection = fragment.fragments[name];
      if (selection) {
        selection.mesh.removeFromParent();
      }
    }

    this.events[name].onClear.trigger(null);
    this.selection[name] = {};
  }

  private async updateFragmentFill(name: string, fragmentID: string) {
    const fragments = this.components.get(OBC.FragmentManager);

    const ids = this.selection[name][fragmentID];
    const fragment = fragments.list.get(fragmentID);
    if (!fragment) return;
    const selection = fragment.fragments[name];
    if (!selection) return;

    const fragmentParent = fragment.mesh.parent;
    if (!fragmentParent) return;

    fragmentParent.add(selection.mesh);
    selection.setVisibility(false);
    selection.setVisibility(true, ids);
  }

  private checkSelection(name: string) {
    if (!this.selection[name]) {
      throw new Error(`Selection ${name} does not exist.`);
    }
  }

  private addHighlightToFragment(fragment: Fragment) {
    for (const name in this.highlightMats) {
      if (!fragment.fragments[name]) {
        const material = this.highlightMats[name];
        const subFragment = fragment.addFragment(name, material);
        subFragment.group = fragment.group;
        subFragment.mesh.renderOrder = 2;
        subFragment.mesh.frustumCulled = false;
      }
    }
  }

  private clearFills(name: string | undefined) {
    const names = name ? [name] : Object.keys(this.selection);
    for (const name of names) {
      this.clearStyle(name);
    }
  }

  private clearOutlines(world: OBC.World) {
    const postproduction = this.getPostproduction(world);
    const effects = postproduction.customEffects;
    const fragmentsOutline = effects.outlinedMeshes.fragments;
    if (fragmentsOutline) {
      fragmentsOutline.meshes.clear();
    }
    for (const fragID in this._outlinedMeshes) {
      const mesh = this._outlinedMeshes[fragID];
      mesh.count = 0;
    }
  }

  private async updateFragmentOutline(
    name: string,
    fragmentID: string,
    world: OBC.World,
  ) {
    const fragments = this.components.get(OBC.FragmentManager);

    if (!this.selection[name][fragmentID]) {
      return;
    }

    if (this.excludeOutline.has(name)) {
      return;
    }

    const ids = this.selection[name][fragmentID];
    const fragment = fragments.list.get(fragmentID);
    if (!fragment) return;

    const geometry = fragment.mesh.geometry;
    const postproduciton = this.getPostproduction(world);
    const customEffects = postproduciton.customEffects;

    if (!customEffects.outlinedMeshes.fragments) {
      customEffects.outlinedMeshes.fragments = {
        meshes: new Set(),
        material: this.outlineMaterial,
      };
    }

    const outlineEffect = customEffects.outlinedMeshes.fragments;

    // Create a copy of the original fragment mesh for outline
    if (!this._outlinedMeshes[fragmentID]) {
      const newGeometry = new THREE.BufferGeometry();

      newGeometry.attributes = geometry.attributes;
      newGeometry.index = geometry.index;
      const newMesh = new THREE.InstancedMesh(
        newGeometry,
        this._invisibleMaterial,
        fragment.capacity,
      );
      newMesh.frustumCulled = false;
      newMesh.renderOrder = 999;
      fragment.mesh.updateMatrixWorld(true);
      newMesh.applyMatrix4(fragment.mesh.matrixWorld);
      this._outlinedMeshes[fragmentID] = newMesh;

      const scene = world.scene.three;
      scene.add(newMesh);
    }

    const outlineMesh = this._outlinedMeshes[fragmentID];
    outlineEffect.meshes.add(outlineMesh);

    let counter = 0;
    for (const id of ids) {
      const instancesIDs = fragment.getInstancesIDs(id);
      if (!instancesIDs) {
        throw new Error("Instances IDs not found!");
      }
      for (const instance of instancesIDs) {
        fragment.mesh.getMatrixAt(instance, this._tempMatrix);
        outlineMesh.setMatrixAt(counter++, this._tempMatrix);
      }
    }
    outlineMesh.count = counter;
    outlineMesh.instanceMatrix.needsUpdate = true;
  }

  private setupEvents(active: boolean) {
    if (!this.config.world) {
      return;
    }

    if (!this.config.world.renderer) {
      throw new Error("The given world doesn't have a renderer!");
    }

    const container = this.config.world.renderer.three.domElement;

    if (active === this._eventsActive) {
      return;
    }

    this._eventsActive = active;

    if (active) {
      container.addEventListener("mousedown", this.onMouseDown);
      container.addEventListener("mouseup", this.onMouseUp);
      container.addEventListener("mousemove", this.onMouseMove);
    } else {
      container.removeEventListener("mousedown", this.onMouseDown);
      container.removeEventListener("mouseup", this.onMouseUp);
      container.removeEventListener("mousemove", this.onMouseMove);
    }
  }

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
      this.clearFills(this.config.hoverName);
      return;
    }

    this._mouseState.moved = this._mouseState.down;
    await this.highlight(this.config.hoverName, true, false);
  };

  private getPostproduction(world: OBC.World) {
    if (!world.renderer) {
      throw new Error("The given world doesn't have a renderer!");
    }
    if (!(world.renderer instanceof PostproductionRenderer)) {
      throw new Error("Postproduction renderer is needed for outlines!");
    }
    const renderer = world.renderer as PostproductionRenderer;
    return renderer.postproduction;
  }
}
