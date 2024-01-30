import { BaseSVGAnnotation, UIElement } from "../../base-types";
import { Components } from "../../core";
import { Button } from "../../ui";
import { SVGArrow } from "../SVGArrow";
import { DrawManager } from "../DrawManager";

export class ArrowAnnotation extends BaseSVGAnnotation {
  readonly name: string = "ArrowAnnotation";
  canvas: HTMLCanvasElement | null = null;
  uiElement = new UIElement<{ main: Button }>();

  private _previewElement: SVGArrow;

  constructor(components: Components) {
    super(components);
    this._previewElement = new SVGArrow(components);
    const drawManager = this.components.tools.get(DrawManager);
    if (components.uiEnabled) {
      this.setUI();
    }
    drawManager.addDrawingTool(this.name, this);
  }

  private setUI() {
    const drawManager = this.components.tools.get(DrawManager);
    const main = new Button(this.components);
    main.label = "Arrow";
    main.materialIcon = "north_east";
    main.onClick.add(() => {
      drawManager.activateTool(this);
    });
    this.uiElement.set({ main });
  }

  async dispose() {
    await super.dispose();
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
      return null;
    }
    const drawManager = this.components.tools.get(DrawManager);
    if (!this._isDrawing) {
      this._isDrawing = true;
      this._previewElement.setStyle(drawManager.viewport.config);
      this._previewElement.x1 = event.clientX;
      this._previewElement.y1 = event.clientY;
      this._previewElement.x2 = event.clientX;
      this._previewElement.y2 = event.clientY;
      this.svgViewport?.append(this._previewElement.get());
    } else {
      const arrow = this._previewElement.clone();
      arrow.setStyle(drawManager.viewport.config);
      this.svgViewport?.append(arrow.get());
      this.cancel();
      return arrow;
    }
    return null;
  };

  draw = (e: MouseEvent) => {
    if (!this.canDraw || !this._isDrawing) {
      return;
    }
    this._previewElement.x1 = e.clientX;
    this._previewElement.y1 = e.clientY;
  };
}
