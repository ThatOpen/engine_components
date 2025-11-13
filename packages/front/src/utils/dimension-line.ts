import * as THREE from "three";
import * as OBC from "@thatopen/components";
import { DataSet } from "@thatopen/fragments";
import { Mark } from "../core";
import { newDimensionMark, newEndPoint } from "../measurement/utils";
import { Line } from "./line";
import { Measurement } from "../measurement";

/**
 * Interface representing the data required to create a dimension line.
 */
export interface DimensionData {
  /**
   * The 3D line representing the dimension.
   */
  line: Line;
  startNormal?: THREE.Vector3;
  endNormal?: THREE.Vector3;
  /**
   * The material to be used for the line of the dimension.
   */
  lineMaterial: THREE.LineBasicMaterial;

  /**
   * The HTML element to be used as the endpoint marker for the dimension line.
   */
  endpointElement: HTMLElement;
}

// TODO: Clean up this: way less parameters, clearer logic

/**
 * A class representing a simple dimension line in a 3D space.
 */
export class DimensionLine {
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

  private _components: OBC.Components;

  private _units: "mm" | "cm" | "m" | "km" = "m";

  /**
   * The units used for the dimension line.
   */
  set units(value: "mm" | "cm" | "m" | "km") {
    for (const dimension of this.rectangleDimensions) {
      dimension.units = value;
    }
    for (const dimension of this.projectionDimensions) {
      dimension.units = value;
    }
    this._units = value;
    this.updateLabel();
  }

  get units() {
    return this._units;
  }

  /**
   * The number of decimals to show in the label.
   */
  private _rounding = 2;

  set rounding(value: number) {
    for (const dimension of this.rectangleDimensions) {
      dimension.rounding = value;
    }
    for (const dimension of this.projectionDimensions) {
      dimension.rounding = value;
    }
    this._rounding = value;
    this.updateLabel();
  }

  get rounding() {
    return this._rounding;
  }

  startNormal: THREE.Vector3 | null = null;
  readonly line;
  readonly rectangleComponentLines: Line[] = [];
  readonly projectionComponentLines: Line[] = [];
  private _visible = true;
  private readonly _root = new THREE.Group();
  private _endpoints = new DataSet<Mark>();
  readonly lineElement: THREE.Line;
  // eslint-disable-next-line no-use-before-define
  readonly rectangleDimensions = new DataSet<DimensionLine>();
  // eslint-disable-next-line no-use-before-define
  readonly projectionDimensions = new DataSet<DimensionLine>();

  /**
   * Updates the dimension line's appearance based on its state.
   * @param {boolean} isSelected - Whether the dimension line is selected.
   */
  isSelected: boolean = false;

  /**
   * Getter for the visibility of the dimension line.
   */
  get visible() {
    return this._visible;
  }

  /**
   * Setter for the visibility of the dimension line.
   * @param {boolean} value - The new visibility state.
   */
  set visible(value: boolean) {
    for (const dimension of this.rectangleDimensions) {
      dimension.visible = value;
    }

    for (const dimension of this.projectionDimensions) {
      dimension.visible = value;
    }

    this._visible = value;
    this.label.visible = value;
    for (const endpoint of this._endpoints) {
      endpoint.visible = value;
    }
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
   * Setter for the end point of the dimension line.
   * Updates the line geometry and position of the end point marker.
   * @param {THREE.Vector3} point - The new end point.
   */
  set end(point: THREE.Vector3) {
    this.line.end = point;
    const position = this.lineElement.geometry.attributes
      .position as THREE.BufferAttribute;
    position.setXYZ(1, point.x, point.y, point.z);
    position.needsUpdate = true;
    this.update();
  }

  /**
   * Setter for the start point of the dimension line.
   * Updates the line geometry and position of the start point marker.
   * @param {THREE.Vector3} point - The new start point.
   */
  set start(point: THREE.Vector3) {
    this.line.start = point;
    const position = this.lineElement.geometry.attributes
      .position as THREE.BufferAttribute;
    position.setXYZ(0, point.x, point.y, point.z);
    position.needsUpdate = true;
    this.update();
  }

  constructor(
    components: OBC.Components,
    world: OBC.World,
    data: DimensionData,
    rounding: number = 2, // Default rounding precision
    units: "mm" | "cm" | "m" | "km" = "m", // Default display unit
  ) {
    this._components = components;
    this.world = world;
    this._material = data.lineMaterial;
    this._rounding = rounding; // Initialize rounding
    this._units = units; // Initialize units

    this.line = data.line;
    this.startNormal = data.startNormal ?? null;
    this.rectangleComponentLines = [new Line(), new Line()];
    this.updateRectangleComponents();
    this.updateProjectionComponents();

    this.lineElement = this.createLine(data);

    this._endpoints.onItemAdded.add((mark) => {
      this._root.add(mark.three);
      const position =
        this._endpoints.size === 1 ? this.line.start : this.line.end;
      mark.three.position.copy(position);
    });

    this._endpoints.onBeforeDelete.add((mark) => mark.dispose());

    this.createEndpoints();

    for (const endpoint of this._endpoints) {
      endpoint.three.element.style.borderColor = `#${data.lineMaterial.color.getHexString()}`;
    }

    this.label = this.newText();
    this.label.three.element.style.backgroundColor = `#${data.lineMaterial.color.getHexString()}`;
    this.label.three.renderOrder = 1;
    this._root.renderOrder = 2;
    this.world.scene.three.add(this._root);

    this.setupEvents();
  }

  private setupEvents() {
    this.rectangleDimensions.onBeforeDelete.add((dimension) =>
      dimension.dispose(),
    );

    this.projectionDimensions.onBeforeDelete.add((dimension) =>
      dimension.dispose(),
    );
  }

  /**
   * Disposes of the dimension line and its associated resources.
   * This method should be called when the dimension line is no longer needed.
   * It removes the dimension line from the world, destroys its components, and frees up memory.
   */
  dispose() {
    this.visible = false;
    const disposer = this._components.get(OBC.Disposer);
    disposer.destroy(this._root);
    disposer.destroy(this.lineElement);
    this._endpoints.clear();
    this.label.dispose();
    if (this.boundingBox) {
      disposer.destroy(this.boundingBox);
    }
    this.rectangleDimensions.clear();
    this.projectionDimensions.clear();
    (this._components as any) = null;
  }

  applyPlanesVisibility(planes: THREE.Plane[]) {
    // Using wasVisible prevents showing labels that were hidden before

    for (const endpoint of this._endpoints) {
      if (!endpoint.wasVisible) continue;
      let isBehind = false;
      for (const plane of planes) {
        if (plane.distanceToPoint(endpoint.three.position) < 0) {
          isBehind = true;
          break;
        }
      }
      endpoint.three.visible = !isBehind;
    }

    // Check if label (measurement mark) is behind any plane

    if (this.label.wasVisible) {
      let labelIsBehind = false;
      const labelPos = this.label.three.position;
      for (const plane of planes) {
        if (plane.distanceToPoint(labelPos) < 0) {
          labelIsBehind = true;
          break;
        }
      }
      this.label.three.visible = !labelIsBehind;
    }
  }

  /**
   * Creates a bounding box for the dimension line.
   * The bounding box is a 3D box that encloses the dimension line.
   * It is used for collision detection and visibility culling.
   * The bounding box is initially invisible and can be toggled using the `toggleBoundingBox` method.
   */
  createBoundingBox() {
    const center = new THREE.Vector3();
    this.line.getCenter(center);
    const length = this.line.distance();
    this.boundingBox.geometry = new THREE.BoxGeometry(1, 1, length);
    this.boundingBox.position.copy(center);
    this.boundingBox.lookAt(this.line.end);
    this.boundingBox.visible = false;
    this._root.add(this.boundingBox);
  }

  private _latestRectangularInversion = false;

  invertRectangularDimensions() {
    if (this.rectangleDimensions.size === 0) return;
    this.rectangleDimensions.clear();
    this._latestRectangularInversion = !this._latestRectangularInversion;
    this.updateRectangleComponents(this._latestRectangularInversion);
    this.displayRectangularDimensions();
  }

  displayRectangularDimensions() {
    this.rectangleDimensions.clear();
    for (const line of this.rectangleComponentLines) {
      const dimension = new DimensionLine(this._components, this.world, {
        line,
        lineMaterial: this._componentsMaterial,
        endpointElement: this.endpointElement,
      });

      dimension.lineElement.computeLineDistances();
      this.rectangleDimensions.add(dimension);
    }
  }

  displayProjectionDimensions() {
    this.projectionDimensions.clear();
    for (const line of this.projectionComponentLines) {
      const dimension = new DimensionLine(this._components, this.world, {
        line,
        lineMaterial: this._componentsMaterial,
        endpointElement: this.endpointElement,
      });

      dimension.lineElement.computeLineDistances();
      this.projectionDimensions.add(dimension);
    }
  }

  private _endpointElement: HTMLElement = newEndPoint();
  set endpointElement(value: HTMLElement) {
    for (const dimension of this.rectangleDimensions) {
      dimension.endpointElement = value;
    }
    for (const dimension of this.projectionDimensions) {
      dimension.endpointElement = value;
    }
    this._endpointElement = value;
    this.createEndpoints();
  }

  get endpointElement() {
    return this._endpointElement;
  }

  private createEndpoints() {
    this._endpoints.clear();
    const startMarker = new Mark(this.world, this._endpointElement);
    const endMarker = new Mark(
      this.world,
      this._endpointElement.cloneNode(true) as HTMLElement,
    );
    this._endpoints.add(startMarker, endMarker);
  }

  private updateProjectionComponents() {
    if (!this.startNormal) return;

    const plane = new THREE.Plane().setFromNormalAndCoplanarPoint(
      this.startNormal,
      this.line.start,
    );

    const projected = new THREE.Vector3();
    plane.projectPoint(this.line.end, projected);

    let [line] = this.projectionComponentLines;
    if (!line) {
      line = new Line();
      this.projectionComponentLines.push(line);
    }

    line.set(this.line.end, projected);

    if (line.distance() < 0.01) {
      this.projectionComponentLines.shift();
    }

    for (const dimension of this.projectionDimensions) {
      if (!dimension) continue;
      dimension.update();
    }
  }

  private updateRectangleComponents(invert = false) {
    const start = invert ? this.line.end : this.line.start;
    const end = invert ? this.line.start : this.line.end;
    const direction = new THREE.Vector3();
    direction.subVectors(end, start);

    const deltaY = Math.abs(end.y - start.y);

    if (deltaY >= 0.1) {
      direction.y = 0;
    } else {
      direction.x = 0;
    }

    const position = start.clone().add(direction);

    const [lineA, lineB] = this.rectangleComponentLines;
    lineA.set(position, start);
    lineB.set(position, end);

    for (const dimension of this.rectangleDimensions) {
      dimension.update();
    }
  }

  updateLabel() {
    this.label.three.element.textContent = this.getTextContent();
    const center = new THREE.Vector3();
    this.line.getCenter(center);
    this.label.three.position.copy(center);
  }

  private updateGeometry() {
    this.updateRectangleComponents();
    this.updateProjectionComponents();
    [...this._endpoints][0].three.position.copy(this.line.start);
    [...this._endpoints][1].three.position.copy(this.line.end);
    this.lineElement.geometry.computeBoundingSphere();
  }

  update() {
    this.updateGeometry();
    this.updateLabel();
  }

  private _material;

  set material(value: THREE.LineBasicMaterial) {
    this._material.dispose();
    this._material = value;
    this.lineElement.material = value;
  }

  get material() {
    return this._material;
  }

  private _componentsMaterial: THREE.LineBasicMaterial =
    new THREE.LineDashedMaterial({
      depthTest: false,
      gapSize: 0.2,
      dashSize: 0.2,
      transparent: true,
      opacity: 0.5,
      color: 0x2e2e2e,
    });

  private createLine(data: DimensionData) {
    const axisGeom = new THREE.BufferGeometry();
    axisGeom.setFromPoints([data.line.start, data.line.end]);
    const line = new THREE.Line(axisGeom, data.lineMaterial);
    this._root.add(line);
    return line;
  }

  private newText() {
    const htmlText = newDimensionMark();
    htmlText.textContent = this.getTextContent();
    const label = new Mark(this.world, htmlText);
    const center = new THREE.Vector3();
    this.line.getCenter(center);
    label.three.position.copy(center);
    this._root.add(label.three);
    return label;
  }

  valueFormatter: ((value: number) => string) | null = null;

  private getTextContent(value = this.line.distance()) {
    // Convert the length from the world unit to the display unit
    // const utils = this._components.get(OBC.MeasurementUtils);
    const convertedValue = OBC.MeasurementUtils.convertUnits(
      value,
      "m",
      this._units,
      this.rounding,
    );

    const formattedValue = Measurement.valueFormatter
      ? Measurement.valueFormatter(convertedValue)
      : convertedValue.toFixed(this.rounding);

    // Format the converted value with the display unit
    return `${formattedValue} ${this._units}`;
  }

  set color(color: THREE.Color) {
    const hexColor = `#${color.getHexString()}`;
    this.label.three.element.style.backgroundColor = hexColor;
    for (const endpoint of this._endpoints) {
      endpoint.three.element.style.borderColor = hexColor;
    }
    this._material.color.set(color);
  }
}
