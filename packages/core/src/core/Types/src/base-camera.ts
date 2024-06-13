import * as THREE from "three";
import CameraControls from "camera-controls";
import { BaseWorldItem } from "./base-world-item";
import { CameraControllable } from "./interfaces";

/**
 * Abstract class representing a camera in a 3D world. All cameras should use this class as a base.
 */
export abstract class BaseCamera extends BaseWorldItem {
  /**
   * Whether the camera is enabled or not.
   */
  abstract enabled: boolean;

  /**
   * The Three.js camera instance.
   */
  abstract three: THREE.Camera;

  /**
   * Optional CameraControls instance for controlling the camera.
   * This property is only available if the camera is controllable.
   */
  abstract controls?: CameraControls;

  /**
   * Checks whether the instance is {@link CameraControllable}.
   *
   * @returns True if the instance is controllable, false otherwise.
   */
  hasCameraControls = (): this is CameraControllable => {
    return "controls" in this;
  };
}
