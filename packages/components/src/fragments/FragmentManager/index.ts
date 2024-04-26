import { Fragment, FragmentsGroup, Serializer } from "bim-fragment";
import * as THREE from "three";
import { Component, Components, Event, Disposable } from "../../core";

/**
 * Object that can efficiently load binary files that contain
 * [fragment geometry](https://github.com/ThatOpen/engine_fragment).
 */
export class FragmentManager extends Component implements Disposable {
  static readonly uuid = "fef46874-46a3-461b-8c44-2922ab77c806" as const;

  /** {@link Disposable.onDisposed} */
  readonly onDisposed = new Event();

  readonly onFragmentsLoaded = new Event<FragmentsGroup>();

  readonly onFragmentsDisposed = new Event<{
    groupID: string;
    fragmentIDs: string[];
  }>();

  /** All the created [fragments](https://github.com/ThatOpen/engine_fragment). */
  readonly list = new Map<string, Fragment>();

  readonly groups = new Map<string, FragmentsGroup>();

  /** {@link Component.enabled} */
  enabled = true;

  baseCoordinationModel = "";

  private _loader = new Serializer();

  /** The list of meshes of the created fragments. */
  get meshes() {
    const meshes: THREE.Mesh[] = [];
    for (const [_id, fragment] of this.list) {
      meshes.push(fragment.mesh);
    }
    return meshes;
  }

  constructor(components: Components) {
    super(components);
    this.components.add(FragmentManager.uuid, this);
  }

  /** {@link Disposable.dispose} */
  dispose() {
    for (const [_id, group] of this.groups) {
      group.dispose(true);
    }

    this.groups.clear();
    this.list.clear();
    this.onFragmentsLoaded.reset();
    this.onFragmentsDisposed.reset();
    this.onDisposed.trigger();
    this.onDisposed.reset();
  }

  disposeGroup(group: FragmentsGroup) {
    const { uuid: groupID } = group;
    const fragmentIDs: string[] = [];
    for (const fragment of group.items) {
      fragmentIDs.push(fragment.id);
      this.list.delete(fragment.id);
    }
    group.dispose(true);
    this.groups.delete(group.uuid);
    this.onFragmentsDisposed.trigger({
      groupID,
      fragmentIDs,
    });
  }

  /**
   * Loads one or many fragments into the scene.
   * @param data - the bytes containing the data for the fragments to load.
   * @param coordinate - whether this fragmentsgroup should be federated with the others.
   * @returns the list of IDs of the loaded fragments.
   */
  load(data: Uint8Array, coordinate = true) {
    const model = this._loader.import(data);
    for (const fragment of model.items) {
      fragment.group = model;
      this.list.set(fragment.id, fragment);
    }
    if (coordinate) {
      this.coordinate([model]);
    }
    this.groups.set(model.uuid, model);
    this.onFragmentsLoaded.trigger(model);
    return model;
  }

  /**
   * Export the specified fragments.
   * @param group - the fragments group to be exported.
   * @returns the exported data as binary buffer.
   */
  export(group: FragmentsGroup) {
    return this._loader.export(group);
  }

  coordinate(models = Array.from(this.groups.values())) {
    const isFirstModel = this.baseCoordinationModel.length === 0;
    if (isFirstModel) {
      const first = models.pop();
      if (!first) {
        return;
      }
      this.baseCoordinationModel = first.uuid;
    }

    if (!models.length) {
      return;
    }

    const baseModel = this.groups.get(this.baseCoordinationModel);

    if (!baseModel) {
      console.log("No base model found for coordination!");
      return;
    }

    for (const model of models) {
      if (model === baseModel) {
        continue;
      }
      model.position.set(0, 0, 0);
      model.rotation.set(0, 0, 0);
      model.scale.set(1, 1, 1);
      model.updateMatrix();
      model.applyMatrix4(model.coordinationMatrix.clone().invert());
      model.applyMatrix4(baseModel.coordinationMatrix);
    }
  }
}
