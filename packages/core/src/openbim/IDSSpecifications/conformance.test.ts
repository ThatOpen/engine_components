import * as FRAGS from "@thatopen/fragments";
import * as WEBIFC from "web-ifc";
import * as fs from "fs";
import * as path from "path";
import { describe, expect, it, vi } from "vitest";
import { loadSourceBundle } from "../../../tests/source-bundle";

const OBC = await loadSourceBundle();
const directory =
  process.env.IDS_CONFORMANCE_DIR ??
  path.resolve(__dirname, "../../../tests/fixtures/ids-conformance");
const files = fs
  .readdirSync(directory, { recursive: true })
  .map(String)
  .filter(
    (name) =>
      /(^|\/)(pass|fail)-.*\.ids$/.test(name) &&
      fs.existsSync(path.join(directory, name.replace(/\.ids$/, ".ifc"))),
  );
describe("IDS full conformance", () => {
  it.each(files)(
    "%s",
    async (name) => {
      const importer = new FRAGS.IfcImporter();
      importer.wasm = {
        path: `${path.resolve(__dirname, "../../../../../node_modules/web-ifc")}/`,
        absolute: true,
      };
      importer.includeRelationNames = true;
      importer.includeMaterialProperties = true;
      for (const [code, parent, child] of [
        [
          WEBIFC.IFCRELASSOCIATESCLASSIFICATION,
          "ClassificationForObjects",
          "HasAssociations",
        ],
        [WEBIFC.IFCRELASSOCIATESMATERIAL, "AssociatedTo", "HasAssociations"],
        [WEBIFC.IFCRELDEFINESBYTYPE, "Types", "IsTypedBy"],
        [WEBIFC.IFCRELAGGREGATES, "IsDecomposedBy", "Decomposes"],
        [WEBIFC.IFCRELNESTS, "IsNestedBy", "Nests"],
        [WEBIFC.IFCRELASSIGNSTOGROUP, "IsGroupedBy", "HasAssignments"],
        [
          WEBIFC.IFCRELCONTAINEDINSPATIALSTRUCTURE,
          "ContainsElements",
          "ContainedInStructure",
        ],
        [WEBIFC.IFCRELVOIDSELEMENT, "HasOpenings", "VoidsElements"],
        [WEBIFC.IFCRELFILLSELEMENT, "HasFillings", "FillsVoids"],
      ] as const)
        importer.relations.set(code, {
          forRelated: child,
          forRelating: parent,
        });
      const ifc = fs.readFileSync(
        path.join(directory!, name.replace(/\.ids$/, ".ifc")),
        "utf8",
      );
      for (const [, category] of ifc.matchAll(
        /#\d+\s*=\s*(IFC[A-Z0-9_]+)\s*\(/g,
      )) {
        const code = WEBIFC[category as keyof typeof WEBIFC];
        if (typeof code === "number") importer.classes.abstract.add(code);
      }
      const bytes = await importer.process({
        bytes: new TextEncoder().encode(ifc),
        raw: true,
      });
      const model = new FRAGS.SingleThreadedFragmentsModel(
        "conformance",
        bytes,
        true,
      );
      const components = new OBC.Components();
      const spy = vi
        .spyOn(components.get(OBC.FragmentsManager), "list", "get")
        .mockReturnValue(new Map([["conformance", model]]) as never);
      try {
        const specs = components
          .get(OBC.IDSSpecifications)
          .load(fs.readFileSync(path.join(directory!, name), "utf8"));
        let pass = true;
        for (const spec of specs)
          if (
            !(await spec.verify([/^conformance$/], { skipIfFails: false })).pass
          )
            pass = false;
        expect(pass).toBe(path.basename(name).startsWith("pass-"));
        const exported = components
          .get(OBC.IDSSpecifications)
          .export({ title: "IDS conformance" }, specs);
        const roundtrip = components.get(OBC.IDSSpecifications).load(exported);
        expect(roundtrip.length).toBe(specs.length);
        let repeated = true;
        for (const spec of roundtrip)
          if (
            !(await spec.verify([/^conformance$/], { skipIfFails: false })).pass
          )
            repeated = false;
        expect(repeated).toBe(pass);
      } finally {
        spy.mockRestore();
        components.dispose();
        model.dispose();
      }
    },
    60000,
  );
});
