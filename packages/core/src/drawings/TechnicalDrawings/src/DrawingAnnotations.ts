import * as THREE from "three";
import * as FRAGS from "@thatopen/fragments";
import type { AnnotationSystem } from "./DrawingSystem";

/** A single annotation entry stored in {@link DrawingAnnotations}, bundling the owning system, the annotation data, and its Three.js group. */
export interface AnnotationEntry {
  /** The system that created and owns this annotation. */
  system: AnnotationSystem<any>;
  /** The persisted annotation data (e.g. {@link LinearAnnotation}). */
  data: unknown;
  /** The Three.js group added to {@link TechnicalDrawing.three}. */
  three: THREE.Group;
}

/** Flat annotation store for a {@link TechnicalDrawing}, keyed by UUID. */
export class DrawingAnnotations extends FRAGS.DataMap<string, AnnotationEntry> {
  /**
   * Each entry bundles the owning system, the data, and the Three.js group —
   * so a single `drawing.annotations.get(uuid)` gives full access to all three.
   *
   * Systems write here when they create or update annotations; consumers read
   * from here or subscribe to system-level events (`onCommit`, `onDelete`).
   *
   * ```ts
   * // Get everything for a known UUID
   * const { system, data, three } = drawing.annotations.get(uuid)!;
   *
   * // Iterate all annotations owned by a specific system
   * for (const [uuid, dim] of drawing.annotations.getBySystem(dims)) { ... }
   * ```
   */
  constructor() {
    super();
  }
  /**
   * Returns a snapshot map of `uuid → item` for all annotations owned by
   * `system` on this drawing. Filters the flat store by system identity.
   *
   * The returned `Map` is a snapshot — it does not update reactively.
   * Subscribe to system events (`onCommit`, `onDelete`, `onUpdate`) for
   * reactive updates.
   */
  /**
   * Returns a snapshot map of `uuid → item` for all annotations owned by
   * `system` on this drawing. TypeScript infers the item type from the
   * system's `_item` declaration marker, avoiding DataMap event variance issues.
   */
  getBySystem<T>(system: { readonly _item: T }): Map<string, T> {
    const result = new Map<string, T>();
    for (const [uuid, entry] of this) {
      if (entry.system === (system as any)) result.set(uuid, entry.data as T);
    }
    return result;
  }
}
