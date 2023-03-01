import * as THREE from "three";
import { TransformControls } from "three/examples/jsm/controls/TransformControls";
import { Components } from "../../components";
import { Component } from "../base-components";
import {Disposable, Updateable} from "../base-types";
import { Event } from "../event";

/**
 * Each of the planes created by {@link SimpleClipper}.
 */
export class SimplePlane
  extends Component<THREE.Plane>
  implements Disposable, Updateable
{
  /** {@link Component.name} */
  name = "SimplePlane";

  /** {@link Updateable.afterUpdate} */
  afterUpdate = new Event<THREE.Plane>();

  /** {@link Updateable.beforeUpdate} */
  beforeUpdate = new Event<THREE.Plane>();

  /** Event that fires when the user starts dragging a clipping plane. */
  onStartDragging = new Event<void>();

  /** Event that fires when the user stops dragging a clipping plane. */
  onEndDragging = new Event<void>();

  /** Whether this plane is used for floor plan navigation */
  isPlan = false;

  protected readonly _plane = new THREE.Plane();

  // TODO: Make all planes share the same geometry
  // TODO: Clean up unnecessary attributes, clean up constructor
  private _visible = true;
  private _enabled = true;
  private readonly _arrowBoundBox = new THREE.Mesh();
  private readonly _components: Components;
  private readonly _planeMesh: THREE.Mesh;
  private readonly _controls: TransformControls;
  private readonly _normal: THREE.Vector3;
  private readonly _origin: THREE.Vector3;
  private readonly _helper: THREE.Object3D;
  private readonly _hiddenMaterial = new THREE.MeshBasicMaterial({
    visible: false,
  });

  /** {@link Component.enabled} */
  get enabled() {
    return this._enabled;
  }

  /** {@link Component.enabled} */
  set enabled(enabled: boolean) {
    this._enabled = enabled;
    this._components.renderer.togglePlane(enabled, this._plane);
    this._visible = enabled;
    this._controls.visible = enabled;
    this._helper.visible = enabled;
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

  constructor(
    components: Components,
    origin: THREE.Vector3,
    normal: THREE.Vector3,
    size: number,
    material: THREE.Material,
    isPlan: boolean
  ) {
    super();
    this._components = components;
    this._normal = normal;
    this._origin = origin;
    this.isPlan = isPlan;

    this._components.renderer.togglePlane(true, this._plane);
    this._planeMesh = SimplePlane.newPlaneMesh(size, material);
    this._helper = this.newHelper();
    this._controls = this.newTransformControls();

    this._plane.setFromNormalAndCoplanarPoint(normal, origin);
    if (!isPlan) {
      this.setupEvents();
    }
  }

  /** {@link Updateable.update} */
  update(): void {
    if (!this._enabled) return;
    this.beforeUpdate.trigger(this._plane);
    this._plane.setFromNormalAndCoplanarPoint(
      this._normal,
      this._helper.position
    );
    this.afterUpdate.trigger(this._plane);
  }

  /** {@link Component.get} */
  get() {
    return this._plane;
  }

  /** {@link Disposable.dispose} */
  dispose() {
    this._enabled = false;
    this.beforeUpdate.reset();
    this.afterUpdate.reset();
    this.onStartDragging.reset();
    this.onEndDragging.reset();
    this._helper.removeFromParent();
    this._components.renderer.togglePlane(false, this._plane);
    this._arrowBoundBox.removeFromParent();
    this._arrowBoundBox.geometry.dispose();
    this._planeMesh.geometry.dispose();
    this._controls.removeFromParent();
    this._controls.dispose();
  }

  private newTransformControls() {
    const camera = this._components.camera.get();
    const container = this._components.renderer.get().domElement;
    const controls = new TransformControls(camera, container);
    this.initializeControls(controls);
    if (!this.isPlan) {
      this._components.scene.get().add(controls);
    }
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

  private setupEvents() {
    this._controls.addEventListener("change", () => this.update());

    this._controls.addEventListener("dragging-changed", (event) =>
      this.onDraggingChanged(event)
    );
  }

  private onDraggingChanged(event: THREE.Event) {
    if (this._enabled) {
      this._visible = !event.value;
      this.preventCameraMovement();
      this.notifyDraggingChanged(event);
    }
  }

  private notifyDraggingChanged(event: THREE.Event) {
    if (event.value) {
      this.onStartDragging.trigger();
    } else {
      this.onEndDragging.trigger();
    }
  }

  private preventCameraMovement() {
    this._components.camera.enabled = this._visible;
  }

  private newHelper() {
    const helper = new THREE.Object3D();
    helper.lookAt(this._normal);
    helper.position.copy(this._origin);
    this._planeMesh.position.z += 0.01;
    helper.add(this._planeMesh);
    if (!this.isPlan) {
      this._components.scene.get().add(helper);
    }
    return helper;
  }

  private static newPlaneMesh(size: number, material: THREE.Material) {
    const planeGeom = new THREE.PlaneGeometry(1);
    const mesh = new THREE.Mesh(planeGeom, material);
    mesh.scale.set(size, size, size);
    return mesh;
  }
}
