import { BaseSVGAnnotation } from "../../base-types";
import { Components } from "../../core";
import { Button } from "../../ui";
import { SVGArrow } from "../SVGArrow";
import { DrawManager } from "../DrawManager";

export class ArrowAnnotation extends BaseSVGAnnotation {
  name: string = "ArrowAnnotation";
  canvas: HTMLCanvasElement | null = null;
  uiElement!: Button;
  private _components: Components;
  private _previewElement: SVGArrow;

  constructor(components: Components, drawManager?: DrawManager) {
    super();
    this._components = components;
    this._previewElement = new SVGArrow(components);
    this.setUI();
    this.drawManager = drawManager;
  }

  private setUI() {
    const button = new Button(this._components, {
      name: "Arrow",
      materialIconName: "north_east",
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

  cancel() {
    if (!this._isDrawing) {
      return;
    }
    this._isDrawing = false;
    this._previewElement.reset();
    this._previewElement.get().remove();
  }

  start(e: MouseEvent) {
    if (!this.canDraw) {
      return undefined;
    }
    if (!this._isDrawing) {
      this._isDrawing = true;
      this._previewElement.setStyle(this.drawManager?.viewport.config);
      this._previewElement.x1 = e.clientX;
      this._previewElement.y1 = e.clientY;
      this._previewElement.x2 = e.clientX;
      this._previewElement.y2 = e.clientY;
      this.svgViewport?.append(this._previewElement.get());
    } else {
      const arrow = this._previewElement.clone();
      arrow.setStyle(this.drawManager?.viewport.config);
      this.svgViewport?.append(arrow.get());
      this.cancel();
      return arrow;
    }
    return undefined;
  }

  draw(e: MouseEvent) {
    if (!this.canDraw || !this._isDrawing) {
      return;
    }
    this._previewElement.x1 = e.clientX;
    this._previewElement.y1 = e.clientY;
  }
}
