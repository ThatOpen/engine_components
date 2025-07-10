import * as THREE from "three";
import { DataSet } from "@thatopen/fragments";
import { Area, DimensionLine } from "../../../utils";

export interface AreaMeasurerTempData {
  isDragging: boolean;
  area: Area;
  lines: DataSet<DimensionLine>;
  point: THREE.Vector3;
}

// Potential new modes:
// face
/**
 * Represents the modes available for measuring areas. `free`: Allows freeform area measurement without constraints. `square`: Restricts area measurement to square shapes.
 */
export type AreaMeasurerModes = ["free", "square"];
