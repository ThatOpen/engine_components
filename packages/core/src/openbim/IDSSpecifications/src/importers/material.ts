import { Components } from "../../../../core/Components";
import { IDSFacet, IDSMaterial } from "../facets";
import { getParameterValue } from "./parameter";

export const createMaterialFacets = (components: Components, elements: any) => {
  const facets: IDSFacet[] = [];

  for (const element of elements) {
    const facet = new IDSMaterial(components);
    if (element.cardinality) facet.cardinality = element.cardinality;

    const value = getParameterValue(element.value);
    if (value?.type === "enumeration" && Array.isArray(value.parameter)) {
      value.parameter = value.parameter.map(String);
    }

    facet.value = value;
    facet.uri = element.uri;
    facet.instructions = element.instructions;
    facets.push(facet);
  }

  return facets;
};
