import * as THREE from "three";
import * as OBC from "@thatopen/components";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { GTAOPass } from "three/examples/jsm/postprocessing/GTAOPass.js";
import { AOPass } from "./ao-pass";
import { OutputPass } from "three/examples/jsm/postprocessing/OutputPass.js";
import { SMAAPass } from "three/examples/jsm/postprocessing/SMAAPass.js";
import { EdgeDetectionPass } from "./edge-detection-pass";
import { SimpleOutlinePass } from "./simple-outline-pass";
import { ExcludedObjectsPass } from "./excluded-objects-pass";
import { PostproductionRenderer } from "..";
import { BasePass } from "./base-pass";
import { GlossPass } from "./gloss-pass";
import { DeferredPipeline } from "../deferred";
import type { OcclusionPass } from "../deferred";

// Export the GlossPass for external use
export { GlossPass };
export { AOPass } from "./ao-pass";
export { EdgeDetectionPassMode } from "./edge-detection-pass";
export { DeferredPipeline, DeferredAoMode } from "../deferred";
export type { OcclusionPass, OcclusionPassContext } from "../deferred";

// Declared in a leaf module (see the note there) so that class fields across
// this package can initialize from them without racing the import cycle this
// file is part of. Re-exported here to keep the public surface unchanged.
export { PostproductionAspect, PostproductionMode } from "./modes";
import { PostproductionAspect, PostproductionMode } from "./modes";

export class Postproduction {
  invisibleMaterials = new Set<THREE.Material>();
  composer?: EffectComposer;

  /**
   * Registry of forward occlusion passes (e.g. a splat layer and a point-cloud
   * direct draw) that COEXIST: each producer registers its own entry keyed by
   * its pass fn, so neither clobbers the other. The deferred pipeline runs EVERY
   * entry (DIRECT into the frame, LAYER premultiplied-over). Only consulted in
   * DEFERRED mode.
   */
  readonly occlusionPasses = new Map<OcclusionPass, { direct: boolean }>();

  /**
   * Register a forward occlusion pass. `direct` true = draw straight into the finished
   * frame (opaque points, self-occluding); false = premultiplied layer composited OVER
   * (transparent splats). Idempotent (keyed by the pass fn).
   */
  addOcclusionPass(pass: OcclusionPass, direct = false) {
    this.occlusionPasses.set(pass, { direct });
  }

  /** Unregister a previously-added occlusion pass (no-op if absent). */
  removeOcclusionPass(pass: OcclusionPass) {
    this.occlusionPasses.delete(pass);
  }

  /** Update a registered pass's direct/layer mode (e.g. a point cloud toggling EDL). */
  setOcclusionDirect(pass: OcclusionPass, direct: boolean) {
    const entry = this.occlusionPasses.get(pass);
    if (entry) entry.direct = direct;
  }

  /**
   * The deferred pipeline's depth attachment (float32), or undefined before the
   * deferred pipeline is allocated. Exposed for a forward occlusion pass to
   * depth-test against.
   */
  get deferredDepthTexture() {
    return this._deferred?.depthTexture;
  }

  readonly onStyleChanged = new OBC.Event<PostproductionAspect>();

  private _enabled = false;
  private _initialized = false;

  private _basePass?: BasePass;
  private _aoPass?: AOPass;
  private _outputPass?: OutputPass;
  private _edgeDetectionPass?: EdgeDetectionPass;
  private _smaaPass?: SMAAPass;
  private _simpleOutlinePass?: SimpleOutlinePass;
  private _excludedObjectsPass?: ExcludedObjectsPass;
  private _glossPass?: GlossPass;
  private _style = PostproductionAspect.COLOR;
  private _outlinesEnabled = false;
  private _glossEnabled = false;
  private _smaaEnabled = false;
  private _excludedObjectsEnabled = false;
  private _msaaEnabled = false;
  private _components: OBC.Components;
  private _renderer: PostproductionRenderer;
  private _clearColor = new THREE.Color();
  private _mode = PostproductionMode.COMPOSER;
  private _deferred?: DeferredPipeline;

  defaultAoParameters = {
    radius: 0.25,
    distanceExponent: 5.7,
    thickness: 10,
    scale: 2,
    samples: 16,
    distanceFallOff: 1,
    screenSpaceRadius: true,
  };

  get basePass() {
    if (!this._basePass) {
      throw new Error("Base pass not initialized");
    }
    return this._basePass;
  }

  get enabled() {
    return this._enabled;
  }

  set enabled(value: boolean) {
    this._enabled = value;
    if (value && !this._initialized) {
      this.initialize();
    }
    if (!value) {
      for (const material of this.basePass.isolatedMaterials) {
        material.visible = true;
      }
    }
  }

  get aoPass() {
    if (!this._aoPass) {
      throw new Error("AO pass not initialized");
    }
    return this._aoPass;
  }

  get outlinePass() {
    if (!this._simpleOutlinePass) {
      throw new Error("Outline pass not initialized");
    }
    return this._simpleOutlinePass;
  }

  get edgesPass() {
    if (!this._edgeDetectionPass) {
      throw new Error("Edge detection pass not initialized");
    }
    return this._edgeDetectionPass;
  }

  get excludedObjectsPass() {
    if (!this._excludedObjectsPass) {
      throw new Error("Excluded objects pass not initialized");
    }
    return this._excludedObjectsPass;
  }

  get glossPass() {
    if (!this._glossPass) {
      throw new Error("Gloss pass not initialized");
    }
    return this._glossPass;
  }

  get outlinesEnabled() {
    return this._outlinesEnabled;
  }

  set outlinesEnabled(value: boolean) {
    this._outlinesEnabled = value;
    this.style = this._style;
  }

  get excludedObjectsEnabled() {
    return this._excludedObjectsEnabled;
  }

  set excludedObjectsEnabled(value: boolean) {
    this._excludedObjectsEnabled = value;
    this.style = this._style;
  }

  get glossEnabled() {
    return this._glossEnabled;
  }

  set glossEnabled(value: boolean) {
    this._glossEnabled = value;
    this.style = this._style;
  }

  get smaaEnabled() {
    return this._smaaEnabled;
  }

  set smaaEnabled(value: boolean) {
    this._smaaEnabled = value;
    this.style = this._style;
  }

  /**
   * Whether the composer's render targets are multisampled. The composer
   * allocates them without multisampling, which drops the MSAA of the default
   * framebuffer the moment postproduction is switched on; turning this on
   * gives them back their samples. Off by default: multisampled targets cost
   * memory and bandwidth on every frame, so this is opt-in and, while off,
   * the targets are exactly the ones postproduction has always allocated.
   */
  get msaaEnabled() {
    return this._msaaEnabled;
  }

  set msaaEnabled(value: boolean) {
    this._msaaEnabled = value;
    this.applySamples();
  }

  get style() {
    return this._style;
  }

  set style(value: PostproductionAspect) {
    // Deferred path: the composite folds every cue into one fullscreen pass, so
    // a style is just a choice of which cues are on (see _applyDeferredStyle)
    // rather than an EffectComposer pass chain.
    if (this._mode === PostproductionMode.DEFERRED) {
      this._style = value;
      this._applyDeferredStyle(value);
      this.onStyleChanged.trigger(value);
      return;
    }
    if (!this.composer) return;
    if (
      !this.composer ||
      !this._basePass ||
      !this._smaaPass ||
      !this._outputPass ||
      !this._aoPass ||
      !this._edgeDetectionPass ||
      !this._simpleOutlinePass ||
      !this._excludedObjectsPass ||
      !this._glossPass
    ) {
      return;
    }

    if (this._style === PostproductionAspect.PEN_SHADOWS) {
      this._aoPass.updateGtaoMaterial(this.defaultAoParameters);
    }

    this._style = value;
    this.clear();

    if (value === PostproductionAspect.COLOR) {
      this.composer.addPass(this._basePass);
      if (this._glossEnabled) {
        this.composer.addPass(this._glossPass);
      }
      if (this._outlinesEnabled) {
        this.composer.addPass(this._simpleOutlinePass);
      }
      if (this._excludedObjectsEnabled) {
        this.composer.addPass(this._excludedObjectsPass);
      }
      if (this._smaaEnabled) {
        this.composer.addPass(this._smaaPass);
      }
      this.composer.addPass(this._outputPass);
    }

    if (value === PostproductionAspect.PEN) {
      this.composer.addPass(this._edgeDetectionPass);
      if (this._outlinesEnabled) {
        this.composer.addPass(this._simpleOutlinePass);
      }
      if (this._excludedObjectsEnabled) {
        this.composer.addPass(this._excludedObjectsPass);
      }
      if (this._smaaEnabled) {
        this.composer.addPass(this._smaaPass);
      }
    }

    if (value === PostproductionAspect.PEN_SHADOWS) {
      this.composer.addPass(this._basePass);
      this.composer.addPass(this._aoPass);
      this._aoPass.output = GTAOPass.OUTPUT.AO;
      this.composer.addPass(this._edgeDetectionPass);
      if (this._outlinesEnabled) {
        this.composer.addPass(this._simpleOutlinePass);
      }
      if (this._excludedObjectsEnabled) {
        this.composer.addPass(this._excludedObjectsPass);
      }
      if (this._smaaEnabled) {
        this.composer.addPass(this._smaaPass);
      }
      this.composer.addPass(this._outputPass);
    }

    if (value === PostproductionAspect.COLOR_PEN) {
      this.composer.addPass(this._basePass);
      if (this._glossEnabled) {
        this.composer.addPass(this._glossPass);
      }
      this.composer.addPass(this._edgeDetectionPass);
      if (this._outlinesEnabled) {
        this.composer.addPass(this._simpleOutlinePass);
      }
      if (this._excludedObjectsEnabled) {
        this.composer.addPass(this._excludedObjectsPass);
      }
      if (this._smaaEnabled) {
        this.composer.addPass(this._smaaPass);
      }
      this.composer.addPass(this._outputPass);
    }

    if (value === PostproductionAspect.COLOR_SHADOWS) {
      this.composer.addPass(this._basePass);
      if (this._glossEnabled) {
        this.composer.addPass(this._glossPass);
      }
      this.composer.addPass(this._aoPass);
      this._aoPass.output = GTAOPass.OUTPUT.Default;
      if (this._outlinesEnabled) {
        this.composer.addPass(this._simpleOutlinePass);
      }
      if (this._excludedObjectsEnabled) {
        this.composer.addPass(this._excludedObjectsPass);
      }
      if (this._smaaEnabled) {
        this.composer.addPass(this._smaaPass);
      }
      this.composer.addPass(this._outputPass);
    }

    if (value === PostproductionAspect.COLOR_PEN_SHADOWS) {
      this.composer.addPass(this._basePass);
      if (this._glossEnabled) {
        this.composer.addPass(this._glossPass);
      }
      this.composer.addPass(this._aoPass);
      this._aoPass.output = GTAOPass.OUTPUT.Default;
      this.composer.addPass(this._edgeDetectionPass);
      if (this._outlinesEnabled) {
        this.composer.addPass(this._simpleOutlinePass);
      }
      if (this._excludedObjectsEnabled) {
        this.composer.addPass(this._excludedObjectsPass);
      }
      if (this._smaaEnabled) {
        this.composer.addPass(this._smaaPass);
      }
      this.composer.addPass(this._outputPass);
    }

    this.onStyleChanged.trigger(value);
  }

  /**
   * Maps a visual style onto the deferred pipeline. The six aspects are just
   * combinations of three cues: shaded colour vs flat paper, contour ink, and AO
   * shadow. We flip the matching gates and leave the per-cue strengths (edge
   * strength, AO radius, etc.) untouched, so a style switch never discards the
   * user's tuning.
   */
  private _applyDeferredStyle(value: PostproductionAspect) {
    if (!this._deferred) return;
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

    const composite = this._deferred.composite.settings;
    composite.colorEnabled = withColor;
    composite.contourEnabled = withInk;
    this._deferred.settings.aoEnabled = withShadow;
    // FXAA is intentionally left untouched here: it is a general anti-aliasing
    // tail, valuable for every style, so it stays user-controlled.
  }

  /**
   * The active rendering pipeline. COMPOSER (the default) runs the
   * EffectComposer style stack; DEFERRED runs the forward + auxiliary-geometry
   * capture pipeline. Switching to DEFERRED allocates its G-buffers; switching
   * back releases them (the pipeline's settings are kept for the next time).
   * While COMPOSER, nothing of the deferred pipeline exists.
   */
  get mode() {
    return this._mode;
  }

  set mode(value: PostproductionMode) {
    const wasDeferred = this._mode === PostproductionMode.DEFERRED;
    this._mode = value;
    if (value === PostproductionMode.DEFERRED) {
      // Touch the getter so the pipeline exists (and is sized) before the next frame.
      void this.deferred;
      // The single-pass capture relies on the surface materials emitting their
      // geometry extras; turn that on for the whole deferred session.
      this.setCaptureEmission(true);
      // Tell the composite which cues are on: a style set while the mode was
      // still COMPOSER only stored `_style` and never reached the pipeline.
      this.style = this._style;
    } else {
      if (wasDeferred) {
        this.setCaptureEmission(false);
        this.releaseDeferred();
      }
      // Rebuild the composer pass stack so it reflects any pass toggles made
      // while deferred was active (outlines, gloss, SMAA, excluded objects). The
      // `style` setter skips the composer build in deferred mode.
      this.style = this._style;
    }
  }

  /**
   * Registry of capture emitters: anything whose materials can write the deferred
   * G-buffer extras (octahedral view normal + packed discriminator) registers its
   * own toggle here, and the pipeline flips every entry for the whole deferred
   * session. The built-in fragments hook still runs, so nothing that works
   * today has to register anything.
   */
  readonly captureEmitters = new Set<(enabled: boolean) => void>();

  /**
   * Register a capture emitter. Idempotent (keyed by the fn). The pipeline calls
   * it with `true` for the duration of a deferred session and `false` on leaving
   * it, and re-asserts `true` every deferred frame — so an emitter registered
   * mid-session is picked up on the next frame, like a late-loaded model.
   */
  addCaptureEmitter(emitter: (enabled: boolean) => void) {
    this.captureEmitters.add(emitter);
    if (this._mode === PostproductionMode.DEFERRED) emitter(true);
  }

  /** Unregister a capture emitter, turning its emission off (no-op if absent). */
  removeCaptureEmitter(emitter: (enabled: boolean) => void) {
    if (!this.captureEmitters.delete(emitter)) return;
    try {
      emitter(false);
    } catch {
      // An emitter that throws on the way out must not strand the pipeline.
    }
  }

  /**
   * Toggles single-pass capture-emission on every registered emitter, plus the
   * fragments surface materials when the installed fragments supports it
   * (duck-typed: with a fragments build without `setCaptureEmission` this
   * captures colour and depth only). Guarded + idempotent — safe to call before
   * any model (and therefore the fragments core) exists; the deferred frame
   * re-asserts it so late-loaded models pick it up.
   */
  private setCaptureEmission(enabled: boolean) {
    try {
      const fragments = this._components.get(OBC.FragmentsManager);
      const materials = (fragments as any)?.core?.models?.materials;
      materials?.setCaptureEmission?.(enabled);
    } catch {
      // Fragments core not initialized yet; updateDeferred re-asserts it.
    }
    // Each emitter is isolated: one that throws must not stop the rest.
    for (const emitter of this.captureEmitters) {
      try {
        emitter(enabled);
      } catch {
        // Keep going; a broken emitter is its own problem, not the pipeline's.
      }
    }
  }

  /**
   * The deferred pipeline instance, allocated on first access. Reading this while
   * in COMPOSER mode is allowed (e.g. to configure it before switching), and
   * allocates it.
   */
  get deferred(): DeferredPipeline {
    if (!this._deferred) {
      const width = Math.max(1, this._renderer.three.domElement.width);
      const height = Math.max(1, this._renderer.three.domElement.height);
      this._deferred = new DeferredPipeline(
        width,
        height,
        this._deferredSettings,
      );
      // Every capture tells the surface materials how big a pixel is, so a part
      // thinner than one covers a pixel wherever it lands. Looked up on every
      // call and duck-typed, like the emission switch.
      const pixels = (w: number, h: number) => {
        try {
          const fragments = this._components.get(OBC.FragmentsManager);
          (fragments as any)?.core?.models?.materials?.setCapturePixels?.(w, h);
        } catch {
          // Fragments core not initialized yet: nothing to tell.
        }
      };
      this._deferred.capture.onPixels = pixels;
      this._deferred.sunShadow.onPixels = pixels;
      // Re-apply the renderer's resize size so the pipeline matches the
      // resize path's dimensions from the very first deferred frame.
      this._renderer.applyPostproductionSize();
    }
    return this._deferred;
  }

  // Settings of a released pipeline, so leaving and re-entering DEFERRED keeps
  // the user's tuning.
  private _deferredSettings?: DeferredPipeline["settings"];

  private releaseDeferred() {
    if (!this._deferred) return;
    this._deferredSettings = this._deferred.settings;
    this._deferred.dispose();
    this._deferred = undefined;
  }

  constructor(components: OBC.Components, renderer: PostproductionRenderer) {
    this._components = components;
    this._renderer = renderer;
  }

  update() {
    if (this._mode === PostproductionMode.DEFERRED) {
      this.updateDeferred();
      return;
    }
    if (!this.composer) return;
    for (const material of this.invisibleMaterials) {
      material.userData.wasVisibleForPostproduction = material.visible;
      material.visible = false;
    }
    const renderer = this._renderer.three;
    renderer.getClearColor(this._clearColor);
    const prevClearAlpha = renderer.getClearAlpha();
    renderer.setClearColor(0xffffff, 1);
    renderer.setRenderTarget(this.composer.renderTarget1);
    renderer.clear();
    renderer.setRenderTarget(this.composer.renderTarget2);
    renderer.clear();
    renderer.setRenderTarget(null);
    renderer.setClearColor(this._clearColor, prevClearAlpha);
    this.composer.render();
    for (const material of this.invisibleMaterials) {
      material.visible = material.userData.wasVisibleForPostproduction;
    }
  }

  /**
   * Re-composite the cached deferred G-buffer + redraw overlays WITHOUT
   * re-running the capture/AO chain. For continuous overlay-only updates (a
   * measurement marker moving on an unchanged scene). Falls back to a full pass
   * internally until a capture exists. DEFERRED mode only; a no-op otherwise.
   */
  updateOverlayOnly() {
    if (this._mode !== PostproductionMode.DEFERRED) return;
    this.updateDeferred(true);
  }

  /**
   * Finish a split capture (see {@link captureChunk}): composite the accumulated
   * G-buffer WITHOUT re-capturing, but recomputing AO. DEFERRED mode only.
   */
  finishChunks() {
    if (this._mode !== PostproductionMode.DEFERRED || !this._deferred) return;
    this._deferred.markChunksFinished();
    this.updateDeferred(true);
  }

  /**
   * Capture ONE chunk of the scene into the G-buffer, so a repaint can be
   * spread over several frames. The caller hides everything outside the chunk,
   * calls this once per frame (`first` only on the chunk that starts the
   * capture), and finishes with {@link finishChunks}. DEFERRED mode only.
   */
  captureChunk(first: boolean) {
    if (this._mode !== PostproductionMode.DEFERRED || !this._deferred) return;
    const world = this._renderer.currentWorld;
    if (!world) return;
    const scene = world.scene.three as THREE.Scene;
    const camera = world.camera.three as
      | THREE.PerspectiveCamera
      | THREE.OrthographicCamera;
    if (first) this.setCaptureEmission(true);
    for (const material of this.invisibleMaterials) {
      material.userData.wasVisibleForPostproduction = material.visible;
      material.visible = false;
    }
    this._deferred.captureChunk(this._renderer.three, scene, camera, first);
    for (const material of this.invisibleMaterials) {
      material.visible = material.userData.wasVisibleForPostproduction;
    }
  }

  // Deferred render path: forward colour + auxiliary geometry capture, AO,
  // edges and FXAA folded into the pipeline. Bypasses the EffectComposer.
  private updateDeferred(reuseCapture = false) {
    const world = this._renderer.currentWorld;
    if (!world) return;
    const scene = world.scene.three as THREE.Scene;
    // May be perspective OR orthographic: the deferred passes branch on
    // camera.isOrthographicCamera at runtime, so do not narrow it.
    const camera = world.camera.three as
      | THREE.PerspectiveCamera
      | THREE.OrthographicCamera;
    const renderer = this._renderer.three;

    // Re-assert emission so models loaded after the mode switch emit too
    // (idempotent). Skipped on the overlay-only fast path.
    if (!reuseCapture) this.setCaptureEmission(true);

    for (const material of this.invisibleMaterials) {
      material.userData.wasVisibleForPostproduction = material.visible;
      material.visible = false;
    }

    // The composite passes the captured clear (colour + alpha) straight through
    // for background pixels, so the renderer's clear colour IS the viewport
    // background. Save/restore so a tail pass that mutates the clear can't leak
    // state across frames.
    renderer.getClearColor(this._clearColor);
    const prevClearAlpha = renderer.getClearAlpha();

    // Selection outline: the same ghost-mask pass the composer uses, run over
    // the finished deferred frame as a tail pass. Not when the frame is laid
    // over what the target already holds: the tail writes the target itself.
    const outline =
      this._outlinesEnabled &&
      this._simpleOutlinePass &&
      !this._deferred?.settings?.overTheTarget
        ? this._simpleOutlinePass
        : null;

    // Isolated materials the single-pass capture hides, split by how they must
    // composite back into the deferred frame:
    //   - depthTest:false → always-on-top overlays (hover / selection highlights)
    //   - depthTest:true  → depth-occluded overlays (the floor grid)
    const isolated = this._basePass?.isolatedMaterials ?? [];
    const overlay = isolated.filter(
      (m) => (m as THREE.Material).depthTest === false,
    );
    const depthOverlay = isolated.filter(
      (m) => (m as THREE.Material).depthTest !== false,
    );

    const tail = outline
      ? (frame: THREE.WebGLRenderTarget) => {
          outline.renderToScreen = true;
          outline.render(renderer, frame, frame);
        }
      : undefined;

    const occlusionPasses: { pass: OcclusionPass; direct: boolean }[] = [];
    for (const [pass, entry] of this.occlusionPasses) {
      occlusionPasses.push({ pass, direct: entry.direct });
    }

    try {
      this.deferred.render(
        renderer,
        scene,
        camera,
        tail,
        overlay,
        depthOverlay,
        reuseCapture,
        occlusionPasses,
      );
    } finally {
      renderer.setClearColor(this._clearColor, prevClearAlpha);
      for (const material of this.invisibleMaterials) {
        material.visible = material.userData.wasVisibleForPostproduction;
      }
    }
  }

  dispose() {
    if (this._mode === PostproductionMode.DEFERRED) {
      this.setCaptureEmission(false);
    }
    this.releaseDeferred();
    this._deferredSettings = undefined;
    this.occlusionPasses.clear();
    this.captureEmitters.clear();
    this.composer?.dispose();
    this._aoPass?.dispose();
    this._outputPass?.dispose();
    this._edgeDetectionPass?.dispose();
    this._smaaPass?.dispose();
    this._simpleOutlinePass?.dispose();
    this._excludedObjectsPass?.dispose();
    this._glossPass?.dispose();
  }

  setSize(width: number, height: number) {
    if (width === 0 || height === 0) {
      return;
    }
    if (this.composer) {
      this.composer.setSize(width, height);
    }
    if (this._deferred) {
      this._deferred.setSize(width, height);
    }
    if (this._simpleOutlinePass) {
      this._simpleOutlinePass.setSize(width, height);
    }
    if (this._excludedObjectsPass) {
      this._excludedObjectsPass.setSize(width, height);
    }
    if (this._glossPass) {
      this._glossPass.setSize(width, height);
    }
  }

  updateCamera() {
    const camera = this._renderer.currentWorld!.camera.three;
    if (this._basePass) {
      this._basePass.camera = camera;
    }
    if (this._aoPass) {
      this._aoPass.camera = camera;
    }
  }

  clear() {
    if (!this.composer) return;
    const passes = [...this.composer.passes];
    for (const pass of passes) {
      this.composer.removePass(pass);
    }
    this._renderer.three.setClearColor(0x000000, 0);
    this._renderer.three.setRenderTarget(this.composer.renderTarget1);
    this._renderer.three.clear();
    this._renderer.three.setRenderTarget(this.composer.renderTarget2);
    this._renderer.three.clear();
    this._renderer.three.setRenderTarget(null);
  }

  /**
   * Sample count used when {@link Postproduction.msaaEnabled} is on. An
   * internal detail: 4 is the usual sweet spot and the hardware ceiling
   * clamps it anyway, so there is no reason to make callers pick a number.
   */
  private static readonly MSAA_SAMPLES = 4;

  private applySamples() {
    if (!this.composer) return;
    const max = this._renderer.three.capabilities.maxSamples;
    const wanted = this._msaaEnabled ? Postproduction.MSAA_SAMPLES : 0;
    const samples = Math.max(0, Math.min(wanted, max));
    const targets = [this.composer.renderTarget1, this.composer.renderTarget2];
    for (const target of targets) {
      if (target.samples === samples) continue;
      target.samples = samples;
      // the framebuffer is re-created with the new sample count on next use
      target.dispose();
    }
  }

  private initialize() {
    this._initialized = true;

    const scene = this._renderer.currentWorld!.scene.three as THREE.Scene;
    const camera = this._renderer.currentWorld!.camera.three;

    // Configure renderer for transparency
    this._renderer.three.setClearColor(0x000000, 0);

    this.composer = new EffectComposer(this._renderer.three);
    // EffectComposer allocates its ping-pong targets with samples = 0, which
    // drops the MSAA of the default framebuffer as soon as postproduction is
    // on. With msaaEnabled off this is a no-op (the targets already have 0
    // samples); it is here so a world configured before initialize still gets
    // the samples it asked for.
    this.applySamples();

    const basePass = new BasePass(scene, camera);
    this._basePass = basePass;

    this._smaaPass = new SMAAPass();

    const fragmentsManager = this._components.get(OBC.FragmentsManager);

    this._aoPass = new AOPass(
      fragmentsManager,
      scene,
      camera,
      this._renderer.three.domElement.width,
      this._renderer.three.domElement.height,
    );
    this._aoPass.output = GTAOPass.OUTPUT.Default;
    this._edgeDetectionPass = new EdgeDetectionPass(
      this._renderer,
      fragmentsManager,
    );

    this._outputPass = new OutputPass();

    this._simpleOutlinePass = new SimpleOutlinePass(
      this._renderer.three.domElement.width,
      this._renderer.three.domElement.height,
      this._renderer.currentWorld!,
    );

    this._excludedObjectsPass = new ExcludedObjectsPass(
      this._renderer,
      this._renderer.currentWorld!,
    );

    this._glossPass = new GlossPass(
      new THREE.Vector2(
        this._renderer.three.domElement.width,
        this._renderer.three.domElement.height,
      ),
      this._renderer.currentWorld!,
    );

    this.style = PostproductionAspect.COLOR;
  }
}
