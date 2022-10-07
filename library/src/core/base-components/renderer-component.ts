import * as THREE from "three";
import { Component } from "./component";
import { Resizeable } from "../base-types";

/**
 * A base component for components whose main mission is to render a scene.
 */
export abstract class RendererComponent
  extends Component<THREE.WebGLRenderer>
  implements Resizeable
{
  /** {@link Component.name} */
  abstract name: string;

  /** {@link Component.enabled} */
  abstract enabled: boolean;

  /** {@link Component.get} */
  abstract get(): THREE.WebGLRenderer;

  /** {@link Resizeable.getSize}. */
  abstract getSize(): THREE.Vector2;

  /** {@link Resizeable.resize}. */
  abstract resize(): void;

  /**
   * Adds or removes a
   * [clipping plane](https://threejs.org/docs/#api/en/renderers/WebGLRenderer.clippingPlanes)
   * to the renderer.
   */
  togglePlane(active: boolean, plane: THREE.Plane) {
    const renderer = this.get();
    const index = renderer.clippingPlanes.indexOf(plane);
    if (active && index === -1) {
      renderer.clippingPlanes.push(plane);
    } else if (!active && index > -1) {
      renderer.clippingPlanes.splice(index, 1);
    }
  }
}
