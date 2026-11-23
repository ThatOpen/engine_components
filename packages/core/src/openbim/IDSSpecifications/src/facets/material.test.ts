import * as FRAGS from "@thatopen/fragments";
import * as fs from "fs";
import * as path from "path";
import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";
import type { Components, ModelIdMap } from "../../../../index";
import { loadSourceBundle } from "../../../../../tests/source-bundle";

// Needs the real `Components`: see `loadSourceBundle`.
const OBC = await loadSourceBundle();

const MODEL_ID = "materials";

/**
 * `tests/fixtures/materials.ifc`, wall type #52 associated with Concrete:
 *
 * | wall | typed | own material                   | material it has          |
 * |------|-------|--------------------------------|--------------------------|
 * | #40  | no    | Concrete                       | Concrete                 |
 * | #41  | no    | Brick                          | Brick                    |
 * | #42  | yes   | none                           | Concrete, from its type  |
 * | #43  | yes   | Steel                          | Steel, overrides         |
 * | #44  | no    | none                           | none                     |
 * | #46  | no    | empty constituent set          | none                     |
 * | #47  | no    | layer set "Concrete" (Insul.)  | a set named Concrete     |
 * | #48  | no    | layer set "Masonry" (Insul.)   | no Concrete anywhere     |
 */
const WALLS = [40, 41, 42, 43, 44, 46, 47, 48];
const CONCRETE_WALLS = [40, 42, 47];
const TYPE = 52;

const convert = async () => {
  const importer = new FRAGS.IfcImporter();
  const root = path.resolve(__dirname, "../../../../..");
  importer.wasm = {
    path: `${path.resolve(root, "../../node_modules/web-ifc")}/`,
    absolute: true,
  };
  const ifc = fs.readFileSync(
    path.join(root, "tests", "fixtures", "materials.ifc"),
  );
  const bytes = await importer.process({
    bytes: new Uint8Array(ifc),
    raw: true,
  });
  return new FRAGS.SingleThreadedFragmentsModel(MODEL_ID, bytes, true);
};

describe("IDSMaterial", () => {
  let components: Components;
  let model: FRAGS.SingleThreadedFragmentsModel;

  beforeAll(async () => {
    model = await convert();
    components = new OBC.Components();
    const fragments = components.get(OBC.FragmentsManager);
    // Stands in for `init()` + a loaded model: the facet only reads `list`.
    vi.spyOn(fragments, "list", "get").mockReturnValue(
      new Map([[MODEL_ID, model]]) as never,
    );
  }, 60_000);

  afterAll(() => {
    vi.restoreAllMocks();
    components?.dispose();
    model?.dispose();
  });

  const concrete = () => {
    const facet = new OBC.IDSMaterial(components);
    facet.value = { type: "simple", parameter: "Concrete" };
    return facet;
  };

  it("tests every element, not only the first one", async () => {
    const results = new FRAGS.DataMap<
      string,
      FRAGS.DataMap<number, { pass: boolean }>
    >();
    await concrete().test({ [MODEL_ID]: new Set(WALLS) }, results as never);
    const tested = [...results.get(MODEL_ID)!.keys()].sort((a, b) => a - b);
    const passing = [...results.get(MODEL_ID)!.entries()]
      .filter(([, result]) => result.pass)
      .map(([id]) => id)
      .sort((a, b) => a - b);

    expect(tested).toEqual(WALLS);
    // #42 has only its type's Concrete; #43's own Steel overrides it; #46's
    // constituent set has no material at all; #47 matches by its layer set's
    // name, while nothing in #48's layer set matches.
    expect(passing).toEqual(CONCRETE_WALLS);
  });

  it("selects elements that use their type's material", async () => {
    const collector: ModelIdMap = {};
    await concrete().getEntities([new RegExp(MODEL_ID)], collector);
    const selected = [...(collector[MODEL_ID] ?? [])].sort((a, b) => a - b);

    expect(selected).toEqual([...CONCRETE_WALLS, TYPE]);
  });
});
