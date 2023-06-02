import * as THREE from "three";
import { CSS2DObject } from "three/examples/jsm/renderers/CSS2DRenderer";
import { DimensionData, DimensionLabelClassName } from "./types";
import { Components } from "../Components";
import { Disposer } from "../Disposer";

// TODO: Document + clean up this: way less parameters, clearer logic

export class SimpleDimensionLine {
  start: THREE.Vector3;
  end: THREE.Vector3;
  center: THREE.Vector3;
  label: CSS2DObject;
  boundingBox = new THREE.Mesh();

  static scale = 1;
  static units = "m";

  private _disposer = new Disposer();
  private _length: number;

  private readonly _components: Components;
  private readonly _root = new THREE.Group();
  private readonly _endpoints: THREE.Mesh[] = [];
  private readonly _line: THREE.Line;

  set visible(visible: boolean) {
    if (visible) {
      this._components.scene.get().add(this._root);
      this._root.add(this.label);
    } else {
      this._root.removeFromParent();
      this.label.removeFromParent();
    }
  }

  set geometry(geometry: THREE.BufferGeometry) {
    for (const point of this._endpoints) {
      point.geometry = geometry;
    }
  }

  set endPoint(point: THREE.Vector3) {
    this.end = point;
    this.updateEndpointPosition(point);
    this.updateEndpointMeshes(point);
    this.updateLabel();
  }

  set startPoint(point: THREE.Vector3) {
    this.start = point;
    this.updateStartpointPosition(point);
    // this.updateEndpointMeshes(point);
    this.updateLabel();
  }

  constructor(components: Components, data: DimensionData) {
    this._components = components;

    this.start = data.start;
    this.end = data.end;
    this._length = this.getLength();
    this.center = this.getCenter();
    this._line = this.createLine(data);

    this.newEndpointMesh(data);
    this.newEndpointMesh(data);
    this.label = this.newText();
    this._root.renderOrder = 2;
    this._components.scene.get().add(this._root);
  }

  dispose() {
    this.visible = false;
    this._disposer.dispose(this._root as any);
    this._disposer.dispose(this._line as any);
    for (const mesh of this._endpoints) {
      mesh.removeFromParent();
    }
    this._endpoints.length = 0;

    this.label.removeFromParent();
    this.label.element.remove();

    if (this.boundingBox) {
      this._disposer.dispose(this.boundingBox);
    }
  }

  createBoundingBox() {
    this.boundingBox.geometry = new THREE.BoxGeometry(1, 1, this._length);
    this.boundingBox.position.copy(this.center);
    this.boundingBox.lookAt(this.end);
    this.boundingBox.visible = false;
    this._root.add(this.boundingBox);
  }

  private updateLabel() {
    this._length = this.getLength();
    this.label.element.textContent = this.getTextContent();
    this.center = this.getCenter();
    this.label.position.set(this.center.x, this.center.y, this.center.z);
    this._line.computeLineDistances();
  }

  private updateEndpointMeshes(point: THREE.Vector3) {
    this._endpoints[1].position.copy(point);
    this._endpoints[1].lookAt(this.start);
    this._endpoints[0].lookAt(this.end);
  }

  private updateStartpointPosition(point: THREE.Vector3) {
    const position = this._line.geometry.attributes
      .position as THREE.BufferAttribute;
    position.setXYZ(0, point.x, point.y, point.z);
    position.needsUpdate = true;
  }

  private updateEndpointPosition(point: THREE.Vector3) {
    const position = this._line.geometry.attributes
      .position as THREE.BufferAttribute;
    position.setXYZ(1, point.x, point.y, point.z);
    position.needsUpdate = true;
  }

  private createLine(data: DimensionData) {
    const axisGeom = new THREE.BufferGeometry();
    axisGeom.setFromPoints([data.start, data.end]);
    const line = new THREE.Line(axisGeom, data.lineMaterial);
    this._root.add(line);
    return line;
  }

  private newEndpointMesh(data: DimensionData) {
    const isFirst = this._endpoints.length === 0;
    const position = isFirst ? this.start : this.end;
    const direction = isFirst ? this.end : this.start;
    const mesh = data.endpoint.clone();
    mesh.position.copy(position);
    mesh.lookAt(direction);
    this._endpoints.push(mesh);
    this._root.add(mesh);
  }

  private newText() {
    const htmlText = document.createElement("div");
    htmlText.className = DimensionLabelClassName;
    htmlText.textContent = this.getTextContent();
    const label = new CSS2DObject(htmlText);
    label.position.set(this.center.x, this.center.y, this.center.z);
    this._root.add(label);
    return label;
  }

  private getTextContent() {
    return `${this._length / SimpleDimensionLine.scale} ${
      SimpleDimensionLine.units
    }`;
  }

  private getLength() {
    return parseFloat(this.start.distanceTo(this.end).toFixed(2));
  }

  private getCenter() {
    let dir = this.end.clone().sub(this.start);
    const len = dir.length() * 0.5;
    dir = dir.normalize().multiplyScalar(len);
    return this.start.clone().add(dir);
  }
}
