import * as THREE from "three";
import { Component } from "./component";

export abstract class RendererComponent extends Component<THREE.WebGLRenderer> {
  /** {@link Component.name} */
  abstract name: string;

  /** {@link Component.enabled} */
  abstract enabled: boolean;

  /** {@link Component.get} */
  abstract get(): THREE.WebGLRenderer;

  /** Adds or removes a
   * [clipping plane](https://threejs.org/docs/#api/en/renderers/WebGLRenderer.clippingPlanes)
   * to the renderer. */
  togglePlane(active: boolean, plane: THREE.Plane) {
    const renderer = this.get();
    if (active) {
      renderer.clippingPlanes.push(plane);
    } else {
      const index = renderer.clippingPlanes.indexOf(plane);
      if (index > -1) {
        renderer.clippingPlanes.splice(index, 1);
      }
    }
  }
}
