import { DataMap } from "@thatopen/fragments";
import { IDSFacetParameter, IDSItemCheckResult } from "../types";
import { Components } from "../../../../core/Components";
import { IDSFacet } from "./Facet";
import { getParameterXML } from "../exporters/parameter";
import {
  FragmentsManager,
  ModelIdDataMap,
  ModelIdMap,
} from "../../../../fragments";
import { XML } from "../../../../utils/xml";

// https://github.com/buildingSMART/IDS/blob/development/Documentation/UserManual/attribute-facet.md

export class IDSAttribute extends IDSFacet {
  facetType = "Attribute" as const;
  name: IDSFacetParameter;
  value?: IDSFacetParameter;

  constructor(components: Components, name: IDSFacetParameter) {
    super(components);
    this.name = name;
  }

  serialize(type: "applicability" | "requirement") {
    const nameXML = getParameterXML("Name", this.name);
    const valueXML = getParameterXML("Value", this.value);
    let attributes = "";
    if (type === "requirement") {
      attributes += `cardinality="${this.cardinality}"`;
      attributes += this.instructions
        ? ` instructions="${XML.escape(this.instructions)}"`
        : "";
    }
    return `<attribute ${attributes}>
  ${nameXML}
  ${valueXML}
</attribute>`;
  }

  async getEntities(modelIds: RegExp[], collector: ModelIdMap) {
    const fragments = this._components.get(FragmentsManager);
    for (const [modelId, model] of fragments.list) {
      if (!modelIds.some((pattern) => pattern.test(modelId))) continue;
      const ids = Object.values(
        await model.getItemsOfCategories([/.*/]),
      ).flat();
      const results: ModelIdDataMap<IDSItemCheckResult> = new DataMap();
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
    config: { skipIfFails: boolean } = { skipIfFails: true },
  ) {
    const fragments = this._components.get(FragmentsManager);
    for (const [modelId, localIds] of Object.entries(items)) {
      const model = fragments.list.get(modelId);
      if (!model) continue;
      const data = await model.getItemsData([...localIds], {
        attributesDefault: true,
        relationsDefault: { attributes: true, relations: false },
      });
      for (const item of data) {
        const checks = this.getItemChecks(
          collector,
          modelId,
          item,
          config.skipIfFails,
        );
        if (!checks) continue;

        // GlobalId is retained by Fragments as _guid. Internal metadata is not
        // an IFC attribute and must never satisfy a name restriction.
        const attributes = { ...item, GlobalId: item._guid };
        const names = Object.keys(attributes).filter(
          (name) =>
            !name.startsWith("_") &&
            this.evalRequirement(
              name,
              this.name,
              "Name",
              undefined,
              "required",
            ),
        );
        let present = false;
        let matches = false;
        let actual: string | number | boolean | null = null;
        for (const name of names) {
          const attribute = attributes[name as keyof typeof attributes];
          if (attribute == null) continue;
          if (Array.isArray(attribute)) {
            if (attribute.length) {
              present = true;
              if (!this.value) matches = true;
            }
            continue;
          }
          const value = attribute.value;
          if (value === null || value === undefined) continue;
          present = true;
          if (typeof value === "string" && !value.trim()) continue;
          if (Array.isArray(value)) {
            if (value.length && !this.value) matches = true;
            continue;
          }
          actual = value;
          if (
            !this.value ||
            this.evalRequirement(
              value,
              this.value,
              "Value",
              undefined,
              "required",
            )
          )
            matches = true;
        }
        let pass = matches;
        if (this.cardinality === "prohibited") pass = !matches;
        if (this.cardinality === "optional" && !present) pass = true;
        checks.push({
          parameter: this.value ? "Value" : "Name",
          currentValue: actual,
          requiredValue: this.value ?? this.name,
          pass,
        });
      }
    }
  }
}
