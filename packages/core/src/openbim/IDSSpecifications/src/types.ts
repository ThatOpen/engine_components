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

export type IDSFacetType =
  | "Entity"
  | "Attribute"
  | "Property"
  | "Classification"
  | "Material"
  | "PartOf";

// required must match
// prohibited mustn't match
// optional passes for matches and nulls
export type IDSSimpleCardinality = "required" | "prohibited";
export type IDSConditionalCardinaltiy = IDSSimpleCardinality | "optional";

export interface IDSSimpleParameter {
  type: "simple";
  parameter: string | number | boolean;
}

export interface IDSEnumerationParameter {
  type: "enumeration";
  parameter: string[] | number[] | boolean[];
}

export interface IDSPatternParameter {
  type: "pattern";
  parameter: string;
}

export interface IDSBoundsParameter {
  type: "bounds";
  parameter: {
    min?: number;
    minInclusive?: boolean;
    max?: number;
    maxInclusive?: boolean;
  };
}

export interface IDSLengthParameter {
  type: "length";
  parameter: {
    min?: number;
    length?: number;
    max?: number;
  };
}

export type IDSRestrictionParameter =
  | IDSEnumerationParameter
  | IDSPatternParameter
  | IDSBoundsParameter
  | IDSLengthParameter;

export type IDSFacetParameter = IDSSimpleParameter | IDSRestrictionParameter;

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

export interface IDSSpecificationData {
  name: string;
  ifcVersion: Set<IfcVersion>;
  identifier: string;
  description?: string;
  instructions?: string;
  requirementsDescription?: string;
}
