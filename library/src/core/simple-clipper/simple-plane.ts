import {
  CylinderGeometry,
  DoubleSide,
  Mesh,
  MeshBasicMaterial,
  Object3D,
  Plane,
  PlaneGeometry,
  Vector3,
} from "three";
import { TransformControls } from "three/examples/jsm/controls/TransformControls";
import { Components } from "../../components";

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
  private readonly components: Components;

  constructor(
    components: Components,
    origin: Vector3,
    normal: Vector3,
    onStartDragging: Function,
    onEndDragging: Function,
    planeSize: number,
    isDraggable = true
  ) {
    this.planeSize = planeSize;
    this.components = components;
    this.plane = new Plane();
    this.components.renderer.togglePlane(true, this.plane);
    this.planeMesh = this.getPlaneMesh();
    this.normal = normal;
    this.origin = origin;
    this.helper = this.createHelper();
    this.controls = this.newTransformControls();
    if (isDraggable) {
      this.setupEvents(onStartDragging, onEndDragging);
    }
    this.plane.setFromNormalAndCoplanarPoint(normal, origin);
  }

  get enabled() {
    return this._enabled;
  }

  set enabled(enabled: boolean) {
    this._enabled = enabled;
    this.components.renderer.togglePlane(enabled, this.plane);
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
    (this.components as any) = null;
  }

  removeFromScene = () => {
    this.helper.removeFromParent();

    this.components.renderer.togglePlane(false, this.plane);

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
      opacity: 0.2,
    });
  }

  private static getHiddenMaterial() {
    return new MeshBasicMaterial({ visible: false });
  }

  private newTransformControls() {
    const camera = this.components.camera?.get();
    const container = this.components.renderer?.get().domElement;
    if (!camera || !container)
      throw new Error("Camera or container not initialised.");
    const controls = new TransformControls(camera, container);
    this.initializeControls(controls);
    const scene = this.components?.scene?.get();
    if (!scene) throw new Error("Scene not initialised.");
    scene.add(controls);
    return controls;
  }

  private initializeControls(controls: TransformControls) {
    controls.attach(this.helper);
    controls.showX = false;
    controls.showY = false;
    controls.setSpace("local");
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
    this.controls.addEventListener("change", () => this.onPlaneChanged());

    this.controls.addEventListener("dragging-changed", (event) => {
      if (!this._enabled) return;
      this.isVisible = !event.value;
      this.components.camera.enabled = this.isVisible;
      if (event.value) onStart();
      else onEnd();
    });

    /* this.context.ifcCamera.currentNavMode.onChangeProjection.on((camera) => {
          this.controls.camera = camera;
        }); */
  }

  protected onPlaneChanged() {
    if (!this._enabled) return;
    this.plane.setFromNormalAndCoplanarPoint(this.normal, this.helper.position);
  }

  private createHelper() {
    const helper = new Object3D();
    helper.lookAt(this.normal);
    helper.position.copy(this.origin);
    const scene = this.components?.scene?.get();
    if (!scene) throw new Error("Scene not initialised");
    scene.add(helper);
    helper.add(this.planeMesh);
    return helper;
  }

  private getPlaneMesh() {
    const planeGeom = new PlaneGeometry(this.planeSize, this.planeSize, 1);
    return new Mesh(planeGeom, SimplePlane.planeMaterial);
  }
}
