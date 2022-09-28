import CameraControls from "camera-controls";
import { Camera, Vector3 } from "three";
import {
  AdvancedCamera,
  CameraProjections,
  NavigationModes,
  NavMode,
} from "../base-types";
import { Event } from "../../../core";

export class FirstPersonMode implements NavMode {
  readonly mode = NavigationModes.FirstPerson;
  enabled = false;
  onChange = new Event<any>();
  onChangeProjection = new Event<Camera>();

  constructor(private camera: AdvancedCamera) {}

  toggle(active: boolean) {
    this.enabled = active;
    if (active) {
      if (this.camera.projection !== CameraProjections.Perspective) {
        this.camera.setNavigationMode(NavigationModes.Orbit);
        return;
      }
      this.setupFirstPersonCamera();
    }
  }

  setupFirstPersonCamera() {
    const controls = this.camera.controls;
    const cameraPosition = new Vector3();
    controls.camera.getWorldPosition(cameraPosition);
    const newTargetPosition = new Vector3();
    controls.distance--;
    controls.camera.getWorldPosition(newTargetPosition);
    controls.minDistance = 1;
    controls.maxDistance = 1;
    controls.distance = 1;

    controls.moveTo(
      newTargetPosition.x,
      newTargetPosition.y,
      newTargetPosition.z
    );

    controls.truckSpeed = 50;
    controls.mouseButtons.wheel = CameraControls.ACTION.DOLLY;
    controls.touches.two = CameraControls.ACTION.TOUCH_ZOOM_TRUCK;
  }

  fitModelToFrame() {
    throw new Error("Fit to frame is not implemented with first person yet!");
  }
}
