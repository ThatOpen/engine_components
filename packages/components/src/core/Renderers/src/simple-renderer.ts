import * as THREE from "three";
import { CSS2DRenderer } from "three/examples/jsm/renderers/CSS2DRenderer.js";
import { Disposable, Updateable, Resizeable, BaseRenderer } from "../../Types";
import { Components } from "../../Components";

/**
 * A basic renderer capable of rendering 3D and 2D objects
 * ([Objec3Ds](https://threejs.org/docs/#api/en/core/Object3D) and
 * [CSS2DObjects](https://threejs.org/docs/#examples/en/renderers/CSS2DRenderer)
 * respectively).
 */
export class SimpleRenderer extends BaseRenderer {
  /** {@link Component.enabled} */
  enabled = true;

  /** The HTML container of the THREE.js canvas where the scene is rendered. */
  container: HTMLElement | null;

  three: THREE.WebGLRenderer;

  protected _renderer2D = new CSS2DRenderer();
  protected _canvas: HTMLCanvasElement;
  protected _parameters?: Partial<THREE.WebGLRendererParameters>;

  constructor(
    components: Components,
    container?: HTMLElement,
    parameters?: Partial<THREE.WebGLRendererParameters>,
  ) {
    super(components);

    this.container = container || null;
    this._parameters = parameters;

    this.three = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      ...parameters,
    });

    this.three.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.setupRenderers();
    this.setupEvents(true);
    this.resize();

    this._canvas = this.three.domElement;

    const context = this.three.getContext();
    const { canvas } = context;
    canvas.addEventListener("webglcontextlost", this.onContextLost, false);
    canvas.addEventListener("webglcontextrestored", this.onContextBack, false);
  }

  /** {@link Component.get} */
  get() {
    return this.three;
  }

  /** {@link Updateable.update} */
  update() {
    if (!this.enabled || !this.currentWorld) return;
    this.onBeforeUpdate.trigger(this);
    const scene = this.currentWorld.scene.three;
    const camera = this.currentWorld.camera.three;
    this.three.render(scene, camera);
    if (scene instanceof THREE.Scene) {
      this._renderer2D.render(scene, camera);
    }
    this.onAfterUpdate.trigger(this);
  }

  /** {@link Disposable.dispose} */
  dispose() {
    this.enabled = false;
    this.setupEvents(false);
    this.three.domElement.remove();
    this.three.dispose();
    this._renderer2D.domElement.remove();
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

  /** {@link Resizeable.resize}. */
  resize = (size?: THREE.Vector2) => {
    this.updateContainer();
    if (!this.container) {
      return;
    }
    const width = size ? size.x : this.container.clientWidth;
    const height = size ? size.y : this.container.clientHeight;
    this.three.setSize(width, height);
    this._renderer2D.setSize(width, height);
    this.onResize.trigger(size);
  };

  private resizeEvent = () => {
    this.resize();
  };

  setupEvents(active: boolean) {
    if (active) {
      window.addEventListener("resize", this.resizeEvent);
    } else {
      window.removeEventListener("resize", this.resizeEvent);
    }
  }

  private setupRenderers() {
    this.three.localClippingEnabled = true;
    this._renderer2D.domElement.style.position = "absolute";
    this._renderer2D.domElement.style.top = "0px";
    this._renderer2D.domElement.style.pointerEvents = "none";
    if (this.container) {
      this.container.appendChild(this.three.domElement);
      this.container.appendChild(this._renderer2D.domElement);
    }
    this.updateContainer();
  }

  private onContextLost = (event: any) => {
    event.preventDefault();
    this.components.enabled = false;
  };

  private onContextBack = () => {
    this.three.setRenderTarget(null);
    this.three.dispose();
    this.three = new THREE.WebGLRenderer({
      canvas: this._canvas,
      antialias: true,
      alpha: true,
      ...this._parameters,
    });
    this.components.enabled = true;
  };

  private updateContainer() {
    if (!this.container) {
      const parent = this.three.domElement.parentElement;
      if (parent) {
        this.container = parent;
        parent.appendChild(this._renderer2D.domElement);
      }
    }
  }
}
