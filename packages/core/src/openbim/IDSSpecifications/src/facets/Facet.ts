import * as FRAGS from "@thatopen/fragments";
import { Components } from "../../../../core/Components";
import {
  IDSFacetParameter,
  IDSCheckResult,
  IDSFacetParameterName,
  IDSSimpleParameter,
  IDSEnumerationParameter,
  IDSPatternParameter,
  IDSLengthParameter,
  IDSBoundsParameter,
  IDSCheck,
  IDSConditionalCardinaltiy,
  IDSSimpleCardinality,
} from "../types";

export abstract class IDSFacet {
  // Used when the facet is a requirement
  // On IDSEntity is always required
  cardinality: IDSSimpleCardinality | IDSConditionalCardinaltiy = "required";

  // When using this facet as a requirement, instructions can be given for the authors of the IFC.
  instructions?: string;

  constructor(protected components: Components) {}

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

    if (checks) {
      const index = checks.findIndex(
        ({ parameter }) => parameter === checkLog.parameter,
      );

      if (index !== -1) {
        checks[index] = checkLog;
      } else {
        checks.push(checkLog);
      }
    }

    let pass = false;

    if (facetParameter.type === "simple") {
      const parameter = facetParameter.parameter as IDSSimpleParameter;
      pass = value === parameter;
    }

    if (facetParameter.type === "enumeration") {
      const parameter = facetParameter.parameter as IDSEnumerationParameter;
      pass = parameter.includes(value as never);
    }

    if (facetParameter.type === "pattern") {
      const parameter = facetParameter.parameter as IDSPatternParameter;
      const regex = new RegExp(String(parameter));
      pass = regex.test(String(value));
    }

    if (facetParameter.type === "length") {
      const parameter = facetParameter.parameter as IDSLengthParameter;
      const { min, length, max } = parameter;
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
      const { min, minInclusive, max, maxInclusive } =
        facetParameter.parameter as IDSBoundsParameter;

      let minPass = true;
      let maxPass = true;

      if (min !== undefined) {
        minPass = minInclusive ? value <= min : value < min;
      }

      if (max !== undefined) {
        maxPass = maxInclusive ? value >= max : value > max;
      }

      pass = minPass && maxPass;
    }

    if (this.cardinality === "prohibited") pass = !pass;
    if (this.cardinality === "optional" && value === null) pass = true;

    checkLog.pass = pass;
    return checkLog.pass;
  };

  protected testResult: IDSCheckResult[] = [];
  protected saveResult(attrs: any, pass: boolean) {
    const { GlobalId } = attrs;
    if (!GlobalId) return;
    const { value: guid } = GlobalId;
    const result: IDSCheckResult = { expressID: guid, pass, checks: [] };
    this.testResult.push(result);
  }

  abstract getEntities(
    model: FRAGS.FragmentsGroup,
    collector: FRAGS.IfcProperties,
  ): Promise<number[]>;

  abstract test(
    entities: FRAGS.IfcProperties,
    model?: FRAGS.FragmentsGroup,
  ): Promise<IDSCheckResult[]>;
}
