import * as THREE from "three";
import { Components } from "../../Components";
import { readPixelsAsync } from "./screen-culler-helper";
import { AsyncEvent, Configurable, Event, World } from "../../Types";
import {
  CullerRendererConfig,
  CullerRendererConfigManager,
} from "./culler-renderer-config";
import { ConfigManager } from "../../ConfigManager";

/**
 * A base renderer to determine visibility on screen.
 */
export class CullerRenderer
  implements Configurable<CullerRendererConfigManager, CullerRendererConfig>
{
  /** {@link Configurable.onSetup} */
  readonly onSetup = new Event();

  /** {@link Disposable.onDisposed} */
  readonly onDisposed = new Event<string>();

  /**
   * Fires after making the visibility check to the meshes. It lists the
   * meshes that are currently visible, and the ones that were visible
   * just before but not anymore.
   */
  readonly onViewUpdated: Event<any> | AsyncEvent<any> = new AsyncEvent<any>();

  /**
   * Whether this renderer is active or not. If not, it won't render anything.
   */
  enabled = true;

  /**
   * Needs to check whether there are objects that need to be hidden or shown.
   * You can bind this to the camera movement, to a certain interval, etc.
   */
  needsUpdate = false;

  /** The components instance to which this renderer belongs. */
  components: Components;

  /** The render target used to render the visibility scene. */
  renderTarget = new THREE.WebGLRenderTarget();

  /**
   * The size of the buffer where the result of the visibility check is stored.
   */
  bufferSize = 1;

  /**
   * The buffer when the result of the visibility check is stored.
   */
  buffer = new Uint8Array();

  /**
   * Flag to indicate if the renderer shouldn't update the visibility.
   */
  preventUpdate = false;

  /** {@link Configurable.config} */
  config: CullerRendererConfigManager;

  /** {@link Configurable.isSetup} */
  isSetup = false;

  /** The world instance to which this renderer belongs. */
  readonly world: World;

  /** The THREE.js renderer used to make the visibility test. */
  readonly renderer: THREE.WebGLRenderer;

  protected _defaultConfig: CullerRendererConfig = {
    enabled: true,
    height: 512,
    width: 512,
    updateInterval: 1000,
    autoUpdate: true,
    renderDebugFrame: false,
    threshold: 100,
  };

  protected readonly worker: Worker;

  protected readonly scene = new THREE.Scene();

  private _availableColor = 1;

  // Prevents worker being fired multiple times
  protected _isWorkerBusy = false;

  constructor(components: Components, world: World) {
    if (!world.renderer) {
      throw new Error("The given world must have a renderer!");
    }

    this.components = components;

    this.config = new CullerRendererConfigManager(
      this,
      this.components,
      "Culler renderer",
    );

    this.world = world;
    this.renderer = new THREE.WebGLRenderer();

    this.renderer.clippingPlanes = world.renderer.clippingPlanes;

    const code = `
      addEventListener("message", (event) => {
        const { buffer } = event.data;
        const colors = new Map();
        for (let i = 0; i < buffer.length; i += 4) {
          const r = buffer[i];
          const g = buffer[i + 1];
          const b = buffer[i + 2];
          const code = "" + r + "-" + g + "-" + b;
          if(colors.has(code)) {
            colors.set(code, colors.get(code) + 1);
          } else {
            colors.set(code, 1);
          }
        }
        postMessage({ colors });
      });
    `;

    const blob = new Blob([code], { type: "application/javascript" });
    this.worker = new Worker(URL.createObjectURL(blob));

    this.setup();
  }

  /** {@link Disposable.dispose} */
  dispose() {
    this.enabled = false;
    this.config.autoUpdate = false;

    const configs = this.components.get(ConfigManager);
    configs.list.delete(this.config.uuid);

    for (const child of this.scene.children) {
      child.removeFromParent();
    }
    this.onViewUpdated.reset();
    this.worker.terminate();
    this.renderer.forceContextLoss();
    this.renderer.dispose();
    this.renderTarget.dispose();
    (this.buffer as any) = null;
    this.onDisposed.reset();
  }

  /**
   * The function that the culler uses to reprocess the scene. Generally it's
   * better to call needsUpdate, but you can also call this to force it.
   * @param force if true, it will refresh the scene even if needsUpdate is
   * not true.
   */
  updateVisibility = async (force?: boolean) => {
    if (!this.enabled) return;
    if (!this.needsUpdate && !force) return;

    if (this._isWorkerBusy) return;
    this._isWorkerBusy = true;

    const camera = this.world.camera.three;
    camera.updateMatrix();

    const { width, height } = this.config;
    this.renderer.setSize(width, height);
    this.renderer.setRenderTarget(this.renderTarget);
    this.renderer.render(this.scene, camera);

    const context = this.renderer.getContext() as WebGL2RenderingContext;
    await readPixelsAsync(
      context,
      0,
      0,
      width,
      height,
      context.RGBA,
      context.UNSIGNED_BYTE,
      this.buffer,
    );

    this.renderer.setRenderTarget(null);

    if (this.config.renderDebugFrame) {
      this.renderer.render(this.scene, camera);
    }

    this.worker.postMessage({
      buffer: this.buffer,
    });

    this.needsUpdate = false;
  };

  setup(config?: Partial<CullerRendererConfig>) {
    const fullConfig = { ...this._defaultConfig, ...config };

    const { width, height } = fullConfig;
    this.config.setWidthHeight(width, height);

    const { updateInterval, autoUpdate } = fullConfig;
    this.config.setAutoAndInterval(autoUpdate, updateInterval);

    this.config.threshold = fullConfig.threshold;

    this.isSetup = true;
    this.onSetup.trigger();
  }

  protected getAvailableColor() {
    // src: https://stackoverflow.com/a/67579485

    let bigOne = BigInt(this._availableColor.toString());
    const colorArray = [];
    do {
      colorArray.unshift(Number(bigOne % 256n));
      bigOne /= 256n;
    } while (bigOne);

    while (colorArray.length !== 3) {
      colorArray.unshift(0);
    }

    const [r, g, b] = colorArray;
    const code = `${r}-${g}-${b}`;

    return { r, g, b, code };
  }

  protected increaseColor() {
    if (this._availableColor === 256 * 256 * 256) {
      console.warn("Color can't be increased over 256 x 256 x 256!");
      return;
    }
    this._availableColor++;
  }

  protected decreaseColor() {
    if (this._availableColor === 1) {
      console.warn("Color can't be decreased under 0!");
      return;
    }
    this._availableColor--;
  }
}
