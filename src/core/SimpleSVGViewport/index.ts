import { Vector2 } from "three";
import { generateUUID } from "three/src/math/MathUtils";
import { Component, SVGAnnotationStyle } from "../../base-types";
import { Button } from "../../ui/ButtonComponent";
import { FloatingWindow } from "../../ui/FloatingWindow";
import { Toolbar } from "../../ui/ToolbarComponent";
import { Components } from "../Components";
import { ColorInput, RangeInput } from "../../ui";

export interface SVGViewportConfig extends SVGAnnotationStyle {}

export class SimpleSVGViewport extends Component<SVGElement> {
  name: string = "SimpleCanvas2D";
  uiElement!: { toolbar: Toolbar; settingsWindow: FloatingWindow };
  id: string = generateUUID().toLowerCase();
  private _config!: SVGViewportConfig;
  private _enabled: boolean = false;

  private _viewport: SVGElement = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "svg"
  );

  private _components: Components;
  private _size: Vector2 = new Vector2();
  private _undoList: any[] = [];

  get enabled() {
    return this._enabled;
  }

  set enabled(value: boolean) {
    this._enabled = value;
    this.resize();
    this._undoList = [];
    this.uiElement.toolbar.visible = value;
    if (value) {
      this._viewport.classList.remove("pointer-events-none");
    } else {
      this.clear();
      this.uiElement.settingsWindow.visible = false;
      this._viewport.classList.add("pointer-events-none");
    }
  }

  constructor(components: Components, config?: SVGViewportConfig) {
    super();
    this._components = components;

    const defaultConfig: SVGViewportConfig = {
      fillColor: "transparent",
      strokeColor: "#ff0000",
      strokeWidth: 4,
    };
    this.config = { ...defaultConfig, ...(config ?? {}) };

    this._viewport.classList.add("absolute", "top-0", "right-0");
    // this._viewport.setAttribute("preserveAspectRatio", "xMidYMid")
    this._viewport.setAttribute("width", "100%");
    this._viewport.setAttribute("height", "100%");
    // const renderer = this._components.renderer;
    // const rendererSize = renderer.getSize();
    // const width = rendererSize.x
    // const height = rendererSize.y
    // this._viewport.setAttribute("viewBox", `0 0 ${width} ${height}`);
    this.setUI();
    this.enabled = false;
    const viewerContainer = components.renderer.get().domElement
      .parentElement as HTMLElement;
    viewerContainer.append(this._viewport);
    window.addEventListener("resize", () => this.resize());
  }

  set config(value: Partial<SVGViewportConfig>) {
    this._config = { ...this._config, ...value };
  }

  get config() {
    return this._config;
  }

  private setUI() {
    const undoDrawingBtn = new Button(this._components, {
      materialIconName: "undo",
    });
    undoDrawingBtn.onclick = () => {
      if (this._viewport.lastChild) {
        this._undoList.push(this._viewport.lastChild);
        this._viewport.lastChild.remove();
      }
    };

    const redoDrawingBtn = new Button(this._components, {
      materialIconName: "redo",
    });
    redoDrawingBtn.onclick = () => {
      const childNode = this._undoList[this._undoList.length - 1];
      if (childNode) {
        this._undoList.pop();
        this._viewport.append(childNode);
      }
    };

    const clearDrawingBtn = new Button(this._components, {
      materialIconName: "delete",
    });
    clearDrawingBtn.onclick = () => this.clear();

    // #region Settings window
    const settingsWindow = new FloatingWindow(this._components, this.id);
    settingsWindow.title = "Drawing Settings";
    settingsWindow.visible = false;
    const viewerContainer = this._components.renderer.get().domElement
      .parentElement as HTMLElement;
    viewerContainer.append(settingsWindow.get());

    const strokeWidth = new RangeInput(this._components);
    strokeWidth.label = "Stroke Width";
    strokeWidth.min = 2;
    strokeWidth.max = 6;
    strokeWidth.value = 4;
    // strokeWidth.id = this.id;

    strokeWidth.onChange.on((value) => {
      // @ts-ignore
      this.config = { strokeWidth: value };
    });

    const strokeColorInput = new ColorInput(this._components);
    strokeColorInput.label = "Stroke Color";
    strokeColorInput.value = this.config.strokeColor ?? "#BCF124";
    // strokeColorInput.name = "stroke-color";
    // strokeColorInput.id = this.id;

    strokeColorInput.onChange.on((value) => {
      this.config = { strokeColor: value };
    });

    const fillColorInput = new ColorInput(this._components);
    strokeColorInput.label = "Fill Color";
    strokeColorInput.value = this.config.fillColor ?? "#BCF124";
    // strokeColorInput.name = "fill-color";
    // strokeColorInput.id = this.id;

    fillColorInput.onChange.on((value) => {
      this.config = { fillColor: value };
    });

    settingsWindow.addChild(strokeColorInput, fillColorInput, strokeWidth);

    const settingsBtn = new Button(this._components, {
      materialIconName: "settings",
    });
    settingsBtn.onclick = () => {
      settingsWindow.visible = !settingsWindow.visible;
      settingsBtn.active = settingsWindow.visible;
    };

    settingsWindow.onHidden.on(() => (settingsBtn.active = false));

    const toolbar = new Toolbar(this._components, { position: "right" });
    toolbar.addChild(
      settingsBtn,
      undoDrawingBtn,
      redoDrawingBtn,
      clearDrawingBtn
    );
    this.uiElement = { toolbar, settingsWindow };
  }

  get(): SVGElement {
    return this._viewport;
  }

  clear() {
    const viewport = this.get();
    this._undoList = [];
    while (viewport.firstChild) {
      viewport.removeChild(viewport.firstChild);
    }
  }

  getDrawing() {
    return this.get().childNodes;
  }

  //   setDrawing() {
  //         if (!this.enabled) {  }
  //     }

  /** {@link Resizeable.resize}. */
  resize() {
    const renderer = this._components.renderer;
    const rendererSize = renderer.getSize();
    const width = this.enabled ? rendererSize.x : 0;
    const height = this.enabled ? rendererSize.y : 0;
    this._size.set(width, height);
    // this._viewport.setAttribute("viewBox", `0 0 ${this._size.x} ${this._size.y}`);
  }

  /** {@link Resizeable.getSize}. */
  getSize() {
    return this._size;
  }
}
