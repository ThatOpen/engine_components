// @vitest-environment happy-dom
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import * as THREE from "three";
import * as OBC from "@thatopen/components";
import { PostproductionRenderer } from "./index";
import { PostproductionAspect } from "./src";

// The WebGL side cannot run here, so `update` runs on an instance whose
// renderer, world and postproduction are stubs that log what they are asked
// to do.
const setup = (mode: OBC.RendererMode) => {
  const log: string[] = [];
  const postproduction = {
    _enabled: false,
    get enabled() {
      return this._enabled;
    },
    set enabled(value: boolean) {
      this._enabled = value;
      log.push(`enabled=${value}`);
    },
    style: PostproductionAspect.COLOR,
    onStyleChanged: { enabled: true },
    update: () => log.push("composer"),
    dispose: () => log.push("postproduction.dispose"),
  };
  const renderer = Object.create(
    PostproductionRenderer.prototype,
  ) as PostproductionRenderer;
  Object.assign(renderer, {
    // Defaults of the class fields.
    manualDefaultStyle: PostproductionAspect.COLOR,
    turnOffOnManualMode: true,
    manualModeDelay: 50,
    _previousStyle: PostproductionAspect.COLOR,
    _previousEnabled: false,
    _timeout: null,
    // Stubs.
    _postproduction: postproduction,
    enabled: true,
    mode,
    needsUpdate: true,
    currentWorld: {
      scene: { three: new THREE.Scene() },
      camera: { three: new THREE.PerspectiveCamera() },
    },
    onBeforeUpdate: new OBC.Event(),
    onAfterUpdate: new OBC.Event(),
    three: { render: () => log.push("three.render") },
    three2D: { render: () => {} },
  });
  const paint = () => {
    renderer.needsUpdate = true;
    renderer.update();
  };
  const take = () => log.splice(0);
  return { renderer, postproduction, paint, take };
};

beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
  vi.restoreAllMocks();
});

describe("PostproductionRenderer MANUAL deferred frame (#833)", () => {
  it("restores postproduction after an orbit and draws the composer once", () => {
    const t = setup(OBC.RendererMode.MANUAL);
    t.postproduction._enabled = true;
    t.paint();
    vi.advanceTimersByTime(10);
    t.paint();
    vi.advanceTimersByTime(10);
    t.paint();
    expect(t.take()).toEqual([
      "enabled=false",
      "three.render",
      "three.render",
      "three.render",
    ]);
    vi.advanceTimersByTime(50);
    expect(t.take()).toEqual(["enabled=true", "composer"]);
    expect(t.postproduction.enabled).toBe(true);
  });

  it("keeps postproduction off once the app turns it off", () => {
    const t = setup(OBC.RendererMode.MANUAL);
    t.postproduction._enabled = true;
    t.paint();
    vi.advanceTimersByTime(50);
    t.take();
    t.postproduction.enabled = false;
    t.take();
    t.paint();
    vi.advanceTimersByTime(50);
    expect(t.postproduction.enabled).toBe(false);
    expect(t.take()).not.toContain("composer");
  });

  it("does not draw the composer while disabled (turnOffOnManualMode = false)", () => {
    const t = setup(OBC.RendererMode.MANUAL);
    t.renderer.turnOffOnManualMode = false;
    t.paint();
    vi.advanceTimersByTime(50);
    expect(t.take()).toEqual(["three.render"]);
  });

  it("still draws the composer when enabled (turnOffOnManualMode = false)", () => {
    const t = setup(OBC.RendererMode.MANUAL);
    t.renderer.turnOffOnManualMode = false;
    t.postproduction._enabled = true;
    t.paint();
    vi.advanceTimersByTime(50);
    expect(t.take()).toEqual(["composer", "composer"]);
  });

  it("dispose() cancels the pending deferred frame", () => {
    const t = setup(OBC.RendererMode.MANUAL);
    t.postproduction._enabled = true;
    const base = Object.getPrototypeOf(PostproductionRenderer.prototype);
    vi.spyOn(base, "dispose").mockImplementation(() => {});
    t.paint();
    t.take();
    t.renderer.dispose();
    vi.advanceTimersByTime(50);
    expect(t.take()).toEqual(["postproduction.dispose"]);
    expect(vi.getTimerCount()).toBe(0);
  });
});

describe("PostproductionRenderer AUTO mode", () => {
  it("draws once per frame and schedules nothing", () => {
    const t = setup(OBC.RendererMode.AUTO);
    t.postproduction._enabled = true;
    t.paint();
    t.paint();
    expect(vi.getTimerCount()).toBe(0);
    expect(t.take()).toEqual(["composer", "composer"]);
    t.postproduction.enabled = false;
    t.take();
    t.paint();
    expect(vi.getTimerCount()).toBe(0);
    expect(t.take()).toEqual(["three.render"]);
  });
});
