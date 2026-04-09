import * as THREE from "three";
import { SlopeAnnotation, SlopeAnnotationStyle } from "./types";

/**
 * Builds the `LineSegments` position array for a committed slope annotation.
 * @returns A flat `Float32Array` of XYZ triplets (vertex pairs for `LineSegments`).
 */
export function buildSlopePositions(
  ann: SlopeAnnotation,
  style: SlopeAnnotationStyle,
): Float32Array {
  const { position, direction } = ann;
  const { length } = style;

  const tip = new THREE.Vector3(
    position.x + direction.x * length,
    0,
    position.z + direction.z * length,
  );

  // lineDir for the tick points outward (in the direction of travel).
  const tipDir = new THREE.Vector3(direction.x, 0, direction.z);
  const tickPositions = style.lineTick(tip, tipDir, style.tickSize);

  // prettier-ignore
  const shaft = [
    position.x, 0, position.z,
    tip.x,      0, tip.z,
  ];

  return new Float32Array([...shaft, ...tickPositions]);
}

/**
 * Returns the tip position of a slope annotation in drawing local space.
 */
export function getSlopeTip(ann: SlopeAnnotation, length: number): THREE.Vector3 {
  return new THREE.Vector3(
    ann.position.x + ann.direction.x * length,
    0,
    ann.position.z + ann.direction.z * length,
  );
}
