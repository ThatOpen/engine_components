import * as FRAGS from "@thatopen/fragments";
import * as WEBIFC from "web-ifc";
import * as fs from "fs";
import * as path from "path";
import { describe, expect, it, vi } from "vitest";
import { loadSourceBundle } from "../../../../../tests/source-bundle";

const OBC = await loadSourceBundle();
const root = path.resolve(__dirname, "../../../../..");
const fixtures = path.join(root, "tests/fixtures/ids-attribute");
const files = fs
  .readdirSync(fixtures)
  .filter((name) => /^(pass|fail)-.*\.ids$/.test(name));
describe("IDSAttribute buildingSMART conformance", () => {
  it.each(files)(
    "%s",
    async (name) => {
      const importer = new FRAGS.IfcImporter();
      importer.wasm = {
        path: `${path.resolve(root, "../../node_modules/web-ifc")}/`,
        absolute: true,
      };
      importer.includeRelationNames = true;
      importer.relations.set(WEBIFC.IFCRELASSOCIATESCLASSIFICATION, {
        forRelated: "HasAssociations",
        forRelating: "ClassificationForObjects",
      });
      importer.relations.set(WEBIFC.IFCRELDEFINESBYTYPE, {
        forRelated: "IsTypedBy",
        forRelating: "Types",
      });
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
        [
          WEBIFC.IFCRELASSOCIATESCLASSIFICATION,
          "HasAssociations",
          "ClassificationForObjects",
        ],
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
        "attribute",
        bytes,
        true,
      );
      const components = new OBC.Components();
      const spy = vi
        .spyOn(components.get(OBC.FragmentsManager), "list", "get")
        .mockReturnValue(new Map([["attribute", model]]) as never);
      try {
        const manager = components.get(OBC.IDSSpecifications);
        const specs = manager.load(
          fs.readFileSync(path.join(fixtures, name), "utf8"),
        );
        let pass = true;
        for (const spec of specs) {
          const results = await spec.test([/^attribute$/], {
            skipIfFails: false,
          });
          for (const items of results.values())
            for (const item of items.values()) if (!item.pass) pass = false;
        }
        expect(pass).toBe(name.startsWith("pass-"));
        for (const spec of specs)
          for (const facet of spec.requirements) {
            if (facet.facetType !== "Attribute") continue;
            const previous = facet.cardinality;
            facet.cardinality = "required";
            const all = Object.values(
              await model.getItemsOfCategories([/.*/]),
            ).flat();
            const direct = new FRAGS.DataMap<
              string,
              FRAGS.DataMap<number, { pass: boolean }>
            >();
            await facet.test({ attribute: new Set(all) }, direct, {
              skipIfFails: false,
            });
            const selected: Record<string, Set<number>> = {};
            await facet.getEntities([/^attribute$/], selected);
            const expected = [...(direct.get("attribute") ?? [])]
              .filter(([, result]) => result.pass)
              .map(([id]) => id);
            expect([...(selected.attribute ?? [])].sort()).toEqual(
              expected.sort(),
            );
            facet.cardinality = previous;
          }
        const xml = manager.export({ title: "Attribute" }, specs);
        expect(xml).toContain("<attribute");
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
