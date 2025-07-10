/**
 * Represents the type of aggregation used in a query result. `inclusive`: Equivalent to OR. `exclusive`: Equivalent to AND.
 */
export type QueryResultAggregation = "inclusive" | "exclusive";

/**
 * Configuration for testing queries.
 */
export interface QueryTestConfig {
  /**
   * An optional array of regular expressions used to know the models to be tested.
   */
  modelIds?: RegExp[];
  /**
   * An optional boolean indicating whether to force the query execution no matter if there is a cached result already.
   */
  force?: boolean;
}

export interface SerializedQueryAttribute {
  /**
   * The name of the attribute.
   */
  name: string;
  /**
   * The value of the attribute, which can be a string, an array of strings, a number, or a boolean. Optional.
   */
  value?: string | string[] | number | boolean;
  /**
   * The type of the attribute, typically used to define the data type or category. Optional.
   */
  type?: string;
  /**
   * Indicates whether the query should negate this attribute. Optional.
   */
  negate?: boolean;
  /**
   * An array of item IDs associated with this attribute. Optional.
   */
  itemIds?: number[];
}

/**
 * Represents the serialized query parameters used for item finding.
 */
export interface SerializedQueryParameters {
  /**
   * An optional array of category strings to filter items.
   */
  categories?: string[];
  /**
   * An optional object containing attribute-based queries.
   */
  attributes?: {
    /**
     * Specifies the aggregation type for attributes, either "exclusive" or "inclusive".
     */
    aggregation?: "exclusive" | "inclusive";
    /**
     * An array of serialized query attributes used for filtering.
     */
    queries: SerializedQueryAttribute[];
  };
  /**
   * An optional object defining a relational query.
   */
  relation?: {
    /**
     * The name of the relation.
     */
    name: string;
    /**
     * An optional nested query of type SerializedQueryParameters.
     */
    query?: SerializedQueryParameters;
  };
}

/**
 * Represents a serialized query for an item finder.
 */
export interface SerializedFinderQuery {
  /**
   * The name of the query.
   */
  name: string;
  /**
   * An optional description of the query.
   */
  description?: string;
  /**
   * An array of serialized query parameters.
   */
  queries: SerializedQueryParameters[];
  /**
   * The type of aggregation applied to the query results.
   */
  aggregation: QueryResultAggregation;
  /**
   * Indicates whether the query results should be cached.
   */
  cache: boolean;
}
