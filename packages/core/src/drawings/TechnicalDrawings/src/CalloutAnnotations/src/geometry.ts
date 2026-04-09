import * as THREE from "three";
import { CalloutAnnotation, CalloutAnnotationStyle } from "./types";

// ─── Committed annotation geometry ────────────────────────────────────────────

/** Builds the flat vertex positions for a committed callout annotation. */
export function buildCalloutPositions(
  ann: CalloutAnnotation,
  style: CalloutAnnotationStyle,
): number[] {
  const positions: number[] = [];

  // Enclosure shape
  positions.push(...style.enclosure.buildGeometry(ann.center, ann.halfW, ann.halfH));

  // Extension line: attachment point on enclosure → elbow → extensionEnd
  const toElbow = new THREE.Vector3().subVectors(ann.elbow, ann.center);
  const dir = toElbow.lengthSq() > 1e-10
    ? toElbow.clone().normalize()
    : new THREE.Vector3(1, 0, 0);
  const attachment = style.enclosure.getAttachmentPoint(ann.center, ann.halfW, ann.halfH, dir);

  positions.push(
    attachment.x, attachment.y, attachment.z,
    ann.elbow.x,  ann.elbow.y,  ann.elbow.z,
    ann.elbow.x,  ann.elbow.y,  ann.elbow.z,
    ann.extensionEnd.x, ann.extensionEnd.y, ann.extensionEnd.z,
  );

  // Optional line tick at extensionEnd, pointing away from the elbow
  if (style.lineTick) {
    const extDir = new THREE.Vector3().subVectors(ann.extensionEnd, ann.elbow);
    if (extDir.lengthSq() > 1e-10) {
      positions.push(
        ...style.lineTick(ann.extensionEnd, extDir.normalize(), style.tickSize),
      );
    }
  }

  return positions;
}

// ─── Preview geometry ─────────────────────────────────────────────────────────

/** Builds vertex positions for the live preview during interactive placement. */
export function buildCalloutPreviewPositions(
  kind: "awaitingRadius" | "awaitingElbow" | "awaitingExtension",
  center: THREE.Vector3,
  halfW: number,
  halfH: number,
  elbow: THREE.Vector3 | null,
  cursor: THREE.Vector3 | null,
  style: CalloutAnnotationStyle,
): number[] {
  // For awaitingRadius the preview extents grow with the cursor's distance from center.
  const hw = kind === "awaitingRadius"
    ? (cursor ? Math.max(0.05, Math.abs(cursor.x - center.x)) : 0)
    : halfW;
  const hh = kind === "awaitingRadius"
    ? (cursor ? Math.max(0.05, Math.abs(cursor.z - center.z)) : 0)
    : halfH;

  if (hw < 1e-10 || hh < 1e-10) return [];

  const positions: number[] = [];
  positions.push(...style.enclosure.buildGeometry(center, hw, hh));

  if (kind === "awaitingRadius") return positions;

  // For awaitingElbow the cursor acts as the provisional elbow position.
  const elbowPoint = kind === "awaitingElbow" ? cursor : elbow;
  if (!elbowPoint) return positions;

  const toElbow = new THREE.Vector3().subVectors(elbowPoint, center);
  const dir = toElbow.lengthSq() > 1e-10
    ? toElbow.clone().normalize()
    : new THREE.Vector3(1, 0, 0);
  const attachment = style.enclosure.getAttachmentPoint(center, hw, hh, dir);

  if (kind === "awaitingElbow") {
    positions.push(
      attachment.x, 0, attachment.z,
      elbowPoint.x, 0, elbowPoint.z,
    );
    return positions;
  }

  // awaitingExtension: show the full line to the cursor
  if (!cursor) return positions;
  positions.push(
    attachment.x, 0, attachment.z,
    elbow!.x,      0, elbow!.z,
    elbow!.x,      0, elbow!.z,
    cursor.x,      0, cursor.z,
  );

  return positions;
}
