import { Components } from "../../../../core/Components";
import { IDSEntity, IDSFacet } from "../facets";
import { getParameterValue } from "./parameter";

export const createEntityFacets = (components: Components, elements: any) => {
  const facets: IDSFacet[] = [];
  for (const element of elements) {
    const nameParameter = element.name;
    const name = getParameterValue(nameParameter);
    if (!name) continue;
    const facet = new IDSEntity(components, name);
    if (element.cardinality) facet.cardinality = element.cardinality;
    facet.predefinedType = getParameterValue(element.predefinedType);
    facets.push(facet);
  }
  return facets;
};
