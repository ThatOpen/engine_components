// @vitest-environment happy-dom
import { afterEach, describe, expect, it, vi } from "vitest";
import * as THREE from "three";
import * as OBC from "@thatopen/components";
import {
  DeferredPipeline,
  Postproduction,
  PostproductionAspect,
  PostproductionMode,
} from "../src";
import type { OcclusionPass } from "../src";
import type { PostproductionRenderer } from "..";

// No GPU here: the deferred pipeline is only CONSTRUCTED (render targets,
// textures and shader materials are plain three objects until a WebGLRenderer
// uploads them), never rendered. The renderer, world and fragments are stubs
// that record what they are asked to do.

// three hands out texture and material ids from global counters, so the
// difference between two fresh ids is exactly how many were created between
// them, whoever created them.
const nextTextureId = () => {
  const t = new THREE.Texture();
  t.dispose();
  return t.id;
};
const nextMaterialId = () => {
  const m = new THREE.MeshBasicMaterial();
  m.dispose();
  return m.id;
};
const created = (before: { tex: number; mat: number }) => ({
  // -1: the probe itself
  textures: nextTextureId() - before.tex - 1,
  materials: nextMaterialId() - before.mat - 1,
});
const mark = () => ({ tex: nextTextureId(), mat: nextMaterialId() });

const setup = () => {
  const materials = {
    setCaptureEmission: vi.fn(),
    setCapturePixels: vi.fn(),
  };
  const fragments = { core: { models: { materials } } };
  const components = {
    get: vi.fn(() => fragments),
  } as unknown as OBC.Components;
  const renderer = {
    three: {
      domElement: { width: 640, height: 480 },
      getClearColor: (c: THREE.Color) => c,
      getClearAlpha: () => 0,
      setClearColor: () => {},
    },
    applyPostproductionSize: vi.fn(),
    currentWorld: {
      scene: { three: new THREE.Scene() },
      camera: { three: new THREE.PerspectiveCamera() },
    },
  } as unknown as PostproductionRenderer;
  const post = new Postproduction(components, renderer);
  return { post, renderer, components, materials };
};

afterEach(() => {
  vi.restoreAllMocks();
});

describe("Postproduction default (COMPOSER) path", () => {
  it("creates nothing of the deferred pipeline", () => {
    const resize = vi.spyOn(DeferredPipeline.prototype, "setSize");
    const before = mark();
    const { post, components, materials } = setup();
    expect(post.mode).toBe(PostproductionMode.COMPOSER);
    post.style = PostproductionAspect.COLOR_PEN_SHADOWS;
    post.setSize(800, 600);
    post.mode = PostproductionMode.COMPOSER;
    post.update();
    post.updateOverlayOnly();
    post.captureChunk(true);
    post.finishChunks();
    post.dispose();
    // No pipeline, no render targets / textures / materials, no fragments hooks.
    expect(post.deferredDepthTexture).toBeUndefined();
    expect(created(before)).toEqual({ textures: 0, materials: 0 });
    expect(resize).not.toHaveBeenCalled();
    expect(materials.setCaptureEmission).not.toHaveBeenCalled();
    expect(materials.setCapturePixels).not.toHaveBeenCalled();
    expect(components.get).not.toHaveBeenCalled();
  });

  it("capture emitters and occlusion passes stay inert while COMPOSER", () => {
    const { post } = setup();
    const emitter = vi.fn();
    const pass: OcclusionPass = vi.fn();
    post.addCaptureEmitter(emitter);
    post.addOcclusionPass(pass, true);
    expect(emitter).not.toHaveBeenCalled();
    expect(post.deferredDepthTexture).toBeUndefined();
    post.dispose();
    expect(pass).not.toHaveBeenCalled();
  });
});

describe("Postproduction DEFERRED lifecycle", () => {
  it("switching to DEFERRED creates the pipeline and back releases it", () => {
    const { post, renderer, materials } = setup();
    const before = mark();
    post.mode = PostproductionMode.DEFERRED;
    const pipeline = post.deferred;
    expect(pipeline).toBeInstanceOf(DeferredPipeline);
    expect(post.deferredDepthTexture).toBe(pipeline.depthTexture);
    const counts = created(before);
    expect(counts.textures).toBeGreaterThan(0);
    expect(counts.materials).toBeGreaterThan(0);
    console.info(`deferred switch-on: ${counts.textures} textures, ${counts.materials} materials`);
    expect(renderer.applyPostproductionSize).toHaveBeenCalledTimes(1);
    expect(materials.setCaptureEmission).toHaveBeenLastCalledWith(true);
    // Same instance while the mode stays.
    post.mode = PostproductionMode.DEFERRED;
    expect(post.deferred).toBe(pipeline);

    const disposed = vi.fn();
    pipeline.depthTexture.addEventListener("dispose", disposed);
    const dispose = vi.spyOn(pipeline, "dispose");
    post.mode = PostproductionMode.COMPOSER;
    expect(dispose).toHaveBeenCalledTimes(1);
    expect(disposed).toHaveBeenCalledTimes(1);
    expect(post.deferredDepthTexture).toBeUndefined();
    expect(materials.setCaptureEmission).toHaveBeenLastCalledWith(false);
  });

  it("keeps the pipeline's settings across a COMPOSER round trip", () => {
    const { post } = setup();
    post.mode = PostproductionMode.DEFERRED;
    post.deferred.settings.fxaaEnabled = false;
    post.deferred.composite.settings.contourEnabled = true;
    const first = post.deferred;
    post.mode = PostproductionMode.COMPOSER;
    post.mode = PostproductionMode.DEFERRED;
    expect(post.deferred).not.toBe(first);
    expect(post.deferred.settings.fxaaEnabled).toBe(false);
    post.dispose();
  });

  it("maps the style onto the composite's cues", () => {
    const { post } = setup();
    post.mode = PostproductionMode.DEFERRED;
    post.style = PostproductionAspect.PEN_SHADOWS;
    const d = post.deferred;
    expect(d.composite.settings.colorEnabled).toBe(false);
    expect(d.composite.settings.contourEnabled).toBe(true);
    expect(d.settings.aoEnabled).toBe(true);
    const styles: PostproductionAspect[] = [];
    post.onStyleChanged.add((s) => styles.push(s));
    post.style = PostproductionAspect.COLOR;
    expect(d.composite.settings.colorEnabled).toBe(true);
    expect(d.composite.settings.contourEnabled).toBe(false);
    expect(d.settings.aoEnabled).toBe(false);
    expect(styles).toEqual([PostproductionAspect.COLOR]);
    post.dispose();
  });

  it("setSize reaches the pipeline", () => {
    const { post } = setup();
    post.mode = PostproductionMode.DEFERRED;
    const setSize = vi.spyOn(post.deferred, "setSize");
    post.setSize(320, 200);
    expect(setSize).toHaveBeenCalledWith(320, 200);
    post.dispose();
  });

  it("capture emitters register, unregister and follow the session", () => {
    const { post } = setup();
    const a = vi.fn();
    const b = vi.fn(() => {
      throw new Error("broken emitter");
    });
    post.addCaptureEmitter(a);
    post.addCaptureEmitter(b);
    post.addCaptureEmitter(a); // idempotent
    expect(post.captureEmitters.size).toBe(2);
    post.mode = PostproductionMode.DEFERRED;
    expect(a).toHaveBeenLastCalledWith(true);
    // A late emitter is switched on at once.
    const late = vi.fn();
    post.addCaptureEmitter(late);
    expect(late).toHaveBeenCalledWith(true);
    post.removeCaptureEmitter(late);
    expect(late).toHaveBeenLastCalledWith(false);
    expect(post.captureEmitters.has(late)).toBe(false);
    post.removeCaptureEmitter(late); // no-op
    expect(late).toHaveBeenCalledTimes(2);
    // A throwing emitter does not stop the others.
    a.mockClear();
    post.mode = PostproductionMode.COMPOSER;
    expect(a).toHaveBeenCalledWith(false);
    post.removeCaptureEmitter(b); // throws inside, swallowed
    expect(post.captureEmitters.size).toBe(1);
    post.dispose();
  });

  it("occlusion passes register and unregister", () => {
    const { post } = setup();
    const p1: OcclusionPass = vi.fn();
    const p2: OcclusionPass = vi.fn();
    post.addOcclusionPass(p1);
    post.addOcclusionPass(p2, true);
    post.addOcclusionPass(p1); // idempotent
    expect([...post.occlusionPasses]).toEqual([
      [p1, { direct: false }],
      [p2, { direct: true }],
    ]);
    post.setOcclusionDirect(p1, true);
    expect(post.occlusionPasses.get(p1)).toEqual({ direct: true });
    post.removeOcclusionPass(p1);
    post.removeOcclusionPass(p1); // no-op
    expect([...post.occlusionPasses.keys()]).toEqual([p2]);
    post.dispose();
  });

  it("dispose releases the pipeline, emission and registrations", () => {
    const { post, materials } = setup();
    const emitter = vi.fn();
    post.addCaptureEmitter(emitter);
    post.addOcclusionPass(vi.fn());
    post.mode = PostproductionMode.DEFERRED;
    const pipeline = post.deferred;
    const dispose = vi.spyOn(pipeline, "dispose");
    const released: string[] = [];
    pipeline.capture.target.renderTarget.addEventListener("dispose", () =>
      released.push("G-buffer"),
    );
    pipeline.capture.target.depthTexture.addEventListener("dispose", () =>
      released.push("depth"),
    );
    const targetDisposes = vi.spyOn(THREE.RenderTarget.prototype, "dispose");
    post.dispose();
    expect(dispose).toHaveBeenCalledTimes(1);
    expect(released.sort()).toEqual(["G-buffer", "depth"]);
    // Every render target the pipeline holds is released.
    expect(targetDisposes.mock.calls.length).toBeGreaterThan(1);
    console.info(`deferred dispose: ${targetDisposes.mock.calls.length} render targets released`);
    expect(emitter).toHaveBeenLastCalledWith(false);
    expect(materials.setCaptureEmission).toHaveBeenLastCalledWith(false);
    expect(post.captureEmitters.size).toBe(0);
    expect(post.occlusionPasses.size).toBe(0);
    expect(post.deferredDepthTexture).toBeUndefined();
  });

  it("works with a fragments build that has no capture hooks", () => {
    const { post, components } = setup();
    (components.get as ReturnType<typeof vi.fn>).mockReturnValue({});
    expect(() => {
      post.mode = PostproductionMode.DEFERRED;
      post.mode = PostproductionMode.COMPOSER;
    }).not.toThrow();
    (components.get as ReturnType<typeof vi.fn>).mockImplementation(() => {
      throw new Error("not ready");
    });
    expect(() => {
      post.mode = PostproductionMode.DEFERRED;
      post.dispose();
    }).not.toThrow();
  });
});
