import * as THREE from "three";
import { Component, Disposable, Event, Components } from "../../core";
import { Classifier } from "../Classifier";
import { FragmentManager } from "../FragmentManager";

// TODO: Improve, Clean up and document

export class Exploder extends Component implements Disposable {
  static readonly uuid = "d260618b-ce88-4c7d-826c-6debb91de3e2" as const;

  enabled = true;

  height = 10;
  groupName = "storeys";

  /** {@link Disposable.onDisposed} */
  readonly onDisposed = new Event();

  list = new Set<string>();

  constructor(components: Components) {
    super(components);
    components.add(Exploder.uuid, this);
  }

  dispose() {
    this.list.clear();
    this.onDisposed.trigger();
    this.onDisposed.reset();
  }

  set(active: boolean) {
    if (!this.enabled) return;
    const classifier = this.components.get(Classifier);
    const fragments = this.components.get(FragmentManager);

    const factor = active ? 1 : -1;
    let i = 0;

    const groups = classifier.list[this.groupName];

    const yTransform = new THREE.Matrix4();

    for (const groupName in groups) {
      yTransform.elements[13] = i * factor * this.height;
      for (const fragID in groups[groupName]) {
        const fragment = fragments.list.get(fragID);
        const itemsID = groupName + fragID;
        const areItemsExploded = this.list.has(itemsID);
        if (
          !fragment ||
          (active && areItemsExploded) ||
          (!active && !areItemsExploded)
        ) {
          continue;
        }
        if (active) {
          this.list.add(itemsID);
        } else {
          this.list.delete(itemsID);
        }

        const ids = groups[groupName][fragID];
        fragment.applyTransform(ids, yTransform);
      }
      i++;
    }
  }
}
