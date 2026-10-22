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

  /** WebGPU only: how many pipelines were compiled and disposed. */
  readonly pipelineStats = { compiled: 0, disposed: 0 };

  /** WebGPU only: the camera the pipeline was mounted with; a different one remounts. */
  private _pipelineCamera: THREE.Camera | null = null;

  /** WebGPU only: mounts in flight, so `update` never starts a second one. */
  private _mounting = 0;

  /** WebGPU only: the composition module, once imported. */
  private _composition: any = null;

  /** WebGPU only: two update cycles of one frame are closer than this (ms); the second is not drawn. */
  private _lastGpuRenderAt = -Infinity;

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
   * WebGPU only: rebuilds the composition over the current world. Which
   * passes are compiled in is decided at mount, so a change the next frame
   * would not pick up on its own can be forced with this.
   */
  remountPipeline() {
    if (this.api !== "webgpu" || !this.currentWorld) return;
    this._mountPipeline();
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
        // No camera yet: the first frame with one mounts (see `_updateWebGPU`).
        this._pipelineCamera = null;
        return;
      }
      const old = this.pipeline;
      if (
        old &&
        oldCamera === camera &&
        !this._gpuPostproduction.needsRemount(old.compiled, this.webgpuPost)
      ) {
        this._pipelineCamera = camera;
        return;
      }
      this._composeNow(world, camera);
    } finally {
      this._mounting--;
    }
  }

  /**
   * WebGPU only: compiles a pipeline for the current settings, synchronously,
   * and makes it the drawing one, so the update after a setting changes
   * draws with it (the same contract as WebGL). Only the first import is
   * asynchronous.
   */
  private _composeNow(world: OBC.World, camera: THREE.Camera) {
    const old = this.pipeline;
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
    if (old) {
      old.dispose?.();
      this.pipelineStats.disposed++;
    }
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
   * WebGPU only: the frame. The composition when the postproduction is on
   * (remounted first when the camera object or a compiled-in setting
   * changed), the scene plainly otherwise.
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
    const scene = this.currentWorld.scene.three;
    const camera = this.currentWorld.camera.three;
    this.syncWebGPUClipping(scene);
    const post = this._gpuPostproduction;
    // Not mounted yet (the world had no camera when it was assigned).
    if (post.enabled && !this.pipeline && this._mounting === 0) {
      this._mountPipeline();
    }
    if (
      post.enabled &&
      this.pipeline &&
      this._mounting === 0 &&
      (camera !== this._pipelineCamera ||
        post.needsRemount(this.pipeline.compiled, this.webgpuPost))
    ) {
      if (this._composition) this._composeNow(this.currentWorld, camera);
      else this._mountPipeline();
    }
    if (post.enabled && this.pipeline) {
      this.pipeline.__refresh?.();
      this.pipeline.render();
    } else {
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

    if (this.mode === OBC.RendererMode.MANUAL && !this.needsUpdate) {
      return;
    }
    this.needsUpdate = false;

    if (this.api === "webgpu") {
      this._updateWebGPU();
      return;
    }

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
    if (scene instanceof THREE.Scene) {
      this.three2D.render(scene, camera);
    }

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
    const scene = this.currentWorld.scene.three;
    const camera = this.currentWorld.camera.three;
    if (scene instanceof THREE.Scene) {
      this.three2D.render(scene, camera);
    }
    this.onAfterUpdate.trigger();
  }

  /**
   * Re-applies the current container size to the postproduction passes. Public
   * so the deferred pipeline can request a correct size right after it is
   * lazily constructed, matching the dimensions the resize path uses.
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
    const ratio = Math.min(window.devicePixelRatio, 2);
    const width = size?.x ?? this.container.clientWidth * ratio;
    const height = size?.y ?? this.container.clientHeight * ratio;
    if (width === 0 || height === 0) {
      return;
    }
    this.postproduction.setSize(width, height);
  }
}
