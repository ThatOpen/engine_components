import * as FRAGS from "@thatopen/fragments";
import {
  FragmentsManager,
  ModelIdDataMap,
  ModelIdMap,
} from "../../../../fragments";
import { getParameterXML } from "../exporters/parameter";
import { IDSFacetParameter, IDSItemCheckResult } from "../types";
import { IDSFacet } from "./Facet";
import { XML } from "../../../../utils/xml";

const children = [
  "ForLayerSet",
  "MaterialLayers",
  "ForProfileSet",
  "MaterialProfiles",
  "Material",
  "MaterialConstituents",
  "Materials",
];
const value = (item: FRAGS.ItemData, name: string) => {
  const attribute = item[name];
  return attribute && !Array.isArray(attribute) ? attribute.value : undefined;
};
const refs = (item: FRAGS.ItemData, name: string): FRAGS.ItemData[] =>
  Array.isArray(item[name]) ? (item[name] as FRAGS.ItemData[]) : [];

export class IDSMaterial extends IDSFacet {
  facetType = "Material" as const;
  value?: IDSFacetParameter;
  uri?: string;

  serialize(type: "applicability" | "requirement") {
    let attributes = "";
    if (type === "requirement") {
      attributes += ` cardinality="${this.cardinality}"`;
      if (this.uri) attributes += ` uri="${XML.escape(this.uri)}"`;
      if (this.instructions)
        attributes += ` instructions="${XML.escape(this.instructions)}"`;
    }
    return `<material${attributes}>${getParameterXML("Value", this.value)}</material>`;
  }

  async getEntities(modelIds: RegExp[], collector: ModelIdMap) {
    for (const [modelId, model] of this._components.get(FragmentsManager)
      .list) {
      if (!modelIds.some((pattern) => pattern.test(modelId))) continue;
      const ids = Object.values(
        await model.getItemsOfCategories([/.*/]),
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
    config = { skipIfFails: true },
  ) {
    const options = {
      attributesDefault: true,
      relations: Object.fromEntries(
        [...children, "HasAssociations", "IsTypedBy", "IsDefinedBy"].map(
          (name) => [name, { attributes: true, relations: false }],
        ),
      ),
    };
    for (const [modelId, ids] of Object.entries(items)) {
      const model = this._components.get(FragmentsManager).list.get(modelId);
      if (!model) continue;
      const cache = new Map<number, FRAGS.ItemData>();
      const read = async (item: FRAGS.ItemData) => {
        const id = value(item, "_localId");
        if (typeof id !== "number") return item;
        if (!cache.has(id))
          cache.set(id, (await model.getItemsData([id], options))[0] ?? item);
        return cache.get(id)!;
      };
      const associations = async (item: FRAGS.ItemData) => {
        const data = await read(item);
        const own = refs(data, "HasAssociations").filter((ref) =>
          String(value(ref, "_category")).startsWith("IFCMATERIAL"),
        );
        if (own.length) return own;
        const inherited: FRAGS.ItemData[] = [];
        for (const type of [
          ...refs(data, "IsTypedBy"),
          ...refs(data, "IsDefinedBy"),
        ]) {
          const definition = await read(type);
          inherited.push(
            ...refs(definition, "HasAssociations").filter((ref) =>
              String(value(ref, "_category")).startsWith("IFCMATERIAL"),
            ),
          );
        }
        return inherited;
      };
      for (const item of await model.getItemsData([...ids])) {
        const checks = this.getItemChecks(
          collector,
          modelId,
          item,
          config.skipIfFails,
        );
        if (!checks) continue;
        const roots = await associations(item);
        let matches = false;
        const seen = new Set<number>();
        const visit = async (ref: FRAGS.ItemData): Promise<boolean> => {
          const id = value(ref, "_localId");
          if (typeof id === "number") {
            if (seen.has(id)) return false;
            seen.add(id);
          }
          const material = await read(ref);
          if (!this.value) return true;
          for (const name of ["Name", "LayerSetName", "Category"]) {
            const actual = value(material, name);
            if (
              actual !== undefined &&
              actual !== null &&
              this.evalRequirement(
                actual,
                this.value,
                "Value",
                undefined,
                "required",
              )
            )
              return true;
          }
          for (const name of children)
            for (const child of refs(material, name))
              if (await visit(child)) return true;
          return false;
        };
        for (const root of roots)
          if (await visit(root)) {
            matches = true;
            break;
          }
        let pass = matches;
        if (this.cardinality === "prohibited") pass = !matches;
        if (this.cardinality === "optional" && !roots.length) pass = true;
        checks.push({
          parameter: "Value",
          currentValue: roots.length
            ? roots.map((root) => value(root, "Name")).join(", ")
            : null,
          requiredValue: this.value,
          pass,
        });
      }
    }
  }
}
