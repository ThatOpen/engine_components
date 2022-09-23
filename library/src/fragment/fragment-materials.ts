import { Material } from "three";
import { Fragment } from "bim-fragment";
import { Fragments } from ".";

export class FragmentMaterials {
  originals: {
    [guid: string]: Material[];
  } = {};

  constructor(private fragments: Fragments) {}

  apply(
    material: Material,
    fragmentIDs = Object.keys(this.fragments.fragments)
  ) {
    for (const guid of fragmentIDs) {
      const fragment = this.fragments.fragments[guid];
      this.save(fragment);
      fragment.mesh.material = material as any;
    }
  }

  reset(fragmentIDs = Object.keys(this.fragments.fragments)) {
    for (const guid of fragmentIDs) {
      const fragment = this.fragments.fragments[guid];
      const originalMats = this.originals[guid];
      if (originalMats) {
        fragment.mesh.material = originalMats;
      }
    }
  }

  private save(fragment: Fragment) {
    if (!this.originals[fragment.id]) {
      this.originals[fragment.id] = fragment.mesh.material as Material[];
    }
  }
}
