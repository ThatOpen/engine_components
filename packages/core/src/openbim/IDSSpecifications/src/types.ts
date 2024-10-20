export type IfcVersion = "IFC2X3" | "IFC4" | "IFC4X3_ADD2";

export type IDSFacetParameterName =
  | "Name"
  | "PredefinedType"
  | "Value"
  | "System"
  | "URI"
  | "PropertySet"
  | "BaseName"
  | "DataType"
  | "Value"
  | "Entity"
  | "Relation";

// required must match
// prohibited mustn't match
// optional passes for matches and nulls
export type IDSSimpleCardinality = "required" | "prohibited";
export type IDSConditionalCardinaltiy = IDSSimpleCardinality | "optional";

export type IDSSimpleParameter = string | number | boolean;
export type IDSEnumerationParameter = string[] | number[] | boolean[];
export type IDSPatternParameter = string;
export type IDSBoundsParameter = {
  min?: number;
  minInclusive?: boolean;
  max?: number;
  maxInclusive?: boolean;
};
export type IDSLengthParameter = {
  min?: number;
  length?: number;
  max?: number;
};

export interface IDSRestrictionParameter {}

export type IDSFacetParameterType =
  | "simple"
  | "enumeration"
  | "pattern"
  | "bounds"
  | "length";

export interface IDSFacetParameter {
  type: IDSFacetParameterType;
  parameter:
    | IDSSimpleParameter
    | IDSEnumerationParameter
    | IDSPatternParameter
    | IDSBoundsParameter
    | IDSLengthParameter;
}

export interface IDSCheck {
  parameter: IDSFacetParameterName;
  currentValue: string | number | boolean | null;
  requiredValue: any;
  pass: boolean;
}

/**
 * Represents the result of a check performed by an IDSFacet test.
 */
export interface IDSCheckResult {
  guid?: string;
  expressID: number;
  pass: boolean;
  checks: IDSCheck[];
  cardinality: IDSConditionalCardinaltiy;
}

export interface IDSInfo {
  title: string;
  description?: string;
  copyright?: string;
  version?: string;
  author?: string;
  date?: Date;
  purpose?: string;
  milestone?: string;
}
