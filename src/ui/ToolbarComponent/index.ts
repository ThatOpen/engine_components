import { Hideable, UIComponent } from "../../base-types/base-types";
import { Component } from "../../base-types/component";
import { Button } from "../ButtonComponent";
import { IContainerPosition } from "../UIManager";
import { Components } from "../../core/Components";

interface IToolbarOptions {
  name?: string;
  position?: IContainerPosition;
}

type IToolbarDirection = "horizontal" | "vertical";

export class Toolbar
  extends Component<HTMLDivElement>
  implements Hideable, UIComponent
{
  name: string;
  domElement: HTMLDivElement = document.createElement("div");
  children: Button[] = [];
  parent?: Button;
  components: Components;

  private _position!: IContainerPosition;
  private _enabled: boolean = true;
  private _visible: boolean = true;

  set visible(visible: boolean) {
    this._visible = visible && this.hasElements;
    if (visible && this.hasElements) {
      this.domElement.classList.remove("hidden");
    } else {
      this.domElement.classList.add("hidden");
    }
  }

  get visible() {
    return this._visible;
  }

  set enabled(enabled: boolean) {
    this.closeMenus();
    this.children.forEach((button) => {
      button.enabled = enabled;
      button.menu.enabled = enabled;
    });
    this._enabled = enabled;
  }

  get enabled() {
    return this._enabled;
  }

  set position(position: IContainerPosition) {
    this._position = position;
    this.updateElements();
  }

  get position() {
    return this._position;
  }

  constructor(components: Components, options?: IToolbarOptions) {
    super();
    this.components = components;
    const _options: Required<IToolbarOptions> = {
      name: "Toolbar",
      position: "bottom",
      ...options,
    };
    this.name = _options.name;
    this.domElement.id = _options.name;
    this.domElement.className =
      "flex shadow-md w-fit h-fit gap-x-2 gap-y-2 p-2 text-white rounded pointer-events-auto bg-ifcjs-100 z-50 backdrop-blur-md";
    this.position = _options.position;
    this.visible = true;
  }

  dispose(onlyChildren = false) {
    this.children.forEach((button) => button.dispose());
    if (!onlyChildren) {
      this.domElement.remove();
    }
  }

  get hasElements() {
    return this.children.length > 0;
  }

  get(): HTMLDivElement {
    return this.domElement;
  }

  addButton(...button: Button[]) {
    button.forEach((btn) => {
      btn.parent = this;
      this.children.push(btn);
      this.domElement.append(btn.domElement);
    });
    // @ts-ignore
    this.components.ui.updateToolbars();
  }

  updateElements() {
    this.children.forEach((button) => (button.parent = this));
  }

  closeMenus() {
    this.children.forEach((button) => button.closeMenus());
  }

  setDirection(direction: IToolbarDirection = "horizontal") {
    this.domElement.classList.remove("flex-col");
    const directionClass = direction === "horizontal" ? ["flex"] : ["flex-col"];
    this.domElement.classList.add(...directionClass);
  }
}
