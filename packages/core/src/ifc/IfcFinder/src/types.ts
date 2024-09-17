export interface IfcCategoryRule {
  type: "category";
  value: RegExp;
}

export interface IfcPropertyRule {
  type: "property";
  name: RegExp;
  value: RegExp;
}

export type IfcFinderRule = IfcCategoryRule | IfcPropertyRule;
