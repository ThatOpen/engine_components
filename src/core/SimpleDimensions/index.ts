import * as THREE from "three";
import { CSS2DObject } from "three/examples/jsm/renderers/CSS2DRenderer";
import { SimpleDimensionLine } from "./simple-dimension-line";
import { DimensionPreviewClassName } from "./types";
import {
  Component,
  Createable,
  Disposable,
  Hideable,
  Updateable,
  Event,
  UI,
} from "../../base-types";
import { Components } from "../Components";
import { Disposer } from "../Disposer";
import { SimpleRaycaster } from "../SimpleRaycaster";
import { Button } from "../../ui";

/**
 * A basic dimension tool to measure distances between 2 points in 3D and
 * display a 3D symbol displaying the numeric value.
 */
export class SimpleDimensions
  extends Component<SimpleDimensionLine[]>
  implements Createable, Hideable, Disposable, Updateable, UI
{
  /** {@link Component.name} */
  readonly name = "SimpleDimensions";

  /** {@link Updateable.beforeUpdate} */
  readonly beforeUpdate = new Event<SimpleDimensions>();

  /** {@link Updateable.afterUpdate} */
  readonly afterUpdate = new Event<SimpleDimensions>();

  /** {@link Createable.afterCreate} */
  readonly afterCreate = new Event<SimpleDimensions>();

  /** {@link Createable.beforeCreate} */
  readonly beforeCreate = new Event<SimpleDimensions>();

  /** {@link Createable.afterDelete} */
  readonly afterDelete = new Event<SimpleDimensions>();

  /** {@link Createable.beforeDelete} */
  readonly beforeDelete = new Event<SimpleDimensions>();

  /** {@link Createable.onCreate} */
  onCreate: Event<SimpleDimensionLine> = new Event<SimpleDimensionLine>();

  /** {@link Createable.onDelete} */
  onDelete: Event<SimpleDimensionLine> = new Event<SimpleDimensionLine>();

  uiElement!: Button;

  /** The minimum distance to force the dimension cursor to a vertex. */
  snapDistance = 0.25;

  /** The [symbol](https://threejs.org/docs/#examples/en/renderers/CSS2DRenderer)
   * that is displayed where the dimension will be drawn. */
  previewElement: CSS2DObject;

  private _lineMaterial = new THREE.LineDashedMaterial({
    color: 0x000000,
    linewidth: 2,
    depthTest: false,
    dashSize: 0.2,
    gapSize: 0.2,
  });

  private _endpointMesh: THREE.Mesh<
    THREE.BufferGeometry,
    THREE.MeshBasicMaterial
  >;

  private _dimensions: SimpleDimensionLine[] = [];
  private _visible = true;
  private _enabled = false;
  private _raycaster: SimpleRaycaster;
  private _disposer = new Disposer();

  /** Temporary variables for internal operations */
  private _temp = {
    isDragging: false,
    start: new THREE.Vector3(),
    end: new THREE.Vector3(),
    dimension: undefined as SimpleDimensionLine | undefined,
  };

  /** {@link Component.enabled} */
  get enabled() {
    return this._enabled;
  }

  /** {@link Component.enabled} */
  set enabled(state: boolean) {
    if (!state) {
      this.cancelDrawing();
    }
    this._enabled = state;
    this.uiElement.active = state;
    this.previewVisible = state;
  }

  /** {@link Hideable.visible} */
  get visible() {
    return this._visible;
  }

  /** {@link Hideable.visible} */
  set visible(state: boolean) {
    this._visible = state;
    if (!this._visible) {
      this.enabled = false;
    }
    for (const dimension of this._dimensions) {
      dimension.visible = this._visible;
    }
  }

  /**
   * The [Color](https://threejs.org/docs/#api/en/math/Color)
   * of the geometry of the dimensions.
   */
  set color(color: THREE.Color) {
    this._endpointMesh.material.color = color;
    this._lineMaterial.color = color;
  }

  /** The geometry used in both endpoints of all the dimensions. */
  get geometry() {
    return this._endpointMesh.geometry;
  }

  /** The geometry used in both endpoints of all the dimensions. */
  set geometry(geometry: THREE.BufferGeometry) {
    this._endpointMesh.geometry = geometry;
    for (const dim of this._dimensions) {
      dim.geometry = geometry;
    }
  }

  private set previewVisible(state: boolean) {
    const scene = this._components.scene?.get();
    if (state) {
      scene.add(this.previewElement);
    } else {
      this.previewElement.removeFromParent();
    }
  }

  constructor(private _components: Components) {
    super();
    this._raycaster = new SimpleRaycaster(this._components);
    this._endpointMesh = this.newEndpointMesh();
    const htmlPreview = document.createElement("div");
    htmlPreview.className = DimensionPreviewClassName;
    this.previewElement = new CSS2DObject(htmlPreview);
    this.previewElement.visible = false;
    this.setUI();
  }

  private setUI() {
    const button = new Button(this._components, {
      materialIconName: "straighten",
    });
    const viewerContainer = this._components.renderer.get().domElement
      .parentElement as HTMLElement;
    const createDimension = () => this.create();
    button.onclick = () => {
      if (!this.enabled) {
        viewerContainer.addEventListener("click", createDimension);
        button.active = true;
        this.enabled = true;
      } else {
        this.enabled = false;
        button.active = false;
        viewerContainer.removeEventListener("click", createDimension);
      }
    };
    button.active = this.enabled;
    this.uiElement = button;
    window.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && this.enabled) {
        if (this._temp.isDragging) {
          this.cancelDrawing();
        } else {
          this.enabled = false;
        }
      }
    });
  }

  /** {@link Component.get} */
  get(): SimpleDimensionLine[] {
    return this._dimensions;
  }

  /** {@link Disposable.dispose} */
  dispose() {
    this.enabled = false;
    this._dimensions.forEach((dim) => dim.dispose());
    this._dimensions = [];
    this._disposer.dispose(this._endpointMesh);
    this._endpointMesh.removeFromParent();
    this.previewElement.removeFromParent();
    this.previewElement.element.remove();
  }

  /** {@link Updateable.update} */
  update(_delta: number) {
    if (this._enabled) {
      this.beforeUpdate.trigger(this);
      const intersects = this._raycaster.castRay();
      this.previewElement.visible = !!intersects;
      if (!intersects) return;
      this.previewElement.visible = true;
      const closest = this.getClosestVertex(intersects);
      this.previewElement.visible = !!closest;
      if (!closest) return;
      this.previewElement.position.set(closest.x, closest.y, closest.z);
      if (this._temp.isDragging) {
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
    if (!this._temp.isDragging) {
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
    const dimension = this._dimensions.find(
      (dim) => dim.boundingBox === intersect.object
    );
    if (dimension) {
      const index = this._dimensions.indexOf(dimension);
      this._dimensions.splice(index, 1);
      dimension.dispose();
      this.onDelete.trigger(dimension);
    }
  }

  /** Deletes all the dimensions that have been previously created. */
  deleteAll() {
    this._dimensions.forEach((dim) => {
      dim.dispose();
      this.onDelete.trigger(dim);
    });
    this._dimensions = [];
  }

  /** Cancels the drawing of the current dimension. */
  cancelDrawing() {
    if (!this._temp.dimension) return;
    this._temp.isDragging = false;
    this._temp.dimension?.dispose();
    this._temp.dimension = undefined;
  }

  private drawStart(plane?: THREE.Object3D) {
    const items = plane ? [plane as THREE.Mesh] : undefined;
    const intersects = this._raycaster.castRay(items);
    if (!intersects) return;
    this._temp.isDragging = true;
    this._temp.start = plane
      ? intersects.point
      : this.getClosestVertex(intersects);
  }

  private drawInProcess() {
    const intersects = this._raycaster.castRay();
    if (!intersects) return;
    const found = this.getClosestVertex(intersects);
    if (!found) return;
    this._temp.end = found;
    if (!this._temp.dimension) {
      this._temp.dimension = this.drawDimension();
    }
    this._temp.dimension.endPoint = this._temp.end;
  }

  private drawEnd() {
    if (!this._temp.dimension) return;
    this._temp.dimension.createBoundingBox();
    this._dimensions.push(this._temp.dimension);
    this._temp.dimension = undefined;
    this._temp.isDragging = false;
    this.onCreate.trigger(this._temp.dimension);
  }

  private newEndpointMesh() {
    const geometry = SimpleDimensions.getDefaultEndpointGeometry();
    const material = new THREE.MeshBasicMaterial({
      color: 0x000000,
      depthTest: false,
    });
    return new THREE.Mesh(geometry, material);
  }

  private drawDimension() {
    return new SimpleDimensionLine(this._components, {
      start: this._temp.start,
      end: this._temp.end,
      lineMaterial: this._lineMaterial,
      endpoint: this._endpointMesh,
    });
  }

  private getBoundingBoxes() {
    return this._dimensions
      .map((dim) => dim.boundingBox)
      .filter((box) => box !== undefined) as THREE.Mesh[];
  }

  private static getDefaultEndpointGeometry(height = 0.4, radius = 0.1) {
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
    ].map((vertex) => vertex?.applyMatrix4(mesh.matrixWorld));
  }

  private static getVertex(index: number, geom: THREE.BufferGeometry) {
    if (index === undefined) return null;
    const vertices = geom.attributes.position as THREE.BufferAttribute;
    return new THREE.Vector3(
      vertices.getX(index),
      vertices.getY(index),
      vertices.getZ(index)
    );
  }
}

export * from "./simple-dimension-line";
export * from "./types";
