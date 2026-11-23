import * as FRAGS from "@thatopen/fragments";
import { Components } from "../../../../core/Components";
import {
  IDSFacetParameter,
  IDSFacetParameterName,
  IDSCheck,
  IDSConditionalCardinaltiy,
  IDSSimpleCardinality,
  IDSFacetType,
  IDSItemCheckResult,
  IDSItemFacetCheck,
} from "../types";
import { ModelIdDataMap, ModelIdMap } from "../../../../fragments";

export abstract class IDSFacet {
  abstract facetType: IDSFacetType;

  // Used when the facet is a requirement
  // On IDSEntity is always required
  cardinality: IDSSimpleCardinality | IDSConditionalCardinaltiy = "required";

  // When using this facet as a requirement, instructions can be given for the authors of the IFC.
  instructions?: string;

  constructor(protected _components: Components) {}

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
    cardinality: IDSSimpleCardinality | IDSConditionalCardinaltiy = this
      .cardinality,
  ): boolean => {
    const checkLog: IDSCheck = {
      parameter,
      currentValue: value,
      requiredValue: facetParameter,
      pass: false,
    };

    if (checks) this.addCheckResult(checkLog, checks);

    let pass = false;

    if (facetParameter.type === "simple") {
      const expected = facetParameter.parameter;
      pass = value === expected;
      if (
        typeof value === "number" &&
        (typeof expected === "number" ||
          /^[+-]?(?:\d+(?:\.\d*)?|\.\d+)(?:[eE][+-]?\d+)?$/.test(
            String(expected),
          ))
      ) {
        const number = Number(expected);
        const tolerance = Math.abs(number) * 1e-6 + 1e-6;
        pass =
          Math.abs(value - number) <=
          tolerance +
            Number.EPSILON * Math.max(1, Math.abs(value), Math.abs(number));
      }
      if (typeof value === "boolean")
        pass =
          String(expected) === String(value) ||
          String(expected) === (value ? "1" : "0");
    }

    if (facetParameter.type === "enumeration") {
      pass = facetParameter.parameter.some((expected) =>
        this.evalRequirement(
          value,
          { type: "simple", parameter: expected },
          parameter,
          undefined,
          "required",
        ),
      );
    }

    if (facetParameter.type === "pattern") {
      // XSD patterns match the whole value, not a substring.
      const regex = new RegExp(`^(?:${facetParameter.parameter})$`);
      pass = regex.test(String(value));
    }

    if (facetParameter.type === "length") {
      // Every given limit must hold, not just the last one checked.
      const { min, length, max } = facetParameter.parameter;
      const valueLength = String(value).length;
      pass =
        (length === undefined || valueLength === length) &&
        (min === undefined || valueLength >= min) &&
        (max === undefined || valueLength <= max);
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

    if (facetParameter.type === "restriction") {
      const restriction = facetParameter.parameter;
      const repeated = (key: string) => {
        const item = restriction[key];
        return item === undefined ? [] : Array.isArray(item) ? item : [item];
      };
      pass = true;
      const patterns = repeated("pattern");
      if (patterns.length)
        pass = patterns.some(({ value: pattern }) =>
          new RegExp(`^(?:${pattern})$`, "u").test(String(value)),
        );
      const enumeration = repeated("enumeration");
      if (enumeration.length)
        pass &&= enumeration.some(({ value: expected }) =>
          this.evalRequirement(
            value,
            { type: "simple", parameter: expected },
            parameter,
            undefined,
            "required",
          ),
        );
      for (const [key, setting] of Object.entries(restriction)) {
        if (["base", "pattern", "enumeration"].includes(key)) continue;
        const limit = Number((setting as { value: string | number }).value);
        if (key === "length") pass &&= [...String(value)].length === limit;
        if (key === "minLength") pass &&= [...String(value)].length >= limit;
        if (key === "maxLength") pass &&= [...String(value)].length <= limit;
        if (key === "minInclusive")
          pass &&= typeof value === "number" && value >= limit;
        if (key === "minExclusive")
          pass &&= typeof value === "number" && value > limit;
        if (key === "maxInclusive")
          pass &&= typeof value === "number" && value <= limit;
        if (key === "maxExclusive")
          pass &&= typeof value === "number" && value < limit;
      }
    }

    if (cardinality === "prohibited") pass = !pass;
    if (cardinality === "optional") pass = true;

    checkLog.pass = pass;
    return checkLog.pass;
  };

  protected getItemChecks(
    collector: ModelIdDataMap<IDSItemCheckResult>,
    modelId: string,
    item: FRAGS.ItemData,
    skipIfFails: boolean,
  ) {
    if (
      !("value" in item._localId && typeof item._localId.value === "number")
    ) {
      return null;
    }

    let modelItemResults = collector.get(modelId);
    if (!modelItemResults) {
      modelItemResults = new FRAGS.DataMap();
      collector.set(modelId, modelItemResults);
    }

    let result = modelItemResults.get(item._localId.value);

    // If there are results already and the item didn't pass, skip further checks
    if (result && skipIfFails && !result.pass) {
      return null;
    }

    // If there are no results for this item, create them
    if (!result) {
      const checks: IDSItemFacetCheck[] = [];

      result = {
        guid: Array.isArray(item._guid) ? undefined : item._guid.value,
        pass: false,
        checks,
      };

      Object.defineProperty(result, "pass", {
        get: () => checks.every(({ pass }) => pass),
      });

      modelItemResults.set(item._localId.value, result);
    }

    // Create the checks for the current facet
    const checks: IDSCheck[] = [];

    const check: IDSItemFacetCheck = {
      facetType: this.facetType,
      cardinality: this.cardinality,
      checks,
      pass: false,
    };

    Object.defineProperty(check, "pass", {
      get: () => checks.every(({ pass }) => pass),
    });

    // Add the current facet check to the item's result
    result.checks.push(check);

    return check.checks;
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
    modelIds: RegExp[],
    collector: ModelIdMap,
  ): Promise<void>;

  abstract test(
    items: ModelIdMap,
    collector: ModelIdDataMap<IDSItemCheckResult>,
    config: { skipIfFails: boolean },
  ): Promise<void>;

  abstract serialize(type: "applicability" | "requirement"): string;
}
