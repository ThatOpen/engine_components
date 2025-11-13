import * as THREE from "three";
import * as FRAGS from "@thatopen/fragments";
import { Component, Components, Disposable, Event } from "../../core";
import { FragmentsManager, ModelIdMap } from "../FragmentsManager";

/**
 * An implementation of bounding box utilities that works for fragments. 📕 [Tutorial](https://docs.thatopen.com/Tutorials/Components/Core/BoundingBoxer). 📘 [API](https://docs.thatopen.com/api/@thatopen/components/classes/BoundingBoxer).
 */
export class BoundingBoxer extends Component implements Disposable {
  static readonly uuid = "d1444724-dba6-4cdd-a0c7-68ee1450d166" as const;

  /** {@link Component.enabled} */
  enabled = true;

  /** {@link Disposable.onDisposed} */
  readonly onDisposed = new Event();

  /**
   * A readonly dataset containing instances of THREE.Box3.
   */
  readonly list = new FRAGS.DataSet<THREE.Box3>();

  constructor(components: Components) {
    super(components);
    this.components.add(BoundingBoxer.uuid, this);
  }

  /** {@link Disposable.dispose} */
  dispose(full = true) {
    this.list.clear();
    this.onDisposed.trigger(BoundingBoxer.uuid);
    if (full) {
      this.onDisposed.reset();
      this.list.eventsEnabled = false;
      this.list.dispose();
    }
  }

  /**
   * Combines all bounding boxes in the `list` property into a single bounding box.
   *
   * @returns A `THREE.Box3` instance representing the union of all bounding boxes in the `list`.
   */
  get() {
    const fullBox = new THREE.Box3();
    for (const box of this.list) {
      fullBox.union(box);
    }
    return fullBox;
  }

  /**
   * Asynchronously adds bounding boxes to the list by merging boxes from models
   * specified in the provided `ModelIdMap`.
   *
   * @param items - A map where keys are model IDs and values are arrays of local IDs
   *                representing specific parts of the models to include in the bounding box.
   */
  async addFromModelIdMap(items: ModelIdMap) {
    const fragments = this.components.get(FragmentsManager);
    const box = new THREE.Box3();
    for (const [modelId, localIds] of Object.entries(items)) {
      const model = fragments.list.get(modelId);
      if (!model) continue;
      const itemsBox = await model.getMergedBox([...localIds]);
      box.union(itemsBox);
    }
    this.list.add(box);
  }

  /**
   * Adds bounding boxes from models to the current list based on optional filtering criteria.
   *
   * @param modelIds - An optional array of regular expressions used to filter models by their IDs.
   *                   If provided, only models whose IDs match at least one of the regular expressions
   *                   will have their bounding boxes added to the list. If not, all models will be used.
   */
  addFromModels(modelIds?: RegExp[]) {
    const fragments = this.components.get(FragmentsManager);
    for (const [modelId, model] of fragments.list) {
      if (modelIds && !modelIds.some((regex) => regex.test(modelId))) continue;
      this.list.add(model.box);
    }
  }

  /**
   * Calculates and returns the center point of the bounding box derived from the provided model ID map.
   *
   * @param modelIdMap - A mapping of model IDs and localIds used to generate the bounding box.
   * @returns A `THREE.Vector3` object representing the center point of the bounding box.
   */
  async getCenter(modelIdMap: ModelIdMap) {
    this.list.clear();
    await this.addFromModelIdMap(modelIdMap);
    const box = this.get();
    this.list.clear();
    const center = new THREE.Vector3();
    box.getCenter(center);
    return center;
  }

  /**
   * Calculates the camera orientation and position based on the specified orientation
   * and an optional offset factor.
   *
   * @param orientation - Specifies the direction of the camera relative to the bounding box.
   * @param offsetFactor - A multiplier applied to the distance between the camera and the bounding box.
   *                       Defaults to `1`.
   * @returns An object containing:
   *          - `position`: A `THREE.Vector3` representing the calculated camera position.
   *          - `target`: A `THREE.Vector3` representing the center of the bounding box, which the camera should target.
   */
  async getCameraOrientation(
    orientation: "front" | "back" | "left" | "right" | "top" | "bottom",
    offsetFactor = 1,
  ) {
    const fragments = this.components.get(FragmentsManager);
    this.list.clear();
    for (const [_, model] of fragments.list) {
      this.list.add(model.box);
    }
    const box = this.get();
    this.list.clear();
    const center = new THREE.Vector3();
    box.getCenter(center);
    const size = new THREE.Vector3();
    box.getSize(size);
    const cameraDistance = Math.max(size.x, size.y, size.z) * offsetFactor;
    const position = new THREE.Vector3();

    switch (orientation) {
      case "front":
        position.set(center.x, center.y, center.z + cameraDistance);
        break;
      case "back":
        position.set(center.x, center.y, center.z - cameraDistance);
        break;
      case "left":
        position.set(center.x - cameraDistance, center.y, center.z);
        break;
      case "right":
        position.set(center.x + cameraDistance, center.y, center.z);
        break;
      case "top":
        position.set(center.x, center.y + cameraDistance, center.z);
        break;
      case "bottom":
        position.set(center.x, center.y - cameraDistance, center.z);
        break;
      default:
        position.set(center.x, center.y, center.z + cameraDistance);
    }

    return { position, target: center };
  }
}
