import * as THREE from "three";
import { Vector2 } from "three";
import { Event } from "./event";
import { BaseWorldItem } from "./base-world-item";
import { Disposable, Resizeable, Updateable } from "./interfaces";

export abstract class BaseRenderer
  extends BaseWorldItem
  implements Updateable, Disposable, Resizeable
{
  abstract three: THREE.WebGLRenderer;

  /** {@link Updateable.onBeforeUpdate} */
  onAfterUpdate = new Event();

  /** {@link Updateable.onAfterUpdate} */
  onBeforeUpdate = new Event();

  /** {@link Disposable.onDisposed} */
  readonly onDisposed = new Event<undefined>();

  readonly onResize = new Event<THREE.Vector2>();

  /**
   * Event that fires when there has been a change to the list of clipping
   * planes used by the active renderer.
   */
  readonly onClippingPlanesUpdated = new Event();

  abstract update(delta?: number): void | Promise<void>;

  abstract dispose(): void;

  abstract getSize(): Vector2;

  abstract resize(size: Vector2 | undefined): void;

  /**
   * The list of [clipping planes](https://threejs.org/docs/#api/en/renderers/WebGLRenderer.clippingPlanes) used by this
   * instance of the renderer.
   */
  clippingPlanes: THREE.Plane[] = [];

  /**
   * Forces the update of the clipping planes and all components that depend
   * on them that are subscribed to `onClippingPlanesUpdated`.
   */
  updateClippingPlanes() {
    this.onClippingPlanesUpdated.trigger();
  }

  /**
   * Adds or removes a
   * [clipping plane](https://threejs.org/docs/#api/en/renderers/WebGLRenderer.clippingPlanes)
   * to the renderer.
   */
  setPlane(active: boolean, plane: THREE.Plane, isLocal?: boolean) {
    (plane as any).isLocal = isLocal;

    const index = this.clippingPlanes.indexOf(plane);
    if (active && index === -1) {
      this.clippingPlanes.push(plane);
    } else if (!active && index > -1) {
      this.clippingPlanes.splice(index, 1);
    }

    this.three.clippingPlanes = this.clippingPlanes.filter(
      (plane: any) => !plane.isLocal,
    );
  }
}
