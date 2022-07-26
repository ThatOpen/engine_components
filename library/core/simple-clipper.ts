import {Vector3, Matrix3, Intersection, Mesh, Plane, Vector2, Raycaster} from 'three';
import {
  CylinderGeometry,
  DoubleSide,
  MeshBasicMaterial,
  Object3D,
  PlaneGeometry,
} from 'three';
import { TransformControls } from 'three/examples/jsm/controls/TransformControls';
import {Components} from "../components";
import {IDeletable, IEnableable, IHideable, ToolComponent} from "./base-types";

export class SimpleClipper implements ToolComponent, IHideable, IDeletable, IEnableable {

  public readonly name = "clipper";
  dragging: boolean;
  planes: SimplePlane[];
  intersection: Intersection | undefined;
  orthogonalY = true;
  toleranceOrthogonalY = 0.7;
  planeSize = 5;
  private _enabled: boolean;
  private _visible: boolean;
  private readonly context: Components;
  private readonly raycaster: Raycaster;

  position = new Vector2();
  rawPosition = new Vector2();

  constructor(context: Components) {
    this.context = context;
    this._enabled = false;
    this._visible = false;
    this.dragging = false;
    this.planes = [];
    this.raycaster = new Raycaster()

    const domElement = context.renderer!.renderer.domElement

    domElement.onmousemove = (event: MouseEvent) => {
      this.rawPosition.x = event.clientX;
      this.rawPosition.y = event.clientY;
      const bounds = domElement.getBoundingClientRect();
      this.position.x = ((event.clientX - bounds.left) / (bounds.right - bounds.left)) * 2 - 1;
      this.position.y = -((event.clientY - bounds.top) / (bounds.bottom - bounds.top)) * 2 + 1;
    };
  }

  get visible() {
    return this._visible;
  }

  set visible(visible: boolean){
    this._visible = visible;
    if(!visible) {
      this.enabled = false;
    }
    this.planes.forEach((plane) => {
      if (!plane.isPlan) {
        plane.visible = visible;
      }
    })
    this.updateMaterials();
  }

  get enabled() {
    return this._enabled;
  }

  set enabled(state) {
    this._enabled = state;

    if(state && !this._visible){
      this.visible = true;
    }

    this.planes.forEach((plane) => {
      if (!plane.isPlan) {
        plane.enabled = state;
      }
    });
    this.updateMaterials();
  }

  toggle() {
    this.enabled = !this.enabled;
  }

  dispose() {
    this.planes.forEach((plane) => plane.dispose());
    this.planes.length = 0;
    (this.context as any) = null;
  }
  createPlane = () => {
    if (!this.enabled) return;
    const intersects = this.castRayIfc();
    if (!intersects) return;
    this.createPlaneFromIntersection(intersects);
    this.intersection = undefined;
  };

  createFromNormalAndCoplanarPoint = (normal: Vector3, point: Vector3, isPlan = false) => {
    const plane = new SimplePlane(
      this.context,
      point,
      normal,
      this.activateDragging,
      this.deactivateDragging,
      this.planeSize,
    );
    plane.isPlan = isPlan;
    this.planes.push(plane);
    this.context.renderer?.addClippingPlane(plane.plane);
    this.updateMaterials();
    return plane;
  };

  delete = () => {
    this.deletePlane()
  }

  deletePlane = (plane?: SimplePlane) => {
    let existingPlane: SimplePlane | undefined | null = plane;
    if (!existingPlane) {
      if (!this.enabled) return;
      existingPlane = this.pickPlane();
    }
    if (!existingPlane) return;
    const index = this.planes.indexOf(existingPlane);
    if (index === -1) return;
    existingPlane.removeFromScene();
    this.planes.splice(index, 1);
    this.context.renderer?.removeClippingPlane(existingPlane.plane);
    this.updateMaterials();
  };

  deleteAllPlanes = () => {
    while (this.planes.length > 0) {
      this.deletePlane(this.planes[0]);
    }
  };

  private pickPlane = () => {
    const planeMeshes = this.planes.map((p) => p.planeMesh);
    const arrowMeshes = this.planes.map((p) => p.arrowBoundingBox);
    const intersects = this.castRay([...planeMeshes, ...arrowMeshes]);
    if (intersects.length > 0) {
      return this.planes.find((p) => {
        if (p.planeMesh === intersects[0].object || p.arrowBoundingBox === intersects[0].object) {
          return p;
        }
        return null;
      });
    }
    return null;
  };

  private createPlaneFromIntersection = (intersection: Intersection) => {
    const constant = intersection.point.distanceTo(new Vector3(0, 0, 0));
    const normal = intersection.face?.normal;
    if (!constant || !normal) return;
    const normalMatrix = new Matrix3().getNormalMatrix(intersection.object.matrixWorld);
    const worldNormal = normal.clone().applyMatrix3(normalMatrix).normalize();
    this.normalizePlaneDirectionY(worldNormal);
    const plane = this.newPlane(intersection, worldNormal.negate());
    this.planes.push(plane);
    this.context.renderer?.addClippingPlane(plane.plane);
    this.updateMaterials();
  };

  private normalizePlaneDirectionY(normal: Vector3) {
    if (this.orthogonalY) {
      if (normal.y > this.toleranceOrthogonalY) {
        normal.x = 0;
        normal.y = 1;
        normal.z = 0;
      }
      if (normal.y < -this.toleranceOrthogonalY) {
        normal.x = 0;
        normal.y = -1;
        normal.z = 0;
      }
    }
  }

  private newPlane(intersection: Intersection, worldNormal: Vector3) {
    return new SimplePlane(
      this.context,
      intersection.point,
      worldNormal,
      this.activateDragging,
      this.deactivateDragging,
      this.planeSize,
    );
  }

  private activateDragging = () => {
    this.dragging = true;
  };

  private deactivateDragging = () => {
    this.dragging = false;
  };

  private updateMaterials = () => {
    // Apply clipping to all models
    const planes = this.context.renderer?.renderer.clippingPlanes;
    this.context.meshes.forEach((model) => {
      if (Array.isArray(model.material)) {
        model.material.forEach((mat) => (mat.clippingPlanes = planes));
      } else {
        model.material.clippingPlanes = planes;
      }
    });
  };

  update(_delta: number): void {

  }

  castRay(items: Object3D[]) {
    const camera = this.context.camera?.getCamera();
    if(!camera) throw new Error("Camera required for clipper")
    this.raycaster.setFromCamera(this.position, camera);
    return this.raycaster.intersectObjects(items);
  }

  castRayIfc() {
    const items = this.castRay(this.context.meshes);
    const filtered = this.filterClippingPlanes(items);
    return filtered.length > 0 ? filtered[0] : null;
  }

  private filterClippingPlanes(objs: Intersection[]) {
    const planes = this.context.renderer?.renderer.clippingPlanes;
    if (objs.length <= 0 || !planes || planes?.length <= 0) return objs;
    // const planes = this.clipper?.planes.map((p) => p.plane);
    return objs.filter((elem) => planes.every((elem2) => elem2.distanceToPoint(elem.point) > 0));
  }
}



//



export class SimplePlane {
  static planeMaterial = SimplePlane.getPlaneMaterial();
  private static hiddenMaterial = SimplePlane.getHiddenMaterial();
  readonly arrowBoundingBox = new Mesh();
  readonly plane: Plane;
  readonly planeMesh: Mesh;

  isVisible = true;
  _enabled = true;
  edgesActive = true;

  // Wether this plane is a section or floor plan
  isPlan = false;

  readonly controls: TransformControls;
  readonly normal: Vector3;
  readonly origin: Vector3;
  readonly helper: Object3D;

  private readonly planeSize: number;
  private readonly context: Components;

  constructor(
    context: Components,
    origin: Vector3,
    normal: Vector3,
    onStartDragging: Function,
    onEndDragging: Function,
    planeSize: number,
  ) {
    this.planeSize = planeSize;
    this.context = context;
    this.plane = new Plane();
    this.planeMesh = this.getPlaneMesh();
    this.normal = normal;
    this.origin = origin;
    this.helper = this.createHelper();
    this.controls = this.newTransformControls();
    this.setupEvents(onStartDragging, onEndDragging);
    this.plane.setFromNormalAndCoplanarPoint(normal, origin);
  }

  get enabled() {
    return this._enabled;
  }

  set enabled(state: boolean) {
    this._enabled = state;
    const planes = this.context.renderer?.renderer.clippingPlanes;
    if (state && planes) {
      planes.push(this.plane);
    } else if(planes) {
      const index = planes.indexOf(this.plane);
      if (index >= 0) planes.splice(index);
    }
  }

  get visible() {
    return this.isVisible;
  }

  set visible(state: boolean) {
    this.isVisible = state;
    this.controls.visible = state;
    this.helper.visible = state;
  }

  dispose() {
    if (SimplePlane.planeMaterial) {
      SimplePlane.planeMaterial.dispose();
      (SimplePlane.planeMaterial as any) = null;
      SimplePlane.planeMaterial = SimplePlane.getPlaneMaterial();
    }
    if (SimplePlane.hiddenMaterial) {
      SimplePlane.hiddenMaterial.dispose();
      (SimplePlane.hiddenMaterial as any) = null;
      SimplePlane.hiddenMaterial = SimplePlane.getHiddenMaterial();
    }
    this.removeFromScene();
    (this.context as any) = null;
  }

  removeFromScene = () => {
    this.helper.removeFromParent();

    this.arrowBoundingBox.removeFromParent();
    this.arrowBoundingBox.geometry.dispose();
    (this.arrowBoundingBox as any) = undefined;

    this.planeMesh.geometry.dispose();
    (this.planeMesh.geometry as any) = undefined;

    this.controls.removeFromParent();
    this.controls.dispose();

    this.helper.removeFromParent();
  };

  private static getPlaneMaterial() {
    return new MeshBasicMaterial({
      color: 0xffff00,
      side: DoubleSide,
      transparent: true,
      opacity: 0.2
    });
  }

  private static getHiddenMaterial() {
    return new MeshBasicMaterial({ visible: false });
  }

  private newTransformControls() {
    const camera = this.context.camera?.getCamera();
    const container = this.context.renderer?.renderer.domElement;
    console.log(camera);
    console.log(container)
    if(!camera || !container) throw new Error("Camera or container not initialised.")
    const controls = new TransformControls(camera, container);
    this.initializeControls(controls);
    const scene = this.context?.scene?.getScene();
    if(!scene) throw new Error("Scene not initialised.")
    scene.add(controls);
    return controls;
  }

  private initializeControls(controls: TransformControls) {
    controls.attach(this.helper);
    controls.showX = false;
    controls.showY = false;
    controls.setSpace('local');
    this.createArrowBoundingBox();
    controls.children[0].children[0].add(this.arrowBoundingBox);
  }

  private createArrowBoundingBox() {
    this.arrowBoundingBox.geometry = new CylinderGeometry(0.18, 0.18, 1.2);
    this.arrowBoundingBox.material = SimplePlane.hiddenMaterial;
    this.arrowBoundingBox.rotateX(Math.PI / 2);
    this.arrowBoundingBox.updateMatrix();
    this.arrowBoundingBox.geometry.applyMatrix4(this.arrowBoundingBox.matrix);
  }

  private setupEvents(onStart: Function, onEnd: Function) {
    this.controls.addEventListener('change', () => {
      if (!this._enabled) return;
      this.plane.setFromNormalAndCoplanarPoint(this.normal, this.helper.position);
    });

    this.controls.addEventListener('dragging-changed', (event) => {
      if (!this._enabled) return;
      this.isVisible = !event.value;
      // @ts-ignore
      this.context.camera.enabled = this.isVisible;
      if (event.value) onStart();
      else onEnd();
    });

    /*this.context.ifcCamera.currentNavMode.onChangeProjection.on((camera) => {
      this.controls.camera = camera;
    });*/
  }

  private createHelper() {
    const helper = new Object3D();
    helper.lookAt(this.normal);
    helper.position.copy(this.origin);
    const scene = this.context?.scene?.getScene();
    if(!scene) throw new Error('Scene not initialised');
    scene.add(helper);
    helper.add(this.planeMesh);
    return helper;
  }

  private getPlaneMesh() {
    const planeGeom = new PlaneGeometry(this.planeSize, this.planeSize, 1);
    return new Mesh(planeGeom, SimplePlane.planeMaterial);
  }
}
