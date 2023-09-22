import * as THREE from "three";
import CameraControls from "camera-controls";
import { NavigationMode } from "./types";
import { Event } from "../../../base-types";

/**
 * A {@link NavigationMode} that allows first person navigation,
 * simulating FPS video games.
 */
export class FirstPersonMode implements NavigationMode {
  /** {@link NavigationMode.enabled} */
  enabled = false;

  /** {@link NavigationMode.id} */
  readonly id = "FirstPerson";

  /** {@link NavigationMode.projectionChanged} */
  readonly projectionChanged = new Event<THREE.Camera>();

  constructor(private camera: any) {}

  /** {@link NavigationMode.toggle} */
  toggle(active: boolean) {
    this.enabled = active;
    if (active) {
      const projection = this.camera.getProjection();
      if (projection !== "Perspective") {
        this.camera.setNavigationMode("Orbit");
        return;
      }
      this.setupFirstPersonCamera();
    }
  }

  private setupFirstPersonCamera() {
    const controls = this.camera.controls;
    const cameraPosition = new THREE.Vector3();
    controls.camera.getWorldPosition(cameraPosition);
    const newTargetPosition = new THREE.Vector3();
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
}
