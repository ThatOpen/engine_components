import * as THREE from "three";
import * as OBC from "@thatopen/components";
import { DataSet } from "@thatopen/fragments";
import { Measurement } from "../Measurement";
import { Area, DimensionLine, Line } from "../../utils";
import { AreaMeasurerModes, AreaMeasurerTempData } from "./src";

// TODO: Implement face measurement as measure mode
/**
 * AreaMeasurement allows users to measure and interact with areas in a 3D environment. This class provides functionality for creating, updating, and deleting area measurements, as well as managing their visual representation. 📕 [Tutorial](https://docs.thatopen.com/Tutorials/Components/Front/AreaMeasurement). 📘 [API](https://docs.thatopen.com/api/@thatopen/components-front/classes/AreaMeasurement).
 */
export class AreaMeasurement extends Measurement<Area, "area"> {
  static uuid = "09b78c1f-0ff1-4630-a818-ceda3d878c75" as const;

  /**
   * The tolerance value used for picking operations in area measurement.
   * This value determines the precision or sensitivity when selecting or interacting
   * with measurement areas. A smaller value increases precision, while a larger value
   * allows for more leniency in selection.
   *
   * @default 0.1
   */
  pickTolerance = 1e-1;

  /**
   * Represents the tolerance value used for area measurement calculations.
   * This value defines the acceptable margin of error for a point in the shape to be added to the area element.
   *
   * @default 0.005
   */
  tolerance = 5e-3;

  /**
   * The possible modes in which a measurement of this type may be created.
   */
  modes: AreaMeasurerModes[number][] = ["free", "square"];

  private _mode: AreaMeasurerModes[number] = "free";

  get mode(): AreaMeasurerModes[number] {
    return this._mode;
  }

  /**
   * Represents the current measurement mode being used.
   */
  set mode(value: AreaMeasurerModes[number]) {
    this._mode = value;
    this.cancelCreation();
    this.onStateChanged.trigger(["mode"]);
  }

  private _temp: AreaMeasurerTempData = {
    isDragging: false,
    area: new Area(),
    lines: new DataSet<DimensionLine>(),
    point: new THREE.Vector3(),
  };

  constructor(components: OBC.Components) {
    super(components, "area");
    components.add(AreaMeasurement.uuid, this);
    this.initHandlers();
    this.color = new THREE.Color("#6528d7");
  }

  private initHandlers() {
    this.onVisibilityChange.add(() => {
      for (const line of this.lines) {
        line.label.visible = false;
      }
    });

    this.list.onItemAdded.add((area) => {
      if (!this.world) return;
      const fill = this.createFillElement(area);
      fill.color = this.color;
      this.fills.add(fill);
      this.addLineElementsFromPoints([...area.points]);
    });

    this.list.onBeforeDelete.add((area) => {
      const fill = [...this.fills].find((fill) => fill.area === area);
      if (fill) this.fills.delete(fill);
    });

    this.onPointerStop.add(() => this.updatePreview());

    this._temp.lines.onItemAdded.add((line) => (line.label.visible = false));
    this._temp.lines.onBeforeDelete.add((line) => line.dispose());

    this._temp.area.points.onItemAdded.add(() => {
      this.computeLineElements();
    });

    this._temp.area.points.onItemDeleted.add(() => {
      this._temp.lines.clear();
    });

    this.onStateChanged.add(state => {
      if (state.includes("rounding")) {
        this._temp.area.rounding = this.rounding
      }

      if (state.includes("units")) {
        this._temp.area.units = this.units
      }
    })
  }

  private computeLineElements = () => {
    this._temp.lines.clear();
    const points = [...this._temp.area.points];
    if (this._temp.area.isPointInPlane(this._temp.point)) {
      points.push(this._temp.point);
    }
    if (points.length < 2 || !this.world) return;
    for (let i = 0; i < points.length; i++) {
      const start = points[i];
      const end = points[(i + 1) % points.length]; // Connect last point to first
      const line = new Line(start, end);
      const lineElement = this.createLineElement(line);
      this._temp.lines.add(lineElement);
    }
  };

  private async updatePreview() {
    if (!this.enabled || !this.world) {
      throw new Error("Measurement is not enabled or world is not defined!");
    }

    const pickerData = await this._vertexPicker.get({
      snappingClasses: this.snappings,
    });

    if (!(pickerData && pickerData.point && this._temp.isDragging)) {
      return;
    }

    const point = pickerData.point.clone();

    const { plane } = this._temp.area;
    if (plane) {
      const distance = plane.distanceToPoint(point);
      if (Math.abs(distance) < 1e-1) {
        const projection = new THREE.Vector3();
        plane.projectPoint(point, projection);
        point.copy(projection);
      }
    }

    this._temp.point.copy(point);
    this.computeLineElements();
  }

  create = async () => {
    if (!this.enabled) return;

    if (!this.world) {
      throw new Error("Area Measurement: world is not defined!");
    }

    const pickerData = await this._vertexPicker.get({
      snappingClasses: this.snappings,
    });

    if (!(pickerData && pickerData.point)) return;

    const { area, point } = this._temp;

    if (!this._temp.isDragging) {
      area.tolerance = this.tolerance;
      area.points.clear();
      this._temp.isDragging = true;
    }

    if (area.points.size === 0) {
      point.copy(pickerData.point);
      area.points.add(point.clone());
    } else {
      area.points.add(point.clone());
    }

    if (this.mode === "square" && area.points.size === 2 && pickerData.normal) {
      const [p1, p3] = area.points;

      const dir = new THREE.Vector3().subVectors(p3, p1);
      const dirA = dir.clone();
      const dirB = dir.clone().negate();

      // Prioritize X or Y axis alignment based on which has a larger delta
      if (Math.abs(dir.y) >= 0.1) {
        dirA.y = 0;
        dirB.y = 0;
      } else {
        dirA.x = 0;
        dirB.x = 0;
      }

      const p2 = p1.clone().add(dirA);
      const p4 = p3.clone().add(dirB);

      area.points.clear();
      area.points.add(p1, p2, p3, p4);
      this.endCreation();
    }
  };

  endCreation = () => {
    if (!this.enabled) return;
    this._temp.isDragging = false;
    if (this._temp.area.points.size >= 3) {
      this.list.add(this._temp.area.clone());
    }
    this._temp.area.points.clear();
    this._temp.lines.clear();
  };

  cancelCreation = () => {
    if (!this.enabled) return;
    this._temp.isDragging = false;
    this._temp.area.points.clear();
    this._temp.lines.clear();
  };

  delete = () => {
    if (!this.enabled) return;
    if (this.list.size === 0 || !this.world) return;
    const boundingBoxes = this.getFillBoxes();
    const casters = this.components.get(OBC.Raycasters);
    const caster = casters.get(this.world);
    const intersect = caster.castRayToObjects(boundingBoxes);
    const disposer = this.components.get(OBC.Disposer);
    for (const box of boundingBoxes) {
      disposer.destroy(box);
    }
    if (!intersect) return;
    const fillElements = [...this.fills];
    const element = fillElements.find(
      (element) => element.three === intersect.object,
    );
    if (!element) return;
    this.list.delete(element.area);
    this.lines.clear();
  };
}
