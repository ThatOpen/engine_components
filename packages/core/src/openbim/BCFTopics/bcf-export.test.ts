import JSZip from "jszip";
import { XMLValidator } from "fast-xml-parser";
import { describe, expect, it } from "vitest";
import { loadSourceBundle } from "../../../tests/source-bundle";

// Needs the real `Components`: see `loadSourceBundle`.
const OBC = await loadSourceBundle();

const GUID = "2O2Fr$t4X7Zf8NOew3FLOH";
const HIDDEN = "0K5f3$Pz95u8Wq_1mQ1Ab2";

const exportZip = async (version: "2.1" | "3") => {
  const components = new OBC.Components();
  const bcf = components.get(OBC.BCFTopics);
  bcf.setup({
    version,
    types: new Set(["Clash & Coordination"]),
    labels: new Set(["MEP <priority>"]),
  });
  const topic = bcf.create({
    title: "Duct & beam",
    type: "Clash & Coordination",
  });
  bcf.documents.set("a3d5b9c2-1111-4222-8333-444455556666", {
    type: "internal",
    fileName: "R&D notes.txt",
    description: "x < y",
    data: new TextEncoder().encode("hi"),
  } as any);
  const vp = components.get(OBC.Viewpoints).create();
  vp.title = "Level 2/North";
  vp.selectionComponents.add(GUID);
  vp.exceptionComponents.add(HIDDEN);
  vp.componentColors.set("FF0000", [GUID]);
  topic.viewpoints.add(vp.guid);
  const blob = await bcf.export([topic]);
  const data = new Uint8Array(await blob.arrayBuffer());
  const zip = await JSZip.loadAsync(data);
  const files = new Map<string, string>();
  for (const [name, file] of Object.entries(zip.files)) {
    if (!file.dir && /(\.xml|\.bcf|\.bcfv|bcf\.version)$/.test(name)) {
      files.set(name, await file.async("string"));
    }
  }
  return { files, data, vp, OBC };
};

describe("BCFTopics export", () => {
  it.each(["2.1", "3"] as const)(
    "writes well-formed XML with escaped values (BCF %s)",
    async (version) => {
      const { files } = await exportZip(version);
      for (const [name, xml] of files) {
        expect(XMLValidator.validate(xml), name).toBe(true);
      }
      expect(files.get("extensions.xml")).toMatch(/^<\?xml /);
      expect(files.get("extensions.xml")).toContain("Clash &amp; Coordination");
    },
  );

  it("names viewpoint files by guid, matching the markup", async () => {
    const { files, vp } = await exportZip("3");
    const bcfv = [...files.keys()].filter((n) => n.endsWith(".bcfv"));
    expect(bcfv).toHaveLength(1);
    expect(bcfv[0].split("/")).toHaveLength(2);
    expect(bcfv[0].endsWith(`/${vp.guid}.bcfv`)).toBe(true);
    const markup = [...files.entries()].find(([n]) =>
      n.endsWith("markup.bcf"),
    )![1];
    expect(markup).toContain(`${vp.guid}.bcfv`);
  });

  it("writes the 3.0 visualization layout", async () => {
    const { files } = await exportZip("3");
    const bcfv = [...files.entries()].find(([n]) => n.endsWith(".bcfv"))![1];
    expect(bcfv).toMatch(
      /<Color Color="FF0000">\s*<Components>\s*<Component IfcGuid=/,
    );
    // Exceptions hold the exception components, not the selection.
    const exceptions = bcfv.match(/<Exceptions>([\s\S]*?)<\/Exceptions>/)![1];
    expect(exceptions).toContain(HIDDEN);
    expect(exceptions).not.toContain(GUID);
    expect(bcfv.indexOf("<FieldOfView>")).toBeLessThan(
      bcfv.indexOf("<AspectRatio>"),
    );
  });

  it("writes the 2.1 visualization layout", async () => {
    const { files } = await exportZip("2.1");
    const bcfv = [...files.entries()].find(([n]) => n.endsWith(".bcfv"))![1];
    expect(bcfv).toMatch(/<Color Color="FF0000">\s*<Component IfcGuid=/);
    expect(bcfv).not.toContain("<AspectRatio>");
  });

  it.each(["2.1", "3"] as const)(
    "reads its own colouring and exceptions back (BCF %s)",
    async (version) => {
      const { data, OBC: lib } = await exportZip(version);
      const components = new lib.Components();
      const bcf = components.get(lib.BCFTopics);
      bcf.setup({ version });
      const { viewpoints } = await bcf.load(data);
      const [vp] = viewpoints;
      expect([...vp.componentColors.get("FF0000")!]).toEqual([GUID]);
      expect([...vp.exceptionComponents]).toEqual([HIDDEN]);
      expect([...vp.selectionComponents]).toEqual([GUID]);
    },
  );
});
