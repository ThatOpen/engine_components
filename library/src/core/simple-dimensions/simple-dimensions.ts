import * as THREE from "three";
import { CSS2DObject } from "three/examples/jsm/renderers/CSS2DRenderer";
import { Disposeable, Hideable, Updateable } from "../base-types";
import { Components } from "../../components";
import { SimpleDimensionLine } from "./simple-dimension-line";
import { Component } from "../base-components";
import { SimpleRaycaster } from "../simple-raycaster";
import { Event } from "../event";

/**
 * A basic dimension tool to measure distances between 2 points in 3D and
 * display a 3D symbol displaying the numeric value.
 */
export class SimpleDimensions
  extends Component<SimpleDimensionLine[]>
  implements Hideable, Disposeable, Updateable
{
  /** {@link Component.name} */
  readonly name = "SimpleDimensions";

  /** {@link Updateable.beforeUpdate} */
  readonly beforeUpdate = new Event<SimpleDimensions>();

  /** {@link Updateable.afterUpdate} */
  readonly afterUpdate = new Event<SimpleDimensions>();

  /** The minimum distance to force the dimension cursor to a vertex. */
  snapDistance = 0.25;

  /** The [symbol](https://threejs.org/docs/#examples/en/renderers/CSS2DRenderer)
   * that is displayed where the dimension will be drawn. */
  previewElement: CSS2DObject;

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

  // TODO: Clean this up, reduce number of parameters
  protected _visible = false;
  protected _enabled = false;
  protected _preview = false;
  protected _dragging = false;
  protected _baseScale = new THREE.Vector3(1, 1, 1);
  protected _endpointGeometry: THREE.BufferGeometry;
  protected _startPoint = new THREE.Vector3();
  protected _endPoint = new THREE.Vector3();
  protected _raycaster: SimpleRaycaster;
  protected _dimensions: SimpleDimensionLine[] = [];
  protected _currentDimension?: SimpleDimensionLine;

  /** {@link Component.enabled} */
  get enabled() {
    return this._enabled;
  }

  /** {@link Component.enabled} */
  set enabled(state: boolean) {
    this._enabled = state;
    this.previewActive = state;
    if (!this.visible && state) {
      this.visible = true;
    }
  }

  /** {@link Hideable.visible} */
  get visible() {
    return this._visible;
  }

  /** {@link Hideable.visible} */
  set visible(state: boolean) {
    this._visible = state;
    if (this.enabled && !state) {
      this.enabled = false;
    }
    this._dimensions.forEach((dim) => {
      dim.visibility = state;
    });
  }

  /**
   * The [Color](https://threejs.org/docs/#api/en/math/Color)
   * of the geometry of the dimensions.
   */
  set dimensionsColor(color: THREE.Color) {
    this._endpointsMaterial.color = color;
    this._lineMaterial.color = color;
  }

  /** The width of the line of the dimensions. */
  set dimensionsWidth(width: number) {
    this._lineMaterial.linewidth = width;
  }

  /** The geometry used in both endpoints of all the dimensions. */
  get endpointGeometry() {
    return this._endpointGeometry;
  }

  /** The geometry used in both endpoints of all the dimensions. */
  set endpointGeometry(geometry: THREE.BufferGeometry) {
    this._endpointGeometry = geometry;
    for (const dim of this._dimensions) {
      dim.endpointGeometry = geometry;
    }
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

  constructor(public components: Components) {
    super();
    this._raycaster = new SimpleRaycaster(this.components);
    this._endpointGeometry = SimpleDimensions.getDefaultEndpointGeometry();
    const htmlPreview = document.createElement("div");
    htmlPreview.className = this.previewClassName;
    this.previewElement = new CSS2DObject(htmlPreview);
    this.previewElement.visible = false;
  }

  /** {@link Component.get} */
  get(): SimpleDimensionLine[] {
    return this._dimensions;
  }

  /** {@link Disposeable.dispose} */
  dispose() {
    (this.components as any) = null;
    this._dimensions.forEach((dim) => dim.dispose());
    (this._dimensions as any) = null;
    (this._currentDimension as any) = null;
    this._endpointGeometry.dispose();
    (this._endpointGeometry as any) = null;

    this.previewElement.removeFromParent();
    this.previewElement.element.remove();
    (this.previewElement as any) = null;
  }

  /** {@link Updateable.update} */
  update(_delta: number) {
    if (this._enabled && this._preview) {
      this.beforeUpdate.trigger(this);
      const intersects = this._raycaster.castRay();
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
      this.afterUpdate.trigger(this);
    }
  }

  /**
   * Starts or finishes drawing a new dimension line.
   *
   * @param plane - forces the dimension to be drawn on a plane. Use this if you are drawing
   * dimensions in floor plan navigation.
   */
  create(plane?: THREE.Object3D) {
    if (!this._enabled) return;
    if (!this._dragging) {
      this.drawStart(plane);
      return;
    }
    this.drawEnd();
  }

  /** Deletes the dimension that the user is hovering over with the mouse or touch event. */
  delete() {
    if (!this._enabled || this._dimensions.length === 0) return;
    const boundingBoxes = this.getBoundingBoxes();
    const intersect = this._raycaster.castRay(boundingBoxes);
    if (!intersect) return;
    const selected = this._dimensions.find(
      (dim) => dim.boundingBox === intersect.object
    );
    if (!selected) return;
    const index = this._dimensions.indexOf(selected);
    this._dimensions.splice(index, 1);
    selected.removeFromScene();
  }

  /** Deletes all the dimensions that have been previously created. */
  deleteAll() {
    this._dimensions.forEach((dim) => {
      dim.removeFromScene();
    });
    this._dimensions = [];
  }

  /** Cancels the drawing of the current dimension. */
  cancelDrawing() {
    if (!this._currentDimension) return;
    this._dragging = false;
    this._currentDimension?.removeFromScene();
    this._currentDimension = undefined;
  }

  private drawStart(plane?: THREE.Object3D) {
    const items = plane ? [plane as THREE.Mesh] : undefined;
    const intersects = this._raycaster.castRay(items);
    if (!intersects) return;
    this._dragging = true;
    this._startPoint = plane
      ? intersects.point
      : this.getClosestVertex(intersects);
  }

  private drawInProcess() {
    const intersects = this._raycaster.castRay();
    if (!intersects) return;
    const found = this.getClosestVertex(intersects);
    if (!found) return;
    this._endPoint = found;
    if (!this._currentDimension) this._currentDimension = this.drawDimension();
    this._currentDimension.endPoint = this._endPoint;
  }

  private drawEnd() {
    if (!this._currentDimension) return;
    this._currentDimension.createBoundingBox();
    this._dimensions.push(this._currentDimension);
    this._currentDimension = undefined;
    this._dragging = false;
  }

  // TODO: Clean up this constructor by wrapping everything inside an object
  private drawDimension() {
    return new SimpleDimensionLine(
      this.components,
      this._startPoint,
      this._endPoint,
      this._lineMaterial,
      this._endpointsMaterial,
      this._endpointGeometry,
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
