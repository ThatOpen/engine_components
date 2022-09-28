import * as THREE from "three";
import { Vector2, WebGLRenderer } from "three";
import { Event, RendererComponent } from "../core";

export class MapboxRenderer implements RendererComponent {
  readonly onStartRender = new Event();
  readonly onFinishRender = new Event();

  private readonly renderer: THREE.WebGLRenderer;

  constructor(canvas: HTMLCanvasElement, context: WebGLRenderingContext) {
    this.renderer = new THREE.WebGLRenderer({
      canvas,
      context,
      antialias: true,
    });
    this.renderer.autoClear = false;
  }

  get(): WebGLRenderer {
    return this.renderer;
  }

  getSize(): Vector2 {
    return new THREE.Vector2(
      this.renderer.domElement.clientWidth,
      this.renderer.domElement.clientHeight
    );
  }

  addClippingPlane(plane: THREE.Plane) {
    this.renderer.clippingPlanes.push(plane);
  }

  removeClippingPlane(plane: THREE.Plane) {
    const index = this.renderer.clippingPlanes.indexOf(plane);
    if (index > -1) {
      this.renderer.clippingPlanes.splice(index, 1);
    }
  }

  resize(): void {}

  update(_delta: number): void {}
}
