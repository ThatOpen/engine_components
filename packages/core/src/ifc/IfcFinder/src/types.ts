/**
 * A rule for the {@link IfcFinder} to search items based on their category.
 */
export interface IfcCategoryRule {
  /**
   * The type of this rule. All rules have a fixed type.
   */
  type: "category";

  /**
   * The category value. It's a regular expression, so you can make complex queries and use ".*" to match all categories.
   */
  value: RegExp;
}

/**
 * A rule for the {@link IfcFinder} to search items based on the properties defined in their property sets.
 */
export interface IfcPropertyRule {
  /**
   * The type of this rule. All rules have a fixed type.
   */
  type: "property";

  /**
   * The name of the property. It's a regular expression, so you can make complex queries and use ".*" to match all names.
   */
  name: RegExp;

  /**
   * The value of the property. It's a regular expression, so you can make complex queries and use ".*" to match all values.
   */
  value: RegExp;
}

/**
 * A rule for the {@link IfcFinder} to search items based on the value of a numeric property defined in their property sets.
 */
export interface IfcOperatorRule {
  /**
   * The type of this rule. All rules have a fixed type.
   */
  type: "operator";

  /**
   * The name of the property. It's a regular expression, so you can make complex queries and use ".*" to match all names.
   */
  name: RegExp;

  /**
   * The value of the property.
   */
  value: number;

  /**
   * The operator to apply to the numeric value.
   */
  operator: "<" | ">" | "=" | "<=" | ">=";
}

/**
 * The type of rules that can be used in the queries of the {@link IfcFinder}.
 */
export type IfcFinderRule = IfcCategoryRule | IfcPropertyRule | IfcOperatorRule;

/**
 * The data type used when the queries of the {@link IfcFinder} export or import query data to persist it.
 */
export type SerializedQuery = {
  /**
   * {@link IfcFinderQuery.name}
   */
  name: string;
  /**
   * {@link IfcFinderQuery.inclusive}
   */
  inclusive: boolean;

  /**
   * The type of query.
   */
  type: string;

  /**
   * {@link IfcFinderQuery.ids}
   */
  ids: { [modelID: string]: number[] };

  /**
   * {@link IfcFinderQuery.rules}
   */
  rules: { [key: string]: any }[];
};
