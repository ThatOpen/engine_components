import { BaseSVGAnnotation } from "../../base-types";
import { Components } from "../../core";
import { Button } from "../../ui";
import { SVGArrow } from "../SVGArrow";
import { DrawManager } from "../DrawManager";

export class ArrowAnnotation extends BaseSVGAnnotation {
  name: string = "ArrowAnnotation";
  canvas: HTMLCanvasElement | null = null;
  uiElement: { main: Button };

  private _previewElement: SVGArrow;

  constructor(components: Components, drawManager?: DrawManager) {
    super();
    this._previewElement = new SVGArrow(components);
    this.drawManager = drawManager;

    this.uiElement = { main: new Button(components) };
    this.uiElement.main.label = "Arrow";
    this.uiElement.main.materialIcon = "north_east";
    this.uiElement.main.onclick = () => {
      if (this.drawManager) {
        this.drawManager.activateTool(this);
      } else {
        this.enabled = !this.enabled;
      }
    };
  }

  dispose() {
    super.dispose();
    this._previewElement.dispose();
  }

  cancel = () => {
    if (!this._isDrawing) {
      return;
    }
    this._isDrawing = false;
    this._previewElement.reset();
    this._previewElement.get().remove();
  };

  start = (event: MouseEvent) => {
    if (!this.canDraw) {
      return undefined;
    }
    if (!this._isDrawing) {
      this._isDrawing = true;
      this._previewElement.setStyle(this.drawManager?.viewport.config);
      this._previewElement.x1 = event.clientX;
      this._previewElement.y1 = event.clientY;
      this._previewElement.x2 = event.clientX;
      this._previewElement.y2 = event.clientY;
      this.svgViewport?.append(this._previewElement.get());
    } else {
      const arrow = this._previewElement.clone();
      arrow.setStyle(this.drawManager?.viewport.config);
      this.svgViewport?.append(arrow.get());
      this.cancel();
      return arrow;
    }
    return undefined;
  };

  draw = (e: MouseEvent) => {
    if (!this.canDraw || !this._isDrawing) {
      return;
    }
    this._previewElement.x1 = e.clientX;
    this._previewElement.y1 = e.clientY;
  };
}
