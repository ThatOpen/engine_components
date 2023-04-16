import * as THREE from "three";
import { Fragment } from "bim-fragment";
import { Fragments } from "../";
import { Disposable } from "../../../";

// TODO: Clean up and document

export class FragmentMaterials implements Disposable {
  originals: {
    [guid: string]: THREE.Material[];
  } = {};

  materials = new Set<THREE.Material>();

  constructor(private fragments: Fragments) {}

  dispose() {
    for (const mat of this.materials) {
      mat.dispose();
    }
    this.materials.clear();
  }

  apply(
    material: THREE.Material,
    fragmentIDs = Object.keys(this.fragments.list)
  ) {
    this.materials.add(material);
    for (const guid of fragmentIDs) {
      const fragment = this.fragments.list[guid];
      this.save(fragment);
      fragment.mesh.material = material as any;
    }
  }

  reset(fragmentIDs = Object.keys(this.fragments.list)) {
    for (const guid of fragmentIDs) {
      const fragment = this.fragments.list[guid];
      const originalMats = this.originals[guid];
      if (originalMats) {
        fragment.mesh.material = originalMats;
      }
    }
  }

  private save(fragment: Fragment) {
    if (!this.originals[fragment.id]) {
      this.originals[fragment.id] = fragment.mesh.material as THREE.Material[];
    }
  }
}
