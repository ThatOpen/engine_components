import * as THREE from "three";
import { SimpleDimensionLine } from "./simple-dimension-line";
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
import { SimpleRaycaster } from "../SimpleRaycaster";
import { Button } from "../../ui/ButtonComponent";
import { VertexPicker } from "../../utils/VertexPicker";

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
  readonly afterCreate = new Event<SimpleDimensionLine>();

  /** {@link Createable.beforeCreate} */
  readonly beforeCreate = new Event<SimpleDimensions>();

  /** {@link Createable.afterDelete} */
  readonly afterDelete = new Event<SimpleDimensions>();

  /** {@link Createable.beforeDelete} */
  readonly beforeDelete = new Event<SimpleDimensionLine>();

  uiElement: Button;

  /** The minimum distance to force the dimension cursor to a vertex. */
  snapDistance = 0.25;

  /** The [symbol](https://threejs.org/docs/#examples/en/renderers/CSS2DRenderer)
   * that is displayed where the dimension will be drawn. */
  previewElement?: HTMLElement;

  private _vertexPicker: VertexPicker;

  private _lineMaterial = new THREE.LineBasicMaterial({
    color: "#DC2626",
    linewidth: 2,
    depthTest: false,
  });

  private _dimensions: SimpleDimensionLine[] = [];
  private _visible = true;
  private _enabled = false;
  private _raycaster: SimpleRaycaster;

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
  set enabled(value: boolean) {
    if (!value) {
      this.cancelDrawing();
    }
    this._enabled = value;
    this._vertexPicker.enabled = value;
    this.uiElement.active = value;
  }

  /** {@link Hideable.visible} */
  get visible() {
    return this._visible;
  }

  /** {@link Hideable.visible} */
  set visible(value: boolean) {
    this._visible = value;
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
    this._lineMaterial.color = color;
  }

  constructor(private _components: Components) {
    super();
    this._raycaster = new SimpleRaycaster(this._components);
    this._vertexPicker = new VertexPicker(_components, {
      previewElement: this.newEndpoint(),
      snapDistance: this.snapDistance,
    });
    this.uiElement = new Button(this._components, {
      materialIconName: "straighten",
    });
    this.setUI();
  }

  private setUI() {
    const viewerContainer = this._components.renderer.get().domElement
      .parentElement as HTMLElement;
    const createDimension = () => this.create();
    this.uiElement.onclick = () => {
      if (!this.enabled) {
        viewerContainer.addEventListener("click", createDimension);
        this.uiElement.active = true;
        this.enabled = true;
      } else {
        this.enabled = false;
        this.uiElement.active = false;
        viewerContainer.removeEventListener("click", createDimension);
      }
    };
    this.uiElement.active = this.enabled;
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
    this._vertexPicker.dispose();
  }

  /** {@link Updateable.update} */
  update(_delta: number) {
    if (this._enabled) {
      this.beforeUpdate.trigger(this);
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
    this.beforeCreate.trigger(this);
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
      this.afterDelete.trigger(this);
    }
  }

  /** Deletes all the dimensions that have been previously created. */
  deleteAll() {
    this._dimensions.forEach((dim) => {
      dim.dispose();
      this.afterDelete.trigger(this);
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
    const point = this._vertexPicker.get();
    if (!(intersects && point)) return;
    this._temp.isDragging = true;
    this._temp.start = plane ? intersects.point : point;
  }

  private drawInProcess() {
    const intersects = this._raycaster.castRay();
    if (!intersects) return;
    const found = this._vertexPicker.get();
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
    this.afterCreate.trigger(this._temp.dimension);
    this._temp.dimension = undefined;
    this._temp.isDragging = false;
  }

  private drawDimension() {
    return new SimpleDimensionLine(this._components, {
      start: this._temp.start,
      end: this._temp.end,
      lineMaterial: this._lineMaterial,
      endpointElement: this.newEndpoint(),
    });
  }

  private newEndpoint() {
    const element = document.createElement("div");
    element.className = "w-2 h-2 bg-red-600 rounded-full";
    return element;
  }

  private getBoundingBoxes() {
    return this._dimensions
      .map((dim) => dim.boundingBox)
      .filter((box) => box !== undefined) as THREE.Mesh[];
  }
}

export * from "./simple-dimension-line";
export * from "./types";
