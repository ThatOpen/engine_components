import type * as THREE from "three";
import type * as OBC from "@thatopen/components";
import type { SnapResult } from "../../types";
import type { LinearAnnotationsTool } from "../index";

type LinearDimMsg = Parameters<OBC.LinearAnnotations["sendMachineEvent"]>[0];

/** Context passed to every {@link PlacementMode} registered on {@link LinearAnnotationsTool}. */
export interface LinearPlacementContext {
  /** Current state of the LinearDimensions state machine. */
  state: LinearAnnotationsTool["state"];
  /** Snap result at the current cursor position, or null if no geometry was hit. */
  snap: SnapResult | null;
  /** Drawing-local cursor point — snapped if a snap candidate was found. */
  point: THREE.Vector3;
  /** The line under the cursor, if any. */
  line: THREE.Line3 | undefined;
  /** Number of points placed in the current placement session. */
  pointsPlaced: number;
  /** True when the cursor is hovering over a handle of the selected dimension. */
  isHandleHovered: boolean;
  /** Send a message to the LinearDimensions state machine. */
  send(msg: LinearDimMsg): void;
}
