import * as THREE from "three";
import * as OBC from "@thatopen/components";

import { AreaMeasureElement } from "./src";
import { GraphicVertexPicker } from "../../utils";

export class AreaMeasurement
  extends OBC.Component
  implements OBC.Createable, OBC.Disposable
{
  static readonly uuid = "c453a99e-f054-4781-9060-33df617db4a5" as const;

  readonly onDisposed = new OBC.Event();

  list: AreaMeasureElement[] = [];

  world?: OBC.World;

  private _enabled: boolean = false;

  private _vertexPicker: GraphicVertexPicker;

  private _currentAreaElement: AreaMeasureElement | null = null;

  private _clickCount: number = 0;

  set enabled(value: boolean) {
    this._enabled = value;
    this._vertexPicker.enabled = value;
    this.setupEvents(value);
    if (!value) {
      this.cancelCreation();
    }
  }

  get enabled() {
    return this._enabled;
  }

  set workingPlane(plane: THREE.Plane | null) {
    this._vertexPicker.workingPlane = plane;
  }

  get workingPlane() {
    return this._vertexPicker.workingPlane;
  }

  constructor(components: OBC.Components) {
    super(components);
    this.components.add(AreaMeasurement.uuid, this);
    this._vertexPicker = new GraphicVertexPicker(components);
  }

  dispose() {
    this.setupEvents(false);

    this._vertexPicker.dispose();
    if (this._currentAreaElement) {
      this._currentAreaElement.dispose();
    }
    for (const measure of this.list) {
      measure.dispose();
    }
    (this.components as any) = null;
    this.onDisposed.trigger(AreaMeasurement.uuid);
    this.onDisposed.reset();
  }

  create = () => {
    if (!this.enabled) return;
    if (!this.world) {
      throw new Error("World not defined for the area measurement!");
    }

    const point = this._vertexPicker.get(this.world);

    if (!point) return;
    if (!this._currentAreaElement) {
      const areaShape = new AreaMeasureElement(this.components, this.world);
      areaShape.onPointAdded.add(() => {
        if (this._clickCount === 3 && !areaShape.workingPlane) {
          areaShape.computeWorkingPlane();
          this._vertexPicker.workingPlane = areaShape.workingPlane;
        }
      });
      areaShape.onPointRemoved.add(() => this._clickCount--);
      this._currentAreaElement = areaShape;
    }
    this._currentAreaElement.setPoint(point, this._clickCount);
    this._currentAreaElement.computeArea();
    this._clickCount++;
  };

  delete() {}

  /** Deletes all the dimensions that have been previously created. */
  deleteAll() {
    for (const dim of this.list) {
      dim.dispose();
    }
    this.list = [];
  }

  endCreation() {
    if (this._currentAreaElement) {
      this.list.push(this._currentAreaElement);
      this._currentAreaElement.removePoint(this._clickCount);
      this._currentAreaElement.computeWorkingPlane();
      this._currentAreaElement.computeArea();
      this._currentAreaElement = null;
    }
    this._vertexPicker.workingPlane = null;
    this._clickCount = 0;
  }

  cancelCreation() {
    if (this._currentAreaElement) {
      this._currentAreaElement.dispose();
      this._currentAreaElement = null;
    }
    this._vertexPicker.workingPlane = null;
    this._clickCount = 0;
  }

  private setupEvents(active: boolean) {
    if (!this.world) {
      throw new Error("The area measurement needs a world to work!");
    }

    if (this.world.isDisposing) {
      return;
    }

    if (!this.world.renderer) {
      throw new Error("The world of the area measurement needs a renderer!");
    }
    const canvas = this.world.renderer.three.domElement;
    const viewerContainer = canvas.parentElement as HTMLElement;
    if (active) {
      viewerContainer.addEventListener("click", this.create);
      viewerContainer.addEventListener("mousemove", this.onMouseMove);
      window.addEventListener("keydown", this.onKeydown);
    } else {
      viewerContainer.removeEventListener("click", this.create);
      viewerContainer.removeEventListener("mousemove", this.onMouseMove);
      window.removeEventListener("keydown", this.onKeydown);
    }
  }

  private onMouseMove = () => {
    if (!this.world) {
      console.log("No world given for the area measurement!");
      return;
    }
    const point = this._vertexPicker.get(this.world);
    if (!(point && this._currentAreaElement)) return;
    this._currentAreaElement.setPoint(point, this._clickCount);
    this._currentAreaElement.computeArea();
  };

  private onKeydown = (e: KeyboardEvent) => {
    if (!this.enabled) return;
    if (e.key === "z" && e.ctrlKey && this._currentAreaElement)
      this._currentAreaElement.removePoint(this._clickCount - 1);
    if (e.key === "Enter" && this._currentAreaElement) this.endCreation();
    if (e.key === "Escape") {
      if (this._clickCount === 0 && !this._currentAreaElement) {
        this.enabled = false;
      } else {
        this.cancelCreation();
      }
    }
  };
}
