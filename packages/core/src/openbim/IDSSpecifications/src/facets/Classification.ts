import { IDSFacet, IDSFacetParameter } from "../types";

// https://github.com/buildingSMART/IDS/blob/master/Documentation/classification-facet.md
interface IIdsClassificationFacet {
  system?: IDSFacetParameter;
  value?: IDSFacetParameter;
  uri?: string;
}

export class IdsClassificationFacet
  implements IIdsClassificationFacet, IDSFacet
{
  system?: IDSFacetParameter;
  value?: IDSFacetParameter;
  uri?: string;

  constructor(parameters: IIdsClassificationFacet) {
    this.system = parameters.system;
    this.value = parameters.value;
    this.uri = parameters.uri;
  }

  getEntities() {}

  test() {}
}
