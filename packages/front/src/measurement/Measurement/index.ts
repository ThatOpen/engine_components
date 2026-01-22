import * as OBC from "@thatopen/components";
import * as THREE from "three";
import * as FRAGS from "@thatopen/fragments";
import { DataSet } from "@thatopen/fragments";
import {
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
import { defaultUnits, MeasurementStateChange, MeasureToUnitMap } from "./src";
import { MeasureVolume } from "../../utils/measure-volume";

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
    } else {
      list = ["mm3", "cm3", "m3", "km3"];
    }
    return list;
  }

  readonly onPointerStop = new OBC.Event();
  readonly onPointerMove = new OBC.Event();
  readonly onStateChanged = new OBC.Event<MeasurementStateChange[]>();

  private pointerStopTimeout: number | null = null;

  private onMove = () => {
    if (!this.enabled) return;

    this._vertexPicker.updatePointer();

    if (this.pointerStopTimeout !== null) {
      clearTimeout(this.pointerStopTimeout);
    }

    // TODO: Make this configurable?
    this.pointerStopTimeout = window.setTimeout(() => {
      this.onPointerStop.trigger();
    }, this.delay);

    this.onPointerMove.trigger();
  };

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

    if (active) {
      viewerContainer.addEventListener("pointermove", this.onMove);
      window.addEventListener("keydown", this.onKeydown);
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

    let valueMeasureType: "length" | "area" | "volume" | undefined;
    if (value.endsWith("2")) {
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

  get pickerMode() {
    return this._vertexPicker.mode;
  }

  set pickerMode(value: GraphicVertexPickerMode) {
    this._vertexPicker.mode = value;
  }

  get snapDistance() {
    return this._vertexPicker.maxDistance;
  }

  set snapDistance(value: number) {
    this._vertexPicker.maxDistance = value;
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
