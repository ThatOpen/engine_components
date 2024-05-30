import * as THREE from "three";
import * as OBC from "@thatopen/components";
import { LineMaterial } from "three/examples/jsm/lines/LineMaterial.js";
import { AngleMeasureElement } from "./src";
import { GraphicVertexPicker } from "../../utils";

// TODO: Make appearance customizable?

export class AngleMeasurement
  extends OBC.Component
  implements OBC.Createable, OBC.Disposable
{
  static readonly uuid = "622fb2c9-528c-4b0a-8a0e-6a1375f0a3aa" as const;

  readonly onDisposed = new OBC.Event();

  world?: OBC.World;

  list: AngleMeasureElement[] = [];

  private _lineMaterial: LineMaterial;

  private _enabled = false;

  private _vertexPicker: GraphicVertexPicker;

  private _currentAngleElement: AngleMeasureElement | null = null;

  private _clickCount: number = 0;

  set lineMaterial(material: LineMaterial) {
    this._lineMaterial.dispose();
    this._lineMaterial = material;
    this._lineMaterial.resolution.set(window.innerWidth, window.innerHeight);
  }

  get lineMaterial() {
    return this._lineMaterial;
  }

  set enabled(value: boolean) {
    this._enabled = value;
    this.setupEvents(value);
    this._vertexPicker.enabled = value;
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
    this.components.add(AngleMeasurement.uuid, this);
    this._vertexPicker = new GraphicVertexPicker(components);
    this._lineMaterial = new LineMaterial({
      color: 0x6528d7,
      linewidth: 2,
    });
  }

  dispose() {
    this.setupEvents(false);
    this._lineMaterial.dispose();
    this._vertexPicker.dispose();
    for (const measure of this.list) {
      measure.dispose();
    }
    if (this._currentAngleElement) {
      this._currentAngleElement.dispose();
    }
    (this.components as any) = null;
    this.onDisposed.trigger(AngleMeasurement.uuid);
    this.onDisposed.reset();
  }

  create = () => {
    if (!this.enabled) return;
    if (!this.world) {
      console.log("No world selected for angle measurement!");
      return;
    }
    const point = this._vertexPicker.get(this.world);
    if (!point) {
      return;
    }
    if (!this._currentAngleElement) {
      const angleElement = new AngleMeasureElement(this.world);
      angleElement.lineMaterial = this.lineMaterial;
      // angleElement.onPointRemoved.on(() => this._clickCount--);
      this._currentAngleElement = angleElement;
    }
    this._currentAngleElement.setPoint(point, this._clickCount as 0 | 1 | 2);
    this._currentAngleElement.setPoint(
      point,
      (this._clickCount + 1) as 0 | 1 | 2,
    );
    this._currentAngleElement.setPoint(
      point,
      (this._clickCount + 2) as 0 | 1 | 2,
    );
    this._currentAngleElement.computeAngle();
    this._clickCount++;
    if (this._clickCount === 3) this.endCreation();
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
    if (this._currentAngleElement) {
      this.list.push(this._currentAngleElement);
      this._currentAngleElement.computeAngle();
      this._currentAngleElement = null;
    }
    this._clickCount = 0;
  }

  cancelCreation() {
    if (this._currentAngleElement) {
      this._currentAngleElement.dispose();
      this._currentAngleElement = null;
    }
    this._clickCount = 0;
  }

  private setupEvents(active: boolean) {
    if (!this.world) {
      throw new Error("No world selected for angle measurement!");
    }

    if(this.world.isDisposing) {
      return;
    }

    if (!this.world.renderer) {
      throw new Error("The given world doesn't have a renderer!");
    }
    const canvas = this.world.renderer.three.domElement;
    const viewerContainer = canvas.parentElement as HTMLElement;
    if (active) {
      viewerContainer.addEventListener("click", this.create);
      viewerContainer.addEventListener("mousemove", this.onMouseMove);
      window.addEventListener("keydown", this.onKeyDown);
    } else {
      viewerContainer.removeEventListener("click", this.create);
      viewerContainer.removeEventListener("mousemove", this.onMouseMove);
      window.removeEventListener("keydown", this.onKeyDown);
    }
  }

  private onMouseMove = () => {
    if (!this.world) {
      console.log("No world selected for angle measurement!");
      return;
    }
    const point = this._vertexPicker.get(this.world);
    if (!(point && this._currentAngleElement)) return;
    this._currentAngleElement.setPoint(point, this._clickCount as 0 | 1 | 2);
    this._currentAngleElement.computeAngle();
  };

  private onKeyDown = (e: KeyboardEvent) => {
    if (!this.enabled) return;
    if (e.key === "z" && e.ctrlKey && this._currentAngleElement) {
      // this._currentAngleElement.removePoint(this._clickCount - 1);
    }
    if (e.key === "Escape") {
      if (this._clickCount === 0 && !this._currentAngleElement) {
        this.enabled = false;
      } else {
        this.cancelCreation();
      }
    }
  };
}
