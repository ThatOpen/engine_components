import * as FRAGS from "@thatopen/fragments";
import { Components } from "../../../../core/Components";
import {
  IfcRelation,
  IfcRelationsIndexer,
  relToAttributesMap,
} from "../../../../ifc";
import { IDSFacet } from "./Facet";
import { IDSFacetParameter, IDSSimpleCardinality } from "../types";
import { IDSEntity } from "./Entity";

// https://github.com/buildingSMART/IDS/blob/development/Documentation/UserManual/partof-facet.md

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
    const { name, predefinedType } = value;
    this._entityFacet = new IDSEntity(this.components, name);
    this._entityFacet.predefinedType = predefinedType;
  }

  get entity() {
    return this._entity;
  }

  // Performance is better when provided
  relation?: number;

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

  serialize() {
    return "";
  }

  async getEntities(
    model: FRAGS.FragmentsGroup,
    collector: FRAGS.IfcProperties = {},
  ) {
    const result: number[] = [];
    const entities: FRAGS.IfcProperties = {};
    await this._entityFacet.getEntities(model, entities);

    const indexer = this.components.get(IfcRelationsIndexer);

    const modelRelations = indexer.relationMaps[model.uuid];
    if (!modelRelations) return result;

    if (this.relation) {
      const invAttrs = relToAttributesMap.get(this.relation as IfcRelation);
      if (!invAttrs) return result;
      for (const _expressID in entities) {
        const expressID = Number(_expressID);
        const { forRelated } = invAttrs;
        const relations = indexer.getEntitiesWithRelation(
          model,
          forRelated,
          expressID,
        );
        for (const relID of relations) {
          if (relID in collector) continue;
          const relAttrs = await model.getProperties(relID);
          if (!relAttrs) continue;
          collector[relID] = relAttrs;
          result.push(relID);
        }
      }
    } else {
      for (const _expressID in entities) {
        const expressID = Number(_expressID);
        for (const [entityID, rels] of modelRelations) {
          if (entityID in collector) continue;
          const relAttrs = await model.getProperties(entityID);
          if (!relAttrs) continue;
          // Check if any of the relations with the entity includes this.entity
          for (const [_, relIDs] of rels) {
            if (!relIDs.includes(expressID)) continue;
            collector[entityID] = relAttrs;
            result.push(entityID);
          }
        }
      }
    }

    return result;
  }

  async test(entities: FRAGS.IfcProperties, model: FRAGS.FragmentsGroup) {
    this.testResult = [];
    const indexer = this.components.get(IfcRelationsIndexer);
    for (const _expressID in entities) {
      const expressID = Number(_expressID);
      const attrs = entities[expressID];
      if (!attrs.GlobalId?.value) continue;

      let matches = false;

      const modelRelations = indexer.relationMaps[model.uuid];
      if (!modelRelations) {
        this.saveResult(attrs, matches);
        continue;
      }

      const entityRelations = modelRelations.get(expressID);
      if (!entityRelations) {
        this.saveResult(attrs, matches);
        continue;
      }

      for (const [invAttrIndex, relIDs] of entityRelations) {
        if (this.relation) {
          const invAttrs = relToAttributesMap.get(this.relation as IfcRelation);
          if (!invAttrs) continue;
          const forRelatedIndex = indexer.getAttributeIndex(
            invAttrs.forRelated,
          );
          if (forRelatedIndex !== invAttrIndex) continue;
        }

        for (const relID of relIDs) {
          const relAttrs = await model.getProperties(relID);
          if (!relAttrs) continue;
          const entityMatches = relAttrs.type === this.entity;
          if (!entityMatches) continue;
          matches = true;
          break;
        }

        if (matches) break;
      }

      this.saveResult(attrs, matches);
    }

    return this.testResult;
  }
}
