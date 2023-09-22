import {
  Component,
  UI,
  BaseSVGAnnotation,
  Disposable,
  UIElement,
} from "../../base-types";
import { Components, SimpleSVGViewport } from "../../core";
import { Button, Toolbar } from "../../ui";

export class DrawManager extends Component<string> implements UI, Disposable {
  name: string = "DrawManager";

  uiElement = new UIElement<{
    main: Button;
    drawingTools: Toolbar;
  }>();

  viewport: SimpleSVGViewport;
  drawingTools: { [name: string]: BaseSVGAnnotation } = {};
  drawings: { [name: string]: SVGGElement } = {};

  private _enabled: boolean = false;
  private _isDrawing: boolean = false;

  get isDrawing() {
    return this._isDrawing;
  }

  set isDrawing(value: boolean) {
    this._isDrawing = value;
  }

  get enabled() {
    return this._enabled;
  }

  set enabled(value: boolean) {
    this._enabled = value;
    this.uiElement.get("main").active = value;
    this.uiElement.get("drawingTools").visible = value;
    this.viewport.enabled = value;
  }

  constructor(components: Components) {
    super(components);
    this.viewport = new SimpleSVGViewport(components);
    this.setUI();
    this.enabled = false;
  }

  async dispose() {
    this.uiElement.dispose();
    await this.viewport.dispose();
    for (const name in this.drawings) {
      this.drawings[name].remove();
    }
    this.drawings = {};
    (this.components as any) = null;
  }

  saveDrawing(name: string) {
    const currentDrawing = this.drawings[name];
    currentDrawing?.childNodes.forEach((child) =>
      currentDrawing.removeChild(child)
    );
    const drawing = this.viewport.getDrawing();
    const group =
      currentDrawing ??
      document.createElementNS("http://www.w3.org/2000/svg", "g");
    group.id = name;
    group.append(...drawing);
    this.viewport.get().append(group);
    this.drawings[name] = group;
    return group;
  }

  addDrawingTool(name: string, tool: BaseSVGAnnotation) {
    const existingTool = this.drawingTools[name];
    if (!existingTool) {
      const main = this.uiElement.get("main");
      this.uiElement.get("drawingTools").addChild(main);
      this.drawingTools[name] = tool;
    }
  }

  activateTool(tool: BaseSVGAnnotation) {
    const drawingTools = Object.values(this.drawingTools);
    drawingTools.forEach((tool) => (tool.enabled = false));
    tool.enabled = true;
  }

  get activeTool() {
    const drawingTools = Object.values(this.drawingTools);
    return drawingTools.find((tool) => tool.enabled === true);
  }

  private setUI() {
    const drawingTools = new Toolbar(this.components, { position: "top" });
    this.components.ui.addToolbar(drawingTools);
    const main = new Button(this.components);
    main.materialIcon = "gesture";
    main.onClick.add(() => (this.enabled = !this.enabled));
    this.uiElement.set({ drawingTools, main });
  }

  get(): string {
    throw new Error("Method not implemented.");
  }
}
