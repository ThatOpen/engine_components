import * as THREE from "three";
import CameraControls from "camera-controls";
import { CameraProjection } from "./types";
import { Event } from "../../Types";
import { OrthoPerspectiveCamera } from "../index";

/**
 * Object to control the {@link CameraProjection} of the {@link OrthoPerspectiveCamera}.
 */
export class ProjectionManager {
  /**
   * Event that fires when the {@link CameraProjection} changes.
   */
  readonly onChanged = new Event<
    THREE.PerspectiveCamera | THREE.OrthographicCamera
  >();

  /**
   * Current projection mode of the camera.
   * Default is "Perspective".
   */
  current: CameraProjection = "Perspective";

  /**
   * The camera controlled by this ProjectionManager.
   * It can be either a PerspectiveCamera or an OrthographicCamera.
   */
  camera: THREE.PerspectiveCamera | THREE.OrthographicCamera;

  /** Match Ortho zoom with Perspective distance when changing projection mode */
  matchOrthoDistanceEnabled = false;

  private _component: OrthoPerspectiveCamera;

  private _previousDistance = -1;

  constructor(camera: OrthoPerspectiveCamera) {
    this._component = camera;
    this.camera = camera.three;
  }

  /**
   * Sets the {@link CameraProjection} of the {@link OrthoPerspectiveCamera}.
   *
   * @param projection - the new projection to set. If it is the current projection,
   * it will have no effect.
   */
  async set(projection: CameraProjection) {
    if (this.current === projection) return;
    if (projection === "Orthographic") {
      this.setOrthoCamera();
    } else {
      await this.setPerspectiveCamera();
    }
    this.onChanged.trigger(this.camera);
  }

  /**
   * Changes the current {@link CameraProjection} from Ortographic to Perspective
   * and vice versa.
   */
  async toggle() {
    const isPerspective = this.current === "Perspective";
    const target = isPerspective ? "Orthographic" : "Perspective";
    await this.set(target);
  }

  private setOrthoCamera() {
    if (this._component.mode === null) return;
    // Matching orthographic camera to perspective camera
    // Resource: https://stackoverflow.com/questions/48758959/what-is-required-to-convert-threejs-perspective-camera-to-orthographic
    if (this._component.mode.id === "FirstPerson") {
      return;
    }
    this._previousDistance = this._component.controls.distance;
    this._component.controls.distance = 200;
    const dims = this.getPerspectiveDims();
    if (!dims) {
      return;
    }
    const { width, height } = dims;
    this.setupOrthoCamera(height, width);
    this.camera = this._component.threeOrtho;
    this.current = "Orthographic";
  }

  private getPerspectiveDims() {
    const world = this._component.currentWorld;
    if (!world || !world.renderer) {
      return null;
    }

    const lineOfSight = new THREE.Vector3();
    this._component.threePersp.getWorldDirection(lineOfSight);
    const target = new THREE.Vector3();
    this._component.controls.getTarget(target);
    const distance = target.clone().sub(this._component.threePersp.position);

    const depth = distance.dot(lineOfSight);
    const dims = world.renderer.getSize();
    const aspect = dims.x / dims.y;
    const camera = this._component.threePersp;
    const height = depth * 2 * Math.atan((camera.fov * (Math.PI / 180)) / 2);
    const width = height * aspect;
    return { width, height };
  }

  private setupOrthoCamera(height: number, width: number) {
    this._component.controls.mouseButtons.wheel = CameraControls.ACTION.ZOOM;
    this._component.controls.mouseButtons.middle = CameraControls.ACTION.ZOOM;

    const pCamera = this._component.threePersp;
    const oCamera = this._component.threeOrtho;

    oCamera.zoom = 1;
    oCamera.left = width / -2;
    oCamera.right = width / 2;
    oCamera.top = height / 2;
    oCamera.bottom = height / -2;
    oCamera.updateProjectionMatrix();
    oCamera.position.copy(pCamera.position);
    oCamera.quaternion.copy(pCamera.quaternion);
    this._component.controls.camera = oCamera;
  }

  private getDistance() {
    // this handles ortho zoom to perpective distance
    const pCamera = this._component.threePersp;
    const oCamera = this._component.threeOrtho;

    // this is the reverse of
    // const height = depth * 2 * Math.atan((pCamera.fov * (Math.PI / 180)) / 2);
    // accounting for zoom
    const depth =
      (oCamera.top - oCamera.bottom) /
      oCamera.zoom /
      (2 * Math.atan((pCamera.fov * (Math.PI / 180)) / 2));

    return depth;
  }

  private async setPerspectiveCamera() {
    this._component.controls.mouseButtons.wheel = CameraControls.ACTION.DOLLY;
    this._component.controls.mouseButtons.middle = CameraControls.ACTION.DOLLY;

    const pCamera = this._component.threePersp;
    const oCamera = this._component.threeOrtho;

    pCamera.position.copy(oCamera.position);
    pCamera.quaternion.copy(oCamera.quaternion);
    this._component.controls.mouseButtons.wheel = CameraControls.ACTION.DOLLY;

    if (this.matchOrthoDistanceEnabled) {
      this._component.controls.distance = this.getDistance();
    } else {
      this._component.controls.distance = this._previousDistance;
    }
    await this._component.controls.zoomTo(1);
    pCamera.updateProjectionMatrix();
    this._component.controls.camera = pCamera;
    this.camera = pCamera;
    this.current = "Perspective";
  }
}
