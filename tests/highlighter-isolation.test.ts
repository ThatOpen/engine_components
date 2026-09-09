import { test } from "node:test";
import assert from "node:assert/strict";
import { DataMap, type FragmentsModels } from "@thatopen/fragments";
import { MeshLambertMaterial } from "three";
import { HighlighterIsolation } from "../packages/front/src/fragments/Highlighter/src/isolation";
import { Highlighter } from "../packages/front/src/fragments/Highlighter";
import * as OBC from "@thatopen/components";
import { Color } from "three";

function harness() {
  const visibility: unknown[] = [];
  const materials = new DataMap<number, MeshLambertMaterial>();
  const models = new DataMap<string, any>();
  models.set("a", {
    setVisible: async (...args: unknown[]) => {
      visibility.push(["a", ...args]);
    },
  });
  models.set("b", {
    setVisible: async (...args: unknown[]) => {
      visibility.push(["b", ...args]);
    },
  });
  let selection = { a: new Set([7]) } as Record<string, Set<number>>;
  let updates = 0;
  const core = {
    models: { list: models, materials: { list: materials } },
    update: async () => {
      updates++;
    },
  };
  const isolation = new HighlighterIsolation(
    () => core as unknown as FragmentsModels,
    () => selection,
    () => "select",
  );
  return {
    isolation,
    materials,
    models,
    visibility,
    updates: () => updates,
    select: (map: Record<string, Set<number>>) => {
      selection = map;
    },
  };
}

test("fades original and newly streamed context materials, preserves selection, and restores originals", async () => {
  const h = harness();
  const glass = new MeshLambertMaterial({
    opacity: 0.4,
    transparent: true,
    depthWrite: true,
  });
  const selected = new MeshLambertMaterial({
    userData: { customId: "select" },
  });
  h.materials.set(1, glass);
  h.materials.set(2, selected);
  await h.isolation.isolate(0.25);
  assert.equal(glass.opacity, 0.1);
  assert.equal(glass.depthWrite, false);
  assert.equal(selected.opacity, 1);
  const streamed = new MeshLambertMaterial();
  h.materials.set(3, streamed);
  assert.equal(streamed.opacity, 0.25);
  await h.isolation.reset();
  assert.equal(glass.opacity, 0.4);
  assert.equal(glass.transparent, true);
  assert.equal(glass.depthWrite, true);
  assert.equal(streamed.opacity, 1);
  assert.equal(streamed.transparent, false);
});

test("zero hides context in every model and selection changes follow the active isolation", async () => {
  const h = harness();
  await h.isolation.isolate(0);
  assert.deepEqual(h.visibility, [
    ["a", undefined, false],
    ["a", [7], true],
    ["b", undefined, false],
  ]);
  h.select({ b: new Set([9]) });
  await h.isolation.refresh();
  assert.deepEqual(h.visibility.slice(-3), [
    ["a", undefined, false],
    ["b", undefined, false],
    ["b", [9], true],
  ]);
  h.select({});
  await h.isolation.refresh();
  assert.equal(h.isolation.active, false);
  assert.deepEqual(h.visibility.slice(-2), [
    ["a", undefined, true],
    ["b", undefined, true],
  ]);
});

test("positive slider changes require no item lookup, visibility RPCs or additional materials", async () => {
  const h = harness();
  h.materials.set(1, new MeshLambertMaterial());
  await h.isolation.isolate(0.1);
  const calls = h.visibility.length;
  for (let i = 1; i <= 100; i++) await h.isolation.setOpacity(i / 100);
  assert.equal(h.visibility.length, calls);
  assert.equal(h.materials.size, 1);
  assert.equal(h.materials.get(1)!.opacity, 1);
});

test("invalid values do not modify visibility or materials", async () => {
  const h = harness();
  for (const value of [NaN, Infinity, -0.1, 1.1])
    await assert.rejects(h.isolation.isolate(value));
  assert.deepEqual(h.visibility, []);
});

test("concurrent slider updates settle at the latest value and reset wins", async () => {
  const h = harness();
  const mat = new MeshLambertMaterial();
  h.materials.set(1, mat);
  await Promise.all([
    h.isolation.isolate(0),
    h.isolation.setOpacity(0.2),
    h.isolation.setOpacity(0.7),
  ]);
  assert.equal(mat.opacity, 0.7);
  await Promise.all([h.isolation.setOpacity(0), h.isolation.reset()]);
  assert.equal(mat.opacity, 1);
  assert.equal(h.isolation.active, false);
  assert.deepEqual(h.visibility.slice(-2), [
    ["a", undefined, true],
    ["b", undefined, true],
  ]);
});

test("disposing restores materials and stops streaming effects, including after model removal", async () => {
  const h = harness();
  const mat = new MeshLambertMaterial();
  h.materials.set(1, mat);
  await h.isolation.isolate(0.2);
  h.models.clear();
  await h.isolation.dispose();
  assert.equal(mat.opacity, 1);
  const late = new MeshLambertMaterial();
  h.materials.set(2, late);
  assert.equal(late.opacity, 1);
  await assert.rejects(h.isolation.isolate(0.3), /disposed/);
});

test("a slider change arriving as the previous update completes is not lost", async () => {
  const h = harness();
  const mat = new MeshLambertMaterial();
  h.materials.set(1, mat);
  await h.isolation.isolate(0.1);
  const first = h.isolation.setOpacity(0.2);
  const last = (async () => {
    await Promise.resolve();
    await Promise.resolve();
    await h.isolation.setOpacity(0.7);
  })();
  await Promise.all([first, last]);
  assert.equal(h.isolation.opacity, 0.7);
  assert.equal(mat.opacity, 0.7);
});

test("a worker rejection remains visible and reset can recover", async () => {
  const h = harness();
  const model = h.models.get("a");
  const setVisible = model.setVisible;
  model.setVisible = async () => {
    throw new Error("Worker disconnected");
  };
  await assert.rejects(h.isolation.isolate(0), /Worker disconnected/);
  model.setVisible = setVisible;
  await h.isolation.reset();
  assert.equal(h.isolation.active, false);
});

test("disposal takes effect synchronously and cancels an in-flight visibility update", async () => {
  const h = harness();
  const material = new MeshLambertMaterial();
  h.materials.set(1, material);
  await h.isolation.isolate(0.25);
  let release!: () => void;
  let started!: () => void;
  const inFlight = new Promise<void>((resolve) => {
    started = resolve;
  });
  h.models.get("a").setVisible = async () => {
    started();
    await new Promise<void>((resolve) => {
      release = resolve;
    });
  };
  const pending = h.isolation.setOpacity(0);
  await inFlight;
  const disposal = h.isolation.dispose();
  assert.equal(material.opacity, 1);
  await assert.rejects(h.isolation.isolate(0.7), /disposed/);
  const calls = h.visibility.length;
  release();
  await pending;
  await disposal;
  assert.equal(h.visibility.length, calls);
  const streamed = new MeshLambertMaterial();
  h.materials.set(2, streamed);
  assert.equal(streamed.opacity, 1);
});

test("Highlighter preserves style metadata and selection-driven isolation through its public API", async () => {
  const components = new OBC.Components();
  const manager = components.get(OBC.FragmentsManager);
  const h = harness();
  const definitions: any[] = [];
  for (const model of h.models.values()) {
    model.highlight = async (_ids: number[], definition: unknown) => {
      definitions.push(definition);
    };
    model.resetHighlight = async () => {};
  }
  const core = {
    models: { list: h.models, materials: { list: h.materials } },
    update: async () => {},
  };
  Object.defineProperty(manager, "core", { get: () => core });
  const highlighter = new Highlighter(components);
  highlighter.styles.set("select", {
    color: new Color("yellow"),
    opacity: 1,
    transparent: false,
    renderedFaces: 0,
    preserveOriginalMaterial: true,
    _explicitProps: ["color"],
  });
  await highlighter.highlightByID("select", { a: new Set([7]) });
  assert.ok(definitions.at(-1)._explicitProps.includes("customId"));
  assert.equal(definitions.at(-1).customId, "select");
  await highlighter.isolation.isolate(0);
  await highlighter.highlightByID("select", { b: new Set([9]) });
  assert.deepEqual(h.visibility.slice(-3), [
    ["a", undefined, false],
    ["b", undefined, false],
    ["b", [9], true],
  ]);
  await highlighter.clear("select");
  assert.equal(highlighter.isolation.active, false);
  const selectStyle = highlighter.styles.get("select")!;
  highlighter.styles.set("override", { ...selectStyle, priority: Infinity });
  await highlighter.highlightByID("select", { a: new Set([7]) });
  await highlighter.highlightByID("override", { a: new Set([7]) });
  await assert.rejects(highlighter.isolation.isolate(0.2), /priority/);
  assert.deepEqual([...highlighter.selection.override.a], [7]);
  await highlighter.highlightByID("override", { b: new Set([9]) });
  await highlighter.isolation.isolate(0.2);
  await assert.rejects(
    highlighter.highlightByID("override", { a: new Set([7]) }),
    /priority/,
  );
  assert.equal(highlighter.isolation.active, false);
  await highlighter.isolation.reset();
  highlighter.styles.set("select", null);
  await highlighter.highlightByID("select", { a: new Set([7]) });
  await assert.rejects(
    highlighter.isolation.isolate(0.2),
    /non-null select material/,
  );
});
