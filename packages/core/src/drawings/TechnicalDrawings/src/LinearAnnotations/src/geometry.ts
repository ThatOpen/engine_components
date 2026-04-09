import * as THREE from "three";
import { LinearAnnotationStyle, LinearAnnotation } from "./types";
import { computeOffset } from "./machine";

/** Returns the tip position and inward direction for each tick endpoint of a linear dimension. */
export function getDimensionTickEndpoints(
  dim: LinearAnnotation,
): Array<{ tip: THREE.Vector3; dir: THREE.Vector3 }> {
  const { pointA, pointB, offset } = dim;
  const ab = new THREE.Vector3().subVectors(pointB, pointA);
  const perp = new THREE.Vector3(-ab.z, 0, ab.x).normalize();
  const dimA = pointA.clone().addScaledVector(perp, offset);
  const dimB = pointB.clone().addScaledVector(perp, offset);
  const dirAtoB = new THREE.Vector3().subVectors(dimB, dimA).normalize();
  return [
    { tip: dimA, dir: dirAtoB },
    { tip: dimB, dir: dirAtoB.clone().negate() },
  ];
}

/** Builds the flat vertex positions (x,y,z triplets) for a single committed linear dimension. */
export function buildDimensionPositions(
  dim: LinearAnnotation,
  style: LinearAnnotationStyle,
): number[] {
  const { pointA, pointB, offset } = dim;

  const ab = new THREE.Vector3().subVectors(pointB, pointA);
  const perp = new THREE.Vector3(-ab.z, 0, ab.x).normalize();

  const sign = offset >= 0 ? 1 : -1;
  const absOffset = Math.abs(offset);

  // Extension line A: start just above pointA, end just past the dimension line
  const extA0 = pointA.clone().addScaledVector(perp, style.extensionGap * sign);
  const extA1 = pointA
    .clone()
    .addScaledVector(perp, (absOffset + style.extensionOvershoot) * sign);

  // Extension line B
  const extB0 = pointB.clone().addScaledVector(perp, style.extensionGap * sign);
  const extB1 = pointB
    .clone()
    .addScaledVector(perp, (absOffset + style.extensionOvershoot) * sign);

  // Dimension line endpoints
  const dimA = pointA.clone().addScaledVector(perp, offset);
  const dimB = pointB.clone().addScaledVector(perp, offset);

  // Tick marks — lineDir always points inward (from tip toward opposite end)
  const dirAtoB = new THREE.Vector3().subVectors(dimB, dimA).normalize();
  const tickA = style.lineTick(dimA, dirAtoB, style.tickSize);
  const tickB = style.lineTick(dimB, dirAtoB.clone().negate(), style.tickSize);

  return [
    extA0.x, extA0.y, extA0.z, extA1.x, extA1.y, extA1.z,
    extB0.x, extB0.y, extB0.z, extB1.x, extB1.y, extB1.z,
    dimA.x, dimA.y, dimA.z, dimB.x, dimB.y, dimB.z,
    ...tickA,
    ...tickB,
  ];
}

/** Builds the flat vertex positions for a live dimension preview. */
export function buildPreviewPositions(
  kind: "placingPoints" | "positioningOffset",
  points: THREE.Vector3[],
  cursor: THREE.Vector3 | null,
  style: LinearAnnotationStyle,
): number[] {
  if (kind === "placingPoints") {
    const positions: number[] = [];
    for (let i = 0; i < points.length - 1; i++) {
      const a = points[i];
      const b = points[i + 1];
      positions.push(a.x, a.y, a.z, b.x, b.y, b.z);
    }
    if (cursor) {
      const last = points[points.length - 1];
      positions.push(last.x, last.y, last.z, cursor.x, cursor.y, cursor.z);
    }
    return positions;
  }

  // positioningOffset — show a full preview of the dimension(s)
  if (!cursor || points.length < 2) return [];
  const offset = computeOffset(points, cursor);
  const positions: number[] = [];
  for (let i = 0; i < points.length - 1; i++) {
    positions.push(
      ...buildDimensionPositions(
        { uuid: "", pointA: points[i], pointB: points[i + 1], offset, style: "" },
        style,
      ),
    );
  }
  return positions;
}
