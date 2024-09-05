import { Components } from "../../../../core/Components";
import { IDSClassification, IDSFacet } from "../facets";
import { getParameterValue } from "./parameter";

export const createClassificationFacets = (
  components: Components,
  elements: any,
) => {
  const facets: IDSFacet[] = [];
  for (const element of elements) {
    const systemParameter = element.system;
    const system = getParameterValue(systemParameter);
    if (!system) continue;
    const facet = new IDSClassification(components, system);
    if (element.cardinality) facet.cardinality = element.cardinality;
    facet.value = getParameterValue(element.value);
    facets.push(facet);
  }
  return facets;
};
