import * as THREE from "three";
import { Component, Components, Raycaster, Mouse } from "../../types";

/**
 * A simple [raycaster](https://threejs.org/docs/#api/en/core/Raycaster)
 * that allows to easily get items from the scene using the mouse and touch
 * events.
 */
export class SimpleRaycaster
  extends Component<THREE.Raycaster>
  implements Raycaster
{
  /** {@link Component.name} */
  name = "SimpleRaycaster";

  /** {@link Component.enabled} */
  enabled = true;

  private readonly _raycaster = new THREE.Raycaster();
  private readonly _mouse: Mouse;

  constructor(private components: Components) {
    super();
    const scene = components.renderer.get();
    const dom = scene.domElement;
    this._mouse = new Mouse(dom);
  }

  /** {@link Component.get} */
  get(): THREE.Raycaster {
    return this._raycaster;
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
    items: THREE.Mesh[] = this.components.meshes
  ): THREE.Intersection | null {
    const camera = this.components.camera.get();
    this._raycaster.setFromCamera(this._mouse.position, camera);
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
