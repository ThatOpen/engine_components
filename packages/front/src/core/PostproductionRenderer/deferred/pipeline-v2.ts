import * as THREE from "three";
import { SurfaceCapturePass } from "./surface-capture-pass";
import { FullscreenQuad } from "./fullscreen-quad";
import { DepthMipPyramid } from "./depth-mip-pyramid";
import {
  ScreenSpaceAoPass,
  ScreenSpaceAoSettings,
  defaultAoSettings,
} from "./screen-space-ao-pass";
import {
  WorldSpaceAoPass,
  WorldSpaceAoSettings,
  defaultWorldAoSettings,
} from "./world-space-ao-pass";
import {
  AoDenoisePass,
  AoDenoiseSettings,
  defaultDenoiseSettings,
} from "./ao-denoise-pass";
import {
  CombinedCompositePass,
  CompositeSettings,
  defaultCompositeSettings,
  type ViewBackgroundSettings,
  type ViewCropSettings,
} from "./combined-composite-pass";
import { FxaaPass } from "./fxaa-pass";
import { SunShadowPass, type SunShadowSettings } from "./sun-shadow-pass";

/** Per-estimator + per-pass settings, plus the top-level pipeline toggles. The
 * nested shape matches the old DeferredPipeline so `new DeferredPipeline(w, h,
 * { composite: {...} })` and `settings.aoMode` etc. keep working after the swap. */
export interface DeferredPipelineSettings {
  ao: ScreenSpaceAoSettings;
  worldAo: WorldSpaceAoSettings;
  denoise: AoDenoiseSettings;
  composite: CompositeSettings;
  fxaaEnabled: boolean;
  aoEnabled: boolean;
  /** Which AO estimator runs while `aoEnabled` is on. Read live by `render()`. */
  aoMode: DeferredAoMode;
  /** Runs the AO compute + denoise at half resolution (1/4 the pixels). */
  aoHalfRes: boolean;
  /**
   * Builds the Hi-Z depth pyramid from a HALF-resolution base instead of a
   * full-resolution one, so the chain starts at half and has no full-res level
   * in it at all.
   *
   * Why it is worth a switch. Measured on a 2880x1530 buffer with an EMPTY scene,
   * the whole AO chain costs 2.55 ms of GPU while `aoHalfRes` only buys 0.27 —
   * so the fixed cost is not the estimator, it is the pyramid, and `aoHalfRes`
   * does not touch it. Level 0 alone is a full-screen pass that does nothing but
   * linearize depth. In screen areas: 1 + 1/4 + 1/16 ... = 1.33 today against
   * 1/4 + 1/16 ... = 0.33 with a half base. Four times less work.
   *
   * The trade is precision at contact: the estimator's near taps and the
   * denoise's edge stopping both read this chain, so a half base makes the first
   * available depth one level coarser.
   */
  hizHalfRes: boolean;
  /** Internal render resolution as a fraction of the native size, clamped [0.1, 1]. */
  renderScale: number;
  /**
   * The sun, when the view casts shadows; null when it does not. Read live by `render()`, so a caller that
   * draws several views sets it per pass, the same way it sets the cut and the style.
   */
  sunShadow: SunShadowSettings | null;
  /**
   * What the view paints where there is no model, or null for nothing (the frame stays clear there). Read
   * live, per pass, like the sun.
   */
  background: ViewBackgroundSettings | null;
  /**
   * The view's crop, where the model is clipped, or null when it is not: the contour draws no line along it (see
   * `ViewCropSettings`). Read live, per pass, like the sun.
   */
  crop: ViewCropSettings | null;
  /**
   * Whether the finished frame is laid OVER what its target already holds, by its alpha, instead of replacing it.
   *
   * Off, the frame replaces the target, which is right for a picture taken into its own image: where nothing is
   * drawn it stays clear, and whoever shows it lays it over the rest. On, for a caller that draws several views
   * straight onto one canvas where they overlap: replacing, the view drawn last blanked out, over its whole box,
   * whatever the one under it had drawn there. Read live by `render()`, set per pass like the sun.
   */
  overTheTarget: boolean;
}

/**
 * Which ambient-occlusion estimator feeds the denoise + composite. SCREEN_SPACE
 * is the Hi-Z Alchemy disk; WORLD_SPACE is the hemisphere-probe estimator with a
 * metre-stable contact footprint. Matches the old DeferredPipeline enum value-for
 * -value so consumers keep working after the swap.
 */
export enum DeferredAoMode {
  SCREEN_SPACE = 0,
  WORLD_SPACE = 1,
}

/**
 * Forward-draw hook fired AFTER the deferred composite. The consumer (points /
 * splats) draws straight into the finished frame, whose depth attachment is
 * BORROWED from the capture G-buffer, so its fragments depth-test against the
 * real BIM depth (occluded behind walls) — Phase-1 occlusion, no shader patch.
 * Mirrors the old DeferredPipeline's OcclusionPass contract (direct mode).
 */
export interface OcclusionPassContext {
  renderer: THREE.WebGLRenderer;
  camera: THREE.PerspectiveCamera | THREE.OrthographicCamera;
  target: THREE.WebGLRenderTarget;
  depth: THREE.DepthTexture;
  width: number;
  height: number;
}
export type OcclusionPass = (ctx: OcclusionPassContext) => void;

/**
 * DeferredPipeline — the rebuilt deferred postproduction pipeline.
 *
 * Re-authored from scratch and validated pass-by-pass in the PipelineBisect
 * harness (stages 18–23) before replacing the previous implementation. It reuses
 * the SAME proven pass classes (capture / Hi-Z / AO / denoise / composite / FXAA);
 * only the orchestration is new. Per frame:
 *   1. single-pass capture -> G-buffer (colour + depth + octa-normal + faceId)
 *   2. Hi-Z min-mip build from the captured depth
 *   3. AO estimator (screen-space Alchemy over Hi-Z, or world-space probe), half-res
 *   4. AO denoise (separable cross-bilateral)
 *   5. combined composite (AO . contour . sheen . tonemap . sRGB) -> LDR target
 *   6. FXAA -> the finished frame
 *   7. occlusion seam — direct (points into the frame) or layer (premultiplied splats)
 *   8. depth-occluded overlay (the floor grid) + flat overlay (hover/selection)
 *   9. tail (selection outline) / screen-copy
 *
 * `reuseCapture` skips 1–4 and re-composites the cached G-buffer (overlay-only
 * repaint). The public API (constructor, settings, render args, accessors) matches
 * the previous DeferredPipeline so consumers are untouched.
 */
export class DeferredPipeline {
  readonly settings: DeferredPipelineSettings;
  /** The sun's view of the scene, for cast shadows (see `settings.sunShadow`). */
  readonly sunShadow = new SunShadowPass();
  private _sunDrawn = false;

  readonly capture: SurfaceCapturePass;
  readonly pyramid: DepthMipPyramid;
  readonly ao: ScreenSpaceAoPass;
  readonly worldAo: WorldSpaceAoPass;
  readonly denoise: AoDenoisePass;
  readonly composite: CombinedCompositePass;
  readonly fxaa: FxaaPass;

  private _ldrTarget: THREE.WebGLRenderTarget;
  // Finished PEN frame with the capture depth BORROWED as a STABLE attachment
  // (set at allocation, never swapped per-frame — three caches the framebuffer).
  // The occlusion hook draws points straight into it, depth-testing the borrowed
  // BIM depth. Released (depth detached first) in releaseDirectFrame.
  private _directFrame: THREE.WebGLRenderTarget | null = null;
  // Colour target for the depth-occluded grid overlay; its depth is borrowed from
  // the capture G-buffer so the hardware test occludes the grid by scene geometry.
  private _gridColor: THREE.WebGLRenderTarget | null = null;
  // Colour target for the flat overlay (hover/selection). Has NO depth buffer —
  // single coverage comes from the NoBlending overwrite, not a depth test — so N
  // overlapping same-colour layers (a whole-subtree hover) collapse to one layer
  // instead of accumulating into a lighter wash.
  private _overlayColor: THREE.WebGLRenderTarget | null = null;
  // Colour target for the LAYER-mode occlusion pass (non-direct): the consumer
  // (splats) draws PREMULTIPLIED into it, its depth BORROWED from the capture
  // G-buffer so the forward draw is occluded by BIM geometry. Composited
  // premultiplied OVER the finished frame afterward. Never owns the borrowed depth.
  private _occlusionColor: THREE.WebGLRenderTarget | null = null;
  private _gridBlendQuad: FullscreenQuad;
  private _screenCopyQuad: FullscreenQuad;
  // Premultiplied OVER composite of the layer-mode occlusion layer onto the frame:
  // out = src + dst*(1 - srcA).
  private _occlusionBlendQuad: FullscreenQuad;
  private _whiteAo: THREE.DataTexture;
  // Last AO texture + whether a full capture has run. Lets render() skip the
  // capture + AO chain and re-composite the cached G-buffer when only an overlay
  // moved on an otherwise unchanged scene — the `reuseCapture` fast path.
  private _lastAo: THREE.Texture | null = null;
  private _hasCaptured = false;
  private _width: number;
  private _height: number;

  constructor(
    width: number,
    height: number,
    settings?: Partial<DeferredPipelineSettings>,
  ) {
    this._width = Math.max(1, Math.floor(width));
    this._height = Math.max(1, Math.floor(height));
    this.settings = {
      ao: { ...defaultAoSettings, ...(settings?.ao ?? {}) },
      worldAo: { ...defaultWorldAoSettings, ...(settings?.worldAo ?? {}) },
      denoise: { ...defaultDenoiseSettings, ...(settings?.denoise ?? {}) },
      composite: { ...defaultCompositeSettings, ...(settings?.composite ?? {}) },
      fxaaEnabled: settings?.fxaaEnabled ?? true,
      aoEnabled: settings?.aoEnabled ?? true,
      aoMode: settings?.aoMode ?? DeferredAoMode.SCREEN_SPACE,
      aoHalfRes: settings?.aoHalfRes ?? true,
      hizHalfRes: settings?.hizHalfRes ?? false,
      renderScale: settings?.renderScale ?? 1.0,
      sunShadow: settings?.sunShadow ?? null,
      background: settings?.background ?? null,
      crop: settings?.crop ?? null,
      overTheTarget: settings?.overTheTarget ?? false,
    };

    const full = this.fullSize();
    const ao = this.aoSize();

    this.capture = new SurfaceCapturePass(full.w, full.h);

    this._ldrTarget = new THREE.WebGLRenderTarget(full.w, full.h, {
      type: THREE.UnsignedByteType,
      format: THREE.RGBAFormat,
      minFilter: THREE.LinearFilter,
      magFilter: THREE.LinearFilter,
      depthBuffer: false,
      stencilBuffer: false,
    });
    this._ldrTarget.texture.name = "compositeLdr";

    this.pyramid = new DepthMipPyramid(full.w, full.h);
    this.ao = new ScreenSpaceAoPass(ao.w, ao.h, this.settings.ao);
    this.worldAo = new WorldSpaceAoPass(ao.w, ao.h, this.settings.worldAo);
    this.denoise = new AoDenoisePass(ao.w, ao.h, this.settings.denoise);
    this.composite = new CombinedCompositePass(full.w, full.h, this.settings.composite);
    this.fxaa = new FxaaPass(full.w, full.h);

    // Fully-open AO fallback (1.0) when AO is disabled.
    this._whiteAo = new THREE.DataTexture(
      new Uint8Array([255]),
      1,
      1,
      THREE.RedFormat,
    );
    this._whiteAo.needsUpdate = true;

    // Straight-alpha NormalBlending copy of the grid colour over the frame. The
    // grid was drawn blending-OFF, so the target holds exact (colour, coverage).
    const gridBlendMaterial = new THREE.ShaderMaterial({
      glslVersion: THREE.GLSL3,
      vertexShader: /* glsl */ `
        out vec2 vUv;
        void main() { vUv = uv; gl_Position = vec4(position, 1.0); }
      `,
      fragmentShader: /* glsl */ `
        precision highp float;
        in vec2 vUv;
        out vec4 outColor;
        uniform sampler2D uImage;
        void main() { outColor = texture(uImage, vUv); }
      `,
      uniforms: { uImage: { value: null } },
      transparent: true,
      depthTest: false,
      depthWrite: false,
    });
    this._gridBlendQuad = new FullscreenQuad(gridBlendMaterial);

    // Plain overwrite copy — blits the finished offscreen frame to the screen.
    const copyMaterial = new THREE.ShaderMaterial({
      glslVersion: THREE.GLSL3,
      vertexShader: /* glsl */ `
        out vec2 vUv;
        void main() { vUv = uv; gl_Position = vec4(position, 1.0); }
      `,
      fragmentShader: /* glsl */ `
        precision highp float;
        in vec2 vUv;
        out vec4 outColor;
        uniform sampler2D uImage;
        void main() { outColor = texture(uImage, vUv); }
      `,
      uniforms: { uImage: { value: null } },
      depthTest: false,
      depthWrite: false,
      blending: THREE.NoBlending,
    });
    this._screenCopyQuad = new FullscreenQuad(copyMaterial);

    // Composites the layer-mode occlusion layer (already PREMULTIPLIED — the
    // consumer draws premultiplied splats into _occlusionColor) over the finished
    // frame: out = src + dst*(1 - srcA). depthTest:false (occlusion was resolved by
    // the hardware test when the layer was drawn against the borrowed depth).
    const occlusionBlendMaterial = new THREE.ShaderMaterial({
      glslVersion: THREE.GLSL3,
      vertexShader: /* glsl */ `
        out vec2 vUv;
        void main() { vUv = uv; gl_Position = vec4(position, 1.0); }
      `,
      fragmentShader: /* glsl */ `
        precision highp float;
        in vec2 vUv;
        out vec4 outColor;
        uniform sampler2D uImage;
        void main() { outColor = texture(uImage, vUv); }
      `,
      uniforms: { uImage: { value: null } },
      transparent: true,
      depthTest: false,
      depthWrite: false,
      blending: THREE.CustomBlending,
      blendEquation: THREE.AddEquation,
      blendSrc: THREE.OneFactor,
      blendDst: THREE.OneMinusSrcAlphaFactor,
    });
    this._occlusionBlendQuad = new FullscreenQuad(occlusionBlendMaterial);
  }

  /** BIM depth attachment (float32 DEPTH_COMPONENT32F, reversed-Z). Owned by capture. */
  get depthTexture(): THREE.DepthTexture {
    return this.capture.target.depthTexture;
  }

  /**
   * Internal render resolution as a fraction of the native size (1.0 = 1:1, sharp;
   * 0.5 = quarter the pixels, ~2x faster, softer). Reallocates every pass.
   */
  get renderScale(): number {
    return this.settings.renderScale;
  }

  set renderScale(value: number) {
    this.settings.renderScale = Math.max(0.1, Math.min(1, value));
    this.setSize(this._width, this._height);
  }

  /**
   * Whether the AO compute + denoise run at half the full render resolution.
   * Flipping it changes the AO target dimensions, so the setter reallocates the
   * AO chain at the new size.
   */
  get aoHalfRes(): boolean {
    return this.settings.aoHalfRes;
  }

  set aoHalfRes(value: boolean) {
    if (value === this.settings.aoHalfRes) return;
    this.settings.aoHalfRes = value;
    this.setSize(this._width, this._height);
  }

  /**
   * Whether the Hi-Z pyramid is built from a half-resolution base. Flipping it
   * changes the pyramid's dimensions, so the setter reallocates it — writing
   * `settings.hizHalfRes` on its own would change the number and nothing else.
   */
  get hizHalfRes(): boolean {
    return this.settings.hizHalfRes;
  }

  set hizHalfRes(value: boolean) {
    if (value === this.settings.hizHalfRes) return;
    this.settings.hizHalfRes = value;
    this.setSize(this._width, this._height);
  }

  private fullSize(): { w: number; h: number } {
    const s = Math.max(0.1, Math.min(1, this.settings.renderScale));
    return {
      w: Math.max(1, Math.floor(this._width * s)),
      h: Math.max(1, Math.floor(this._height * s)),
    };
  }

  /** Base size of the Hi-Z pyramid. See {@link DeferredPipelineSettings.hizHalfRes}. */
  private hizSize(): { w: number; h: number } {
    const full = this.fullSize();
    if (!this.settings.hizHalfRes) return full;
    return {
      w: Math.max(1, Math.floor(full.w / 2)),
      h: Math.max(1, Math.floor(full.h / 2)),
    };
  }

  private aoSize(): { w: number; h: number } {
    const full = this.fullSize();
    if (!this.settings.aoHalfRes) return full;
    return {
      w: Math.max(1, Math.floor(full.w / 2)),
      h: Math.max(1, Math.floor(full.h / 2)),
    };
  }

  setSize(width: number, height: number) {
    this._width = Math.max(1, Math.floor(width));
    this._height = Math.max(1, Math.floor(height));
    const full = this.fullSize();
    const ao = this.aoSize();
    this.capture.setSize(full.w, full.h);
    this._ldrTarget.setSize(full.w, full.h);
    const hiz = this.hizSize();
    this.pyramid.setSize(hiz.w, hiz.h);
    this.ao.setSize(ao.w, ao.h);
    this.worldAo.setSize(ao.w, ao.h);
    this.denoise.setSize(ao.w, ao.h);
    this.composite.setSize(full.w, full.h);
    this.fxaa.setSize(full.w, full.h);
    // Grid + direct frame borrow capture's (now-resized) depth — drop them so they
    // rebuild at the new size against the fresh depth (detach the borrow first).
    this.releaseGridColor();
    this.releaseDirectFrame();
    // The occlusion layer also borrows the (now-resized) capture depth — drop it.
    this.releaseOcclusionColor();
    // The overlay target owns its colour buffer; drop it so it rebuilds at the new size.
    this.releaseOverlayColor();
  }

  /**
   * Renders the deferred frame. Argument order matches the previous
   * DeferredPipeline so consumers are untouched:
   * - `tail`: composites over the finished frame and writes the screen (selection outline).
   * - `overlayMaterials`: flat "always-on-top" overlays (hover/selection highlights).
   * - `depthOverlayMaterials`: depth-occluded overlays (the floor grid).
   * - `reuseCapture`: skip the capture + AO chain and re-composite the cached G-buffer.
   * - `occlusionPass`: forward draw for points/splats (direct or layer mode).
   * - `occlusionDirect`: true = draw straight into the frame (points); false = premultiplied layer (splats).
   */
  /**
   * 🔴 One CHUNK of a capture, so a caller can spread a repaint over several frames.
   *
   * Draw the scene in K slices (hide everything outside the slice, call this once per frame with
   * `first = true` only on the slice that starts the capture), then finish with a normal `render(...)` on
   * the reuse fast path: it skips the capture and composites the accumulated G-buffer.
   *
   * The point is not that the total work shrinks, it does not. It is that no single frame carries all of
   * it. A repaint measured at 17-19 ms idle and 44-56 ms mid-gesture cannot fit in a 16 ms frame on a big
   * model, and lowering it only moves the ceiling to the next model.
   */
  captureChunk(
    renderer: THREE.WebGLRenderer,
    scene: THREE.Scene,
    camera: THREE.PerspectiveCamera | THREE.OrthographicCamera,
    first: boolean,
  ) {
    const oldTarget = renderer.getRenderTarget();
    this.capture.render(renderer, scene, camera, first);
    this._hasCaptured = true;
    renderer.setRenderTarget(oldTarget);
  }

  /**
   * ⛔ MEASURED AND REJECTED: gating the overlay passes on material visibility.
   *
   * `paintOverlay` and `renderDepthOverlay` already give up when nothing in the scene uses their
   * materials, but only AFTER traversing the whole graph and toggling visibility on every object. On a
   * canvas of viewports that is 11.108 objects walked twice per draw to end up drawing nothing, and the two
   * of them plus the final blit measured 12,8-16,1 ms of a 13,0-16,2 ms pass. So the traversal is worth
   * removing.
   *
   * The obvious cheap gate does NOT work: asking whether any overlay material is visible. Measured in the
   * earlier canvas build, all 61 isolated materials report `visible: true` while NO object in the scene uses
   * them, so the gate is always open and answers a different question than `hasOverlayObject`.
   *
   * What would work is a registry of which objects currently carry an overlay material, maintained by
   * whoever assigns them (the outliner / highlighter), so the pipeline never has to look. Left as the next
   * step rather than guessed at.
   */
  /** Arms the next `render()` to finish a split capture: skip the capture, recompute AO, composite. */
  markChunksFinished() {
    this._finishingChunks = true;
  }

  private _finishingChunks = false;

  /**
   * 🔴 THE SCENE'S MATRICES ARE WORKED OUT ONCE A FRAME, NOT ONCE A DRAW OF IT. A deferred frame draws the
   * scene up to four times (opaque, translucent, depth overlay, flat overlay), and each `renderer.render`
   * walks the whole graph composing every object's matrix again, of a scene nothing has moved in between.
   * Measured on a set of 22 sheets with 1,800 objects, photo after photo: 13.6 ms a frame with it, 6.7 without,
   * the same on a 128 pixel thumbnail as on a full sheet, because it is the graph that is paid for and not
   * the pixels. So they are worked out here, and the draws inside find them done.
   */
  render(
    renderer: THREE.WebGLRenderer,
    scene: THREE.Scene,
    camera: THREE.PerspectiveCamera | THREE.OrthographicCamera,
    tail?: (frame: THREE.WebGLRenderTarget) => void,
    overlayMaterials?: THREE.Material[],
    depthOverlayMaterials?: THREE.Material[],
    reuseCapture = false,
    occlusionPasses: { pass: OcclusionPass; direct: boolean }[] = [],
  ) {
    const everyDraw = scene.matrixWorldAutoUpdate;
    if (everyDraw) scene.updateMatrixWorld();
    scene.matrixWorldAutoUpdate = false;
    try {
      this.renderFrame(
        renderer,
        scene,
        camera,
        tail,
        overlayMaterials,
        depthOverlayMaterials,
        reuseCapture,
        occlusionPasses,
      );
    } finally {
      scene.matrixWorldAutoUpdate = everyDraw;
    }
  }

  private renderFrame(
    renderer: THREE.WebGLRenderer,
    scene: THREE.Scene,
    camera: THREE.PerspectiveCamera | THREE.OrthographicCamera,
    tail: ((frame: THREE.WebGLRenderTarget) => void) | undefined,
    overlayMaterials: THREE.Material[] | undefined,
    depthOverlayMaterials: THREE.Material[] | undefined,
    reuseCapture: boolean,
    occlusionPasses: { pass: OcclusionPass; direct: boolean }[],
  ) {
    // ⏱️ TEMPORARY. Where the time inside one deferred pass actually goes.
    //
    // Measured from the app side: this chain is 57% of a sheet repaint, it costs the same at 256x181 as at
    // 2048x2048, and it still costs 45 of 54 ms with the whole model hidden. So it is neither the scene nor
    // the resolution, and the app cannot narrow it further from outside. `__pipelinePhases` turns on a phase
    // clock; it is off by default and costs nothing.
    const clock: [string, number][] | null = (globalThis as any).__pipelinePhases
      ? []
      : null;
    const mark = clock
      ? (phase: string) => clock.push([phase, performance.now()])
      : () => {};
    mark("start");

    const oldTarget = renderer.getRenderTarget();
    const lastTarget = this.ensureDirectFrame();
    mark("ensureDirectFrame");

    // Fast path: when only an overlay moved on an otherwise unchanged scene, skip
    // the capture + AO chain and re-composite the cached G-buffer. Falls back to a
    // full pass the first time (nothing captured yet).
    const effectiveReuse = reuseCapture && this._hasCaptured;

    // 🔴 FINISHING A SPLIT CAPTURE IS NOT THE SAME AS REUSING ONE.
    //
    // `reuseCapture` skips the capture AND the AO chain, because it exists for an overlay moving over an
    // unchanged scene, where the cached AO is still the right AO. After `captureChunk`s the G-buffer is
    // BRAND NEW and no AO has been computed for it, so re-compositing with `_lastAo` shades this frame with
    // another frame's occlusion. Seen on screen: plans came out grey and blotchy instead of lines on white,
    // wearing the AO of a previously drawn sheet.
    //
    // So the finisher skips the capture and RUNS the AO chain. One flag, two different meanings.
    const afterChunks = this._finishingChunks;
    this._finishingChunks = false;
    const skipCapture = effectiveReuse || afterChunks;
    const skipAo = effectiveReuse && !afterChunks;

    // 1-4. Capture + AO chain. Skipped entirely on the reuse fast path (the cached
    //       capture.target textures + last AO are re-composited below).
    let aoTexture: THREE.Texture = this._lastAo ?? this._whiteAo;
    if (!skipCapture) {
      // Capture: colour + depth + normal + faceId in one scene draw. Hide BOTH the
      // overlay and depth-overlay materials at MATERIAL level so they never enter
      // the MRT (a 1-output material in a 3-attachment MRT spams GL errors); restore
      // after so the overlay passes can redraw them.
      const captureHidden: THREE.Material[] = [];
      const hideForCapture = (mats?: THREE.Material[]) => {
        if (!mats) return;
        for (const m of mats) {
          if (m.visible) {
            m.visible = false;
            captureHidden.push(m);
          }
        }
      };
      hideForCapture(overlayMaterials);
      hideForCapture(depthOverlayMaterials);
      if (clock) (this.capture as any).__clock = mark;
      // 🔴 SHOWN AGAIN WHATEVER THE CAPTURE DOES. A capture that throws is one abandoned frame to whoever runs the
      // loop, and it used to leave every overlay material hidden for the life of the page: measured in an app whose
      // 25th frame died inside three, the cut's lines and fills of every view already open never drew again — sections
      // and plans with no cut outline at all, and nothing on the console to say why.
      try {
        this.capture.render(renderer, scene, camera);
      } finally {
        for (const m of captureHidden) m.visible = true;
      }
      mark("capture");
      this._hasCaptured = true;
    }

    // AO chain (Hi-Z -> estimator -> denoise), half-res. White fallback off. The
    // estimator is the screen-space Alchemy disk or the world-space hemisphere
    // probe, chosen live by `aoMode` (both share the render sig).
    //
    // Runs whenever the G-buffer under it is new, which includes finishing a split capture. Only the
    // overlay-only fast path keeps the cached AO, because there the G-buffer really is unchanged.
    if (!skipAo) {
      aoTexture = this._whiteAo;
      if (this.settings.aoEnabled) {
        this.pyramid.build(renderer, this.capture.target.depthTexture, camera);
        const aoSource =
          this.settings.aoMode === DeferredAoMode.WORLD_SPACE
            ? this.worldAo
            : this.ao;
        aoSource.render(
          renderer,
          this.pyramid,
          this.capture.target.normalTexture,
          this.capture.target.faceIdTexture,
          camera,
        );
        this.denoise.render(
          renderer,
          aoSource.texture,
          this.pyramid.texture,
          this.capture.target.normalTexture,
        );
        aoTexture = this.denoise.texture;
      }
      this._lastAo = aoTexture;
      mark("ao");
    }

    // 4b. The sun's depth, when the view casts shadows. Redrawn on every pass that is not a pure reuse of the
    //     last frame: a split capture's finishing pass may come after another view was drawn, with other cuts.
    const sun = this.settings.sunShadow;
    if (sun && (!effectiveReuse || !this._sunDrawn)) {
      this.sunShadow.render(
        renderer,
        scene,
        sun,
        [...(overlayMaterials ?? []), ...(depthOverlayMaterials ?? [])],
        {
          camera,
          depth: this.capture.target.depthTexture,
          width: this.capture.target.depthTexture.image.width,
          height: this.capture.target.depthTexture.image.height,
          reversed: (renderer.capabilities as { reversedDepthBuffer?: boolean }).reversedDepthBuffer === true,
        },
      );
      this._sunDrawn = true;
      mark("sun");
    }
    if (!sun) this._sunDrawn = false;

    // 5. Composite over the captured colour -> LDR (always the intermediate here,
    //    so the composite never writes the depth-attached lastTarget while
    //    sampling the capture depth — that would feedback-loop).
    this.composite.render(
      renderer,
      this._ldrTarget,
      {
        color: this.capture.target.colorTexture,
        ao: aoTexture,
        depth: this.capture.target.depthTexture,
        normal: this.capture.target.normalTexture,
        faceId: this.capture.target.faceIdTexture,
      },
      camera,
      sun && this.sunShadow.depthTexture
        ? {
            depth: this.sunShadow.depthTexture,
            camera: this.sunShadow.camera,
            tone: sun.tone,
            texel: this.sunShadow.texelInMetres,
            groundAt: sun.groundAt ?? null,
          }
        : null,
      this.settings.background,
      this.settings.crop,
    );
    mark("composite");

    // 🔴 WITH NOTHING LEFT TO DRAW OVER THE FRAME, THE LAST STEP WRITES THE CALLER'S TARGET DIRECTLY.
    //
    // The frame used to go: composite -> LDR, FXAA -> lastTarget, and then a fullscreen copy from
    // lastTarget to whatever the caller had bound. That copy exists so steps 7-10 (occlusion seam, depth
    // overlay, flat overlay, tail) have a depth-bearing frame to draw into. When none of them is registered
    // there is nothing to draw over, and the copy is pure overhead.
    //
    // It is not a small overhead. Measured on a 2048x2048 sheet in the earlier canvas build, the tail-and-blit
    // step was 14,5-16,1 ms of a 14,7-16,2 ms pass: essentially the whole cost of finishing a frame.
    //
    // ⚠️ The condition has to include the TAIL, and the `!tail` case is the subtle one: a tail writes the
    // screen itself and the blit is already skipped for it, so short-circuiting here as well would leave the
    // tail reading a frame nobody wrote.
    // Laid over the target, the last write is the copy below, which is the one step that knows how to blend: the
    // direct path would have FXAA replace the target.
    const nothingOverTheFrame =
      !this.settings.overTheTarget &&
      !tail &&
      occlusionPasses.length === 0 &&
      !(depthOverlayMaterials && depthOverlayMaterials.length) &&
      !(overlayMaterials && overlayMaterials.length);
    const lastStepTarget = nothingOverTheFrame ? oldTarget : lastTarget;
    // 6. FXAA -> the depth-bearing direct frame (depthTest:false, so the attached
    //    BIM depth is left intact for the point depth-test below). When FXAA is
    //    off, plain-copy the LDR into the direct frame instead.
    if (this.settings.fxaaEnabled) {
      this.fxaa.render(renderer, this._ldrTarget.texture, lastStepTarget);
    } else {
      const copyMat = this._screenCopyQuad.material as THREE.ShaderMaterial;
      copyMat.uniforms.uImage.value = this._ldrTarget.texture;
      this._screenCopyQuad.render(renderer, lastStepTarget);
    }
    mark("fxaa");
    if (nothingOverTheFrame) {
      renderer.setRenderTarget(oldTarget);
      if (clock) {
        mark("cola y blit");
        const parts: Record<string, number> = {};
        for (let i = 1; i < clock.length; i++) {
          parts[clock[i][0]] =
            Math.round((clock[i][1] - clock[i - 1][1]) * 100) / 100;
        }
        const full = this.fullSize();
        (globalThis as any).__lastPipeline = {
          size: `${full.w}x${full.h}`,
          direct: true,
          why: "nothing to draw on top",
          aoEnabled: this.settings.aoEnabled,
          fxaaEnabled: this.settings.fxaaEnabled,
          reuse: effectiveReuse,
          total:
            Math.round((clock[clock.length - 1][1] - clock[0][1]) * 100) / 100,
          parts,
        };
      }
      return;
    }

    // 7. Occlusion seam. DIRECT (occlusionDirect): the consumer draws straight into
    //    the finished frame, depth-testing against the borrowed BIM depth and depth-
    //    writing so it self-occludes (the points path). LAYER (!occlusionDirect): the
    //    consumer draws PREMULTIPLIED into a separate colour layer (depth borrowed
    //    from the capture), then we composite it premultiplied OVER the frame (the
    //    splat path). Both occlude against the real BIM depth — Phase-1, no shader patch.
    //    Runs EVERY registered pass so splats (LAYER) + point clouds (DIRECT) coexist.
    //    DIRECT passes first (opaque, depth-writing into the frame), then LAYER passes
    //    (transparent splats) composited premultiplied OVER. With exactly one pass this
    //    is byte-identical to the previous single-pass behaviour.
    if (occlusionPasses.length) {
      const depth = this.capture.target.depthTexture;
      const full = this.fullSize();
      const prevAutoClear = renderer.autoClear;
      renderer.autoClear = false;
      // DIRECT: draw straight into the finished frame (self-occluding points).
      for (const { pass, direct } of occlusionPasses) {
        if (!direct) continue;
        renderer.setRenderTarget(lastTarget);
        pass({ renderer, camera, target: lastTarget, depth, width: full.w, height: full.h });
      }
      // LAYER: draw premultiplied into a colour layer (borrowed BIM depth), composite OVER.
      for (const { pass, direct } of occlusionPasses) {
        if (direct) continue;
        const layer = this.ensureOcclusionColor(); // borrowed BIM depth attached
        renderer.setRenderTarget(layer);
        const gl = renderer.getContext() as WebGL2RenderingContext;
        gl.clearBufferfv(gl.COLOR, 0, [0, 0, 0, 0]); // clear colour; keep borrowed depth
        pass({ renderer, camera, target: layer, depth, width: full.w, height: full.h });
        const mat = this._occlusionBlendQuad.material as THREE.ShaderMaterial;
        mat.uniforms.uImage.value = layer.texture;
        this._occlusionBlendQuad.render(renderer, lastTarget);
      }
      renderer.autoClear = prevAutoClear;
      renderer.setRenderTarget(oldTarget);
    }

    // 8. Depth-occluded overlay (the floor grid): re-drawn depth-tested against the
    //    captured scene depth so a wall in front hides the grid behind it.
    if (depthOverlayMaterials && depthOverlayMaterials.length) {
      this.renderDepthOverlay(
        renderer,
        scene,
        camera,
        lastTarget,
        depthOverlayMaterials,
      );
    }

    // 9. Flat overlay (hover / selection highlights, depthTest:false): re-drawn over
    //    the composite. The single-pass capture hid every non-emitter material, so
    //    without this such overlays never appear in deferred mode.
    if (overlayMaterials && overlayMaterials.length) {
      this.paintOverlay(renderer, scene, camera, lastTarget, overlayMaterials);
    }

    // 10. Optional tail (e.g. the selection outline): composites over the finished
    //     frame and writes the screen itself, so the screen-copy below is skipped.
    if (tail) {
      tail(lastTarget);
    }

    // 11. Blit the finished frame to the screen — but only when there was no tail to
    //     write the screen itself (the tail owns the screen when present).
    if (!tail) {
      const copyMat = this._screenCopyQuad.material as THREE.ShaderMaterial;
      copyMat.uniforms.uImage.value = lastTarget.texture;
      // Replacing, or laid over by its alpha: see `settings.overTheTarget`. Plain state, no recompile.
      const over = this.settings.overTheTarget;
      copyMat.blending = over ? THREE.NormalBlending : THREE.NoBlending;
      copyMat.transparent = over;
      this._screenCopyQuad.render(renderer, oldTarget);
    }

    renderer.setRenderTarget(oldTarget);
    if (clock) {
      mark("cola y blit");
      const parts: Record<string, number> = {};
      for (let i = 1; i < clock.length; i++) {
        parts[clock[i][0]] =
          Math.round((clock[i][1] - clock[i - 1][1]) * 100) / 100;
      }
      const full = this.fullSize();
      (globalThis as any).__lastPipeline = {
        size: `${full.w}x${full.h}`,
        direct: false,
        // WHY the direct write was not possible, which is what to look at before believing the final
        // copy is unavoidable. Each of these forces an intermediate frame to draw over.
        stallingPasses: {
          tail: !!tail,
          occlusion: occlusionPasses.length,
          overprintDepth: depthOverlayMaterials?.length ?? 0,
          overlayPlane: overlayMaterials?.length ?? 0,
        },
        aoEnabled: this.settings.aoEnabled,
        fxaaEnabled: this.settings.fxaaEnabled,
        reuse: effectiveReuse,
        total: Math.round((clock[clock.length - 1][1] - clock[0][1]) * 100) / 100,
        parts,
      };
    }
  }

  private renderDepthOverlay(
    renderer: THREE.WebGLRenderer,
    scene: THREE.Scene,
    camera: THREE.Camera,
    lastTarget: THREE.WebGLRenderTarget,
    materials: THREE.Material[],
  ) {
    const gridColor = this.ensureGridColor();
    const overlay = new Set(materials);

    const hidden: THREE.Object3D[] = [];
    const restore: {
      material: THREE.Material;
      blending: THREE.Blending;
      depthWrite: boolean;
    }[] = [];
    scene.traverse((object) => {
      if (!object.visible) return;
      const material = (object as THREE.Mesh).material as
        | THREE.Material
        | THREE.Material[]
        | undefined;
      if (!material) return;
      const mats = Array.isArray(material) ? material : [material];
      const isOverprint = mats.some((m) => overlay.has(m));
      if (!isOverprint) {
        object.visible = false;
        hidden.push(object);
        return;
      }
      for (const m of mats) {
        if (!overlay.has(m)) continue;
        restore.push({
          material: m,
          blending: m.blending,
          depthWrite: m.depthWrite,
        });
        m.blending = THREE.NoBlending;
        m.depthWrite = false;
      }
    });

    const oldTarget = renderer.getRenderTarget();
    const oldAutoClear = renderer.autoClear;
    renderer.autoClear = false;
    renderer.setRenderTarget(gridColor);
    // Clear ONLY colour; keep the borrowed scene depth so geometry occludes the grid.
    const gl = renderer.getContext() as WebGL2RenderingContext;
    gl.clearBufferfv(gl.COLOR, 0, [0, 0, 0, 0]);
    // 🔴 WHAT WAS HIDDEN FOR THIS DRAW COMES BACK WHATEVER THE DRAW DOES. Everything that is not of the layer is put
    // out of sight for one render and shown again after it; a render that threw (a mesh with no data, after a model
    // was written and loaded again) left the scene hidden for good. The models were shown again by whoever loads
    // them and the floor grid by nobody: it was gone for the rest of the session (Designer, after editing a wall).
    try {
      renderer.render(scene, camera);
      renderer.autoClear = oldAutoClear;

      const blendMaterial = this._gridBlendQuad.material as THREE.ShaderMaterial;
      blendMaterial.uniforms.uImage.value = gridColor.texture;
      this._gridBlendQuad.render(renderer, lastTarget);
    } finally {
      renderer.autoClear = oldAutoClear;
      renderer.setRenderTarget(oldTarget);
      for (const object of hidden) object.visible = true;
      for (const saved of restore) {
        saved.material.blending = saved.blending;
        saved.material.depthWrite = saved.depthWrite;
      }
    }
  }

  private ensureGridColor(): THREE.WebGLRenderTarget {
    const full = this.fullSize();
    if (
      this._gridColor &&
      (this._gridColor.width !== full.w || this._gridColor.height !== full.h)
    ) {
      this.releaseGridColor();
    }
    if (!this._gridColor) {
      this._gridColor = new THREE.WebGLRenderTarget(full.w, full.h, {
        type: THREE.UnsignedByteType,
        format: THREE.RGBAFormat,
        minFilter: THREE.LinearFilter,
        magFilter: THREE.LinearFilter,
        depthBuffer: true,
        stencilBuffer: false,
      });
      this._gridColor.texture.name = "v2GridOverlay";
      this._gridColor.depthTexture = this.capture.target.depthTexture; // borrowed
    }
    return this._gridColor;
  }

  private releaseGridColor() {
    if (!this._gridColor) return;
    this._gridColor.depthTexture = null as unknown as THREE.DepthTexture;
    this._gridColor.dispose();
    this._gridColor = null;
  }

  /**
   * Re-draws the flat overlay materials' objects over the finished frame. The
   * single-pass capture hides every non-emitter, so highlight overlays (hover /
   * selection) never reach the deferred frame; this paints just those objects on
   * top. Drawn into a dedicated colour target with blending OFF, then straight-
   * alpha composited over the frame ONCE — so N overlapping same-colour layers
   * (a whole-subtree hover) collapse to a single layer instead of a lighter wash.
   * Materials flagged `userData.preserveBlending` keep their own blending.
   */
  private paintOverlay(
    renderer: THREE.WebGLRenderer,
    scene: THREE.Scene,
    camera: THREE.Camera,
    target: THREE.WebGLRenderTarget,
    materials: THREE.Material[],
  ) {
    const overlay = new Set(materials);
    const hidden: THREE.Object3D[] = [];
    const restore: { material: THREE.Material; blending: THREE.Blending }[] = [];
    let hasOverlayObject = false;
    scene.traverse((object) => {
      if (!object.visible) return;
      const material = (object as THREE.Mesh).material as
        | THREE.Material
        | THREE.Material[]
        | undefined;
      if (!material) return;
      const mats = Array.isArray(material) ? material : [material];
      const isOverprint = mats.some((m) => overlay.has(m));
      if (!isOverprint) {
        object.visible = false;
        hidden.push(object);
        return;
      }
      hasOverlayObject = true;
      // Overwrite (NoBlending) so overlapping same-colour layers collapse to one;
      // depthTest is left as-is (false). Materials flagged preserveBlending (e.g.
      // the multi-colour clipper gizmo) keep their own blending.
      for (const m of mats) {
        if (!overlay.has(m)) continue;
        if (m.userData?.preserveBlending) continue;
        restore.push({ material: m, blending: m.blending });
        m.blending = THREE.NoBlending;
      }
    });

    // Nothing using the overlay materials is in the scene (e.g. no active hover):
    // skip the offscreen render + full-screen blend entirely, and restore.
    if (!hasOverlayObject) {
      for (const object of hidden) object.visible = true;
      return;
    }

    const overprintTint = this.ensureOverlayColor();
    const oldTarget = renderer.getRenderTarget();
    const oldAutoClear = renderer.autoClear;
    renderer.autoClear = false;
    renderer.setRenderTarget(overprintTint);
    // Clear colour only to transparent (no depth buffer on this target).
    const gl = renderer.getContext() as WebGL2RenderingContext;
    gl.clearBufferfv(gl.COLOR, 0, [0, 0, 0, 0]);
    // (Shown again whatever the draw does, as in the grid's layer above: see there.)
    try {
      renderer.render(scene, camera);
      renderer.autoClear = oldAutoClear;

      // Composite the single flattened overlay layer over the finished frame.
      const blendMaterial = this._gridBlendQuad.material as THREE.ShaderMaterial;
      blendMaterial.uniforms.uImage.value = overprintTint.texture;
      this._gridBlendQuad.render(renderer, target);
    } finally {
      renderer.autoClear = oldAutoClear;
      renderer.setRenderTarget(oldTarget);
      for (const object of hidden) object.visible = true;
      for (const saved of restore) saved.material.blending = saved.blending;
    }
  }

  private ensureOverlayColor(): THREE.WebGLRenderTarget {
    const full = this.fullSize();
    if (
      this._overlayColor &&
      (this._overlayColor.width !== full.w ||
        this._overlayColor.height !== full.h)
    ) {
      this.releaseOverlayColor();
    }
    if (!this._overlayColor) {
      this._overlayColor = new THREE.WebGLRenderTarget(full.w, full.h, {
        type: THREE.UnsignedByteType,
        format: THREE.RGBAFormat,
        minFilter: THREE.LinearFilter,
        magFilter: THREE.LinearFilter,
        depthBuffer: false,
        stencilBuffer: false,
      });
      this._overlayColor.texture.name = "v2HoverOverlay";
    }
    return this._overlayColor;
  }

  private releaseOverlayColor() {
    if (!this._overlayColor) return;
    this._overlayColor.dispose();
    this._overlayColor = null;
  }

  private ensureOcclusionColor(): THREE.WebGLRenderTarget {
    const full = this.fullSize();
    if (
      this._occlusionColor &&
      (this._occlusionColor.width !== full.w ||
        this._occlusionColor.height !== full.h)
    ) {
      this.releaseOcclusionColor();
    }
    if (!this._occlusionColor) {
      this._occlusionColor = new THREE.WebGLRenderTarget(full.w, full.h, {
        type: THREE.UnsignedByteType,
        format: THREE.RGBAFormat,
        minFilter: THREE.LinearFilter,
        magFilter: THREE.LinearFilter,
        depthBuffer: true,
        stencilBuffer: false,
      });
      this._occlusionColor.texture.name = "v2SplatOcclusion";
      this._occlusionColor.depthTexture = this.capture.target.depthTexture; // borrowed
    }
    return this._occlusionColor;
  }

  private releaseOcclusionColor() {
    if (!this._occlusionColor) return;
    this._occlusionColor.depthTexture = null as unknown as THREE.DepthTexture;
    this._occlusionColor.dispose();
    this._occlusionColor = null;
  }

  private ensureDirectFrame(): THREE.WebGLRenderTarget {
    const full = this.fullSize();
    if (
      this._directFrame &&
      (this._directFrame.width !== full.w || this._directFrame.height !== full.h)
    ) {
      this.releaseDirectFrame();
    }
    if (!this._directFrame) {
      this._directFrame = new THREE.WebGLRenderTarget(full.w, full.h, {
        type: THREE.UnsignedByteType,
        format: THREE.RGBAFormat,
        minFilter: THREE.LinearFilter,
        magFilter: THREE.LinearFilter,
        depthBuffer: true,
        stencilBuffer: false,
      });
      this._directFrame.texture.name = "v2DirectFrame";
      this._directFrame.depthTexture = this.capture.target.depthTexture; // borrowed
    }
    return this._directFrame;
  }

  private releaseDirectFrame() {
    if (!this._directFrame) return;
    this._directFrame.depthTexture = null as unknown as THREE.DepthTexture;
    this._directFrame.dispose();
    this._directFrame = null;
  }

  dispose() {
    this._ldrTarget.dispose();
    this.releaseGridColor();
    this.releaseDirectFrame();
    this.releaseOcclusionColor();
    this.releaseOverlayColor();
    this._gridBlendQuad.dispose();
    this._screenCopyQuad.dispose();
    this._occlusionBlendQuad.dispose();
    this._whiteAo.dispose();
    this.capture.dispose();
    this.pyramid.dispose();
    this.ao.dispose();
    this.worldAo.dispose();
    this.denoise.dispose();
    this.composite.dispose();
    this.fxaa.dispose();
  }
}
