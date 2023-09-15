import * as THREE from "three";
import { Createable, Disposable, Event, UI } from "../../base-types/base-types";
import { Component } from "../../base-types/component";
import { Components } from "../../core/Components";
import { Button } from "../../ui/ButtonComponent";
import { VertexPicker } from "../../utils";
import { AreaMeasureElement } from "../AreaMeasureElement";

export class AreaMeasurement
  extends Component<AreaMeasureElement[]>
  implements Createable, UI, Disposable
{
  name: string = "AreaMeasurement";
  uiElement: { main: Button };

  private _components: Components;
  private _enabled: boolean = false;
  private _vertexPicker: VertexPicker;
  private _currentAreaElement: AreaMeasureElement | null = null;
  private _clickCount: number = 0;
  private _measurements: AreaMeasureElement[] = [];

  readonly beforeCreate = new Event<any>();
  readonly afterCreate = new Event<AreaMeasureElement>();
  readonly beforeCancel = new Event<any>();
  readonly afterCancel = new Event<any>();
  readonly beforeDelete = new Event<any>();
  readonly afterDelete = new Event<any>();

  set enabled(value: boolean) {
    this._enabled = value;
    this._vertexPicker.enabled = value;
    this.uiElement.main.active = value;
    this.setupEvents(value);
    if (!value) this.cancelCreation();
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

  constructor(components: Components) {
    super();
    this._components = components;
    this._vertexPicker = new VertexPicker(components);
    this.uiElement = { main: new Button(components) };
    this.uiElement.main.materialIcon = "check_box_outline_blank";
    this.setUI();
    this.enabled = false;
  }

  dispose() {
    this.setupEvents(false);
    this.beforeCreate.reset();
    this.afterCreate.reset();
    this.beforeCancel.reset();
    this.afterCancel.reset();
    this.beforeDelete.reset();
    this.afterDelete.reset();
    this.uiElement.main.dispose();
    this._vertexPicker.dispose();
    if (this._currentAreaElement) {
      this._currentAreaElement.dispose();
    }
    for (const measure of this._measurements) {
      measure.dispose();
    }
    (this._components as any) = null;
  }

  private setUI() {
    this.uiElement.main.onclick = () => {
      if (!this.enabled) {
        this.uiElement.main.active = true;
        this.enabled = true;
      } else {
        this.enabled = false;
        this.uiElement.main.active = false;
      }
    };
  }

  create = () => {
    if (!this.enabled) return;
    const point = this._vertexPicker.get();
    if (!point) return;
    if (!this._currentAreaElement) {
      const areaShape = new AreaMeasureElement(this._components);
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

  endCreation() {
    if (this._currentAreaElement) {
      this._measurements.push(this._currentAreaElement);
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

  get() {
    return this._measurements;
  }

  private setupEvents(active: boolean) {
    const viewerContainer = this._components.ui.viewerContainer;
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
    const point = this._vertexPicker.get();
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
