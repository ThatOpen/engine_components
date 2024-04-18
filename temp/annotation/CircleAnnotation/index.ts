import { Vector2 } from "three";
import { BaseSVGAnnotation, UIElement } from "../../base-types";
import { Components } from "../../core";
import { Button } from "../../ui";
import { DrawManager } from "../DrawManager";
import { SVGCircle } from "../SVGCircle";

export class CircleAnnotation extends BaseSVGAnnotation {
  readonly name: string = "CircleAnnotation";
  canvas: HTMLCanvasElement | null = null;
  uiElement = new UIElement<{ main: Button }>();

  private _previewElement: SVGCircle;
  private _cursorPosition: Vector2 = new Vector2();

  constructor(components: Components) {
    super(components);
    this._previewElement = new SVGCircle(components);
    const drawManager = this.components.tools.get(DrawManager);
    if (components.uiEnabled) {
      this.setUI();
    }
    drawManager.addDrawingTool("circle_annotation", this);
  }

  private setUI() {
    const drawManager = this.components.tools.get(DrawManager);
    const main = new Button(this.components);
    main.label = "Circle";
    main.materialIcon = "radio_button_unchecked";
    main.onClick.add(() => {
      drawManager.activateTool(this);
    });
    this.uiElement.set({ main });
  }

  async dispose() {
    await super.dispose();
    this._previewElement.dispose();
  }

  start = (e: MouseEvent) => {
    if (!this.canDraw) {
      return null;
    }
    const drawManager = this.components.tools.get(DrawManager);
    if (!this._isDrawing) {
      this._isDrawing = true;
      this._previewElement.setStyle(drawManager.viewport.config);
      this._previewElement.cx = e.clientX;
      this._previewElement.cy = e.clientY;
      this.svgViewport?.append(this._previewElement.get());
    } else {
      const circle = this._previewElement.clone();
      circle.setStyle(drawManager.viewport.config);
      this.svgViewport?.append(circle.get());
      this.cancel();
      return circle;
    }
    return null;
  };

  cancel = () => {
    if (!this._isDrawing) {
      return;
    }
    this._isDrawing = false;
    this._previewElement.reset();
    this._previewElement.get().remove();
  };

  draw = (e: MouseEvent) => {
    if (!this.canDraw || !this._isDrawing) {
      return;
    }
    this._cursorPosition.x = e.clientX;
    this._cursorPosition.y = e.clientY;
    this._previewElement.radius = this._cursorPosition.distanceTo(
      this._previewElement.centerPoint
    );
  };
}
