import * as THREE from "three";
import { Vector2 } from "three";
import { Event } from "./event";
import { BaseWorldItem } from "./base-world-item";
import { Disposable, Resizeable, Updateable } from "./interfaces";

/**
 * Abstract class representing a renderer for a 3D world. All renderers should use this class as a base.
 */
export abstract class BaseRenderer
  extends BaseWorldItem
  implements Updateable, Disposable, Resizeable
{
  /**
   * The three.js WebGLRenderer instance associated with this renderer.
   *
   * @abstract
   * @type {THREE.WebGLRenderer}
   */
  abstract three: THREE.WebGLRenderer;

  /** {@link Updateable.onBeforeUpdate} */
  onAfterUpdate = new Event();

  /** {@link Updateable.onAfterUpdate} */
  onBeforeUpdate = new Event();

  /** {@link Disposable.onDisposed} */
  readonly onDisposed = new Event<undefined>();

  /** {@link Resizeable.onResize} */
  readonly onResize = new Event<THREE.Vector2>();

  /**
   * Event that fires when there has been a change to the list of clipping
   * planes used by the active renderer.
   */
  readonly onClippingPlanesUpdated = new Event();

  /** {@link Updateable.update} */
  abstract update(delta?: number): void | Promise<void>;

  /** {@link Disposable.dispose} */
  abstract dispose(): void;

  /** {@link Resizeable.getSize} */
  abstract getSize(): Vector2;

  /** {@link Resizeable.resize} */
  abstract resize(size: Vector2 | undefined): void;

  /**
   * The list of [clipping planes](https://threejs.org/docs/#api/en/renderers/WebGLRenderer.clippingPlanes) used by this instance of the renderer.
   */
  clippingPlanes: THREE.Plane[] = [];

  /**
   * Updates the clipping planes and triggers the `onClippingPlanesUpdated` event.
   *
   * @remarks
   * This method is typically called when there is a change to the list of clipping planes
   * used by the active renderer.
   */
  updateClippingPlanes() {
    this.onClippingPlanesUpdated.trigger();
  }

  /**
   * Sets or removes a clipping plane from the renderer.
   *
   * @param active - A boolean indicating whether the clipping plane should be active or not.
   * @param plane - The clipping plane to be added or removed.
   * @param isLocal - An optional boolean indicating whether the clipping plane is local to the object. If not provided, it defaults to `false`.
   *
   * @remarks
   * This method adds or removes a clipping plane from the `clippingPlanes` array.
   * If `active` is `true` and the plane is not already in the array, it is added.
   * If `active` is `false` and the plane is in the array, it is removed.
   * The `three.clippingPlanes` property is then updated to reflect the current state of the `clippingPlanes` array,
   * excluding any planes marked as local.
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
