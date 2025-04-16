/* eslint-disable @typescript-eslint/no-unsafe-member-access */

import { getParameterValue } from "./parameter";
import { Components } from "../../../../core";
import { IDSFacet } from "../facets";
import { IDSPartOf } from "../facets/PartOf";

export const createPartOfFacet = (components: Components, elements: any) => {
  const facets: IDSFacet[] = [];
  for (const element of elements) {
    const nameParameter = element.entity.name;
    const name = getParameterValue(nameParameter);
    if (!name) continue;
    const facet = new IDSPartOf(components, {
      name,
    });
    if (element.cardinality) facet.cardinality = element.cardinality;
    facet.instructions = element.instructions;
    facets.push(facet);
  }
  return facets;
};
