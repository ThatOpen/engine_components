import * as THREE from "three";
import { Vector2, WebGLRenderer } from "three";
import { RendererComponent } from "../core";

/**
 * Minimal renderer that can be used to create a BIM + GIS scene
 * with [Mapbox](https://www.mapbox.com/).
 */
export class MapboxRenderer extends RendererComponent {
  /** {@link Component.name} */
  name = "MapboxRenderer";

  /** {@link Component.enabled} */
  enabled = true;

  private readonly renderer: THREE.WebGLRenderer;

  constructor(canvas: HTMLCanvasElement, context: WebGLRenderingContext) {
    super();
    this.renderer = new THREE.WebGLRenderer({
      canvas,
      context,
      antialias: true,
    });
    this.renderer.autoClear = false;
  }

  /** {@link Component.get} */
  get(): WebGLRenderer {
    return this.renderer;
  }

  /** {@link Resizeable.getSize} */
  getSize(): Vector2 {
    return new THREE.Vector2(
      this.renderer.domElement.clientWidth,
      this.renderer.domElement.clientHeight
    );
  }

  /** This renderer can't be manually resized because Mapbox handles that. */
  resize(): void {}
}
