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
// some of which inherit Pset_WallCommon from their type.
const WALLS = [40, 41, 42, 43, 45, 46];

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

describe("IDSSpecification item data", () => {
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

  const requirements = () => {
    const property = (baseName: string, value?: boolean) => {
      const facet = new OBC.IDSProperty(
        components,
        { type: "simple", parameter: "Pset_WallCommon" },
        { type: "simple", parameter: baseName },
      );
      if (value !== undefined) {
        facet.value = { type: "simple", parameter: value };
      }
      return facet;
    };
    const name = new OBC.IDSAttribute(components, {
      type: "simple",
      parameter: "Name",
    });
    const tag = new OBC.IDSAttribute(components, {
      type: "simple",
      parameter: "Tag",
    });
    tag.cardinality = "optional";
    return [
      property("IsExternal", true),
      property("IsExternal"),
      property("LoadBearing"),
      name,
      tag,
    ];
  };

  const specification = () => {
    const spec = components
      .get(OBC.IDSSpecifications)
      .create("Walls", ["IFC4"]);
    spec.applicability.add(
      new OBC.IDSEntity(components, { type: "simple", parameter: "IFCWALL" }),
    );
    spec.requirements.add(...requirements());
    return spec;
  };

  const run = () =>
    specification().test([new RegExp(MODEL_ID)], { skipIfFails: false });

  // Requirements run concurrently, so the order of an item's checks varies.
  const summary = (result: Awaited<ReturnType<typeof run>>) =>
    [...result.get(MODEL_ID)!.entries()]
      .sort(([a], [b]) => a - b)
      .map(([id, item]) => [
        id,
        item.checks.map((check) => `${check.facetType}:${check.pass}`).sort(),
      ]);

  it("fetches the applicable items once per kind of data, not once per requirement", async () => {
    const getItemsData = vi.spyOn(model, "getItemsData");
    await run();
    const fetchesOfApplicableItems = getItemsData.mock.calls.filter(
      ([ids]) => ids.length === WALLS.length,
    );
    getItemsData.mockRestore();

    // One with the property set relations, one with the attributes only.
    expect(fetchesOfApplicableItems).toHaveLength(2);
  });

  it("does not fetch the other instances of an element's type", async () => {
    const getItemsData = vi.spyOn(model, "getItemsData");
    await run();
    const fetched = await Promise.all(
      getItemsData.mock.results.map((result) => result.value),
    );
    getItemsData.mockRestore();

    // Walls 40, 41, 45 and 46 share type #52; the property facet only needs
    // the type's own property sets, not the walls the type is used by.
    const reachedThroughType = (data: unknown): boolean =>
      Array.isArray(data)
        ? data.some(reachedThroughType)
        : typeof data === "object" &&
          data !== null &&
          Object.entries(data).some(
            ([key, value]) =>
              key === "ObjectTypeOf" || reachedThroughType(value),
          );
    expect(reachedThroughType(fetched)).toBe(false);
  });

  it("gives the same results as testing each requirement on its own", async () => {
    const shared = summary(await run());

    const separate: Awaited<ReturnType<typeof run>> = new FRAGS.DataMap();
    for (const requirement of requirements()) {
      await requirement.test({ [MODEL_ID]: new Set(WALLS) }, separate, {
        skipIfFails: false,
      });
    }

    expect(shared).toEqual(summary(separate));
    // And again: the shared data is not modified by a run.
    expect(summary(await run())).toEqual(shared);
  });
});
