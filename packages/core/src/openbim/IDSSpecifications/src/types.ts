import * as FRAGS from "@thatopen/fragments";
import { IDSSpecification } from "./Specification";
import { Components } from "../../../core/Components";

export interface IDSFacetParameter {
  type: "simpleValue" | "restriction";
  value?: string | boolean | number;
  enumeration?: string[] | number[];
}

/**
 * Represents the result of a check performed by an IDS facet.
 * This interface contains two arrays: `pass` and `fail`. Each array contains IfcGUIDs of the entities that passed or failed the check, respectively.
 */
export interface IDSCheckResult {
  pass: string[];
  fail: string[];
}

export abstract class IDSFacet {
  constructor(protected components: Components) {}

  protected testResult: IDSCheckResult = { pass: [], fail: [] };
  protected saveResult(attrs: any, matches: boolean) {
    if (matches) {
      this.testResult.pass.push(attrs.GlobalId.value);
    } else {
      this.testResult.fail.push(attrs.GlobalId.value);
    }
  }

  abstract getEntities(
    model: FRAGS.FragmentsGroup,
    collector: FRAGS.IfcProperties,
  ): Promise<number[]>;

  abstract test(
    entities: FRAGS.IfcProperties,
    model?: FRAGS.FragmentsGroup,
  ): Promise<IDSCheckResult>;
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
