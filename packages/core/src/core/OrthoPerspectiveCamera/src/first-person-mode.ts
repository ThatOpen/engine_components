import * as THREE from "three";
import CameraControls from "camera-controls";
import { NavigationMode, NavigationModeOptions } from "./types";
import { OrthoPerspectiveCamera } from "../index";

/**
 * A {@link NavigationMode} that allows first person navigation, simulating FPS video games.
 */
export class FirstPersonMode implements NavigationMode {
  /** {@link NavigationMode.enabled} */
  enabled = false;

  /** {@link NavigationMode.id} */
  readonly id = "FirstPerson";

  constructor(private camera: OrthoPerspectiveCamera) {}

  /** {@link NavigationMode.set} */
  set(active: boolean, options?: NavigationModeOptions) {
    this.enabled = active;
    if (active) {
      const projection = this.camera.projection.current;
      if (projection !== "Perspective") {
        this.camera.set("Orbit");
        return;
      }
      this.setupFirstPersonCamera(options);
    }
  }

  private setupFirstPersonCamera(options?: NavigationModeOptions) {
    const controls = this.camera.controls;

    // Relocating the target onto the eye position is this mode's usual
    // activation framing, so it's skipped when the caller asks for the
    // target to be left untouched.
    if (!options?.preventTargetAdjustment) {
      const newTargetPosition = new THREE.Vector3();
      controls.distance--;
      controls.getPosition(newTargetPosition);
      controls.minDistance = 1;
      controls.maxDistance = 1;
      controls.distance = 1;

      controls.moveTo(
        newTargetPosition.x,
        newTargetPosition.y,
        newTargetPosition.z,
      );
    } else {
      controls.minDistance = 1;
      controls.maxDistance = 1;
      controls.distance = 1;
    }

    controls.truckSpeed = 50;
    controls.mouseButtons.wheel = CameraControls.ACTION.DOLLY;
    controls.touches.two = CameraControls.ACTION.TOUCH_ZOOM_TRUCK;
  }
}
