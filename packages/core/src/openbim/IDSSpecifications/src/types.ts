import { IDSSpecification } from "./Specification";

export type IDSFacetParameterName =
  | "Name"
  | "Predefined Type"
  | "Value"
  | "System"
  | "URI"
  | "Property Set"
  | "Base Name"
  | "Data Type"
  | "Value"
  | "Entity"
  | "Relation";

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

export interface IDSFacetParameter {
  type: "simple" | "enumeration" | "pattern" | "bounds" | "length";
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
  guid: string;
  pass: boolean;
  checks: IDSCheck[];
}

export interface IDS {
  title: string;
  description?: string;
  copyright?: string;
  version?: string;
  author?: string;
  date?: Date;
  purpose?: string;
  milestone?: string;
  specifications: IDSSpecification[];
}
