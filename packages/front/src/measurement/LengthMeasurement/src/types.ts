import * as THREE from "three";
import { DimensionLine, Line } from "../../../utils";

export interface LengthMeasurerTempData {
  isDragging: boolean;
  line: Line;
  startNormal?: THREE.Vector3;
  endNormal?: THREE.Vector3;
  dimension?: DimensionLine;
}

// Potential new modes:
// parallelEdges: select two edges and take the measurement between them
// sequential: when the user makes the second click, a new measure will start
/**
 * Represents the modes available for the length measurement tool. `free`: Allows free-form measurement without constraints. `edge`: Enables measurement constrained to item edges.
 */
export type LengthMeasurerModes = ["free", "edge"];
