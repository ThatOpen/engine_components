import type * as FRAGS from "@thatopen/fragments";
import { Components } from "../../../../core/Components";
import { IDSFacetParameter, IDSItemCheckResult } from "../types";
import { IDSFacet } from "./Facet";
import { getParameterXML } from "../exporters/parameter";
import {
  FragmentsManager,
  ModelIdDataMap,
  ModelIdMap,
} from "../../../../fragments";
import { XML } from "../../../../utils/xml";

type Classification = { system: string; values: string[] };
const value = (item: FRAGS.ItemData, name: string) => {
  const attribute = item[name];
  return attribute && !Array.isArray(attribute) ? attribute.value : undefined;
};
const refs = (item: FRAGS.ItemData, name: string): FRAGS.ItemData[] => {
  const data = item[name];
  return Array.isArray(data) ? data : [];
};

/** Classification systems and codes, including reference chains and type inheritance. */
export class IDSClassification extends IDSFacet {
  facetType = "Classification" as const;
  system: IDSFacetParameter;
  value?: IDSFacetParameter;
  uri?: string;
  constructor(components: Components, system: IDSFacetParameter) {
    super(components);
    this.system = system;
  }

  serialize(type: "applicability" | "requirement") {
    const attributes =
      type === "requirement"
        ? ` cardinality="${this.cardinality}"${this.uri ? ` uri="${XML.escape(this.uri)}"` : ""}${this.instructions ? ` instructions="${XML.escape(this.instructions)}"` : ""}`
        : "";
    return `<classification${attributes}>${getParameterXML("Value", this.value)}${getParameterXML("System", this.system)}</classification>`;
  }

  private async evaluate(items: ModelIdMap) {
    const result = new Map<string, Map<number, Classification[]>>();
    const options = {
      attributesDefault: true,
      relations: {
        HasAssociations: { attributes: true, relations: false },
        HasClassifications: { attributes: true, relations: false },
        HasExternalReferences: { attributes: true, relations: false },
        ReferencedSource: { attributes: true, relations: false },
        RelatingReference: { attributes: true, relations: false },
        RelatedResourceObjects: { attributes: true, relations: false },
        IsTypedBy: { attributes: true, relations: false },
        IsDefinedBy: { attributes: true, relations: false },
      },
    };
    for (const [modelId, ids] of Object.entries(items)) {
      const model = this._components.get(FragmentsManager).list.get(modelId);
      if (!model) continue;
      const cache = new Map<number, FRAGS.ItemData | undefined>();
      const read = async (item: FRAGS.ItemData) => {
        const id = value(item, "_localId");
        if (typeof id !== "number") return item;
        if (!cache.has(id))
          cache.set(id, (await model.getItemsData([id], options))[0]);
        return cache.get(id) ?? item;
      };
      const classification = async (
        item: FRAGS.ItemData,
      ): Promise<Classification | null> => {
        const codes: string[] = [];
        const seen = new Set<number>();
        let current: FRAGS.ItemData | undefined = item;
        while (current) {
          const id = value(current, "_localId");
          if (typeof id === "number") {
            if (seen.has(id)) return null;
            seen.add(id);
          }
          const data = await read(current);
          const category = value(data, "_category");
          if (category === "IFCCLASSIFICATION") {
            const name = value(data, "Name");
            return {
              system: typeof name === "string" ? name : "",
              values: codes,
            };
          }
          if (category !== "IFCCLASSIFICATIONREFERENCE") return null;
          const code =
            value(data, "Identification") ?? value(data, "ItemReference");
          if (typeof code === "string" && code) codes.push(code);
          current = refs(data, "ReferencedSource")[0];
        }
        return null;
      };
      const externalReferences = new Map<number, FRAGS.ItemData[]>();
      const externalIds = Object.values(
        await model.getItemsOfCategories([
          /^IFCEXTERNALREFERENCERELATIONSHIP$/,
        ]),
      ).flat();
      if (externalIds.length) {
        const external = await model.getItemsData(externalIds, options);
        for (const relationship of external) {
          const reference = refs(relationship, "RelatingReference")[0];
          if (!reference) continue;
          for (const resource of refs(relationship, "RelatedResourceObjects")) {
            const id = value(resource, "_localId");
            if (typeof id !== "number") continue;
            const previous = externalReferences.get(id) ?? [];
            previous.push(reference);
            externalReferences.set(id, previous);
          }
        }
      }
      const own = async (item: FRAGS.ItemData) => {
        const found: Classification[] = [];
        for (const ref of [
          ...refs(item, "HasAssociations"),
          ...refs(item, "HasClassifications"),
          ...refs(item, "HasExternalReferences"),
          ...(externalReferences.get(value(item, "_localId") as number) ?? []),
        ]) {
          const data = await classification(ref);
          if (data) found.push(data);
        }
        return found;
      };
      const modelResult = new Map<number, Classification[]>();
      result.set(modelId, modelResult);
      for (const id of ids) {
        const item = await read({ _localId: { value: id } } as FRAGS.ItemData);
        const classifications = await own(item);
        const ownSystems = new Set(classifications.map((c) => c.system));
        const types = [
          ...refs(item, "IsTypedBy"),
          ...refs(item, "IsDefinedBy").filter((t) =>
            String(value(t, "_category")).endsWith("TYPE"),
          ),
        ];
        for (const type of types) {
          for (const inherited of await own(await read(type)))
            if (!ownSystems.has(inherited.system))
              classifications.push(inherited);
        }
        modelResult.set(id, classifications);
      }
    }
    return result;
  }

  private matches(classifications: Classification[]) {
    return classifications.some(
      (c) =>
        this.evalRequirement(
          c.system,
          this.system,
          "System",
          undefined,
          "required",
        ) &&
        (!this.value ||
          c.values.some((code) =>
            this.evalRequirement(
              code,
              this.value!,
              "Value",
              undefined,
              "required",
            ),
          )),
    );
  }

  async getEntities(modelIds: RegExp[], collector: ModelIdMap) {
    const items: ModelIdMap = {};
    for (const [id, model] of this._components.get(FragmentsManager).list) {
      if (
        !modelIds.some((regex) => {
          regex.lastIndex = 0;
          return regex.test(id);
        })
      )
        continue;
      items[id] = new Set(
        Object.values(await model.getItemsOfCategories([/.*/])).flat(),
      );
    }
    for (const [id, classifications] of await this.evaluate(items)) {
      for (const [localId, data] of classifications) {
        if (!this.matches(data)) continue;
        collector[id] ??= new Set();
        collector[id].add(localId);
      }
    }
  }

  async test(
    items: ModelIdMap,
    collector: ModelIdDataMap<IDSItemCheckResult>,
    config = { skipIfFails: false },
  ) {
    for (const [modelId, data] of await this.evaluate(items)) {
      const model = this._components.get(FragmentsManager).list.get(modelId);
      if (!model) continue;
      for (const item of await model.getItemsData([...data.keys()], {
        attributesDefault: true,
      })) {
        const id = value(item, "_localId");
        if (typeof id !== "number") continue;
        const checks = this.getItemChecks(
          collector,
          modelId,
          item,
          config.skipIfFails,
        );
        if (!checks) continue;
        const classifications = data.get(id) ?? [];
        const matched = this.matches(classifications);
        // URI describes the requirement; it is not an IFC matching condition.
        checks.push({
          parameter: "System",
          requiredValue: this.system,
          currentValue: classifications.map((c) => c.system),
          pass:
            this.cardinality === "prohibited"
              ? !matched
              : (this.cardinality === "optional" &&
                  classifications.length === 0) ||
                matched,
        });
      }
    }
  }
}
