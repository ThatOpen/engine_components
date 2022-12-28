import * as THREE from "three";
import { Fragments } from "./fragment";

// export class ExploderHelper {
//   constructor() {}
//   get y() {}
//   set y() {}
// }

export class FragmentExploder {
  height = 10;
  groupName = "";

  // private transformedFragments = new Set<string>();

  constructor(public fragments: Fragments) {}

  explode() {
    this.transform(1);
  }

  reset() {
    this.transform(-1);
  }

  private transform(factor: number) {
    let i = 1;
    const groups = this.fragments.groups.groupSystems[this.groupName];
    for (const groupName in groups) {
      for (const fragID in groups[groupName]) {
        const fragment = this.fragments.fragments[fragID];
        const yTransform = this.getOffsetY(i * factor);
        if (fragment.blocks.count === 1) {
          // For instanced fragments
          const ids = groups[groupName][fragID];
          for (const id of ids) {
            const tempMatrix = new THREE.Matrix4();
            const { instanceID } = fragment.getInstanceAndBlockID(id);
            fragment.getInstance(instanceID, tempMatrix);
            tempMatrix.premultiply(yTransform);
            fragment.setInstance(instanceID, {
              transform: tempMatrix,
              ids: [id],
            });
          }
        } else {
          // For merged fragments
          const tempMatrix = new THREE.Matrix4();
          fragment.getInstance(0, tempMatrix);
          tempMatrix.premultiply(yTransform);
          fragment.setInstance(0, {
            transform: tempMatrix,
            ids: fragment.items,
          });
        }
        fragment.mesh.instanceMatrix.needsUpdate = true;
      }
      i++;
    }
  }

  private getOffsetY(y: number) {
    return new THREE.Matrix4().fromArray([
      1,
      0,
      0,
      0,
      0,
      1,
      0,
      0,
      0,
      0,
      1,
      0,
      0,
      y * this.height,
      0,
      1,
    ]);
  }
}
