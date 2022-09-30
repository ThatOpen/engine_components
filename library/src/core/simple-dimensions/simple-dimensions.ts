import * as THREE from "three";
import { CSS2DObject } from "three/examples/jsm/renderers/CSS2DRenderer";
import { Hideable } from "../base-types";
import { Components } from "../../components";
import { SimpleDimensionLine } from "./simple-dimension-line";
import { Component } from "../base-components";
import { SimpleRaycaster } from "../simple-raycaster";

/**
 * A basic dimension tool to measure distances between 2 points in 3D and
 * display a 3D symbol displaying the numeric value.
 */
export class SimpleDimensions
  extends Component<SimpleDimensionLine[]>
  implements Hideable
{
  /** {@link Component.name} */
  readonly name = "SimpleDimensions";

  /** The minimum distance to force the dimension cursor to a vertex. */
  snapDistance = 0.25;

  /** The name of the CSS class that styles the dimension label. */
  readonly labelClassName = "ifcjs-dimension-label";

  /** The name of the CSS class that styles the dimension label. */
  readonly previewClassName = "ifcjs-dimension-preview";

  protected _lineMaterial = new THREE.LineDashedMaterial({
    color: 0x000000,
    linewidth: 2,
    depthTest: false,
    dashSize: 0.2,
    gapSize: 0.2,
  });

  protected _endpointsMaterial = new THREE.MeshBasicMaterial({
    color: 0x000000,
    depthTest: false,
  });

  protected _visible = false;
  protected _enabled = false;
  protected _preview = false;
  protected _dragging = false;
  protected _baseScale = new THREE.Vector3(1, 1, 1);
  protected endpoint: THREE.BufferGeometry;
  protected previewElement: CSS2DObject;
  protected startPoint = new THREE.Vector3();
  protected endPoint = new THREE.Vector3();
  protected raycaster: SimpleRaycaster;
  protected _dimensions: SimpleDimensionLine[] = [];
  protected _currentDimension?: SimpleDimensionLine;

  constructor(public components: Components) {
    super();
    this.raycaster = new SimpleRaycaster(this.components);
    this.endpoint = SimpleDimensions.getDefaultEndpointGeometry();
    const htmlPreview = document.createElement("div");
    htmlPreview.className = this.previewClassName;
    this.previewElement = new CSS2DObject(htmlPreview);
    this.previewElement.visible = false;
  }

  get(): SimpleDimensionLine[] {
    return this._dimensions;
  }

  dispose() {
    (this.components as any) = null;
    this._dimensions.forEach((dim) => dim.dispose());
    (this._dimensions as any) = null;
    (this._currentDimension as any) = null;
    this.endpoint.dispose();
    (this.endpoint as any) = null;

    this.previewElement.removeFromParent();
    this.previewElement.element.remove();
    (this.previewElement as any) = null;
  }

  update(_delta: number) {
    if (this._enabled && this._preview) {
      const intersects = this.raycaster.castRay();
      this.previewElement.visible = !!intersects;
      if (!intersects) return;
      this.previewElement.visible = true;
      const closest = this.getClosestVertex(intersects);
      this.previewElement.visible = !!closest;
      if (!closest) return;
      this.previewElement.position.set(closest.x, closest.y, closest.z);
      if (this._dragging) {
        this.drawInProcess();
      }
    }
  }

  setArrow(height: number, radius: number) {
    this.endpoint = SimpleDimensions.getDefaultEndpointGeometry(height, radius);
  }

  setPreviewElement(element: HTMLElement) {
    this.previewElement = new CSS2DObject(element);
  }

  get enabled() {
    return this._enabled;
  }

  set enabled(state: boolean) {
    this._enabled = state;
    this.previewActive = state;
    if (!this.visible && state) {
      this.visible = true;
    }
  }

  get previewActive() {
    return this._preview;
  }

  get previewObject() {
    return this.previewElement;
  }

  get visible() {
    return this._visible;
  }

  set visible(state: boolean) {
    this._visible = state;
    if (this.enabled && !state) {
      this.enabled = false;
    }
    this._dimensions.forEach((dim) => {
      dim.visibility = state;
    });
  }

  set dimensionsColor(color: THREE.Color) {
    this._endpointsMaterial.color = color;
    this._lineMaterial.color = color;
  }

  set dimensionsWidth(width: number) {
    this._lineMaterial.linewidth = width;
  }

  set endpointGeometry(geometry: THREE.BufferGeometry) {
    this._dimensions.forEach((dim) => {
      dim.endpointGeometry = geometry;
    });
  }

  set endpointScaleFactor(factor: number) {
    SimpleDimensionLine.scaleFactor = factor;
  }

  set endpointScale(scale: THREE.Vector3) {
    this._baseScale = scale;
    this._dimensions.forEach((dim) => {
      dim.endpointScale = scale;
    });
  }

  get getDimensionsLines() {
    return this._dimensions;
  }

  create() {
    if (!this._enabled) return;
    if (!this._dragging) {
      this.drawStart();
      return;
    }
    this.drawEnd();
  }

  createInPlane(plane: THREE.Object3D) {
    if (!this._enabled) return;
    if (!this._dragging) {
      this.drawStartInPlane(plane);
      return;
    }
    this.drawEnd();
  }

  delete() {
    if (!this._enabled || this._dimensions.length === 0) return;
    const boundingBoxes = this.getBoundingBoxes();
    const intersect = this.raycaster.castRay(boundingBoxes);
    if (!intersect) return;
    const selected = this._dimensions.find(
      (dim) => dim.boundingBox === intersect.object
    );
    if (!selected) return;
    const index = this._dimensions.indexOf(selected);
    this._dimensions.splice(index, 1);
    selected.removeFromScene();
  }

  deleteAll() {
    this._dimensions.forEach((dim) => {
      dim.removeFromScene();
    });
    this._dimensions = [];
  }

  cancelDrawing() {
    if (!this._currentDimension) return;
    this._dragging = false;
    this._currentDimension?.removeFromScene();
    this._currentDimension = undefined;
  }

  private set previewActive(state: boolean) {
    this._preview = state;
    const scene = this.components.scene?.get();
    if (!scene) throw new Error("Dimensions rely on scene to be present.");
    if (this._preview) {
      scene.add(this.previewElement);
    } else {
      scene.remove(this.previewElement);
    }
  }

  private drawStart() {
    this._dragging = true;
    const intersects = this.raycaster.castRay();
    if (!intersects) return;
    const found = this.getClosestVertex(intersects);
    if (!found) return;
    this.startPoint = found;
  }

  private drawStartInPlane(plane: THREE.Object3D) {
    this._dragging = true;
    const intersects = this.raycaster.castRay([plane as THREE.Mesh]);
    if (intersects) {
      this.startPoint = intersects.point;
    }
  }

  private drawInProcess() {
    const intersects = this.raycaster.castRay();
    if (!intersects) return;
    const found = this.getClosestVertex(intersects);
    if (!found) return;
    this.endPoint = found;
    if (!this._currentDimension) this._currentDimension = this.drawDimension();
    this._currentDimension.endPoint = this.endPoint;
  }

  private drawEnd() {
    if (!this._currentDimension) return;
    this._currentDimension.createBoundingBox();
    this._dimensions.push(this._currentDimension);
    this._currentDimension = undefined;
    this._dragging = false;
  }

  private drawDimension() {
    return new SimpleDimensionLine(
      this.components,
      this.startPoint,
      this.endPoint,
      this._lineMaterial,
      this._endpointsMaterial,
      this.endpoint,
      this.labelClassName,
      this._baseScale
    );
  }

  private getBoundingBoxes() {
    return this._dimensions
      .map((dim) => dim.boundingBox)
      .filter((box) => box !== undefined) as THREE.Mesh[];
  }

  private static getDefaultEndpointGeometry(height = 0.02, radius = 0.05) {
    const coneGeometry = new THREE.ConeGeometry(radius, height);
    coneGeometry.translate(0, -height / 2, 0);
    coneGeometry.rotateX(-Math.PI / 2);
    return coneGeometry;
  }

  private getClosestVertex(intersects: THREE.Intersection) {
    let closestVertex = new THREE.Vector3();
    let vertexFound = false;
    let closestDistance = Number.MAX_SAFE_INTEGER;
    const vertices = SimpleDimensions.getVertices(intersects);
    vertices?.forEach((vertex) => {
      if (!vertex) return;
      const distance = intersects.point.distanceTo(vertex);
      if (distance > closestDistance || distance > this.snapDistance) return;
      vertexFound = true;
      closestVertex = vertex;
      closestDistance = intersects.point.distanceTo(vertex);
    });
    return vertexFound ? closestVertex : intersects.point;
  }

  private static getVertices(intersects: THREE.Intersection) {
    const mesh = intersects.object as THREE.Mesh;
    if (!intersects.face || !mesh) return null;
    const geom = mesh.geometry;
    return [
      SimpleDimensions.getVertex(intersects.face.a, geom),
      SimpleDimensions.getVertex(intersects.face.b, geom),
      SimpleDimensions.getVertex(intersects.face.c, geom),
    ];
  }

  private static getVertex(index: number, geom: THREE.BufferGeometry) {
    if (index === undefined) return null;
    const vertices = geom.attributes.position;
    return new THREE.Vector3(
      vertices.getX(index),
      vertices.getY(index),
      vertices.getZ(index)
    );
  }
}
