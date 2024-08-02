import * as THREE from "three";
import * as OBC from "@thatopen/components";

import { SimpleDimensionLine } from "../../SimpleDimensionLine";
import { Mark } from "../../../core";
import { newDimensionMark } from "../../utils";

interface Area {
  points: THREE.Vector3[];
  workingPlane: THREE.Plane | null;
  area: number;
}

export class AreaMeasureElement implements OBC.Hideable, OBC.Disposable {
  enabled: boolean = true;

  points: THREE.Vector3[] = [];

  workingPlane: THREE.Plane | null = null;

  labelMarker: Mark;

  world: OBC.World;

  components: OBC.Components;

  readonly onDisposed = new OBC.Event();

  readonly onAreaComputed = new OBC.Event<number>();

  readonly onWorkingPlaneComputed = new OBC.Event<THREE.Plane>();

  readonly onPointAdded = new OBC.Event<THREE.Vector3>();

  readonly onPointRemoved = new OBC.Event<THREE.Vector3>();

  private _visible = true;

  private _rotationMatrix: THREE.Matrix4 | null = null;

  private _dimensionLines: SimpleDimensionLine[] = [];

  private _defaultLineMaterial = new THREE.LineBasicMaterial({ color: "red" });

  /** {@link OBC.Hideable.visible} */
  get visible() {
    return this._visible;
  }

  /** {@link OBC.Hideable.visible} */
  set visible(value: boolean) {
    this._visible = value;
    for (const dim of this._dimensionLines) {
      dim.visible = value;
      dim.label.visible = false;
    }
    this.labelMarker.visible = value;
  }

  constructor(
    components: OBC.Components,
    world: OBC.World,
    points?: THREE.Vector3[],
  ) {
    this.world = world;
    this.components = components;
    const htmlText = newDimensionMark();
    this.labelMarker = new Mark(world, htmlText);
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
    if (nextLine) previousLine.endPoint = nextLine.endPoint;
    nextLine?.dispose();
    this._dimensionLines.splice(index, 1);
    this.onPointRemoved.trigger();
  }

  toggleLabel() {
    this.labelMarker.toggleVisibility();
  }

  private addDimensionLine(start: THREE.Vector3, end: THREE.Vector3) {
    const dimensionLine = new SimpleDimensionLine(this.components, this.world, {
      start,
      end,
      lineMaterial: this._defaultLineMaterial,
      endpointElement: newDimensionMark(),
    });

    dimensionLine.toggleLabel();

    if (this._dimensionLines.length > 1) {
      this._dimensionLines.splice(
        this._dimensionLines.length - 1,
        0,
        dimensionLine,
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
      this.points[2],
    );
    const referenceVector = new THREE.Vector3(0, 1, 0);
    const theta = this.workingPlane.normal.angleTo(referenceVector);

    const rotationAxis = new THREE.Vector3()
      .crossVectors(this.workingPlane.normal, referenceVector)
      .normalize();

    this._rotationMatrix = new THREE.Matrix4().makeRotationAxis(
      rotationAxis,
      theta,
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
        transformedPoint.z,
      );
      xSum += vector2D.x;
      ySum += vector2D.y;
      return vector2D;
    });
    const area = Math.abs(THREE.ShapeUtils.area(vectors2D));
    this.labelMarker.three.element.textContent = `${area.toFixed(2)} m²`;
    this.labelMarker.three.position
      .set(
        xSum / vectors2D.length,
        -this.workingPlane.constant,
        ySum / vectors2D.length,
      )
      .applyMatrix4(rotMatrix.clone().invert());
    this.onAreaComputed.trigger(area);
    return area;
  }

  dispose() {
    this.onAreaComputed.reset();
    this.onWorkingPlaneComputed.reset();
    this.onPointAdded.reset();
    this.onPointRemoved.reset();
    for (const line of this._dimensionLines) {
      line.dispose();
    }
    this.labelMarker.dispose();
    this._dimensionLines = [];
    this.points = [];
    this._rotationMatrix = null;
    this.workingPlane = null;
    this._defaultLineMaterial.dispose();
    this.onDisposed.trigger();
    this.onDisposed.reset();
  }

  get(): Area {
    return {
      points: this.points,
      workingPlane: this.workingPlane,
      area: this.computeArea(),
    };
  }
}
