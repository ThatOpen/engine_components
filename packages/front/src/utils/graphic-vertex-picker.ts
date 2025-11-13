import * as OBC from "@thatopen/components";
import * as FRAGS from "@thatopen/fragments";
import { Mark } from "../core";

/**
 * A class to provide a graphical marker for picking vertices in a 3D scene.
 */
export class GraphicVertexPicker implements OBC.Disposable {
  /** {@link OBC.Disposable.onDisposed} */
  readonly onDisposed = new OBC.Event();

  /** The marker used to indicate the picked vertex. */
  marker: Mark | null = null;

  world: OBC.World | null = null;

  private _enabled = false;
  set enabled(value: boolean) {
    this._enabled = value;
    if (this.marker) this.marker.visible = value;
    if (value) this.get();
  }

  get enabled() {
    return this._enabled;
  }

  private _components: OBC.Components;

  private _preview = document.createElement("div");
  private _pointerVisible = false;
  private _intersectionFound = false;

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
    for (const key in GraphicVertexPicker.baseSnappingStyle) {
      const value = GraphicVertexPicker.baseSnappingStyle[key];
      this._preview.style[key] = value as string;
    }
    this._preview.style.zIndex = "999";
    this._preview.style.pointerEvents = "none";
    this._preview.style.position = "fixed";
    this._preview.style.top = "0";
    this._preview.style.left = "0";
  }

  /** {@link OBC.Disposable.onDisposed} */
  dispose() {
    if (this.marker) {
      this.marker.dispose();
    }
  }

  /**
   * Retrieves the picked vertex from the world and updates the marker's position.
   * If no vertex is picked, the marker is hidden.
   *
   * @param world - The world in which to pick the vertex.
   * @returns The picked vertex, or null if no vertex was picked.
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

    this._intersectionFound = Boolean(intersects);

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

      this.hidePointer();

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
    } else if (this.marker) {
      this.marker.visible = false;
    }

    return intersects;
  }

  updatePointer() {
    if (!this.world) return;
    if (!this.marker) return;
    if (!this._intersectionFound) {
      this.hidePointer();
      return;
    }
    this.showPointer();
    if (this.marker.visible) {
      this.marker.visible = false;
    }
    const casters = this._components.get(OBC.Raycasters);
    const caster = casters.get(this.world);
    const mousePosition = caster.mouse.rawPosition;
    this._preview.style.transform = `translate(-50%, -50%) translate(${mousePosition.x}px, ${mousePosition.y}px)`;
  }

  private showPointer() {
    if (!this.world) return;
    if (this._pointerVisible) return;
    this._pointerVisible = true;
    const domElement = this.world.renderer!.three.domElement;
    domElement.parentElement?.appendChild(this._preview);
  }

  private hidePointer() {
    if (!this.world) return;
    if (!this._pointerVisible) return;
    this._pointerVisible = false;
    const domElement = this.world.renderer!.three.domElement;
    domElement.parentElement?.removeChild(this._preview);
  }
}
