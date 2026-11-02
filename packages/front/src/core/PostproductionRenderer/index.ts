import * as THREE from "three";
import * as OBC from "@thatopen/components";
import { RendererWith2D } from "../Marker";
import { Postproduction } from "./src";
// The enum comes from its leaf module: this class initializes fields from it
// (`manualDefaultStyle`, `_previousStyle`) and "./src" is in an import cycle
// with this file. See the note in ./src/modes.ts.
import { PostproductionAspect, PostproductionMode } from "./src/modes";
import { WebGPUPostproduction } from "./src/webgpu-postproduction";

export {
  PostproductionAspect,
  PostproductionMode,
  GlossPass,
  EdgeDetectionPassMode,
  DeferredPipeline,
  DeferredAoMode,
} from "./src";
export type { OcclusionPass, OcclusionPassContext } from "./src";

/**
 * WebGPU only: dynamic resolution while the camera moves. See
 * {@link PostproductionRenderer.movingResolution}.
 *
 * The canvas keeps its full pixel ratio all the time. A second composition is
 * mounted with `sceneScale` (the scene pass, AO and composite at that fraction
 * of the canvas; the FXAA upscales) and drawn while the camera moves; after
 * {@link settleMs} without movement the renderer's own pipeline draws again.
 * Switching is choosing which pipeline renders: nothing is resized or rebuilt
 * (changing the pixel ratio instead cost a 55-92 ms frame per switch).
 */
export class MovingResolution {
  /** Off by default: an app that does not opt in draws exactly as before. */
  enabled = false;

  /**
   * Fraction of the canvas the scene pass draws at while moving. 0.5 on a
   * DPR-2 screen is DPR 1. Never below DPR 1 while moving (below one CSS
   * pixel the image reads as blur, not as speed), so it is clamped to
   * `>= 1 / pixelRatio` at mount; on a DPR-1 screen that makes it 1 and
   * nothing is switched at all.
   */
  scale = 1 / ((globalThis as any).devicePixelRatio || 1);

  /**
   * How long the camera must stay still before the full-resolution pipeline
   * draws again. A move/stop/move cycle switches on cheap frames, so a short
   * settle is affordable, and it adds full-resolution frames inside short
   * pauses.
   */
  settleMs = 500;

  /**
   * The moving composition rebuilds the normal from depth instead of writing
   * a normal attachment (see `normalFromDepth` in composition.mjs). The still
   * one keeps its own normals.
   */
  normalFromDepth = true;

  /**
   * Fired with the pipeline about to draw whenever it changes, BEFORE that
   * frame renders. Anything that draws on its own schedule and rests while
   * the camera is still can be woken here, so the full-resolution frame is
   * drawn.
   */
  readonly onSwitch = new OBC.Event<"low" | "full">();

  /** Which pipeline drew the last frame. */
  get active() {
    return this._active;
  }

  /** How many times the drawing pipeline changed (low to full or back). */
  get switches() {
    return this._switches;
  }

  /** How many times the low pipeline was mounted (first mount included). */
  get remounts() {
    return this._remounts;
  }

  /** @internal Written by the renderer only. */
  _active: "low" | "full" = "full";
  /** @internal */
  _switches = 0;
  /** @internal */
  _remounts = 0;
}

/**
 * A class that extends RendererWith2D and adds post-processing capabilities. 📕 [Tutorial](https://docs.thatopen.com/Tutorials/Components/Front/PostproductionRenderer). 📘 [API](https://docs.thatopen.com/api/@thatopen/components-front/classes/PostproductionRenderer).
 */
export class PostproductionRenderer extends RendererWith2D {
  /**
   * The default style to use when the mode is MANUAL.
   */
  manualDefaultStyle = PostproductionAspect.COLOR;

  /**
   * Whether the postproduction will temporarily be turned off when the mode is MANUAL to get a more fluid navigation experience.
   */
  turnOffOnManualMode = true;

  /**
   * The delay in milliseconds to wait before turning the postproduction back on when the mode is MANUAL.
   */
  manualModeDelay = 50;

  private _postproduction?: Postproduction;
  private _timeout: ReturnType<typeof setTimeout> | null = null;
  private _previousStyle: PostproductionAspect = PostproductionAspect.COLOR;
  private _previousEnabled: boolean = false;
  /**
   * Getter for the postproduction instance.
   * Throws an error if the postproduction instance is not yet initialized.
   *
   * @returns The initialized Postproduction instance.
   */
  get postproduction(): Postproduction {
    if (this.api === "webgpu") {
      // The same API under WebGPU, so app code does not branch on the engine:
      // `enabled` and `style` drive the TSL composition, which always has the
      // WebGL DEFERRED look. See WebGPUPostproduction for what is inert.
      return this._gpuPostproduction as unknown as Postproduction;
    }
    if (!this._postproduction) {
      throw new Error("Renderer not initialized yet with a world!");
    }
    return this._postproduction;
  }

  /**
   * WebGL only: resolution the postproduction passes render at.
   *
   * `false` (default) sizes them at the native drawing-buffer resolution
   * (`clientSize * min(devicePixelRatio, 2)`), so postproduction is
   * pixel-sharp and 1:1 with the canvas. This is the resolution the composer
   * has always drawn at.
   *
   * `true` sizes them in CSS pixels: lighter on a HiDPI screen, where the
   * result is upscaled to the canvas and so slightly soft. The deferred
   * pipeline's `renderScale` is the per-frame quality/perf lever on top.
   *
   * Applied uniformly to the first-load and resize paths, so flipping it and
   * calling {@link applyPostproductionSize} takes effect immediately, with no
   * resize event needed.
   */
  cssSize = false;

  /**
   * WebGL only: when true, the renderer measures its frame time and
   * automatically scales the postproduction resolution down (never below
   * {@link adaptiveMinScale}) to hold {@link adaptiveTargetFps}. Off by
   * default. It layers under {@link cssSize} and the deferred `renderScale`:
   * those set the resolution ceiling, this only pulls down from it to protect
   * the framerate.
   *
   * The signal is the inter-frame interval, so on a vsync-locked display it
   * never reads faster than the refresh rate: once it reaches the target it
   * settles rather than creeping the resolution back up on its own.
   */
  adaptiveResolution = false;

  /** Framerate the adaptive resolution scaler aims to hold (see {@link adaptiveResolution}). */
  adaptiveTargetFps = 60;

  /**
   * Lowest internal scale the adaptive resolution scaler may drop to. 1 =
   * native; 0.75 (default) = three-quarter resolution, soft but readable.
   * Kept fairly high on purpose: a slow-but-legible viewer beats a blurry one.
   *
   * This is relative to the resolution ceiling, and is additionally floored
   * so the result never falls below one device-independent pixel. On a DPR 1
   * screen (or with {@link cssSize}) the ceiling is already 1, so the scaler
   * holds at 1 rather than rendering below CSS resolution.
   */
  adaptiveMinScale = 0.75;

  /** When true, the adaptive scaler logs its per-evaluation state to the console. */
  adaptiveDebug = false;

  /**
   * Highest internal scale the adaptive scaler may rise to when there is
   * frame-time headroom. `1` = never exceed the native/{@link cssSize}
   * resolution. `> 1` = allow rendering above native and downsampling for
   * crisper edges (supersampling) when the GPU can afford it: the scaler only
   * reaches it under sustained headroom, so it stays self-limiting. Combined
   * ceiling is `min(devicePixelRatio, 2) * adaptiveMaxScale`.
   */
  adaptiveMaxScale = 1;

  /**
   * The resolution multiplier the adaptive scaler works down from: 1 in CSS
   * pixels, or the clamped device pixel ratio at native drawing-buffer size.
   */
  private get _resolutionCeiling() {
    return this.cssSize ? 1 : Math.min(window.devicePixelRatio, 2);
  }

  /**
   * Lowest scale the adaptive scaler may actually reach. {@link adaptiveMinScale}
   * is relative to the ceiling, so on its own it would let the product fall
   * below one device-independent pixel. Floored here so the scaler never winds
   * down into a range that {@link setPostproductionSize} would clamp away
   * anyway, which would also make recovery needlessly slow.
   */
  private get _effectiveMinScale() {
    return Math.max(this.adaptiveMinScale, 1 / this._resolutionCeiling);
  }

  private _adaptiveScale = 1;
  private _frameMsEma = 0;
  private _lastFrameStamp = 0;
  private _adaptiveFrames = 0;
  // Debounce for the adaptive scaler: the proposed step direction (-1 shed,
  // +1 recover, 0 hold) from the previous evaluation. A recovery step only
  // happens when the same direction is seen twice in a row.
  private _adaptivePending = 0;

  /**
   * WebGPU only (`mode: "webgpu"`): the mounted postproduction pipeline (the
   * TSL composition: AO, contour, tonal shade, sheen, FXAA, outlines,
   * overlays), mounted over this world's scene and camera. Null under WebGL,
   * where {@link postproduction} is the GLSL pipeline.
   */
  pipeline: any = null;

  /**
   * WebGPU only: the options the composition is mounted with. `face` (the
   * face-id channel) carries the contour's interior edges; the rest are the
   * WebGL DEFERRED defaults (half-float scene colour, tonal shade, sheen,
   * dither, FXAA).
   */
  webgpuPost: Record<string, any> = {
    face: true,
    ao: true,
    edges: true,
    fxaa: true,
    scene8: false,
    faceR8: false,
    tonal: true,
    sheen: true,
    dither: true,
  };

  /**
   * WebGPU only: how many compiled pipelines are kept besides the one drawing.
   *
   * Under WebGL a style or a pen width is a uniform, so flipping it costs
   * nothing. Under WebGPU it is compiled in, and an app that alternates it
   * (sheets photographed some in PEN and some in COLOR, say) recompiled on
   * every flip, each one a 130-380 ms frame. Keeping the pipelines already
   * compiled makes a flip back a swap. Every kept pipeline holds its
   * full-resolution targets, hence the cap; 0 restores the
   * dispose-on-remount behaviour.
   */
  pipelineCacheSize = 3;

  /** WebGPU only: remounts served from the kept pipelines, compiled and disposed. */
  readonly pipelineStats = { reused: 0, compiled: 0, disposed: 0 };

  /**
   * WebGPU only, opt-in: a lower-resolution composition draws while the
   * camera moves and the full one once it has been still for `settleMs`. See
   * {@link MovingResolution}.
   *
   * {@link pipeline} stays the full one. The low pipeline lives apart and is
   * only ever chosen at draw time, so the remount check and the kept-pipeline
   * cache never see it: a low pipeline put in that cache could later be
   * reused as the full one, since the remount check ignores `sceneScale`.
   */
  readonly movingResolution = new MovingResolution();

  /**
   * The picture held as it is: while true, nothing is drawn and the screen
   * keeps the last picture, everything else of an update going on
   * (`onBeforeUpdate`, which the models' tiles follow). For a change made of
   * several steps, each a round trip to a worker, that has to be seen as one
   * (a body shown again and its outline put on it, with what stood in for it
   * taken away). Whoever holds it lets it go, and the next frame draws all of
   * it together. Not `enabled`, which stops the updates too.
   *
   * WebGPU only for now: under WebGL it is ignored.
   */
  pictureHeld = false;

  /**
   * WebGPU only: pipelines being made aside now (see `_pipelinesMadeAside`);
   * what needs them is drawn when they are.
   */
  pipelinesBeingMade = 0;

  /** WebGPU only: the camera the pipeline was mounted with; a different one remounts. */
  private _pipelineCamera: THREE.Camera | null = null;

  /** WebGPU only: mounts in flight, so `update` never starts a second one. */
  private _mounting = 0;

  /** WebGPU only: the composition module, once imported. */
  private _composition: any = null;

  /** WebGPU only: two update cycles of one frame are closer than this (ms); the second is not drawn. */
  private _lastGpuRenderAt = -Infinity;

  /** WebGPU only: compiled pipelines not drawing now, oldest first. */
  private _keptPipelines: { pipeline: any; camera: THREE.Camera | null }[] =
    [];

  /** WebGPU only: the moving composition (see {@link movingResolution}), never kept nor reused. */
  private _lowPipeline: any = null;
  /** What the low pipeline was mounted for: a camera object or an option change remounts it. */
  private _lowCamera: THREE.Camera | null = null;
  private _lowNormalFromDepth = false;

  /** The camera (matrixWorld then projection) as last drawn, to tell movement. */
  private readonly _lastCameraState = new Float64Array(32);
  private _lastCameraSampled: THREE.Camera | null = null;
  private _lastMoveAt = -Infinity;

  private _asidePatched = false;
  private _asideNow = false;
  /** Whether the full-screen passes are made aside too: only while a composition is drawn off the screen (`_madeWhole`). */
  private _asideAll = false;
  /** Pipelines put aside since this was last set to 0. */
  private _madeAsideNow = 0;
  /** The compositions drawn whole at least once: every pipeline they use is made. */
  private readonly _whole = new WeakSet<object>();
  private _wholeTarget: THREE.RenderTarget | null = null;

  private _webgpuPostproduction?: WebGPUPostproduction;

  /** WebGPU: the `postproduction` surface, created on first use. */
  private get _gpuPostproduction() {
    if (!this._webgpuPostproduction) {
      this._webgpuPostproduction = new WebGPUPostproduction(this);
    }
    return this._webgpuPostproduction;
  }

  /** WebGPU: the colour of the page behind the opaque canvas, painted where the scene has no background. */
  private readonly _pageColor = new THREE.Color(1, 1, 1);

  constructor(
    components: OBC.Components,
    container: HTMLElement,
    parameters?: OBC.SimpleRendererParameters,
  ) {
    super(components, container, parameters);

    this._keepRenderOrderUnderReversedDepth();

    this.onResize.add((size) => {
      if (this.api === "webgpu") {
        // The composite holds this colour object, so refreshing it is enough.
        this._pageColorForCanvas();
        return;
      }
      this.setPostproductionSize(size);
    });

    this.onWorldChanged.add(() => {
      if (this.currentWorld && this.api === "webgpu") {
        this._mountPipeline();
        return;
      }
      if (this.currentWorld) {
        if (this._postproduction) {
          this._postproduction.dispose();
        }
        this._postproduction = new Postproduction(components, this);

        this._postproduction.onStyleChanged.add(
          (style: PostproductionAspect) => {
            this._previousStyle = style;
          },
        );

        this.setPostproductionSize();
      }
    });
  }

  /**
   * WebGL with a reversed depth buffer only (`reversedDepthBuffer: true` in
   * the renderer parameters, opt-in): keeps `renderOrder` the right way up.
   *
   * Before three r186, `WebGLRenderList.sort` sorts as usual and then, when
   * the depth buffer is reversed, reverses the whole list. That flips the
   * depth order it means to flip, and also every `renderOrder` and group
   * order, which it does not: a cut fill (1000) was drawn after its own cut
   * lines (1001) and covered them. So the two ordering keys are sorted
   * backwards here and three's reversal puts them back, while the depth part
   * of each comparison is left as three writes it.
   *
   * From r186 three negates the projected z as each item is listed and sorts
   * once, so its own order is already right and nothing is changed.
   */
  private _keepRenderOrderUnderReversedDepth() {
    if (this.api !== "webgl") return;
    const threeReversesItsLists = Number(THREE.REVISION) < 186;
    const capabilities = (this.three as any).capabilities;
    if (!threeReversesItsLists || capabilities?.reversedDepthBuffer !== true) {
      return;
    }
    const orderFirst = (a: any, b: any) =>
      a.groupOrder !== b.groupOrder
        ? b.groupOrder - a.groupOrder
        : a.renderOrder !== b.renderOrder
          ? b.renderOrder - a.renderOrder
          : 0;
    this.three.setOpaqueSort((a: any, b: any) => {
      const first = orderFirst(a, b);
      if (first !== 0) return first;
      if (a.material.id !== b.material.id) return a.material.id - b.material.id;
      if (a.z !== b.z) return a.z - b.z;
      return a.id - b.id;
    });
    this.three.setTransparentSort((a: any, b: any) => {
      const first = orderFirst(a, b);
      if (first !== 0) return first;
      if (a.z !== b.z) return b.z - a.z;
      return a.id - b.id;
    });
  }

  /**
   * WebGPU only: the pipeline that drew the last frame (the low one while
   * moving, see {@link movingResolution}). Depth readers want this one.
   */
  get drawnPipeline(): any {
    return this.movingResolution.active === "low" && this._lowPipeline
      ? this._lowPipeline
      : this.pipeline;
  }

  /**
   * WebGPU only: rebuilds the composition over the current world. Which
   * passes are compiled in is decided at mount, so a change the next frame
   * would not pick up on its own can be forced with this.
   */
  remountPipeline() {
    if (this.api !== "webgpu" || !this.currentWorld) return;
    this._mountPipeline();
  }

  /**
   * WebGPU only: puts the drawing pipeline aside instead of disposing it,
   * freeing the oldest beyond {@link pipelineCacheSize}.
   */
  private _keepPipeline(pipeline: any, camera: THREE.Camera | null) {
    if (!pipeline) return;
    this._keptPipelines.push({ pipeline, camera });
    while (this._keptPipelines.length > Math.max(0, this.pipelineCacheSize)) {
      this._keptPipelines.shift()!.pipeline.dispose?.();
      this.pipelineStats.disposed++;
    }
  }

  /**
   * WebGPU only: switches to a kept pipeline that compiled what the settings
   * ask for, for this camera. True when one was found, so no mount is needed.
   */
  private _reuseKeptPipeline(camera: THREE.Camera) {
    const post = this._gpuPostproduction;
    const index = this._keptPipelines.findIndex(
      (kept) =>
        kept.camera === camera &&
        !post.needsRemount(kept.pipeline.compiled, this.webgpuPost),
    );
    if (index < 0) return false;
    const [kept] = this._keptPipelines.splice(index, 1);
    this._keepPipeline(this.pipeline, this._pipelineCamera);
    this.pipeline = kept.pipeline;
    this._pipelineCamera = camera;
    this.pipelineStats.reused++;
    // A frame for the swapped pipeline, as for a compiled one.
    this.needsUpdate = true;
    return true;
  }

  /**
   * Mounts the composition over the current world. A dynamic import on
   * purpose: it only ever runs in WebGPU mode, where `three` is the
   * `three/webgpu` build, so a WebGL application never loads the module.
   */
  private async _mountPipeline() {
    const world = this.currentWorld;
    if (!world) return;
    this._mounting++;
    try {
      const oldCamera = this._pipelineCamera;
      // Recorded before the await so `update` does not start a second mount;
      // `world.camera` throws until the world has one.
      try {
        this._pipelineCamera = world.camera.three;
      } catch {
        this._pipelineCamera = null;
      }
      if (!this._composition) {
        this._composition = await import(
          // @ts-ignore: plain-JS module, typed through `pipeline: any`.
          "./webgpu/composition/composition.mjs"
        );
      }
      if (this.currentWorld !== world) return;
      let camera: THREE.Camera;
      try {
        camera = world.camera.three;
      } catch {
        // No camera yet: the first frame with one mounts (see `_drawWebGPU`).
        this._pipelineCamera = null;
        return;
      }
      // The settings may have moved on during the import: the drawing
      // pipeline or a kept one is taken when it already compiles what is
      // asked, instead of compiling a duplicate.
      const old = this.pipeline;
      if (
        old &&
        oldCamera === camera &&
        !this._gpuPostproduction.needsRemount(old.compiled, this.webgpuPost)
      ) {
        this._pipelineCamera = camera;
        return;
      }
      this._pipelineCamera = oldCamera;
      if (this._reuseKeptPipeline(camera)) return;
      this._composeNow(world, camera);
    } finally {
      this._mounting--;
    }
  }

  /**
   * WebGPU only: compiles a pipeline for the current settings, synchronously,
   * and makes it the drawing one, so the update after a setting changes
   * draws with it (the same contract as WebGL). Only the first import is
   * asynchronous. The previous one is kept (see {@link pipelineCacheSize}).
   */
  private _composeNow(world: OBC.World, camera: THREE.Camera) {
    const old = this.pipeline;
    const oldCamera = this._pipelineCamera;
    // The AO, the cues and the contour pick their perspective or orthographic
    // reconstruction from this camera when they are built, which is why a
    // camera switch remounts rather than updating uniforms.
    this.pipeline = this._composition.mountComposition(
      this.three,
      world.scene.three,
      camera,
      {
        ...this._gpuPostproduction.mountOptions(this.webgpuPost),
        page: this._pageColorForCanvas(),
      },
    );
    this._pipelineCamera = camera;
    this.pipelineStats.compiled++;
    this._keepPipeline(old, oldCamera);
    // A frame for the new pipeline, which a MANUAL-mode renderer would
    // otherwise not draw until something else asked for one.
    this.needsUpdate = true;
  }

  /**
   * WebGPU only: the first non-transparent CSS background from the container
   * up (out of a shadow root through its host), white when there is none.
   * Null for a transparent canvas, which keeps its alpha instead.
   */
  private _pageColorForCanvas() {
    if ((this.three as any).alpha === true) return null;
    let element: HTMLElement | null = this.container;
    let found = false;
    while (element && !found) {
      const css = getComputedStyle(element).backgroundColor;
      const parts = css.match(/[\d.]+/g)?.map(Number) ?? [];
      const alpha = parts.length >= 4 ? parts[3] : parts.length === 3 ? 1 : 0;
      if (parts.length >= 3 && alpha > 0) {
        this._pageColor.setRGB(parts[0] / 255, parts[1] / 255, parts[2] / 255);
        found = true;
      }
      const root = element.getRootNode() as ShadowRoot | Document;
      element =
        element.parentElement ??
        ((root as ShadowRoot).host as HTMLElement | undefined) ??
        null;
    }
    if (!found) this._pageColor.setRGB(1, 1, 1);
    return this._pageColor;
  }

  /**
   * Whether the camera moved since the last drawn frame (relative tolerance
   * 1e-5). The first sample of a camera object only records it: a fresh
   * page, or a projection toggle, is not a movement.
   */
  private _cameraMoved(camera: THREE.Camera) {
    camera.updateMatrixWorld();
    const world = camera.matrixWorld.elements;
    const projection = camera.projectionMatrix.elements;
    const last = this._lastCameraState;
    const first = this._lastCameraSampled !== camera;
    let moved = false;
    for (let k = 0; k < 32 && !moved; k++) {
      const value = k < 16 ? world[k] : projection[k - 16];
      moved = Math.abs(value - last[k]) > 1e-5 * (1 + Math.abs(value));
    }
    if (moved || first) {
      last.set(world);
      last.set(projection, 16);
      this._lastCameraSampled = camera;
    }
    return moved && !first;
  }

  /** The moving scene scale after the DPR-1 floor; 1 means there is nothing to gain. */
  private _movingSceneScale() {
    const ratio = this.three.getPixelRatio?.() || window.devicePixelRatio || 1;
    return Math.min(1, Math.max(this.movingResolution.scale, 1 / ratio));
  }

  /** Frees the moving composition (disabled, disposed, or replaced by a remount). */
  private _disposeLowPipeline() {
    this._lowPipeline?.dispose?.();
    this._lowPipeline = null;
    this._lowCamera = null;
  }

  /**
   * The moving composition for this camera and the current settings, mounted
   * lazily when the settings, the camera object, the scale or
   * `normalFromDepth` changed since it was mounted. It follows the full
   * pipeline's settings: same `mountOptions`, so a style that remounted the
   * full one remounts this one the next time it draws.
   */
  private _lowPipelineFor(
    world: OBC.World,
    camera: THREE.Camera,
    scale: number,
  ) {
    const mr = this.movingResolution;
    const low = this._lowPipeline;
    if (
      low &&
      this._lowCamera === camera &&
      this._lowNormalFromDepth === mr.normalFromDepth &&
      low.compiled?.sceneScale === scale &&
      !this._gpuPostproduction.needsRemount(low.compiled, this.webgpuPost)
    ) {
      return low;
    }
    this._disposeLowPipeline();
    const next = this._composition.mountComposition(
      this.three,
      world.scene.three,
      camera,
      {
        ...this._gpuPostproduction.mountOptions(this.webgpuPost),
        page: this._pageColorForCanvas(),
        sceneScale: scale,
        ...(mr.normalFromDepth ? { normalFromDepth: true } : {}),
      },
    );
    // Per-look values an app writes on `pipeline.look.settings` (the
    // gradient reflection, say). Both mounts normally get the same settings
    // object from `mountOptions`; one mounted with its own gets them copied.
    const full = this.pipeline?.look?.settings;
    const own = next.look?.settings;
    if (full && own && full !== own) {
      for (const key of Object.keys(full)) {
        if (key.startsWith("reflection")) own[key] = full[key];
      }
    }
    this._lowPipeline = next;
    this._lowCamera = camera;
    this._lowNormalFromDepth = mr.normalFromDepth;
    mr._remounts++;
    return next;
  }

  /**
   * WebGPU only: which pipeline draws this frame. Low while the camera moved
   * within `settleMs`, full otherwise; never low for a pass drawn into a
   * render target (a photo moves the camera on purpose and must get the full
   * picture). Movement is read here, in the renderer's own update.
   */
  private _pipelineToDraw(
    world: OBC.World,
    camera: THREE.Camera,
    now: number,
  ) {
    const mr = this.movingResolution;
    // Off: not even the camera is read (an app that never opts in pays
    // nothing), and re-enabling starts from a fresh sample.
    if (!mr.enabled) {
      this._lastCameraSampled = null;
      this._noteDrawn("full");
      if (this._lowPipeline) this._disposeLowPipeline();
      return this.pipeline;
    }
    if (this._cameraMoved(camera)) this._lastMoveAt = now;
    const scale = this._movingSceneScale();
    const low =
      scale < 1 &&
      this._composition &&
      this.three.getRenderTarget() === null &&
      now - this._lastMoveAt < mr.settleMs;
    const drawing = low
      ? this._lowPipelineFor(world, camera, scale)
      : this.pipeline;
    this._noteDrawn(drawing === this.pipeline ? "full" : "low");
    // Mounted for a camera object that is gone (a projection toggle): its
    // targets are freed now, not at the next movement.
    if (this._lowPipeline && this._lowCamera !== camera) {
      this._disposeLowPipeline();
    }
    return drawing;
  }

  /** Counts a change of drawing pipeline and announces it before the frame renders. */
  private _noteDrawn(which: "low" | "full") {
    const mr = this.movingResolution;
    if (mr._active === which) return;
    // Written before the trigger, so a listener reading `active` sees the new one.
    mr._active = which;
    mr._switches++;
    mr.onSwitch.trigger(which);
  }

  /**
   * The last, full-resolution frame. Called on every update, before the
   * MANUAL-mode early return: while the last drawn frame was the low one and
   * the camera has been still for `settleMs` (or the feature was switched
   * off), it asks for a frame. The request is repeated every update until a
   * frame really draws with the full pipeline, so a frame lost to the 4 ms
   * double-cycle guard is asked again on the next one.
   */
  private _wakeForFullFrame() {
    const mr = this.movingResolution;
    if (mr._active !== "low") return;
    if (!mr.enabled || performance.now() - this._lastMoveAt >= mr.settleMs) {
      this.needsUpdate = true;
    }
  }

  /**
   * WebGPU only: a pipeline not made yet is made aside, and what needs it is
   * drawn when it is. The first time a look is drawn three makes its
   * pipelines on the spot, and the GPU process stops every frame until it has
   * compiled them (tasks of 100 to 275 ms, once). Made with
   * `createRenderPipelineAsync` they compile beside the frames; three already
   * skips drawing what has no pipeline yet, and each one asks for a frame
   * when it is made.
   *
   * Only for the picture drawn for the screen, which is drawn again: a
   * picture drawn once into a target and kept (a photo, a thumbnail) is made
   * whole, as before. And never for a full-screen pass of the composition
   * (`isQuadMesh`): skipped, it would leave a frame blank.
   *
   * Duck-typed on three's internal pipeline cache: a three without it is
   * left as it is.
   */
  private _pipelinesMadeAside() {
    if (this._asidePatched) return;
    const pipelines = (this.three as any)._pipelines;
    if (!pipelines?.getForRender) return;
    this._asidePatched = true;
    const made = pipelines.getForRender.bind(pipelines);
    const aside = {
      push: (making: Promise<unknown>) => {
        this.pipelinesBeingMade++;
        this._madeAsideNow++;
        making.finally(() => {
          this.pipelinesBeingMade--;
          this.needsUpdate = true;
        });
      },
    };
    pipelines.getForRender = (
      renderObject: any,
      promises: unknown[] | null = null,
    ) =>
      made(
        renderObject,
        promises ??
          (this._asideNow &&
          (this._asideAll || !renderObject.object?.isQuadMesh)
            ? aside
            : null),
      );
  }

  /**
   * WebGPU only: a composition is drawn to the screen only once it is made
   * whole. Its full-screen passes are the heaviest shaders there are, and
   * each new one stopped the GPU process for 100 to 600 ms the first time.
   * Skipped instead, they would leave the frame blank. So a composition the
   * screen has not had yet is drawn off it, into a target, with every
   * pipeline made aside, until a drawing of it puts nothing aside: then it is
   * whole, and drawn to the screen. True when it is.
   */
  private _madeWhole(drawing: any): boolean {
    if (this._whole.has(drawing)) return true;
    // Its pipelines from the last try are still being made.
    if (this.pipelinesBeingMade > 0) return false;
    const size = this.three.getDrawingBufferSize(new THREE.Vector2());
    let rt = this._wholeTarget;
    if (!rt || rt.width !== size.x || rt.height !== size.y) {
      rt?.dispose();
      // As the frame three draws a composition into before the screen, so its pipelines are those.
      rt = this._wholeTarget = new THREE.RenderTarget(size.x, size.y, {
        type: THREE.UnsignedByteType,
        depthBuffer: true,
      });
    }
    const was = this.three.getRenderTarget();
    this._madeAsideNow = 0;
    this._asideAll = true;
    this.three.setRenderTarget(rt as any);
    try {
      drawing.__refresh?.();
      drawing.render();
    } finally {
      this.three.setRenderTarget(was);
      this._asideAll = false;
    }
    if (this._madeAsideNow > 0) return false;
    this._whole.add(drawing);
    return true;
  }

  /**
   * WebGPU only: the frame. The composition when the postproduction is on
   * (remounted first when the camera object or a compiled-in setting
   * changed; the low one while moving), the scene plainly otherwise.
   */
  private _updateWebGPU() {
    if (!this.currentWorld) return;
    // A frame not drawn here keeps its request: in MANUAL mode it was
    // already cleared, and would otherwise be lost.
    if (!this._webgpuInitialized) {
      this.needsUpdate = true;
      return;
    }
    // `update()` can run twice per screen frame; drawing the whole pipeline
    // twice is wasted. Two cycles of one frame are closer than any real frame.
    const now = performance.now();
    if (now - this._lastGpuRenderAt < 4) {
      this.needsUpdate = true;
      return;
    }
    this._lastGpuRenderAt = now;

    this.onBeforeUpdate.trigger();
    // Held: everything goes on but the drawing, and the frame is asked again
    // for when it is let go (see `pictureHeld`).
    if (this.pictureHeld) {
      this.needsUpdate = true;
      return;
    }
    this._pipelinesMadeAside();
    // Only the picture drawn for the screen, which is drawn again: see `_pipelinesMadeAside`.
    this._asideNow = this.three.getRenderTarget() === null;
    try {
      this._drawWebGPU(now);
    } finally {
      this._asideNow = false;
    }
  }

  private _drawWebGPU(now: number) {
    if (!this.currentWorld) return;
    const scene = this.currentWorld.scene.three;
    const camera = this.currentWorld.camera.three;
    this.syncWebGPUClipping(scene);
    const post = this._gpuPostproduction;
    // Not mounted yet (the world had no camera when it was assigned).
    if (post.enabled && !this.pipeline && this._mounting === 0) {
      this._mountPipeline();
    }
    // Remount when the camera object changed or when a setting that decides
    // what is compiled no longer matches the mounted pipeline. A kept
    // pipeline is taken when one fits; otherwise it is compiled now.
    if (
      post.enabled &&
      this.pipeline &&
      this._mounting === 0 &&
      (camera !== this._pipelineCamera ||
        post.needsRemount(this.pipeline.compiled, this.webgpuPost)) &&
      !this._reuseKeptPipeline(camera)
    ) {
      if (this._composition) this._composeNow(this.currentWorld, camera);
      else this._mountPipeline();
    }
    if (post.enabled && this.pipeline) {
      // The logic above only ever looks at the full pipeline; which one
      // draws (the low one while moving) is decided here, after it.
      let drawing = this._pipelineToDraw(this.currentWorld, camera, now);
      // A composition not made whole yet is not drawn to the screen (see
      // `_madeWhole`). Moving, the full one draws meanwhile; a new one
      // leaves the last picture on the screen until it is made.
      if (this._asideNow && !this._madeWhole(drawing)) {
        if (drawing !== this.pipeline && this._whole.has(this.pipeline)) {
          drawing = this.pipeline;
          this._noteDrawn("full");
        } else {
          this.needsUpdate = true;
          this.onAfterUpdate.trigger();
          return;
        }
      }
      drawing.__refresh?.();
      drawing.render();
    } else {
      this._noteDrawn("full");
      this.renderOverPage(scene, camera);
    }
    // The CSS2D layer is drawn by RendererWith2D on `onAfterUpdate`.
    this.onAfterUpdate.trigger();
  }

  /** {@link Updateable.update} */
  update() {
    if (!this.enabled) return;
    if (!this.currentWorld) {
      return;
    }

    if (this.api === "webgpu") this._wakeForFullFrame();

    if (this.mode === OBC.RendererMode.MANUAL && !this.needsUpdate) {
      return;
    }
    this.needsUpdate = false;

    if (this.api === "webgpu") {
      this._updateWebGPU();
      return;
    }

    this._updateAdaptiveScale();

    this.onBeforeUpdate.trigger();
    const scene = this.currentWorld.scene.three;
    const camera = this.currentWorld.camera.three;

    const isManualMode = this.mode === OBC.RendererMode.MANUAL;
    if (isManualMode) {
      if (this.turnOffOnManualMode) {
        // Record the app's value only on the first paint of a burst: from
        // the second paint on, `enabled` is the `false` set right below.
        if (this._timeout === null) {
          this._previousEnabled = this.postproduction.enabled;
        }
        if (this.postproduction.enabled) {
          this.postproduction.enabled = false;
        }
      }

      if (this.manualDefaultStyle !== this.postproduction.style) {
        this.setStyleWithoutEvent(this.manualDefaultStyle);
      }
    }

    if (this.postproduction.enabled) {
      this.postproduction.update();
    } else {
      this.three.render(scene, camera);
    }
    // The CSS2D layer is drawn once by RendererWith2D on `onAfterUpdate`
    // below; drawing it here too walked the whole scene a second time.

    if (this.mode === OBC.RendererMode.MANUAL) {
      // Use postproduction only on last frame
      if (this._timeout) {
        clearTimeout(this._timeout);
      }

      this._timeout = setTimeout(() => {
        this._timeout = null;
        if (this.turnOffOnManualMode) {
          this.postproduction.enabled = this._previousEnabled;
        }

        this.setStyleWithoutEvent(this._previousStyle);

        if (this.postproduction.enabled) {
          this.postproduction.update();
        }
      }, this.manualModeDelay);
    }

    this.onAfterUpdate.trigger();
  }

  /**
   * Cheap repaint for overlay-only changes (a measurement marker moving on an
   * unchanged scene): re-composites the cached deferred G-buffer + redraws the
   * overlays, SKIPPING the capture. Reserve the full {@link update} for real
   * camera/scene changes. Falls back to a full update when the deferred
   * pipeline is not the active path.
   */
  updateOverlayOnly() {
    if (!this.enabled || !this.currentWorld) return;
    // WebGPU keeps no G-buffer to re-composite: a full update is the repaint.
    if (this.api === "webgpu") {
      this.update();
      return;
    }
    if (
      !this.postproduction.enabled ||
      this.postproduction.mode !== PostproductionMode.DEFERRED
    ) {
      this.update();
      return;
    }
    this.onBeforeUpdate.trigger();
    this.postproduction.updateOverlayOnly();
    // CSS2D: drawn once by RendererWith2D on `onAfterUpdate`.
    this.onAfterUpdate.trigger();
  }

  /**
   * Re-applies the current container size to the postproduction passes. Public
   * so the deferred pipeline can request a correct size right after it is
   * lazily constructed, and so a change of {@link cssSize} takes effect
   * without waiting for a resize.
   */
  applyPostproductionSize() {
    this.setPostproductionSize();
  }

  /** {@link OBC.Disposable.dispose}. */
  dispose() {
    if (this._timeout !== null) {
      clearTimeout(this._timeout);
      this._timeout = null;
    }
    super.dispose();
    if (this.api === "webgpu") {
      this.pipeline?.dispose?.();
      this.pipeline = null;
      for (const kept of this._keptPipelines) kept.pipeline.dispose?.();
      this._keptPipelines.length = 0;
      this._disposeLowPipeline();
      this._wholeTarget?.dispose();
      this._wholeTarget = null;
      this.movingResolution.onSwitch.reset();
      this._webgpuPostproduction?.dispose();
      return;
    }
    this.postproduction.dispose();
  }

  // used to set the style without setting the _previousStyle
  private setStyleWithoutEvent(style: PostproductionAspect) {
    this.postproduction.onStyleChanged.enabled = false;
    this.postproduction.style = style;
    this.postproduction.onStyleChanged.enabled = true;
  }

  private setPostproductionSize(size?: THREE.Vector2) {
    if (size) {
      if (size.x === 0 || size.y === 0) {
        return;
      }
    }
    if (!this.container || !this._postproduction) {
      return;
    }
    // The resize event delivers the container size in CSS pixels; the no-arg
    // path reads the same from the container. `cssSize` picks the multiplier
    // applied to both paths uniformly: 1 for CSS pixels, the clamped device
    // pixel ratio for the native drawing-buffer resolution.
    const ceiling = this._resolutionCeiling;
    const adaptive = this.adaptiveResolution ? this._adaptiveScale : 1;
    // Never below one device-independent pixel: softer than the CSS
    // resolution of the canvas reads as blur rather than as a performance
    // trade. On a DPR 1 screen this pins the ratio at 1.
    const ratio = Math.max(1, ceiling * adaptive);
    const width = (size?.x ?? this.container.clientWidth) * ratio;
    const height = (size?.y ?? this.container.clientHeight) * ratio;
    if (width === 0 || height === 0) {
      return;
    }
    this.postproduction.setSize(width, height);
  }

  /**
   * Frame-time-driven resolution control (see {@link adaptiveResolution}).
   * Tracks a smoothed inter-frame interval and, every few frames, nudges an
   * internal scale in [{@link adaptiveMinScale}, {@link adaptiveMaxScale}]
   * toward holding {@link adaptiveTargetFps}. It only reallocates the passes
   * when the scale actually steps, and resets to full resolution once when
   * switched off.
   */
  private _updateAdaptiveScale() {
    if (!this.adaptiveResolution) {
      if (this._adaptiveScale !== 1) {
        this._adaptiveScale = 1;
        this.setPostproductionSize();
      }
      this._frameMsEma = 0;
      this._lastFrameStamp = 0;
      this._adaptiveFrames = 0;
      this._adaptivePending = 0;
      return;
    }

    const now = performance.now();
    if (this._lastFrameStamp > 0) {
      const dt = now - this._lastFrameStamp;
      // Ignore absurd gaps (backgrounded tab, paused debugger) so one stall
      // does not crater the scale.
      if (dt > 0 && dt < 1000) {
        this._frameMsEma =
          this._frameMsEma === 0 ? dt : this._frameMsEma * 0.8 + dt * 0.2;
      }
    }
    this._lastFrameStamp = now;

    // Re-evaluate every few frames so the scaler reacts within a frame or two
    // of a sustained load change. The EMA smooths spikes, and the dead-band
    // below is what prevents oscillation.
    this._adaptiveFrames += 1;
    if (this._adaptiveFrames < 8 || this._frameMsEma === 0) return;
    this._adaptiveFrames = 0;

    // Hysteresis around the target: shed resolution when clearly over
    // budget, recover only with generous headroom.
    const targetMs = 1000 / Math.max(1, this.adaptiveTargetFps);
    let direction = 0;
    if (this._frameMsEma > targetMs * 1.25) direction = -1;
    else if (this._frameMsEma < targetMs * 0.7) direction = 1;

    if (this.adaptiveDebug) {
      // eslint-disable-next-line no-console
      console.log(
        `[adaptive] ema=${this._frameMsEma.toFixed(1)}ms ` +
          `target=${targetMs.toFixed(1)}ms(${this.adaptiveTargetFps}fps) ` +
          `dir=${direction} scale=${this._adaptiveScale.toFixed(2)} ` +
          `[min=${this._effectiveMinScale.toFixed(2)} max=${this.adaptiveMaxScale}]`,
      );
    }

    // Asymmetric response: shed at once and in a big step (dropping
    // resolution can only help the framerate); recover cautiously, only when
    // two evaluations in a row agree, and in a small step, so the scale does
    // not blink back up the moment a couple of light frames land.
    if (direction < 0) {
      const scale = Math.max(
        this._effectiveMinScale,
        this._adaptiveScale - 0.1,
      );
      if (scale !== this._adaptiveScale) {
        this._adaptiveScale = scale;
        this.setPostproductionSize();
      }
      this._adaptivePending = 0;
    } else if (direction > 0 && this._adaptivePending > 0) {
      const scale = Math.min(
        this.adaptiveMaxScale,
        this._adaptiveScale + 0.05,
      );
      if (scale !== this._adaptiveScale) {
        this._adaptiveScale = scale;
        this.setPostproductionSize();
      }
      this._adaptivePending = 0;
    } else {
      this._adaptivePending = direction;
    }
  }
}
