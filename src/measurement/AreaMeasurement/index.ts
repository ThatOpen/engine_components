import * as THREE from "three";
import { Createable, Event, UI } from "../../base-types/base-types";
import { Component } from "../../base-types/component";
import { Components } from "../../core/Components";
import { Button } from "../../ui/ButtonComponent";
import { VertexPicker } from "../../utils";
import { AreaMeasureElement } from "../AreaMeasureElement";

export class AreaMeasurement
  extends Component<AreaMeasureElement[]>
  implements Createable, UI
{
  name: string = "AreaMeasurement";
  uiElement: Button;

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
    this.uiElement.active = value;
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
    this.uiElement = new Button(components, {
      materialIconName: "check_box_outline_blank",
    });
    this.setUI();
    this.enabled = false;
  }

  private setUI() {
    const viewerContainer = this._components.ui.viewerContainer as HTMLElement;
    const createMeasurement = () => this.create();
    const mouseMove = () => {
      const point = this._vertexPicker.get();
      if (!(point && this._currentAreaElement)) return;
      this._currentAreaElement.setPoint(point, this._clickCount);
      this._currentAreaElement.computeArea();
    };
    const keydown = (e: KeyboardEvent) => {
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
    this.uiElement.onclick = () => {
      if (!this.enabled) {
        viewerContainer.addEventListener("click", createMeasurement);
        viewerContainer.addEventListener("mousemove", mouseMove);
        window.addEventListener("keydown", keydown);
        this.uiElement.active = true;
        this.enabled = true;
      } else {
        this.enabled = false;
        this.uiElement.active = false;
        viewerContainer.removeEventListener("click", createMeasurement);
        viewerContainer.removeEventListener("mousemove", mouseMove);
        window.removeEventListener("keydown", keydown);
      }
    };
  }

  create() {
    if (!this.enabled) return;
    const point = this._vertexPicker.get();
    if (!point) return;
    if (!this._currentAreaElement) {
      const areaShape = new AreaMeasureElement(this._components);
      areaShape.onPointAdded.on(() => {
        if (this._clickCount === 3 && !areaShape.workingPlane) {
          areaShape.computeWorkingPlane();
          this._vertexPicker.workingPlane = areaShape.workingPlane;
        }
      });
      areaShape.onPointRemoved.on(() => this._clickCount--);
      this._currentAreaElement = areaShape;
    }
    this._currentAreaElement.setPoint(point, this._clickCount);
    this._currentAreaElement.computeArea();
    this._clickCount++;
  }

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
}
