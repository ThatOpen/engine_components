import { Disposable, UI } from "./base-types";
import { Component } from "./component";
import { DrawManager } from "../annotation";
import { Button } from "../ui";
import { tooeenRandomId } from "../utils";

export interface SVGAnnotationStyle {
  fillColor: string;
  strokeWidth: number;
  strokeColor: string;
}

export abstract class BaseSVGAnnotation
  extends Component<null>
  implements UI, Disposable
{
  id = tooeenRandomId();

  abstract uiElement: { main: Button };

  protected _enabled: boolean = false;
  protected _isDrawing: boolean = false;
  protected _svgViewport?: SVGElement | null = null;
  private _drawManager: DrawManager | null | undefined;

  set svgViewport(value: SVGElement | undefined | null) {
    this._svgViewport = value;
  }

  get svgViewport() {
    return this._svgViewport ?? undefined;
  }

  set enabled(value: boolean) {
    if (!this._svgViewport) {
      this.uiElement.main.active = false;
      this._enabled = false;
      return;
    }
    if (value === this._enabled) return;
    this._enabled = value;
    this.uiElement.main.active = value;
    this.setupEvents(value);
  }

  get enabled() {
    return this._enabled;
  }

  get canDraw() {
    return this.enabled && this._svgViewport;
  }

  set drawManager(manager: DrawManager | null | undefined) {
    this._drawManager = manager;
    if (manager) {
      manager.addDrawingTool(this.uuid, this);
      manager.uiElement.drawingTools.addChild(this.uiElement.main);
      this.svgViewport = manager.viewport.get();
    } else {
      this.svgViewport = null;
    }
  }

  get drawManager() {
    return this._drawManager;
  }

  get() {
    return null;
  }

  dispose() {
    if (this._drawManager) {
      this._drawManager.dispose();
    }
    if (this._svgViewport) {
      this._svgViewport.remove();
    }
    this.setupEvents(false);
    this.uiElement.main.dispose();
    if (this.svgViewport) {
      this.svgViewport.remove();
    }
  }

  private setupEvents(active: boolean) {
    if (active) {
      document.addEventListener("keydown", this.cancel);
      if (!this._svgViewport) return;
      this._svgViewport.addEventListener("mousemove", this.draw);
      this._svgViewport.addEventListener("mousedown", this.start);
      this._svgViewport.addEventListener("mouseup", this.end);
    } else {
      document.removeEventListener("keydown", this.cancel);
      if (!this._svgViewport) return;
      this._svgViewport.removeEventListener("mousemove", this.draw);
      this._svgViewport.removeEventListener("mousedown", this.start);
      this._svgViewport.removeEventListener("mouseup", this.end);
    }
  }

  start = (_event: any): any => {};

  draw = (_event: any): any => {};

  end = (_event: any): any => {};

  cancel = (event: any): any => {
    if (event) {
      event.stopImmediatePropagation();
      if (event.key === "Escape") {
        this.cancel(event);
      }
    }
  };
}
