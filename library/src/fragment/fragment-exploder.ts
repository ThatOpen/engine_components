import * as THREE from "three";
import { Fragments } from "./fragment";

export class FragmentExploder {
  height = 10;
  groupName = "";
  enabled = false;
  initialized = false;
  explodedFragments = new Set<string>();

  // private transformedFragments = new Set<string>();

  constructor(public fragments: Fragments) {}

  explode() {
    this.initialized = true;
    this.enabled = true;
    this.update();
  }

  reset() {
    this.initialized = true;
    this.enabled = false;
    this.update();
  }

  update() {
    if (!this.initialized) {
      return;
    }
    const factor = this.enabled ? 1 : -1;
    let i = 1;
    const groups = this.fragments.groups.groupSystems[this.groupName];
    for (const groupName in groups) {
      for (const fragID in groups[groupName]) {
        const fragment = this.fragments.fragments[fragID];
        const customID = groupName + fragID;
        if (!fragment) {
          continue;
        }
        if (this.enabled && this.explodedFragments.has(customID)) {
          continue;
        }
        if (!this.enabled && !this.explodedFragments.has(customID)) {
          continue;
        }
        if (this.enabled) {
          this.explodedFragments.add(customID);
        } else {
          this.explodedFragments.delete(customID);
        }

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
            this.updateMemoryCulling(fragID, id, yTransform);
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
          for (const id of fragment.items) {
            this.updateMemoryCulling(fragID, id, yTransform);
          }
        }
        fragment.mesh.instanceMatrix.needsUpdate = true;
      }
      i++;
    }
  }

  private updateMemoryCulling(
    fragID: string,
    itemID: string,
    yTransform: THREE.Matrix4
  ) {
    const tempMatrix = new THREE.Matrix4();
    const proxy = this.fragments.memoryCuller.fragmentMeshMap[fragID][itemID];
    if (!proxy) return;
    proxy.mesh.getMatrixAt(proxy.index, tempMatrix);
    tempMatrix.premultiply(yTransform);
    proxy.mesh.setMatrixAt(proxy.index, tempMatrix);
    proxy.mesh.instanceMatrix.needsUpdate = true;
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
