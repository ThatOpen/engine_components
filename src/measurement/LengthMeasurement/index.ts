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
import { Components, SimpleRaycaster } from "../../core";
import { Button } from "../../ui";
import { VertexPicker } from "../../utils";

/**
 * A basic dimension tool to measure distances between 2 points in 3D and
 * display a 3D symbol displaying the numeric value.
 */
export class LengthMeasurement
  extends Component<SimpleDimensionLine[]>
  implements Createable, Hideable, Disposable, Updateable, UI
{
  /** {@link Component.name} */
  readonly name = "LengthMeasurement";

  /** {@link Updateable.beforeUpdate} */
  readonly beforeUpdate = new Event<LengthMeasurement>();

  /** {@link Updateable.afterUpdate} */
  readonly afterUpdate = new Event<LengthMeasurement>();

  /** {@link Createable.afterCreate} */
  readonly afterCreate = new Event<SimpleDimensionLine>();

  /** {@link Createable.beforeCreate} */
  readonly beforeCreate = new Event<LengthMeasurement>();

  /** {@link Createable.afterDelete} */
  readonly afterDelete = new Event<LengthMeasurement>();

  /** {@link Createable.beforeDelete} */
  readonly beforeDelete = new Event<SimpleDimensionLine>();

  /** {@link Createable.beforeCancel} */
  readonly beforeCancel = new Event<LengthMeasurement>();

  /** {@link Createable.afterCancel} */
  readonly afterCancel = new Event<SimpleDimensionLine>();

  uiElement: { main: Button };

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

  private _measurements: SimpleDimensionLine[] = [];
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
    if (!value) this.cancelCreation();
    this._enabled = value;
    this._vertexPicker.enabled = value;
    this.uiElement.main.active = value;
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
    for (const dimension of this._measurements) {
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
    this.uiElement = { main: new Button(this._components) };
    this.uiElement.main.materialIcon = "straighten";
    this.setUI();
    this.enabled = false;
  }

  private setUI() {
    this.uiElement.main.onclick = () => {
      if (!this.enabled) {
        this.setupEvents(true);
        this.uiElement.main.active = true;
        this.enabled = true;
      } else {
        this.enabled = false;
        this.uiElement.main.active = false;
        this.setupEvents(false);
      }
    };
  }

  /** {@link Component.get} */
  get(): SimpleDimensionLine[] {
    return this._measurements;
  }

  /** {@link Disposable.dispose} */
  dispose() {
    this.setupEvents(false);
    this.enabled = false;
    this.beforeUpdate.reset();
    this.afterUpdate.reset();
    this.beforeCreate.reset();
    this.afterCreate.reset();
    this.beforeDelete.reset();
    this.afterDelete.reset();
    this.beforeCancel.reset();
    this.afterCancel.reset();
    this.uiElement.main.dispose();
    if (this.previewElement) {
      this.previewElement.remove();
    }
    for (const measure of this._measurements) {
      measure.dispose();
    }
    this._lineMaterial.dispose();
    this._measurements = [];
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
   * @param data - forces the dimension to be drawn on a plane. Use this if you are drawing
   * dimensions in floor plan navigation.
   */
  create = (data?: any) => {
    const plane = data instanceof THREE.Object3D ? data : undefined;
    if (!this._enabled) return;
    this.beforeCreate.trigger(this);
    if (!this._temp.isDragging) {
      this.drawStart(plane);
      return;
    }
    this.endCreation();
  };

  /** Deletes the dimension that the user is hovering over with the mouse or touch event. */
  delete() {
    if (!this._enabled || this._measurements.length === 0) return;
    const boundingBoxes = this.getBoundingBoxes();
    const intersect = this._raycaster.castRay(boundingBoxes);
    if (!intersect) return;
    const dimension = this._measurements.find(
      (dim) => dim.boundingBox === intersect.object
    );
    if (dimension) {
      const index = this._measurements.indexOf(dimension);
      this._measurements.splice(index, 1);
      dimension.dispose();
      this.afterDelete.trigger(this);
    }
  }

  /** Deletes all the dimensions that have been previously created. */
  deleteAll() {
    this._measurements.forEach((dim) => {
      dim.dispose();
      this.afterDelete.trigger(this);
    });
    this._measurements = [];
  }

  /** Cancels the drawing of the current dimension. */
  cancelCreation() {
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

  endCreation() {
    if (!this._temp.dimension) return;
    this._temp.dimension.createBoundingBox();
    this._measurements.push(this._temp.dimension);
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
    return this._measurements
      .map((dim) => dim.boundingBox)
      .filter((box) => box !== undefined) as THREE.Mesh[];
  }

  private setupEvents(active: boolean) {
    const viewerContainer = this._components.ui.viewerContainer;
    if (active) {
      viewerContainer.addEventListener("click", this.create);
      window.addEventListener("keydown", this.onKeyDown);
    } else {
      viewerContainer.removeEventListener("click", this.create);
      window.removeEventListener("keydown", this.onKeyDown);
    }
  }

  private onKeyDown = (e: KeyboardEvent) => {
    if (!this.enabled) return;
    if (e.key === "Escape") {
      if (this._temp.isDragging) {
        this.cancelCreation();
      } else {
        this.enabled = false;
      }
    }
  };
}

export * from "./simple-dimension-line";
export * from "./types";
