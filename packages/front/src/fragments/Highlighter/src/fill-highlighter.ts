import * as THREE from "three";
import * as FRAGS from "@thatopen/fragments";
import { IndexFragmentMap } from "../../../core";

/**
 * A class to manage and highlight edges fill meshes based on selected fragments. Useful for highlighting sectioned elements in floorplan and section views.
 */
export class FillHighlighter {
  private _meshes = new Map<
    string,
    Map<string, THREE.Mesh<THREE.BufferGeometry, THREE.MeshBasicMaterial>>
  >();

  /**
   * Highlights edges fill meshes based on selected fragments.
   */
  highlight(
    name: string,
    mesh: THREE.Mesh,
    color: THREE.Color,
    selection: FRAGS.FragmentIdMap,
  ) {
    if (!mesh.userData.indexFragmentMap || !mesh.geometry.index) {
      return;
    }

    const { userData } = mesh;
    const fragMap = userData.indexFragmentMap as IndexFragmentMap;

    const indices: number[] = [];

    const index = mesh.geometry.index.array;

    for (const [faceIndex, map] of fragMap) {
      for (const fragID in map) {
        if (selection[fragID]) {
          for (const id of map[fragID]) {
            if (selection[fragID].has(id)) {
              const i1 = index[faceIndex * 3];
              const i2 = index[faceIndex * 3 + 1];
              const i3 = index[faceIndex * 3 + 2];
              indices.push(i1, i2, i3);
            }
          }
        }
      }
    }

    if (!this._meshes.has(name)) {
      this._meshes.set(name, new Map());
    }

    const map = this._meshes.get(name) as Map<string, THREE.Mesh>;

    if (!map.has(mesh.uuid)) {
      const newMaterial = new THREE.MeshBasicMaterial({
        depthTest: false,
        side: 2,
        color,
      });
      const newGeometry = new THREE.BufferGeometry();
      newGeometry.attributes = mesh.geometry.attributes;
      const newMesh = new THREE.Mesh(newGeometry, newMaterial);
      newMesh.frustumCulled = false;
      map.set(mesh.uuid, newMesh);
    }

    const highlightedMesh = map.get(mesh.uuid) as THREE.Mesh<
      THREE.BufferGeometry,
      THREE.MeshBasicMaterial
    >;

    highlightedMesh.position.copy(mesh.position);

    if (mesh.parent && mesh.parent !== highlightedMesh.parent) {
      mesh.parent.add(highlightedMesh);
    }

    highlightedMesh.geometry.setIndex(indices);
    highlightedMesh.material.color.copy(color);
  }

  /**
   * Clears the highlighted meshes for a specific style or all styles.
   *
   * @param name - The name of the style to clear. If not provided, clears all styles.
   *
   */
  clear(name?: string) {
    for (const [styleName, map] of this._meshes) {
      if (name && name !== styleName) {
        continue;
      }
      for (const [_id, mesh] of map) {
        mesh.removeFromParent();
      }
    }
  }

  dispose() {
    for (const [_styleName, map] of this._meshes) {
      for (const [_id, mesh] of map) {
        mesh.removeFromParent();
        mesh.geometry.attributes = {};
        mesh.geometry.dispose();
        mesh.material.dispose();
      }
    }
    this._meshes.clear();
  }
}
