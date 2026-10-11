import * as FRAGS from "@thatopen/fragments";
import * as fs from "fs";
import * as path from "path";
import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";
import type { Components, ModelIdMap } from "../../../../index";
import { loadSourceBundle } from "../../../../../tests/source-bundle";

// Needs the real `Components`: see `loadSourceBundle`.
const OBC = await loadSourceBundle();

const MODEL_ID = "type-psets";

// `tests/fixtures/type-psets.ifc`: an IfcSite (no PredefinedType attribute in
// IFC4) and walls whose PredefinedType is STANDARD (see property.test.ts).
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

describe("IDSEntity predefinedType", () => {
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

  const entity = (name: string, predefinedType: string) => {
    const facet = new OBC.IDSEntity(components, {
      type: "simple",
      parameter: name,
    });
    facet.predefinedType = { type: "simple", parameter: predefinedType };
    return facet;
  };

  const select = async (facet: InstanceType<typeof OBC.IDSEntity>) => {
    const collector: ModelIdMap = {};
    await facet.getEntities([new RegExp(MODEL_ID)], collector);
    return [...(collector[MODEL_ID] ?? [])].sort((a, b) => a - b);
  };

  const passes = async (
    facet: InstanceType<typeof OBC.IDSEntity>,
    ids: number[],
  ) => {
    const results = new FRAGS.DataMap<
      string,
      FRAGS.DataMap<number, { pass: boolean }>
    >();
    await facet.test({ [MODEL_ID]: new Set(ids) }, results as never, {
      skipIfFails: false,
    });
    return Object.fromEntries(
      [...results.get(MODEL_ID)!.entries()].map(([id, r]) => [id, r.pass]),
    );
  };

  it("does not select an entity that has no PredefinedType attribute", async () => {
    expect(await select(entity("IFCSITE", "USERDEFINED"))).toEqual([]);
  });

  it("fails, rather than throws, as a requirement on such an entity", async () => {
    const sites =
      (await model.getItemsOfCategories([/^IFCSITE$/])).IFCSITE ?? [];
    expect(sites.length).toBe(1);
    expect(await passes(entity("IFCSITE", "USERDEFINED"), sites)).toEqual({
      [sites[0]]: false,
    });
  });

  it("still matches entities that have the predefined type", async () => {
    expect(await select(entity("IFCWALL", "STANDARD"))).toEqual(WALLS);
  });
});
