import * as THREE from "three";
import { Fragment } from "bim-fragment";
import { Components } from "../components";
import { Fragments } from ".";

export class FragmentHighlighter {
  active = false;
  highlightMats: { [name: string]: THREE.Material[] | undefined } = {};

  private tempMatrix = new THREE.Matrix4();
  private selection: {
    [selectionID: string]: { [fragmentID: string]: Set<string> };
  } = {};

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
      this.clear(name);
      return null;
    }

    const mesh = result.object as THREE.Mesh;
    const geometry = mesh.geometry;
    const index = result.face?.a;
    const instanceID = result.instanceId;
    if (!geometry || !index || instanceID === undefined) {
      return null;
    }

    if (removePrevious) {
      this.clear(name);
    }

    if (!this.selection[name][mesh.uuid]) {
      this.selection[name][mesh.uuid] = new Set<string>();
    }

    const fragment = this.fragments.fragments[mesh.uuid];
    const blockID = fragment.getVertexBlockID(geometry, index);
    const itemID = fragment.getItemID(instanceID, blockID);
    this.selection[name][mesh.uuid].add(itemID);

    this.updateFragmentHighlight(name, mesh.uuid);

    return { id: mesh.uuid, fragment };
  }

  highlightByID(
    name: string,
    ids: { [fragmentID: string]: string[] },
    removePrevious = true
  ) {
    if (removePrevious) {
      this.clear(name);
    }
    const styles = this.selection[name];
    for (const fragID in ids) {
      if (!styles[fragID]) {
        styles[fragID] = new Set<string>();
      }
      for (const id of ids[fragID]) {
        styles[fragID].add(id);
      }
      this.updateFragmentHighlight(name, fragID);
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

  private clearStyle(name: string) {
    for (const fragID in this.selection[name]) {
      const fragment = this.fragments.fragments[fragID];
      if (!fragment) continue;
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
    if (!fragment) return;
    const selection = fragment.fragments[name];
    if (!selection) return;
    const scene = this.components.scene.get();
    const isBlockFragment = selection.blocks.count > 1;
    scene.add(selection.mesh);

    if (isBlockFragment) {
      const blockIDs: number[] = [];
      for (const id of ids) {
        const { blockID } = fragment.getInstanceAndBlockID(id);
        if (fragment.blocks.visibleIds.has(blockID)) {
          blockIDs.push(blockID);
        }
      }

      selection.setInstance(0, {
        ids: Array.from(ids),
        transform: new THREE.Matrix4(),
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
        fragment.addFragment(name, material);
        fragment.fragments[name].mesh.renderOrder = 1;
      }
    }
  }
}
