import { describe, expect, it } from "vitest";
import { writeVisibleNodeTable } from "./visible-node-table";

type Node = { name: string; density?: number };
const table = (nodes: Node[]) => {
  const texels = new Uint8Array(nodes.length * 4);
  const slots = writeVisibleNodeTable(nodes, texels, (n) => n.name, (n) => n.density);
  return { texels, slots };
};

describe("writeVisibleNodeTable", () => {
  it("lays nodes out level by level and by name, whatever order they arrive in", () => {
    const nodes = ["r06", "r4", "r", "r0", "r04"].map((name) => ({ name }));
    const { slots } = table(nodes);
    const keyedByName = Object.fromEntries(nodes.map((n) => [n.name, slots.get(n)]));
    expect(keyedByName).toEqual({ r: 0, r0: 1, r4: 2, r04: 3, r06: 4 });
  });

  it("marks each visible child octant and points at the first child", () => {
    const { texels } = table(["r", "r0", "r4", "r04", "r06"].map((name) => ({ name })));
    // r: children 0 and 4, first one right after it.
    expect([...texels.subarray(0, 3)]).toEqual([0b10001, 0, 1]);
    // r0: children 4 and 6, first one two texels after it (slot 3).
    expect([...texels.subarray(4, 7)]).toEqual([0b1010000, 0, 2]);
    // r4 and the leaves have no visible children.
    expect([...texels.subarray(8, 11)]).toEqual([0, 0, 0]);
  });

  it("splits a gap wider than a byte into high and low bytes", () => {
    // A full octree three levels deep: the last node of level 2 ("r77") has 504 level-3 nodes between it and its
    // first child "r770".
    const names = ["r"];
    for (let level = 0; level < 3; level++) {
      for (const name of names.filter((n) => n.length === level + 1)) {
        for (let octant = 0; octant < 8; octant++) names.push(name + octant);
      }
    }
    const nodes: Node[] = names.map((name) => ({ name }));
    const { texels, slots } = table(nodes);
    const parent = slots.get(nodes.find((n) => n.name === "r77")!)!;
    const child = slots.get(nodes.find((n) => n.name === "r770")!)!;
    expect(child - parent).toBe(505);
    expect([texels[parent * 4 + 1], texels[parent * 4 + 2]]).toEqual([1, 249]);
  });

  it("stores the density term, or 100 when there is none", () => {
    const { texels } = table([{ name: "r", density: 4 }, { name: "r0" }, { name: "r1", density: NaN }]);
    expect(texels[3]).toBe(95); // 10 * (log2(4) / 2 + 8.5)
    expect(texels[7]).toBe(100);
    expect(texels[11]).toBe(100);
  });
});
