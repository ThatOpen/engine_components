import { Component, Hideable, UIComponent } from "../../base-types";
import { Button } from "../ButtonComponent";
import { IContainerPosition } from "../UIManager";
import { Components } from "../../core";

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
    this.domElement.style.display =
      visible && this.hasElements ? "flex" : "none";
    this._visible = visible && this.hasElements;
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
    this.domElement.classList.add("tooeen-toolbar");
    this.position = _options.position;
    this.visible = true;
  }

  dispose(onlyChildren = false) {
    this.children.forEach( button => button.dispose() )
    if (!onlyChildren) { this.domElement.remove() }
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
    this.domElement.classList.remove("htoolbar", "vtoolbar");
    this.domElement.classList.add(`${direction[0]}toolbar`);
  }
}
