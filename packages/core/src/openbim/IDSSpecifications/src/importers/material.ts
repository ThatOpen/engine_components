/* eslint-disable @typescript-eslint/no-unsafe-member-access */

import { getParameterValue } from "./parameter";
import { IDSMaterial } from "../facets/Material";
import { Components } from "../../../../core";
import { IDSFacet } from "../facets";

export const createMaterialFacets = (components: Components, elements: any) => {
  const facets: IDSFacet[] = [];
  for (const element of elements) {
    const materialName = element.value;
    const name = getParameterValue(materialName);
    if (!name) continue;
    const facet = new IDSMaterial(components, name);
    if (element.cardinality) facet.cardinality = element.cardinality;
    facet.value = getParameterValue(element.value);
    facet.instructions = element.instructions;
    facets.push(facet);
  }
  return facets;
};
