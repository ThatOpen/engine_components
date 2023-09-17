import * as THREE from "three";
import { DimensionData, DimensionLabelClassName } from "./types";
import { Components, Disposer, Simple2DMarker } from "../../../core";

export * from "./types";

// TODO: Document + clean up this: way less parameters, clearer logic

export class SimpleDimensionLine {
  start: THREE.Vector3;
  end: THREE.Vector3;
  label: Simple2DMarker;
  boundingBox = new THREE.Mesh();

  static scale = 1;
  static units = "m";

  private _length: number;

  private readonly _components: Components;
  private readonly _root = new THREE.Group();
  private readonly _endpoints: Simple2DMarker[] = [];
  private readonly _line: THREE.Line;

  set visible(value: boolean) {
    this.label.visible = value;
    this._endpoints[0].visible = value;
    this._endpoints[1].visible = value;
    if (value) {
      this._components.scene.get().add(this._root);
    } else {
      this._root.removeFromParent();
    }
  }

  set endPoint(point: THREE.Vector3) {
    this.end = point;
    const position = this._line.geometry.attributes
      .position as THREE.BufferAttribute;
    position.setXYZ(1, point.x, point.y, point.z);
    position.needsUpdate = true;
    this._endpoints[1].get().position.copy(point);
    this.updateLabel();
  }

  set startPoint(point: THREE.Vector3) {
    this.start = point;
    const position = this._line.geometry.attributes
      .position as THREE.BufferAttribute;
    position.setXYZ(0, point.x, point.y, point.z);
    position.needsUpdate = true;
    this._endpoints[0].get().position.copy(point);
    this.updateLabel();
  }

  private get _center() {
    let dir = this.end.clone().sub(this.start);
    const len = dir.length() * 0.5;
    dir = dir.normalize().multiplyScalar(len);
    return this.start.clone().add(dir);
  }

  constructor(components: Components, data: DimensionData) {
    this._components = components;

    this.start = data.start;
    this.end = data.end;
    this._length = this.getLength();
    this._line = this.createLine(data);

    this.newEndpointElement(data.endpointElement);
    // @ts-ignore
    this.newEndpointElement(data.endpointElement.cloneNode(true));
    this.label = this.newText();
    this._root.renderOrder = 2;
    this._components.scene.get().add(this._root);
  }

  async dispose() {
    const disposer = await this._components.tools.get(Disposer);
    this.visible = false;
    disposer.destroy(this._root as any);
    disposer.destroy(this._line as any);
    for (const marker of this._endpoints) {
      await marker.dispose();
    }
    this._endpoints.length = 0;
    await this.label.dispose();
    if (this.boundingBox) {
      disposer.destroy(this.boundingBox);
    }
    (this._components as any) = null;
  }

  createBoundingBox() {
    this.boundingBox.geometry = new THREE.BoxGeometry(1, 1, this._length);
    this.boundingBox.position.copy(this._center);
    this.boundingBox.lookAt(this.end);
    this.boundingBox.visible = false;
    this._root.add(this.boundingBox);
  }

  toggleLabel() {
    this.label.toggleVisibility();
  }

  private newEndpointElement(element: HTMLElement) {
    const isFirst = this._endpoints.length === 0;
    const position = isFirst ? this.start : this.end;
    const marker = new Simple2DMarker(this._components, element);
    marker.get().position.copy(position);
    this._endpoints.push(marker);
    this._root.add(marker.get());
  }

  private updateLabel() {
    this._length = this.getLength();
    this.label.get().element.textContent = this.getTextContent();
    this.label.get().position.copy(this._center);
    this._line.computeLineDistances();
  }

  private createLine(data: DimensionData) {
    const axisGeom = new THREE.BufferGeometry();
    axisGeom.setFromPoints([data.start, data.end]);
    const line = new THREE.Line(axisGeom, data.lineMaterial);
    this._root.add(line);
    return line;
  }

  private newText() {
    const htmlText = document.createElement("div");
    htmlText.className = DimensionLabelClassName;
    htmlText.textContent = this.getTextContent();
    const label = new Simple2DMarker(this._components, htmlText);
    label.get().position.copy(this._center);
    this._root.add(label.get());
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
}
