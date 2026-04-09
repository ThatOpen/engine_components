import * as THREE from "three";
import {
  CalloutAnnotation,
  CalloutAnnotationEvent,
  CalloutAnnotationState,
} from "./types";

function _snapToCardinal(
  origin: THREE.Vector3,
  cursor: THREE.Vector3,
): THREE.Vector3 {
  const dx  = cursor.x - origin.x;
  const dz  = cursor.z - origin.z;
  const len = Math.sqrt(dx * dx + dz * dz);
  if (len === 0) return origin.clone();
  const angle   = Math.atan2(dz, dx);
  const snapped = Math.round(angle / (Math.PI / 4)) * (Math.PI / 4);
  return new THREE.Vector3(
    origin.x + Math.cos(snapped) * len,
    0,
    origin.z + Math.sin(snapped) * len,
  );
}

/**
 * Pure state transition function for the callout annotation tool.
 * Returns the **same state reference** when no transition applies.
 */
export function calloutAnnotationMachine(
  state: CalloutAnnotationState,
  event: CalloutAnnotationEvent,
): CalloutAnnotationState {
  switch (state.kind) {
    // ── awaiting centre ────────────────────────────────────────────────────────
    case "awaitingCenter": {
      if (event.type === "CLICK") {
        return { kind: "awaitingRadius", center: event.point.clone(), cursor: null };
      }
      return state;
    }

    // ── awaiting radius (corner) ───────────────────────────────────────────────
    case "awaitingRadius": {
      if (event.type === "MOUSE_MOVE") return { ...state, cursor: event.point.clone() };
      if (event.type === "CLICK") {
        // The cursor IS the SE corner: half-extents derived from delta to center.
        const halfW = Math.max(0.1, Math.abs(event.point.x - state.center.x));
        const halfH = Math.max(0.1, Math.abs(event.point.z - state.center.z));
        return {
          kind: "awaitingElbow",
          center: state.center,
          halfW,
          halfH,
          cursor: null,
        };
      }
      if (event.type === "ESCAPE") return { kind: "awaitingCenter" };
      return state;
    }

    // ── awaiting elbow ─────────────────────────────────────────────────────────
    case "awaitingElbow": {
      if (event.type === "MOUSE_MOVE") return { ...state, cursor: event.point.clone() };
      if (event.type === "CLICK") {
        return {
          kind: "awaitingExtension",
          center: state.center,
          halfW: state.halfW,
          halfH: state.halfH,
          elbow: event.point.clone(),
          cursor: null,
        };
      }
      if (event.type === "ESCAPE") return { kind: "awaitingCenter" };
      return state;
    }

    // ── awaiting extension ─────────────────────────────────────────────────────
    case "awaitingExtension": {
      if (event.type === "MOUSE_MOVE") {
        return { ...state, cursor: _snapToCardinal(state.elbow, event.point) };
      }
      if (event.type === "CLICK") {
        return {
          kind: "enteringText",
          center: state.center,
          halfW: state.halfW,
          halfH: state.halfH,
          elbow: state.elbow,
          extensionEnd: _snapToCardinal(state.elbow, event.point),
        };
      }
      if (event.type === "ESCAPE") return { kind: "awaitingCenter" };
      return state;
    }

    // ── entering text ──────────────────────────────────────────────────────────
    case "enteringText": {
      if (event.type === "SUBMIT_TEXT" && event.text.trim().length > 0) {
        const annotation: CalloutAnnotation = {
          uuid:         THREE.MathUtils.generateUUID(),
          center:       state.center.clone(),
          halfW:        state.halfW,
          halfH:        state.halfH,
          elbow:        state.elbow.clone(),
          extensionEnd: state.extensionEnd.clone(),
          text:         event.text.trim(),
          style:        "", // stamped with activeStyle by the component
        };
        return { kind: "committed", annotation };
      }
      if (event.type === "ESCAPE") return { kind: "awaitingCenter" };
      return state;
    }

    // ── committed ─────────────────────────────────────────────────────────────
    case "committed": {
      if (event.type === "ESCAPE") return { kind: "awaitingCenter" };
      return state;
    }
  }
}
