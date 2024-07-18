import * as THREE from "three";
import { Component, Disposable, Event, Components } from "../../core";
import { Classifier } from "../Classifier";
import { FragmentsManager } from "../FragmentsManager";

/**
 * The Exploder component is responsible for managing the explosion of 3D model fragments (generally by floor). 📕 [Tutorial](https://docs.thatopen.com/Tutorials/Components/Core/Exploder). 📘 [API](https://docs.thatopen.com/api/@thatopen/components/classes/Exploder).
 */
export class Exploder extends Component implements Disposable {
  /**
   * A unique identifier for the component.
   * This UUID is used to register the component within the Components system.
   */
  static readonly uuid = "d260618b-ce88-4c7d-826c-6debb91de3e2" as const;

  /** {@link Disposable.onDisposed} */
  readonly onDisposed = new Event();

  /** {@link Component.enabled} */
  enabled = true;

  /**
   * The height of the explosion animation.
   * This property determines the vertical distance by which fragments are moved during the explosion.
   * Default value is 10.
   */
  height = 10;

  /**
   * The group name used for the explosion animation.
   * This property specifies the group of fragments that will be affected by the explosion.
   * Default value is "storeys".
   */
  groupName = "spatialStructures";

  /**
   * A set of strings representing the exploded items.
   * This set is used to keep track of which items have been exploded.
   */
  list = new Set<string>();

  constructor(components: Components) {
    super(components);
    components.add(Exploder.uuid, this);
  }

  /** {@link Disposable.dispose} */
  dispose() {
    this.list.clear();
    this.onDisposed.trigger();
    this.onDisposed.reset();
  }

  /**
   * Sets the explosion state of the fragments.
   *
   * @param active - A boolean indicating whether to activate or deactivate the explosion.
   *
   * @remarks
   * This method applies a vertical transformation to the fragments based on the `active` parameter.
   * If `active` is true, the fragments are moved upwards by a distance determined by the `height` property.
   * If `active` is false, the fragments are moved back to their original position.
   *
   * The method also keeps track of the exploded items using the `list` set.
   *
   * @throws Will throw an error if the `Classifier` or `FragmentsManager` components are not found in the `components` system.
   */
  set(active: boolean) {
    if (!this.enabled) return;
    const classifier = this.components.get(Classifier);
    const fragments = this.components.get(FragmentsManager);

    const factor = active ? 1 : -1;
    let i = 0;

    const groups = classifier.list[this.groupName];

    const yTransform = new THREE.Matrix4();

    for (const groupName in groups) {
      yTransform.elements[13] = i * factor * this.height;
      for (const fragID in groups[groupName].map) {
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

        const ids = groups[groupName].map[fragID];
        fragment.applyTransform(ids, yTransform);
        fragment.mesh.computeBoundingSphere();
        fragment.mesh.computeBoundingBox();
      }
      i++;
    }
  }
}
