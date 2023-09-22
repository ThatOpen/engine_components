import { Vector2 } from "three";
import { BaseSVGAnnotation, UIElement } from "../../base-types";
import { Components } from "../../core";
import { Button } from "../../ui";
import { DrawManager } from "../DrawManager";
import { SVGRectangle } from "../SVGRectangle";

export class RectangleAnnotation extends BaseSVGAnnotation {
  name: string = "RectangleAnnotation";
  canvas: HTMLCanvasElement | null = null;
  uiElement = new UIElement<{ main: Button }>();

  private _previewElement: SVGRectangle;
  private _startPoint: Vector2 = new Vector2();

  constructor(components: Components, drawManager?: DrawManager) {
    super(components);
    this._previewElement = new SVGRectangle(components);
    this.drawManager = drawManager;

    const main = new Button(components);
    this.uiElement.set({ main });
    main.label = "Rectangle";
    main.materialIcon = "crop_square";
    main.onClick.add(() => {
      if (this.drawManager) {
        this.drawManager.activateTool(this);
      } else {
        this.enabled = !this.enabled;
      }
    });
  }

  async dispose() {
    await super.dispose();
    this._previewElement.dispose();
  }

  start = (e: MouseEvent) => {
    if (!this.canDraw) {
      return undefined;
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
    return undefined;
  };

  cancel = () => {
    if (!this._isDrawing) {
      return;
    }
    this._isDrawing = false;
    this._startPoint.x = 0;
    this._startPoint.y = 0;
    this._previewElement.reset();
    this._previewElement.get().remove();
  };

  draw = (e: MouseEvent) => {
    if (!this.canDraw || !this._isDrawing) {
      return;
    }
    this._previewElement.x1 = this._startPoint.x;
    this._previewElement.y1 = this._startPoint.y;
    this._previewElement.x2 = e.clientX;
    this._previewElement.y2 = e.clientY;
  };
}
