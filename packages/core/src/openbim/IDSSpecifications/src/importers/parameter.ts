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
    const keys = Object.keys(restriction);

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
    if (
      keys.some((key) =>
        [
          "minInclusive",
          "minExclusive",
          "maxInclusive",
          "maxExclusive",
        ].includes(key),
      )
    ) {
      result.type = "bounds";

      const parameter: {
        min?: number;
        minInclusive?: boolean;
        max?: number;
        maxInclusive?: boolean;
      } = {};

      const minKey = keys.find((key) => key.includes("min"));
      const maxKey = keys.find((key) => key.includes("max"));

      if (minKey) {
        parameter.minInclusive = minKey === "minInclusive";
        parameter.min = restriction[minKey].value;
      }

      if (maxKey) {
        parameter.maxInclusive = maxKey === "maxInclusive";
        parameter.max = restriction[maxKey].value;
      }

      result.parameter = parameter;
    }
    if (
      keys.some((key) => ["minLength", "length", "maxLength"].includes(key))
    ) {
      result.type = "length";
      const parameter: {
        min?: number;
        length?: number;
        max?: number;
      } = {};

      if (restriction.length !== undefined) {
        parameter.length = restriction.length.value;
      }

      if (restriction.minLength !== undefined) {
        parameter.min = restriction.minLength.value;
      }

      if (restriction.maxLength !== undefined) {
        parameter.max = restriction.maxLength.value;
      }

      result.parameter = parameter;
    }
  }

  if (result.parameter === undefined) return undefined;
  return result as IDSFacetParameter;
};
