import * as THREE from "three";
import * as FRAGS from "@thatopen/fragments";
import * as OBC from "@thatopen/components";
import { Alignment, FragmentsGroup } from "@thatopen/fragments";
import { CurveHighlighter } from "./src/curve-highlighter";
import { CivilMarker } from "../CivilMarker";
import { Mark } from "../../core";

/**
 * Represents the type of markers used in the CivilMarkerType class.
 */
export type CivilMarkerType = "hover" | "select";

/**
 * Abstract class representing a Civil Navigator. It provides functionality to navigate and interact with civil engineering data.
 */
export abstract class CivilNavigator
  extends OBC.Component
  implements OBC.Disposable
{
  /**
   * The view mode for the navigator.
   * Can be either "horizontal" or "vertical".
   */
  abstract view: "horizontal" | "vertical";

  /**
   * Event triggered when a curve is highlighted.
   * Provides the point of intersection and the corresponding curve mesh.
   */
  readonly onHighlight = new OBC.Event<{
    point: THREE.Vector3;
    mesh: FRAGS.CurveMesh;
  }>();

  /**
   * Event triggered when a marker (hover or select) is placed on a curve.
   * Provides the alignment, percentage, type of marker, and the corresponding curve.
   */
  readonly onMarkerChange = new OBC.Event<{
    alignment: FRAGS.Alignment;
    percentage: number;
    type: CivilMarkerType;
    curve: FRAGS.CivilCurve;
  }>();

  /**
   * Event triggered when a marker (hover or select) is hidden.
   * Provides the type of marker.
   */
  readonly onMarkerHidden = new OBC.Event<{
    type: CivilMarkerType;
  }>();

  /** {@link OBC.Disposable.onDisposed} */
  readonly onDisposed = new OBC.Event();

  /** {@link OBC.Component.enabled} */
  enabled = true;

  /**
   * Mouse markers for hover and select actions.
   * They are of type Mark and are optional.
   */
  mouseMarkers?: {
    hover: Mark;
    select: Mark;
  };

  private _curves: FRAGS.CurveMesh[] = [];

  private _previousAlignment: FRAGS.Alignment | null = null;

  protected _highlighter?: CurveHighlighter;

  protected _world: OBC.World | null = null;

  /**
   * Getter for the highlighter instance.
   * Throws an error if the highlighter is not initialized.
   *
   * @returns {CurveHighlighter} The initialized highlighter instance.
   */
  get highlighter() {
    if (!this._highlighter) {
      throw new Error(
        "Highlighter not initialized. You must set a world first!",
      );
    }
    return this._highlighter;
  }

  /**
   * Getter for the world instance.
   *
   * @returns {OBC.World | null} The current world instance or null if not set.
   */
  get world() {
    return this._world;
  }

  /**
   * Setter for the world instance.
   * If the new world is the same as the current one, it does nothing.
   * If the current world is set, it removes the event listeners.
   * If the new world is not set, it does nothing.
   *
   * @param {OBC.World | null} world - The new world instance or null to unset.
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
    this._highlighter = new CurveHighlighter(scene, this.view);

    this.mouseMarkers = {
      select: this.newMouseMarker("#ffffff", world),
      hover: this.newMouseMarker("#575757", world),
    };

    this.setupEvents(true);
  }

  protected constructor(components: OBC.Components) {
    super(components);
  }

  /**
   * Draws the civil curves from the provided model onto the scene.
   *
   * @param model - The FragmentsGroup containing the civil data to be drawn.
   * @param filter - An optional Iterable of alignments to filter the curves to be drawn.
   *
   * @throws Will throw an error if the provided model doesn't have civil data or if no world was given for this navigator.
   *
   * @returns {Promise<void>} - A promise that resolves when the curves have been drawn onto the scene.
   */
  async draw(model: FragmentsGroup, filter?: Iterable<FRAGS.Alignment>) {
    if (!model.civilData) {
      throw new Error("The provided model doesn't have civil data!");
    }

    if (!this._world) {
      throw new Error("No world was given for this navigator!");
    }

    const { alignments } = model.civilData;
    const allAlignments = filter || alignments.values();

    const scene = this._world.scene.three;

    const totalBBox: THREE.Box3 = new THREE.Box3();
    totalBBox.makeEmpty();
    totalBBox.min.set(Number.MAX_VALUE, Number.MAX_VALUE, Number.MAX_VALUE);
    totalBBox.max.set(-Number.MAX_VALUE, -Number.MAX_VALUE, -Number.MAX_VALUE);

    for (const alignment of allAlignments) {
      if (!alignment) {
        throw new Error("Alignment not found!");
      }

      for (const curve of alignment[this.view]) {
        scene.add(curve.mesh);
        this._curves.push(curve.mesh);

        if (!totalBBox.isEmpty()) {
          totalBBox.expandByObject(curve.mesh);
        } else {
          curve.mesh.geometry.computeBoundingBox();
          const cbox = curve.mesh.geometry.boundingBox;

          if (cbox instanceof THREE.Box3) {
            totalBBox.copy(cbox).applyMatrix4(curve.mesh.matrixWorld);
          }
        }
      }
    }
    const scaledBbox = this.getScaledBox(totalBBox, 1.2);

    if (this._world.camera.hasCameraControls()) {
      await this._world.camera.controls.fitToBox(scaledBbox, false);
    }
  }

  /** {@link OBC.Disposable.dispose} */
  async dispose() {
    this._highlighter?.dispose();
    this.clear();
    this.onHighlight.reset();
    this._curves = [];
    this.onDisposed.trigger();
    this.onDisposed.reset();
  }

  /**
   * Clears the civil curves from the scene.
   * Removes all the curve meshes from the scene and clears the internal array of curve meshes.
   * Also unselects and unhovers the highlighter.
   */
  clear() {
    this._highlighter?.unSelect();
    this._highlighter?.unHover();
    for (const mesh of this._curves) {
      mesh.removeFromParent();
    }
    this._curves = [];
  }

  /**
   * Sets a marker on a specific curve at a given percentage.
   *
   * @param alignment - The alignment where the marker should be placed.
   * @param percentage - The percentage along the alignment where the marker should be placed.
   * @param type - The type of marker to be placed (hover or select).
   *
   * @throws Will throw an error if there are no curves to place the marker on.
   */
  setMarker(alignment: Alignment, percentage: number, type: CivilMarkerType) {
    if (!this._curves.length) {
      return;
    }
    const found = alignment.getCurveAt(percentage, this.view);
    const point = alignment.getPointAt(percentage, this.view);
    const { index } = found.curve.getSegmentAt(found.percentage);
    this.setMouseMarker(point, found.curve.mesh, index, type);
  }

  /**
   * Sets the definition segments and slope from the provided segments array.
   *
   * @param segmentsArray - An array of segments, where each segment is an array of numbers representing points.
   *
   * @returns An object containing the definition segments and slope.
   *
   * @throws Will throw an error if the segments array is empty or if the points in the segments array are not in the expected format.
   */
  setDefSegments(segmentsArray: any[]) {
    const defSegments: any = [];
    const slope: any = [];

    const calculateSlopeSegment = (point1: number[], point2: number[]) => {
      const deltaY = point2[1] - point1[1];
      const deltaX = point2[0] - point1[0];
      return deltaY / deltaX;
    };

    for (let i = 0; i < segmentsArray.length; i++) {
      const segment = segmentsArray[i];
      let startX: number;
      let startY: number;
      let endX: number;
      let endY: number;

      // Set start
      for (let j = 0; j < Object.keys(segment).length / 3; j++) {
        if (segment[j * 3] !== undefined && segment[j * 3 + 1] !== undefined) {
          startX = segment[j * 3];
          startY = segment[j * 3 + 1];
          break;
        }
      }

      // Set end
      for (let j = Object.keys(segment).length / 3 - 1; j >= 0; j--) {
        if (segment[j * 3] !== undefined && segment[j * 3 + 1] !== undefined) {
          endX = segment[j * 3];
          endY = segment[j * 3 + 1];
          break;
        }
      }

      const defSlope = calculateSlopeSegment(
        // @ts-ignore
        [startX, startY],
        // @ts-ignore
        [endX, endY],
      );

      const slopeSegment = (defSlope * 100).toFixed(2);
      slope.push({ slope: slopeSegment });
    }

    for (const segment of segmentsArray) {
      for (let i = 0; i < segment.length - 3; i += 3) {
        const startX = segment[i];
        const startY = segment[i + 1];
        const startZ = segment[i + 2];

        const endX = segment[i + 3];
        const endY = segment[i + 4];
        const endZ = segment[i + 5];

        defSegments.push({
          start: new THREE.Vector3(startX, startY, startZ),
          end: new THREE.Vector3(endX, endY, endZ),
        });
      }
    }

    return { defSegments, slope };
  }

  /**
   * Hides the marker of the specified type.
   *
   * @param type - The type of marker to hide. It can be either "hover" or "select".
   *
   * @throws Will throw an error if the mouse markers are not initialized.
   */
  hideMarker(type: CivilMarkerType) {
    if (this.mouseMarkers) {
      this.mouseMarkers[type].visible = false;
    }
  }

  private setupEvents(active: boolean) {
    if (!this._world) {
      throw new Error("No world was given for this navigator!");
    }

    if (this._world.isDisposing || !this._world.renderer) {
      return;
    }

    const canvas = this._world.renderer.three.domElement;
    const container = canvas.parentElement as HTMLElement;

    this._world.renderer?.onResize.remove(this.updateLinesResolution);
    container.removeEventListener("pointermove", this.onMouseMove);
    container.removeEventListener("click", this.onClick);
    if (this._world.camera.hasCameraControls()) {
      const controls = this._world.camera.controls;
      controls.removeEventListener("update", this.onControlsUpdated);
    }

    if (active) {
      container.addEventListener("pointermove", this.onMouseMove);
      container.addEventListener("click", this.onClick);

      this._world.renderer?.onResize.add(this.updateLinesResolution);

      if (this._world.camera.hasCameraControls()) {
        const controls = this._world.camera.controls;
        controls.addEventListener("update", this.onControlsUpdated);
      }
    }
  }

  private updateLinesResolution = (size: THREE.Vector2) => {
    this._highlighter?.setResolution(size);
  };

  private newMouseMarker(color: string, world: OBC.World) {
    if (!this._world) {
      throw new Error("No world was given for this navigator!");
    }
    const scene = world.scene.three;
    const root = document.createElement("div");
    const bar = document.createElement("div");
    root.appendChild(bar);
    bar.style.backgroundColor = color;
    bar.style.width = "3rem";
    bar.style.height = "3px";
    const mouseMarker = new Mark(this._world, root, scene);
    mouseMarker.visible = false;
    return mouseMarker;
  }

  private setMouseMarker(
    point: THREE.Vector3,
    object: THREE.Object3D,
    index: number | undefined,
    type: CivilMarkerType,
  ) {
    if (index === undefined || !this.mouseMarkers) return;
    this.mouseMarkers[type].visible = true;
    const marker = this.mouseMarkers[type].three;
    marker.position.copy(point);
    const curveMesh = object as FRAGS.CurveMesh;
    const { startPoint, endPoint } = curveMesh.curve.getSegment(index);
    const angle = Math.atan2(
      endPoint.y - startPoint.y,
      endPoint.x - startPoint.x,
    );
    const bar = marker.element.children[0] as HTMLDivElement;
    const trueAngle = 90 - (angle / Math.PI) * 180;
    bar.style.transform = `rotate(${trueAngle}deg)`;
  }

  private updateMarker(intersects: THREE.Intersection, type: CivilMarkerType) {
    const { point, index, object } = intersects;
    const mesh = object as FRAGS.CurveMesh;
    const curve = mesh.curve;
    const alignment = mesh.curve.alignment;
    const percentage = alignment.getPercentageAt(point, this.view);
    const markerPoint = point.clone();
    this.setMouseMarker(markerPoint, mesh, index, type);
    if (percentage !== null) {
      this.onMarkerChange.trigger({ alignment, percentage, type, curve });
    }
  }

  private onMouseMove = (event: MouseEvent) => {
    if (!this._world) {
      throw new Error("No world was given for this navigator!");
    }

    if (!this._world.renderer) {
      return;
    }

    const canvas = this._world.renderer.three.domElement;
    const dom = canvas.parentElement as HTMLElement;
    const camera = this._world.camera.three;

    const result = this._highlighter?.castRay(event, camera, dom, this._curves);

    if (result) {
      const { object } = result;
      this._highlighter?.hover(object as FRAGS.CurveMesh);
      this.updateMarker(result, "hover");
      return;
    }

    if (this.mouseMarkers) {
      this.mouseMarkers.hover.visible = false;
    }
    this._highlighter?.unHover();
    this.onMarkerHidden.trigger({ type: "hover" });
  };

  private onClick = (event: MouseEvent) => {
    if (!this._world) {
      throw new Error("No world was given for this navigator!");
    }

    if (!this._world.renderer) {
      return;
    }

    const canvas = this._world.renderer.three.domElement;
    const dom = canvas.parentElement as HTMLElement;
    const camera = this._world.camera.three;

    const found = this._highlighter?.castRay(event, camera, dom, this._curves);

    if (found) {
      const result = found;
      const mesh = result.object as FRAGS.CurveMesh;
      this._highlighter?.select(mesh);
      this.updateMarker(result, "select");

      if (this._world.camera.hasCameraControls()) {
        if (!mesh.geometry.boundingBox) {
          mesh.geometry.computeBoundingBox();
        }
        if (mesh.geometry.boundingBox) {
          const box = this.getScaledBox(mesh.geometry.boundingBox, 2);
          this._world.camera.controls.fitToBox(box, true);
        }
      }

      this.onHighlight.trigger({ mesh, point: result.point });

      if (this._previousAlignment !== mesh.curve.alignment) {
        const marker = this.components.get(CivilMarker);

        marker.showKPStations(mesh);
        this._previousAlignment = mesh.curve.alignment;
      }
    }
  };

  private onControlsUpdated = () => {
    if (!this._world) {
      throw new Error("No world was given for this navigator!");
    }

    if (!(this._world.camera.three instanceof THREE.OrthographicCamera)) {
      return;
    }

    if (!this._highlighter) {
      return;
    }

    const { zoom, left, right, top, bottom } = this._world.camera.three;
    const width = left - right;
    const height = top - bottom;
    const screenSize = Math.max(width, height);
    const realScreenSize = screenSize / zoom;
    const range = 40;
    const { caster } = this._highlighter;
    caster.params.Line.threshold = realScreenSize / range;
  };

  private getScaledBox(totalBBox: THREE.Box3, factor: number) {
    const scaledBbox = new THREE.Box3();
    const size = new THREE.Vector3();
    const center = new THREE.Vector3();
    totalBBox.getCenter(center);
    totalBBox.getSize(size);
    size.multiplyScalar(factor);
    scaledBbox.setFromCenterAndSize(center, size);
    return scaledBbox;
  }
}
