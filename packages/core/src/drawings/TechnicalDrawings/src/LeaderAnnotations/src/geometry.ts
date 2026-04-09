import * as THREE from "three";
import { LeaderAnnotation, LeaderAnnotationStyle } from "./types";

const CURVE_SEGMENTS = 24;

// ─── Internal helpers ──────────────────────────────────────────────────────────

function buildAngularSegments(
  arrowTip: THREE.Vector3,
  elbow: THREE.Vector3,
  extensionEnd: THREE.Vector3,
  style: LeaderAnnotationStyle,
): number[] {
  const positions: number[] = [
    arrowTip.x, arrowTip.y, arrowTip.z, elbow.x, elbow.y, elbow.z,
    elbow.x, elbow.y, elbow.z, extensionEnd.x, extensionEnd.y, extensionEnd.z,
  ];

  if (style.lineTick) {
    const dir = new THREE.Vector3().subVectors(arrowTip, elbow);
    if (dir.lengthSq() > 1e-10) {
      positions.push(...style.lineTick(arrowTip, dir.normalize(), style.tickSize));
    }
  }

  return positions;
}

function buildCurvedSegments(
  arrowTip: THREE.Vector3,
  elbow: THREE.Vector3,
  extensionEnd: THREE.Vector3,
  style: LeaderAnnotationStyle,
): number[] {
  const curve = new THREE.QuadraticBezierCurve3(arrowTip, elbow, extensionEnd);
  const points = curve.getPoints(CURVE_SEGMENTS);

  const positions: number[] = [];
  for (let i = 0; i < points.length - 1; i++) {
    const a = points[i];
    const b = points[i + 1];
    positions.push(a.x, a.y, a.z, b.x, b.y, b.z);
  }

  if (style.lineTick) {
    const dir = new THREE.Vector3().subVectors(arrowTip, elbow);
    if (dir.lengthSq() > 1e-10) {
      positions.push(...style.lineTick(arrowTip, dir.normalize(), style.tickSize));
    }
  }

  return positions;
}

function buildSegments(
  arrowTip: THREE.Vector3,
  elbow: THREE.Vector3,
  extensionEnd: THREE.Vector3,
  style: LeaderAnnotationStyle,
): number[] {
  return style.leaderShape === "curved"
    ? buildCurvedSegments(arrowTip, elbow, extensionEnd, style)
    : buildAngularSegments(arrowTip, elbow, extensionEnd, style);
}

// ─── Public geometry builders ──────────────────────────────────────────────────

/**
 * Builds the flat vertex positions for a committed leader annotation.
 */
export function buildLeaderPositions(
  ann: LeaderAnnotation,
  style: LeaderAnnotationStyle,
): number[] {
  return buildSegments(ann.arrowTip, ann.elbow, ann.extensionEnd, style);
}

/**
 * Builds vertex positions for the live preview.
 */
export function buildLeaderPreviewPositions(
  kind: "placingElbow" | "placingExtension",
  arrowTip: THREE.Vector3,
  elbow: THREE.Vector3 | null,
  cursor: THREE.Vector3 | null,
  style: LeaderAnnotationStyle,
): number[] {
  if (!cursor) return [];

  if (kind === "placingElbow") {
    return buildSegments(arrowTip, cursor, cursor, style);
  }

  return buildSegments(arrowTip, elbow!, cursor, style);
}
