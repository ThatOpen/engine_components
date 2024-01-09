import { BaseSVGAnnotation, UI, UIElement } from "../../base-types";
import { Components } from "../../core";
import { Button } from "../../ui";
import { DrawManager } from "../DrawManager";
import { SVGText } from "../SVGText";

export class TextAnnotation extends BaseSVGAnnotation implements UI {
  readonly name: string = "TextAnnotation";
  uiElement = new UIElement<{ main: Button }>();
  canvas: HTMLCanvasElement | null = null;

  private _previewElement: SVGText;

  constructor(components: Components) {
    super(components);
    this._previewElement = new SVGText(components);
    const drawManager = this.components.tools.get(DrawManager);
    if (components.uiEnabled) {
      this.setUI();
    }
    drawManager.addDrawingTool(this.name, this);
  }

  private setUI() {
    const drawManager = this.components.tools.get(DrawManager);
    const main = new Button(this.components);
    main.label = "Text";
    main.materialIcon = "title";
    main.onClick.add(() => {
      drawManager.activateTool(this);
    });
    this.uiElement.set({ main });
  }

  async dispose() {
    await super.dispose();
    await this._previewElement.dispose();
  }

  cancel = () => {
    if (!this._isDrawing) {
      return;
    }
    this._isDrawing = false;
    this._previewElement.reset();
    this._previewElement.get().remove();
  };

  start = (e: MouseEvent) => {
    if (!this.canDraw) {
      return null;
    }
    const drawManager = this.components.tools.get(DrawManager);
    if (!this._isDrawing) {
      this._isDrawing = true;
      const text = prompt("Enter your text", this._previewElement.text);
      if (!text) {
        this.cancel();
        return null;
      }
      this._previewElement.setStyle(drawManager.viewport.config);
      this._previewElement.text = text;
      this._previewElement.x = e.clientX;
      this._previewElement.y = e.clientY;
      this.svgViewport?.append(this._previewElement.get());
    } else {
      const text = this._previewElement.clone();
      text.setStyle(drawManager.viewport.config);
      this.svgViewport?.append(text.get());
      this.cancel();
      return text;
    }
    return null;
  };

  draw = (e: MouseEvent) => {
    if (!this.canDraw || !this._isDrawing) {
      return;
    }
    this._previewElement.x = e.clientX;
    this._previewElement.y = e.clientY;
  };
}
