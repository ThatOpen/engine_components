import * as FRAGS from "@thatopen/fragments";
import { Components } from "../../../core";
import { ItemsFinder } from "..";
import { ModelIdMap } from "../../FragmentsManager";
import {
  QueryResultAggregation,
  QueryTestConfig,
  SerializedFinderQuery,
  SerializedQueryAttribute,
  SerializedQueryParameters,
} from "./types";

/**
 * Represents a finder query for retrieving items based on specified parameters. This class encapsulates the query logic, caching mechanism, and result management.
 */
export class FinderQuery {
  description?: string;

  private _components: Components;

  private _queries: FRAGS.ItemsQueryParams[] = [];

  /**
   * The query parameters used to find items.
   */
  set queries(value: FRAGS.ItemsQueryParams[]) {
    this._queries = value;
    this.clearCache();
  }

  get queries() {
    return this._queries;
  }

  private _aggregation: QueryResultAggregation = "exclusive";

  /**
   * Sets the aggregation value (AND/OR) for the query and resets the cache if the new value differs.
   */
  set aggregation(value: QueryResultAggregation) {
    // Reset the cache so the next test is executed without forcing
    if (value !== this._aggregation) this.clearCache();
    this._aggregation = value;
  }

  get aggregation() {
    return this._aggregation;
  }

  /**
   * The result of the query, a map of modelIds to localIds.
   * Null if the query has not been executed or has not been cached.
   */
  readonly result: ModelIdMap | null = null;

  /**
   * Determines whether the query results should be cached.
   */
  cache = true;

  constructor(components: Components, queries: FRAGS.ItemsQueryParams[]) {
    this._components = components;
    this.queries = queries;
  }

  /**
   * Executes the finder query to retrieve items based on the configured query and optional model IDs.
   *
   * @param config - Optional configuration object.
   * @param config.modelIds - Optional array of model IDs to filter the search.
   * @param config.force - Optional boolean to force a new search, bypassing the cache. Defaults to `false`.
   * @returns A promise that resolves to a `ModelIdMap` containing the search results.
   */
  async test(config?: QueryTestConfig) {
    const { modelIds, force } = { force: false, ...config };
    if (this.result && !force) return this.result;
    const finder = this._components.get(ItemsFinder);
    const result = await finder.getItems(this.queries, {
      modelIds,
      aggregation: this.aggregation,
    });
    if (this.cache) (this.result as ModelIdMap) = result;
    return result;
  }

  /**
   * Clears the cached result of the query, forcing a re-evaluation on the next access.
   */
  clearCache() {
    (this.result as null) = null;
  }

  private serializeAttributeQuery(query: FRAGS.GetItemsByAttributeParams) {
    let value;
    if (Array.isArray(query.value)) {
      value = query.value.map((regex) => regex.source);
    } else if (query.value instanceof RegExp) {
      value = query.value.source;
    } else {
      value = query.value;
    }
    const result: SerializedQueryAttribute = {
      name: query.name.source,
      value,
      type: query.type instanceof RegExp ? query.type.source : query.type,
      negate: query.negate,
      itemIds: query.itemIds,
    };
    return result;
  }

  private serializeQueryParameters = (params: FRAGS.ItemsQueryParams) => {
    const result: SerializedQueryParameters = {
      categories: params.categories?.map((regex) => regex.source),
      attributes: params.attributes
        ? {
            aggregation: params.attributes.aggregation,
            queries: params.attributes.queries.map(
              this.serializeAttributeQuery,
            ),
          }
        : undefined,
      relation: params.relation
        ? {
            name: params.relation.name,
            query: params.relation.query
              ? this.serializeQueryParameters(params.relation.query)
              : undefined,
          }
        : undefined,
    };

    return result;
  };

  /**
   * Serializes the finder query into a JSON-compatible format.
   * Converts regular expressions to strings.
   *
   * @returns A `SerializedFinderQuery` object representing the serialized query.
   */
  toJSON() {
    const result: SerializedFinderQuery = {
      name: "Finder Query",
      description: this.description,
      queries: this.queries.map(this.serializeQueryParameters),
      aggregation: this.aggregation,
      cache: this.cache,
    };

    return result;
  }

  private deserializeAttributeQuery(
    query: SerializedQueryAttribute,
  ): FRAGS.GetItemsByAttributeParams {
    let value;
    if (Array.isArray(query.value)) {
      value = query.value.map((val) => new RegExp(val));
    } else if (typeof query.value === "string") {
      value = new RegExp(query.value);
    } else {
      value = query.value;
    }
    const result: FRAGS.GetItemsByAttributeParams = {
      name: new RegExp(query.name),
      value,
      type: query.type ? new RegExp(query.type) : undefined,
      negate: query.negate,
      itemIds: query.itemIds,
    };
    return result;
  }

  private deserializeQueryParameters = (params: SerializedQueryParameters) => {
    const result: FRAGS.ItemsQueryParams = {
      categories: params.categories?.map((value) => new RegExp(value)),
      attributes: params.attributes
        ? {
            aggregation: params.attributes.aggregation,
            queries: params.attributes.queries.map(
              this.deserializeAttributeQuery,
            ),
          }
        : undefined,
      relation: params.relation
        ? {
            name: params.relation.name,
            query: params.relation.query
              ? this.deserializeQueryParameters(params.relation.query)
              : undefined,
          }
        : undefined,
    };

    return result;
  };

  /**
   * Deserializes a JSON object into a `FinderQuery` instance.
   *
   * @param data - A `SerializedFinderQuery` object representing the serialized query.
   * @returns A `FinderQuery` instance.
   */
  fromJSON(data: Omit<SerializedFinderQuery, "name">) {
    this.description = data.description;
    this.aggregation = data.aggregation;
    this.cache = data.cache;
    this.queries = data.queries.map(this.deserializeQueryParameters);
    return this;
  }
}
