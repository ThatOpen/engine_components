export interface IfcCategoryRule {
  type: "category";
  value: RegExp;
}

export interface IfcPropertyRule {
  type: "property";
  name: RegExp;
  value: RegExp;
}

export interface IfcOperatorRule {
  type: "operator";
  name: RegExp;
  value: number;
  operator: "<" | ">" | "=" | "<=" | ">=";
}

export type IfcFinderRule = IfcCategoryRule | IfcPropertyRule | IfcOperatorRule;
