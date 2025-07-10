import * as THREE from "three";
import * as FRAGS from "@thatopen/fragments";

// @ts-ignore
import { FragmentsModels } from "@thatopen/fragments";
import { Component, Components, Event, Disposable } from "../../core";
import { ModelIdMap } from "./src";

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
  readonly onFragmentsLoaded = new Event<any>();

  baseCoordinationModel = "";
  baseCoordinationMatrix = new THREE.Matrix4();

  /** {@link Component.enabled} */
  enabled = true;

  initialized = false;

  private _core?: FRAGS.FragmentsModels;

  /**
   * Map containing all loaded fragment models.
   * The key is the group's unique identifier, and the value is the model itself.
   */
  get list() {
    return this.core.models.list;
  }

  get core() {
    if (!this._core) {
      throw new Error("FragmentsManager not initialized. Call init() first.");
    }
    return this._core;
  }

  constructor(components: Components) {
    super(components);
    this.components.add(FragmentsManager.uuid, this);
  }

  /** {@link Disposable.dispose} */
  dispose() {
    if (this._core) {
      this.core.dispose();
      this._core = undefined;
    }
    this.baseCoordinationModel = "";
    this.onFragmentsLoaded.reset();
    this.onDisposed.trigger();
    this.onDisposed.reset();
  }

  init(workerURL: string) {
    this._core = new FragmentsModels(workerURL);
    this.initialized = true;
    this.core.onModelLoaded.add(async (model) => {
      if (this.list.size !== 1) return;
      this.baseCoordinationModel = model.modelId;
      this.baseCoordinationMatrix = await model.getCoordinationMatrix();
    });
    this.list.onItemDeleted.add(() => {
      if (this.list.size > 0) return;
      this.baseCoordinationModel = "";
      this.baseCoordinationMatrix = new THREE.Matrix4();
    });
  }

  async raycast(data: {
    camera: THREE.PerspectiveCamera | THREE.OrthographicCamera;
    mouse: THREE.Vector2;
    dom: HTMLCanvasElement;
    snappingClasses?: FRAGS.SnappingClass[];
  }) {
    const results = [];
    for (const model of this.core.models.list.values()) {
      if (data.snappingClasses && data.snappingClasses.length > 0) {
        const snappingRaycast = await model.raycastWithSnapping(
          data as FRAGS.SnappingRaycastData,
        );
        if (snappingRaycast && snappingRaycast.length > 0) {
          results.push(snappingRaycast[0]);
        } else {
          const simpleRaycast = await model.raycast(data);
          if (simpleRaycast) results.push(simpleRaycast);
        }
      } else {
        const simpleRaycast = await model.raycast(data);
        if (simpleRaycast) results.push(simpleRaycast);
      }
    }
    await Promise.all(results);
    if (results.length === 0) return undefined;

    // Find result with smallest distance
    let closestResult = results[0];
    let minDistance = closestResult.distance;

    for (let i = 1; i < results.length; i++) {
      if (results[i].distance < minDistance) {
        minDistance = results[i].distance;
        closestResult = results[i];
      }
    }

    return closestResult;
  }

  async getPositions(items: ModelIdMap): Promise<THREE.Vector3[]> {
    const results: THREE.Vector3[] = [];

    const getModelPositions = async (
      model: FRAGS.FragmentsModel,
      localIds: number[] | undefined,
    ) => {
      const positions = await model.getPositions(localIds);
      for (const position of positions) {
        results.push(position);
      }
    };

    const promises: Promise<void>[] = [];
    for (const modelId in items) {
      const model = this.core.models.list.get(modelId);
      if (model) {
        promises.push(getModelPositions(model, Array.from(items[modelId])));
      }
    }

    await Promise.all(promises);

    return results;
  }

  async getBBoxes(items: ModelIdMap): Promise<THREE.Box3[]> {
    const results: THREE.Box3[] = [];

    const getBoxes = async (
      model: FRAGS.FragmentsModel,
      localIds: number[] | undefined,
    ) => {
      const boxes = await model.getBoxes(localIds);
      if (boxes) {
        for (const box of boxes) {
          results.push(box);
        }
      }
    };

    const promises = [];
    for (const itemID in items) {
      const model = this.core.models.list.get(itemID);
      if (model) {
        promises.push(getBoxes(model, Array.from(items[itemID])));
      }
    }

    await Promise.all(promises);
    return results;
  }

  async highlight(style: FRAGS.MaterialDefinition, items?: ModelIdMap) {
    await this.forEachModel(items, "highlight", style);
  }

  /**
   * Retrieves data for specified items from multiple models.
   *
   * @param items A map of model IDs to an array of local IDs, specifying which items to retrieve data for.
   * @param config Optional configuration for data retrieval.
   * @returns A record mapping model IDs to an array of item data.
   */
  async getData(items: ModelIdMap, config?: Partial<FRAGS.ItemsDataConfig>) {
    const result: Record<string, FRAGS.ItemData[]> = {};
    for (const [modelId, localIds] of Object.entries(items)) {
      const model = this.list.get(modelId);
      if (!model) continue;
      const data = await model.getItemsData([...localIds], config);
      result[modelId] = data;
    }
    return result;
  }

  async resetHighlight(items?: ModelIdMap) {
    await this.forEachModel(items, "resetHighlight");
  }

  private async forEachModel(
    items: ModelIdMap | undefined,
    method: string,
    ...args: any
  ) {
    const _items: Record<string, number[] | undefined> = {};
    if (items) {
      for (const modelId in items) {
        const ids = items[modelId];
        _items[modelId] = Array.from(ids);
      }
    } else {
      // When items are not provided, apply to all models
      for (const name of this.core.models.list.keys()) {
        _items[name] = undefined;
      }
    }
    const promises = [];
    for (const modelId in _items) {
      const model = this.core.models.list.get(modelId);
      if (model) {
        const ids = _items[modelId];
        // @ts-ignore
        const promise = model[method](ids, ...args);
        promises.push(promise);
      }
    }
    await Promise.all(promises);
  }

  /**
   * Converts a collection of IFC GUIDs to a fragmentIdMap.
   *
   * @param guids - An iterable collection of global IDs to be converted to a fragment ID map.
   *
   * @returns A fragment ID map, where the keys are fragment IDs and the values are the corresponding express IDs.
   */
  async guidsToModelIdMap(guids: Iterable<string>) {
    const modelIdMap: ModelIdMap = {};
    for (const [id, model] of this.list) {
      const localIds = (await model.getLocalIdsByGuids([...guids])).filter(
        (localId) => localId !== null,
      ) as number[];
      modelIdMap[id] = new Set(localIds);
    }
    return modelIdMap;
  }

  /**
   * Converts a fragment ID map to a collection of GUIDs.
   *
   * @param modelIdMap - A ModelIdMap to be converted to a collection of GUIDs.
   *
   * @returns An array of GUIDs.
   */
  async modelIdMapToGuids(modelIdMap: ModelIdMap) {
    const guids: string[] = [];
    for (const [modelId, localIds] of Object.entries(modelIdMap)) {
      const model = this.list.get(modelId);
      if (!model) continue;
      const modelGuids = (await model.getGuidsByLocalIds([...localIds])).filter(
        (guid) => guid !== null,
      ) as string[];
      guids.push(...modelGuids);
    }
    return guids;
  }

  // /**
  //  * Applies coordinate transformation to the provided models.
  //  * If no models are provided, all groups are used.
  //  * The first model in the list becomes the base model for coordinate transformation.
  //  * All other models are then transformed to match the base model's coordinate system.
  //  *
  //  * @param models - The models to apply coordinate transformation to.
  //  * If not provided, all models are used.
  //  */
  // coordinate(models = Array.from(this.groups.values())) {
  //   const isFirstModel = this.baseCoordinationModel.length === 0;
  //   if (isFirstModel) {
  //     const first = models.pop();
  //     if (!first) {
  //       return;
  //     }
  //     this.baseCoordinationModel = first.uuid;
  //     this.baseCoordinationMatrix = first.coordinationMatrix.clone();
  //   }

  //   if (!models.length) {
  //     return;
  //   }

  //   for (const model of models) {
  //     if (model.coordinationMatrix.equals(this.baseCoordinationMatrix)) {
  //       continue;
  //     }
  //     model.position.set(0, 0, 0);
  //     model.rotation.set(0, 0, 0);
  //     model.scale.set(1, 1, 1);
  //     model.updateMatrix();
  //     this.applyBaseCoordinateSystem(model, model.coordinationMatrix);
  //   }
  // }

  /**
   * Applies the base coordinate system to the provided object.
   *
   * This function takes an object and its original coordinate system as input.
   * It then inverts the original coordinate system and applies the base coordinate system
   * to the object. This ensures that the object's position, rotation, and scale are
   * transformed to match the base coordinate system (which is taken from the first model loaded).
   *
   * @param object - The object to which the base coordinate system will be applied.
   * This should be an instance of THREE.Object3D.
   *
   * @param originalCoordinateSystem - The original coordinate system of the object.
   * This should be a THREE.Matrix4 representing the object's transformation matrix.
   */
  applyBaseCoordinateSystem(
    object: THREE.Object3D | THREE.Vector3,
    originalCoordinateSystem?: THREE.Matrix4,
  ) {
    const transformMatrix = new THREE.Matrix4();
    if (originalCoordinateSystem) {
      transformMatrix.copy(originalCoordinateSystem.clone()).invert();
    }
    transformMatrix.multiply(this.baseCoordinationMatrix);
    object.applyMatrix4(transformMatrix);
    return transformMatrix;
  }
}

export * from "./src";
