import * as FRAGS from "@thatopen/fragments";
import * as fs from "fs";
import * as path from "path";
import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";
import type { Components } from "../../../index";
import { loadSourceBundle } from "../../../../tests/source-bundle";

// Needs the real `Components`: see `loadSourceBundle`.
const OBC = await loadSourceBundle();

const MODEL_ID = "cardinality";

// `tests/fixtures/type-psets.ifc` holds six walls and no slabs.
const ids = (
  cardinality: string,
  entity: string,
  requirements = "",
) => `<?xml version="1.0" encoding="UTF-8"?>
<ids:ids xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns:ids="http://standards.buildingsmart.org/IDS">
  <ids:info><ids:title>Cardinality</ids:title></ids:info>
  <ids:specifications>
    <ids:specification name="spec" ifcVersion="IFC4">
      <ids:applicability ${cardinality}>
        <ids:entity><ids:name><ids:simpleValue>${entity}</ids:simpleValue></ids:name></ids:entity>
      </ids:applicability>
      ${requirements}
    </ids:specification>
  </ids:specifications>
</ids:ids>`;

const waldo = `<ids:requirements><ids:attribute>
  <ids:name><ids:simpleValue>Name</ids:simpleValue></ids:name>
  <ids:value><ids:simpleValue>Waldo</ids:simpleValue></ids:value>
</ids:attribute></ids:requirements>`;

describe("IDSSpecification cardinality (minOccurs / maxOccurs)", () => {
  let components: Components;
  let model: FRAGS.SingleThreadedFragmentsModel;

  beforeAll(async () => {
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
    model = new FRAGS.SingleThreadedFragmentsModel(MODEL_ID, bytes, true);
    components = new OBC.Components();
    vi.spyOn(
      components.get(OBC.FragmentsManager),
      "list",
      "get",
    ).mockReturnValue(new Map([[MODEL_ID, model]]) as never);
  }, 60_000);

  afterAll(() => {
    vi.restoreAllMocks();
    components?.dispose();
    model?.dispose();
  });

  const verify = async (xml: string) => {
    const [spec] = components.get(OBC.IDSSpecifications).load(xml);
    return spec.verify([new RegExp(MODEL_ID)], { skipIfFails: false });
  };

  const required = 'minOccurs="1" maxOccurs="unbounded"';
  const optional = 'minOccurs="0" maxOccurs="unbounded"';
  const prohibited = 'minOccurs="0" maxOccurs="0"';

  it("required: fails when nothing is applicable", async () => {
    expect((await verify(ids(required, "IFCSLAB", waldo))).pass).toBe(false);
  });

  it("required: applicable elements are still judged by the requirements", async () => {
    expect((await verify(ids(required, "IFCWALL", waldo))).pass).toBe(false);
  });

  it("optional: may pass when nothing is applicable", async () => {
    expect((await verify(ids(optional, "IFCSLAB", waldo))).pass).toBe(true);
  });

  it("prohibited: fails when the applicability matches", async () => {
    const r = await verify(ids(prohibited, "IFCWALL"));
    expect(r.applicable).toBe(6);
    expect(r.pass).toBe(false);
  });

  it("prohibited: passes when the applicability does not match", async () => {
    expect((await verify(ids(prohibited, "IFCSLAB"))).pass).toBe(true);
  });

  it("prohibited: does not throw when requirements are (invalidly) given", async () => {
    expect((await verify(ids(prohibited, "IFCSLAB", waldo))).pass).toBe(true);
  });
});
