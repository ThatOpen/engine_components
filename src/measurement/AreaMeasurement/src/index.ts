import * as THREE from "three";
import { Simple2DMarker, Components } from "../../../core";
import { Hideable, Event, Disposable, Component } from "../../../base-types";

import {
  DimensionLabelClassName,
  SimpleDimensionLine,
} from "../../LengthMeasurement";

interface Area {
  points: THREE.Vector3[];
  workingPlane: THREE.Plane | null;
  area: number;
}

export class AreaMeasureElement
  extends Component<Area>
  implements Hideable, Disposable
{
  name: string = "AreaShape";
  enabled: boolean = true;
  visible: boolean = true;
  points: THREE.Vector3[] = [];
  workingPlane: THREE.Plane | null = null;
  labelMarker: Simple2DMarker;

  private _rotationMatrix: THREE.Matrix4 | null = null;
  private _dimensionLines: SimpleDimensionLine[] = [];
  private _defaultLineMaterial = new THREE.LineBasicMaterial({ color: "red" });

  readonly onAreaComputed = new Event<number>();
  readonly onWorkingPlaneComputed = new Event<THREE.Plane>();
  readonly onPointAdded = new Event<THREE.Vector3>();
  readonly onPointRemoved = new Event<THREE.Vector3>();

  constructor(components: Components, points?: THREE.Vector3[]) {
    super(components);
    const htmlText = document.createElement("div");
    htmlText.className = DimensionLabelClassName;
    this.labelMarker = new Simple2DMarker(components, htmlText);
    this.labelMarker.visible = false;
    this.onPointAdded.add((point) => {
      if (this.points.length === 3 && !this._dimensionLines[2]) {
        this.addDimensionLine(point, this.points[0]);
        this.labelMarker.visible = true;
      }
    });
    points?.forEach((point) => this.setPoint(point));
  }

  setPoint(point: THREE.Vector3, index?: number) {
    let _index: number;
    if (!index) {
      _index = this.points.length === 0 ? 0 : this.points.length;
    } else {
      _index = index;
    }
    if (_index === 0) {
      this.points[0] = point;
      return;
    }
    if (_index < 0 || _index > this.points.length) return;
    const existingIndex = this.points.length > _index;
    this.points[_index] = point;
    this.onPointAdded.trigger(point);
    if (!existingIndex) {
      this.addDimensionLine(this.points[_index - 1], point);
    }
    const { previousLine, nextLine } = this.getLinesBetweenIndex(_index);
    if (previousLine) previousLine.endPoint = point;
    if (nextLine) nextLine.startPoint = point;
  }

  removePoint(index: number) {
    if (this.points.length === 3) return;
    this.points.splice(index, 1);
    const { previousLine, nextLine } = this.getLinesBetweenIndex(index);
    if (nextLine) previousLine.endPoint = nextLine.end;
    nextLine?.dispose();
    this._dimensionLines.splice(index, 1);
    this.onPointRemoved.trigger();
  }

  toggleLabel() {
    this.labelMarker.toggleVisibility();
  }

  private addDimensionLine(start: THREE.Vector3, end: THREE.Vector3) {
    const element = document.createElement("div");
    element.className = "w-2 h-2 bg-red-600 rounded-full";
    const dimensionLine = new SimpleDimensionLine(this.components, {
      start,
      end,
      lineMaterial: this._defaultLineMaterial,
      endpointElement: element,
    });
    dimensionLine.toggleLabel();
    if (this._dimensionLines.length > 1) {
      this._dimensionLines.splice(
        this._dimensionLines.length - 1,
        0,
        dimensionLine
      );
    } else {
      this._dimensionLines.push(dimensionLine);
    }
    return dimensionLine;
  }

  private getLinesBetweenIndex(index: number) {
    const previousLineIndex =
      index === 0 ? this._dimensionLines.length - 1 : index - 1;
    const previousLine = this._dimensionLines[previousLineIndex];
    const nextLine = this._dimensionLines[index];
    return { previousLine, nextLine };
  }

  computeWorkingPlane() {
    this.workingPlane = new THREE.Plane().setFromCoplanarPoints(
      this.points[0],
      this.points[1],
      this.points[2]
    );
    const referenceVector = new THREE.Vector3(0, 1, 0);
    const theta = this.workingPlane.normal.angleTo(referenceVector);

    const rotationAxis = new THREE.Vector3()
      .crossVectors(this.workingPlane.normal, referenceVector)
      .normalize();

    this._rotationMatrix = new THREE.Matrix4().makeRotationAxis(
      rotationAxis,
      theta
    );
    this.onWorkingPlaneComputed.trigger(this.workingPlane);
  }

  computeArea() {
    if (!(this._rotationMatrix && this.workingPlane)) {
      this.onAreaComputed.trigger(0);
      return 0;
    }
    let xSum = 0;
    let ySum = 0;
    const rotMatrix = this._rotationMatrix;
    const vectors2D = this.points.map((point) => {
      const transformedPoint = point.clone().applyMatrix4(rotMatrix);
      const vector2D = new THREE.Vector2(
        transformedPoint.x,
        transformedPoint.z
      );
      xSum += vector2D.x;
      ySum += vector2D.y;
      return vector2D;
    });
    const area = Math.abs(THREE.ShapeUtils.area(vectors2D));
    this.labelMarker.get().element.textContent = `${area.toFixed(2)} m²`;
    this.labelMarker
      .get()
      .position.set(
        xSum / vectors2D.length,
        -this.workingPlane.constant,
        ySum / vectors2D.length
      )
      .applyMatrix4(rotMatrix.clone().invert());
    this.onAreaComputed.trigger(area);
    return area;
  }

  async dispose() {
    this.onAreaComputed.reset();
    this.onWorkingPlaneComputed.reset();
    this.onPointAdded.reset();
    this.onPointRemoved.reset();
    for (const line of this._dimensionLines) {
      line.dispose();
    }
    await this.labelMarker.dispose();
    this._dimensionLines = [];
    this.points = [];
    this._rotationMatrix = null;
    this.workingPlane = null;
    this._defaultLineMaterial.dispose();
    (this.components as any) = null;
  }

  get(): Area {
    return {
      points: this.points,
      workingPlane: this.workingPlane,
      area: this.computeArea(),
    };
  }
}
