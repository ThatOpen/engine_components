import * as THREE from "three";
import { SimplePlane } from "../../../core";

/**
 * Necessary data to create a new floor plan in the navigator.
 */
export interface PlanView {
  /** The identifier for this floor plan. */
  id: string;

  /** Whether the camera of the navigator should be orthogonal */
  ortho: boolean;

  /** The rotation of the clipping plane */
  normal: THREE.Vector3;

  /** The position of the clipping plane */
  point: THREE.Vector3;

  /** The clipping plane object that cuts the model. */
  plane?: SimplePlane;
}
