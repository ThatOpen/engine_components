import * as THREE from "three";
import { AngleAnnotation, AngleAnnotationEvent, AngleAnnotationState } from "./types";

// ─── Constants ────────────────────────────────────────────────────────────────

/** Minimum angle between two lines for a dimension to be valid (1°). */
const MIN_ANGLE_RAD = Math.PI / 180;

// ─── Helpers ─────────────────────────────────────────────────────────────────

/**
 * Intersects two infinite lines (in the XZ plane) and returns the
 * intersection point, or `null` if the lines are parallel.
 */
function intersectLines2D(
  p1: THREE.Vector3,
  d1: THREE.Vector3,
  p2: THREE.Vector3,
  d2: THREE.Vector3,
): THREE.Vector3 | null {
  // 2D cross product: r × s = r.x * s.z - r.z * s.x
  const rxs = d1.x * d2.z - d1.z * d2.x;
  if (Math.abs(rxs) < 1e-10) return null;
  const qp = new THREE.Vector3().subVectors(p2, p1);
  const t = (qp.x * d2.z - qp.z * d2.x) / rxs;
  return new THREE.Vector3(p1.x + d1.x * t, 0, p1.z + d1.z * t);
}

/** Interior bisector direction (normalized sum of the two unit rays). */
function _interiorBisector(
  pointA: THREE.Vector3,
  vertex: THREE.Vector3,
  pointB: THREE.Vector3,
): THREE.Vector3 {
  const rA = new THREE.Vector3().subVectors(pointA, vertex).normalize();
  const rB = new THREE.Vector3().subVectors(pointB, vertex).normalize();
  return new THREE.Vector3().addVectors(rA, rB).normalize();
}

/** Signed projection of cursor onto the interior bisector (from vertex). */
function _bisectorProjection(
  pointA: THREE.Vector3,
  vertex: THREE.Vector3,
  pointB: THREE.Vector3,
  cursor: THREE.Vector3,
): number {
  const bisector = _interiorBisector(pointA, vertex, pointB);
  return new THREE.Vector3().subVectors(cursor, vertex).setY(0).dot(bisector);
}

/** True when cursor is on the far side of the vertex (reflex angle). */
function _isFlipped(
  pointA: THREE.Vector3,
  vertex: THREE.Vector3,
  pointB: THREE.Vector3,
  cursor: THREE.Vector3,
): boolean {
  return _bisectorProjection(pointA, vertex, pointB, cursor) < 0;
}

// ─── Machine ─────────────────────────────────────────────────────────────────

/**
 * Pure state transition function for the angle dimension tool.
 * Returns the **same state reference** when no transition applies.
 */
export function angleDimensionMachine(
  state: AngleAnnotationState,
  event: AngleAnnotationEvent,
): AngleAnnotationState {
  switch (state.kind) {
    // ── awaiting first line ───────────────────────────────────────────────────
    case "awaitingFirstLine": {
      if (event.type === "CLICK" && event.line) {
        return {
          kind: "awaitingSecondLine",
          line1: event.line.clone(),
          pointA: event.point.clone(),
        };
      }
      return state;
    }

    // ── awaiting second line ──────────────────────────────────────────────────
    case "awaitingSecondLine": {
      if (event.type === "CLICK" && event.line) {
        const d1 = new THREE.Vector3()
          .subVectors(state.line1.end, state.line1.start)
          .normalize();
        const d2 = new THREE.Vector3()
          .subVectors(event.line.end, event.line.start)
          .normalize();

        // Reject near-parallel lines (angle between lines < MIN_ANGLE_RAD)
        const cosAngle = Math.abs(d1.dot(d2));
        if (cosAngle > Math.cos(MIN_ANGLE_RAD)) return state;

        // Compute intersection of the two infinite lines
        const vertex = intersectLines2D(
          state.line1.start,
          d1,
          event.line.start,
          d2,
        );
        if (!vertex) return state;

        return {
          kind: "positioningArc",
          pointA: state.pointA.clone(),
          vertex,
          pointB: event.point.clone(),
          cursor: null,
          flipped: false,
        };
      }

      if (event.type === "ESCAPE") return { kind: "awaitingFirstLine" };
      return state;
    }

    // ── positioning arc ───────────────────────────────────────────────────────
    case "positioningArc": {
      if (event.type === "MOUSE_MOVE") {
        const flipped = _isFlipped(state.pointA, state.vertex, state.pointB, event.point);
        return { ...state, cursor: event.point.clone(), flipped };
      }

      if (event.type === "CLICK") {
        const flipped = _isFlipped(state.pointA, state.vertex, state.pointB, event.point);
        const arcRadius = Math.max(
          0.05,
          Math.abs(_bisectorProjection(state.pointA, state.vertex, state.pointB, event.point)),
        );
        const dimension: AngleAnnotation = {
          uuid: THREE.MathUtils.generateUUID(),
          pointA: state.pointA.clone(),
          vertex: state.vertex.clone(),
          pointB: state.pointB.clone(),
          arcRadius,
          flipped,
          style: "",
        };
        return { kind: "committed", dimension };
      }

      if (event.type === "ESCAPE") return { kind: "awaitingFirstLine" };
      return state;
    }

    // ── committed ─────────────────────────────────────────────────────────────
    case "committed": {
      if (event.type === "ESCAPE") return { kind: "awaitingFirstLine" };
      return state;
    }
  }
}
