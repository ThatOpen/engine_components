import * as FRAGS from "@thatopen/fragments";
import * as fs from "fs";
import * as path from "path";
import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";
import type { Components } from "../../../index";
import { loadSourceBundle } from "../../../../tests/source-bundle";

// Needs the real `Components`: see `loadSourceBundle`.
const OBC = await loadSourceBundle();

const MODEL_ID = "type-psets";

// `tests/fixtures/type-psets.ifc` (see facets/property.test.ts): six walls,
// four of which have Pset_WallCommon.IsExternal = TRUE, directly or through
// their type.
const WALLS = [40, 41, 42, 43, 45, 46];
const WITH_IS_EXTERNAL_TRUE = [40, 41, 42, 46];

const convert = async () => {
  const importer = new FRAGS.IfcImporter();
  const root = path.resolve(__dirname, "../../../..");
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

describe("IDSSpecification applicability", () => {
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

  const wall = () =>
    new OBC.IDSEntity(components, { type: "simple", parameter: "IFCWALL" });

  const isExternal = () => {
    const property = new OBC.IDSProperty(
      components,
      { type: "simple", parameter: "Pset_WallCommon" },
      { type: "simple", parameter: "IsExternal" },
    );
    property.value = { type: "simple", parameter: true };
    return property;
  };

  const tested = async (
    ...applicability: InstanceType<typeof OBC.IDSFacet>[]
  ) => {
    const spec = components
      .get(OBC.IDSSpecifications)
      .create("applicability", ["IFC4"]);
    for (const facet of applicability) spec.applicability.add(facet);
    spec.requirements.add(wall());
    const result = await spec.test([new RegExp(MODEL_ID)]);
    return [...(result.get(MODEL_ID)?.keys() ?? [])].sort((a, b) => a - b);
  };

  it("tests every element a single facet selects", async () => {
    expect(await tested(wall())).toEqual(WALLS);
  });

  it("tests only the elements that match every applicability facet", async () => {
    // IDS: applicability facets are combined with AND, so "a wall that is
    // external" must not test the two walls that are not.
    expect(await tested(wall(), isExternal())).toEqual(WITH_IS_EXTERNAL_TRUE);
  });
});
