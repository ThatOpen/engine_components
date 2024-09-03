import { IDSFacet, IDSFacetParameter } from "../types";

// https://github.com/buildingSMART/IDS/blob/master/Documentation/partof-facet.md
interface IIdsPartOfFacet {
  relation: IDSFacetParameter;
  entity?: IDSFacetParameter;
}

export class IdsPartOfFacet implements IIdsPartOfFacet, IDSFacet {
  relation: IDSFacetParameter;
  entity?: IDSFacetParameter;

  constructor(parameters: IIdsPartOfFacet) {
    this.relation = parameters.relation;
    this.entity = parameters.entity;
  }

  getEntities() {}

  test() {}
}
