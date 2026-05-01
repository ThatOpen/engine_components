import * as OBC from "@thatopen/components";
import * as FRAGS from "@thatopen/fragments";
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

  world: OBC.World | null = null;

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
      const { point } = intersects;
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
      this.marker.three.position.copy(point);

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
    }

    return intersects;
  }

  private applyMarkerSize() {
    if (!this.marker) return;
    const size = `${this._pickerSize}px`;
    this.marker.three.element.style.width = size;
    this.marker.three.element.style.height = size;
  }

}
