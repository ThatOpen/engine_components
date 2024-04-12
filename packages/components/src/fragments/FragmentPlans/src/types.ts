import * as THREE from "three";
import { EdgesPlane } from "../../../navigation";

/**
 * Necessary data to create a new floor plan in the navigator.
 */
export interface PlanView {
  /** The unique identifier for this floor plan (e.g. "0w984V0GL6yR4z75YWgVfX"). */
  id: string;

  /** The human-readable name of this floor plan (e.g. "First floor"). */
  name: string;

  /** Whether the camera of the navigator should be orthogonal */
  ortho: boolean;

  /** The rotation of the clipping plane */
  normal: THREE.Vector3;

  /** The position of the clipping plane */
  point: THREE.Vector3;

  /** The clipping plane object that cuts the model. */
  plane?: EdgesPlane;

  /** The offset of the clipping plane to the plan height. */
  offset?: number;
}
