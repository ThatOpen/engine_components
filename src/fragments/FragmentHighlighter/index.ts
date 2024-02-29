import * as THREE from "three";
import { Fragment, FragmentMesh } from "bim-fragment";
import {
  Disposable,
  Updateable,
  Event,
  FragmentIdMap,
  Configurable,
} from "../../base-types";
import { Component } from "../../base-types/component";
import { FragmentManager } from "../FragmentManager";
import { FragmentBoundingBox } from "../FragmentBoundingBox";
import { Components } from "../../core/Components";
import { SimpleCamera } from "../../core/SimpleCamera";
import { ToolComponent } from "../../core/ToolsComponent";
import { PostproductionRenderer } from "../../navigation/PostproductionRenderer";

// TODO: Clean up and document

interface HighlightEvents {
  [highlighterName: string]: {
    onHighlight: Event<FragmentIdMap>;
    onClear: Event<null>;
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
}

export class FragmentHighlighter
  extends Component<HighlightMaterials>
  implements Disposable, Configurable<FragmentHighlighterConfig>
{
  static readonly uuid = "cb8a76f2-654a-4b50-80c6-66fd83cafd77" as const;

  /** {@link Disposable.onDisposed} */
  readonly onDisposed = new Event<string>();

  /** {@link Updateable.onBeforeUpdate} */
  readonly onBeforeUpdate = new Event<FragmentHighlighter>();

  /** {@link Updateable.onAfterUpdate} */
  readonly onAfterUpdate = new Event<FragmentHighlighter>();

  needsUpdate = false;

  /** {@link Configurable.isSetup} */
  isSetup = false;

  enabled = true;
  highlightMats: HighlightMaterials = {};
  events: HighlightEvents = {};

  multiple: "none" | "shiftKey" | "ctrlKey" = "ctrlKey";
  zoomFactor = 1.5;
  zoomToSelection = false;

  selection: {
    [selectionID: string]: FragmentIdMap;
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
  };

  private _mouseState = {
    down: false,
    moved: false,
  };

  get outlineEnabled() {
    return this._outlineEnabled;
  }

  set outlineEnabled(value: boolean) {
    this._outlineEnabled = value;
    if (!value) {
      delete this._postproduction.customEffects.outlinedMeshes.fragments;
    }
  }

  private get _postproduction() {
    if (!(this.components.renderer instanceof PostproductionRenderer)) {
      throw new Error("Postproduction renderer is needed for outlines!");
    }
    const renderer = this.components.renderer as PostproductionRenderer;
    return renderer.postproduction;
  }

  constructor(components: Components) {
    super(components);
    this.components.tools.add(FragmentHighlighter.uuid, this);
    const fragmentManager = components.tools.get(FragmentManager);
    fragmentManager.onFragmentsDisposed.add(this.onFragmentsDisposed);
  }

  private onFragmentsDisposed = (data: {
    groupID: string;
    fragmentIDs: string[];
  }) => {
    this.disposeOutlinedMeshes(data.fragmentIDs);
  };

  get(): HighlightMaterials {
    return this.highlightMats;
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
    const fragmentManager = this.components.tools.get(FragmentManager);
    fragmentManager.onFragmentsDisposed.remove(this.onFragmentsDisposed);
    this.events = {};
    await this.onDisposed.trigger(FragmentHighlighter.uuid);
    this.onDisposed.reset();
  }

  async add(name: string, material?: THREE.Material[]) {
    if (this.highlightMats[name]) {
      throw new Error("A highlight with this name already exists.");
    }

    this.highlightMats[name] = material;
    this.selection[name] = {};
    this.events[name] = {
      onHighlight: new Event(),
      onClear: new Event(),
    };

    await this.updateHighlight();
  }

  async updateHighlight() {
    if (!this.fillEnabled) {
      return;
    }
    await this.onBeforeUpdate.trigger(this);
    const fragments = this.components.tools.get(FragmentManager);
    for (const fragmentID in fragments.list) {
      const fragment = fragments.list[fragmentID];
      this.addHighlightToFragment(fragment);
      const outlinedMesh = this._outlinedMeshes[fragmentID];
      if (outlinedMesh) {
        fragment.mesh.updateMatrixWorld(true);
        outlinedMesh.position.set(0, 0, 0);
        outlinedMesh.rotation.set(0, 0, 0);
        outlinedMesh.scale.set(1, 1, 1);
        outlinedMesh.applyMatrix4(fragment.mesh.matrixWorld);
      }
    }
    await this.onAfterUpdate.trigger(this);
  }

  async highlight(
    name: string,
    removePrevious = true,
    zoomToSelection = this.zoomToSelection
  ) {
    if (!this.enabled) return null;
    this.checkSelection(name);

    const fragments = this.components.tools.get(FragmentManager);
    const fragList: Fragment[] = [];
    const meshes = fragments.meshes;
    const result = this.components.raycaster.castRay(meshes);

    if (!result || !result.face) {
      await this.clear(name);
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
      await this.clear(name);
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
    await this.regenerate(name, mesh.fragment.id);

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
        const fragment = fragments.list[fragID];
        fragList.push(fragment);

        if (!this.selection[name][fragID]) {
          this.selection[name][fragID] = new Set<number>();
        }

        this.selection[name][fragID].add(itemID);
        await this.regenerate(name, fragID);
      }
    }

    await this.events[name].onHighlight.trigger(this.selection[name]);

    if (zoomToSelection) {
      await this.zoomSelection(name);
    }

    return { id: itemID, fragments: fragList };
  }

  async highlightByID(
    name: string,
    ids: FragmentIdMap,
    removePrevious = true,
    zoomToSelection = this.zoomToSelection
  ) {
    if (!this.enabled) return;
    if (removePrevious) {
      await this.clear(name);
    }
    const styles = this.selection[name];
    for (const fragID in ids) {
      if (!styles[fragID]) {
        styles[fragID] = new Set<number>();
      }

      for (const id of ids[fragID]) {
        styles[fragID].add(id);
      }

      await this.regenerate(name, fragID);
    }

    await this.events[name].onHighlight.trigger(this.selection[name]);

    if (zoomToSelection) {
      await this.zoomSelection(name);
    }
  }

  /**
   * Clears any selection previously made by calling {@link highlight}.
   */
  async clear(name?: string) {
    await this.clearFills(name);
    if (!name || !this.excludeOutline.has(name)) {
      await this.clearOutlines();
    }
  }

  readonly onSetup = new Event<FragmentHighlighter>();

  async setup(config?: Partial<FragmentHighlighterConfig>) {
    if (config?.selectionMaterial) {
      this.config.selectionMaterial.dispose();
    }
    if (config?.hoverMaterial) {
      this.config.hoverMaterial.dispose();
    }
    this.config = { ...this.config, ...config };
    this.outlineMaterial.color.set(0xf0ff7a);
    this.excludeOutline.add(this.config.hoverName);
    await this.add(this.config.selectName, [this.config.selectionMaterial]);
    await this.add(this.config.hoverName, [this.config.hoverMaterial]);
    this.setupEvents(true);
    this.enabled = true;
    this.isSetup = true;
    await this.onSetup.trigger(this);
  }

  private async regenerate(name: string, fragID: string) {
    if (this.fillEnabled) {
      await this.updateFragmentFill(name, fragID);
    }
    if (this._outlineEnabled) {
      await this.updateFragmentOutline(name, fragID);
    }
  }

  private async zoomSelection(name: string) {
    if (!this.fillEnabled && !this._outlineEnabled) {
      return;
    }

    const bbox = this.components.tools.get(FragmentBoundingBox);
    const fragments = this.components.tools.get(FragmentManager);
    bbox.reset();

    const selected = this.selection[name];
    if (!Object.keys(selected).length) {
      return;
    }
    for (const fragID in selected) {
      const fragment = fragments.list[fragID];
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
    const camera = this.components.camera as SimpleCamera;
    await camera.controls.fitToSphere(sphere, true);
  }

  private async clearStyle(name: string) {
    const fragments = this.components.tools.get(FragmentManager);

    for (const fragID in this.selection[name]) {
      const fragment = fragments.list[fragID];
      if (!fragment) continue;
      const selection = fragment.fragments[name];
      if (selection) {
        selection.mesh.removeFromParent();
      }
    }

    await this.events[name].onClear.trigger(null);
    this.selection[name] = {};
  }

  private async updateFragmentFill(name: string, fragmentID: string) {
    const fragments = this.components.tools.get(FragmentManager);

    const ids = this.selection[name][fragmentID];
    const fragment = fragments.list[fragmentID];
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

  private async clearFills(name: string | undefined) {
    const names = name ? [name] : Object.keys(this.selection);
    for (const name of names) {
      await this.clearStyle(name);
    }
  }

  private async clearOutlines() {
    const effects = this._postproduction.customEffects;
    const fragmentsOutline = effects.outlinedMeshes.fragments;
    if (fragmentsOutline) {
      fragmentsOutline.meshes.clear();
    }
    for (const fragID in this._outlinedMeshes) {
      const mesh = this._outlinedMeshes[fragID];
      mesh.count = 0;
    }
  }

  private async updateFragmentOutline(name: string, fragmentID: string) {
    const fragments = this.components.tools.get(FragmentManager);

    if (!this.selection[name][fragmentID]) {
      return;
    }

    if (this.excludeOutline.has(name)) {
      return;
    }

    const ids = this.selection[name][fragmentID];
    const fragment = fragments.list[fragmentID];
    if (!fragment) return;

    const geometry = fragment.mesh.geometry;
    const customEffects = this._postproduction.customEffects;

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
        fragment.capacity
      );
      newMesh.frustumCulled = false;
      newMesh.renderOrder = 999;
      fragment.mesh.updateMatrixWorld(true);
      newMesh.applyMatrix4(fragment.mesh.matrixWorld);
      this._outlinedMeshes[fragmentID] = newMesh;

      const scene = this.components.scene.get();
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
    const container = this.components.renderer.get().domElement;

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
    if (!this.enabled) return;
    if (event.target !== this.components.renderer.get().domElement) return;
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
      await this.clearFills(this.config.hoverName);
      return;
    }

    this._mouseState.moved = this._mouseState.down;
    await this.highlight(this.config.hoverName, true, false);
  };
}

ToolComponent.libraryUUIDs.add(FragmentHighlighter.uuid);
