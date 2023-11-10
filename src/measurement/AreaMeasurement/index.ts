import * as THREE from "three";
import {
  Createable,
  Disposable,
  Event,
  UI,
  Component,
  UIElement,
} from "../../base-types";
import { Components, ToolComponent } from "../../core";
import { Button } from "../../ui";
import { VertexPicker } from "../../utils";
import { AreaMeasureElement } from "./src";

export class AreaMeasurement
  extends Component<AreaMeasureElement[]>
  implements Createable, UI, Disposable
{
  static readonly uuid = "c453a99e-f054-4781-9060-33df617db4a5" as const;

  uiElement = new UIElement<{ main: Button }>();

  private _enabled: boolean = false;
  private _vertexPicker: VertexPicker;
  private _currentAreaElement: AreaMeasureElement | null = null;
  private _clickCount: number = 0;
  private _measurements: AreaMeasureElement[] = [];

  readonly onBeforeCreate = new Event<any>();
  readonly onAfterCreate = new Event<AreaMeasureElement>();
  readonly onBeforeCancel = new Event<any>();
  readonly onAfterCancel = new Event<any>();
  readonly onBeforeDelete = new Event<any>();
  readonly onAfterDelete = new Event<any>();

  set enabled(value: boolean) {
    this._enabled = value;
    this._vertexPicker.enabled = value;
    if (this.components.uiEnabled) {
      const main = this.uiElement.get("main");
      main.active = value;
    }
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
    super(components);

    this.components.tools.add(AreaMeasurement.uuid, this);

    // TODO: Make vertexpicker a tool?
    this._vertexPicker = new VertexPicker(components);

    if (components.uiEnabled) {
      this.setUI();
    }
  }

  async dispose() {
    this.setupEvents(false);
    this.onBeforeCreate.reset();
    this.onAfterCreate.reset();
    this.onBeforeCancel.reset();
    this.onAfterCancel.reset();
    this.onBeforeDelete.reset();
    this.onAfterDelete.reset();
    this.uiElement.dispose();
    await this._vertexPicker.dispose();
    if (this._currentAreaElement) {
      await this._currentAreaElement.dispose();
    }
    for (const measure of this._measurements) {
      await measure.dispose();
    }
    (this.components as any) = null;
  }

  private setUI() {
    const main = new Button(this.components);
    main.materialIcon = "check_box_outline_blank";
    main.onClick.add(() => {
      if (!this.enabled) {
        main.active = true;
        this.enabled = true;
      } else {
        this.enabled = false;
        main.active = false;
      }
    });
    this.uiElement.set({ main });
  }

  create = () => {
    if (!this.enabled) return;
    const point = this._vertexPicker.get();
    if (!point) return;
    if (!this._currentAreaElement) {
      const areaShape = new AreaMeasureElement(this.components);
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
  async deleteAll() {
    for (const dim of this._measurements) {
      await dim.dispose();
      await this.onAfterDelete.trigger(this);
    }
    this._measurements = [];
  }

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
    const viewerContainer = this.components.ui.viewerContainer;
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

ToolComponent.libraryUUIDs.add(AreaMeasurement.uuid);
