import { Vector2 } from "three";
import { generateUUID } from "three/src/math/MathUtils";
import {
  Component,
  Disposable,
  SVGAnnotationStyle,
  UI,
  UIElement,
  Event,
  Configurable,
} from "../../base-types";
import {
  Button,
  FloatingWindow,
  Toolbar,
  ColorInput,
  RangeInput,
} from "../../ui";

import { Components } from "../Components";

export interface SVGViewportConfig extends SVGAnnotationStyle {}

export class SimpleSVGViewport
  extends Component<SVGElement>
  implements UI, Disposable, Configurable<SVGViewportConfig>
{
  uiElement = new UIElement<{
    toolbar: Toolbar;
    settingsWindow: FloatingWindow;
  }>();

  /** {@link Configurable.isSetup} */
  isSetup = false;

  id: string = generateUUID().toLowerCase();

  private _enabled: boolean = false;

  /** {@link Disposable.onDisposed} */
  readonly onDisposed = new Event<undefined>();

  private _viewport: SVGElement = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "svg"
  );

  private _size: Vector2 = new Vector2();
  private _undoList: any[] = [];

  get enabled() {
    return this._enabled;
  }

  set enabled(value: boolean) {
    this._enabled = value;
    this.resize();
    this._undoList = [];
    if (this.components.uiEnabled) {
      this.uiElement.get("toolbar").visible = value;
    }
    if (value) {
      this._viewport.classList.remove("pointer-events-none");
    } else {
      this.clear();
      this.uiElement.get("settingsWindow").visible = false;
      this._viewport.classList.add("pointer-events-none");
    }
  }

  constructor(components: Components) {
    super(components);

    this._viewport.classList.add("absolute", "top-0", "right-0");
    this._viewport.setAttribute("width", "100%");
    this._viewport.setAttribute("height", "100%");

    if (components.uiEnabled) {
      this.setUI();
    }

    this.enabled = false;

    this.components.ui.viewerContainer.append(this._viewport);
    this.setupEvents(true);
  }

  config: Required<SVGViewportConfig> = {
    fillColor: "transparent",
    strokeColor: "#BCF124",
    strokeWidth: 4,
  };

  readonly onSetup = new Event<SimpleSVGViewport>();

  async setup(config?: Partial<SVGViewportConfig>) {
    this.config = { ...this.config, ...config };
    this.isSetup = true;
    await this.onSetup.trigger(this);
  }

  async dispose() {
    this._undoList = [];
    await this.uiElement.dispose();
    await this.onDisposed.trigger();
    this.onDisposed.reset();
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

  /** {@link Resizeable.resize}. */
  resize() {
    const renderer = this.components.renderer;
    const rendererSize = renderer.getSize();
    const width = this.enabled ? rendererSize.x : 0;
    const height = this.enabled ? rendererSize.y : 0;
    this._size.set(width, height);
  }

  /** {@link Resizeable.getSize}. */
  getSize() {
    return this._size;
  }

  private setupEvents(active: boolean) {
    if (active) {
      window.addEventListener("resize", this.onResize);
    } else {
      window.removeEventListener("resize", this.onResize);
    }
  }

  private onResize = () => {
    this.resize();
  };

  private setUI() {
    const undoDrawingBtn = new Button(this.components, {
      materialIconName: "undo",
    });
    undoDrawingBtn.onClick.add(() => {
      if (this._viewport.lastChild) {
        this._undoList.push(this._viewport.lastChild);
        this._viewport.lastChild.remove();
      }
    });

    const redoDrawingBtn = new Button(this.components, {
      materialIconName: "redo",
    });
    redoDrawingBtn.onClick.add(() => {
      const childNode = this._undoList[this._undoList.length - 1];
      if (childNode) {
        this._undoList.pop();
        this._viewport.append(childNode);
      }
    });

    const clearDrawingBtn = new Button(this.components, {
      materialIconName: "delete",
    });
    clearDrawingBtn.onClick.add(() => this.clear());

    // #region Settings window
    const settingsWindow = new FloatingWindow(this.components, this.id);
    settingsWindow.title = "Drawing Settings";
    settingsWindow.visible = false;
    this.components.ui.add(settingsWindow);

    const strokeWidth = new RangeInput(this.components);
    strokeWidth.label = "Stroke Width";
    strokeWidth.min = 2;
    strokeWidth.max = 6;
    strokeWidth.value = 4;

    strokeWidth.onChange.add((value) => {
      this.config.strokeWidth = value;
    });

    const strokeColorInput = new ColorInput(this.components);
    strokeColorInput.label = "Stroke Color";
    strokeColorInput.value = this.config.strokeColor;

    strokeColorInput.onChange.add((value) => {
      this.config.strokeColor = value;
    });

    const fillColorInput = new ColorInput(this.components);
    fillColorInput.label = "Fill Color";
    fillColorInput.value = this.config.fillColor;

    fillColorInput.onChange.add((value) => {
      this.config.fillColor = value;
    });

    settingsWindow.addChild(strokeColorInput, fillColorInput, strokeWidth);

    const settingsBtn = new Button(this.components, {
      materialIconName: "settings",
    });
    settingsBtn.onClick.add(() => {
      settingsWindow.visible = !settingsWindow.visible;
      settingsBtn.active = settingsWindow.visible;
    });

    settingsWindow.onHidden.add(() => (settingsBtn.active = false));

    const toolbar = new Toolbar(this.components, { position: "top" });

    toolbar.addChild(
      settingsBtn,
      undoDrawingBtn,
      redoDrawingBtn,
      clearDrawingBtn
    );

    this.uiElement.set({ toolbar, settingsWindow });
  }
}
