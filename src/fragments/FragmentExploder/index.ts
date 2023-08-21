import * as THREE from "three";
import { Component, Disposable, UI } from "../../base-types";
import { FragmentClassifier, FragmentManager } from "../index";
import { toCompositeID } from "../../utils";
import { Button } from "../../ui";
import { Components } from "../../core";

// TODO: Clean up and document

export class FragmentExploder
  extends Component<Set<string>>
  implements Disposable, UI
{
  name = "FragmentExploder";
  height = 10;
  groupName = "storeys";
  enabled = false;

  uiElement: { main: Button };

  private _explodedFragments = new Set<string>();
  private _fragments: FragmentManager;
  private _groups: FragmentClassifier;

  get(): Set<string> {
    return this._explodedFragments;
  }

  constructor(
    components: Components,
    fragments: FragmentManager,
    groups: FragmentClassifier
  ) {
    super();
    this._fragments = fragments;
    this._groups = groups;

    const main = new Button(components);
    this.uiElement = { main };
    main.tooltip = "Explode";
    main.materialIcon = "splitscreen";
    main.onclick = () => {
      if (this.enabled) {
        this.reset();
      } else {
        this.explode();
      }
    };
  }

  dispose() {
    this._explodedFragments.clear();
    this.uiElement.main.dispose();
    (this._fragments as any) = null;
    (this._groups as any) = null;
  }

  explode() {
    this.enabled = true;
    this.update();
  }

  reset() {
    this.enabled = false;
    this.update();
  }

  update() {
    const factor = this.enabled ? 1 : -1;
    let i = 0;

    const systems = this._groups.get();
    const groups = systems[this.groupName];

    const mergedIDHeightMap: { [frag: string]: { [id: string]: number } } = {};

    const yTransform = new THREE.Matrix4();

    for (const groupName in groups) {
      yTransform.elements[13] = i * factor * this.height;
      for (const fragID in groups[groupName]) {
        const fragment = this._fragments.list[fragID];
        const customID = groupName + fragID;
        if (!fragment) {
          continue;
        }
        if (this.enabled && this._explodedFragments.has(customID)) {
          continue;
        }
        if (!this.enabled && !this._explodedFragments.has(customID)) {
          continue;
        }
        if (this.enabled) {
          this._explodedFragments.add(customID);
        } else {
          this._explodedFragments.delete(customID);
        }

        if (fragment.blocks.count === 1) {
          // For instanced fragments
          const ids = groups[groupName][fragID];
          for (const id of ids) {
            const tempMatrix = new THREE.Matrix4();
            const { instanceID } = fragment.getInstanceAndBlockID(id);
            fragment.getInstance(instanceID, tempMatrix);
            tempMatrix.premultiply(yTransform);
            fragment.mesh.setMatrixAt(instanceID, tempMatrix);
            const composites = fragment.composites[id];
            if (composites) {
              for (let i = 1; i < composites; i++) {
                const idNum = parseInt(id, 10);
                const compID = toCompositeID(idNum, i);
                const { instanceID } = fragment.getInstanceAndBlockID(compID);
                fragment.getInstance(instanceID, tempMatrix);
                tempMatrix.premultiply(yTransform);
                fragment.mesh.setMatrixAt(instanceID, tempMatrix);
              }
            }
          }
          fragment.mesh.instanceMatrix.needsUpdate = true;
        } else {
          if (!mergedIDHeightMap[fragID]) {
            mergedIDHeightMap[fragID] = {};
          }
          const ids = groups[groupName][fragID];
          for (const id of ids) {
            mergedIDHeightMap[fragID][id] = i * factor * this.height;
          }
        }
      }
      i++;
    }

    const v = new THREE.Vector3();

    // Update merged fragments
    for (const fragID in mergedIDHeightMap) {
      const heights = mergedIDHeightMap[fragID];
      const fragment = this._fragments.list[fragID];
      const geometry = fragment.mesh.geometry;
      const position = geometry.attributes.position;
      for (let i = 0; i < geometry.index.count; i++) {
        const index = geometry.index.array[i];
        const blockID = geometry.attributes.blockID.array[index];
        const id = fragment.getItemID(0, blockID);
        const height = heights[id];
        if (height === undefined) continue;
        yTransform.elements[13] = height;

        const x = position.array[index * 3];
        const y = position.array[index * 3 + 1];
        const z = position.array[index * 3 + 2];
        v.set(x, y, z);
        v.applyMatrix4(yTransform);
        position.setXYZ(index, v.x, v.y, v.z);
      }
      position.needsUpdate = true;
    }
  }
}
