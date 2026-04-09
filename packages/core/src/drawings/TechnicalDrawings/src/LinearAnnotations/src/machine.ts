import * as THREE from "three";
import {
  LinearAnnotation,
  LinearAnnotationEvent,
  LinearAnnotationState,
} from "./types";

// ─── Helpers ─────────────────────────────────────────────────────────────────

/**
 * Returns the point on `line` (treated as infinite) that lies directly
 * perpendicular to `anchor` relative to `lineDir`.
 *
 * Equivalent to: project `anchor` onto the infinite line and return that point.
 */
function projectPerpendicularOnLine(
  anchor: THREE.Vector3,
  line: THREE.Line3,
  lineDir: THREE.Vector3,
): THREE.Vector3 {
  const s = anchor.clone().sub(line.start).dot(lineDir);
  return line.start.clone().addScaledVector(lineDir, s);
}

/**
 * Returns true when two vectors are parallel (or anti-parallel) within a small
 * angular tolerance.
 */
function isParallel(a: THREE.Vector3, b: THREE.Vector3): boolean {
  return Math.abs(a.dot(b)) > 0.999;
}

/**
 * Returns true when two line segments represent the same geometric segment
 * (regardless of vertex order) within floating-point tolerance.
 */
function isSameLine(a: THREE.Line3, b: THREE.Line3): boolean {
  const eps = 1e-6;
  return (
    (a.start.distanceTo(b.start) < eps && a.end.distanceTo(b.end) < eps) ||
    (a.start.distanceTo(b.end) < eps && a.end.distanceTo(b.start) < eps)
  );
}

// ─── Public helpers (used by geometry.ts) ────────────────────────────────────

/** Computes the signed offset from a cursor position to the measurement axis defined by the first and last points. */
export function computeOffset(
  points: THREE.Vector3[],
  cursor: THREE.Vector3,
): number {
  const first = points[0];
  const last = points[points.length - 1];
  const measureDir = new THREE.Vector3().subVectors(last, first);
  if (measureDir.lengthSq() < 1e-10) return 0;
  measureDir.normalize();
  // Perpendicular to measureDir in XZ plane = lineDir direction
  const lineDirApprox = new THREE.Vector3(-measureDir.z, 0, measureDir.x);
  return cursor.clone().sub(first).dot(lineDirApprox);
}

/** Builds an array of {@link LinearAnnotation}s from consecutive point pairs, all sharing the same perpendicular offset. */
export function buildDimensions(
  points: THREE.Vector3[],
  offset: number,
): LinearAnnotation[] {
  const dims: LinearAnnotation[] = [];
  for (let i = 0; i < points.length - 1; i++) {
    dims.push({
      uuid: THREE.MathUtils.generateUUID(),
      pointA: points[i].clone(),
      pointB: points[i + 1].clone(),
      offset,
      style: "", // stamped with activeStyle by the component before persisting
    });
  }
  return dims;
}

// ─── Machine ─────────────────────────────────────────────────────────────────

/** Pure state transition function for the linear dimension tool. */
export function linearDimensionMachine(
  state: LinearAnnotationState,
  event: LinearAnnotationEvent,
): LinearAnnotationState {
  switch (state.kind) {
    // ── awaiting ──────────────────────────────────────────────────────────────
    case "awaitingFirstPoint": {
      if (event.type === "CLICK") {
        // Require a line snap — free-space clicks are not accepted here
        if (!event.line) return state;
        const lineDir = new THREE.Vector3()
          .subVectors(event.line.end, event.line.start)
          .normalize();
        return {
          kind: "placingPoints",
          points: [event.point.clone()],
          cursor: null,
          lineDir,
          firstLine: event.line.clone(),
        };
      }

      if (event.type === "SELECT_LINE") {
        // Jump directly to offset positioning using the line's endpoints
        return {
          kind: "positioningOffset",
          points: [event.line.start.clone(), event.line.end.clone()],
          cursor: null,
        };
      }

      return state;
    }

    // ── placing ───────────────────────────────────────────────────────────────
    case "placingPoints": {
      if (event.type === "MOUSE_MOVE") {
        // Project cursor onto the perpendicular measurement direction so the
        // preview line is always orthogonal to the measured lines.
        const perpDir = new THREE.Vector3(-state.lineDir.z, 0, state.lineDir.x);
        const last = state.points[state.points.length - 1];
        const dist = event.point.clone().sub(last).dot(perpDir);
        const projCursor = last.clone().addScaledVector(perpDir, dist);
        return { ...state, cursor: projCursor };
      }

      if (event.type === "CLICK") {
        // Require a line snap
        if (!event.line) return state;
        // Reject the same segment
        if (isSameLine(event.line, state.firstLine)) return state;
        // Reject non-parallel lines
        const clickedDir = new THREE.Vector3()
          .subVectors(event.line.end, event.line.start)
          .normalize();
        if (!isParallel(clickedDir, state.lineDir)) return state;

        // Snap to the exact perpendicular foot on the clicked line
        const projPoint = projectPerpendicularOnLine(
          state.points[0],
          event.line,
          state.lineDir,
        );
        const points = [...state.points, projPoint];
        return { ...state, points, cursor: state.cursor };
      }

      if (event.type === "CONFIRM" && state.points.length >= 2) {
        return { kind: "positioningOffset", points: state.points, cursor: null };
      }

      if (event.type === "ESCAPE") return { kind: "awaitingFirstPoint" };
      return state;
    }

    // ── positioning ───────────────────────────────────────────────────────────
    case "positioningOffset": {
      if (event.type === "MOUSE_MOVE") {
        return { ...state, cursor: event.point.clone() };
      }

      if (event.type === "CLICK") {
        const offset = computeOffset(state.points, event.point);
        return {
          kind: "committed",
          dimensions: buildDimensions(state.points, offset),
        };
      }

      if (event.type === "ESCAPE") return { kind: "awaitingFirstPoint" };
      return state;
    }

    // ── committed ─────────────────────────────────────────────────────────────
    case "committed": {
      if (event.type === "ESCAPE") return { kind: "awaitingFirstPoint" };
      return state;
    }
  }
}
