import * as THREE from "three";
import CameraControls from "camera-controls";
import { Components } from "../../../core";
import { CameraProjection } from "./types";

/**
 * Object to control the {@link CameraProjection} of the {@link OrthoPerspectiveCamera}.
 */
export class ProjectionManager {
  get projection() {
    return this._currentProjection;
  }

  private _currentProjection: CameraProjection;
  private _currentCamera: THREE.PerspectiveCamera | THREE.OrthographicCamera;
  private _camera: any;
  private _previousDistance = -1;

  constructor(private components: Components, camera: any) {
    this._camera = camera;
    const perspective = "Perspective";
    this._currentCamera = camera.get(perspective);
    this._currentProjection = perspective;
  }

  /**
   * Sets the {@link CameraProjection} of the {@link OrthoPerspectiveCamera}.
   *
   * @param projection - the new projection to set. If it is the current projection,
   * it will have no effect.
   */
  async setProjection(projection: CameraProjection) {
    if (this.projection === projection) return;
    if (projection === "Orthographic") {
      this.setOrthoCamera();
    } else {
      await this.setPerspectiveCamera();
    }
    await this.updateActiveCamera();
  }

  private setOrthoCamera() {
    // Matching orthographic camera to perspective camera
    // Resource: https://stackoverflow.com/questions/48758959/what-is-required-to-convert-threejs-perspective-camera-to-orthographic
    if (this._camera.currentMode.id === "FirstPerson") {
      return;
    }
    this._previousDistance = this._camera.controls.distance;
    this._camera.controls.distance = 200;
    const { width, height } = this.getDims();
    this.setupOrthoCamera(height, width);
    this._currentCamera = this._camera.get("Orthographic");
    this._currentProjection = "Orthographic";
  }

  // This small delay is needed to hide weirdness during the transition
  private async updateActiveCamera() {
    await new Promise<void>((resolve) => {
      setTimeout(() => {
        this._camera.activeCamera = this._currentCamera;
        resolve();
      }, 50);
    });
  }

  private getDims() {
    const lineOfSight = new THREE.Vector3();
    this._camera.get("Perspective").getWorldDirection(lineOfSight);
    const target = new THREE.Vector3();
    this._camera.controls.getTarget(target);
    const distance = target
      .clone()
      .sub(this._camera.get("Perspective").position);

    const depth = distance.dot(lineOfSight);
    const dims = this.components.renderer.getSize();
    const aspect = dims.x / dims.y;
    const camera = this._camera.get("Perspective") as THREE.PerspectiveCamera;
    const height = depth * 2 * Math.atan((camera.fov * (Math.PI / 180)) / 2);
    const width = height * aspect;
    return { width, height };
  }

  private setupOrthoCamera(height: number, width: number) {
    this._camera.controls.mouseButtons.wheel = CameraControls.ACTION.ZOOM;
    this._camera.controls.mouseButtons.middle = CameraControls.ACTION.ZOOM;

    const pCamera = this._camera.get("Perspective") as THREE.PerspectiveCamera;
    const oCamera = this._camera.get(
      "Orthographic"
    ) as THREE.OrthographicCamera;

    oCamera.zoom = 1;
    oCamera.left = width / -2;
    oCamera.right = width / 2;
    oCamera.top = height / 2;
    oCamera.bottom = height / -2;
    oCamera.updateProjectionMatrix();
    oCamera.position.copy(pCamera.position);
    oCamera.quaternion.copy(pCamera.quaternion);
    this._camera.controls.camera = oCamera;
  }

  private async setPerspectiveCamera() {
    this._camera.controls.mouseButtons.wheel = CameraControls.ACTION.DOLLY;
    this._camera.controls.mouseButtons.middle = CameraControls.ACTION.DOLLY;

    const pCamera = this._camera.get("Perspective") as THREE.PerspectiveCamera;
    const oCamera = this._camera.get(
      "Orthographic"
    ) as THREE.OrthographicCamera;

    pCamera.position.copy(oCamera.position);
    pCamera.quaternion.copy(oCamera.quaternion);
    this._camera.controls.mouseButtons.wheel = CameraControls.ACTION.DOLLY;

    this._camera.controls.distance = this._previousDistance;
    await this._camera.controls.zoomTo(1);
    pCamera.updateProjectionMatrix();
    this._camera.controls.camera = pCamera;
    this._currentCamera = pCamera;
    this._currentProjection = "Perspective";
  }
}
