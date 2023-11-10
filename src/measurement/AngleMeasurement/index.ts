import * as THREE from "three";
import { LineMaterial } from "three/examples/jsm/lines/LineMaterial";
import {
  Createable,
  Event,
  UI,
  Component,
  Disposable,
  UIElement,
} from "../../base-types";
import { Components, ToolComponent } from "../../core";
import { Button } from "../../ui";
import { VertexPicker } from "../../utils";
import { AngleMeasureElement } from "./src";

export class AngleMeasurement
  extends Component<AngleMeasureElement[]>
  implements Createable, UI, Disposable
{
  static readonly uuid = "622fb2c9-528c-4b0a-8a0e-6a1375f0a3aa" as const;

  uiElement = new UIElement<{ main: Button }>();

  private _lineMaterial: LineMaterial;
  private _enabled = false;
  private _vertexPicker: VertexPicker;
  private _currentAngleElement: AngleMeasureElement | null = null;
  private _clickCount: number = 0;
  private _measurements: AngleMeasureElement[] = [];

  readonly onBeforeCreate = new Event<any>();
  readonly onAfterCreate = new Event<AngleMeasureElement>();
  readonly onBeforeCancel = new Event<any>();
  readonly onAfterCancel = new Event<any>();
  readonly onBeforeDelete = new Event<any>();
  readonly onAfterDelete = new Event<any>();

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
    if (this.components.uiEnabled) {
      const main = this.uiElement.get("main");
      main.active = value;
    }
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

    this.components.tools.add(AngleMeasurement.uuid, this);

    this.components = components;
    this._lineMaterial = new LineMaterial({
      color: 0x6528d7,
      linewidth: 2,
    });
    this._vertexPicker = new VertexPicker(components);

    // this.enabled = false;
    if (components.uiEnabled) {
      this.setUI();
    }
  }

  async dispose() {
    await this.setupEvents(false);
    this.onBeforeCreate.reset();
    this.onAfterCreate.reset();
    this.onBeforeCancel.reset();
    this.onAfterCancel.reset();
    this.onBeforeDelete.reset();
    this.onAfterDelete.reset();
    this.uiElement.dispose();
    this._lineMaterial.dispose();
    await this._vertexPicker.dispose();
    for (const measure of this._measurements) {
      await measure.dispose();
    }
    if (this._currentAngleElement) {
      await this._currentAngleElement.dispose();
    }
    (this.components as any) = null;
  }

  create = () => {
    if (!this.enabled) return;
    const point = this._vertexPicker.get();
    if (!point) return;
    if (!this._currentAngleElement) {
      const angleElement = new AngleMeasureElement(this.components);
      angleElement.lineMaterial = this.lineMaterial;
      // angleElement.onPointRemoved.on(() => this._clickCount--);
      this._currentAngleElement = angleElement;
    }
    this._currentAngleElement.setPoint(point, this._clickCount as 0 | 1 | 2);
    this._currentAngleElement.setPoint(
      point,
      (this._clickCount + 1) as 0 | 1 | 2
    );
    this._currentAngleElement.setPoint(
      point,
      (this._clickCount + 2) as 0 | 1 | 2
    );
    this._currentAngleElement.computeAngle();
    this._clickCount++;
    if (this._clickCount === 3) this.endCreation();
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

  private setUI() {
    const main = new Button(this.components);
    main.materialIcon = "square_foot";
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

  private setupEvents(active: boolean) {
    const viewerContainer = this.components.ui.viewerContainer as HTMLElement;
    if (active) {
      viewerContainer.addEventListener("click", this.create);
      viewerContainer.addEventListener("mousemove", this.onMouseMove);
      window.addEventListener("keydown", this.onKeyDown);
    } else {
      const main = this.uiElement.get("main");
      main.active = false;
      viewerContainer.removeEventListener("click", this.create);
      viewerContainer.removeEventListener("mousemove", this.onMouseMove);
      window.removeEventListener("keydown", this.onKeyDown);
    }
  }

  private onMouseMove = () => {
    const point = this._vertexPicker.get();
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

ToolComponent.libraryUUIDs.add(AngleMeasurement.uuid);
