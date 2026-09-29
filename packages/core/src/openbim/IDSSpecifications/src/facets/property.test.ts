import * as FRAGS from "@thatopen/fragments";
import * as fs from "fs";
import * as path from "path";
import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";
import type { Components, ModelIdMap } from "../../../../index";
import { loadSourceBundle } from "../../../../../tests/source-bundle";

// Needs the real `Components`: see `loadSourceBundle`.
const OBC = await loadSourceBundle();

const MODEL_ID = "type-psets";

/**
 * `tests/fixtures/type-psets.ifc`, one wall type carrying
 * `Pset_WallCommon.IsExternal = TRUE` through its HasPropertySets:
 *
 * | wall | typed | instance Pset_WallCommon | IsExternal it has    |
 * |------|-------|--------------------------|----------------------|
 * | #40  | yes   | none                     | TRUE, from its type  |
 * | #41  | yes   | none                     | TRUE, from its type  |
 * | #42  | no    | IsExternal = TRUE        | TRUE                 |
 * | #43  | no    | none                     | none                 |
 * | #45  | yes   | IsExternal = FALSE       | FALSE, overrides     |
 * | #46  | yes   | LoadBearing only         | TRUE, from its type  |
 */
const WITH_IS_EXTERNAL_TRUE = [40, 41, 42, 46];

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

describe("IDSProperty applicability through type property sets (#798)", () => {
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

  const facet = (value?: boolean) => {
    const property = new OBC.IDSProperty(
      components,
      { type: "simple", parameter: "Pset_WallCommon" },
      { type: "simple", parameter: "IsExternal" },
    );
    if (value !== undefined) {
      property.value = { type: "simple", parameter: value };
    }
    return property;
  };

  const select = async (property: InstanceType<typeof OBC.IDSProperty>) => {
    const collector: ModelIdMap = {};
    await property.getEntities([new RegExp(MODEL_ID)], collector);
    return [...(collector[MODEL_ID] ?? [])].sort((a, b) => a - b);
  };

  it("selects elements whose matching pset lives only on their type", async () => {
    expect(await select(facet(true))).toEqual(WITH_IS_EXTERNAL_TRUE);
  });

  it("lets an instance pset override the value it inherits from its type", async () => {
    // #45's own Pset_WallCommon says FALSE, which is what it has.
    expect(await select(facet(false))).toEqual([45]);
  });

  it("selects every element that has the property at all, however it got it", async () => {
    expect(await select(facet())).toEqual([...WITH_IS_EXTERNAL_TRUE, 45].sort());
  });

  it("agrees with test(): an applicable element passes the same facet as a requirement", async () => {
    const applicability = await select(facet(true));
    const requirement = facet(true);
    const results = new FRAGS.DataMap<
      string,
      FRAGS.DataMap<number, { pass: boolean }>
    >();
    await requirement.test(
      { [MODEL_ID]: new Set([40, 41, 42, 43, 45, 46]) },
      results as never,
    );
    const passing = [...results.get(MODEL_ID)!.entries()]
      .filter(([, result]) => result.pass)
      .map(([id]) => id)
      .sort((a, b) => a - b);

    expect(applicability).toEqual(passing);
  });
});
