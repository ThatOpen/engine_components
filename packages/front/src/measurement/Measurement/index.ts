import * as OBC from "@thatopen/components";
import * as THREE from "three";
import * as FRAGS from "@thatopen/fragments";
import { DataSet } from "@thatopen/fragments";
import {
  Angle,
  Area,
  DimensionLine,
  GraphicVertexPicker,
  GraphicVertexPickerMode,
  Line,
  MeasureFill,
  Volume,
} from "../../utils";
import { newDimensionMark } from "../utils";
import { Mark } from "../../core";
import {
  defaultUnits,
  MeasurementPickMode,
  MeasurementStateChange,
  MeasureToUnitMap,
} from "./src";
import { MeasureVolume } from "../../utils/measure-volume";

export { MeasurementPickMode } from "./src";
export type {
  MeasurementStateChange,
  MeasureToUnitMap,
} from "./src";

/**
 * Abstract class that gives the core elements to create any measurement component. 📘 [API](https://docs.thatopen.com/api/@thatopen/components-front/classes/Measurement).
 */
export abstract class Measurement<
    T extends Record<string, any> = Record<string, any>,
    U extends keyof MeasureToUnitMap = keyof MeasureToUnitMap,
  >
  extends OBC.Component
  implements OBC.Createable, OBC.Hideable, OBC.Disposable
{
  // The main type of measure element
  list = new DataSet<T>();
  onDisposed = new OBC.Event();
  snappings?: FRAGS.SnappingClass[] = [
    FRAGS.SnappingClass.LINE,
    FRAGS.SnappingClass.POINT,
    FRAGS.SnappingClass.FACE,
  ];

  // The visual items created by the measurement
  lines = new DataSet<DimensionLine>();
  fills = new DataSet<MeasureFill>();
  labels = new DataSet<Mark>();
  volumes = new DataSet<MeasureVolume>();

  delay = 300;

  /**
   * When to run the snap pick that drives the preview marker. See
   * {@link MeasurementPickMode}. Defaults to `MOUSE_MOVE` (pick on
   * every animation frame the cursor is moving). On big models you
   * may want `MOUSE_STOP` (pick once after the cursor settles for
   * {@link delay} ms): the per-pick cost is the same, but you pay
   * it once per intentional stop rather than once per frame, and
   * the marker only appears where the user is actually about to
   * click. The `onPointerStop` event still fires in both modes; in
   * `MOUSE_STOP` we just align the pick to that same moment.
   */
  pickMode: MeasurementPickMode = MeasurementPickMode.MOUSE_MOVE;

  // The measurement modes
  abstract modes: string[];
  abstract mode: string;

  protected _world: OBC.World | null = null;
  set world(value: OBC.World | null) {
    this._world = value;
    this._vertexPicker.world = value;
  }

  get world() {
    return this._world;
  }

  readonly measureType: U;
  get unitsList() {
    let list: string[] = [];
    if (this.measureType === "length") {
      list = ["mm", "cm", "m", "km"];
    } else if (this.measureType === "area") {
      list = ["mm2", "cm2", "m2", "km2"];
    } else if (this.measureType === "angle") {
      list = ["deg", "rad"];
    } else {
      list = ["mm3", "cm3", "m3", "km3"];
    }
    return list;
  }

  readonly onPointerStop = new OBC.Event();
  readonly onPointerMove = new OBC.Event();
  readonly onStateChanged = new OBC.Event<MeasurementStateChange[]>();

  /**
   * Most recent vertex-picker result for this measurement. Updated by
   * the per-frame RAF-coalesced pick that drives the snap marker.
   * Subclasses (e.g. {@link LengthMeasurement}) read this instead of
   * issuing their own `castRay` so we never do more than one pick per
   * animation frame regardless of how many subscribers care about
   * pointer position.
   */
  protected lastPick: any = null;

  private pointerStopTimeout: number | null = null;

  /** RAF coalescing for the snap-marker preview the picker draws on
   *  every move. `pointermove` fires faster than the renderer paints;
   *  more than one pick per frame would just stall on `readPixels`. */
  private _markerRafScheduled = false;

  /** True while the user is orbiting / panning the camera. We skip
   *  picks while this is set — the cursor is "moving" only relative
   *  to the world, not to anything the user actually wants to snap
   *  to, and picking during a drag wastes work and visually jitters
   *  the marker. */
  private _cameraInteracting = false;

  /**
   * Idle window after the last wheel pulse before picks resume. Wheel
   * zoom doesn't fire `controlstart` / `controlend`, so we debounce
   * on the canvas-level `wheel` event. Drag suspension is gated by
   * the user-input pair directly and resumes the moment `controlend`
   * fires (no debounce, no waiting on damping inertia).
   */
  cameraStopDelay = 80;

  /** Listeners stashed so we can detach on disable / world-change. */
  private _onCtrlStart: (() => void) | null = null;
  private _onCtrlEnd: (() => void) | null = null;
  private _onWheel: ((e: WheelEvent) => void) | null = null;
  /** Wheel-idle debounce timer. Re-armed on every wheel pulse. */
  private _wheelIdleTimer: number | null = null;

  /** Pointer-leave handler — hides the marker when the cursor leaves
   *  the canvas (or floats over a UI panel sitting above it). */
  private _pointerLeaveHandler: (() => void) | null = null;

  private onMove = () => {
    if (!this.enabled) return;

    if (this.pointerStopTimeout !== null) {
      clearTimeout(this.pointerStopTimeout);
    }

    // The pointer-stop timer fires the public `onPointerStop` event
    // and — when the tool is in `MOUSE_STOP` pick mode — also drives
    // the snap pick that updates the marker. Coupling them avoids a
    // second timer.
    this.pointerStopTimeout = window.setTimeout(() => {
      this.onPointerStop.trigger();
      if (this.pickMode === MeasurementPickMode.MOUSE_STOP) {
        this.scheduleMarkerUpdate();
      }
    }, this.delay);

    if (this.pickMode === MeasurementPickMode.MOUSE_MOVE) {
      // Drive a single RAF-coalesced pick that both positions the
      // snap marker (side effect of `_vertexPicker.get`) and stores
      // the result in `lastPick` so subclasses (e.g. preview-line
      // updates) can reuse it without doing a second pick on the
      // same frame. `onPointerMove` is fired once per pick (after it
      // resolves), not on every raw `pointermove`, so subscribers
      // always see a fresh `lastPick`.
      this.scheduleMarkerUpdate();
    } else if (this._vertexPicker.marker) {
      // In `MOUSE_STOP` we hide the marker between stops so the user
      // doesn't see a stale snap floating along with the cursor; it
      // pops back in once the cursor settles and the pick resolves.
      this._vertexPicker.marker.visible = false;
      this._world?.renderer?.update();
    }
  };

  private scheduleMarkerUpdate() {
    if (this._markerRafScheduled) return;
    this._markerRafScheduled = true;
    requestAnimationFrame(async () => {
      try {
        if (!this.enabled) return;
        // Skip picks while the user is dragging the camera — they're
        // moving the world, not aiming at a snap target. The pick
        // would also waste GPU readback while the renderer is busy
        // re-drawing for camera motion.
        if (this._cameraInteracting) return;
        try {
          this.lastPick = await this._vertexPicker.get({
            snappingClasses: this.snappings,
          });
        } catch {
          // Picker errors are non-fatal; a transient world /
          // fragments race shouldn't bubble.
          this.lastPick = null;
        }
        // Marker position was updated by `_vertexPicker.get`; that
        // changes the underlying THREE node, but the visual painter
        // (CSS2D-style render in `world.renderer`) only fires when
        // *something* explicitly drives the renderer. During pure
        // pointer movement no other code is ticking the renderer, so
        // the user would see the marker stuck at its last paint
        // position until the cursor stopped. Driving fragments here
        // forces the world to repaint with the fresh marker pose.
        // Marker position is updated; the CSS2DRenderer that paints
        // it only fires on `world.renderer.update()`. During a pure
        // pointer move nothing else is ticking the renderer, so
        // without this call the marker visually freezes until the
        // user stops the cursor.
        this._world?.renderer?.update();
        this.onPointerMove.trigger();
      } finally {
        // Released last so a new pick can't kick off until this one
        // finishes — picks are bursty, and we'd otherwise queue
        // multiple in-flight when the cursor moves faster than each
        // pick resolves.
        this._markerRafScheduled = false;
      }
    });
  }

  private onKeydown = (e: KeyboardEvent) => {
    if (!(this.enabled && e.key === "Escape")) return;
    this.cancelCreation();
  };

  private setEvents(active: boolean) {
    if (!this.world) {
      throw new Error("Measurement: you must specify a world first!");
    }
    if (this.world.isDisposing) {
      return;
    }
    if (!this.world.renderer) {
      throw new Error("Measurement: the world needs a renderer!");
    }
    const canvas = this.world.renderer.three.domElement;
    const viewerContainer = canvas.parentElement as HTMLElement;
    if (!viewerContainer) return;

    viewerContainer.removeEventListener("pointermove", this.onMove);
    window.removeEventListener("keydown", this.onKeydown);
    if (this._pointerLeaveHandler) {
      viewerContainer.removeEventListener(
        "pointerleave",
        this._pointerLeaveHandler,
      );
      this._pointerLeaveHandler = null;
    }
    // Camera-controls listeners: gate picks on user input (drag +
    // wheel) rather than on `update` events. The matrix-change
    // `update` event fires throughout damping inertia after the
    // user has already released, which would suppress picks for
    // the full damping tail. `controlstart` / `controlend` give us
    // exact "user is touching the camera" boundaries; wheel needs
    // its own debounce because it doesn't fire start / end.
    const controls = (this.world.camera as any)?.controls;
    if (controls && this._onCtrlStart) {
      controls.removeEventListener("controlstart", this._onCtrlStart);
    }
    if (controls && this._onCtrlEnd) {
      controls.removeEventListener("controlend", this._onCtrlEnd);
    }
    if (this._onWheel) {
      viewerContainer.removeEventListener("wheel", this._onWheel);
    }
    this._onCtrlStart = null;
    this._onCtrlEnd = null;
    this._onWheel = null;
    if (this._wheelIdleTimer !== null) {
      clearTimeout(this._wheelIdleTimer);
      this._wheelIdleTimer = null;
    }
    this._cameraInteracting = false;

    if (active) {
      viewerContainer.addEventListener("pointermove", this.onMove);
      window.addEventListener("keydown", this.onKeydown);

      // Hide the snap marker the moment the cursor leaves the
      // canvas (or hovers above a floating UI panel layered on top
      // of the canvas — same `pointerleave` semantics).
      this._pointerLeaveHandler = () => {
        if (this._vertexPicker.marker) {
          this._vertexPicker.marker.visible = false;
        }
        // Repaint so the hidden marker actually disappears.
        this._world?.renderer?.update();
      };
      viewerContainer.addEventListener(
        "pointerleave",
        this._pointerLeaveHandler,
      );

      const hideMarker = () => {
        if (this._vertexPicker.marker?.visible) {
          this._vertexPicker.marker.visible = false;
        }
      };

      if (controls) {
        this._onCtrlStart = () => {
          this._cameraInteracting = true;
          hideMarker();
        };
        this._onCtrlEnd = () => {
          this._cameraInteracting = false;
        };
        controls.addEventListener("controlstart", this._onCtrlStart);
        controls.addEventListener("controlend", this._onCtrlEnd);
      }

      // Wheel zoom: no controlstart / controlend pair, so debounce
      // on the canvas wheel event. Each pulse re-arms the idle
      // timer; once pulses stop arriving for `cameraStopDelay` ms
      // we resume picks.
      this._onWheel = () => {
        this._cameraInteracting = true;
        hideMarker();
        if (this._wheelIdleTimer !== null) clearTimeout(this._wheelIdleTimer);
        if (this.cameraStopDelay <= 0) {
          this._wheelIdleTimer = null;
          this._cameraInteracting = false;
          return;
        }
        this._wheelIdleTimer = window.setTimeout(() => {
          this._wheelIdleTimer = null;
          this._cameraInteracting = false;
        }, this.cameraStopDelay);
      };
      viewerContainer.addEventListener("wheel", this._onWheel, {
        passive: true,
      });
    }
  }

  readonly onEnabledChange = new OBC.Event<Boolean>();

  private _enabled = false;
  set enabled(value: boolean) {
    this._enabled = value;
    this._vertexPicker.enabled = value;
    this.setEvents(value);
    this.cancelCreation();
    this.onEnabledChange.trigger(value);
    this.onStateChanged.trigger(["enabled"]);
  }

  get enabled() {
    return this._enabled;
  }

  static valueFormatter: ((value: number) => string) | null = null;

  readonly onVisibilityChange = new OBC.Event<Boolean>();

  private _visible = true;
  set visible(value: boolean) {
    this._visible = value;
    for (const line of this.lines) line.visible = value;
    for (const fill of this.fills) fill.visible = value;
    for (const volume of this.volumes) volume.visible = value;
    this.onVisibilityChange.trigger(value);
    this.onStateChanged.trigger(["visibility"]);
  }

  get visible() {
    return this._visible;
  }

  private _units: MeasureToUnitMap[U];

  set units(value: MeasureToUnitMap[U]) {
    this._units = value;

    let valueMeasureType: "length" | "area" | "volume" | "angle" | undefined;
    if (value === "deg" || value === "rad") {
      valueMeasureType = "angle";
    } else if (value.endsWith("2")) {
      valueMeasureType = "area";
    } else if (value.endsWith("3")) {
      valueMeasureType = "volume";
    } else {
      valueMeasureType = "length";
    }

    for (const measure of this.list) {
      if (measure instanceof Line) {
        measure.units = value as "mm" | "cm" | "m" | "km";
      } else if (measure instanceof Area) {
        measure.units = value as "mm2" | "cm2" | "m2" | "km2";
      } else if (measure instanceof Volume) {
        measure.units = value as "mm3" | "cm3" | "m3" | "km3";
      } else if (measure instanceof Angle) {
        measure.units = value as "deg" | "rad";
      }
    }

    if (valueMeasureType === "length") {
      for (const line of this.lines) {
        line.units = value as "mm" | "cm" | "m" | "km";
      }
    } else if (valueMeasureType === "area") {
      for (const fill of this.fills) {
        fill.units = value as "mm2" | "cm2" | "m2" | "km2";
      }
    } else if (valueMeasureType === "volume") {
      for (const volume of this.volumes) {
        volume.units = value as "mm3" | "cm3" | "m3" | "km3";
      }
    }

    this.onStateChanged.trigger(["units"]);
  }

  get units() {
    return this._units;
  }

  private _rounding = 2;
  set rounding(value: number) {
    this._rounding = value;
    for (const measure of this.list) {
      if (!("rounding" in measure && typeof measure.rounding === "number"))
        continue;
      (measure as any).rounding = value;
    }
    for (const line of this.lines) line.rounding = value;
    for (const fill of this.fills) fill.rounding = value;
    for (const volume of this.volumes) volume.rounding = value;
    this.onStateChanged.trigger(["rounding"]);
  }

  get rounding() {
    return this._rounding;
  }

  private _linesEndpointElement: HTMLElement = newDimensionMark();
  set linesEndpointElement(value: HTMLElement) {
    this._linesEndpointElement = value;
    for (const line of this.lines) {
      line.endpointElement = value;
    }
  }

  get linesEndpointElement() {
    return this._linesEndpointElement;
  }

  private _linesMaterial = new THREE.LineBasicMaterial({
    color: "#0000FF",
    depthTest: false,
  });

  set linesMaterial(value: THREE.LineBasicMaterial) {
    this._linesMaterial.dispose();
    this._linesMaterial = value;
    for (const line of this.lines) {
      line.material = value;
    }
  }

  get linesMaterial() {
    return this._linesMaterial;
  }

  private _fillsMaterial = new THREE.MeshLambertMaterial({
    color: 0x248212,
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0.3,
    depthTest: false,
  });

  set fillsMaterial(value: THREE.MeshLambertMaterial) {
    this._fillsMaterial.dispose();
    this._fillsMaterial = value;
    for (const fill of this.fills) {
      fill.material = value;
    }
  }

  get fillsMaterial() {
    return this._fillsMaterial;
  }

  private _volumesMaterial = new THREE.MeshLambertMaterial({
    color: 0x248212,
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0.3,
    depthTest: false,
  });

  set volumesMaterial(value: THREE.MeshLambertMaterial) {
    this._volumesMaterial.dispose();
    this._volumesMaterial = value;
    for (const volume of this.volumes) {
      volume.material = value;
    }
  }

  get volumesMaterial() {
    return this._volumesMaterial;
  }

  private _color: THREE.Color = new THREE.Color();

  set color(value: THREE.Color) {
    this._color = value;
    this._linesMaterial.color.set(value);
    this._fillsMaterial.color.set(value);
    this._volumesMaterial.color.set(value);
    for (const line of this.lines) line.color = value;
    for (const fill of this.fills) fill.color = value;
    for (const volume of this.volumes) volume.color = value;
    this.onStateChanged.trigger(["color"]);
  }

  get color() {
    return this._color;
  }

  /**
   * @deprecated Sync mode is gone — picks are fast enough through
   * the unified GPU-pick path that the synchronous workaround is no
   * longer needed. Reading still returns the underlying picker mode
   * for compatibility, but setting it has no functional effect.
   */
  get pickerMode() {
    return this._vertexPicker.mode;
  }

  /** @deprecated See the getter. */
  set pickerMode(value: GraphicVertexPickerMode) {
    this._vertexPicker.mode = value;
  }

  get snapDistance() {
    return this._vertexPicker.maxDistance;
  }

  set snapDistance(value: number) {
    this._vertexPicker.maxDistance = value;
  }

  get pickerSize() {
    return this._vertexPicker.pickerSize;
  }

  set pickerSize(value: number) {
    this._vertexPicker.pickerSize = value;
  }

  protected _vertexPicker = new GraphicVertexPicker(this.components);

  constructor(components: OBC.Components, measureType: U) {
    super(components);
    this.measureType = measureType;
    this._units = defaultUnits[this.measureType] as MeasureToUnitMap[U];
    this.lines.onBeforeDelete.add((line) => line.dispose());
    this.fills.onBeforeDelete.add((fill) => fill.dispose());
    this.labels.onBeforeDelete.add((label) => label.dispose());
    this.volumes.onBeforeDelete.add((volume) => volume.dispose());
    this.list.onCleared.add(() => {
      this.lines.clear();
      this.fills.clear();
      this.labels.clear();
      this.volumes.clear();
    });
  }

  create = (_input?: any) => {};
  endCreation = (_data?: T) => {};
  cancelCreation = () => {};
  delete = (_data?: any) => {};

  dispose() {
    this._vertexPicker.dispose();
    this.list.clear();
    this.linesMaterial.dispose();
    this.fillsMaterial.dispose();
    this.volumesMaterial.dispose();
    this.onDisposed.trigger();
  }

  applyPlanesVisibility(planes: THREE.Plane[]) {
    for (const line of this.lines) {
      line.applyPlanesVisibility(planes);
    }
    for (const fill of this.fills) {
      fill.applyPlanesVisibility(planes);
    }
    for (const volume of this.volumes) {
      volume.applyPlanesVisibility(planes);
    }
  }

  protected createLineElement(
    line: Line,
    startNormal: THREE.Vector3 | null = null,
  ) {
    if (!this.world) {
      throw new Error("Measurement: world is need!");
    }
    return new DimensionLine(
      this.components,
      this.world,
      {
        line,
        startNormal: startNormal ?? undefined,
        lineMaterial: this.linesMaterial,
        endpointElement: this.linesEndpointElement,
      },
      this.rounding,
      this.units as any,
    );
  }

  protected createFillElement(area: Area) {
    if (!this.world) {
      throw new Error("Measurement: world is need!");
    }

    const fill = new MeasureFill(this.components, this.world, area);
    fill.rounding = this.rounding;

    const unitsMeasureType = this.units.endsWith("2") ? "area" : undefined;
    if (unitsMeasureType === "area") {
      fill.units = this.units as "mm2" | "cm2" | "m2" | "km2";
    }

    return fill;
  }

  protected createVolumeElement(volume: Volume) {
    if (!this.world) {
      throw new Error("Measurement: world is need!");
    }

    const element = new MeasureVolume(this.components, this.world, volume);
    element.rounding = this.rounding;

    const unitsMeasureType = this.units.endsWith("3") ? "volume" : undefined;
    if (unitsMeasureType === "volume") {
      element.units = this.units as "mm3" | "cm3" | "m3" | "km3";
    }

    return element;
  }

  protected addLineElementsFromPoints(points: THREE.Vector3[]) {
    for (let i = 0; i < points.length; i++) {
      const start = points[i];
      const end = points[(i + 1) % points.length];
      const line = new Line(start, end);
      const dimensionLine = this.createLineElement(line);
      dimensionLine.label.visible = false;
      this.lines.add(dimensionLine);
    }
  }

  protected getLineBoxes() {
    const boxes: THREE.Mesh[] = [];
    for (const line of this.lines) {
      boxes.push(line.boundingBox);
    }
    return boxes;
  }

  protected getFillBoxes() {
    const meshes: THREE.Mesh[] = [];
    for (const fill of this.fills) {
      meshes.push(fill.three);
    }
    return meshes;
  }

  protected async getVolumeBoxes() {
    const meshes: THREE.Mesh[][] = [];
    for (const volume of this.volumes) {
      meshes.push(volume.meshes);
    }
    return meshes;
  }
}
