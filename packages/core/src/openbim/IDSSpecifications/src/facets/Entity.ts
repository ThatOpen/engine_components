import { IDS_IFC2X3_MAPPING } from "./entity-mapping";
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
import { XML } from "../../../../utils/xml";

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
    const predefinedTypeXML = getParameterXML(
      "PredefinedType",
      this.predefinedType,
    );
    let attributes = "";
    if (type === "requirement") {
      attributes += this.instructions
        ? `instructions="${XML.escape(this.instructions)}"`
        : "";
    }
    return `<entity ${attributes}>
  ${nameXML}
  ${predefinedTypeXML}
</entity>`;
  }

  async getEntities(modelIds: RegExp[], collector: ModelIdMap) {
    for (const [modelId, model] of this._components.get(FragmentsManager)
      .list) {
      if (!modelIds.some((pattern) => pattern.test(modelId))) continue;
      const categories = await model.getCategories();
      const metadata = await model.getMetadata();
      const mapped = String(metadata.schema).startsWith("IFC2X3");
      const possible = categories.filter(
        (category) =>
          this.evalRequirement(
            category,
            this.name,
            "Name",
            undefined,
            "required",
          ) ||
          (mapped &&
            Object.entries(IDS_IFC2X3_MAPPING).some(
              ([name, [occurrence]]) =>
                occurrence === category &&
                this.evalRequirement(
                  name,
                  this.name,
                  "Name",
                  undefined,
                  "required",
                ),
            )),
      );
      if (!possible.length) continue;
      const ids = Object.values(
        await model.getItemsOfCategories(
          possible.map((category) => new RegExp(`^${category}$`)),
        ),
      ).flat();
      const results: ModelIdDataMap<IDSItemCheckResult> = new FRAGS.DataMap();
      await this.test({ [modelId]: new Set(ids) }, results, {
        skipIfFails: false,
      });
      const selected = collector[modelId] ?? new Set<number>();
      for (const [id, result] of results.get(modelId) ?? [])
        if (result.pass) selected.add(id);
      if (selected.size) collector[modelId] = selected;
    }
  }

  async test(
    items: ModelIdMap,
    collector: ModelIdDataMap<IDSItemCheckResult>,
    config: { skipIfFails: boolean },
  ) {
    const fragments = this._components.get(FragmentsManager);
    for (const [modelId, localIds] of Object.entries(items)) {
      const model = fragments.list.get(modelId);
      if (!model) continue;

      const data = await model.getItemsData([...localIds], {
        relations: {
          IsTypedBy: { attributes: true, relations: false },
          IsDefinedBy: { attributes: true, relations: false },
        },
      });
      const metadata = await model.getMetadata();
      for (const item of data) {
        if (!("value" in item._category)) continue;
        const checks = this.getItemChecks(
          collector,
          modelId,
          item,
          config.skipIfFails,
        );
        if (!checks) continue;
        let category = item._category.value;
        if (String(metadata.schema).startsWith("IFC2X3")) {
          const definitions = [
            ...(Array.isArray(item.IsTypedBy) ? item.IsTypedBy : []),
            ...(Array.isArray(item.IsDefinedBy) ? item.IsDefinedBy : []),
          ];
          const mapped = Object.entries(IDS_IFC2X3_MAPPING).find(
            ([, [occurrence, type]]) =>
              occurrence === category &&
              definitions.some(
                (definition) =>
                  definition._category &&
                  "value" in definition._category &&
                  definition._category.value === type,
              ),
          );
          if (mapped) category = mapped[0];
        }
        await this.evalName(category, checks);
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

    const isRequirementUserDefined =
      typeof this.predefinedType.parameter === "string" &&
      this.predefinedType.parameter === "USERDEFINED";

    // Some entities (e.g. IfcSite in IFC4) have no PredefinedType attribute
    // at all; their item data has no such key. Treat that as "no value", so
    // the requirement fails instead of throwing.
    const own = itemData.PredefinedType;
    let value = own && "value" in own ? own.value : undefined;

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
          relations: {
            IsTypedBy: { attributes: true, relations: false },
            IsDefinedBy: { attributes: true, relations: false },
          },
        });
        // The type is reached through IsTypedBy or, in models converted by
        // IfcImporter, through IsDefinedBy (as in IDSProperty.getTypePsets).
        const definitions = [
          ...(Array.isArray(data.IsTypedBy) ? data.IsTypedBy : []),
          ...(Array.isArray(data.IsDefinedBy) ? data.IsDefinedBy : []),
        ];
        const typeAttrs = definitions.find(
          (definition) =>
            definition?._category &&
            "value" in definition._category &&
            /TYPE$/.test(String(definition._category.value)),
        );
        if (typeAttrs) {
          if (
            typeAttrs?.PredefinedType &&
            "value" in typeAttrs.PredefinedType
          ) {
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
