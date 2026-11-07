import type * as FRAGS from "@thatopen/fragments";
import { Components } from "../../../../core/Components";
import { IDSFacet } from "./Facet";
import {
  IDSFacetParameter,
  IDSPartOfRelations,
  IDSSimpleCardinality,
  IDSItemCheckResult,
} from "../types";
import { IDSEntity } from "./Entity";
import {
  FragmentsManager,
  ModelIdMap,
  ModelIdDataMap,
} from "../../../../fragments";
import { getParameterXML } from "../exporters/parameter";
import { XML } from "../../../../utils/xml";

/** The inverse, child-to-parent names produced by the IFC importer. */
const relations: Record<string, string[]> = {
  IFCRELAGGREGATES: ["Decomposes"],
  IFCRELASSIGNSTOGROUP: ["HasAssignments"],
  IFCRELCONTAINEDINSPATIALSTRUCTURE: ["ContainedInStructure"],
  IFCRELNESTS: ["Nests"],
  IFCRELVOIDSELEMENT: ["VoidsElements"],
  IFCRELFILLSELEMENT: ["FillsVoids"],
  "IFCRELVOIDSELEMENT IFCRELFILLSELEMENT": ["FillsVoids", "VoidsElements"],
};

/** IDS 1.0 transitive part-of matching, including non-geometric objects. */
export class IDSPartOf extends IDSFacet {
  facetType = "PartOf" as const;
  private _entityFacet: IDSEntity;
  private _entity: {
    name: IDSFacetParameter;
    predefinedType?: IDSFacetParameter;
  };
  set entity(value: {
    name: IDSFacetParameter;
    predefinedType?: IDSFacetParameter;
  }) {
    this._entity = value;
    this._entityFacet = new IDSEntity(this._components, value.name);
    this._entityFacet.predefinedType = value.predefinedType;
  }
  get entity() {
    return this._entity;
  }
  relation?: IDSPartOfRelations;
  cardinality: IDSSimpleCardinality = "required";

  constructor(
    components: Components,
    entity: { name: IDSFacetParameter; predefinedType?: IDSFacetParameter },
  ) {
    super(components);
    this._entity = entity;
    this._entityFacet = new IDSEntity(components, entity.name);
    this._entityFacet.predefinedType = entity.predefinedType;
  }

  serialize(type: "applicability" | "requirement" = "requirement") {
    const relation = this.relation
      ? ` relation="${XML.escape(this.relation)}"`
      : "";
    const cardinality =
      type === "requirement" ? ` cardinality="${this.cardinality}"` : "";
    const instructions =
      type === "requirement" && this.instructions
        ? ` instructions="${XML.escape(this.instructions)}"`
        : "";
    return `<partOf${relation}${cardinality}${instructions}><entity>${getParameterXML("Name", this.entity.name)}${getParameterXML("PredefinedType", this.entity.predefinedType)}</entity></partOf>`;
  }

  private async evaluate(items: ModelIdMap) {
    const matchingParents: ModelIdMap = {};
    await this._entityFacet.getEntities(
      Object.keys(items).map(
        (id) => new RegExp(`^${id.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`),
      ),
      matchingParents,
    );
    const fragments = this._components.get(FragmentsManager);
    const results: ModelIdMap = {};
    const names = this.relation
      ? relations[this.relation]
      : [...new Set(Object.values(relations).flat())];
    if (!names)
      throw new Error(`Unsupported IDS partOf relation: ${this.relation}`);
    const options = {
      attributesDefault: true,
      relations: Object.fromEntries(
        names.map((name) => [name, { attributes: true, relations: false }]),
      ),
    };
    for (const [modelId, ids] of Object.entries(items)) {
      const model = fragments.list.get(modelId);
      if (!model) continue;
      const targets = matchingParents[modelId] ?? new Set<number>();
      if (!targets.size) continue;
      // Per evaluation: never retain stale relations after a model edit.
      const cache = new Map<number, FRAGS.ItemData | undefined>();
      const read = async (id: number) => {
        if (!cache.has(id))
          cache.set(id, (await model.getItemsData([id], options))[0]);
        return cache.get(id);
      };
      for (const id of ids) {
        const visited = new Set<number>([id]);
        const pending = [id];
        let found = false;
        while (pending.length && !found) {
          const item = await read(pending.pop()!);
          if (!item) continue;
          for (const name of names) {
            const parents = item[name];
            if (!Array.isArray(parents)) continue;
            for (const parent of parents) {
              const parentId = Array.isArray(parent._localId)
                ? undefined
                : parent._localId?.value;
              if (typeof parentId !== "number" || visited.has(parentId))
                continue;
              visited.add(parentId);
              if (targets.has(parentId)) {
                found = true;
                break;
              }
              pending.push(parentId);
            }
            if (found) break;
          }
        }
        if (found) (results[modelId] ??= new Set()).add(id);
      }
    }
    return results;
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
    const matches = await this.evaluate(items);
    for (const [id, ids] of Object.entries(matches)) {
      collector[id] ??= new Set();
      const target = collector[id];
      for (const localId of ids) target.add(localId);
    }
  }

  async test(
    items: ModelIdMap,
    collector: ModelIdDataMap<IDSItemCheckResult>,
    config = { skipIfFails: false },
  ) {
    const matches = await this.evaluate(items);
    for (const [modelId, ids] of Object.entries(items)) {
      const model = this._components.get(FragmentsManager).list.get(modelId);
      if (!model) continue;
      const data = await model.getItemsData([...ids], {
        attributesDefault: true,
      });
      for (const item of data) {
        if (Array.isArray(item._localId)) continue;
        const checks = this.getItemChecks(
          collector,
          modelId,
          item,
          config.skipIfFails,
        );
        if (!checks) continue;
        const matched = matches[modelId]?.has(item._localId.value) ?? false;
        checks.push({
          parameter: "Entity",
          requiredValue: this.entity.name,
          currentValue: matched,
          pass: this.cardinality === "prohibited" ? !matched : matched,
        });
      }
    }
  }
}
