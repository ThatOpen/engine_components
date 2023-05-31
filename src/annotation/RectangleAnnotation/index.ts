import { Vector2 } from "three";
import { BaseSVGAnnotation } from "../../base-types";
import { Components } from "../../core";
import { Button } from "../../ui";
import { DrawManager } from "../DrawManager";
import { SVGRectangle } from "../SVGRectangle";

export class RectangleAnnotation extends BaseSVGAnnotation {
  name: string = "RectangleAnnotation";
  canvas: HTMLCanvasElement | null = null;
  uiElement!: Button;
  private _components: Components;
  private _previewElement: SVGRectangle;
  private _startPoint: Vector2 = new Vector2();

  constructor(components: Components, drawManager?: DrawManager) {
    super();
    this._components = components;
    this._previewElement = new SVGRectangle(components);
    this.setUI();
    this.drawManager = drawManager;
  }

  private setUI() {
    const button = new Button(this._components, {
      name: "Rectangle",
      materialIconName: "crop_square",
    });
    button.onclick = () => {
      if (this.drawManager) {
        this.drawManager.activateTool(this);
      } else {
        this.enabled = !this.enabled;
      }
    };
    this.uiElement = button;
  }

  start(e: MouseEvent) {
    if (!this.canDraw) {
      return;
    }
    if (!this._isDrawing) {
      this._isDrawing = true;
      this._previewElement.setStyle(this.drawManager?.viewport.config);
      this._startPoint.set(e.clientX, e.clientY);
      this.svgViewport?.append(this._previewElement.get());
    } else {
      const rectangle = this._previewElement.clone();
      rectangle.setStyle(this.drawManager?.viewport.config);
      this.svgViewport?.append(rectangle.get());
      this.cancel();
      return rectangle;
    }
  }

  cancel() {
    if (!this._isDrawing) {
      return;
    }
    this._isDrawing = false;
    this._startPoint.x = 0;
    this._startPoint.y = 0;
    this._previewElement.reset();
    this._previewElement.get().remove();
  }

  draw(e: MouseEvent) {
    if (!this.canDraw || !this._isDrawing) {
      return;
    }
    this._previewElement.x1 = this._startPoint.x;
    this._previewElement.y1 = this._startPoint.y;
    this._previewElement.x2 = e.clientX;
    this._previewElement.y2 = e.clientY;
  }
}
