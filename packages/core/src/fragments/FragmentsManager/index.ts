import { Fragment, FragmentsGroup, Serializer } from "@thatopen/fragments";
import * as THREE from "three";
import * as FRAGS from "@thatopen/fragments";
import { Component, Components, Event, Disposable } from "../../core";
import { RelationsMap } from "../../ifc/IfcRelationsIndexer/src/types";
import { IfcRelationsIndexer } from "../../ifc/IfcRelationsIndexer";

/**
 * Component to load, delete and manage [fragments](https://github.com/ThatOpen/engine_fragment) efficiently. 📕 [Tutorial](https://docs.thatopen.com/Tutorials/Components/Core/FragmentsManager). 📘 [API](https://docs.thatopen.com/api/@thatopen/components/classes/FragmentsManager).
 */
export class FragmentsManager extends Component implements Disposable {
  /**
   * A unique identifier for the component.
   * This UUID is used to register the component within the Components system.
   */
  static readonly uuid = "fef46874-46a3-461b-8c44-2922ab77c806" as const;

  /** {@link Disposable.onDisposed} */
  readonly onDisposed = new Event();

  /**
   * Event triggered when fragments are loaded.
   */
  readonly onFragmentsLoaded = new Event<FragmentsGroup>();

  /**
   * Event triggered when fragments are disposed.
   */
  readonly onFragmentsDisposed = new Event<{
    groupID: string;
    fragmentIDs: string[];
  }>();

  /**
   * Map containing all loaded fragments.
   * The key is the fragment's unique identifier, and the value is the fragment itself.
   */
  readonly list = new Map<string, Fragment>();

  /**
   * Map containing all loaded fragment groups.
   * The key is the group's unique identifier, and the value is the group itself.
   */
  readonly groups = new Map<string, FragmentsGroup>();

  baseCoordinationModel = "";
  baseCoordinationMatrix = new THREE.Matrix4();

  /** {@link Component.enabled} */
  enabled = true;

  private _loader = new Serializer();

  /**
   * Getter for the meshes of all fragments in the FragmentsManager.
   * It iterates over the fragments in the list and pushes their meshes into an array.
   * @returns {THREE.Mesh[]} An array of THREE.Mesh objects representing the fragments.
   */
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

  /**
   * Dispose of a specific fragment group.
   * This method removes the group from the groups map, deletes all fragments within the group from the list,
   * disposes of the group, and triggers the onFragmentsDisposed event.
   *
   * @param group - The fragment group to be disposed.
   */
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
   * Loads a binary file that contain fragment geometry.
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
   * Export the specified fragmentsgroup to binary data.
   * @param group - the fragments group to be exported.
   * @returns the exported data as binary buffer.
   */
  export(group: FragmentsGroup) {
    return this._loader.export(group);
  }

  /**
   * Gets a map of model IDs to sets of express IDs for the given fragment ID map.
   * @param fragmentIdMap - A map of fragment IDs to their corresponding express IDs.
   * @returns A map of model IDs to sets of express IDs.
   */
  getModelIdMap(fragmentIdMap: FRAGS.FragmentIdMap) {
    const map: { [modelID: string]: Set<number> } = {};
    for (const fragmentID in fragmentIdMap) {
      const fragment = this.list.get(fragmentID);
      if (!(fragment && fragment.group)) continue;
      const model = fragment.group;
      if (!(model.uuid in map)) map[model.uuid] = new Set();
      const expressIDs = fragmentIdMap[fragmentID];
      for (const expressID of expressIDs) {
        map[model.uuid].add(expressID);
      }
    }
    return map;
  }

  /**
   * Converts a map of model IDs to sets of express IDs to a fragment ID map.
   * @param modelIdMap - A map of model IDs to their corresponding express IDs.
   * @returns A fragment ID map.
   * @remarks
   * This method iterates through the provided model ID map, retrieves the corresponding model from the `groups` map,
   * and then calls the `getFragmentMap` method of the model to obtain a fragment ID map for the given express IDs.
   * The fragment ID maps are then merged into a single map and returned.
   * If a model with a given ID is not found in the `groups` map, the method skips that model and continues with the next one.
   */
  modelIdToFragmentIdMap(modelIdMap: { [modelID: string]: Set<number> }) {
    let fragmentIdMap: FRAGS.FragmentIdMap = {};
    for (const modelID in modelIdMap) {
      const model = this.groups.get(modelID);
      if (!model) continue;
      const expressIDs = modelIdMap[modelID];
      const map = model.getFragmentMap(expressIDs);
      fragmentIdMap = { ...fragmentIdMap, ...map };
    }
    return fragmentIdMap;
  }

  /**
   * Applies coordinate transformation to the provided models.
   * If no models are provided, all groups are used.
   * The first model in the list becomes the base model for coordinate transformation.
   * All other models are then transformed to match the base model's coordinate system.
   *
   * @param models - The models to apply coordinate transformation to.
   * If not provided, all models are used.
   */
  coordinate(models = Array.from(this.groups.values())) {
    const isFirstModel = this.baseCoordinationModel.length === 0;
    if (isFirstModel) {
      const first = models.pop();
      if (!first) {
        return;
      }
      this.baseCoordinationModel = first.uuid;
      this.baseCoordinationMatrix = first.coordinationMatrix.clone();
    }

    if (!models.length) {
      return;
    }

    for (const model of models) {
      if (model.coordinationMatrix.equals(this.baseCoordinationMatrix)) {
        continue;
      }
      model.position.set(0, 0, 0);
      model.rotation.set(0, 0, 0);
      model.scale.set(1, 1, 1);
      model.updateMatrix();
      model.applyMatrix4(model.coordinationMatrix.clone().invert());
      model.applyMatrix4(this.baseCoordinationMatrix);
    }
  }
}
