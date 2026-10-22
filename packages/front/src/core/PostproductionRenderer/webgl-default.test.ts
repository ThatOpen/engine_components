// @vitest-environment happy-dom
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

// A fake GPU: `three` keeps everything but its two renderers, which record
// how they were built. The namespace ships a WebGPURenderer on purpose, as
// `three/webgpu` would: without `mode: "webgpu"` it must never be touched.
const built = vi.hoisted(() => ({
  webgl: [] as any[],
  webgpu: [] as any[],
}));

vi.mock("three", async (importOriginal) => {
  const actual = await importOriginal<typeof import("three")>();
  class FakeRenderer {
    options: any;
    domElement = document.createElement("canvas");
    clippingPlanes: any[] = [];
    localClippingEnabled = false;
    shadowMap = { enabled: false };
    capabilities = { maxSamples: 4 };
    constructor(options: any) {
      this.options = options;
    }
    setPixelRatio() {}
    getPixelRatio() {
      return 1;
    }
    setSize() {}
    getSize(target: any) {
      return target.set(0, 0);
    }
    getContext() {
      return { canvas: this.domElement };
    }
    render() {}
    setClearAlpha() {}
    init() {
      return Promise.resolve();
    }
    dispose() {}
    forceContextLoss() {}
  }
  class WebGLRenderer extends FakeRenderer {
    constructor(options: any) {
      super(options);
      built.webgl.push(this);
    }
  }
  class WebGPURenderer extends FakeRenderer {
    constructor(options: any) {
      super(options);
      built.webgpu.push(this);
    }
  }
  // r185, so the opt-in path can be built here too (the dev three is 0.184).
  return { ...actual, REVISION: "185", WebGLRenderer, WebGPURenderer };
});

// eslint-disable-next-line import/first
import * as OBC from "@thatopen/components";
// eslint-disable-next-line import/first
import { PostproductionRenderer } from "./index";

beforeEach(() => {
  built.webgl.length = 0;
  built.webgpu.length = 0;
  if (typeof (globalThis as any).ResizeObserver === "undefined") {
    vi.stubGlobal(
      "ResizeObserver",
      class {
        observe() {}
        disconnect() {}
      },
    );
  }
});

afterEach(() => {
  vi.unstubAllGlobals();
});

const create = (parameters?: OBC.SimpleRendererParameters) => {
  const container = document.createElement("div");
  document.body.appendChild(container);
  const components = {} as OBC.Components;
  return new PostproductionRenderer(components, container, parameters);
};

describe("PostproductionRenderer without `mode` (WebGL default)", () => {
  it("builds a WebGLRenderer with today's arguments and nothing of WebGPU", () => {
    const renderer = create();
    expect(renderer.api).toBe("webgl");
    expect(built.webgpu).toHaveLength(0);
    expect(built.webgl).toHaveLength(1);
    expect(built.webgl[0].options).toEqual({ antialias: true, alpha: true });
    expect(renderer.three).toBe(built.webgl[0]);
    // None of the WebGPU objects exists.
    expect(renderer.pipeline).toBeNull();
    expect((renderer as any)._webgpuPostproduction).toBeUndefined();
    expect((renderer as any)._composition).toBeNull();
    expect(renderer.pipelineStats).toEqual({ compiled: 0, disposed: 0 });
    // The WebGL surface is as before: no postproduction until a world.
    expect(() => renderer.postproduction).toThrow(
      "Renderer not initialized yet with a world!",
    );
  });

  it('treats an explicit mode: "webgl" the same', () => {
    const renderer = create({ mode: "webgl", alpha: false });
    expect(renderer.api).toBe("webgl");
    expect(built.webgpu).toHaveLength(0);
    expect(built.webgl[0].options).toEqual({ antialias: true, alpha: false });
    expect((renderer as any)._webgpuPostproduction).toBeUndefined();
  });

  it("is the only path that builds the WebGPU objects", () => {
    const renderer = create({ mode: "webgpu" });
    expect(renderer.api).toBe("webgpu");
    expect(built.webgl).toHaveLength(0);
    expect(built.webgpu).toHaveLength(1);
  });
});
