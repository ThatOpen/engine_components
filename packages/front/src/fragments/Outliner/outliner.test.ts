// update(map) must add the map to the group, and a group removed while its
// sync is in flight must not get its outlines re-attached by the late answer.
import * as THREE from "three";
import { describe, expect, it } from "vitest";
import { Highlighter } from "../Highlighter";
import { Outliner } from "./index";

const event = () => ({ add: () => {}, remove: () => {} });

const setup = () => {
  const highlighter = {
    styles: { has: () => false, onItemDeleted: event() },
    events: {},
  };
  const list = new Map<string, any>();
  const fragments = { list };
  const components = {
    add: () => {},
    get: (cls: any) => (cls === Highlighter ? highlighter : fragments),
  } as any;

  const calls: string[] = [];
  const groups = new Set<string>();
  const pass = {
    hasGroup: (name: string) => groups.has(name),
    addGroup: (name: string) => {
      groups.add(name);
      calls.push(`add ${name}`);
    },
    removeGroup: (name: string) => {
      groups.delete(name);
      calls.push(`remove ${name}`);
    },
    configureGroup: () => {},
    attachOutlinedTile: (_tile: unknown, _ranges: unknown, name: string) =>
      calls.push(`attach ${name}`),
    detachOutlinedTile: (_tile: unknown, name: string) =>
      calls.push(`detach ${name}`),
  };
  const world = {
    isDisposing: false,
    renderer: {
      postproduction: {
        outlinePass: pass,
        excludedObjectsPass: { addExcludedMaterial: () => {} },
      },
    },
  } as any;

  // The chunk query resolves when the test says so, like a worker round-trip.
  const pending: ((value: unknown) => void)[] = [];
  const tile = new THREE.Mesh();
  const tiles = Object.assign(new Map([[0, tile]]), {
    onItemSet: event(),
    onItemDeleted: event(),
  });
  list.set("m", {
    object: { userData: {} },
    tiles,
    onViewUpdated: event(),
    getItemDrawChunks: () =>
      new Promise((resolve) => {
        pending.push(resolve);
      }),
  });

  const outliner = new Outliner(components);
  outliner.world = world;
  const answer = () => {
    for (const resolve of pending.splice(0)) {
      resolve([
        {
          tileId: 0,
          position: new Uint32Array([0]),
          size: new Uint32Array([3]),
        },
      ]);
    }
  };
  return { outliner, calls, answer };
};

describe("Outliner", () => {
  it("update(map) adds the map to the group, like addItems", async () => {
    const { outliner, answer } = setup();
    const done = outliner.update({ m: new Set([1]) }, "g");
    answer();
    await done;
    const state = (outliner as any)._groups.get("g");
    expect([...(state.map.m ?? [])]).toEqual([1]);
  });

  it("does not re-attach outlines of a group removed while its sync was in flight", async () => {
    const { outliner, calls, answer } = setup();
    outliner.create("g");
    const done = outliner.addItems({ m: new Set([1]) }, "g");
    // Let the sync reach the chunk query before removing the group.
    await new Promise((resolve) => setTimeout(resolve, 0));
    outliner.remove("g");
    answer();
    await done;
    const afterRemove = calls.slice(calls.lastIndexOf("remove g") + 1);
    expect(afterRemove).toEqual([]);
    expect((outliner as any)._groups.has("g")).toBe(false);
  });

  it("does not put an outline back after the group was cleaned while its sync was in flight", async () => {
    const { outliner, calls, answer } = setup();
    outliner.create("g");
    const done = outliner.addItems({ m: new Set([1]) }, "g");
    await new Promise((resolve) => setTimeout(resolve, 0));
    outliner.clean("g");
    const afterClean = calls.length;
    answer();
    await done;
    expect(calls.slice(afterClean)).toEqual([]);
  });
});
