import * as THREE from "three";
import * as FRAGS from "@thatopen/fragments";
import * as OBC from "@thatopen/components";
import { CurveHighlighter } from "../CivilNavigator/src/curve-highlighter";
import { CivilMarkerType } from "../CivilNavigator";
import { Mark } from "../../core";

/**
 * This component provides functionality for navigating and interacting with civil engineering data in a 3D environment. 📕 [Tutorial](https://docs.thatopen.com/Tutorials/Components/Front/Civil3DNavigator). 📘 [API](https://docs.thatopen.com/api/@thatopen/components-front/classes/Civil3DNavigator).
 *
 */
export class Civil3DNavigator extends OBC.Component {
  /**
   * A unique identifier for the component.
   * This UUID is used to register the component within the Components system.
   */
  static readonly uuid = "0a59c09e-2b49-474a-9320-99f51f40f182" as const;

  /**
   * Event triggered when a curve is highlighted.
   * Provides information about the highlighted curve, point, and index.
   */
  readonly onHighlight = new OBC.Event<{
    curve: FRAGS.CurveMesh;
    point: THREE.Vector3;
    index: number;
  }>();

  /**
   * Event triggered when a marker (point) on a curve changes.
   * Provides information about the alignment, percentage, type of marker, and the curve.
   */
  readonly onMarkerChange = new OBC.Event<{
    alignment: FRAGS.Alignment;
    percentage: number;
    type: CivilMarkerType;
    curve: FRAGS.CivilCurve;
  }>();

  /**
   * Event triggered when a marker (point) on a curve is hidden.
   * Provides information about the type of marker.
   */
  readonly onMarkerHidden = new OBC.Event<{
    type: CivilMarkerType;
  }>();

  /** {@link OBC.Component.enabled} */
  enabled = true;

  mouseMarkers?: {
    hover: Mark;
    select: Mark;
  };

  private _highlighter?: CurveHighlighter;

  private _curves: FRAGS.CurveMesh[] = [];

  private _world: OBC.World | null = null;

  /**
   * Getter for the world property.
   * Returns the current world instance.
   * @returns {OBC.World | null} The current world instance or null if not set.
   */
  get world() {
    return this._world;
  }

  /**
   * Setter for the world property.
   * Sets the world instance and initializes the component.
   * @param {OBC.World | null} world - The new world instance or null to clear the current world.
   */
  set world(world: OBC.World | null) {
    if (world === this._world) {
      return;
    }

    if (this._world) {
      this.setupEvents(false);
    }

    this._world = world;

    this._highlighter?.dispose();
    this.mouseMarkers?.hover.dispose();
    this.mouseMarkers?.select.dispose();

    if (!world) {
      return;
    }

    const scene = world.scene.three;
    this._highlighter = new CurveHighlighter(scene, "absolute");

    this.mouseMarkers = {
      select: this.newMouseMarker("#ffffff", world),
      hover: this.newMouseMarker("#575757", world),
    };

    this.setupEvents(true);
  }

  /**
   * Getter for the highlighter property.
   * Returns the curve highlighter instance.
   * @returns {CurveHighlighter} The curve highlighter instance.
   * @throws {Error} If the navigator is not initialized.
   */
  get highlighter() {
    if (!this._highlighter) {
      throw new Error("Navigator not initialized!");
    }
    return this._highlighter;
  }

  constructor(components: OBC.Components) {
    super(components);
    this.components.add(Civil3DNavigator.uuid, this);
  }

  /**
   * Draws the civil engineering data onto the 3D scene.
   *
   * @param model - The FragmentsGroup containing the civil data to be drawn.
   * @throws Will throw an error if the model does not have civil data or if the world is not set.
   */
  draw(model: FRAGS.FragmentsGroup) {
    if (!model.civilData) {
      throw new Error("Model must have civil data!");
    }
    if (!this.world) {
      throw new Error("A world must be given before drawing an alignment!");
    }
    const scene = this.world.scene.three;
    for (const [_id, alignment] of model.civilData.alignments) {
      for (const { mesh } of alignment.absolute) {
        scene.add(mesh);
        this._curves.push(mesh);
      }
    }
  }

  /**
   * Sets a marker at a specific percentage along the given alignment.
   *
   * @param alignment - The alignment on which to place the marker.
   * @param percentage - The percentage along the alignment where the marker should be placed.
   * @param type - The type of marker to be set.
   *
   * @throws Will throw an error if the mouse markers have not been initialized.
   *         This can happen if the world has not been set before using this method.
   *
   * @remarks
   * This method calculates the 3D point at the given percentage along the alignment,
   * sets the marker at that point, and makes the marker visible.
   *
   * @example
   * ```typescript
   * const navigator = new Civil3DNavigator(components);
   * navigator.world = world; // Initialize the world
   * const alignment = model.civilData.alignments.get(alignmentId);
   * if (alignment) {
   *   navigator.setMarker(alignment, 0.5, "select");
   * }
   * ```
   */
  setMarker(
    alignment: FRAGS.Alignment,
    percentage: number,
    type: CivilMarkerType,
  ) {
    if (!this.mouseMarkers) {
      throw new Error(
        "No mouse markers found! Initialize the world before using this.",
      );
    }
    const point = alignment.getPointAt(percentage, "absolute");
    this.mouseMarkers[type].visible = true;
    const marker = this.mouseMarkers[type].three;
    marker.position.copy(point);
  }

  /**
   * Hides the marker of the specified type.
   *
   * @param type - The type of marker to hide.
   *
   * @throws Will throw an error if the mouse markers have not been initialized.
   *         This can happen if the world has not been set before using this method.
   *
   * @remarks
   * This method hides the marker of the specified type by setting its visibility to false.
   *
   * @example
   * ```typescript
   * const navigator = new Civil3DNavigator(components);
   * navigator.world = world; // Initialize the world
   * navigator.hideMarker("select");
   * ```
   */
  hideMarker(type: CivilMarkerType) {
    if (!this.mouseMarkers) {
      throw new Error(
        "No mouse markers found! Initialize the world before using this.",
      );
    }
    const marker = this.mouseMarkers[type].three;
    marker.visible = false;
  }

  private newMouseMarker(color: string, world: OBC.World) {
    const scene = world.scene.three;
    const root = document.createElement("div");
    root.style.backgroundColor = color;
    root.style.width = "1rem";
    root.style.height = "1rem";
    root.style.borderRadius = "1rem";
    const mouseMarker = new Mark(world, root, scene);
    mouseMarker.visible = false;
    return mouseMarker;
  }

  private setupEvents(active: boolean) {
    if (!this.world) {
      throw new Error("No world found!");
    }

    if (this.world.isDisposing || !this.world.renderer) {
      return;
    }
    const dom = this.world.renderer.three.domElement;

    this.world.renderer?.onResize.remove(this.updateLinesResolution);
    dom.removeEventListener("click", this.onClick);
    dom.removeEventListener("pointermove", this.onMouseMove);

    if (active) {
      dom.addEventListener("click", this.onClick);
      dom.addEventListener("pointermove", this.onMouseMove);
      this.world.renderer?.onResize.add(this.updateLinesResolution);
    }
  }

  private updateLinesResolution = (size: THREE.Vector2) => {
    this.highlighter?.setResolution(size);
  };

  private onClick = (event: MouseEvent) => {
    if (!this.enabled || !this._highlighter) {
      return;
    }

    if (!this.world) {
      throw new Error("No world found!");
    }

    if (!this.world.renderer) {
      return;
    }
    const dom = this.world.renderer.three.domElement;

    const camera = this.world.camera.three;
    const found = this._highlighter.castRay(event, camera, dom, this._curves);
    if (found) {
      const curve = found.object as FRAGS.CurveMesh;
      this._highlighter.select(curve);
      this.updateMarker(found, "select");
      const { point, index } = found;
      if (index !== undefined) {
        this.onHighlight.trigger({ curve, point, index });
      }
      return;
    }
    this._highlighter.unSelect();
    if (this.mouseMarkers) {
      this.mouseMarkers.hover.visible = false;
    }
    this.onMarkerHidden.trigger({ type: "hover" });
  };

  private onMouseMove = async (event: MouseEvent) => {
    if (!this.enabled || !this._highlighter) {
      return;
    }

    if (!this.world) {
      throw new Error("No world found!");
    }
    if (!this.world.renderer) {
      return;
    }
    const dom = this.world.renderer.three.domElement;

    const camera = this.world.camera.three;
    const found = this._highlighter.castRay(event, camera, dom, this._curves);

    if (found) {
      this._highlighter.hover(found.object as FRAGS.CurveMesh);
      this.updateMarker(found, "hover");
      return;
    }

    this._highlighter.unHover();
  };

  private updateMarker(intersects: THREE.Intersection, type: CivilMarkerType) {
    if (!this.mouseMarkers) return;
    const { point, object } = intersects;
    const mesh = object as FRAGS.CurveMesh;
    const curve = mesh.curve;
    const alignment = mesh.curve.alignment;
    const percentage = alignment.getPercentageAt(point, "absolute");
    this.mouseMarkers[type].visible = true;
    const marker = this.mouseMarkers[type].three;
    marker.position.copy(point);
    if (percentage !== null) {
      this.onMarkerChange.trigger({ alignment, percentage, type, curve });
    }
  }
}
