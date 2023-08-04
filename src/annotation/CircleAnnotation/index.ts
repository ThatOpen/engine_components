import { Vector2 } from "three";
import { BaseSVGAnnotation } from "../../base-types";
import { Components } from "../../core";
import { Button } from "../../ui";
import { DrawManager } from "../DrawManager";
import { SVGCircle } from "../SVGCircle";

export class CircleAnnotation extends BaseSVGAnnotation {
  name: string = "CircleAnnotation";
  canvas: HTMLCanvasElement | null = null;
  uiElement: { main: Button };
  private _previewElement: SVGCircle;
  private _cursorPosition: Vector2 = new Vector2();

  constructor(components: Components, drawManager?: DrawManager) {
    super();
    this._previewElement = new SVGCircle(components);
    this.drawManager = drawManager;

    this.uiElement = { main: new Button(components) };
    this.uiElement.main.label = "Circle";
    this.uiElement.main.materialIcon = "radio_button_unchecked";
    this.uiElement.main.onclick = () => {
      if (this.drawManager) {
        this.drawManager.activateTool(this);
      } else {
        this.enabled = !this.enabled;
      }
    };
  }

  start(e: MouseEvent) {
    if (!this.canDraw) {
      return undefined;
    }
    if (!this._isDrawing) {
      this._isDrawing = true;
      this._previewElement.setStyle(this.drawManager?.viewport.config);
      this._previewElement.cx = e.clientX;
      this._previewElement.cy = e.clientY;
      this.svgViewport?.append(this._previewElement.get());
    } else {
      const circle = this._previewElement.clone();
      circle.setStyle(this.drawManager?.viewport.config);
      this.svgViewport?.append(circle.get());
      this.cancel();
      return circle;
    }
    return undefined;
  }

  cancel() {
    if (!this._isDrawing) {
      return;
    }
    this._isDrawing = false;
    this._previewElement.reset();
    this._previewElement.get().remove();
  }

  draw(e: MouseEvent) {
    if (!this.canDraw || !this._isDrawing) {
      return;
    }
    this._cursorPosition.x = e.clientX;
    this._cursorPosition.y = e.clientY;
    this._previewElement.radius = this._cursorPosition.distanceTo(
      this._previewElement.centerPoint
    );
  }
}
