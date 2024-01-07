import * as THREE from "three";
import { Component, Disposable, Event } from "../../../base-types";
import { Components } from "../../Components";
import { readPixelsAsync } from "./screen-culler-helper";

export interface CullerRendererSettings {
  updateInterval?: number;
  width?: number;
  height?: number;
  autoUpdate?: boolean;
}

/**
 * A base renderer to determine visibility on screen
 */
export class CullerRenderer extends Component<THREE.WebGLRenderer> {
  /** {@link Disposable.onDisposed} */
  readonly onDisposed = new Event<string>();

  /**
   * Fires after making the visibility check to the meshes. It lists the
   * meshes that are currently visible, and the ones that were visible
   * just before but not anymore.
   */
  readonly onViewUpdated = new Event<any>();

  /** {@link Component.enabled} */
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

  private _width = 512;
  private _height = 512;

  protected autoUpdate = true;
  protected updateInterval = 1000;

  protected readonly worker: Worker;

  protected readonly renderer: THREE.WebGLRenderer;
  private readonly renderTarget: THREE.WebGLRenderTarget;
  protected readonly scene = new THREE.Scene();

  private readonly bufferSize: number;

  private _colors = { r: 0, g: 0, b: 0, i: 0 };

  private readonly _buffer: Uint8Array;

  constructor(components: Components, settings?: CullerRendererSettings) {
    super(components);
    this.applySettings(settings);

    this.renderer = new THREE.WebGLRenderer();
    const planes = this.components.renderer.clippingPlanes;
    this.renderer.clippingPlanes = planes;
    this.renderTarget = new THREE.WebGLRenderTarget(this._width, this._height);
    this.bufferSize = this._width * this._height * 4;
    this._buffer = new Uint8Array(this.bufferSize);

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

  /**
   * {@link Component.get}.
   */
  get() {
    return this.renderer;
  }

  /** {@link Disposable.dispose} */
  async dispose() {
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

    const camera = this.components.camera.get();
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
      this._buffer
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

  protected getNextColor() {
    if (this._colors.i === 0) {
      this._colors.b++;
      if (this._colors.b === 256) {
        this._colors.b = 0;
        this._colors.i = 1;
      }
    }

    if (this._colors.i === 1) {
      this._colors.g++;
      this._colors.i = 0;
      if (this._colors.g === 256) {
        this._colors.g = 0;
        this._colors.i = 2;
      }
    }

    if (this._colors.i === 2) {
      this._colors.r++;
      this._colors.i = 1;
      if (this._colors.r === 256) {
        this._colors.r = 0;
        this._colors.i = 0;
      }
    }

    return this.getLastColor();
  }

  protected decreaseNextColor() {
    if (this._colors.i === 0) {
      this._colors.b--;
      if (this._colors.b === -1) {
        if (this._colors.g !== 0 || this._colors.r !== 0) {
          this._colors.b = 255;
          this._colors.i = 1;
        } else {
          this._colors.b = 0;
        }
      }
    }

    if (this._colors.i === 1) {
      this._colors.g--;
      this._colors.i = 0;
      if (this._colors.g === -1) {
        if (this._colors.r !== 0) {
          this._colors.g = 255;
          this._colors.i = 2;
        } else {
          this._colors.g = 0;
        }
      }
    }

    if (this._colors.i === 2) {
      this._colors.r--;
      this._colors.i = 1;
      if (this._colors.r === -1) {
        this._colors.r = 0;
      }
    }
  }

  protected getLastColor() {
    return {
      r: this._colors.r,
      g: this._colors.g,
      b: this._colors.b,
      code: `${this._colors.r}-${this._colors.g}-${this._colors.b}`,
    };
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
