import * as FRAGS from "@thatopen/fragments";
import { Components } from "../../../../core/Components";
import {
  IDSFacetParameter,
  IDSCheckResult,
  IDSFacetParameterName,
  IDSCheck,
  IDSConditionalCardinaltiy,
  IDSSimpleCardinality,
  IDSFacetType,
} from "../types";

export abstract class IDSFacet {
  abstract facetType: IDSFacetType;

  // Used when the facet is a requirement
  // On IDSEntity is always required
  cardinality: IDSSimpleCardinality | IDSConditionalCardinaltiy = "required";

  // When using this facet as a requirement, instructions can be given for the authors of the IFC.
  instructions?: string;

  constructor(protected components: Components) {}

  protected addCheckResult(check: IDSCheck, checks: IDSCheck[]) {
    const index = checks.findIndex(
      ({ parameter }) => parameter === check.parameter,
    );

    if (index !== -1) {
      checks[index] = check;
    } else {
      checks.push(check);
    }
  }

  protected evalRequirement = (
    value: string | number | boolean | null,
    facetParameter: IDSFacetParameter,
    parameter: IDSFacetParameterName,
    checks?: IDSCheck[],
  ) => {
    const checkLog: IDSCheck = {
      parameter,
      currentValue: value,
      requiredValue: facetParameter.parameter,
      pass: false,
    };

    if (checks) this.addCheckResult(checkLog, checks);

    let pass = false;

    if (facetParameter.type === "simple") {
      pass = value === facetParameter.parameter;
    }

    if (facetParameter.type === "enumeration") {
      pass = facetParameter.parameter.includes(value as never);
    }

    if (facetParameter.type === "pattern") {
      const regex = new RegExp(facetParameter.parameter);
      pass = regex.test(String(value));
    }

    if (facetParameter.type === "length") {
      const { min, length, max } = facetParameter.parameter;
      if (length !== undefined) {
        pass = String(value).length === length;
      }
      if (min !== undefined) {
        pass = String(value).length >= min;
      }
      if (max !== undefined) {
        pass = String(value).length <= max;
      }
    }

    if (facetParameter.type === "bounds" && typeof value === "number") {
      const { min, minInclusive, max, maxInclusive } = facetParameter.parameter;

      let minPass = true;
      let maxPass = true;

      if (min !== undefined) {
        minPass = minInclusive ? value >= min : value > min;
      }

      if (max !== undefined) {
        maxPass = maxInclusive ? value <= max : value < max;
      }

      pass = minPass && maxPass;
    }

    if (this.cardinality === "prohibited") pass = !pass;
    if (this.cardinality === "optional") pass = true;

    checkLog.pass = pass;
    return checkLog.pass;
  };

  protected testResult: IDSCheckResult[] = [];
  protected saveResult(attrs: any, pass: boolean) {
    const { GlobalId } = attrs;
    if (!GlobalId) return;
    const { value: guid } = GlobalId;
    const result: IDSCheckResult = {
      expressID: guid,
      pass,
      checks: [],
      cardinality: this.cardinality,
    };
    this.testResult.push(result);
  }

  /**
   * Returns the list of expressIDs that pass the criteria of this facet.
   * @param model - The IFC model to retrieve entities from.
   * @param collector - An optional object to collect the retrieved entities.
   * @remarks
   * If the collector already includes the entity, it won't get processed any further.
   *
   * @returns An array of express IDs of the retrieved entities.
   */
  abstract getEntities(
    model: FRAGS.FragmentsGroup,
    collector: FRAGS.IfcProperties,
  ): Promise<number[]>;

  abstract test(
    entities: FRAGS.IfcProperties,
    model?: FRAGS.FragmentsGroup,
  ): Promise<IDSCheckResult[]>;

  abstract serialize(type: "applicability" | "requirement"): string;
}
