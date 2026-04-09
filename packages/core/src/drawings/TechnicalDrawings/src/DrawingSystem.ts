import * as THREE from "three";
import * as FRAGS from "@thatopen/fragments";
import { Event } from "../../../core/Types";
import type { Components } from "../../../core/Components";
import type { TechnicalDrawing } from "./TechnicalDrawing";
import { TechnicalDrawings } from "../../..";

/**
 * Defines how a measured value (in drawing-space metres) is converted to a
 * display string. Pass one of the {@link Units} presets or build your own.
 *
 * ```ts
 * dims.styles.get("default")!.unit = OBC.Units.cm;
 * ```
 */
export interface DimensionUnit {
  /** Multiplier applied to the raw metre value before display. */
  factor: number;
  /** Label appended to the formatted number (e.g. `"cm"`, `"mm"`, `"ft"`). */
  suffix: string;
}

/**
 * Built-in {@link DimensionUnit} presets.
 *
 * ```ts
 * style.unit = OBC.Units.mm;
 * ```
 */
export const Units = {
  m:  { factor: 1,         suffix: "m"  },
  cm: { factor: 100,       suffix: "cm" },
  mm: { factor: 1000,      suffix: "mm" },
  ft: { factor: 3.28084,   suffix: "ft" },
  in: { factor: 39.3701,   suffix: "in" },
} as const satisfies Record<string, DimensionUnit>;

/**
 * Minimum style contract shared by every annotation system.
 * All per-system style interfaces must extend this.
 */
export interface BaseAnnotationStyle {
  /** Line and text color as a hex number (e.g. `0xff0000`). */
  color: number;
  /** Distance from the annotation geometry to the text label in drawing local units. */
  textOffset: number;
  /** Font size of the text label in drawing local units. */
  fontSize: number;
  /**
   * Unit used to format measured values in text labels.
   * Defaults to {@link Units.m} (metres) when not set.
   */
  unit?: DimensionUnit;
}

/**
 * "Type bag" descriptor that fully parameterises an annotation system.
 * Each system declares a concrete interface extending this.
 *
 * ```ts
 * interface LinearAnnotationSystem extends DrawingSystemDescriptor {
 *   item:   LinearAnnotation;
 *   data:   LinearAnnotationData;
 *   style:  LinearAnnotationStyle;
 *   handle: "pointA" | "pointB" | "offset";
 * }
 * class LinearAnnotations extends AnnotationSystem<LinearAnnotationSystem> { ... }
 * ```
 */
export interface DrawingSystemDescriptor {
  item:   { uuid: string; style: string };
  data:   object;
  style:  BaseAnnotationStyle;
  handle: string;
}

/**
 * Abstract base for all annotation sub-systems operating on a
 * {@link TechnicalDrawing}. Provides the full CRUD lifecycle, material caches,
 * preview geometry, and automatic style-reactivity so subclasses only need to
 * implement geometry construction and handle-picking.
 *
 * @typeParam TSystem - A {@link DrawingSystemDescriptor} that declares the item,
 *   data, style, and handle types for this specific system.
 */
export abstract class AnnotationSystem<TSystem extends DrawingSystemDescriptor> {
  /**
   * Declaration-only type marker. Never set at runtime. Used by
   * {@link DrawingAnnotations.getBySystem} for variance-free type inference:
   * TypeScript can read `TSystem["item"]` from this covariant readonly field
   * without triggering the invariance issues of the `styles` DataMap events.
   * @internal
   */
  declare readonly _item: TSystem["item"];

  constructor(protected readonly _components: Components) {
    // onItemUpdated fires only on subsequent styles.set() calls for an already-
    // registered name, not on first registration — so no first-time guard needed.
    this.styles.onItemUpdated.add(({ key: styleName }) => {
      const lineMat = this._materialCache.get(styleName);
      if (lineMat) lineMat.color.setHex(this._resolveStyle(styleName).color);
      const meshMat = this._meshMaterialCache.get(styleName);
      if (meshMat) meshMat.color.setHex(this._resolveStyle(styleName).color);

      const techDrawings = this._components.get(TechnicalDrawings);
      const drawings = techDrawings
        ? [...techDrawings.list.values()]
        : [...this._knownDrawings];

      for (const drawing of drawings) {
        const uuids = [...drawing.annotations.getBySystem(this as any)]
          .filter(([, item]) => (item as TSystem["item"]).style === styleName)
          .map(([uuid]) => uuid);
        if (uuids.length > 0) this.update(drawing as TechnicalDrawing, uuids, {} as any);
      }
    });
  }

  abstract enabled: boolean;

  // ─── Styles ────────────────────────────────────────────────────────────────

  readonly styles = new FRAGS.DataMap<string, TSystem["style"]>();
  activeStyle = "default";

  // ─── Events ────────────────────────────────────────────────────────────────

  readonly onCommit  = new Event<{ drawing: TechnicalDrawing; item: TSystem["item"]; group: THREE.Group }[]>();
  readonly onUpdate  = new Event<{ item: TSystem["item"]; group: THREE.Group }>();
  readonly onDelete  = new Event<string[]>();
  readonly onDisposed = new Event<void>();

  // ─── Internal state ────────────────────────────────────────────────────────

  protected readonly _knownDrawings = new Set<TechnicalDrawing>();
  protected readonly _previewMaterial = new THREE.LineBasicMaterial({ color: 0xff6666, depthTest: false });
  protected _previewObject: THREE.LineSegments | null = null;
  protected _previewDrawing: TechnicalDrawing | null = null;
  protected readonly _materialCache     = new FRAGS.DataMap<string, THREE.LineBasicMaterial>();
  protected readonly _meshMaterialCache = new FRAGS.DataMap<string, THREE.MeshBasicMaterial>();
  /**
   * When `true` (default), {@link _disposeGroup} and {@link _redraw} will call
   * `.dispose()` on each child's `BufferGeometry`. Set to `false` in systems
   * where geometry is shared across multiple groups (e.g. {@link BlockAnnotations}).
   */
  protected _ownsChildGeometry = true;

  // ─── Abstract hooks ────────────────────────────────────────────────────────

  /**
   * Build and return a `THREE.Group` containing all geometry for `item`.
   * The group's own `userData` is set by the base class after this call.
   * Set `userData` on *children* (e.g. `ls.userData.isDimension = true`) here.
   */
  protected abstract _buildGroup(item: TSystem["item"], style: TSystem["style"]): THREE.Group;

  /**
   * Return the closest pickable handle on `drawing` for the given world-space
   * `ray`, or `null` if nothing is within `threshold` units.
   */
  abstract pickHandle(
    drawing: TechnicalDrawing,
    ray: THREE.Ray,
    threshold?: number,
  ): { uuid: string; handle: TSystem["handle"] } | null;

  // ─── Optional hooks (no-op defaults) ──────────────────────────────────────

  /** Called synchronously after a group is first persisted or redrawn. */
  protected _onAfterPersist(_item: TSystem["item"], _group: THREE.Group): void {}

  /** Called at the start of {@link dispose} before materials and events are torn down. */
  protected _onDispose(): void {}

  /** Override to rebuild preview geometry after a state transition. */
  protected _updatePreview(): void {}

  // ─── get ──────────────────────────────────────────────────────────────────

  get(
    drawings: TechnicalDrawing[],
  ): FRAGS.DataMap<string, { drawingUuid: string; item: TSystem["item"] }> {
    const result = new FRAGS.DataMap<string, { drawingUuid: string; item: TSystem["item"] }>();
    for (const drawing of drawings) {
      for (const [uuid, item] of drawing.annotations.getBySystem(this as any)) {
        result.set(uuid, { drawingUuid: drawing.uuid, item: item as TSystem["item"] });
      }
    }
    return result;
  }

  // ─── add ──────────────────────────────────────────────────────────────────

  add(drawing: TechnicalDrawing, data: TSystem["data"]): TSystem["item"] {
    const item = {
      uuid: THREE.MathUtils.generateUUID(),
      style: this.activeStyle,
      ...(data as object),
    } as TSystem["item"];
    const result = this._persist(drawing, item);
    this.onCommit.trigger([result]);
    return item;
  }

  // ─── update ───────────────────────────────────────────────────────────────

  update(drawing: TechnicalDrawing, uuids: string[], changes: Partial<TSystem["data"]>): void {
    for (const uuid of uuids) {
      const entry = drawing.annotations.get(uuid);
      if (!entry || entry.system !== (this as any)) continue;
      const item = entry.data as TSystem["item"];
      Object.assign(item, changes);
      this._redraw(item, entry.three);
      this.onUpdate.trigger({ item, group: entry.three });
    }
  }

  // ─── pick ─────────────────────────────────────────────────────────────────

  pick(ray: THREE.Ray, threshold = 0.05): string | null {
    const raycaster = new THREE.Raycaster();
    raycaster.ray.copy(ray);
    (raycaster.params as any).Line          = { threshold };
    (raycaster.params as any).LineSegments  = { threshold };

    const builtinLineRaycast = THREE.Line.prototype.raycast;
    let closest: string | null = null;
    let closestDist = Infinity;

    for (const drawing of this._knownDrawings) {
      for (const [uuid, entry] of drawing.annotations) {
        if (entry.system !== (this as any)) continue;
        const group = entry.three;
        group.updateWorldMatrix(true, true);
        group.traverse((child) => {
          if (child === group) return;
          const hits: THREE.Intersection[] = [];
          if (child instanceof THREE.LineSegments && child.userData.isDimension) {
            builtinLineRaycast.call(child, raycaster, hits);
            if (hits.length > 0 && hits[0].distance < closestDist) {
              closestDist = hits[0].distance;
              closest = uuid;
            }
          } else if (child instanceof THREE.Mesh) {
            const box = new THREE.Box3().setFromObject(child);
            const target = new THREE.Vector3();
            if (raycaster.ray.intersectBox(box, target)) {
              const dist = raycaster.ray.origin.distanceTo(target);
              if (dist < closestDist) {
                closestDist = dist;
                closest = uuid;
              }
            }
          }
        });
      }
    }

    return closest;
  }

  // ─── delete ───────────────────────────────────────────────────────────────

  delete(drawing: TechnicalDrawing, uuids: string[]): void {
    const deleted: string[] = [];
    for (const uuid of uuids) {
      const entry = drawing.annotations.get(uuid);
      if (!entry || entry.system !== (this as any)) continue;
      this._disposeGroup(entry.three);
      drawing.annotations.delete(uuid);
      deleted.push(uuid);
    }
    if (deleted.length) this.onDelete.trigger(deleted);
  }

  // ─── clear ────────────────────────────────────────────────────────────────

  clear(drawings?: TechnicalDrawing[]): void {
    const targets = drawings ?? [...this._knownDrawings];
    for (const drawing of targets) {
      const toDelete: string[] = [];
      for (const [uuid, entry] of drawing.annotations) {
        if (entry.system === (this as any)) toDelete.push(uuid);
      }
      for (const uuid of toDelete) {
        const entry = drawing.annotations.get(uuid)!;
        this._disposeGroup(entry.three);
        drawing.annotations.delete(uuid);
      }
    }
  }

  // ─── dispose ──────────────────────────────────────────────────────────────

  dispose(): void {
    this._clearPreview();
    this._onDispose();
    this.clear();
    for (const mat of this._materialCache.values()) mat.dispose();
    this._materialCache.clear();
    for (const mat of this._meshMaterialCache.values()) mat.dispose();
    this._meshMaterialCache.clear();
    this._previewMaterial.dispose();
    this.onCommit.reset();
    this.onUpdate.reset();
    this.onDelete.reset();
    this.onDisposed.trigger();
    this.onDisposed.reset();
  }

  // ─── Protected helpers ─────────────────────────────────────────────────────

  protected _trackDrawing(drawing: TechnicalDrawing): void {
    if (this._knownDrawings.has(drawing)) return;
    this._knownDrawings.add(drawing);
    drawing.onDisposed.add(() => this._knownDrawings.delete(drawing));
  }

  protected _resolveStyle(styleName: string): TSystem["style"] {
    return this.styles.get(styleName) ?? this.styles.get("default")!;
  }

  protected _getMaterial(styleName: string): THREE.LineBasicMaterial {
    const cached = this._materialCache.get(styleName);
    if (cached) return cached;
    const mat = new THREE.LineBasicMaterial({ color: this._resolveStyle(styleName).color });
    this._materialCache.set(styleName, mat);
    return mat;
  }

  protected _getMeshMaterial(styleName: string): THREE.MeshBasicMaterial {
    const cached = this._meshMaterialCache.get(styleName);
    if (cached) return cached;
    const mat = new THREE.MeshBasicMaterial({
      color: this._resolveStyle(styleName).color,
      side: THREE.DoubleSide,
    });
    this._meshMaterialCache.set(styleName, mat);
    return mat;
  }

  protected _disposeGroup(group: THREE.Group): void {
    group.removeFromParent();
    if (this._ownsChildGeometry) {
      group.traverse((child) => {
        if ((child as any).geometry instanceof THREE.BufferGeometry)
          (child as any).geometry.dispose();
      });
    } else {
      // Shared geometry — only detach children, never dispose them.
      while (group.children.length > 0) group.remove(group.children[0]);
    }
  }

  protected _clearPreview(): void {
    if (!this._previewObject) return;
    this._previewObject.removeFromParent();
    this._previewObject.geometry.dispose();
    this._previewObject = null;
  }

  protected _persist(
    drawing: TechnicalDrawing,
    item: TSystem["item"],
  ): { drawing: TechnicalDrawing; item: TSystem["item"]; group: THREE.Group } {
    this._trackDrawing(drawing);

    const style = this._resolveStyle(item.style);
    const group = this._buildGroup(item, style);
    group.userData.isDimension    = true;
    group.userData.annotationUuid = item.uuid;
    group.userData.layer          = drawing.activeLayer;

    drawing.three.add(group);
    drawing.annotations.set(item.uuid, { system: this as any, data: item, three: group });

    this._onAfterPersist(item, group);
    return { drawing, item, group };
  }

  protected _redraw(item: TSystem["item"], group: THREE.Group): void {
    // Clear existing children, disposing geometry only if this system owns it.
    while (group.children.length > 0) {
      const child = group.children[0];
      if (this._ownsChildGeometry && (child as any).geometry instanceof THREE.BufferGeometry) {
        (child as any).geometry.dispose();
      }
      group.remove(child);
    }

    // Rebuild via _buildGroup and move children into the existing group so that
    // consumers holding a reference to `group` are not broken.
    const style   = this._resolveStyle(item.style);
    const rebuilt = this._buildGroup(item, style);
    while (rebuilt.children.length > 0) group.add(rebuilt.children[0]);

    this._onAfterPersist(item, group);
  }
}

/**
 * @deprecated Renamed to {@link AnnotationSystem}. This alias will be removed in a future release.
 */
export { AnnotationSystem as DrawingSystem };

