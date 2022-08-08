import { Camera, Vector3 } from "three";
import CameraControls from "camera-controls";
import {
  AdvancedCamera,
  CameraProjections,
  NavigationModes,
} from "./base-types";
import { Components } from "../../components";

export class ProjectionManager {
  private currentProjection: CameraProjections;
  private currentCamera: Camera;
  private camera: AdvancedCamera;
  private previousDistance = -1;

  get projection() {
    return this.currentProjection;
  }

  constructor(private components: Components, camera: AdvancedCamera) {
    this.camera = camera;
    this.currentCamera = camera.perspectiveCamera;
    this.currentProjection = CameraProjections.Perspective;
  }

  async setProjection(projection: CameraProjections) {
    if (this.projection === projection) return;
    if (projection === CameraProjections.Orthographic) {
      this.setOrthoCamera();
    } else {
      await this.setPerspectiveCamera();
    }
    await this.updateActiveCamera();
  }

  setOrthoCamera() {
    // Matching orthographic camera to perspective camera
    // Resource: https://stackoverflow.com/questions/48758959/what-is-required-to-convert-threejs-perspective-camera-to-orthographic
    if (this.camera.currentNavMode.mode === NavigationModes.FirstPerson) {
      return;
    }
    this.previousDistance = this.camera.controls.distance;
    this.camera.controls.distance = 200;
    const { width, height } = this.getDims();
    this.setupOrthoCamera(height, width);
    this.currentCamera = this.camera.orthoCamera;
    this.currentProjection = CameraProjections.Orthographic;
  }

  // This small delay is needed to hide weirdness during the transition
  private async updateActiveCamera() {
    await new Promise<void>((resolve) => {
      setTimeout(() => {
        this.camera.activeCamera = this.currentCamera;
        resolve();
      }, 50);
    });
  }

  private getDims() {
    const lineOfSight = new Vector3();
    this.camera.perspectiveCamera.getWorldDirection(lineOfSight);
    const target = new Vector3();
    this.camera.controls.getTarget(target);
    const distance = target.clone().sub(this.camera.perspectiveCamera.position);
    const depth = distance.dot(lineOfSight);
    const dims = this.components.renderer.getSize();
    const aspect = dims.x / dims.y;
    const fov = this.camera.perspectiveCamera.fov;
    const height = depth * 2 * Math.atan((fov * (Math.PI / 180)) / 2);
    const width = height * aspect;
    return { width, height };
  }

  private setupOrthoCamera(height: number, width: number) {
    this.camera.controls.mouseButtons.wheel = CameraControls.ACTION.ZOOM;
    this.camera.orthoCamera.zoom = 1;
    this.camera.orthoCamera.left = width / -2;
    this.camera.orthoCamera.right = width / 2;
    this.camera.orthoCamera.top = height / 2;
    this.camera.orthoCamera.bottom = height / -2;
    this.camera.orthoCamera.updateProjectionMatrix();
    this.camera.orthoCamera.position.copy(
      this.camera.perspectiveCamera.position
    );
    this.camera.orthoCamera.quaternion.copy(
      this.camera.perspectiveCamera.quaternion
    );
    this.camera.controls.camera = this.camera.orthoCamera;
  }

  private async setPerspectiveCamera() {
    this.camera.controls.mouseButtons.wheel = CameraControls.ACTION.DOLLY;

    this.camera.perspectiveCamera.position.copy(
      this.camera.orthoCamera.position
    );

    this.camera.perspectiveCamera.quaternion.copy(
      this.camera.orthoCamera.quaternion
    );

    this.camera.controls.mouseButtons.wheel = CameraControls.ACTION.DOLLY;

    this.camera.controls.distance = this.previousDistance;
    await this.camera.controls.zoomTo(1);
    this.camera.perspectiveCamera.updateProjectionMatrix();

    this.camera.controls.camera = this.camera.perspectiveCamera;
    this.currentProjection = CameraProjections.Perspective;
    this.currentCamera = this.camera.perspectiveCamera;
  }
}
