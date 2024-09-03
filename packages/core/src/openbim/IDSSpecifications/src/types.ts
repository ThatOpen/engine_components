import { IDSSpecification } from "./Specification";

export type IDSFacetParameterType = "simpleValue" | "restriction";

export interface IDSFacetParameter {
  type: IDSFacetParameterType;
  value?: string | boolean | number;
  enumeration?: string[] | number[];
}

// export interface IDSCheckResult {
//   pass: { [expressID: string]: Record<string, any> };
//   fail: { [expressID: string]: Record<string, any> };
// }

export interface IDSCheckResult {
  pass: string[]; // IfcGUIDs
  fail: string[];
}

export interface IDSFacet {
  instructions?: string;
  getEntities: (
    ifcRawProperties: Record<string, any>,
    collector: { [expressID: string]: Record<string, any> },
  ) => void;
  test: (
    ifcRawProperties: Record<string, any>,
    entities: Record<string, any>[],
  ) => IDSCheckResult;
}

export type IfcVersion = "IFC2X3" | "IFC4" | "IFC4X3";

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
