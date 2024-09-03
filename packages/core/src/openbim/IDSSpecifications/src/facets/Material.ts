import { IDSFacet, IDSFacetParameter } from "../types";

// https://github.com/buildingSMART/IDS/blob/master/Documentation/material-facet.md
interface IIdsMaterialFacet {
  value?: IDSFacetParameter;
  uri?: string;
}

export class IdsMaterialFacet implements IIdsMaterialFacet, IDSFacet {
  value?: IDSFacetParameter;
  uri?: string;

  constructor(parameters: IIdsMaterialFacet) {
    this.value = parameters.value;
    this.uri = parameters.uri;
  }

  getEntities() {}

  test() {}
}
