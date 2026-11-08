import { describe, expect, it } from "vitest";
import { IDSFacet } from "./Facet";
import type { IDSFacetParameter } from "../types";

// evalRequirement is shared by every facet; a minimal facet exposes it.
class TestFacet extends IDSFacet {
  facetType = "Attribute" as const;
  async getEntities() {}
  async test() {}
  serialize() {
    return "";
  }
  matches(
    value: string | number | boolean | null,
    parameter: IDSFacetParameter,
  ) {
    return this.evalRequirement(value, parameter, "Value");
  }
}

const facet = new TestFacet(undefined as never);
const pattern = (parameter: string): IDSFacetParameter => ({
  type: "pattern",
  parameter,
});
const length = (parameter: {
  min?: number;
  length?: number;
  max?: number;
}): IDSFacetParameter => ({ type: "length", parameter }) as IDSFacetParameter;

describe("IDSFacet.evalRequirement", () => {
  it("matches a pattern against the whole value, as XSD does", () => {
    expect(facet.matches("EW-01", pattern("EW-[0-9]{2}"))).toBe(true);
    expect(facet.matches("XEW-01", pattern("EW-[0-9]{2}"))).toBe(false);
    expect(facet.matches("EW-012", pattern("EW-[0-9]{2}"))).toBe(false);
    expect(facet.matches("B", pattern("A|B"))).toBe(true);
    expect(facet.matches("AB", pattern("A|B"))).toBe(false);
  });

  it("applies every length limit, not just the last one", () => {
    expect(facet.matches("abc", length({ min: 2, max: 4 }))).toBe(true);
    expect(facet.matches("a", length({ min: 2, max: 4 }))).toBe(false);
    expect(facet.matches("abcde", length({ min: 2, max: 4 }))).toBe(false);
    expect(facet.matches("abcd", length({ length: 3, max: 10 }))).toBe(false);
    expect(facet.matches("abc", length({ length: 3 }))).toBe(true);
  });
});
