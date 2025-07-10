import * as FRAGS from "@thatopen/fragments";
import {
  Component,
  Components,
  Serializable,
  SerializationResult,
} from "../../core";
import { FragmentsManager, ModelIdMap } from "../FragmentsManager";
import {
  FinderQuery,
  QueryResultAggregation,
  SerializedFinderQuery,
} from "./src";
import { ModelIdMapUtils } from "../../utils";

// TODO: Implement Configurable and set updateOnModelsListChange
// That will be used to clear the cache on finder query any time
// a new model is loaded or deleted

/**
 * Manages and executes queries to find items within models based on specified criteria. This class provides functionalities to create, store, and execute FinderQuery instances, allowing for efficient retrieval of items that match given query parameters. 📕 [Tutorial](https://docs.thatopen.com/Tutorials/Components/Core/ItemsFinder). 📘 [API](https://docs.thatopen.com/api/@thatopen/components/classes/ItemsFinder).
 */
export class ItemsFinder
  extends Component
  implements Serializable<SerializedFinderQuery>
{
  /**
   * A unique identifier for the component.
   * This UUID is used to register the component within the Components system.
   */
  static readonly uuid = "0da7ad77-f734-42ca-942f-a074adfd1e3a" as const;

  /** {@link Component.enabled} */
  enabled = true;

  /**
   * A map of FinderQuery objects, indexed by a string key.
   */
  readonly list = new FRAGS.DataMap<string, FinderQuery>();

  constructor(components: Components) {
    super(components);
    components.add(ItemsFinder.uuid, this);
  }

  // private clearCache() {
  //   for (const [, finderQuery] of this.list) {
  //     finderQuery.clearCache();
  //   }
  // }

  /**
   * Retrieves items from specified models based on a query.
   *
   * @param queries - The query parameters to filter items.
   * @param modelIds - Optional array of model IDs to include in the search. If not provided, all models are searched.
   * @returns A map of model IDs to sets of item IDs that match the query.
   */
  async getItems(
    queries: FRAGS.ItemsQueryParams[],
    config?: { modelIds?: RegExp[]; aggregation?: QueryResultAggregation },
  ) {
    const { modelIds } = config ?? {};
    const aggregation = config?.aggregation ?? "exclusive";
    const fragments = this.components.get(FragmentsManager);

    const results = await Promise.all(
      queries.map(async (query) => {
        const result: ModelIdMap = {};
        await Promise.all(
          Array.from(fragments.list).map(async ([id, model]) => {
            if (modelIds && !modelIds.some((regex) => regex.test(id))) return;
            const items = await model.getItemsByQuery(query);
            result[id] = new Set(items);
          }),
        );
        return result;
      }),
    );

    const finalResult =
      aggregation === "inclusive"
        ? ModelIdMapUtils.join(results)
        : ModelIdMapUtils.intersect(results);
    return finalResult;
  }

  /**
   * Creates a new FinderQuery instance and adds it to the list of queries.
   *
   * @param name - The name of the query.
   * @param queries - The queries to use.
   * @returns The newly created FinderQuery instance.
   */
  create(name: string, queries: FRAGS.ItemsQueryParams[]) {
    const instance = new FinderQuery(this.components, queries);
    this.list.set(name, instance);
    return instance;
  }

  /**
   * Adds queries based on categories from items that have geometry.
   *
   * @param modelIds - An optional array of model IDs to filter fragments. If not provided, all fragments are processed.
   * @returns An array with the categories used to create the queries
   */
  async addFromCategories(modelIds?: RegExp[]) {
    const result = new Set<string>();
    const fragments = this.components.get(FragmentsManager);
    for (const [id, model] of fragments.list) {
      if (modelIds && !modelIds.some((regex) => regex.test(id))) continue;
      const categories = (await model.getItemsWithGeometryCategories()).filter(
        (category) => category !== null,
      ) as string[];
      const set = new Set(categories);
      for (const category of set) {
        if (this.list.has(category)) continue;
        this.create(category, [{ categories: [new RegExp(`^${category}$`)] }]);
        result.add(category);
      }
    }
    return [...result];
  }

  /**
   * Imports a list of `FinderQuery` instances from a `SerializationResult` containing serialized finder query data.
   *
   * @param result - The `SerializationResult` containing the serialized `SerializedFinderQuery` data.
   * @returns An array of `FinderQuery` instances created from the serialized data. Returns an empty array if the input data is null or undefined.
   */
  import(result: SerializationResult<SerializedFinderQuery>) {
    const { data } = result;
    const instances: FinderQuery[] = [];
    if (!data) return instances;
    for (const value of data) {
      const { name, description, queries, aggregation, cache } = value;
      const finderQuery = this.create(name, []);
      finderQuery.fromJSON({ description, queries, aggregation, cache });
      instances.push(finderQuery);
    }
    return instances;
  }

  /**
   * Serializes the ItemsFinder's data into a format suitable for export.
   *
   * @returns An object containing an array of serialized finder queries.
   */
  export() {
    const data: SerializedFinderQuery[] = [];

    for (const [name, finderQuery] of this.list.entries()) {
      const partial = finderQuery.toJSON();
      const result: SerializedFinderQuery = {
        ...partial,
        name,
      };
      data.push(result);
    }

    return { data };
  }
}

export * from "./src";
