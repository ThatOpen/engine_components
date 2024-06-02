import { Fragment, FragmentsGroup, Serializer } from "@thatopen/fragments";
import * as THREE from "three";
import * as FRAGS from "@thatopen/fragments";
import { Component, Components, Event, Disposable } from "../../core";
import { RelationsMap } from "../../ifc/IfcRelationsIndexer/src/types";
import { IfcRelationsIndexer } from "../../ifc/IfcRelationsIndexer";

/**
 * Object that can efficiently load binary files that contain
 * [fragment geometry](https://github.com/ThatOpen/engine_fragment).
 */
export class FragmentsManager extends Component implements Disposable {
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
    this.components.add(FragmentsManager.uuid, this);
  }

  /** {@link Disposable.dispose} */
  dispose() {
    for (const [_id, group] of this.groups) {
      group.dispose(true);
    }

    this.baseCoordinationModel = "";
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
   * Loads a binar file that contain fragment geometry.
   * @param data - The binary data to load.
   * @param config - Optional configuration for loading.
   * @param config.coordinate - Whether to apply coordinate transformation. Default is true.
   * @param config.properties - Ifc properties to set on the loaded fragments. Not to be used when streaming.
   * @returns The loaded FragmentsGroup.
   */
  load(
    data: Uint8Array,
    config?: Partial<{
      coordinate: boolean;
      name: string;
      properties: FRAGS.IfcProperties;
      relationsMap: RelationsMap;
    }>,
  ) {
    const defaultConfig: {
      coordinate: boolean;
      name?: string;
      properties?: FRAGS.IfcProperties;
      relationsMap?: RelationsMap;
    } = { coordinate: true };
    const _config = { ...defaultConfig, ...config };
    const { coordinate, name, properties, relationsMap } = _config;
    const model = this._loader.import(data);
    if (name) model.name = name;
    for (const fragment of model.items) {
      fragment.group = model;
      this.list.set(fragment.id, fragment);
    }
    if (coordinate) {
      this.coordinate([model]);
    }
    this.groups.set(model.uuid, model);
    if (properties) {
      model.setLocalProperties(properties);
    }
    if (relationsMap) {
      const indexer = this.components.get(IfcRelationsIndexer);
      indexer.setRelationMap(model, relationsMap);
    }
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
