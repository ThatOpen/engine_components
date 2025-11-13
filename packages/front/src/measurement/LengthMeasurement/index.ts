import * as THREE from "three";
import * as OBC from "@thatopen/components";
import { Line } from "../../utils";
import { Measurement } from "../Measurement";
import { LengthMeasurerModes, LengthMeasurerTempData } from "./src";

/**
 * A basic dimension tool to measure distances between 2 points in 3D and display a 3D symbol displaying the numeric value. 📕 [Tutorial](https://docs.thatopen.com/Tutorials/Components/Front/LengthMeasurement). 📘 [API](https://docs.thatopen.com/api/@thatopen/components-front/classes/LengthMeasurement).
 */
export class LengthMeasurement extends Measurement<Line, "length"> {
  static uuid = "2f9bcacf-18a9-4be6-a293-e898eae64ea1" as const;

  private _temp: LengthMeasurerTempData = {
    isDragging: false,
    line: new Line(),
  };

  /**
   * The possible modes in which a measurement of this type may be created.
   */
  modes: LengthMeasurerModes[number][] = ["free", "edge"];

  private _mode: LengthMeasurerModes[number] = "free";

  get mode(): LengthMeasurerModes[number] {
    return this._mode;
  }

  /**
   * Represents the current measurement mode being used.
   */
  set mode(value: LengthMeasurerModes[number]) {
    this._mode = value;
    this.cancelCreation();
    if (value === "edge") this.initPreview();
    this.onStateChanged.trigger(["mode"]);
  }

  constructor(components: OBC.Components) {
    super(components, "length");
    components.add(LengthMeasurement.uuid, this);
    this.initHandlers();
  }

  private initHandlers() {
    this.list.onItemAdded.add((line) => {
      const element = this.createLineElement(line, this._temp.startNormal);
      element.createBoundingBox();
      this.lines.add(element);
    });

    this.list.onBeforeDelete.add((line) => {
      const lineElements = [...this.lines];
      const lineElement = lineElements.find((element) => element.line === line);
      if (lineElement) this.lines.delete(lineElement);
    });

    this.onPointerStop.add(() => this.updatePreviewLine());
    this.onEnabledChange.add((enabled) => {
      if (!enabled) return;
      if (this.mode === "edge") {
        this.initPreview();
      }
    });
  }

  private async initPreview() {
    if (!this.world) {
      throw new Error("Measurement: world is need!");
    }

    const pickResult = await this._vertexPicker.get({
      snappingClasses: this.snappings,
    });

    if (this.mode === "free") {
      if (!pickResult?.point) return;
      const start = pickResult.point;
      this._temp.line.set(start, start.clone());
      this._temp.isDragging = true;
      this._temp.dimension = this.createLineElement(this._temp.line);
      this._temp.startNormal = pickResult.normal ?? undefined;
    } else if (this.mode === "edge") {
      const p1 = (pickResult as any)?.snappedEdgeP1 as
        | THREE.Vector3
        | undefined;

      const p2 = (pickResult as any)?.snappedEdgeP2 as
        | THREE.Vector3
        | undefined;

      const start = p1 || new THREE.Vector3();
      const end = start || p2;
      this._temp.line.set(start, end);
      this._temp.isDragging = true;
      this._temp.dimension = this.createLineElement(this._temp.line);
      this._temp.dimension.visible = !!(p1 && p2);
    }
  }

  private async updatePreviewLine() {
    if (!this.world) {
      throw new Error("Measurement: world is need!");
    }

    const pickResult = await this._vertexPicker.get({
      snappingClasses: this.snappings,
    });

    if (this.mode === "free") {
      if (!pickResult?.point) return;
      this._temp.line.end.copy(pickResult.point);
      if (!this._temp.dimension) return;
      this._temp.dimension.end = this._temp.line.end;
    } else if (this.mode === "edge") {
      const p1 = (pickResult as any)?.snappedEdgeP1 as
        | THREE.Vector3
        | undefined;

      const p2 = (pickResult as any)?.snappedEdgeP2 as
        | THREE.Vector3
        | undefined;

      if (this._temp.dimension) this._temp.dimension.visible = !!(p1 && p2);
      if (!(p1 && p2)) return;
      this._temp.line.start.copy(p1);
      this._temp.line.end.copy(p2);
      if (!this._temp.dimension) return;
      this._temp.dimension.start = this._temp.line.start;
      this._temp.dimension.end = this._temp.line.end;
    }
  }

  create = () => {
    if (!this.enabled) return;
    if (!this._temp.isDragging) {
      this.initPreview();
      return;
    }
    this.endCreation();
  };

  endCreation = () => {
    if (!this.enabled) return;
    if (!this._temp.dimension) return;
    this.list.add(this._temp.line.clone());
    if (this.mode === "free") {
      this._temp.dimension.dispose();
      this._temp.dimension = undefined;
      this._temp.isDragging = false;
      this._temp.startNormal = undefined;
    }
  };

  cancelCreation = () => {
    if (!this.enabled) return;
    this._temp.isDragging = false;
    if (!this._temp.dimension) return;
    this._temp.dimension?.dispose();
    this._temp.dimension = undefined;
  };

  delete = () => {
    if (!this.enabled) return;
    if (this.list.size === 0 || !this.world) return;
    const boundingBoxes = this.getLineBoxes();

    const casters = this.components.get(OBC.Raycasters);
    const caster = casters.get(this.world);
    const intersect = caster.castRayToObjects(boundingBoxes);

    if (!intersect) return;

    const lineElements = [...this.lines];
    const lineElement = lineElements.find(
      (element) => element.boundingBox === intersect.object,
    );
    if (!lineElement) return;
    this.list.delete(lineElement.line);
  };
}
