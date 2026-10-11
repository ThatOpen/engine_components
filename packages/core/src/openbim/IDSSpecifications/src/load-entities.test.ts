import { afterAll, describe, expect, it } from "vitest";
import type { Components } from "../../../index";
import { loadSourceBundle } from "../../../../tests/source-bundle";

// Needs the real `Components`: see `loadSourceBundle`.
const OBC = await loadSourceBundle();

const ids = `<?xml version="1.0" encoding="UTF-8"?>
<ids:ids xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns:ids="http://standards.buildingsmart.org/IDS">
  <ids:info><ids:title>Entities</ids:title></ids:info>
  <ids:specifications>
    <ids:specification name="R&amp;D walls" ifcVersion="IFC4">
      <ids:applicability minOccurs="0" maxOccurs="unbounded">
        <ids:entity><ids:name><ids:simpleValue>IFCWALL</ids:simpleValue></ids:name></ids:entity>
      </ids:applicability>
      <ids:requirements>
        <ids:property dataType="IFCLABEL">
          <ids:propertySet><ids:simpleValue>Pset_R&amp;D</ids:simpleValue></ids:propertySet>
          <ids:baseName><ids:simpleValue>Owner</ids:simpleValue></ids:baseName>
          <ids:value><ids:simpleValue>Smith &amp; Sons &lt;Ltd&gt;</ids:simpleValue></ids:value>
        </ids:property>
      </ids:requirements>
    </ids:specification>
  </ids:specifications>
</ids:ids>`;

describe("IDSSpecifications.load", () => {
  const components: Components = new OBC.Components();
  afterAll(() => components.dispose());

  it("decodes XML entities in names and facet values", () => {
    const [spec] = components.get(OBC.IDSSpecifications).load(ids);
    expect(spec.name).toBe("R&D walls");
    const [property] = [...spec.requirements] as InstanceType<
      typeof OBC.IDSProperty
    >[];
    expect(property.propertySet.parameter).toBe("Pset_R&D");
    expect(property.value?.parameter).toBe("Smith & Sons <Ltd>");
  });

  it("round-trips them through export", () => {
    const specs = components.get(OBC.IDSSpecifications);
    specs.list.clear();
    specs.load(ids);
    const xml = specs.export({ title: "Entities" });
    specs.list.clear();
    const [spec] = specs.load(xml);
    expect(spec.name).toBe("R&D walls");
    const [property] = [...spec.requirements] as InstanceType<
      typeof OBC.IDSProperty
    >[];
    expect(property.value?.parameter).toBe("Smith & Sons <Ltd>");
  });
});
