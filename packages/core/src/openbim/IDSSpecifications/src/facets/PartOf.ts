import { Components } from "../../../../core/Components";
import { IDSFacet } from "./Facet";
import {
  IDSFacetParameter,
  IDSPartOfRelations,
  IDSSimpleCardinality,
} from "../types";
import { IDSEntity } from "./Entity";
import { ModelIdMap } from "../../../../fragments";

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
    this._entityFacet = new IDSEntity(this._components, name);
    this._entityFacet.predefinedType = predefinedType;
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

  serialize() {
    return "";
  }

  async getEntities(_modelIds: RegExp[], _collector: ModelIdMap) {
    // const fragments = this._components.get(FragmentsManager);
    // const items: ModelIdMap = {};
    // await this._entityFacet.getEntities(modelIds, items);
    // for (const [modelId, localIds] of Object.entries(items)) {
    //   const isValidModel = modelIds.find((regex) => regex.test(modelId));
    //   if (!isValidModel) continue;
    // }
  }

  async test(_items: ModelIdMap) {}
}
