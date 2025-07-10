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

    const value = getParameterValue(element.value);
    if (value?.type === "simple") {
      value.parameter = String(value.parameter);
    }

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
