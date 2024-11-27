import { IDSFacetParameter } from "../types";

export const getParameterValue = (property: any) => {
  if (!property) return undefined;
  const result: Partial<IDSFacetParameter> = {};
  if ("simpleValue" in property) {
    result.type = "simple";
    result.parameter = property.simpleValue;
  }
  if ("restriction" in property) {
    const restriction = property.restriction;
    if ("pattern" in restriction) {
      result.type = "pattern";
      result.parameter = restriction.pattern.value;
    }
    if ("enumeration" in restriction) {
      result.type = "enumeration";
      const enumeration = restriction.enumeration.map(
        ({ value }: { value: string }) => value,
      );
      result.parameter = enumeration;
    }
    if ("bounds" in restriction) {
      // result.type = "bounds";
      // const bounds = restriction.bounds.map(
      //   ({ value }: { value: string }) => value,
      // );
      // result.parameter = bounds;
    }
    if ("length" in restriction) {
      // result.type = "length";
      // const length = restriction.length.map(
      //   ({ value }: { value: string }) => value,
      // );
      // result.parameter = length;
    }
  }
  if (result.parameter === undefined) return undefined;
  return result as IDSFacetParameter;
};
