import * as FRAGS from "@thatopen/fragments";
import * as WEBIFC from "web-ifc";
import * as fs from "fs";
import * as path from "path";
import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";
import type { Components } from "../../../../index";
import { loadSourceBundle } from "../../../../../tests/source-bundle";

// Needs the real `Components`: see `loadSourceBundle`.
const OBC = await loadSourceBundle();

// `tests/fixtures/property-values.ifc`: wall 10 with a list (A, B), a bounded
// (1 to 5, set point 3), an enumerated (EXISTING, DEMOLISH, of NEW, EXISTING,
// DEMOLISH) and a table (K -> 2) property in Test_Values.
const WALL = 10;
const MULTI_VALUE_CLASSES = [
  WEBIFC.IFCPROPERTYLISTVALUE,
  WEBIFC.IFCPROPERTYBOUNDEDVALUE,
  WEBIFC.IFCPROPERTYENUMERATEDVALUE,
  WEBIFC.IFCPROPERTYENUMERATION,
  WEBIFC.IFCPROPERTYTABLEVALUE,
];

const convert = async (id: string, multiValue: boolean) => {
  const importer = new FRAGS.IfcImporter();
  if (multiValue) {
    for (const c of MULTI_VALUE_CLASSES) importer.classes.abstract.add(c);
  }
  const root = path.resolve(__dirname, "../../../../..");
  importer.wasm = {
    path: `${path.resolve(root, "../../node_modules/web-ifc")}/`,
    absolute: true,
  };
  const ifc = fs.readFileSync(
    path.join(root, "tests", "fixtures", "property-values.ifc"),
  );
  const bytes = await importer.process({
    bytes: new Uint8Array(ifc),
    raw: true,
  });
  return new FRAGS.SingleThreadedFragmentsModel(id, bytes, true);
};

describe("IDSProperty on list, bounded, enumerated and table values", () => {
  let components: Components;
  const models = new Map<string, FRAGS.SingleThreadedFragmentsModel>();

  beforeAll(async () => {
    // "plain": the importer's default classes, which leave these properties
    // out, so the pset refers to items without data.
    models.set("plain", await convert("plain", false));
    models.set("multi", await convert("multi", true));
    components = new OBC.Components();
    vi.spyOn(
      components.get(OBC.FragmentsManager),
      "list",
      "get",
    ).mockReturnValue(models as never);
  }, 60_000);

  afterAll(() => {
    vi.restoreAllMocks();
    components?.dispose();
    for (const model of models.values()) model.dispose();
  });

  const passes = async (
    modelId: string,
    baseName: string,
    value?: string | number,
    dataType?: string,
  ) => {
    const facet = new OBC.IDSProperty(
      components,
      { type: "simple", parameter: "Test_Values" },
      { type: "simple", parameter: baseName },
    );
    if (value !== undefined) facet.value = { type: "simple", parameter: value };
    if (dataType) facet.dataType = dataType;
    const results = new FRAGS.DataMap<
      string,
      FRAGS.DataMap<number, { pass: boolean }>
    >();
    await facet.test({ [modelId]: new Set([WALL]) }, results as never, {
      skipIfFails: false,
    });
    return results.get(modelId)!.get(WALL)!.pass;
  };

  it("does not throw on properties the importer left out; they fail as missing", async () => {
    for (const name of ["Codes", "Range", "Status", "Lookup"]) {
      expect(await passes("plain", name)).toBe(false);
    }
  });

  it("passes when any value of the property matches", async () => {
    expect(await passes("multi", "Codes", "B")).toBe(true);
    expect(await passes("multi", "Codes", "C")).toBe(false);
    expect(await passes("multi", "Range", 3)).toBe(true);
    expect(await passes("multi", "Range", 5)).toBe(true);
    expect(await passes("multi", "Range", 4)).toBe(false);
    expect(await passes("multi", "Status", "DEMOLISH")).toBe(true);
    // In the enumeration, but not a value of the property.
    expect(await passes("multi", "Status", "NEW")).toBe(false);
    expect(await passes("multi", "Lookup", "K")).toBe(true);
    expect(await passes("multi", "Lookup", 2)).toBe(true);
  });

  it("checks the data type of the values", async () => {
    expect(await passes("multi", "Range", undefined, "IFCLENGTHMEASURE")).toBe(
      true,
    );
    expect(await passes("multi", "Codes", undefined, "IFCLABEL")).toBe(true);
    expect(await passes("multi", "Codes", undefined, "IFCTEXT")).toBe(false);
  });
});
