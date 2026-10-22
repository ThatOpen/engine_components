import * as THREE from "three";
import * as OBC from "@thatopen/components";
// From the leaf module, not "./index": that file is part of an import cycle
// with "..", and the `mode` field below initializes from the enum. See the
// note in ./modes.ts for the TypeError this prevents.
import { PostproductionAspect, PostproductionMode } from "./modes";
import type { OcclusionPass } from "./index";
import { EdgeDetectionPassMode } from "./edge-detection-pass";
import { DeferredAoMode } from "../deferred/pipeline-v2";
import {
  defaultCompositeSettings,
  CompositeSettings,
} from "../deferred/combined-composite-pass";
import { defaultAoSettings } from "../deferred/screen-space-ao-pass";
import { defaultWorldAoSettings } from "../deferred/world-space-ao-pass";
import { defaultDenoiseSettings } from "../deferred/ao-denoise-pass";
import { WebGPUOutlinePass } from "./webgpu-outline-pass";

/**
 * The host this surface drives: the renderer that owns the WebGPU pipeline.
 * Kept structural so this file does not import the renderer class back.
 */
export interface WebGPUPostproductionHost {
  /** Set to ask for a frame; the host remounts the pipeline when it has to. */
  needsUpdate: boolean;
}

/**
 * How far the contour looks for a seed, the one part of the line width the
 * WebGPU composite compiles in: the first of these steps that covers the band's
 * outer edge. The width itself is a uniform there, so a width that stays inside
 * its step does not remount.
 * ⚠️ A copy of `lineRadius` in fragments' `deferred-look.mjs`; keep them the same.
 */
const LINE_STEPS = [1, Math.SQRT2, 2, 3, 4, 5, 6];
function lineRadius(outer: number) {
  for (const step of LINE_STEPS) if (outer <= step) return step;
  return LINE_STEPS[LINE_STEPS.length - 1];
}

/** What a mounted WebGPU pipeline compiled in (see `mountComposition`). */
interface CompiledPipeline {
  colorEnabled: boolean;
  contourEnabled: boolean;
  reach: number;
  ao: boolean;
  fxaa: boolean;
  edges: boolean;
  depthOverlays: boolean;
  flatOverlays: boolean;
  /** Whether the scene pass carries a normal channel (only when tonal shading, gloss or fresnel need it). */
  normal: boolean;
  /** Whether the face id channel is an 8-bit red target. */
  faceR8: boolean;
  /** Whether the outline stage (mask pass + composite tap) is compiled in. */
  outlines: boolean;
  /** One letter per occlusion seam, in registration order ("d" direct, "l" layer). */
  seams: string;
  /** Whether what the view says (its crop, sky and sun) is compiled in. */
  view?: boolean;
  /** The side of the sun's target, 0 when no view has stated a sun. */
  sunMost?: number;
}

/**
 * `renderer.postproduction` under the WebGPU build.
 *
 * 🔴 THE SAME API, SO APP CODE DOES NOT BRANCH ON THE ENGINE. The WebGL
 * `Postproduction` is an EffectComposer chain plus a deferred pipeline, and
 * none of its GLSL pass objects can exist under WebGPU. Before this, the
 * getter threw, so every app and every component that touched it had to guard
 * it, and the WebGPU frame was hard-wired to colour + contour + AO whatever
 * was asked for.
 *
 * Under WebGPU the look is always the WebGL DEFERRED one (Antonio's decision,
 * 2026-09-13), whatever `mode` says. `style` resolves to the three switches
 * WebGL's `_applyDeferredStyle` sets, and `deferred.composite.settings` IS the
 * TSL composite's settings object, with the WebGL names and defaults, read
 * live every frame. A change to what has to be compiled (colour or paper, ink,
 * AO, FXAA, the line's reach) is picked up by the host on its next frame,
 * which rebuilds the composition.
 *
 * ⚠️ WHAT IS INERT, SAID HERE RATHER THAN PRETENDED: `deferred.ao`,
 * `deferred.worldAo` and `deferred.denoise` settings (the WebGPU AO is the
 * composition's own estimator with its own constants), `aoMode`, `aoHalfRes`,
 * `renderScale`, the composer-mode passes (`aoPass`, `edgesPass`, `glossPass`,
 * `excludedObjectsPass`). `basePass.isolatedMaterials` is NOT inert: those
 * materials are drawn as WebGL draws them, as overlays over the finished frame. They accept the calls apps and
 * components make, so those do not crash, and nothing under WebGPU reads them
 * yet.
 */
export class WebGPUPostproduction {
  readonly onStyleChanged = new OBC.Event<PostproductionAspect>();

  /** Stored for API compatibility; the WebGPU look is always DEFERRED. */
  mode = PostproductionMode.DEFERRED;

  /** The deferred pipeline's settings, shaped and defaulted as under WebGL. */
  readonly deferred = {
    settings: {
      aoEnabled: true,
      aoMode: DeferredAoMode.SCREEN_SPACE,
      fxaaEnabled: true,
      // What the view being drawn says, as under WebGL (`DeferredPipelineSettings`): read live by the
      // composition, so a caller that draws several views sets them per pass. The crop and the background
      // and the sun are drawn; `overTheTarget` is stored and not read yet.
      sunShadow: null as unknown,
      background: null as unknown,
      crop: null as unknown,
      overTheTarget: false,
    },
    // The capture's switches, as under WebGL (`SurfaceCapturePass`), read live by the scene's pass:
    // `translucentAsOpaque` draws a line view's glass as a surface.
    capture: { translucentAsOpaque: false },
    aoHalfRes: true,
    renderScale: 1,
    ao: { settings: { ...defaultAoSettings } },
    worldAo: { settings: { ...defaultWorldAoSettings } },
    denoise: { settings: { ...defaultDenoiseSettings } },
    composite: {
      settings: {
        ...defaultCompositeSettings,
        edgeColor: defaultCompositeSettings.edgeColor.clone(),
        paperColor: defaultCompositeSettings.paperColor.clone(),
        sheenColor: defaultCompositeSettings.sheenColor.clone(),
      } as CompositeSettings,
    },
  };

  /** No WebGL depth attachment exists under WebGPU. */
  readonly deferredDepthTexture: THREE.Texture | undefined = undefined;

  readonly basePass = { isolatedMaterials: [] as THREE.Material[] };

  readonly excludedObjectsPass = {
    addExcludedMaterial: (_material: THREE.Material) => {},
    removeExcludedMaterial: (_material: THREE.Material) => {},
  };

  readonly edgesPass = {
    width: 1,
    color: new THREE.Color(0x000000),
    mode: EdgeDetectionPassMode.DEFAULT,
  };

  readonly glossPass = {
    minGloss: 0,
    maxGloss: 0,
    glossExponent: 1,
    fresnelExponent: 1,
    glossFactor: 0,
    fresnelFactor: 0,
  };

  readonly aoPass = {
    blendIntensity: 1,
    updateGtaoMaterial: (_parameters: unknown) => {},
    updatePdMaterial: (_parameters: unknown) => {},
  };

  defaultAoParameters = {
    radius: 0.25,
    distanceExponent: 5.7,
    thickness: 10,
    scale: 2,
    samples: 16,
    distanceFallOff: 1,
    screenSpaceRadius: true,
  };

  /**
   * The REAL outline pass under WebGPU (mask scene + palette; the mounted
   * composition draws it). Opt-in by construction: the outline stage is only
   * compiled into the pipeline while `outlinesEnabled` is on AND something is
   * actually outlined ({@link WebGPUOutlinePass.active}); otherwise the frame
   * carries no mask target and no composite taps.
   */
  readonly outlinePass = new WebGPUOutlinePass();

  /** Materials hidden from the postproduction, as in WebGL. Not read yet under WebGPU. */
  readonly invisibleMaterials = new Set<THREE.Material>();

  outlinesEnabled = false;
  excludedObjectsEnabled = false;
  glossEnabled = false;
  smaaEnabled = false;

  private _style = PostproductionAspect.COLOR;
  private _enabled = false;
  private readonly _host: WebGPUPostproductionHost;
  private readonly _occlusionPasses = new Map<OcclusionPass, boolean>();

  constructor(host: WebGPUPostproductionHost) {
    this._host = host;
    this._applyStyle(this._style);
  }

  /**
   * Whether the composition draws. Off draws the scene plainly, which is what
   * WebGL does with postproduction disabled.
   */
  get enabled() {
    return this._enabled;
  }

  set enabled(value: boolean) {
    this._enabled = value;
    this._host.needsUpdate = true;
  }

  get style() {
    return this._style;
  }

  set style(value: PostproductionAspect) {
    this._style = value;
    this._applyStyle(value);
    this._host.needsUpdate = true;
    this.onStyleChanged.trigger(value);
  }

  /**
   * The occlusion seam, as under WebGL: a loader that keeps its own scene (a
   * point cloud, a splat cloud) hands over a callback, and the composition
   * fires it over the finished frame, occluded by the BIM depth.
   *
   * Which passes are registered is COMPILED into the pipeline (each one is a
   * layer with its own target), so registering or removing one remounts on the
   * next frame — hence the `needsUpdate`.
   */
  addOcclusionPass(pass: OcclusionPass, direct = true) {
    this._occlusionPasses.set(pass, direct);
    this._host.needsUpdate = true;
  }

  removeOcclusionPass(pass: OcclusionPass) {
    if (this._occlusionPasses.delete(pass)) this._host.needsUpdate = true;
  }

  setOcclusionDirect(pass: OcclusionPass, direct: boolean) {
    if (!this._occlusionPasses.has(pass)) return;
    if (this._occlusionPasses.get(pass) === direct) return;
    this._occlusionPasses.set(pass, direct);
    this._host.needsUpdate = true;
  }

  /** What the mounted pipeline compiled its seams as (see {@link CompiledPipeline.seams}). */
  private _seamSignature() {
    let signature = "";
    for (const direct of this._occlusionPasses.values()) {
      signature += direct ? "d" : "l";
    }
    return signature;
  }

  /** WebGL keeps its passes pointed at the camera; the WebGPU host remounts on camera change on its own. */
  updateCamera() {}

  /** The WebGPU pipeline sizes itself from the renderer. */
  setSize(_width: number, _height: number) {}

  /**
   * The options the host mounts the composition with: its own knobs, with the
   * settings this surface owns taking over where both speak.
   */
  mountOptions(knobs: Record<string, any>) {
    return {
      ...knobs,
      composite: this.deferred.composite.settings,
      view: this._viewSaid() ? this.deferred.settings : null,
      sunMost: this._sunMost,
      capture: this.deferred.capture,
      overlays: this.basePass.isolatedMaterials,
      ao: knobs.ao !== false && this.deferred.settings.aoEnabled,
      fxaa: knobs.fxaa !== false && this.deferred.settings.fxaaEnabled,
      // Opt-in, sticky after first use: the stage is handed over (and
      // compiled) once anything has EVER been outlined while enabled — see
      // `WebGPUOutlinePass.everActive` for why not `active` (a remount per
      // Clear ↔ Outline flip was a second-long hitch each way).
      outline:
        this.outlinesEnabled && this.outlinePass.everActive
          ? this.outlinePass
          : null,
      seams: [...this._occlusionPasses].map(([pass, direct]) => ({
        pass,
        direct,
      })),
    };
  }

  /** Whether a mounted pipeline no longer compiles what the settings ask for. */
  needsRemount(compiled: CompiledPipeline | undefined, knobs: Record<string, any>) {
    if (!compiled) return true;
    const look = this.deferred.composite.settings;
    const { settings } = this.deferred;
    // Which overlay layers exist is compiled in; the materials inside them are read every frame.
    const overlays = this.basePass.isolatedMaterials;
    const depthOverlays = overlays.some((m) => m.depthTest !== false);
    const flatOverlays = overlays.some((m) => m.depthTest === false);
    return (
      compiled.depthOverlays !== depthOverlays ||
      compiled.flatOverlays !== flatOverlays ||
      compiled.colorEnabled !== look.colorEnabled ||
      compiled.contourEnabled !== look.contourEnabled ||
      compiled.normal !== (look.tonalShadingEnabled === true || look.glossFactor > 0 || look.fresnelFactor > 0) ||
      compiled.faceR8 !== (knobs.faceR8 === true) ||
      compiled.reach !== lineRadius(look.edgeHalfWidth + look.edgeAA) ||
      compiled.ao !== (knobs.ao !== false && settings.aoEnabled) ||
      compiled.fxaa !== (knobs.fxaa !== false && settings.fxaaEnabled) ||
      compiled.edges !== (knobs.edges !== false) ||
      // The outline stage compiles in on the FIRST outline ever (opt-in) and
      // then sticks while enabled — see `WebGPUOutlinePass.everActive`.
      compiled.outlines !==
        (this.outlinesEnabled && this.outlinePass.everActive) ||
      compiled.seams !== this._seamSignature() ||
      !!compiled.view !== this._viewSaid() ||
      (compiled.sunMost ?? 0) !== this._sunMost
    );
  }

  private _viewEverSaid = false;
  private _sunMost = 0;

  /**
   * Whether the host has ever stated a crop, a sky or a sun for a view. Opt-in, and sticky after the first:
   * an app that draws one scene pays for none of it, and a canvas that draws many views, some with a sky and
   * some without, does not remount between them.
   */
  private _viewSaid() {
    const { settings } = this.deferred;
    if (settings.crop || settings.background || settings.sunShadow) this._viewEverSaid = true;
    // The sun's target is allocated whole, at the finest map any view has asked for: only once one has.
    const sun = settings.sunShadow as { resolution?: number } | null;
    if (sun) this._sunMost = Math.max(this._sunMost, Math.round(sun.resolution ?? 4096));
    return this._viewEverSaid;
  }

  dispose() {
    this.onStyleChanged.reset();
    this._occlusionPasses.clear();
  }

  /** The same three switches WebGL's `_applyDeferredStyle` sets. FXAA is left to the user, as there. */
  private _applyStyle(value: PostproductionAspect) {
    const A = PostproductionAspect;
    const withColor =
      value === A.COLOR ||
      value === A.COLOR_PEN ||
      value === A.COLOR_SHADOWS ||
      value === A.COLOR_PEN_SHADOWS;
    const withInk =
      value === A.PEN ||
      value === A.PEN_SHADOWS ||
      value === A.COLOR_PEN ||
      value === A.COLOR_PEN_SHADOWS;
    const withShadow =
      value === A.PEN_SHADOWS ||
      value === A.COLOR_SHADOWS ||
      value === A.COLOR_PEN_SHADOWS;
    const look = this.deferred.composite.settings;
    look.colorEnabled = withColor;
    look.contourEnabled = withInk;
    this.deferred.settings.aoEnabled = withShadow;
  }
}
