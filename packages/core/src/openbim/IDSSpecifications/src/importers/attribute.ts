import { Components } from "../../../../core/Components";
import { IDSAttribute, IDSFacet } from "../facets";
import { getParameterValue } from "./parameter";

export const createAttributeFacets = (
  components: Components,
  elements: any,
) => {
  const facets: IDSFacet[] = [];
  for (const element of elements) {
    const nameParameter = element.name;
    const name = getParameterValue(nameParameter);
    if (!name) continue;
    const facet = new IDSAttribute(components, name);
    if (element.cardinality) facet.cardinality = element.cardinality;
    facet.value = getParameterValue(element.value);
    facet.instructions = element.instructions;
    facets.push(facet);
  }
  return facets;
};
