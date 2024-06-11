import * as THREE from "three";
import { Components } from "../../Components";
import { readPixelsAsync } from "./screen-culler-helper";
import { AsyncEvent, Event, World } from "../../Types";

/**
 * Interface for settings to configure the CullerRenderer.
 */
export interface CullerRendererSettings {
  /**
   * Interval in milliseconds at which the visibility check should be performed.
   * Default value is 1000.
   */
  updateInterval?: number;

  /**
   * Width of the render target used for visibility checks.
   * Default value is 512.
   */
  width?: number;

  /**
   * Height of the render target used for visibility checks.
   * Default value is 512.
   */
  height?: number;

  /**
   * Whether the visibility check should be performed automatically.
   * Default value is true.
   */
  autoUpdate?: boolean;
}

/**
 * A base renderer to determine visibility on screen.
 */
export class CullerRenderer {
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

  /**
   * Render the internal scene used to determine the object visibility. Used
   * for debugging purposes.
   */
  renderDebugFrame = false;

  /** The components instance to which this renderer belongs. */
  components: Components;

  /** The world instance to which this renderer belongs. */
  readonly world: World;

  /** The THREE.js renderer used to make the visibility test. */
  readonly renderer: THREE.WebGLRenderer;

  protected autoUpdate = true;

  protected updateInterval = 1000;

  protected readonly worker: Worker;

  protected readonly scene = new THREE.Scene();

  private _width = 512;

  private _height = 512;

  private _availableColor = 1;

  private readonly renderTarget: THREE.WebGLRenderTarget;

  private readonly bufferSize: number;

  private readonly _buffer: Uint8Array;

  // Prevents worker being fired multiple times
  protected _isWorkerBusy = false;

  constructor(
    components: Components,
    world: World,
    settings?: CullerRendererSettings,
  ) {
    if (!world.renderer) {
      throw new Error("The given world must have a renderer!");
    }

    this.components = components;
    this.applySettings(settings);

    this.world = world;
    this.renderer = new THREE.WebGLRenderer();

    this.renderTarget = new THREE.WebGLRenderTarget(this._width, this._height);
    this.bufferSize = this._width * this._height * 4;
    this._buffer = new Uint8Array(this.bufferSize);

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
  }

  /** {@link Disposable.dispose} */
  dispose() {
    this.enabled = false;
    for (const child of this.scene.children) {
      child.removeFromParent();
    }
    this.onViewUpdated.reset();
    this.worker.terminate();
    this.renderer.dispose();
    this.renderTarget.dispose();
    (this._buffer as any) = null;
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

    this.renderer.setSize(this._width, this._height);
    this.renderer.setRenderTarget(this.renderTarget);
    this.renderer.render(this.scene, camera);

    const context = this.renderer.getContext() as WebGL2RenderingContext;
    await readPixelsAsync(
      context,
      0,
      0,
      this._width,
      this._height,
      context.RGBA,
      context.UNSIGNED_BYTE,
      this._buffer,
    );

    this.renderer.setRenderTarget(null);

    if (this.renderDebugFrame) {
      this.renderer.render(this.scene, camera);
    }

    this.worker.postMessage({
      buffer: this._buffer,
    });

    this.needsUpdate = false;
  };

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

  private applySettings(settings?: CullerRendererSettings) {
    if (settings) {
      if (settings.updateInterval !== undefined) {
        this.updateInterval = settings.updateInterval;
      }
      if (settings.height !== undefined) {
        this._height = settings.height;
      }
      if (settings.width !== undefined) {
        this._width = settings.width;
      }
      if (settings.autoUpdate !== undefined) {
        this.autoUpdate = settings.autoUpdate;
      }
    }
  }
}
