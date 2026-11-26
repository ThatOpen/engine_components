import { describe, expect, it } from "vitest";
import { loadSourceBundle } from "../../../../tests/source-bundle";

// Needs the real `Components`: see `loadSourceBundle`.
const OBC = await loadSourceBundle();

const ids = (occurs: string) => `<?xml version="1.0" encoding="UTF-8"?>
<ids:ids xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns:ids="http://standards.buildingsmart.org/IDS">
  <ids:info><ids:title>Occurs</ids:title></ids:info>
  <ids:specifications>
    <ids:specification name="spec" ifcVersion="IFC4">
      <ids:applicability ${occurs}>
        <ids:entity><ids:name><ids:simpleValue>IFCWALL</ids:simpleValue></ids:name></ids:entity>
      </ids:applicability>
    </ids:specification>
  </ids:specifications>
</ids:ids>`;

describe("IDSSpecification minOccurs / maxOccurs", () => {
  const roundTrip = (occurs: string) => {
    const manager = new OBC.Components().get(OBC.IDSSpecifications);
    const [spec] = manager.load(ids(occurs));
    const xml = manager.export({ title: "t" }, [spec]);
    const [again] = manager.load(xml);
    return { spec, xml, again };
  };

  it("required (1, unbounded) is the default", () => {
    const { spec } = roundTrip("");
    expect([spec.minOccurs, spec.maxOccurs]).toEqual([1, "unbounded"]);
  });

  it("optional (0, unbounded) survives load and export", () => {
    const { spec, xml, again } = roundTrip(
      'minOccurs="0" maxOccurs="unbounded"',
    );
    expect([spec.minOccurs, spec.maxOccurs]).toEqual([0, "unbounded"]);
    expect(xml).toContain(
      '<applicability minOccurs="0" maxOccurs="unbounded">',
    );
    expect([again.minOccurs, again.maxOccurs]).toEqual([0, "unbounded"]);
  });

  it("prohibited (0, 0) survives load and export", () => {
    const { spec, xml, again } = roundTrip('minOccurs="0" maxOccurs="0"');
    expect([spec.minOccurs, spec.maxOccurs]).toEqual([0, 0]);
    expect(xml).toContain('<applicability minOccurs="0" maxOccurs="0">');
    expect([again.minOccurs, again.maxOccurs]).toEqual([0, 0]);
  });
});
