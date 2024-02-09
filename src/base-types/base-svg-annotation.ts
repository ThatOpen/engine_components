import { generateUUID } from "three/src/math/MathUtils";
import { Disposable, UI, Event } from "./base-types";
import { Component } from "./component";
import { Button } from "../ui";
import { UIElement } from "./ui-element";

export interface SVGAnnotationStyle {
  fillColor: string;
  strokeWidth: number;
  strokeColor: string;
}

export abstract class BaseSVGAnnotation
  extends Component<null>
  implements UI, Disposable
{
  id = generateUUID();

  /** {@link Disposable.onDisposed} */
  readonly onDisposed = new Event<undefined>();

  abstract uiElement: UIElement<{ main: Button }>;

  protected _enabled: boolean = false;
  protected _isDrawing: boolean = false;
  protected _svgViewport?: SVGElement | null = null;

  set svgViewport(value: SVGElement | undefined | null) {
    this._svgViewport = value;
  }

  get svgViewport() {
    return this._svgViewport ?? undefined;
  }

  set enabled(value: boolean) {
    this._enabled = value;
    this.setupEvents(value);
    if (this.components.uiEnabled) {
      const main = this.uiElement.get("main");
      main.active = value;
    }
  }

  get enabled() {
    return this._enabled;
  }

  get canDraw() {
    return this.enabled && this._svgViewport;
  }

  get() {
    return null;
  }

  async dispose() {
    if (this._svgViewport) {
      this._svgViewport.remove();
    }
    this.setupEvents(false);
    this.uiElement.dispose();
    await this.onDisposed.trigger();
    this.onDisposed.reset();
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

  start = (_event: MouseEvent): Component<SVGGElement> | null => {
    return null;
  };

  draw = (_event: MouseEvent): void => {};

  end = (_event: MouseEvent): void => {};

  cancel = (event: any): any => {
    if (event) {
      event.stopImmediatePropagation();
      if (event.key === "Escape") {
        this.cancel(event);
      }
    }
  };
}
