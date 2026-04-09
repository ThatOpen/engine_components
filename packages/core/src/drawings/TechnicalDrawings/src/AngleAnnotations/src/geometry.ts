import * as THREE from "three";
import { AngleAnnotation, AngleAnnotationStyle } from "./types";

/**
 * Returns the tip position and inward tangent direction for each tick endpoint
 * of an angle dimension arc. Used by {@link AngleDimensions} to build
 * `meshTick` geometry.
 */
export function getAngleTickEndpoints(
  dim: AngleAnnotation,
): Array<{ tip: THREE.Vector3; dir: THREE.Vector3 }> {
  const rayA = new THREE.Vector3().subVectors(dim.pointA, dim.vertex).normalize();
  const rayB = new THREE.Vector3().subVectors(dim.pointB, dim.vertex).normalize();
  const angleA = Math.atan2(rayA.z, rayA.x);
  let deltaAngle = Math.atan2(rayB.z, rayB.x) - angleA;
  while (deltaAngle > Math.PI) deltaAngle -= 2 * Math.PI;
  while (deltaAngle < -Math.PI) deltaAngle += 2 * Math.PI;
  if (dim.flipped) deltaAngle -= Math.sign(deltaAngle) * 2 * Math.PI;

  const arcStartA = new THREE.Vector3(
    dim.vertex.x + Math.cos(angleA) * dim.arcRadius, 0,
    dim.vertex.z + Math.sin(angleA) * dim.arcRadius,
  );
  const angleB = angleA + deltaAngle;
  const arcStartB = new THREE.Vector3(
    dim.vertex.x + Math.cos(angleB) * dim.arcRadius, 0,
    dim.vertex.z + Math.sin(angleB) * dim.arcRadius,
  );
  const sweepSign = Math.sign(deltaAngle);
  return [
    {
      tip: arcStartA,
      dir: new THREE.Vector3(-Math.sin(angleA) * sweepSign, 0, Math.cos(angleA) * sweepSign),
    },
    {
      tip: arcStartB,
      dir: new THREE.Vector3(Math.sin(angleB) * sweepSign, 0, -Math.cos(angleB) * sweepSign),
    },
  ];
}

// ─── Public helpers ───────────────────────────────────────────────────────────

/**
 * Returns the angle in radians between the two rays defined by the dimension.
 * Result is in [0, π].
 */
export function computeAngle(dim: AngleAnnotation): number {
  const rayA = new THREE.Vector3().subVectors(dim.pointA, dim.vertex).normalize();
  const rayB = new THREE.Vector3().subVectors(dim.pointB, dim.vertex).normalize();
  const interior = Math.acos(THREE.MathUtils.clamp(rayA.dot(rayB), -1, 1));
  return dim.flipped ? 2 * Math.PI - interior : interior;
}

/**
 * Returns the angle (in radians, in the XZ plane) of the bisector ray between
 * the two measured rays. Useful for positioning the text label.
 */
export function computeBisectorAngle(dim: AngleAnnotation): number {
  const rayA = new THREE.Vector3().subVectors(dim.pointA, dim.vertex).normalize();
  const rayB = new THREE.Vector3().subVectors(dim.pointB, dim.vertex).normalize();
  const angleA = Math.atan2(rayA.z, rayA.x);

  let deltaAngle = Math.atan2(rayB.z, rayB.x) - angleA;
  while (deltaAngle > Math.PI) deltaAngle -= 2 * Math.PI;
  while (deltaAngle < -Math.PI) deltaAngle += 2 * Math.PI;

  const bisector = angleA + deltaAngle / 2;
  return dim.flipped ? bisector + Math.PI : bisector;
}

// ─── Internal helpers ─────────────────────────────────────────────────────────

function buildArcPositions(
  vertex: THREE.Vector3,
  rayA: THREE.Vector3,
  rayB: THREE.Vector3,
  arcRadius: number,
  style: AngleAnnotationStyle,
  flipped = false,
): number[] {
  const angleA = Math.atan2(rayA.z, rayA.x);
  let deltaAngle = Math.atan2(rayB.z, rayB.x) - angleA;
  while (deltaAngle > Math.PI) deltaAngle -= 2 * Math.PI;
  while (deltaAngle < -Math.PI) deltaAngle += 2 * Math.PI;
  if (flipped) deltaAngle -= Math.sign(deltaAngle) * 2 * Math.PI;

  const positions: number[] = [];

  // ── Arc (LineSegments pairs) ────────────────────────────────────────────────
  const ARC_SEGMENTS = 8;
  for (let i = 0; i < ARC_SEGMENTS; i++) {
    const a0 = angleA + deltaAngle * (i / ARC_SEGMENTS);
    const a1 = angleA + deltaAngle * ((i + 1) / ARC_SEGMENTS);
    positions.push(
      vertex.x + Math.cos(a0) * arcRadius, 0, vertex.z + Math.sin(a0) * arcRadius,
      vertex.x + Math.cos(a1) * arcRadius, 0, vertex.z + Math.sin(a1) * arcRadius,
    );
  }

  // ── Extension lines (vertex → arc endpoint, with gap) ────────────────────
  const arcStartA = new THREE.Vector3(
    vertex.x + Math.cos(angleA) * arcRadius,
    0,
    vertex.z + Math.sin(angleA) * arcRadius,
  );
  const arcStartB = new THREE.Vector3(
    vertex.x + Math.cos(angleA + deltaAngle) * arcRadius,
    0,
    vertex.z + Math.sin(angleA + deltaAngle) * arcRadius,
  );
  const extA0 = vertex.clone().addScaledVector(rayA, style.extensionGap);
  const extB0 = vertex.clone().addScaledVector(rayB, style.extensionGap);
  positions.push(
    extA0.x, extA0.y, extA0.z, arcStartA.x, arcStartA.y, arcStartA.z,
    extB0.x, extB0.y, extB0.z, arcStartB.x, arcStartB.y, arcStartB.z,
  );

  // ── Ticks at arc endpoints ────────────────────────────────────────────────
  // Tangent direction pointing toward the arc interior (sweep direction)
  const sweepSign = Math.sign(deltaAngle);
  const tangentA = new THREE.Vector3(
    -Math.sin(angleA) * sweepSign, 0, Math.cos(angleA) * sweepSign,
  );
  const angleB = angleA + deltaAngle;
  const tangentB = new THREE.Vector3(
    Math.sin(angleB) * sweepSign, 0, -Math.cos(angleB) * sweepSign,
  );

  positions.push(
    ...style.lineTick(arcStartA, tangentA, style.tickSize),
    ...style.lineTick(arcStartB, tangentB, style.tickSize),
  );

  return positions;
}

// ─── Public geometry builders ─────────────────────────────────────────────────

/**
 * Builds the flat vertex positions for a single committed angle dimension.
 */
export function buildAnglePositions(
  dim: AngleAnnotation,
  style: AngleAnnotationStyle,
): number[] {
  const rayA = new THREE.Vector3().subVectors(dim.pointA, dim.vertex).normalize();
  const rayB = new THREE.Vector3().subVectors(dim.pointB, dim.vertex).normalize();
  return buildArcPositions(dim.vertex, rayA, rayB, dim.arcRadius, style, dim.flipped ?? false);
}

/**
 * Builds vertex positions for the live preview during `positioningArc`.
 * Uses the cursor distance from the vertex as the arc radius.
 */
export function buildAnglePreviewPositions(
  pointA: THREE.Vector3,
  vertex: THREE.Vector3,
  pointB: THREE.Vector3,
  cursor: THREE.Vector3 | null,
  style: AngleAnnotationStyle,
  flipped = false,
): number[] {
  if (!cursor) return [];
  const arcRadius = Math.max(
    0.05,
    new THREE.Vector3().subVectors(cursor, vertex).setY(0).length(),
  );
  const rayA = new THREE.Vector3().subVectors(pointA, vertex).normalize();
  const rayB = new THREE.Vector3().subVectors(pointB, vertex).normalize();
  return buildArcPositions(vertex, rayA, rayB, arcRadius, style, flipped);
}
