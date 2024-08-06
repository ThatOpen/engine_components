import * as THREE from "three";
import * as OBC from "@thatopen/components";
import { Mark } from "../../core";
import { newDimensionMark } from "../utils";

/**
 * Interface representing the data required to create a dimension line.
 */
export interface DimensionData {
  /**
   * The starting point of the dimension line in 3D space.
   */
  start: THREE.Vector3;

  /**
   * The ending point of the dimension line in 3D space.
   */
  end: THREE.Vector3;

  /**
   * The material to be used for the line of the dimension.
   */
  lineMaterial: THREE.Material;

  /**
   * The HTML element to be used as the endpoint marker for the dimension line.
   */
  endpointElement: HTMLElement;
}

// TODO: Clean up this: way less parameters, clearer logic

/**
 * A class representing a simple dimension line in a 3D space.
 */
export class SimpleDimensionLine {
  /**
   * The label for the dimension line.
   */
  label: Mark;

  /**
   * The bounding box for the dimension line.
   */
  boundingBox = new THREE.Mesh();

  /**
   * The world in which the dimension line exists.
   */
  world: OBC.World;

  /**
   * The components used by the dimension line.
   */
  components: OBC.Components;

  /**
   * The scale factor for the dimension line.
   */
  static scale = 1;

  /**
   * The units used for the dimension line.
   */
  static units = "m";

  /**
   * The number of decimals to show in the label.
   */
  static rounding = 2;

  private _length: number;

  private _visible = true;

  private _start: THREE.Vector3;

  private _end: THREE.Vector3;

  private readonly _root = new THREE.Group();

  private readonly _endpoints: Mark[] = [];

  private readonly _line: THREE.Line;

  /**
   * Getter for the visibility of the dimension line.
   * @returns {boolean} The current visibility state.
   */
  get visible() {
    return this._visible;
  }

  /**
   * Setter for the visibility of the dimension line.
   * @param {boolean} value - The new visibility state.
   */
  set visible(value: boolean) {
    this._visible = value;
    this.label.visible = value;
    this._endpoints[0].visible = value;
    this._endpoints[1].visible = value;

    const [endpoint1, endpoint2] = this._endpoints;
    const ep1Object = endpoint1.three;
    const ep2Object = endpoint2.three;
    const label = this.label.three;

    if (value) {
      this.world.scene.three.add(this._root);
      this._root.add(label, ep1Object, ep2Object);
    } else {
      label.removeFromParent();
      ep1Object.removeFromParent();
      ep2Object.removeFromParent();
      this._root.removeFromParent();
    }
  }

  /**
   * Getter for the end point of the dimension line.
   * @returns {THREE.Vector3} The current end point.
   */
  get endPoint() {
    return this._end;
  }

  /**
   * Setter for the end point of the dimension line.
   * Updates the line geometry and position of the end point marker.
   * @param {THREE.Vector3} point - The new end point.
   */
  set endPoint(point: THREE.Vector3) {
    this._end = point;
    const position = this._line.geometry.attributes
      .position as THREE.BufferAttribute;
    position.setXYZ(1, point.x, point.y, point.z);
    position.needsUpdate = true;
    this._endpoints[1].three.position.copy(point);
    this.updateLabel();
  }

  /**
   * Getter for the start point of the dimension line.
   * @returns {THREE.Vector3} The current start point.
   */
  get startPoint() {
    return this._start;
  }

  /**
   * Setter for the start point of the dimension line.
   * Updates the line geometry and position of the start point marker.
   * @param {THREE.Vector3} point - The new start point.
   */
  set startPoint(point: THREE.Vector3) {
    this._start = point;
    const position = this._line.geometry.attributes
      .position as THREE.BufferAttribute;
    position.setXYZ(0, point.x, point.y, point.z);
    position.needsUpdate = true;
    this._endpoints[0].three.position.copy(point);
    this.updateLabel();
  }

  private get _center() {
    let dir = this._end.clone().sub(this._start);
    const len = dir.length() * 0.5;
    dir = dir.normalize().multiplyScalar(len);
    return this._start.clone().add(dir);
  }

  constructor(
    components: OBC.Components,
    world: OBC.World,
    data: DimensionData,
  ) {
    this.components = components;
    this.world = world;

    this._start = data.start;
    this._end = data.end;
    this._length = this.getLength();
    this._line = this.createLine(data);

    this.newEndpointElement(data.endpointElement);
    // @ts-ignore
    this.newEndpointElement(data.endpointElement.cloneNode(true));
    this.label = this.newText();
    this._root.renderOrder = 2;
    this.world.scene.three.add(this._root);
  }

  /**
   * Disposes of the dimension line and its associated resources.
   * This method should be called when the dimension line is no longer needed.
   * It removes the dimension line from the world, destroys its components, and frees up memory.
   */
  dispose() {
    const disposer = this.components.get(OBC.Disposer);
    this.visible = false;
    disposer.destroy(this._root as any);
    disposer.destroy(this._line as any);
    for (const marker of this._endpoints) {
      marker.dispose();
    }
    this._endpoints.length = 0;
    this.label.dispose();
    if (this.boundingBox) {
      disposer.destroy(this.boundingBox);
    }
    (this.components as any) = null;
  }

  /**
   * Creates a bounding box for the dimension line.
   * The bounding box is a 3D box that encloses the dimension line.
   * It is used for collision detection and visibility culling.
   * The bounding box is initially invisible and can be toggled using the `toggleBoundingBox` method.
   */
  createBoundingBox() {
    this.boundingBox.geometry = new THREE.BoxGeometry(1, 1, this._length);
    this.boundingBox.position.copy(this._center);
    this.boundingBox.lookAt(this._end);
    this.boundingBox.visible = false;
    this._root.add(this.boundingBox);
  }

  /**
   * Toggles the visibility of the dimension line's label.
   * The label is a text element that displays the length of the dimension line.
   * This method is used to show or hide the label when needed.
   */
  toggleLabel() {
    this.label.toggleVisibility();
  }

  private newEndpointElement(element: HTMLElement) {
    const isFirst = this._endpoints.length === 0;
    const position = isFirst ? this._start : this._end;
    const marker = new Mark(this.world, element);
    marker.three.position.copy(position);
    this._endpoints.push(marker);
    this._root.add(marker.three);
  }

  private updateLabel() {
    this._length = this.getLength();
    this.label.three.element.textContent = this.getTextContent();
    this.label.three.position.copy(this._center);
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
    const htmlText = newDimensionMark();
    htmlText.textContent = this.getTextContent();
    const label = new Mark(this.world, htmlText);
    label.three.position.copy(this._center);
    this._root.add(label.three);
    return label;
  }

  private getTextContent() {
    const calcedValue = this._length / SimpleDimensionLine.scale;
    const roundedValue = calcedValue.toFixed(SimpleDimensionLine.rounding);
    return `${roundedValue} ${SimpleDimensionLine.units}`;
  }

  private getLength() {
    return this._start.distanceTo(this._end);
  }
}
