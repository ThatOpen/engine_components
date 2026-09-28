import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { Components, SimplePlane } from "../../index";
import { loadSourceBundle } from "../../../tests/source-bundle";

// Needs the real `Components`, so the whole graph: see `loadSourceBundle`.
const OBC = await loadSourceBundle();

/**
 * Enough of a {@link SimplePlane} for the delete path: the renderer it
 * unregisters from and its own teardown.
 */
const fakePlane = () =>
  ({
    type: "default",
    world: { renderer: { setPlane: vi.fn() } },
    dispose: vi.fn(),
  }) as unknown as SimplePlane & {
    world: { renderer: { setPlane: ReturnType<typeof vi.fn> } };
    dispose: ReturnType<typeof vi.fn>;
  };

describe("Clipper delete events (#799)", () => {
  let components: Components;
  let clipper: InstanceType<typeof OBC.Clipper>;

  beforeEach(() => {
    components = new OBC.Components();
    clipper = components.get(OBC.Clipper);
  });

  afterEach(() => {
    components.dispose();
  });

  it("fires onAfterDelete once the plane is gone from the list", () => {
    const plane = fakePlane();
    clipper.list.set("a", plane);

    const seen: { size: number; has: boolean; plane: SimplePlane }[] = [];
    clipper.onAfterDelete.add((deleted) => {
      seen.push({
        size: clipper.list.size,
        has: clipper.list.has("a"),
        plane: deleted,
      });
    });

    clipper.list.delete("a");

    expect(seen).toEqual([{ size: 0, has: false, plane }]);
  });

  it("fires onBeforeDelete while the plane is still in the list", () => {
    clipper.list.set("a", fakePlane());

    const seen: { size: number; has: boolean }[] = [];
    clipper.onBeforeDelete.add(() => {
      seen.push({ size: clipper.list.size, has: clipper.list.has("a") });
    });

    clipper.list.delete("a");

    expect(seen).toEqual([{ size: 1, has: true }]);
  });

  it("fires before, then teardown, then after, once per plane", () => {
    const plane = fakePlane();
    clipper.list.set("a", plane);

    const order: string[] = [];
    clipper.onBeforeDelete.add(() => order.push("before"));
    plane.world.renderer.setPlane.mockImplementation(() =>
      order.push("setPlane"),
    );
    plane.dispose.mockImplementation(() => order.push("dispose"));
    clipper.onAfterDelete.add(() => order.push("after"));

    clipper.list.delete("a");

    expect(order).toEqual(["before", "setPlane", "dispose", "after"]);
  });

  it("still tears down and reports every plane when the list is cleared", () => {
    const a = fakePlane();
    const b = fakePlane();
    clipper.list.set("a", a);
    clipper.list.set("b", b);

    const after: { plane: SimplePlane; size: number }[] = [];
    clipper.onAfterDelete.add((plane) =>
      after.push({ plane, size: clipper.list.size }),
    );

    clipper.list.clear();

    expect(a.dispose).toHaveBeenCalledTimes(1);
    expect(b.dispose).toHaveBeenCalledTimes(1);
    expect(after).toEqual([
      { plane: a, size: 0 },
      { plane: b, size: 0 },
    ]);
  });
});
