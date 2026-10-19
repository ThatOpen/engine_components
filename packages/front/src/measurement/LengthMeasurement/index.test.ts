// @vitest-environment happy-dom
import { afterEach, describe, expect, it, vi } from "vitest";
import * as THREE from "three";
import * as OBC from "@thatopen/components";
import { LengthMeasurement } from "./index";

type Listener = (...args: any[]) => void;

// Records the listeners currently attached to a target, by event type.
const track = (target: any) => {
  const attached = new Map<string, Set<Listener>>();
  const add = target.addEventListener?.bind(target);
  const remove = target.removeEventListener?.bind(target);
  target.addEventListener = (type: string, fn: Listener, opts?: any) => {
    if (!attached.has(type)) attached.set(type, new Set());
    attached.get(type)!.add(fn);
    add?.(type, fn, opts);
  };
  target.removeEventListener = (type: string, fn: Listener, opts?: any) => {
    attached.get(type)?.delete(fn);
    remove?.(type, fn, opts);
  };
  return () => {
    const left: Record<string, number> = {};
    for (const [type, fns] of attached) if (fns.size) left[type] = fns.size;
    return left;
  };
};

const setup = () => {
  const container = document.createElement("div");
  const canvas = document.createElement("canvas");
  container.appendChild(canvas);
  const controls = {} as any;
  const onResize = new OBC.Event<THREE.Vector2>();
  const world = {
    isDisposing: false,
    renderer: {
      three: { domElement: canvas },
      onResize,
      getSize: () => new THREE.Vector2(100, 100),
      update: () => {},
    },
    camera: { controls },
  } as unknown as OBC.World;

  const components = { add: () => {} } as unknown as OBC.Components;
  const measurer = new LengthMeasurement(components);

  // The picker resolves when the test says so, like a GPU pick a frame later.
  const pending: ((value: any) => void)[] = [];
  const picker = {
    world: null,
    enabled: false,
    marker: null,
    get: vi.fn(() => new Promise((resolve) => pending.push(resolve))),
    dispose: vi.fn(),
  };
  (measurer as any)._vertexPicker = picker;
  const resolvePicks = (value: any) => {
    for (const resolve of pending.splice(0)) resolve(value);
  };

  // Preview lines are DimensionLines, which need a full renderer. Count the
  // ones created and disposed instead.
  const live = new Set<any>();
  let created = 0;
  (measurer as any).createLineElement = () => {
    created++;
    const dimension = {
      visible: true,
      dispose: () => live.delete(dimension),
    };
    live.add(dimension);
    return dimension;
  };

  const containerLeft = track(container);
  const controlsLeft = track(controls);
  const windowLeft = track(window);

  measurer.world = world;

  return {
    measurer,
    world,
    onResize,
    resolvePicks,
    live,
    created: () => created,
    listenersLeft: () => ({
      container: containerLeft(),
      controls: controlsLeft(),
      window: windowLeft(),
      onResize: (onResize as any).handlers.length,
    }),
  };
};

const restoreWindow = {
  add: window.addEventListener,
  remove: window.removeEventListener,
};

afterEach(() => {
  window.addEventListener = restoreWindow.add;
  window.removeEventListener = restoreWindow.remove;
});

const none = { container: {}, controls: {}, window: {}, onResize: 0 };

describe("LengthMeasurement.dispose (#832)", () => {
  it("detaches every listener it attached", () => {
    const t = setup();
    t.measurer.enabled = true;
    expect(t.listenersLeft()).not.toEqual(none);
    t.measurer.dispose();
    expect(t.listenersLeft()).toEqual(none);
    expect(t.measurer.enabled).toBe(false);
  });

  it("still attaches and detaches when toggled", () => {
    const t = setup();
    t.measurer.enabled = true;
    t.measurer.enabled = false;
    expect(t.listenersLeft()).toEqual({ ...none, onResize: 1 });
    t.measurer.enabled = true;
    t.measurer.enabled = true;
    expect(t.listenersLeft()).toEqual({
      container: { pointermove: 1, pointerleave: 1, wheel: 1 },
      controls: { controlstart: 1, controlend: 1 },
      window: { keydown: 1 },
      onResize: 1,
    });
  });

  it("detaches every listener also while the world is disposing", () => {
    const t = setup();
    t.measurer.enabled = true;
    (t.world as any).isDisposing = true;
    t.measurer.dispose();
    expect(t.listenersLeft()).toEqual(none);
  });

  it("disposes an open free-mode preview", async () => {
    const t = setup();
    t.measurer.enabled = true;
    const creating = t.measurer.create();
    t.resolvePicks({ point: new THREE.Vector3(1, 2, 3) });
    await creating;
    expect(t.live.size).toBe(1);
    t.measurer.dispose();
    expect(t.live.size).toBe(0);
  });

  it("disposes the edge-mode preview", async () => {
    const t = setup();
    t.measurer.mode = "edge";
    t.measurer.enabled = true;
    t.resolvePicks({});
    await Promise.resolve();
    await Promise.resolve();
    expect(t.live.size).toBeGreaterThan(0);
    t.measurer.dispose();
    expect(t.live.size).toBe(0);
  });

  it("does not build a preview for a pick that resolves after dispose", async () => {
    const t = setup();
    t.measurer.enabled = true;
    const creating = t.measurer.create();
    t.measurer.dispose();
    t.resolvePicks({ point: new THREE.Vector3(1, 2, 3) });
    await creating;
    expect(t.live.size).toBe(0);
  });
});

describe("LengthMeasurement.create while a pick is pending (#832)", () => {
  it("builds one preview for a double click", async () => {
    const t = setup();
    t.measurer.enabled = true;
    const a = t.measurer.create();
    const b = t.measurer.create();
    t.resolvePicks({ point: new THREE.Vector3(1, 2, 3) });
    await Promise.all([a, b]);
    expect(t.created()).toBe(1);
    t.measurer.cancelCreation();
    expect(t.live.size).toBe(0);
  });
});
