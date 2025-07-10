import * as THREE from "three";
import { Components } from "../../Components";
import { OrthoPerspectiveCamera } from "../../OrthoPerspectiveCamera";
import { Disposable, Event, World } from "../../Types";
import { UUID } from "../../../utils";
import { Disposer } from "../../Disposer";
import { Views } from "..";

export class View implements Disposable {
  private _components: Components;
  private _cameraOffset = 10;
  private _planeHelper: THREE.PlaneHelper;
  private _farPlaneHelper: THREE.PlaneHelper;
  private _cameraHelper: THREE.CameraHelper;

  private get _planeNormalOpposite() {
    return this.plane.normal.clone().negate();
  }

  private get _planePosition() {
    return this.plane.normal.clone().multiplyScalar(-this.plane.constant);
  }

  private get _cameraPosition() {
    return this._planePosition.addScaledVector(
      this._planeNormalOpposite,
      this._cameraOffset,
    );
  }

  readonly onStateChanged = new Event<string[]>();
  readonly onUpdated = new Event<undefined>();
  readonly onDisposed = new Event<undefined>();
  readonly camera: OrthoPerspectiveCamera;
  readonly plane = new THREE.Plane();
  readonly farPlane = new THREE.Plane();
  readonly id = UUID.create();

  // A flag to indicate when this view has been opened by its manager
  private _open = false;
  set open(value: boolean) {
    this._open = value;
    this.onStateChanged.trigger(["open"]);
  }

  get open() {
    return this._open;
  }

  set planeHelperColor(value: THREE.Color) {
    if (
      !Array.isArray(this._planeHelper.material) &&
      "color" in this._planeHelper.material &&
      this._planeHelper.material.color instanceof THREE.Color
    ) {
      this._planeHelper.material.color = value;
    }
  }

  set farPlaneHelperColor(value: THREE.Color) {
    if (
      !Array.isArray(this._farPlaneHelper.material) &&
      "color" in this._farPlaneHelper.material &&
      this._farPlaneHelper.material.color instanceof THREE.Color
    ) {
      this._farPlaneHelper.material.color = value;
    }
  }

  // Defines how far from the plane the second cut will be made
  private _range = Views.defaultRange;
  set range(value: number) {
    this._range = value;
    this.update();
  }

  get range() {
    return this._range;
  }

  set distance(value: number) {
    this.plane.constant = value;
    this.update();
  }

  get distance() {
    return this.plane.constant;
  }

  private _world: World | null = null;
  set world(value: World | null) {
    this._world = value;
    this.camera.currentWorld = value;
    if (value) {
      this.camera.projection.set("Orthographic");
      this.camera.set("Plan");
      this.camera.controls.dollySpeed = 6;
      this.camera.controls.restThreshold = 0.005;
      this.update();
    }
  }

  get world() {
    return this._world;
  }

  private _helpersVisible = false;
  set helpersVisible(value: boolean) {
    if (!value) {
      this._helpersVisible = value;
      this._planeHelper.removeFromParent();
      this._farPlaneHelper.removeFromParent();
      this._cameraHelper.removeFromParent();
      return;
    }

    if (!this.world) return;
    this._helpersVisible = value;
    this.world.scene.three.add(
      this._planeHelper,
      this._farPlaneHelper,
      // this._cameraHelper,
    );
  }

  get helpersVisible() {
    return this._helpersVisible;
  }

  private _planesEnabled = false;

  // for debugging purposes
  // Section the model based on the planes
  // without using the camera
  set planesEnabled(value: boolean) {
    const { world } = this;
    if (!world) return;
    const { renderer } = world;
    if (!renderer) return;
    renderer.setPlane(value, this.plane);
    renderer.setPlane(value, this.farPlane);
    this._planesEnabled = value;
  }

  get planesEnabled() {
    return this._planesEnabled;
  }

  constructor(
    components: Components,
    config?: {
      id?: string;
      normal?: THREE.Vector3;
      point?: THREE.Vector3;
    },
  ) {
    this._components = components;

    this.camera = new OrthoPerspectiveCamera(this._components);
    const { threeOrtho: camera } = this.camera;

    if (config?.id) this.id = config.id;
    if (config?.normal && config?.point) {
      const { normal, point } = config;
      this.plane.setFromNormalAndCoplanarPoint(normal, point);
    }

    this._cameraHelper = new THREE.CameraHelper(camera);
    this._planeHelper = new THREE.PlaneHelper(this.plane, 50);
    this._farPlaneHelper = new THREE.PlaneHelper(this.farPlane, 50);
    this.farPlaneHelperColor = new THREE.Color("blue");

    this.update();
  }

  dispose() {
    this.helpersVisible = false;
    const disposer = this._components.get(Disposer);
    disposer.destroy(this._planeHelper);
    disposer.destroy(this._farPlaneHelper);
    disposer.destroy(this._cameraHelper);
    this.camera.dispose();
    this.onDisposed.trigger();
  }

  // update based on changes made to this.plane
  update() {
    if (this.world) {
      // Update camera
      const position = this._cameraPosition;
      const target = this._planePosition;
      this.camera.controls.setLookAt(
        position.x,
        position.y,
        position.z,
        target.x,
        target.y,
        target.z,
        false,
      );
    }

    // Update far plane
    this.farPlane.normal.copy(this._planeNormalOpposite);
    this.farPlane.constant = this.range - this.plane.constant;

    this.onUpdated.trigger();
  }

  flip() {
    this.plane.normal.negate();
    this.update();
  }
}
