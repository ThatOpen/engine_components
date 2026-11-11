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

/**
 * Item data fetched once per specification run and shared by its
 * requirements, keyed by the applicable items of that run. Each
 * `getItemsData` call has a large fixed cost in the fragments worker, and
 * every requirement of a specification tests the same items.
 */
const sharedItemsData = new WeakMap<
  ModelIdMap,
  Map<string, Promise<FRAGS.ItemData[]>>
>();

export abstract class IDSFacet {
  abstract facetType: IDSFacetType;

  /**
   * Lets the facets tested on `items` share their item data until
   * {@link endSharedItemsData} is called. Used by `IDSSpecification.test`.
   */
  static startSharedItemsData(items: ModelIdMap) {
    sharedItemsData.set(items, new Map());
  }

  static endSharedItemsData(items: ModelIdMap) {
    sharedItemsData.delete(items);
  }

  /**
   * `model.getItemsData` for the items of `modelId`, shared with the other
   * requirements of the same specification run when one is in progress.
   * Requests with the same `key` must use the same `config`, and callers
   * must not modify the returned data.
   */
  protected getSharedItemsData(
    items: ModelIdMap,
    modelId: string,
    model: FRAGS.FragmentsModel,
    key: string,
    config?: Parameters<FRAGS.FragmentsModel["getItemsData"]>[1],
  ) {
    const fetch = () => model.getItemsData([...items[modelId]], config);
    const shared = sharedItemsData.get(items);
    if (!shared) return fetch();
    const fullKey = `${key}:${modelId}`;
    let data = shared.get(fullKey);
    if (!data) {
      data = fetch();
      shared.set(fullKey, data);
    }
    return data;
  }

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
  ) => {
    const checkLog: IDSCheck = {
      parameter,
      currentValue: value,
      requiredValue: facetParameter,
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
