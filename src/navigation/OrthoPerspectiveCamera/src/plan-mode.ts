import * as THREE from "three";
import CameraControls from "camera-controls";
import { NavigationMode } from "./types";
import { Event } from "../../../base-types";

/**
 * A {@link NavigationMode} that allows to navigate floorplans in 2D,
 * like many BIM tools.
 */
export class PlanMode implements NavigationMode {
  /** {@link NavigationMode.enabled} */
  enabled = false;

  /** {@link NavigationMode.id} */
  readonly id = "Plan";

  /** {@link NavigationMode.projectionChanged} */
  readonly projectionChanged = new Event<THREE.Camera>();

  private mouseAction1?: any;
  private mouseAction2?: any;
  private mouseInitialized = false;

  private readonly defaultAzimuthSpeed: number;
  private readonly defaultPolarSpeed: number;

  constructor(private camera: any) {
    this.defaultAzimuthSpeed = camera.controls.azimuthRotateSpeed;
    this.defaultPolarSpeed = camera.controls.polarRotateSpeed;
  }

  /** {@link NavigationMode.toggle} */
  toggle(active: boolean) {
    this.enabled = active;
    const controls = this.camera.controls;
    controls.azimuthRotateSpeed = active ? 0 : this.defaultAzimuthSpeed;
    controls.polarRotateSpeed = active ? 0 : this.defaultPolarSpeed;

    if (!this.mouseInitialized) {
      this.mouseAction1 = controls.touches.one;
      this.mouseAction2 = controls.touches.two;
      this.mouseInitialized = true;
    }

    if (active) {
      controls.mouseButtons.left = CameraControls.ACTION.TRUCK;
      controls.touches.one = CameraControls.ACTION.TOUCH_TRUCK;
      controls.touches.two = CameraControls.ACTION.TOUCH_ZOOM;
    } else {
      controls.mouseButtons.left = CameraControls.ACTION.ROTATE;
      controls.touches.one = this.mouseAction1!;
      controls.touches.two = this.mouseAction2!;
    }
  }
}
