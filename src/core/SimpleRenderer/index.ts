import * as THREE from "three";
import { CSS2DRenderer } from "three/examples/jsm/renderers/CSS2DRenderer";
import {
  Event,
  Components,
  Disposable,
  Updateable,
  Resizeable,
  BaseRenderer,
} from "../../types";

/**
 * A basic renderer capable of rendering 3D and 2D objects
 * ([Objec3Ds](https://threejs.org/docs/#api/en/core/Object3D) and
 * [CSS2DObjects](https://threejs.org/docs/#examples/en/renderers/CSS2DRenderer)
 * respectively).
 */
export class SimpleRenderer
  extends BaseRenderer
  implements Disposable, Updateable, Resizeable
{
  /** {@link Component.name} */
  name = "SimpleRenderer";

  /** {@link Component.enabled} */
  enabled = true;

  /** {@link Updateable.beforeUpdate} */
  beforeUpdate = new Event<SimpleRenderer>();

  /** {@link Updateable.afterUpdate} */
  afterUpdate = new Event<SimpleRenderer>();

  protected _renderer2D = new CSS2DRenderer();
  protected _renderer: THREE.WebGLRenderer;

  constructor(public components: Components, public container: HTMLElement) {
    super();
    this._renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
    });

    this._renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.setupRenderers();
    this.setupEvents();
    this.resize();
  }

  /** {@link Component.get} */
  get() {
    return this._renderer;
  }

  /** {@link Updateable.update} */
  update(_delta: number) {
    this.beforeUpdate.trigger(this);
    const scene = this.components.scene?.get();
    const camera = this.components.camera?.get();
    if (!scene || !camera) return;
    this._renderer.render(scene, camera);
    this._renderer2D.render(scene, camera);
    this.afterUpdate.trigger(this);
  }

  /** {@link Disposable.dispose} */
  dispose() {
    this.enabled = false;
    this._renderer.domElement.remove();
    this._renderer.dispose();
    this.afterUpdate.reset();
    this.beforeUpdate.reset();
  }

  /** {@link Resizeable.getSize}. */
  getSize() {
    return new THREE.Vector2(
      this._renderer.domElement.clientWidth,
      this._renderer.domElement.clientHeight
    );
  }

  /** {@link Resizeable.resize}. */
  resize() {
    const width = this.container.clientWidth;
    const height = this.container.clientHeight;
    this._renderer.setSize(width, height);
    this._renderer2D.setSize(width, height);
  }

  private setupRenderers() {
    this._renderer.localClippingEnabled = true;
    this.container.appendChild(this._renderer.domElement);

    this._renderer2D.domElement.style.position = "absolute";
    this._renderer2D.domElement.style.top = "0px";
    this._renderer2D.domElement.style.pointerEvents = "none";
    this.container.appendChild(this._renderer2D.domElement);
  }

  private setupEvents() {
    window.addEventListener("resize", () => {
      this.resize();
    });
  }
}
