import * as THREE from "three";
import { Fragment } from "bim-fragment";
import { Components } from "../components";
import { Fragments } from ".";

export class FragmentHighlighter {
  active = false;
  highlightMats: { [name: string]: THREE.Material[] | undefined } = {};

  private tempMatrix = new THREE.Matrix4();
  private selection: { [id: string]: { [fragmentID: string]: string[] } } = {};

  constructor(private components: Components, private fragments: Fragments) {}

  add(name: string, material?: THREE.Material[]) {
    if (this.highlightMats[name]) {
      throw new Error("A highlight with this name already exists.");
    }

    this.highlightMats[name] = material;
    this.selection[name] = {};

    this.update();
  }

  update() {
    for (const fragmentID in this.fragments.fragments) {
      const fragment = this.fragments.fragments[fragmentID];
      this.addHighlightToFragment(fragment);
    }
  }

  highlight(name: string, removePrevious = true) {
    if (!this.active) return null;
    this.checkSelection(name);

    const meshes = this.fragments.fragmentMeshes;
    const result = this.components.raycaster.castRay(meshes);

    if (!result) {
      this.unHighlight(name);
      return null;
    }

    const mesh = result.object as THREE.Mesh;
    const geometry = mesh.geometry;
    const index = result.face?.a;
    const instanceID = result.instanceId;
    if (!geometry || !index || instanceID === undefined) {
      return null;
    }

    if (removePrevious || !this.selection[name][mesh.uuid]) {
      this.selection[name][mesh.uuid] = [];
    }

    const fragment = this.fragments.fragments[mesh.uuid];
    const blockID = fragment.getVertexBlockID(geometry, index);
    const itemID = fragment.getItemID(instanceID, blockID);
    this.selection[name][mesh.uuid].push(itemID);

    this.updateFragmentHighlight(name, mesh.uuid);

    return { id: mesh.uuid, fragment };
  }

  unHighlight(name: string) {
    for (const fragID in this.selection[name]) {
      const fragment = this.fragments.fragments[fragID];
      const selection = fragment.fragments[name];
      if (selection) {
        selection.mesh.removeFromParent();
      }
    }
    this.selection[name] = {};
  }

  private updateFragmentHighlight(name: string, fragmentID: string) {
    const ids = this.selection[name][fragmentID];
    const fragment = this.fragments.fragments[fragmentID];
    const selection = fragment.fragments[name];
    const scene = this.components.scene.get();
    const isBlockFragment = selection.blocks.count > 1;
    scene.add(selection.mesh);

    let i = 0;
    const blockIDs: number[] = [];
    for (const id of ids) {
      const { instanceID, blockID } = fragment.getInstanceAndBlockID(id);
      fragment.getInstance(instanceID, this.tempMatrix);
      selection.setInstance(i, { ids: [id], transform: this.tempMatrix });
      if (isBlockFragment) {
        blockIDs.push(blockID);
      }
      i++;
    }

    if (isBlockFragment) {
      selection.blocks.add(blockIDs, true);
    }

    selection.mesh.count = i;
  }

  private checkSelection(name: string) {
    if (!this.highlightMats[name]) {
      throw new Error(`Selection ${name} does not exist.`);
    }
  }

  /**
   * Clears any selection previously made by calling {@link highlight}.
   */
  clear() {
    const names = Object.keys(this.selection);
    for (const name of names) {
      this.unHighlight(name);
    }
  }

  private addHighlightToFragment(fragment: Fragment) {
    for (const name in this.highlightMats) {
      if (!fragment.fragments[name]) {
        const material = this.highlightMats[name];
        fragment.addFragment(name, material);
        fragment.fragments[name].mesh.renderOrder = 1;
      }
    }
  }
}
