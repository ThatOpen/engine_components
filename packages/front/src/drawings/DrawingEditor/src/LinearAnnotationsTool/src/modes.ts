import type { PlacementMode } from "../../types";
import type { LinearPlacementContext } from "./types";

/** One click → one dimension. Auto-confirms once both endpoints are set. */
export const IndividualMode: PlacementMode<LinearPlacementContext> = {
  onClick({ point, line, pointsPlaced, send }) {
    send({ type: "CLICK", point, line });
    // pointsPlaced is a pre-click snapshot; a value of 1 means this click just
    // placed the second point → confirm immediately to move to offset positioning.
    if (pointsPlaced === 1) send({ type: "CONFIRM" });
  },
};

/** Keeps the session open after each confirmation so points can be chained. */
export const SequentialMode: PlacementMode<LinearPlacementContext> = {
  onClick({ state, snap, point, line, send }) {
    if (state.kind === "placingPoints" && !snap) {
      send({ type: "CONFIRM" });
    } else {
      send({ type: "CLICK", point, line });
    }
  },
};

/** Clicking a projection line locks onto both its endpoints at once, then a second click sets the offset distance. */
export const LineMode: PlacementMode<LinearPlacementContext> = {
  onClick({ state, snap, isHandleHovered, point, line, send }) {
    if (snap?.line && state.kind === "awaitingFirstPoint" && !isHandleHovered) {
      send({ type: "SELECT_LINE", line: snap.line });
    } else {
      send({ type: "CLICK", point, line });
    }
  },
};
