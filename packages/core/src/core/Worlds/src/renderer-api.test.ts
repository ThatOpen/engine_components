import { describe, expect, it, vi } from "vitest";
import { createThreeRenderer, RendererNamespace } from "./renderer-api";

// Leaf module only (no barrels), and a fake `three` namespace: the test
// decides what the application's `three` resolved to and checks which
// renderer class SimpleRenderer's construction picks.
const namespace = (members: Partial<RendererNamespace> = {}) => {
  const WebGLRenderer = vi.fn(function WebGLRenderer(this: any, options: any) {
    this.options = options;
  });
  const WebGPURenderer = vi.fn(function WebGPURenderer(
    this: any,
    options: any,
  ) {
    this.options = options;
  });
  return {
    REVISION: "185",
    UnsignedByteType: 1009,
    WebGLRenderer,
    WebGPURenderer,
    ...members,
  };
};

describe("SimpleRenderer GPU API (opt-in WebGPU)", () => {
  it("builds today's WebGLRenderer when no mode is given", () => {
    // Even a namespace that also ships WebGPURenderer: no automatic switch.
    const three = namespace();
    const { api, renderer } = createThreeRenderer(three);
    expect(api).toBe("webgl");
    expect(three.WebGLRenderer).toHaveBeenCalledTimes(1);
    expect(three.WebGPURenderer).not.toHaveBeenCalled();
    expect((renderer as any).options).toEqual({ antialias: true, alpha: true });
  });

  it("passes WebGL parameters through unchanged, without `mode`", () => {
    const three = namespace();
    const { api, renderer } = createThreeRenderer(three, {
      mode: "webgl",
      alpha: false,
      logarithmicDepthBuffer: true,
    });
    expect(api).toBe("webgl");
    expect(three.WebGPURenderer).not.toHaveBeenCalled();
    expect((renderer as any).options).toEqual({
      antialias: true,
      alpha: false,
      logarithmicDepthBuffer: true,
    });
  });

  it("works on a classic three that has no WebGPURenderer at all", () => {
    const three = namespace({ WebGPURenderer: undefined, REVISION: "182" });
    expect(createThreeRenderer(three).api).toBe("webgl");
  });

  it('builds a WebGPURenderer only for mode: "webgpu"', () => {
    const three = namespace();
    const { api, renderer } = createThreeRenderer(three, { mode: "webgpu" });
    expect(api).toBe("webgpu");
    expect(three.WebGLRenderer).not.toHaveBeenCalled();
    expect(three.WebGPURenderer).toHaveBeenCalledTimes(1);
    expect((renderer as any).options).toMatchObject({
      antialias: false,
      alpha: false,
      outputBufferType: 1009,
    });
  });

  it('refuses mode: "webgpu" when three resolved to the classic build', () => {
    const three = namespace({ WebGPURenderer: undefined });
    expect(() => createThreeRenderer(three, { mode: "webgpu" })).toThrow(
      /three\/webgpu/,
    );
    expect(three.WebGLRenderer).not.toHaveBeenCalled();
  });

  it('refuses mode: "webgpu" on three older than r185', () => {
    const three = namespace({ REVISION: "184" });
    expect(() => createThreeRenderer(three, { mode: "webgpu" })).toThrow(
      /r185/,
    );
    expect(three.WebGPURenderer).not.toHaveBeenCalled();
  });

  it("refuses to guess when three is the WebGPU build and no mode is given", () => {
    const three = namespace({ WebGLRenderer: undefined });
    expect(() => createThreeRenderer(three)).toThrow(/mode: "webgpu"/);
    expect(three.WebGPURenderer).not.toHaveBeenCalled();
  });
});
