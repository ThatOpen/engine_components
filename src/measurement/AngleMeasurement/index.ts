import * as THREE from "three";
import { Createable, Event, UI } from "../../base-types/base-types";
import { Component } from "../../base-types/component";
import { Components } from "../../core/Components";
import { Button } from "../../ui/ButtonComponent";
import { VertexPicker } from "../../utils";
import { AngleMeasureElement } from "../AngleMeasureElement";

export class AngleMeasurement
  extends Component<AngleMeasureElement[]>
  implements Createable, UI
{
  name: string = "AngleMeasurement";
  uiElement: Button;

  private _components: Components;
  private _enabled: boolean = false;
  private _vertexPicker: VertexPicker;
  private _currentAngleElement: AngleMeasureElement | null = null;
  private _clickCount: number = 0;
  private _measurements: AngleMeasureElement[] = [];

  readonly beforeCreate = new Event<any>();
  readonly afterCreate = new Event<AngleMeasureElement>();
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
      materialIconName: "square_foot",
    });
    this.setUI();
    this.enabled = false;
  }

  private setUI() {
    const viewerContainer = this._components.ui.viewerContainer as HTMLElement;
    const createMeasurement = () => this.create();
    const mouseMove = () => {
      const point = this._vertexPicker.get();
      if (!(point && this._currentAngleElement)) return;
      // @ts-ignore
      this._currentAngleElement.setPoint(point, this._clickCount);
      this._currentAngleElement.computeAngle();
    };
    const keydown = (e: KeyboardEvent) => {
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
    if (!this._currentAngleElement) {
      const angleElement = new AngleMeasureElement(this._components);
      // angleElement.onPointRemoved.on(() => this._clickCount--);
      this._currentAngleElement = angleElement;
    }
    // @ts-ignore
    this._currentAngleElement.setPoint(point, this._clickCount);
    // @ts-ignore
    this._currentAngleElement.setPoint(point, this._clickCount + 1);
    // @ts-ignore
    this._currentAngleElement.setPoint(point, this._clickCount + 2);
    this._currentAngleElement.computeAngle();
    this._clickCount++;
    if (this._clickCount === 3) this.endCreation();
  }

  delete() {}

  endCreation() {
    if (this._currentAngleElement) {
      this._measurements.push(this._currentAngleElement);
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

  get() {
    return this._measurements;
  }
}
