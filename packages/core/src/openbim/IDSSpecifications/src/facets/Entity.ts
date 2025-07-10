import * as FRAGS from "@thatopen/fragments";
import { Components } from "../../../../core/Components";
import { IDSFacet } from "./Facet";
import { IDSCheck, IDSFacetParameter, IDSItemCheckResult } from "../types";
import { getParameterXML } from "../exporters/parameter";
import {
  FragmentsManager,
  ModelIdDataMap,
  ModelIdMap,
} from "../../../../fragments";
import { ModelIdMapUtils } from "../../../../utils";

// https://github.com/buildingSMART/IDS/blob/development/Documentation/UserManual/entity-facet.md

export class IDSEntity extends IDSFacet {
  facetType = "Entity" as const;
  name: IDSFacetParameter;
  predefinedType?: IDSFacetParameter;

  constructor(components: Components, name: IDSFacetParameter) {
    super(components);
    this.name = name;
  }

  serialize(type: "applicability" | "requirement") {
    const nameXML = getParameterXML("Name", this.name);
    const predefinedTypeXML = getParameterXML("Name", this.predefinedType);
    let attributes = "";
    if (type === "requirement") {
      attributes += `cardinality="${this.cardinality}"`;
      attributes += this.instructions
        ? `instructions="${this.instructions}"`
        : "";
    }
    return `<entity ${attributes}>
  ${nameXML}
  ${predefinedTypeXML}
</entity>`;
  }

  async getEntities(modelIds: RegExp[], collector: ModelIdMap) {
    const fragments = this._components.get(FragmentsManager);
    const modelCategories = new Map<string, string[]>();

    // Check the categories from each model to see
    // which of them matches the facet parameter this.name
    for (const [modelId, model] of fragments.list) {
      const isValidModel = modelIds.find((regex) => regex.test(modelId));
      if (!isValidModel) continue;
      const categories = await model.getCategories();
      for (const category of categories) {
        const isValidCategory = await this.evalName(category);
        if (!isValidCategory) continue;
        let validCategories = modelCategories.get(modelId);
        if (!validCategories) {
          validCategories = [];
          modelCategories.set(modelId, validCategories);
        }
        validCategories.push(category);
      }
    }

    // Get all the localIds from the categories passing
    // the conditions above
    const items: ModelIdMap = {};
    await Promise.all(
      Array.from(modelCategories.entries()).map(
        async ([modelId, categories]) => {
          const model = fragments.list.get(modelId);
          if (!model) return;
          const regexCategories = categories.map(
            (cat) => new RegExp(`^${cat}$`),
          );
          const categoryItemIds =
            await model.getItemsOfCategories(regexCategories);
          const localIds = Object.values(categoryItemIds).flat();
          items[modelId] = new Set(localIds);
        },
      ),
    );

    if (!this.predefinedType) {
      ModelIdMapUtils.add(collector, items);
      return;
    }

    // Check the predefinedType conditions
    for (const [modelId, localIds] of Object.entries(items)) {
      const model = fragments.list.get(modelId);
      if (!model) continue;
      const itemsData = await model.getItemsData([...localIds]);
      for (const attribute of itemsData) {
        if (!("value" in attribute._localId)) continue;
        const isValidPredefinedType = await this.evalPredefinedType(
          modelId,
          attribute,
        );
        if (isValidPredefinedType) {
          ModelIdMapUtils.append(collector, modelId, attribute._localId.value);
        }
      }
    }
  }

  async test(items: ModelIdMap, collector: ModelIdDataMap<IDSItemCheckResult>) {
    const fragments = this._components.get(FragmentsManager);
    for (const [modelId, localIds] of Object.entries(items)) {
      const model = fragments.list.get(modelId);
      if (!model) continue;

      const data = await model.getItemsData([...localIds]);
      for (const item of data) {
        if (!("value" in item._category)) continue;
        const checks = this.getItemChecks(collector, modelId, item);
        if (!checks) continue;
        await this.evalName(item._category.value, checks);
        await this.evalPredefinedType(modelId, item, checks);
      }
    }
  }

  protected async evalName(category: string, checks?: IDSCheck[]) {
    const result = this.evalRequirement(category, this.name, "Name", checks);
    return result;
  }

  protected async evalPredefinedType(
    modelId: string,
    itemData: FRAGS.ItemData,
    checks?: IDSCheck[],
  ) {
    if (!this.predefinedType) return null;
    if (!("value" in itemData.PredefinedType)) return null;

    const isRequirementUserDefined =
      typeof this.predefinedType.parameter === "string" &&
      this.predefinedType.parameter === "USERDEFINED";

    let value = itemData.PredefinedType.value;

    // TODO: Do not remember what is this for
    if (value === "USERDEFINED" && !isRequirementUserDefined) {
      const attrNames = Object.keys(itemData);
      const key = attrNames.find((str) => /^((?!Predefined).)*Type$/.test(str));
      if (key) {
        const keyValue = itemData[key];
        if ("value" in keyValue) value = keyValue.value;
      } else {
        value = "USERDEFINED";
      }
    }

    if (!value) {
      const fragments = this._components.get(FragmentsManager);
      const model = fragments.list.get(modelId);
      if (model && "value" in itemData._localId) {
        const [data] = await model.getItemsData([itemData._localId.value], {
          relations: { IsTypedBy: { attributes: true, relations: false } },
        });
        if (Array.isArray(data.IsTypedBy)) {
          const typeAttrs = data.IsTypedBy[0];
          if (typeAttrs && "value" in typeAttrs.PredefinedType) {
            value = typeAttrs.PredefinedType.value;
            if (value === "USERDEFINED" && !isRequirementUserDefined) {
              const attrNames = Object.keys(typeAttrs);
              const key = attrNames.find((str) =>
                /^((?!Predefined).)*Type$/.test(str),
              );
              if (key) {
                const keyValue = typeAttrs[key];
                if ("value" in keyValue) value = keyValue.value;
              } else {
                value = "USERDEFINED";
              }
            }
          }
        }
      }
    }

    const result = this.evalRequirement(
      value,
      this.predefinedType,
      "PredefinedType",
      checks,
    );

    return result;
  }
}
