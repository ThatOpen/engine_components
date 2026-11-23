import * as FRAGS from "@thatopen/fragments";
import * as WEBIFC from "web-ifc";
import * as fs from "fs";
import * as path from "path";
import { describe, expect, it, vi } from "vitest";
import { loadSourceBundle } from "../../../../../tests/source-bundle";

const OBC = await loadSourceBundle();
const root = path.resolve(__dirname, "../../../../..");
const fixtures = path.join(root, "tests/fixtures/ids-partof");
const files = fs
  .readdirSync(fixtures)
  .filter((name) => /^(pass|fail)-.*\.ids$/.test(name));
describe("IDSPartOf buildingSMART conformance", () => {
  it.each(files)(
    "%s",
    async (name) => {
      const importer = new FRAGS.IfcImporter();
      importer.wasm = {
        path: `${path.resolve(root, "../../node_modules/web-ifc")}/`,
        absolute: true,
      };
      importer.includeRelationNames = true;
      const ifc = fs.readFileSync(
        path.join(fixtures, name.replace(/\.ids$/, ".ifc")),
        "utf8",
      );
      for (const [, category] of ifc.matchAll(
        /#\d+\s*=\s*(IFC[A-Z0-9_]+)\s*\(/g,
      )) {
        const code = WEBIFC[category as keyof typeof WEBIFC];
        if (typeof code === "number") importer.classes.abstract.add(code);
      }
      for (const [code, child, parent] of [
        [WEBIFC.IFCRELASSIGNSTOGROUP, "HasAssignments", "IsGroupedBy"],
        [WEBIFC.IFCRELVOIDSELEMENT, "VoidsElements", "HasOpenings"],
        [WEBIFC.IFCRELFILLSELEMENT, "FillsVoids", "HasFillings"],
      ] as const)
        importer.relations.set(code, {
          forRelated: child,
          forRelating: parent,
        });
      const bytes = await importer.process({
        bytes: new TextEncoder().encode(ifc),
        raw: true,
      });
      const model = new FRAGS.SingleThreadedFragmentsModel(
        "partof",
        bytes,
        true,
      );
      const components = new OBC.Components();
      const spy = vi
        .spyOn(components.get(OBC.FragmentsManager), "list", "get")
        .mockReturnValue(new Map([["partof", model]]) as never);
      try {
        const manager = components.get(OBC.IDSSpecifications);
        const specs = manager.load(
          fs.readFileSync(path.join(fixtures, name), "utf8"),
        );
        let pass = true;
        for (const spec of specs) {
          const results = await spec.test([/^partof$/], { skipIfFails: false });
          for (const items of results.values())
            for (const item of items.values()) if (!item.pass) pass = false;
        }
        expect(pass).toBe(name.startsWith("pass-"));
        const xml = manager.export({ title: "Part of" }, specs);
        expect(xml).toContain("<partOf");
        expect(manager.load(xml).length).toBe(specs.length);
      } finally {
        spy.mockRestore();
        components.dispose();
        model.dispose();
      }
    },
    60_000,
  );
});
