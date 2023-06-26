import * as THREE from "three";
import { Component } from "../../base-types/component";
import { Components } from "../../core/Components";
import { SimpleDimensionLine } from "../../core/SimpleDimensions/simple-dimension-line";
import { VertexPicker } from "../../utils";

export class SimpleArea extends Component<any> {
  name: string = "SimpleArea";

  private _enabled: boolean = false;
  private _components: Components;
  private _vertexPicker: VertexPicker;

  points: THREE.Vector3[] = [];

  private _currentLine: SimpleDimensionLine | null = null;
  private _endLine: SimpleDimensionLine | null = null;

  set enabled(value: boolean) {
    this._enabled = value;
    this._vertexPicker.enabled = value;
  }

  get enabled() {
    return this._enabled;
  }

  constructor(components: Components) {
    super();
    this._components = components;
    this._vertexPicker = new VertexPicker(components);
    const viewerContainer = components.ui.viewerContainer as HTMLElement;
    const element = document.createElement("div");
    element.className = "w-2 h-2 bg-red-600 rounded-full";
    viewerContainer.addEventListener("mouseup", () => {
      if (!this.enabled) return;
      const point = this._vertexPicker.get();
      if (!point) {
        return;
      }
      this.points.push(point);
      this._currentLine = new SimpleDimensionLine(this._components, {
        start: point,
        end: point,
        lineMaterial: new THREE.LineBasicMaterial({ color: "red" }),
        endpointElement: element,
      });
      if (this.points.length > 1 && !this._endLine) {
        this._endLine = new SimpleDimensionLine(this._components, {
          start: point,
          end: this.points[0],
          lineMaterial: new THREE.LineBasicMaterial({ color: "red" }),
          endpointElement: element,
        });
      }
    });

    viewerContainer.addEventListener("mousemove", () => {
      if (!this.enabled) return;
      const point = this._vertexPicker.get();
      if (!(point && this._currentLine)) {
        return;
      }
      this._currentLine.endPoint = point;
      if (this._endLine) {
        this._endLine.startPoint = point;
      }
    });

    window.addEventListener("keydown", (e) => {
      if (!this.enabled) return;
      if (e.key === "Enter" && this._currentLine) {
        this._currentLine.endPoint = this.points[0];
        this._currentLine = null;
        this._endLine?.dispose();
        this.enabled = false;
        console.log(this.area);
      }
    });
  }

  private get _rotationMatrix() {
    if (this.points.length < 3) return null;

    const v1 = new THREE.Vector3().subVectors(this.points[0], this.points[1]);
    const v2 = new THREE.Vector3().subVectors(this.points[1], this.points[2]);
    const normal = new THREE.Vector3().crossVectors(v1, v2).normalize();

    const referenceVector = new THREE.Vector3(0, 1, 0);
    const theta = normal.angleTo(referenceVector);

    const rotationAxis = new THREE.Vector3()
      .crossVectors(normal, referenceVector)
      .normalize();

    const rotationMatrix = new THREE.Matrix4().makeRotationAxis(
      rotationAxis,
      theta
    );

    return rotationMatrix;
  }

  get area() {
    const rotMatrix = this._rotationMatrix;
    if (!rotMatrix) return 0;
    const vectors2D = this.points.map((point) => {
      const transformedPoint = point.clone().applyMatrix4(rotMatrix);
      console.log(transformedPoint);
      return new THREE.Vector2(transformedPoint.x, transformedPoint.z);
    });
    return Math.abs(THREE.ShapeUtils.area(vectors2D));
  }

  get() {
    throw new Error("Method not implemented.");
  }
}
