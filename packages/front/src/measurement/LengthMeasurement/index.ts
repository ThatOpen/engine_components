import * as THREE from "three";
import * as OBC from "@thatopen/components";
import { SimpleDimensionLine } from "../SimpleDimensionLine";
import { newDimensionMark } from "../utils";
import { GraphicVertexPicker } from "../../utils";

/**
 * A basic dimension tool to measure distances between 2 points in 3D and
 * display a 3D symbol displaying the numeric value.
 */
export class LengthMeasurement
  extends OBC.Component
  implements OBC.Createable, OBC.Hideable, OBC.Disposable, OBC.Updateable
{
  static readonly uuid = "2f9bcacf-18a9-4be6-a293-e898eae64ea1" as const;

  readonly onDisposed = new OBC.Event();

  readonly onBeforeUpdate = new OBC.Event<LengthMeasurement>();

  readonly onAfterUpdate = new OBC.Event<LengthMeasurement>();

  /** The minimum distance to force the dimension cursor to a vertex. */
  snapDistance = 0.25;

  private _vertexPicker: GraphicVertexPicker;

  private _lineMaterial = new THREE.LineBasicMaterial({
    color: "#DC2626",
    linewidth: 2,
    depthTest: false,
  });

  list: SimpleDimensionLine[] = [];

  world?: OBC.World;

  private _visible = true;

  private _enabled = false;

  /** Temporary variables for internal operations */
  private _temp = {
    isDragging: false,
    start: new THREE.Vector3(),
    end: new THREE.Vector3(),
    dimension: undefined as SimpleDimensionLine | undefined,
  };

  get enabled() {
    return this._enabled;
  }

  set enabled(value: boolean) {
    if (!value) {
      this.cancelCreation();
    }
    this._enabled = value;
    this._vertexPicker.enabled = value;
    this.setupEvents(value);
  }

  get visible() {
    return this._visible;
  }

  set visible(value: boolean) {
    this._visible = value;
    for (const dimension of this.list) {
      dimension.visible = value;
    }
  }

  get color() {
    return this._lineMaterial.color;
  }

  set color(color: THREE.Color) {
    this._lineMaterial.color = color;
  }

  constructor(components: OBC.Components) {
    super(components);
    this.components.add(LengthMeasurement.uuid, this);

    this._vertexPicker = new GraphicVertexPicker(components, {
      previewElement: newDimensionMark(),
      snapDistance: this.snapDistance,
    });
  }

  /** {@link Disposable.dispose} */
  dispose() {
    this.setupEvents(false);
    this.enabled = false;
    for (const measure of this.list) {
      measure.dispose();
    }
    this._lineMaterial.dispose();
    this.list = [];
    this._vertexPicker.dispose();
    this.onDisposed.trigger(LengthMeasurement.uuid);
    this.onDisposed.reset();
  }

  async update(_delta: number) {
    if (this._enabled && this._temp.isDragging) {
      this.drawInProcess();
    }
  }

  // TODO: The data arg needs to be better defined
  /**
   * Starts or finishes drawing a new dimension line.
   *
   * @param data - forces the dimension to be drawn on a plane. Use this if you are drawing
   * dimensions in floor plan navigation.
   */
  create = (data?: any) => {
    const plane = data instanceof THREE.Object3D ? data : undefined;
    if (!this._enabled) return;
    if (!this._temp.isDragging) {
      this.drawStart(plane);
      return;
    }
    this.endCreation();
  };

  createOnPoints(p1: THREE.Vector3, p2: THREE.Vector3) {
    const dimension = this.drawDimension();
    dimension.startPoint = p1;
    dimension.endPoint = p2;
    dimension.createBoundingBox();
    this.list.push(dimension);
  }

  /** Deletes the dimension that the user is hovering over with the mouse or touch event. */
  delete() {
    if (!this.world) {
      throw new Error("World is needed for Length Measurement!");
    }
    if (!this._enabled || this.list.length === 0) return;
    const boundingBoxes = this.getBoundingBoxes();

    const casters = this.components.get(OBC.Raycasters);
    const caster = casters.get(this.world);
    const intersect = caster.castRay(boundingBoxes);

    if (!intersect) return;
    const dimension = this.list.find(
      (dim) => dim.boundingBox === intersect.object,
    );

    if (dimension) {
      const index = this.list.indexOf(dimension);
      this.list.splice(index, 1);
      dimension.dispose();
    }
  }

  async deleteMeasurement(measurement: SimpleDimensionLine) {
    if (measurement) {
      const index = this.list.indexOf(measurement);
      this.list.splice(index, 1);
      measurement.dispose();
    }
  }

  /** Deletes all the dimensions that have been previously created. */
  deleteAll() {
    for (const dim of this.list) {
      dim.dispose();
    }
    this.list = [];
  }

  /** Cancels the drawing of the current dimension. */
  cancelCreation() {
    if (!this._temp.dimension) return;
    this._temp.isDragging = false;
    this._temp.dimension?.dispose();
    this._temp.dimension = undefined;
  }

  private drawStart(plane?: THREE.Object3D) {
    if (!this.world) {
      throw new Error("The length measurement needs a world to work!");
    }
    const items = plane ? [plane as THREE.Mesh] : undefined;
    const casters = this.components.get(OBC.Raycasters);
    const caster = casters.get(this.world);
    const intersects = caster.castRay(items);
    const point = this._vertexPicker.get(this.world);
    if (!(intersects && point)) {
      return;
    }
    this._temp.isDragging = true;
    this._temp.start = plane ? intersects.point : point;
  }

  private drawInProcess() {
    if (!this.world) {
      throw new Error("The length measurement needs a world to work!");
    }
    const casters = this.components.get(OBC.Raycasters);
    const caster = casters.get(this.world);
    const intersects = caster.castRay();
    if (!intersects) return;
    const found = this._vertexPicker.get(this.world);
    if (!found) {
      return;
    }
    this._temp.end = found;
    if (!this._temp.dimension) {
      this._temp.dimension = this.drawDimension();
    }
    this._temp.dimension.endPoint = this._temp.end;
  }

  endCreation() {
    if (!this._temp.dimension) return;
    this._temp.dimension.createBoundingBox();
    this.list.push(this._temp.dimension);
    this._temp.dimension = undefined;
    this._temp.isDragging = false;
  }

  private drawDimension() {
    if (!this.world) {
      throw new Error("The length measurement needs a world to work!");
    }
    return new SimpleDimensionLine(this.components, this.world, {
      start: this._temp.start,
      end: this._temp.end,
      lineMaterial: this._lineMaterial,
      endpointElement: newDimensionMark(),
    });
  }

  private getBoundingBoxes() {
    return this.list
      .map((dim) => dim.boundingBox)
      .filter((box) => box !== undefined) as THREE.Mesh[];
  }

  private setupEvents(active: boolean) {
    if (!this.world) {
      throw new Error("The length measurement needs a world to work!");
    }
    if (this.world.isDisposing) {
      return;
    }
    if (!this.world.renderer) {
      throw new Error("The world of the length measurement needs a renderer!");
    }
    const canvas = this.world.renderer.three.domElement;
    const viewerContainer = canvas.parentElement as HTMLElement;
    if (!viewerContainer) return;

    viewerContainer.removeEventListener("mousemove", this.onMouseMove);

    if (active) {
      viewerContainer.addEventListener("mousemove", this.onMouseMove);
    }
  }

  private onMouseMove = () => {
    if (this.world) {
      this._vertexPicker.get(this.world);
    }
  };
}
