import * as THREE from "three";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { Components } from "../../index";
import { loadSourceBundle } from "../../../tests/source-bundle";
import { ProjectionGenerator } from "./projection/ProjectionGenerator.js";
import { VisibilityCuller } from "./projection/VisibilityCuller.js";

// `EdgeProjector.get` needs the real `Components`: see `loadSourceBundle`.
const OBC = await loadSourceBundle();

/**
 * The generator pumps itself on requestAnimationFrame. Node has none, so
 * frames are macrotasks here, counted so a test can tell "settled" from
 * "still pumping after N frames".
 */
let frames = 0;
beforeEach(() => {
  frames = 0;
  vi.stubGlobal("requestAnimationFrame", (callback: () => void) =>
    setTimeout(() => {
      frames++;
      callback();
    }, 0),
  );
});
afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

const PENDING = Symbol("pending");

/** Settles like `promise`, or resolves `PENDING` after `limit` frames. */
const within = <T>(promise: Promise<T>, limit = 200) =>
  new Promise<T | typeof PENDING>((resolve, reject) => {
    promise.then(resolve, reject);
    const poll = () => {
      if (frames >= limit) resolve(PENDING);
      else setTimeout(poll, 0);
    };
    poll();
  });

/** A result, or the error, so both can be asserted on as values. */
const outcome = <T>(promise: Promise<T>) =>
  promise.then(
    (value) => ({ value }),
    (error: Error) => ({ error: error?.message ?? String(error) }),
  );

const boxScene = () => {
  const scene = new THREE.Scene();
  scene.add(new THREE.Mesh(new THREE.BoxGeometry()));
  scene.updateMatrixWorld(true);
  return scene;
};

describe("ProjectionGenerator.generateAsync failure paths (#786)", () => {
  it("rejects when the visibility cull rejects, instead of pumping forever", async () => {
    const generator = new ProjectionGenerator();
    generator.useWebGPU = false;
    const visibilityCuller = {
      cull: () => Promise.reject(new Error("readback failed (lost context)")),
    };

    const result = await within(
      outcome(generator.generateAsync(boxScene(), { visibilityCuller })),
    );

    expect({ result, framesPumped: frames }).toMatchObject({
      result: { error: "readback failed (lost context)" },
    });
  });

  it("rejects when the WebGPU edge cast fails, instead of pumping forever", async () => {
    // Node has no `navigator.gpu`, so the WebGPU cast fails on its own, the
    // same way it does in a browser without an adapter.
    const generator = new ProjectionGenerator();
    generator.useWebGPU = true;
    generator.includeIntersectionEdges = false;
    // The failure surfaces from inside a frame callback; without a catch
    // there it is an uncaught exception, not a rejection.
    const uncaught: unknown[] = [];
    const onUncaught = (error: unknown) => uncaught.push(error);
    process.on("uncaughtException", onUncaught);

    try {
      const result = await within(
        outcome(generator.generateAsync(boxScene(), {})),
      );
      expect({ result, uncaught: uncaught.length }).toMatchObject({
        result: { error: expect.any(String) },
        uncaught: 0,
      });
    } finally {
      process.off("uncaughtException", onUncaught);
    }
  });

  it("still resolves when nothing fails", async () => {
    const generator = new ProjectionGenerator();
    generator.useWebGPU = false;
    const result = await within(outcome(generator.generateAsync(boxScene())));
    expect(result).toHaveProperty("value");
  });
});

describe("VisibilityCuller.cull failure (#786)", () => {
  it("restores the renderer and the objects when a readback rejects", async () => {
    const previousTarget = { name: "app target" };
    let target: unknown = previousTarget;
    const renderer = {
      capabilities: { maxTextureSize: 4096 },
      autoClear: true,
      getClearColor: (into: THREE.Color) => into.set(0x123456),
      getClearAlpha: () => 0.5,
      setClearColor: vi.fn(),
      getRenderTarget: () => target,
      setRenderTarget: (next: unknown) => {
        target = next;
      },
      render: vi.fn(),
      readRenderTargetPixelsAsync: () =>
        Promise.reject(new Error("readback failed")),
    };
    const scene = boxScene();
    const mesh = scene.children[0] as THREE.Mesh;
    const material = mesh.material;

    const culler = new VisibilityCuller(renderer, { pixelsPerMeter: 0.1 });
    const result = await outcome(culler.cull(scene));

    expect({
      result,
      target: target === previousTarget,
      autoClear: renderer.autoClear,
      lastClear: renderer.setClearColor.mock.lastCall,
      material: mesh.material === material,
      parent: mesh.parent === scene,
    }).toEqual({
      result: { error: "readback failed" },
      target: true,
      autoClear: true,
      lastClear: [new THREE.Color(0x123456), 0.5],
      material: true,
      parent: true,
    });
  });
});

describe("EdgeProjector.get (#786)", () => {
  let components: Components;

  beforeEach(() => {
    components = new OBC.Components();
  });

  afterEach(() => {
    components.dispose();
  });

  it("forwards its AbortSignal to the generator", async () => {
    const projector = components.get(OBC.EdgeProjector);
    const empty = new THREE.BufferGeometry();
    const generateAsync = vi
      .spyOn(projector.generator, "generateAsync")
      .mockResolvedValue({
        getVisibleLineGeometry: () => empty.clone(),
        getHiddenLineGeometry: () => empty.clone(),
        getGroupKeys: () => ({}),
      });
    const world = { renderer: { three: {} } };
    const controller = new AbortController();

    await projector.get({}, world as never, { signal: controller.signal });

    expect(generateAsync).toHaveBeenCalledTimes(1);
    expect(generateAsync.mock.calls[0][1]).toHaveProperty(
      "signal",
      controller.signal,
    );
  });

  it("rejects, and pumps no further, once its signal is aborted", async () => {
    const projector = components.get(OBC.EdgeProjector);
    projector.generator.useWebGPU = false;
    const world = {
      renderer: {
        three: {
          capabilities: { maxTextureSize: 4096 },
          autoClear: true,
          getClearColor: (into: THREE.Color) => into,
          getClearAlpha: () => 1,
          setClearColor: () => {},
          getRenderTarget: () => null,
          setRenderTarget: () => {},
          render: () => {},
          // A cull that never finishes: only the signal can end the wait.
          readRenderTargetPixelsAsync: () => new Promise(() => {}),
        },
      },
    };
    const fragments = components.get(OBC.FragmentsManager);
    const model = {
      object: new THREE.Object3D(),
      getItemsIdsWithGeometry: async () => [1],
      getItemsGeometry: async () => ({
        1: [
          {
            localId: 1,
            representationId: 1,
            transform: new THREE.Matrix4(),
            ...(() => {
              const box = new THREE.BoxGeometry();
              return {
                positions: box.attributes.position.array,
                indices: box.index!.array,
              };
            })(),
          },
        ],
      }),
    };
    // Stands in for `init()` + a loaded model: `get` only reads `list`.
    vi.spyOn(fragments, "list", "get").mockReturnValue(
      new Map([["m", model]]) as never,
    );
    const controller = new AbortController();

    const pending = outcome(
      projector.get({ m: new Set([1]) }, world as never, {
        signal: controller.signal,
      }),
    );
    setTimeout(() => controller.abort(), 0);
    const result = await within(pending);

    expect(result).toMatchObject({ error: expect.stringMatching(/abort/i) });
    // No frame is scheduled for the generator after it rejected.
    const pumped = frames;
    for (let i = 0; i < 20; i++) {
      // eslint-disable-next-line no-await-in-loop
      await new Promise((resolve) => setTimeout(resolve, 0));
    }
    expect(frames).toBe(pumped);
  });
});
