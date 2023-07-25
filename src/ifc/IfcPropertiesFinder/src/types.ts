export type QueryConditions =
  | "is"
  | "includes"
  | "startsWith"
  | "endsWith"
  | "matches";

export type ConditionFunctions = {
  [queryCondition in QueryConditions]: (
    leftValue: string | boolean | number,
    rightValue: string | boolean | number
  ) => boolean;
};

export type QueryOperators = "AND" | "OR";

export interface AttributeQuery {
  operator?: QueryOperators;
  attribute: string;
  condition: QueryConditions;
  value: string | number | boolean;
  negateResult?: boolean; // Not working yet
  caseSensitive?: boolean; // Not working yet
}

export interface QueryGroup {
  operator?: QueryOperators;
  description?: string;
  queries: (AttributeQuery | QueryGroup)[];
}

export interface Query {
  name: string;
  description?: string;
  groups: QueryGroup;
}
