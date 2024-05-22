import * as THREE from "three";
import CameraControls from "camera-controls";
import { BaseWorldItem } from "./base-world-item";
import { CameraControllable } from "./interfaces";

export abstract class BaseCamera extends BaseWorldItem {
  abstract enabled: boolean;
  abstract three: THREE.Camera;

  abstract controls?: CameraControls;

  /** Whether is instance is {@link CameraControllable}. */
  hasCameraControls = (): this is CameraControllable => {
    return "controls" in this;
  };
}
