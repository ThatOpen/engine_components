import * as THREE from "three";
import { LeaderAnnotation, LeaderAnnotationEvent, LeaderAnnotationState } from "./types";

function _snapToCardinal(origin: THREE.Vector3, cursor: THREE.Vector3): THREE.Vector3 {
  const dx = cursor.x - origin.x;
  const dz = cursor.z - origin.z;
  const len = Math.sqrt(dx * dx + dz * dz);
  if (len === 0) return origin.clone();
  const angle = Math.atan2(dz, dx);
  const snapped = Math.round(angle / (Math.PI / 4)) * (Math.PI / 4);
  return new THREE.Vector3(
    origin.x + Math.cos(snapped) * len,
    0,
    origin.z + Math.sin(snapped) * len,
  );
}

/**
 * Pure state transition function for the leader annotation tool.
 * Returns the **same state reference** when no transition applies.
 */
export function leaderAnnotationMachine(
  state: LeaderAnnotationState,
  event: LeaderAnnotationEvent,
): LeaderAnnotationState {
  switch (state.kind) {
    // ── awaiting arrow tip ─────────────────────────────────────────────────────
    case "awaitingArrowTip": {
      if (event.type === "CLICK") {
        return { kind: "placingElbow", arrowTip: event.point.clone(), cursor: null };
      }
      return state;
    }

    // ── placing elbow ─────────────────────────────────────────────────────────
    case "placingElbow": {
      if (event.type === "MOUSE_MOVE") {
        return { ...state, cursor: event.point.clone() };
      }
      if (event.type === "CLICK") {
        return {
          kind: "placingExtension",
          arrowTip: state.arrowTip,
          elbow: event.point.clone(),
          cursor: null,
        };
      }
      if (event.type === "ESCAPE") return { kind: "awaitingArrowTip" };
      return state;
    }

    // ── placing extension ─────────────────────────────────────────────────────
    case "placingExtension": {
      if (event.type === "MOUSE_MOVE") {
        return { ...state, cursor: _snapToCardinal(state.elbow, event.point) };
      }
      if (event.type === "CLICK") {
        return {
          kind: "enteringText",
          arrowTip: state.arrowTip,
          elbow: state.elbow,
          extensionEnd: _snapToCardinal(state.elbow, event.point),
        };
      }
      if (event.type === "ESCAPE") return { kind: "awaitingArrowTip" };
      return state;
    }

    // ── entering text ─────────────────────────────────────────────────────────
    case "enteringText": {
      if (event.type === "SUBMIT_TEXT" && event.text.trim().length > 0) {
        const annotation: LeaderAnnotation = {
          uuid: THREE.MathUtils.generateUUID(),
          arrowTip: state.arrowTip.clone(),
          elbow: state.elbow.clone(),
          extensionEnd: state.extensionEnd.clone(),
          text: event.text.trim(),
          style: "", // stamped with activeStyle by the component
        };
        return { kind: "committed", annotation };
      }
      if (event.type === "ESCAPE") return { kind: "awaitingArrowTip" };
      return state;
    }

    // ── committed ─────────────────────────────────────────────────────────────
    case "committed": {
      if (event.type === "ESCAPE") return { kind: "awaitingArrowTip" };
      return state;
    }
  }
}
