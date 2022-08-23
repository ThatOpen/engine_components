import { Intersection, Mesh, Raycaster } from "three";
import { Components } from "../components";
import { SimpleMouse } from "./simple-mouse";
import { RaycasterComponent } from "./base-types";

export class SimpleRaycaster implements RaycasterComponent {
  private readonly raycaster = new Raycaster();
  private readonly mouse: SimpleMouse;

  constructor(private components: Components) {
    const canvas = components.renderer.renderer.domElement;
    this.mouse = new SimpleMouse(canvas);
  }

  castRay(items: Mesh[] = this.components.meshes): Intersection | null {
    const camera = this.components.camera.getCamera();
    this.raycaster.setFromCamera(this.mouse.position, camera);
    const result = this.raycaster.intersectObjects(items);
    const filtered = this.filterClippingPlanes(result);
    return filtered.length > 0 ? filtered[0] : null;
  }

  private filterClippingPlanes(objs: Intersection[]) {
    const planes = this.components.clippingPlanes;
    if (objs.length <= 0 || !planes || planes?.length <= 0) return objs;
    return objs.filter((elem) =>
      planes.every((elem2) => elem2.distanceToPoint(elem.point) > 0)
    );
  }
}
