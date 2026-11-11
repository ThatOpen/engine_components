import { afterAll, describe, expect, it } from "vitest";
import type { Components } from "../../../../index";
import type { IDSFacetParameter } from "../types";
import { loadSourceBundle } from "../../../../../tests/source-bundle";

// Needs the real `Components`: see `loadSourceBundle`.
const OBC = await loadSourceBundle();

const property = (value: string) => `
  <ids:property dataType="IFCLABEL">
    <ids:propertySet><ids:simpleValue>Pset_Test</ids:simpleValue></ids:propertySet>
    <ids:baseName><ids:simpleValue>Code</ids:simpleValue></ids:baseName>
    <ids:value>${value}</ids:value>
  </ids:property>`;

const ids = (requirements: string) => `<?xml version="1.0" encoding="UTF-8"?>
<ids:ids xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns:ids="http://standards.buildingsmart.org/IDS">
  <ids:info><ids:title>Values</ids:title></ids:info>
  <ids:specifications>
    <ids:specification name="Values" ifcVersion="IFC4">
      <ids:applicability minOccurs="0" maxOccurs="unbounded">
        <ids:entity><ids:name><ids:simpleValue>IFCWALL</ids:simpleValue></ids:name></ids:entity>
      </ids:applicability>
      <ids:requirements>${requirements}</ids:requirements>
    </ids:specification>
  </ids:specifications>
</ids:ids>`;

const loadValues = (components: Components, ...values: string[]) => {
  const specs = components.get(OBC.IDSSpecifications);
  specs.list.clear();
  const [spec] = specs.load(ids(values.map(property).join("")));
  return [...spec.requirements].map(
    (facet) => (facet as InstanceType<typeof OBC.IDSProperty>).value!,
  );
};

// evalRequirement is shared by every facet; a property facet exposes it.
const matches = (
  components: Components,
  value: string | number | boolean | null,
  parameter: IDSFacetParameter,
) => {
  const facet = new OBC.IDSProperty(
    components,
    { type: "simple", parameter: "Pset_Test" },
    { type: "simple", parameter: "Code" },
  ) as any;
  return facet.evalRequirement(value, parameter, "Value") as boolean;
};

describe("IDS values are text", () => {
  const components: Components = new OBC.Components();
  afterAll(() => components.dispose());

  it("keeps simple and enumeration values as written", () => {
    const [simple, enumeration] = loadValues(
      components,
      "<ids:simpleValue>01</ids:simpleValue>",
      `<xs:restriction base="xs:string">
         <xs:enumeration value="007"/><xs:enumeration value="1e3"/>
       </xs:restriction>`,
    );
    expect(simple.parameter).toBe("01");
    expect(enumeration.parameter).toEqual(["007", "1e3"]);
  });

  it("matches a text value with leading zeros only as written", () => {
    const [simple] = loadValues(
      components,
      "<ids:simpleValue>01</ids:simpleValue>",
    );
    expect(matches(components, "01", simple)).toBe(true);
    expect(matches(components, "1", simple)).toBe(false);
  });

  it("reads bounds and length limits as numbers", () => {
    const [bounds, length] = loadValues(
      components,
      `<xs:restriction base="xs:double">
         <xs:minInclusive value="1.5"/><xs:maxExclusive value="10"/>
       </xs:restriction>`,
      `<xs:restriction base="xs:string"><xs:length value="3"/></xs:restriction>`,
    );
    expect(bounds.parameter).toEqual({
      min: 1.5,
      minInclusive: true,
      max: 10,
      maxInclusive: false,
    });
    expect(matches(components, 1.5, bounds)).toBe(true);
    expect(matches(components, 10, bounds)).toBe(false);
    // `length` is compared with ===, so a text "3" would never match.
    expect(length.parameter).toEqual({ length: 3 });
    expect(matches(components, "abc", length)).toBe(true);
    expect(matches(components, "abcd", length)).toBe(false);
  });

  it("compares a real with the IDS tolerance", () => {
    const value = { type: "simple", parameter: "0.3" } as IDSFacetParameter;
    expect(matches(components, 0.1 + 0.2, value)).toBe(true);
    const thousand = { type: "simple", parameter: "1000" } as const;
    // Tolerance at 1000 is 1000 × 1e-6 + 1e-6 = 0.001001.
    expect(matches(components, 1000.001, thousand)).toBe(true);
    expect(matches(components, 1000.0011, thousand)).toBe(false);
    // On the bounds counts as equal, as in buildingSMART's tolerance cases.
    const one = { type: "simple", parameter: "1." } as const;
    expect(matches(components, 1.000002, one)).toBe(true);
    expect(matches(components, 0.999998, one)).toBe(true);
    expect(matches(components, 1.0000021, one)).toBe(false);
    expect(matches(components, 0, { type: "simple", parameter: "" })).toBe(
      false,
    );
  });

  it("compares a boolean as an xs:boolean", () => {
    const text = (parameter: string) =>
      ({ type: "simple", parameter }) as const;
    expect(matches(components, true, text("true"))).toBe(true);
    expect(matches(components, true, text("1"))).toBe(true);
    expect(matches(components, false, text("0"))).toBe(true);
    expect(matches(components, false, text("true"))).toBe(false);
    // Upper case is not an xs:boolean (an invalid IDS in the test cases).
    expect(matches(components, true, text("TRUE"))).toBe(false);
  });

  it("matches enumerations with the same rules", () => {
    const options = {
      type: "enumeration",
      parameter: ["01", "2.5"],
    } as IDSFacetParameter;
    expect(matches(components, "01", options)).toBe(true);
    expect(matches(components, "1", options)).toBe(false);
    expect(matches(components, 2.5000001, options)).toBe(true);
  });
});
