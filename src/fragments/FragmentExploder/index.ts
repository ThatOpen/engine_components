import * as THREE from "three";
import { Component, Disposable, UI, UIElement } from "../../base-types";
import { toCompositeID } from "../../utils";
import { Button } from "../../ui";
import { Components, ToolComponent } from "../../core";
import { FragmentClassifier } from "../FragmentClassifier";
import { FragmentManager } from "../FragmentManager";

// TODO: Clean up and document

export class FragmentExploder
  extends Component<Set<string>>
  implements Disposable, UI
{
  static readonly uuid = "d260618b-ce88-4c7d-826c-6debb91de3e2" as const;

  enabled = false;

  height = 10;
  groupName = "storeys";

  uiElement = new UIElement<{ main: Button }>();

  private _explodedFragments = new Set<string>();

  get(): Set<string> {
    return this._explodedFragments;
  }

  constructor(components: Components) {
    super(components);

    components.tools.add(FragmentExploder.uuid, this);

    if (components.uiEnabled) {
      this.setupUI(components);
    }
  }

  async dispose() {
    this._explodedFragments.clear();
    this.uiElement.dispose();
  }

  async explode() {
    this.enabled = true;
    await this.update();
  }

  async reset() {
    this.enabled = false;
    await this.update();
  }

  async update() {
    const classifier = await this.components.tools.get(FragmentClassifier);
    const fragments = await this.components.tools.get(FragmentManager);

    const factor = this.enabled ? 1 : -1;
    let i = 0;

    const systems = classifier.get();
    const groups = systems[this.groupName];

    const mergedIDHeightMap: { [frag: string]: { [id: string]: number } } = {};

    const yTransform = new THREE.Matrix4();

    for (const groupName in groups) {
      yTransform.elements[13] = i * factor * this.height;
      for (const fragID in groups[groupName]) {
        const fragment = fragments.list[fragID];
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
      const fragment = fragments.list[fragID];
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

  private setupUI(components: Components) {
    const main = new Button(components);
    this.uiElement.set({ main });
    main.tooltip = "Explode";
    main.materialIcon = "splitscreen";
    main.onClick.add(async () => {
      if (this.enabled) {
        await this.reset();
      } else {
        await this.explode();
      }
    });
  }
}

ToolComponent.libraryUUIDs.add(FragmentExploder.uuid);
