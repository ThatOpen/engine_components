import * as THREE from "three";
import { TransformControls } from "three/examples/jsm/controls/TransformControls";
import { Component, Disposable, Event, Hideable } from "../../base-types";
import { Components } from "../Components";

/**
 * Each of the planes created by {@link SimpleClipper}.
 */
export class SimplePlane
  extends Component<THREE.Plane>
  implements Disposable, Hideable
{
  /** {@link Component.name} */
  name = "SimplePlane";

  /** Event that fires when the user starts dragging a clipping plane. */
  readonly onDraggingStarted = new Event<void>();

  /** Event that fires when the user stops dragging a clipping plane. */
  readonly onDraggingEnded = new Event<void>();

  /** {@link Disposable.onDisposed} */
  readonly onDisposed = new Event<undefined>();

  readonly normal: THREE.Vector3;

  readonly origin: THREE.Vector3;

  protected readonly _helper: THREE.Object3D;

  protected readonly _plane = new THREE.Plane();
  // TODO: Make all planes share the same geometry
  // TODO: Clean up unnecessary attributes, clean up constructor
  protected _visible = true;

  protected _enabled = true;

  private _controlsActive = false;
  private readonly _arrowBoundBox = new THREE.Mesh();
  private readonly _planeMesh: THREE.Mesh;
  private readonly _controls: TransformControls;
  private readonly _hiddenMaterial = new THREE.MeshBasicMaterial({
    visible: false,
  });

  /** {@link Component.enabled} */
  get enabled() {
    return this._enabled;
  }

  /** {@link Component.enabled} */
  set enabled(state: boolean) {
    this._enabled = state;
    this.components.renderer.togglePlane(state, this._plane);
  }

  /** {@link Hideable.visible } */
  get visible() {
    return this._visible;
  }

  /** {@link Hideable.visible } */
  set visible(state: boolean) {
    this._visible = state;
    this._controls.visible = state;
    this._helper.visible = state;
    this.toggleControls(state);
  }

  /** The meshes used for raycasting */
  get meshes(): THREE.Mesh[] {
    return [this._planeMesh, this._arrowBoundBox];
  }

  /** The material of the clipping plane representation. */
  get planeMaterial() {
    return this._planeMesh.material;
  }

  /** The material of the clipping plane representation. */
  set planeMaterial(material: THREE.Material | THREE.Material[]) {
    this._planeMesh.material = material;
  }

  /** The size of the clipping plane representation. */
  get size() {
    return this._planeMesh.scale.x;
  }

  /** Sets the size of the clipping plane representation. */
  set size(size: number) {
    this._planeMesh.scale.set(size, size, size);
  }

  get helper() {
    return this._helper;
  }

  constructor(
    components: Components,
    origin: THREE.Vector3,
    normal: THREE.Vector3,
    material: THREE.Material,
    size = 5,
    activateControls = true
  ) {
    super(components);
    this.normal = normal;
    this.origin = origin;

    this.components.renderer.togglePlane(true, this._plane);
    this._planeMesh = SimplePlane.newPlaneMesh(size, material);
    this._helper = this.newHelper();
    this._controls = this.newTransformControls();

    this._plane.setFromNormalAndCoplanarPoint(normal, origin);
    if (activateControls) {
      this.toggleControls(true);
    }
  }

  async setFromNormalAndCoplanarPoint(
    normal: THREE.Vector3,
    point: THREE.Vector3
  ) {
    this.reset();
    if (!this.normal.equals(normal)) {
      this.normal.copy(normal);
      this._helper.lookAt(normal);
    }
    this.origin.copy(point);
    this._helper.position.copy(point);
    this._helper.updateMatrix();
    await this.update();
  }

  /** {@link Updateable.update} */
  update = async () => {
    if (!this._enabled) return;
    this._plane.setFromNormalAndCoplanarPoint(
      this.normal,
      this._helper.position
    );
  };

  /** {@link Component.get} */
  get() {
    return this._plane;
  }

  /** {@link Disposable.dispose} */
  async dispose() {
    this._enabled = false;
    this.onDraggingStarted.reset();
    this.onDraggingEnded.reset();
    this._helper.removeFromParent();
    this.components.renderer.togglePlane(false, this._plane);
    this._arrowBoundBox.removeFromParent();
    this._arrowBoundBox.geometry.dispose();
    this._planeMesh.geometry.dispose();
    this._controls.removeFromParent();
    this._controls.dispose();
    await this.onDisposed.trigger();
    this.onDisposed.reset();
  }

  private reset() {
    const normal = new THREE.Vector3(1, 0, 0);
    const point = new THREE.Vector3();
    if (!this.normal.equals(normal)) {
      this.normal.copy(normal);
      this._helper.lookAt(normal);
    }
    this.origin.copy(point);
    this._helper.position.copy(point);
    this._helper.updateMatrix();
  }

  protected toggleControls(state: boolean) {
    if (state) {
      if (this._controlsActive) return;
      this._controls.addEventListener("change", this.update);
      this._controls.addEventListener("dragging-changed", this.changeDrag);
    } else {
      this._controls.removeEventListener("change", this.update);
      this._controls.removeEventListener("dragging-changed", this.changeDrag);
    }
    this._controlsActive = state;
  }

  private newTransformControls() {
    const camera = this.components.camera.get();
    const container = this.components.renderer.get().domElement;
    const controls = new TransformControls(camera, container);
    this.initializeControls(controls);
    this.components.scene.get().add(controls);
    return controls;
  }

  private initializeControls(controls: TransformControls) {
    controls.attach(this._helper);
    controls.showX = false;
    controls.showY = false;
    controls.setSpace("local");
    this.createArrowBoundingBox();
    controls.children[0].children[0].add(this._arrowBoundBox);
  }

  private createArrowBoundingBox() {
    this._arrowBoundBox.geometry = new THREE.CylinderGeometry(0.18, 0.18, 1.2);
    this._arrowBoundBox.material = this._hiddenMaterial;
    this._arrowBoundBox.rotateX(Math.PI / 2);
    this._arrowBoundBox.updateMatrix();
    this._arrowBoundBox.geometry.applyMatrix4(this._arrowBoundBox.matrix);
  }

  private changeDrag = (event: any) => {
    this._visible = !event.value;
    this.preventCameraMovement();
    this.notifyDraggingChanged(event);
  };

  private notifyDraggingChanged(event: any) {
    if (event.value) {
      this.onDraggingStarted.trigger();
    } else {
      this.onDraggingEnded.trigger();
    }
  }

  private preventCameraMovement() {
    this.components.camera.enabled = this._visible;
  }

  private newHelper() {
    const helper = new THREE.Object3D();
    helper.lookAt(this.normal);
    helper.position.copy(this.origin);
    this._planeMesh.position.z += 0.01;
    helper.add(this._planeMesh);
    this.components.scene.get().add(helper);
    return helper;
  }

  private static newPlaneMesh(size: number, material: THREE.Material) {
    const planeGeom = new THREE.PlaneGeometry(1);
    const mesh = new THREE.Mesh(planeGeom, material);
    mesh.scale.set(size, size, size);
    return mesh;
  }
}
