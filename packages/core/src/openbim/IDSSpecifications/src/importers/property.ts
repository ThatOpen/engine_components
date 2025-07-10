import { Components } from "../../../../core/Components";
import { IDSFacet, IDSProperty } from "../facets";
import { getParameterValue } from "./parameter";

export const createPropertyFacets = (components: Components, elements: any) => {
  const facets: IDSFacet[] = [];
  for (const element of elements) {
    const psetParameter = element.propertySet;
    const baseNameParameter = element.baseName;
    const pset = getParameterValue(psetParameter);
    const baseName = getParameterValue(baseNameParameter);
    if (!(baseName && pset)) continue;
    const facet = new IDSProperty(components, pset, baseName);
    if (element.cardinality) facet.cardinality = element.cardinality;
    const value = getParameterValue(element.value);
    facet.value = value;
    facet.dataType = element.dataType;
    facet.uri = element.uri;
    facet.instructions = element.instructions;
    facets.push(facet);
  }
  return facets;
};
