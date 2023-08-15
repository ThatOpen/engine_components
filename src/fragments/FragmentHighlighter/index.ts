import * as THREE from "three";
import { Fragment } from "bim-fragment";
import { FragmentMesh } from "bim-fragment/fragment-mesh";
import { Component, Disposable, Event, FragmentIdMap } from "../../base-types";
import { FragmentBoundingBox, FragmentManager } from "../index";
import { Components, SimpleCamera } from "../../core";
import { toCompositeID } from "../../utils";

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

export class FragmentHighlighter
  extends Component<HighlightMaterials>
  implements Disposable
{
  name: string = "FragmentHighlighter";
  enabled = true;
  highlightMats: HighlightMaterials = {};
  events: HighlightEvents = {};

  zoomFactor = 1.5;

  private tempMatrix = new THREE.Matrix4();
  selection: {
    [selectionID: string]: FragmentIdMap;
  } = {};

  private _components: Components;
  private _fragments: FragmentManager;
  private _bbox = new FragmentBoundingBox();

  constructor(components: Components, fragments: FragmentManager) {
    super();
    this._components = components;
    this._fragments = fragments;
  }

  get(): HighlightMaterials {
    return this.highlightMats;
  }

  dispose() {
    for (const matID in this.highlightMats) {
      const mats = this.highlightMats[matID] || [];
      for (const mat of mats) {
        mat.dispose();
      }
    }
    this.highlightMats = {};
  }

  add(name: string, material?: THREE.Material[]) {
    if (this.highlightMats[name]) {
      throw new Error("A highlight with this name already exists.");
    }

    this.highlightMats[name] = material;
    this.selection[name] = {};
    this.events[name] = {
      onHighlight: new Event(),
      onClear: new Event(),
    };

    this.update();
  }

  update() {
    for (const fragmentID in this._fragments.list) {
      const fragment = this._fragments.list[fragmentID];
      this.addHighlightToFragment(fragment);
    }
  }

  highlight(name: string, removePrevious = true, zoomToSelection = false) {
    if (!this.enabled) return null;
    this.checkSelection(name);

    const fragments: Fragment[] = [];
    const meshes = this._fragments.meshes;
    const result = this._components.raycaster.castRay(meshes);

    if (!result) {
      this.clear(name);
      return null;
    }

    const mesh = result.object as FragmentMesh;
    const geometry = mesh.geometry;
    const index = result.face?.a;
    const instanceID = result.instanceId;
    if (!geometry || index === undefined || instanceID === undefined) {
      return null;
    }

    if (removePrevious) {
      this.clear(name);
    }

    if (!this.selection[name][mesh.uuid]) {
      this.selection[name][mesh.uuid] = new Set<string>();
    }

    fragments.push(mesh.fragment);
    const blockID = mesh.fragment.getVertexBlockID(geometry, index);

    const itemID = mesh.fragment
      .getItemID(instanceID, blockID)
      .replace(/\..*/, "");

    const idNum = parseInt(itemID, 10);
    this.selection[name][mesh.uuid].add(itemID);
    this.addComposites(mesh, idNum, name);
    this.updateFragmentHighlight(name, mesh.uuid);

    const group = mesh.fragment.group;
    if (group) {
      const keys = group.data[idNum][0];
      for (let i = 0; i < keys.length; i++) {
        const fragKey = keys[i];
        const fragID = group.keyFragments[fragKey];
        const fragment = this._fragments.list[fragID];
        fragments.push(fragment);
        if (!this.selection[name][fragID]) {
          this.selection[name][fragID] = new Set<string>();
        }
        this.selection[name][fragID].add(itemID);
        this.addComposites(fragment.mesh, idNum, name);
        this.updateFragmentHighlight(name, fragID);
      }
    }

    if (zoomToSelection) {
      this.zoomSelection(name);
    }

    return { id: itemID, fragments };
  }

  highlightByID(
    name: string,
    ids: FragmentIdMap,
    removePrevious = true,
    zoomToSelection = false
  ) {
    if (!this.enabled) return;
    if (removePrevious) {
      this.clear(name);
    }
    const styles = this.selection[name];
    for (const fragID in ids) {
      if (!styles[fragID]) {
        styles[fragID] = new Set<string>();
      }
      const fragment = this._fragments.list[fragID];

      const idsNum = new Set<number>();
      for (const id of ids[fragID]) {
        styles[fragID].add(id);
        idsNum.add(parseInt(id, 10));
      }
      for (const id of idsNum) {
        this.addComposites(fragment.mesh, id, name);
      }
      this.updateFragmentHighlight(name, fragID);
    }

    if (zoomToSelection) {
      this.zoomSelection(name);
    }
  }

  /**
   * Clears any selection previously made by calling {@link highlight}.
   */
  clear(name?: string) {
    const names = name ? [name] : Object.keys(this.selection);
    for (const name of names) {
      this.clearStyle(name);
    }
  }

  private zoomSelection(name: string) {
    this._bbox.reset();
    const higlight = this.selection[name];
    if (!Object.keys(higlight).length) {
      return;
    }
    for (const fragID in higlight) {
      const fragment = this._fragments.list[fragID];
      const highlight = fragment.fragments[name];
      if (highlight) {
        this._bbox.addFragment(highlight);
      }
    }
    const sphere = this._bbox.getSphere();
    sphere.radius *= this.zoomFactor;
    const camera = this._components.camera as SimpleCamera;
    camera.controls.fitToSphere(sphere, true);
  }

  private addComposites(mesh: FragmentMesh, itemID: number, name: string) {
    const composites = mesh.fragment.composites[itemID];
    if (composites) {
      for (let i = 1; i < composites; i++) {
        const compositeID = toCompositeID(itemID, i);
        this.selection[name][mesh.uuid].add(compositeID);
      }
    }
  }

  private clearStyle(name: string) {
    for (const fragID in this.selection[name]) {
      const fragment = this._fragments.list[fragID];
      if (!fragment) continue;
      const selection = fragment.fragments[name];
      if (selection) {
        selection.mesh.removeFromParent();
      }
    }
    this.events[name].onClear.trigger(null);
    this.selection[name] = {};
  }

  private updateFragmentHighlight(name: string, fragmentID: string) {
    const ids = this.selection[name][fragmentID];
    const fragment = this._fragments.list[fragmentID];
    if (!fragment) return;
    const selection = fragment.fragments[name];
    if (!selection) return;

    // #region Old child/parent code
    // const scene = this._components.scene.get();
    // scene.add(selection.mesh); //If we add selection.mesh directly to the scene, it won't be coordinated unless we do so manually.
    // #endregion

    // #region New child/parent code
    const fragmentParent = fragment.mesh.parent;
    if (!fragmentParent) return;
    fragmentParent.add(selection.mesh);
    // #endregion

    const isBlockFragment = selection.blocks.count > 1;
    if (isBlockFragment) {
      const blockIDs: number[] = [];
      for (const id of ids) {
        const { blockID } = fragment.getInstanceAndBlockID(id);
        if (fragment.blocks.visibleIds.has(blockID)) {
          blockIDs.push(blockID);
        }
      }

      fragment.getInstance(0, this.tempMatrix);
      selection.setInstance(0, {
        ids: Array.from(ids),
        transform: this.tempMatrix,
      });

      selection.blocks.add(blockIDs, true);
    } else {
      let i = 0;
      for (const id of ids) {
        selection.mesh.count = i + 1;
        const { instanceID } = fragment.getInstanceAndBlockID(id);
        fragment.getInstance(instanceID, this.tempMatrix);
        selection.setInstance(i, { ids: [id], transform: this.tempMatrix });
        i++;
      }
    }
    this.events[name].onHighlight.trigger(this.selection[name]);
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
        subFragment.mesh.renderOrder = 2;
        subFragment.mesh.frustumCulled = false;
      }
    }
  }
}
