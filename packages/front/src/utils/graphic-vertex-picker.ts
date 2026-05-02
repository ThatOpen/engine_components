import * as OBC from "@thatopen/components";
import * as FRAGS from "@thatopen/fragments";
import * as THREE from "three";
import { Mark } from "../core";

/**
 * @deprecated Sync mode is gone — picks are fast enough through the
 * unified GPU-pick / SnapResolver path that the synchronous-three.js-
 * meshes workaround is no longer needed. The enum is kept for type
 * compatibility with existing imports; both values now resolve to
 * the same fast path.
 */
export enum GraphicVertexPickerMode {
  DEFAULT,
  SYNCHRONOUS,
}

/**
 * A class to provide a graphical marker for picking vertices in a 3D scene.
 */
export class GraphicVertexPicker implements OBC.Disposable {
  /** {@link OBC.Disposable.onDisposed} */
  readonly onDisposed = new OBC.Event();

  /** The marker used to indicate the picked vertex. */
  marker: Mark | null = null;

  private _world: OBC.World | null = null;
  set world(value: OBC.World | null) {
    if (value === this._world) return;
    this.detachCursorTracking();
    this._world = value;
    if (value) this.attachCursorTracking();
  }

  get world() {
    return this._world;
  }

  /**
   * Pointermove handler that drives cursor-tracking. Stored on the
   * instance so we can detach when the world changes.
   */
  private _pointerMoveHandler: ((e: PointerEvent) => void) | null = null;

  /**
   * @deprecated Sync mode is gone; this property has no effect and
   * is retained only to avoid breaking existing setters. Both
   * values route through the same fast async pick.
   */
  mode = GraphicVertexPickerMode.DEFAULT;

  maxDistance = 1;

  private _pickerSize = 6;

  get pickerSize() {
    return this._pickerSize;
  }

  set pickerSize(value: number) {
    this._pickerSize = value;
    const size = `${value}px`;
    if (this.marker) {
      this.marker.three.element.style.width = size;
      this.marker.three.element.style.height = size;
    }
  }

  private _enabled = false;
  set enabled(value: boolean) {
    this._enabled = value;
    if (this.marker) this.marker.visible = value;
    if (value) {
      this.get();
    }
  }

  get enabled() {
    return this._enabled;
  }

  private _components: OBC.Components;

  static baseSnappingStyle: Partial<CSSStyleDeclaration> = {
    height: "6px",
    width: "6px",
    borderRadius: "100%",
    borderWidth: "2px",
    borderColor: "rgb(122, 75, 209)",
    borderStyle: "solid",
    zIndex: "-20",
  };

  static snappingStyles: Record<
    FRAGS.SnappingClass,
    Partial<CSSStyleDeclaration>
  > = {
    [FRAGS.SnappingClass.FACE]: { ...GraphicVertexPicker.baseSnappingStyle },
    [FRAGS.SnappingClass.POINT]: {
      ...GraphicVertexPicker.baseSnappingStyle,
      borderColor: "#e25959",
      borderRadius: "0",
    },
    [FRAGS.SnappingClass.LINE]: {
      ...GraphicVertexPicker.baseSnappingStyle,
      borderColor: "#2d2d2d",
      borderRadius: "0",
    },
  };

  constructor(components: OBC.Components) {
    this._components = components;
  }

  /** {@link OBC.Disposable.onDisposed} */
  dispose() {
    this.detachCursorTracking();
    if (this.marker) {
      this.marker.dispose();
    }
  }

  /**
   * Retrieves the picked vertex from the world and updates the
   * marker's position. If no vertex is picked, the marker is hidden.
   *
   * @param config - optional world override and snap classes
   * @returns the pick result (matches `castRay`'s shape) or `null`
   *   if nothing was hit.
   */
  async get(config?: {
    world?: OBC.World;
    snappingClasses?: FRAGS.SnappingClass[];
  }) {
    const world = config?.world ?? this.world;
    if (!world) {
      throw new Error(
        "GraphicVertexPicker: a world is need to get a casting result.",
      );
    }

    const casters = this._components.get(OBC.Raycasters);
    const caster = casters.get(world);
    const intersects = await caster.castRay({
      snappingClasses: config?.snappingClasses,
    });

    if (intersects) {
      if (!this.marker) {
        const element = document.createElement("div");
        this.marker = new Mark(world, element);
      }

      if (this.marker.world !== world) {
        this.marker.world = world;
        this.marker.three.removeFromParent();
        world.scene.three.add(this.marker.three);
      }

      this.marker.visible = true;
      // Pin the marker to the snapped 3D point and remember where
      // the cursor was at the moment of the snap. The pointermove
      // handler holds the marker hidden after a successful snap
      // until the cursor leaves a `stickyRadiusPx` radius of that
      // anchor; once it does, the marker stays hidden until the
      // next pick lands a fresh snap. The marker's only meaning on
      // screen is "you're snapped to this feature right now".
      this.marker.three.position.copy(intersects.point);
      this._snapStickyClient = {
        x: this._lastClient.x,
        y: this._lastClient.y,
      };

      // Apply the marker style based on the snapping class
      if (
        "snappingClass" in intersects &&
        typeof intersects.snappingClass === "number" &&
        (intersects.snappingClass === 0 ||
          intersects.snappingClass === 1 ||
          intersects.snappingClass === 2)
      ) {
        const style =
          GraphicVertexPicker.snappingStyles[intersects.snappingClass] ??
          GraphicVertexPicker.baseSnappingStyle;
        Object.assign(this.marker.three.element.style, style);
      } else {
        Object.assign(
          this.marker.three.element.style,
          GraphicVertexPicker.baseSnappingStyle,
        );
      }
      this.applyMarkerSize();
    } else if (this.marker) {
      this.marker.visible = false;
      this._snapStickyClient = null;
    }

    return intersects;
  }

  private applyMarkerSize() {
    if (!this.marker) return;
    const size = `${this._pickerSize}px`;
    this.marker.three.element.style.width = size;
    this.marker.three.element.style.height = size;
  }

  /**
   * Pixels of cursor motion the user must travel before the marker
   * leaves the snap point and resumes cursor-tracking. Without this,
   * the very next pointermove after a successful snap would yank
   * the marker back to the cursor and the snap would be invisible.
   * Tuned for "the user can see they snapped, but a real intentional
   * move breaks it".
   */
  stickyRadiusPx = 12;

  /** Most recent cursor in NDC. Used to project the marker to the
   *  cursor's screen position between picks. */
  private _lastNdc = new THREE.Vector2(2, 2);
  /** Most recent cursor in viewport client pixels — anchors the
   *  snap-sticky window in screen units. */
  private _lastClient = { x: 0, y: 0 };
  private _ndcWorld = new THREE.Vector3();
  private _cursorRafScheduled = false;

  /**
   * Cursor client-pixel coords at the moment of the most recent
   * snap. While set, the pointermove handler holds the marker at the
   * snap point until the cursor leaves a radius of
   * {@link stickyRadiusPx} around this position. Cleared on a
   * no-snap pick.
   */
  private _snapStickyClient: { x: number; y: number } | null = null;

  private attachCursorTracking() {
    if (!this._world?.renderer) return;
    const canvas = this._world.renderer.three.domElement;
    this._pointerMoveHandler = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      this._lastNdc.set(x, y);
      this._lastClient.x = e.clientX;
      this._lastClient.y = e.clientY;

      // Snap stickiness: if a snap pick recently landed and the
      // cursor hasn't moved more than `stickyRadiusPx` away from
      // where it was at that moment, leave the marker pinned to the
      // snap point. Without this, the next pointermove after a
      // successful snap would yank the marker back to the cursor
      // and the user would never see it land on the snapped vertex.
      if (this._snapStickyClient) {
        const dx = e.clientX - this._snapStickyClient.x;
        const dy = e.clientY - this._snapStickyClient.y;
        if (dx * dx + dy * dy <= this.stickyRadiusPx * this.stickyRadiusPx) {
          return;
        }
        this._snapStickyClient = null;
      }

      // RAF-debounce the marker repaint. Pointer events can fire well
      // above 60 Hz (high-refresh trackpads / styluses); calling
      // `renderer.update()` per event would render the full scene
      // multiple times per frame on big models. Coalescing to one
      // paint per animation frame keeps the visual cursor-follow
      // smooth while capping the cost at the renderer's natural rate.
      if (this._cursorRafScheduled) return;
      this._cursorRafScheduled = true;
      requestAnimationFrame(() => {
        this._cursorRafScheduled = false;
        this.syncMarkerToCursor();
        this._world?.renderer?.update();
      });
    };
    canvas.addEventListener("pointermove", this._pointerMoveHandler);
  }

  private detachCursorTracking() {
    if (!this._pointerMoveHandler || !this._world?.renderer) return;
    const canvas = this._world.renderer.three.domElement;
    canvas.removeEventListener("pointermove", this._pointerMoveHandler);
    this._pointerMoveHandler = null;
  }

  /**
   * Project the latest cursor NDC to a world-space point on a plane
   * perpendicular to the camera's forward direction at z = 0.5 in
   * NDC, then copy it into the marker. The CSS2DRenderer projects
   * that point back to roughly the same screen location, so the
   * marker visually tracks the mouse. The exact distance from the
   * camera is irrelevant for screen position because the projection
   * is invariant under that scaling.
   */
  private syncMarkerToCursor() {
    if (!this.marker || !this._world?.camera) return;
    const camera = this._world.camera.three;
    this._ndcWorld
      .set(this._lastNdc.x, this._lastNdc.y, 0.5)
      .unproject(camera);
    this.marker.three.position.copy(this._ndcWorld);
  }
}
