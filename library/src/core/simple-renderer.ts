import * as THREE from "three";
import { CSS2DRenderer } from "three/examples/jsm/renderers/CSS2DRenderer";
import { WebGLRenderer } from "three";
import { Components } from "../components";
import { Event } from "./event";
import { Disposeable, Updateable } from "./base-types";
import { Component } from "./component";

/**
 * A basic renderer capable of rendering 3D and 2D objects
 * ([Objec3Ds](https://threejs.org/docs/#api/en/core/Object3D) and
 * [CSS2DObjects](https://threejs.org/docs/#examples/en/renderers/CSS2DRenderer)
 * respectively).
 */
export class SimpleRenderer
  extends Component<WebGLRenderer>
  implements Disposeable, Updateable
{
  /** {@link Component.name} */
  name = "SimpleRenderer";

  /** {@link Component.enabled} */
  enabled = true;

  /** {@link Component.beforeUpdate} */
  beforeUpdate = new Event<SimpleRenderer>();

  /** {@link Component.afterUpdate} */
  afterUpdate = new Event<SimpleRenderer>();

  protected _renderer2D = new CSS2DRenderer();
  protected _renderer: THREE.WebGLRenderer;

  constructor(public components: Components, public container: HTMLElement) {
    super();
    this._renderer = new THREE.WebGLRenderer({
      antialias: true,
    });

    this._renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.setupRenderers();
    this.setupEvents();
    this.setSize();
  }

  /** {@link Component.get} */
  get() {
    return this._renderer;
  }

  /** {@link Component.update} */
  update(_delta: number) {
    this.beforeUpdate.trigger(this);
    const scene = this.components.scene?.get();
    const camera = this.components.camera?.get();
    if (!scene || !camera) return;
    this._renderer.render(scene, camera);
    this._renderer2D.render(scene, camera);
    this.afterUpdate.trigger(this);
  }

  /** {@link Disposeable.dispose} */
  dispose() {
    this._renderer.domElement.remove();
    this._renderer.dispose();
    (this._renderer as any) = null;
    (this._renderer2D as any) = null;
    (this.container as any) = null;
  }

  /** {@link Resizeable.getSize}. */
  getSize() {
    return new THREE.Vector2(
      this._renderer.domElement.clientWidth,
      this._renderer.domElement.clientHeight
    );
  }

  /** {@link Resizeable.getSize}. */
  setSize() {
    const width = this.container.clientWidth;
    const height = this.container.clientHeight;
    this._renderer.setSize(width, height);
    this._renderer2D.setSize(width, height);
  }

  /** Adds a new [clipping plane](https://threejs.org/docs/#api/en/renderers/WebGLRenderer.clippingPlanes)
   * to the renderer. */
  addClippingPlane(plane: THREE.Plane) {
    this._renderer.clippingPlanes.push(plane);
  }

  /** Removes an existing  [clipping plane](https://threejs.org/docs/#api/en/renderers/WebGLRenderer.clippingPlanes)
   * from the renderer. */
  removeClippingPlane(plane: THREE.Plane) {
    const index = this._renderer.clippingPlanes.indexOf(plane);
    if (index > -1) {
      this._renderer.clippingPlanes.splice(index, 1);
    }
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
      this.setSize();
    });
  }
}
