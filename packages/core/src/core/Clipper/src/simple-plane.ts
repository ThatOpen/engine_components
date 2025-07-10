import * as THREE from "three";
import { TransformControls } from "three/examples/jsm/controls/TransformControls.js";
import { Hideable, Disposable, Event, World } from "../../Types";
import { Components } from "../../Components";
import { Clipper } from "..";

/**
 * Each of the clipping planes created by the clipper.
 */
export class SimplePlane implements Disposable, Hideable {
  /** Event that fires when the user starts dragging a clipping plane. */
  readonly onDraggingStarted = new Event();

  /** Event that fires when the user stops dragging a clipping plane. */
  readonly onDraggingEnded = new Event();

  /** {@link Disposable.onDisposed} */
  readonly onDisposed = new Event();

  /**
   * The normal vector of the clipping plane.
   */
  readonly normal: THREE.Vector3;

  /**
   * The origin point of the clipping plane.
   */
  readonly origin: THREE.Vector3;

  /**
   * The THREE.js Plane object representing the clipping plane.
   */
  readonly three = new THREE.Plane();

  /** The components instance to which this plane belongs. */
  components: Components;

  /** The world instance to which this plane belongs. */
  world: World;

  /** A custom string to identify what this plane is used for. */
  type = "default";

  private _title: string = "Clipping Plane";
  set title(value: string) {
    this._title = value;
    this.notifyManager();
  }

  get title() {
    return this._title;
  }

  protected readonly _helper: THREE.Object3D;

  protected _visible = true;

  protected _enabled = true;

  private _controlsActive = false;

  private readonly _arrowBoundBox = new THREE.Mesh();

  private readonly _planeMesh: THREE.Mesh;

  private readonly _controls: TransformControls;

  private readonly _hiddenMaterial = new THREE.MeshBasicMaterial({
    visible: false,
  });

  /**
   * Getter for the enabled state of the clipping plane.
   * @returns {boolean} The current enabled state.
   */
  get enabled() {
    return this._enabled;
  }

  /**
   * Setter for the enabled state of the clipping plane.
   * Updates the clipping plane state in the renderer and throws an error if no renderer is found.
   * @param {boolean} state - The new enabled state.
   */
  set enabled(state: boolean) {
    if (this.world.isDisposing) {
      return;
    }
    if (!this.world.renderer) {
      throw new Error("No renderer found for clipping plane!");
    }

    this._enabled = state;

    if (state) {
      this.visible = this._visibilityBeforeDisabled;
    } else {
      this._visibilityBeforeDisabled = this.visible;
      this.visible = false;
    }

    this.world.renderer.setPlane(state, this.three);
    this.notifyManager();
  }

  private _visibilityBeforeDisabled = true;

  /** {@link Hideable.visible } */
  get visible() {
    return this._visible;
  }

  /** {@link Hideable.visible } */
  set visible(state: boolean) {
    this._visible = state;
    this._controls.getHelper().visible = state;
    this._helper.visible = state;
    this.toggleControls(state);
    this.notifyManager();
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

  /**
   * Getter for the helper object of the clipping plane.
   * The helper object is a THREE.Object3D that contains the clipping plane mesh and other related objects.
   * It is used for positioning, rotating, and scaling the clipping plane in the 3D scene.
   *
   * @returns {THREE.Object3D} The helper object of the clipping plane.
   */
  get helper() {
    return this._helper;
  }

  constructor(
    components: Components,
    world: World,
    origin: THREE.Vector3,
    normal: THREE.Vector3,
    material: THREE.Material,
    size = 5,
    activateControls = true,
  ) {
    this.components = components;
    this.world = world;

    if (!world.renderer) {
      throw new Error("The given world must have a renderer!");
    }

    this.normal = normal;
    this.origin = origin;

    world.renderer.setPlane(true, this.three);

    this._planeMesh = SimplePlane.newPlaneMesh(size, material);
    this._helper = this.newHelper();
    this._controls = this.newTransformControls();

    this.three.setFromNormalAndCoplanarPoint(normal, origin);
    if (activateControls) {
      this.toggleControls(true);
    }
  }

  private notifyManager = () => {
    const clipper = this.components.get(Clipper);
    const id = clipper.list.getKey(this);
    if (id) clipper.list.set(id, this);
  };

  /**
   * Sets the clipping plane's normal and origin from the given normal and point.
   * This method resets the clipping plane's state, updates the normal and origin,
   * and positions the helper object accordingly.
   *
   * @param normal - The new normal vector for the clipping plane.
   * @param point - The new origin point for the clipping plane.
   *
   * @returns {void}
   */
  setFromNormalAndCoplanarPoint(normal: THREE.Vector3, point: THREE.Vector3) {
    this.reset();
    if (!this.normal.equals(normal)) {
      this.normal.copy(normal);
      this._helper.lookAt(normal);
    }
    this.origin.copy(point);
    this._helper.position.copy(point);
    this._helper.updateMatrix();
    this.update();
  }

  /** {@link Updateable.update} */
  update = () => {
    if (!this._enabled) return;
    this.three.setFromNormalAndCoplanarPoint(
      this.normal,
      this._helper.position,
    );
  };

  /** {@link Disposable.dispose} */
  dispose() {
    this._enabled = false;
    this.onDraggingStarted.reset();
    this.onDraggingEnded.reset();
    this._helper.removeFromParent();

    if (this.world.renderer) {
      this.world.renderer.setPlane(false, this.three);
    }

    this._arrowBoundBox.removeFromParent();
    this._arrowBoundBox.geometry.dispose();
    this._planeMesh.geometry.dispose();
    this._controls.getHelper().removeFromParent();
    this._controls.dispose();
    this.onDisposed.trigger();
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
    if (!this.world.renderer) {
      throw new Error("No renderer found for clipping plane!");
    }
    const camera = this.world.camera.three;
    const container = this.world.renderer.three.domElement;
    const controls = new TransformControls(camera, container);
    this.initializeControls(controls);
    this.world.scene.three.add(controls.getHelper());
    return controls;
  }

  private initializeControls(controls: TransformControls) {
    controls.attach(this._helper);
    controls.showX = false;
    controls.showY = false;
    controls.setSpace("local");
    this.createArrowBoundingBox();
    controls.getHelper().children[0].children[0].add(this._arrowBoundBox);
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
    this.world.camera.enabled = this._visible;
  }

  private newHelper() {
    const helper = new THREE.Object3D();
    helper.lookAt(this.normal);
    helper.position.copy(this.origin);
    this._planeMesh.position.z += 0.01;
    helper.add(this._planeMesh);
    this.world.scene.three.add(helper);
    return helper;
  }

  private static newPlaneMesh(size: number, material: THREE.Material) {
    const planeGeom = new THREE.PlaneGeometry(1);
    const mesh = new THREE.Mesh(planeGeom, material);
    mesh.scale.set(size, size, size);
    return mesh;
  }
}
