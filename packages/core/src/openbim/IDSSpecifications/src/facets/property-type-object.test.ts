import * as FRAGS from "@thatopen/fragments";
import * as fs from "fs";
import * as path from "path";
import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";
import type { Components } from "../../../../index";
import { loadSourceBundle } from "../../../../../tests/source-bundle";

// Needs the real `Components`: see `loadSourceBundle`.
const OBC = await loadSourceBundle();

const MODEL_ID = "type-psets";

// `tests/fixtures/type-psets.ifc` (see property.test.ts): IfcWallType #52
// carries Pset_WallCommon.IsExternal = TRUE in its HasPropertySets.
const WALL_TYPE = 52;

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

describe("IDSProperty on a type object", () => {
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

  it("checks the type object's own property sets", async () => {
    const spec = components
      .get(OBC.IDSSpecifications)
      .create("wall types are external", ["IFC4"]);
    spec.applicability.add(
      new OBC.IDSEntity(components, {
        type: "simple",
        parameter: "IFCWALLTYPE",
      }),
    );
    const property = new OBC.IDSProperty(
      components,
      { type: "simple", parameter: "Pset_WallCommon" },
      { type: "simple", parameter: "IsExternal" },
    );
    property.value = { type: "simple", parameter: true };
    spec.requirements.add(property);

    const result = await spec.test([new RegExp(MODEL_ID)]);
    const typeResult = result.get(MODEL_ID)?.get(WALL_TYPE);
    expect(typeResult?.pass).toBe(true);
  });
});
