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
} from "../types";

export abstract class IDSFacet {
  constructor(protected components: Components) {}

  protected evalRequirement = (
    parameter: IDSFacetParameterName,
    value: string | number | boolean,
    facetParameter: IDSFacetParameter,
    checks: IDSCheck[],
  ) => {
    const checkLog: IDSCheck = {
      parameter,
      currentValue: value,
      requiredValue: facetParameter.parameter,
      pass: false,
    };

    const index = checks.findIndex(
      ({ parameter }) => parameter === checkLog.parameter,
    );

    if (index !== -1) {
      checks[index] = checkLog;
    } else {
      checks.push(checkLog);
    }

    if (facetParameter.type === "simple") {
      const parameter = facetParameter.parameter as IDSSimpleParameter;
      checkLog.pass = value === parameter;
    }

    if (facetParameter.type === "enumeration") {
      const parameter = facetParameter.parameter as IDSEnumerationParameter;
      checkLog.pass = parameter.includes(value as never);
    }

    if (facetParameter.type === "pattern") {
      const parameter = facetParameter.parameter as IDSPatternParameter;
      const regex = new RegExp(String(parameter));
      checkLog.pass = regex.test(String(value));
    }

    if (facetParameter.type === "length") {
      const parameter = facetParameter.parameter as IDSLengthParameter;
      const { min, length, max } = parameter;
      if (length !== undefined) checkLog.pass = String(value).length === length;
      if (min !== undefined) checkLog.pass = String(value).length >= min;
      if (max !== undefined) checkLog.pass = String(value).length <= max;
    }

    if (facetParameter.type === "bounds" && typeof value === "number") {
      const { min, minInclusive, max, maxInclusive } =
        facetParameter.parameter as IDSBoundsParameter;

      if (min !== undefined) {
        if (minInclusive) {
          if (value < min) checkLog.pass = false;
        } else if (value <= min) {
          checkLog.pass = false;
        }
      }

      if (max !== undefined) {
        if (maxInclusive) {
          if (value > max) checkLog.pass = false;
        } else if (value >= max) {
          checkLog.pass = false;
        }
      }
    }

    return checkLog.pass;
  };

  protected testResult: IDSCheckResult[] = [];
  protected saveResult(attrs: any, pass: boolean) {
    const { GlobalId } = attrs;
    if (!GlobalId) return;
    const { value: guid } = GlobalId;
    const result: IDSCheckResult = { guid, pass, checks: [] };
    // if (data && !pass) {
    //   const { currentValue, requiredValue, parameter } = data;
    //   result.reason = {
    //     currentValue,
    //     requiredValue,
    //     parameter,
    //   };
    // }
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
