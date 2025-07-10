import { Components } from "../../../../core/Components";
import { IDSFacet, IDSPartOf } from "../facets";
import { getParameterValue } from "./parameter";

export const createPartOfFacets = (components: Components, elements: any) => {
  const facets: IDSFacet[] = [];
  for (const element of elements) {
    const entityName = getParameterValue(element.entity.name);
    if (!entityName) continue;

    const entityPredefinedType = getParameterValue(
      element.entity.predefinedType,
    );

    const facet = new IDSPartOf(components, {
      name: entityName,
      predefinedType: entityPredefinedType,
    });

    facet.relation = element.relation;
    if (element.cardinality) facet.cardinality = element.cardinality;
    facet.instructions = element.instructions;
    facets.push(facet);
  }
  return facets;
};
