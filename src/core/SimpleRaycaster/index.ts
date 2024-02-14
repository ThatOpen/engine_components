import * as THREE from "three";
import { Component, Disposable, Mouse, Event } from "../../base-types";
import { Components } from "../Components";
import { BaseRaycaster } from "../../base-types/base-raycaster";

/**
 * A simple [raycaster](https://threejs.org/docs/#api/en/core/Raycaster)
 * that allows to easily get items from the scene using the mouse and touch
 * events.
 */
export class SimpleRaycaster extends BaseRaycaster implements Disposable {
  /** {@link Component.enabled} */
  enabled = true;

  /** {@link Disposable.onDisposed} */
  readonly onDisposed = new Event<undefined>();

  /** The position of the mouse in the screen. */
  readonly mouse: Mouse;

  private readonly _raycaster = new THREE.Raycaster();

  constructor(components: Components) {
    super(components);
    const renderer = components.renderer.get();
    const dom = renderer.domElement;
    this.mouse = new Mouse(dom);
  }

  /** {@link Component.get} */
  get() {
    return this._raycaster;
  }

  /** {@link Disposable.dispose} */
  async dispose() {
    this.mouse.dispose();
    await this.onDisposed.trigger();
    this.onDisposed.reset();
  }

  /**
   * Throws a ray from the camera to the mouse or touch event point and returns
   * the first item found. This also takes into account the clipping planes
   * used by the renderer.
   *
   * @param items - the [meshes](https://threejs.org/docs/#api/en/objects/Mesh)
   * to query. If not provided, it will query all the meshes stored in
   * {@link Components.meshes}.
   */
  castRay(
    items: THREE.Mesh[] = Array.from(this.components.meshes)
  ): THREE.Intersection | null {
    const camera = this.components.camera.get();
    this._raycaster.setFromCamera(this.mouse.position, camera);
    return this.intersect(items);
  }

  castRayFromVector(
    origin: THREE.Vector3,
    direction: THREE.Vector3,
    items = Array.from(this.components.meshes)
  ) {
    this._raycaster.set(origin, direction);
    return this.intersect(items);
  }

  private intersect(items: THREE.Mesh[] = Array.from(this.components.meshes)) {
    const result = this._raycaster.intersectObjects(items);
    const filtered = this.filterClippingPlanes(result);
    return filtered.length > 0 ? filtered[0] : null;
  }

  private filterClippingPlanes(objs: THREE.Intersection[]) {
    const renderer = this.components.renderer;
    if (!renderer.clippingPlanes) {
      return objs;
    }
    const planes = renderer.clippingPlanes;
    if (objs.length <= 0 || !planes || planes?.length <= 0) return objs;
    return objs.filter((elem) =>
      planes.every((elem2) => elem2.distanceToPoint(elem.point) > 0)
    );
  }
}
