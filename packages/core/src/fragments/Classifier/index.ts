import * as FRAGS from "@thatopen/fragments";
import { Disposable, Component, Event, Components } from "../../core";
import { FragmentsManager, ModelIdMap } from "../FragmentsManager";
import { ItemsFinder } from "../ItemsFinder";
import {
  ClassificationGroupQuery,
  ClassificationGroupData,
  ClassifierIntersectionInput,
  RemoveClassifierItemsConfig,
  AddClassificationConfig,
  ClassifyItemRelationsConfig,
} from "./src";
import { ModelIdMapUtils } from "../../utils";

// TODO: Implement serialization

/**
 * The Classifier component is responsible for grouping items from different models based on criteria. 📕 [Tutorial](https://docs.thatopen.com/Tutorials/Components/Core/Classifier). 📘 [API](https://docs.thatopen.com/api/@thatopen/components/classes/Classifier).
 */
export class Classifier extends Component implements Disposable {
  /**
   * A unique identifier for the component.
   * This UUID is used to register the component within the Components system.
   */
  static readonly uuid = "e25a7f3c-46c4-4a14-9d3d-5115f24ebeb7" as const;

  /** {@link Component.enabled} */
  enabled = true;

  /** {@link Disposable.onDisposed} */
  readonly onDisposed = new Event();

  /**
   * A nested data map that organizes classification groups.
   * The outer map uses strings as keys, and the inner map contains ClassificationGroupData, also keyed by strings.
   */
  readonly list: FRAGS.DataMap<
    string,
    FRAGS.DataMap<string, ClassificationGroupData>
  > = new FRAGS.DataMap();

  constructor(components: Components) {
    super(components);
    components.add(Classifier.uuid, this);
    this.setupEvents();
    const fragmentsManager = components.get(FragmentsManager);
    fragmentsManager.list.onBeforeDelete.add(this.onBeforeFragmentsDispose);
  }

  private setupEvents() {
    this.list.onBeforeDelete.add(({ value: groups }) => groups.dispose());
  }

  private getClassificationGroups(classification: string) {
    let groups = this.list.get(classification);
    if (!groups) {
      groups = new FRAGS.DataMap();
      this.list.set(classification, groups);
    }
    return groups;
  }

  private getModelItems(
    classification: string,
    group: string,
    modelId: string,
  ) {
    const { map } = this.getGroupData(classification, group);
    let items = map[modelId];
    if (!items) {
      items = new Set();
      map[modelId] = items;
    }
    return items;
  }

  /**
   * Retrieves data associated with a specific group within a classification.
   * If the group data does not exist, it creates a new entry.
   *
   * @param classification - The classification string.
   * @param group - The group string within the classification.
   * @returns The data object associated with the group, containing a map and a `get` method.
   */
  getGroupData(classification: string, group: string) {
    const finder = this.components.get(ItemsFinder);
    const groups = this.getClassificationGroups(classification);
    let data = groups.get(group);
    if (!data) {
      data = {
        map: {},
        // TODO: Evaluate if this is the best option for this
        get() {
          return new Promise((resolve) => {
            if (!data) {
              resolve({});
              return;
            }
            if (data.query) {
              const { name, config } = data.query;
              const instance = finder.list.get(name);
              if (!instance) {
                throw new Error(
                  "Classifier: the query name associated with the group doesn't exist in the ItemsFinder component",
                );
              }
              instance.test(config).then((queryMap) => {
                if (!data) {
                  resolve({});
                  return;
                }
                const result = ModelIdMapUtils.join([queryMap, data.map]);
                resolve(result);
              });
            } else {
              resolve(data.map);
            }
          });
        },
      };
      groups.set(group, data);
    }
    return data;
  }

  /**
   * The default save function used by the classifier.
   * It extracts the 'value' property from the item's Name and returns it as a string.
   * If the 'value' property does not exist, it returns null.
   *
   * @param item - The item data to extract the value from.
   * @returns The extracted value as a string, or null if the value does not exist.
   */
  defaultSaveFunction = (item: FRAGS.ItemData) => {
    if (!("value" in item.Name)) return null;
    return item.Name.value as string;
  };

  /**
   * Aggregates items based on a classification and query, applying a provided function to each item.
   *
   * @param classification - The classification string used to categorize the items.
   * @param query - The query parameters used to find items.
   * @param config - Optional configuration for data and item processing.
   * @param config.data - Optional data configuration to pass to the item retrieval.
   * @param config.aggregationCallback - Optional function to apply to each item; defaults to `this.defaultSaveFunction` if not provided.
   *                       This function receives the item data and a register function to associate item local IDs with names.
   *                       If no function is provided, the default save function is used.
   *
   * @remarks
   * The `register` function within the `config.func` allows associating item local IDs with a given name under the specified classification.
   * It is used to keep track of which items belong to which classification.
   */
  async aggregateItems(
    classification: string,
    query: FRAGS.ItemsQueryParams,
    config?: {
      modelIds?: RegExp[];
      data?: Partial<FRAGS.ItemsDataConfig>;
      aggregationCallback?: (
        item: FRAGS.ItemData,
        register: (name: string, ...localIds: number[]) => void,
      ) => void;
    },
  ) {
    const data = config?.data ?? undefined;

    const callback = config?.aggregationCallback ?? this.defaultSaveFunction;

    const fragments = this.components.get(FragmentsManager);
    const finder = this.components.get(ItemsFinder);
    const resultMap = await finder.getItems([query], {
      modelIds: config?.modelIds,
    });

    for (const [modelId, localIds] of Object.entries(resultMap)) {
      const model = fragments.list.get(modelId);
      if (!model) continue;

      const register = (name: string, ...localIds: number[]) => {
        const items = this.getModelItems(classification, name, modelId);
        for (const localId of localIds) {
          items.add(localId);
        }
      };

      const items = await model.getItemsData([...localIds], data);
      for (const item of items) {
        callback(item, register);
      }
    }
  }

  /**
   * Adds items to a specific group within a classification.
   *
   * @param classification - The classification to which the group belongs.
   * @param group - The group to which the items will be added.
   * @param items - A map of model IDs to add to the group.
   */
  addGroupItems(classification: string, group: string, items: ModelIdMap) {
    const { map } = this.getGroupData(classification, group);
    ModelIdMapUtils.add(map, items);
  }

  /**
   * Sets the query for a specific group within a classification.
   *
   * @param classification - The classification to target.
   * @param group - The group within the classification to target.
   * @param query - The query to set for the group.
   */
  setGroupQuery(
    classification: string,
    group: string,
    query: ClassificationGroupQuery,
  ) {
    const groupData = this.getGroupData(classification, group);
    groupData.query = query;
  }

  /**
   * Asynchronously finds a set of ModelIdMaps based on the provided classification data.
   * @param data An object with classifications as keys and an array of groups as values.
   * @returns A promise that resolves to a ModelIdMap representing the intersection of all ModelIdMaps found.
   */
  async find(data: ClassifierIntersectionInput) {
    const modelIdMaps: ModelIdMap[] = [];
    for (const [classification, groups] of Object.entries(data)) {
      const maps: ModelIdMap[] = [];
      const classificationData = this.list.get(classification);
      if (!classificationData) continue;
      for (const group of groups) {
        const groupData = classificationData.get(group);
        if (!groupData) continue;
        const map = await groupData.get();
        maps.push(map);
      }
      const result = ModelIdMapUtils.join(maps);
      modelIdMaps.push(result);
    }
    const result = ModelIdMapUtils.intersect(modelIdMaps);
    return result;
  }

  /**
   * From the items passing the query, use the specified relation to create groupings
   * This method retrieves and processes related items, applying a custom aggregation callback to register
   * relations between items based on their attributes and local IDs.
   *
   * @param classification - The classification type used to filter items.
   * @param query - Query parameters for filtering items, defined by `FRAGS.ItemsQueryParams`.
   * @param relation - The type of relation to aggregate (e.g., "ContainedInStructure", "HasAssociations").
   * @param config - Optional configuration for the aggregation process.
   * @returns A promise that resolves when the aggregation process is complete.
   * @remarks
   * - The `aggregationCallback` function processes each item and registers relations based on the item's
   *   attribute value and the local ID of its relations.
   * - Items without the specified attribute or relations are ignored during aggregation.
   */
  async aggregateItemRelations(
    classification: string,
    query: FRAGS.ItemsQueryParams,
    relation: string,
    config?: ClassifyItemRelationsConfig,
  ) {
    const attribute = config?.attribute ?? "Name";
    const data: Partial<FRAGS.ItemsDataConfig> = {
      relations: {
        [relation]: { attributes: true, relations: false },
      },
    };
    await this.aggregateItems(classification, query, {
      modelIds: config?.modelIds,
      data,
      aggregationCallback: (item, register) => {
        if (!item?.[attribute]) return;
        const attr = item[attribute];
        if (!("value" in attr)) return;
        const relations = item[relation];
        if (!Array.isArray(relations)) return;
        for (const relation of relations) {
          if (!("value" in relation._localId)) continue;
          register(attr.value, relation._localId.value);
        }
      },
    });
  }

  /**
   * Asynchronously processes and adds classifications by IfcBuildingStorey.
   * @param config - Optional configuration for adding classifications.
   * @returns A promise that resolves once the storeys have been processed and added.
   */
  async byIfcBuildingStorey(config?: AddClassificationConfig) {
    await this.aggregateItemRelations(
      config?.classificationName ?? "Storeys",
      { categories: [/BUILDINGSTOREY/] },
      "ContainsElements",
      { modelIds: config?.modelIds },
    );
  }

  /**
   * Asynchronously processes and adds classifications by category.
   * @param config - Optional configuration for adding classifications.
   * @returns A promise that resolves once the categories have been processed and added.
   */
  async byCategory(config?: AddClassificationConfig) {
    const finder = this.components.get(ItemsFinder);
    const categories = await finder.addFromCategories(config?.modelIds);
    for (const category of categories) {
      this.setGroupQuery(config?.classificationName ?? "Categories", category, {
        name: category,
      });
    }
  }

  private onBeforeFragmentsDispose = async (data: {
    key: string;
    value: FRAGS.FragmentsModel;
  }) => {
    const { key: modelId, value: model } = data;
    const localIds = await model.getLocalIds();
    const modelIdMap = { [modelId]: new Set(localIds) };
    this.removeItems(modelIdMap);
  };

  /** {@link Disposable.dispose} */
  dispose() {
    this.list.clear();
    const fragmentsManager = this.components.get(FragmentsManager);
    fragmentsManager.list.onBeforeDelete.remove(this.onBeforeFragmentsDispose);
    this.onDisposed.trigger();
  }

  /**
   * Removes items from the classifier based on the provided model ID map and configuration.
   *
   * @param modelIdMap - A map containing model IDs to be removed.
   * @param config - Optional configuration for removing items.s.
   * @remarks If no configuration is provided, items will be removed from all classifications
   */
  removeItems(modelIdMap: ModelIdMap, config?: RemoveClassifierItemsConfig) {
    if (config && config.classificationName) {
      const groups = this.list.get(config.classificationName);
      if (!groups) return;
      if (config.groupName) {
        const groupData = groups.get(config.groupName);
        if (!groupData) return;
      }
      for (const [, data] of groups) {
        ModelIdMapUtils.remove(data.map, modelIdMap);
      }
      return;
    }

    for (const [, group] of this.list.entries()) {
      for (const [, data] of group) {
        ModelIdMapUtils.remove(data.map, modelIdMap);
      }
    }
  }

  /**
   * Asynchronously processes models based on the provided configuration and updates classification groups.
   *
   * @param config - Optional configuration for adding classifications. Contains the following properties.
   * @returns A promise that resolves when the processing is complete.
   */
  async byModel(config?: AddClassificationConfig) {
    const fragments = this.components.get(FragmentsManager);
    const classification = config?.classificationName ?? "Models";
    for (const [modelId, model] of fragments.list) {
      if (
        config &&
        config.modelIds &&
        !config.modelIds.some((regex) => regex.test(modelId))
      ) {
        continue;
      }

      const localIds = await model.getItemsIdsWithGeometry();
      const modelIdMap = { [modelId]: new Set(localIds) };
      this.getGroupData(classification, modelId);
      this.addGroupItems(classification, modelId, modelIdMap);
    }
  }

  // /**
  //  * Exports the computed classification to persists them and import them back
  //  * later for faster loading.
  //  */
  // export() {
  //   const exported: ExportedClassification = {};

  //   for (const systemName in this.list) {
  //     exported[systemName] = {};
  //     const system = this.list[systemName];
  //     for (const groupName in system) {
  //       const group = system[groupName];
  //       exported[systemName][groupName] = {
  //         map: FRAGS.FragmentUtils.export(group.map),
  //         name: group.name,
  //         id: group.id,
  //       };
  //     }
  //   }

  //   return exported;
  // }

  // /**
  //  * Imports a classification previously exported with .export().
  //  * @param data the serialized classification to import.
  //  */
  // import(data: ExportedClassification) {
  //   for (const systemName in data) {
  //     if (!this.list[systemName]) {
  //       this.list[systemName] = {};
  //     }
  //     const system = data[systemName];
  //     for (const groupName in system) {
  //       const group = system[groupName];
  //       this.list[systemName][groupName] = {
  //         map: FRAGS.FragmentUtils.import(group.map),
  //         name: group.name,
  //         id: group.id,
  //       };
  //     }
  //   }
  //
}

export * from "./src";
