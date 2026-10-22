import * as THREE from "three";
import {
  Disposable,
  Updateable,
  Resizeable,
  BaseRenderer,
  Event,
} from "../../Types";
import { Components } from "../../Components";
import { createThatOpenLogo } from "./logo";
import { untoneMap } from "./untone-map";
import {
  createThreeRenderer,
  RendererApi,
  RendererNamespace,
  SimpleRendererParameters,
} from "./renderer-api";

export type { RendererApi, SimpleRendererParameters } from "./renderer-api";

/**
 * The mode of the renderer. If MANUAL, the renderer will be updated on command. If AUTO, the renderer will render on every update tick.
 */
export enum RendererMode {
  MANUAL,
  AUTO,
}

/**
 * A basic renderer capable of rendering [Objec3Ds](https://threejs.org/docs/#api/en/core/Object3D).
 */
export class SimpleRenderer extends BaseRenderer {
  /**
   * Indicates whether the renderer is enabled. If it's not, it won't be updated.
   * Default is `true`.
   */
  enabled = true;

  /**
   * The HTML container of the THREE.js canvas where the scene is rendered.
   */
  container: HTMLElement;

  /**
   * The THREE.js WebGLRenderer instance.
   */
  three: THREE.WebGLRenderer;

  /**
   * The mode of the renderer. If MANUAL, the renderer will be updated manually. If AUTO, the renderer will render on every update tick.
   */
  mode = RendererMode.AUTO;

  /**
   * Whether the renderer needs to be updated. If true, the renderer will be updated on the next frame.
   */
  needsUpdate = false;

  /**
   * The GPU API this renderer was built on: `"webgl"` unless the
   * constructor was given `mode: "webgpu"` (see
   * {@link SimpleRendererParameters.mode}). Under `"webgpu"`, {@link three}
   * is a `THREE.WebGPURenderer` typed as the WebGL one.
   */
  readonly api: RendererApi;

  protected _canvas: HTMLCanvasElement;
  protected _parameters?: SimpleRendererParameters;
  protected _resizeObserver: ResizeObserver | null = null;

  /** WebGPU only: flips when `WebGPURenderer.init()` resolves; frames before it are skipped. */
  protected _webgpuInitialized = false;

  protected onContainerUpdated = new Event();

  private _resizing = false;

  private _logo: HTMLElement | null = null;
  private _showLogo = true;

  /**
   * Whether the That Open Company logo is shown as a small overlay in the
   * bottom-left corner of the renderer container. Defaults to `true`.
   *
   * The logo is how people discover that the libraries powering this app
   * come from That Open Company, the team that keeps
   * `@thatopen/components`, `@thatopen/fragments`, and the rest of the stack
   * free and open source. If the logo fits your design, please consider
   * leaving it on; every visible mark helps us reach more developers and
   * keep investing in the libraries you're building on. Thank you.
   *
   * If your app needs a clean viewport (full-bleed print view, white-label
   * embed, customer-branded surface), set it to `false`:
   * ```ts
   * world.renderer.showLogo = false;
   * ```
   */
  get showLogo(): boolean {
    return this._showLogo;
  }

  set showLogo(value: boolean) {
    this._showLogo = value;
    if (this._logo) this._logo.style.display = value ? "" : "none";
  }

  /**
   * The DOM element rendering the That Open Company wordmark, or `null`
   * before the renderer is set up. Mutate its `style` to restyle or move
   * the overlay without forking the source. Common adjustments:
   *
   * ```ts
   * const logo = world.renderer.logo;
   * if (logo) {
   *   logo.style.left = "auto";
   *   logo.style.right = "0.75rem";   // move to bottom-right
   *   logo.style.bottom = "auto";
   *   logo.style.top = "0.75rem";     // or to the top edge
   * }
   * ```
   *
   * The element also carries a `data-thatopen-logo` attribute, so app-wide
   * CSS can target it (`[data-thatopen-logo] { ... }`). External rules
   * need `!important` (or higher specificity) to win against the inline
   * defaults.
   */
  get logo(): HTMLElement | null {
    return this._logo;
  }

  /**
   * Constructor for the SimpleRenderer class.
   *
   * @param components - The components instance.
   * @param container - The HTML container where the THREE.js canvas will be rendered.
   * @param parameters - Optional parameters for the THREE.js WebGLRenderer,
   * plus the opt-in GPU API (`mode`, see {@link SimpleRendererParameters.mode}).
   */
  constructor(
    components: Components,
    container: HTMLElement,
    parameters?: SimpleRendererParameters,
  ) {
    super(components);

    this.container = container;
    this._parameters = parameters;

    const { api, renderer } = createThreeRenderer(
      THREE as unknown as RendererNamespace,
      parameters,
    );
    this.api = api;
    this.three = renderer;

    if (this.api === "webgpu") {
      // Cleared to alpha 0, as the WebGL renderer starts: a scene without a
      // background then leaves its empty pixels transparent and the page
      // colour is painted there (see `renderOverPage`). An app's own
      // setClearColor wins.
      const gpu = this.three as any;
      gpu.setClearAlpha(0);
      gpu.init().then(() => {
        this._webgpuInitialized = true;
      });
    }

    this.three.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.setupRenderer();
    this.setupEvents(true);
    this.resize();

    this._canvas = this.three.domElement;

    if (this.api === "webgl") {
      const context = this.three.getContext();
      const { canvas } = context;
      canvas.addEventListener("webglcontextlost", this.onContextLost, false);
      canvas.addEventListener(
        "webglcontextrestored",
        this.onContextBack,
        false,
      );
    }
  }

  /**
   * WebGPU only: applies the clipping planes to the scene.
   *
   * `WebGPURenderer` ignores `renderer.clippingPlanes` and per-material
   * `clippingPlanes`; three clips only the descendants of a `ClippingGroup`.
   * So the scene root is marked as a clipping group carrying EVERY plane of
   * this renderer, local ones included (the Clipper's local mode moves its
   * planes out of `three.clippingPlanes` onto the materials, which WebGPU
   * does not read). `isGroup` on a Scene is otherwise only read by the
   * lighting lookup, which accepts a scene either way. Called before every
   * draw, so plane edits, removals and world changes need no event.
   */
  protected syncWebGPUClipping(scene: THREE.Object3D) {
    const target = scene as any;
    if (!target.isClippingGroup) {
      target.isGroup = true;
      target.isClippingGroup = true;
      target.enabled = true;
      target.clipIntersection = false;
      target.clipShadows = false;
    }
    target.clippingPlanes = this.clippingPlanes ?? [];
  }

  /** WebGPU: the page colour an opaque canvas clears to, refreshed on resize. */
  private readonly _pageClear = new THREE.Color(1, 1, 1);
  private _pageClearStale = true;
  private readonly _clearBefore = new THREE.Color();
  /** Scratch: the clear colour after undoing the active tone mapping. */
  private readonly _untoned = new THREE.Color();

  /**
   * WebGPU only: draws a scene, over the page's colour when it has no
   * background.
   *
   * WebGL's canvas is transparent, so where a scene has no background the
   * page shows through. The WebGPU canvas is opaque for speed, and its
   * transparent clear turned those pixels black. When the scene has no
   * background and the clear is still the default transparent one, this
   * clears with the first non-transparent CSS background from the container
   * up (white when there is none) for the draw, then puts the clear back. An
   * app's own clear colour, a scene background or an `alpha: true` canvas
   * are left alone. WebGPU also tone-maps the clear colour with the frame
   * (WebGL does not), so under tone mapping the clear is the colour the
   * curve maps back to the intended one (see `untone-map.ts`).
   */
  protected renderOverPage(scene: THREE.Object3D, camera: THREE.Camera) {
    const gpu = this.three as any;
    const target = scene as any;
    const background = target.background;
    const toneMapped = gpu.toneMapping !== THREE.NoToneMapping;
    if (background?.isColor && toneMapped && gpu.alpha !== true) {
      if (
        !untoneMap(
          background,
          gpu.toneMapping,
          gpu.toneMappingExposure,
          this._untoned,
        )
      ) {
        gpu.render(scene, camera);
        return;
      }
      gpu.getClearColor(this._clearBefore);
      const alphaBefore = gpu.getClearAlpha();
      target.background = null;
      gpu.setClearColor(this._untoned, 1);
      try {
        gpu.render(scene, camera);
      } finally {
        target.background = background;
        gpu.setClearColor(this._clearBefore, alphaBefore);
      }
      return;
    }
    if (gpu.alpha === true || background || gpu.getClearAlpha() !== 0) {
      gpu.render(scene, camera);
      return;
    }
    if (this._pageClearStale) {
      this._pageClearStale = false;
      let element: HTMLElement | null = this.container;
      let found = false;
      while (element && !found) {
        const parts =
          getComputedStyle(element)
            .backgroundColor.match(/[\d.]+/g)
            ?.map(Number) ?? [];
        const alpha =
          parts.length >= 4 ? parts[3] : parts.length === 3 ? 1 : 0;
        if (parts.length >= 3 && alpha > 0) {
          this._pageClear.setRGB(
            parts[0] / 255,
            parts[1] / 255,
            parts[2] / 255,
            THREE.SRGBColorSpace,
          );
          found = true;
        }
        element = element.parentElement;
      }
      if (!found) this._pageClear.setRGB(1, 1, 1);
    }
    gpu.getClearColor(this._clearBefore);
    const pageClear =
      toneMapped &&
      untoneMap(
        this._pageClear,
        gpu.toneMapping,
        gpu.toneMappingExposure,
        this._untoned,
      )
        ? this._untoned
        : this._pageClear;
    gpu.setClearColor(pageClear, 1);
    try {
      gpu.render(scene, camera);
    } finally {
      gpu.setClearColor(this._clearBefore, 0);
    }
  }

  /** {@link Updateable.update} */
  update() {
    if (!this.enabled || !this.currentWorld) return;

    // WebGPU boots asynchronously (`init()` acquires adapter and device); the
    // few frames before it resolves are skipped rather than rendered wrong.
    if (this.api === "webgpu" && !this._webgpuInitialized) return;

    if (this.mode === RendererMode.MANUAL && !this.needsUpdate) {
      return;
    }
    this.needsUpdate = false;

    this.onBeforeUpdate.trigger(this);
    const scene = this.currentWorld.scene.three;
    const camera = this.currentWorld.camera.three;
    if (this.api === "webgpu") {
      this.syncWebGPUClipping(scene);
      this.renderOverPage(scene, camera);
    } else {
      this.three.render(scene, camera);
    }
    // if (scene instanceof THREE.Scene) {
    //   this._renderer2D.render(scene, camera);
    // }
    this.onAfterUpdate.trigger(this);
  }

  /** {@link Disposable.dispose} */
  dispose() {
    this.enabled = false;
    this.setupEvents(false);
    this.three.domElement.remove();
    if (this._logo) {
      this._logo.remove();
      this._logo = null;
    }
    // WebGL only: a WebGPURenderer has no GL context to force-lose.
    if (this.api === "webgl") this.three.forceContextLoss();
    this.three.dispose();
    // this._renderer2D.domElement.remove();
    this.onResize.reset();
    this.onAfterUpdate.reset();
    this.onBeforeUpdate.reset();
    this.onDisposed.trigger();
    this.onDisposed.reset();
  }

  /** {@link Resizeable.getSize}. */
  getSize() {
    return new THREE.Vector2(
      this.three.domElement.clientWidth,
      this.three.domElement.clientHeight,
    );
  }

  /** {@link Resizeable.resize} */
  resize = (size?: THREE.Vector2) => {
    if (this._resizing) return;
    this._resizing = true;
    this.onContainerUpdated.trigger();
    const width = size ? size.x : this.container.clientWidth;
    const height = size ? size.y : this.container.clientHeight;
    this.three.setSize(width, height);
    // A resize can come with a restyle (a theme, a panel): read the page again.
    this._pageClearStale = true;
    // this._renderer2D.setSize(width, height);
    this.onResize.trigger(new THREE.Vector2(width, height));
    this._resizing = false;
  };

  /**
   * Sets up and manages the event listeners for the renderer.
   *
   * @param active - A boolean indicating whether to activate or deactivate the event listeners.
   *
   * @throws Will throw an error if the renderer does not have an HTML container.
   */
  setupEvents(active: boolean) {
    const dom = this.three.domElement.parentElement;
    if (!dom) {
      throw new Error("This renderer needs to have an HTML container!");
    }

    if (this._resizeObserver) {
      this._resizeObserver.disconnect();
      this._resizeObserver = null;
    }

    window.removeEventListener("resize", this.resizeEvent);

    if (active) {
      this._resizeObserver = new ResizeObserver(this.resizeEvent);
      this._resizeObserver.observe(dom);
      window.addEventListener("resize", this.resizeEvent);
    }
  }

  private resizeEvent = () => {
    this.resize();
  };

  private setupRenderer() {
    this.three.localClippingEnabled = true;
    if (this.api === "webgpu") {
      // WebGPURenderer ships no `clippingPlanes` array; WebGLRenderer
      // defaults it to []. Apps read and iterate it, so keep the surface.
      (this.three as any).clippingPlanes ??= [];
    }
    if (this.container) {
      this.container.appendChild(this.three.domElement);
      this.setupLogo();
    }
    this.onContainerUpdated.trigger();
  }

  private setupLogo() {
    if (this._logo || !this.container) return;
    // The logo is absolutely positioned, so make sure the container
    // establishes a positioning context. Only set it when the container
    // has no explicit position yet, to avoid clobbering app layout.
    const computed = window.getComputedStyle(this.container);
    if (computed.position === "static") {
      this.container.style.position = "relative";
    }
    this._logo = createThatOpenLogo();
    this._logo.style.display = this._showLogo ? "" : "none";
    this.container.appendChild(this._logo);
  }

  private onContextLost = (event: any) => {
    event.preventDefault();
    this.enabled = false;
  };

  private onContextBack = () => {
    this.three.setRenderTarget(null);
    this.three.dispose();
    const { mode: _api, ...threeParameters } = this._parameters ?? {};
    this.three = new THREE.WebGLRenderer({
      canvas: this._canvas,
      antialias: true,
      alpha: true,
      ...threeParameters,
    });
    this.enabled = true;
  };
}
