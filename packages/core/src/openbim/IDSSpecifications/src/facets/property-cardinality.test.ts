import * as FRAGS from "@thatopen/fragments";
import * as fs from "fs";
import * as path from "path";
import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";
import type { Components } from "../../../../index";
import { loadSourceBundle } from "../../../../../tests/source-bundle";

// Needs the real `Components`: see `loadSourceBundle`.
const OBC = await loadSourceBundle();

const MODEL_ID = "type-psets";

// `tests/fixtures/type-psets.ifc` (see property.test.ts): IsExternal is TRUE
// on walls 40, 41, 42 and 46, FALSE on 45, and absent on 43.
const WALLS = [40, 41, 42, 43, 45, 46];

const convert = async () => {
  const importer = new FRAGS.IfcImporter();
  const root = path.resolve(__dirname, "../../../../..");
  importer.wasm = {
    path: `${path.resolve(root, "../../node_modules/web-ifc")}/`,
    absolute: true,
  };
  const ifc = fs.readFileSync(
    path.join(root, "tests", "fixtures", "type-psets.ifc"),
  );
  const bytes = await importer.process({
    bytes: new Uint8Array(ifc),
    raw: true,
  });
  return new FRAGS.SingleThreadedFragmentsModel(MODEL_ID, bytes, true);
};

describe("IDSProperty cardinality as a requirement", () => {
  let components: Components;
  let model: FRAGS.SingleThreadedFragmentsModel;

  beforeAll(async () => {
    model = await convert();
    components = new OBC.Components();
    const fragments = components.get(OBC.FragmentsManager);
    vi.spyOn(fragments, "list", "get").mockReturnValue(
      new Map([[MODEL_ID, model]]) as never,
    );
  }, 60_000);

  afterAll(() => {
    vi.restoreAllMocks();
    components?.dispose();
    model?.dispose();
  });

  const passing = async (
    cardinality: "required" | "optional" | "prohibited",
    value?: boolean,
  ) => {
    const facet = new OBC.IDSProperty(
      components,
      { type: "simple", parameter: "Pset_WallCommon" },
      { type: "simple", parameter: "IsExternal" },
    );
    if (value !== undefined) facet.value = { type: "simple", parameter: value };
    facet.cardinality = cardinality;
    const results = new FRAGS.DataMap<
      string,
      FRAGS.DataMap<number, { pass: boolean }>
    >();
    await facet.test({ [MODEL_ID]: new Set(WALLS) }, results as never, {
      skipIfFails: false,
    });
    return [...results.get(MODEL_ID)!.entries()]
      .filter(([, result]) => result.pass)
      .map(([id]) => id)
      .sort((a, b) => a - b);
  };

  it("required: passes only where the property has the value", async () => {
    expect(await passing("required", true)).toEqual([40, 41, 42, 46]);
  });

  it("prohibited without a value: passes only where the property is absent", async () => {
    expect(await passing("prohibited")).toEqual([43]);
  });

  it("prohibited with a value: passes where the property is absent or different", async () => {
    expect(await passing("prohibited", true)).toEqual([43, 45]);
  });

  it("optional: passes where the property is absent or has the value", async () => {
    expect(await passing("optional", true)).toEqual([40, 41, 42, 43, 46]);
  });
});
