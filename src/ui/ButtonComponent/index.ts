import {
  createPopper,
  Placement,
  Instance as PopperInstance,
  // @ts-ignore
} from "@popperjs/core/dist/esm";
import { Hideable, UIComponent, Event } from "../../base-types/base-types";
import { Component } from "../../base-types/component";
import { Toolbar } from "../ToolbarComponent";
import { Components } from "../../core";

interface IButtonOptions {
  element?: HTMLButtonElement;
  materialIconName?: string;
  id?: string;
  name?: string;
  tooltip?: string;
  closeOnClick?: boolean;
}

export class Button
  extends Component<HTMLButtonElement>
  implements Hideable, UIComponent
{
  name: string;
  domElement: HTMLButtonElement;
  menu: Toolbar;
  components: Components;

  clicked = new Event();

  private _closeOnClick = true;
  private _enabled: boolean = true;
  private _visible: boolean = true;
  private _parent!: Toolbar;
  private _popper: PopperInstance;
  private _active: boolean = false;

  get active() {
    return this._active;
  }
  set active(active: boolean) {
    this.domElement.setAttribute("data-active", String(active));
    this._active = active;
  }

  set visible(visible: boolean) {
    this._visible = visible;
  } // Not implemented yet.
  get visible() {
    return this._visible;
  }

  set enabled(enabled: boolean) {
    this.domElement.disabled = !enabled;
    this._enabled = enabled;
  }

  get enabled() {
    return this._enabled;
  }

  set onclick(listener: (e?: MouseEvent) => void) {
    this.domElement.onclick = (e) => {
      e.stopImmediatePropagation();
      listener(e);
      if (this._closeOnClick) {
        this.components.ui.closeMenus();
        this.components.ui.contextMenu.visible = false;
      }
    };
  }

  set parent(toolbar: Toolbar) {
    this._parent = toolbar;
    this.menu.position = toolbar.position;
    this.updateMenuPlacement();
  }

  get parent() {
    return this._parent;
  }

  constructor(components: Components, options?: IButtonOptions) {
    super();
    this.components = components;
    this.name = options?.name ?? "Custom Button";
    if (options?.element) {
      this.domElement = options.element;
    } else {
      const btn = document.createElement("button");
      btn.id = options?.materialIconName ?? "";
      btn.className = `
      relative flex gap-x-2 items-center bg-transparent text-white rounded-md h-fit p-2
      hover:cursor-pointer hover:bg-ifcjs-200 hover:text-ifcjs-100
      data-[active=true]:cursor-pointer data-[active=true]:bg-ifcjs-200 data-[active=true]:text-ifcjs-100
      disabled:cursor-default disabled:bg-transparent disabled:text-gray-500
      transition-all
      `;
      this.domElement = btn;
      if (options?.materialIconName) {
        const icon = document.createElement("span");
        icon.className = "material-icons md-18";
        icon.innerText = options?.materialIconName;
        btn.append(icon);
      }
      if (options?.name) {
        const name = document.createElement("p");
        name.style.whiteSpace = "nowrap";
        name.innerText = options.name;
        this.domElement.append(name);
      }
      if (options?.closeOnClick !== undefined) {
        this._closeOnClick = options.closeOnClick;
      }
    }

    this.domElement.onclick = (e) => {
      e.stopImmediatePropagation();
      // @ts-ignore
      if (!this.parent?.parent && this.components.ui) {
        this.components.ui.closeMenus();
      }
      this.menu.visible = true;
      this._popper.update();
    };

    // #region Extensible menu
    this.menu = new Toolbar(components);
    this.menu.visible = false;
    this.menu.parent = this;
    this.menu.setDirection("vertical");
    this.domElement.append(this.menu.domElement);
    this._popper = createPopper(this.domElement, this.menu.domElement, {
      modifiers: [
        {
          name: "offset",
          options: { offset: [0, 15] },
        },
        {
          name: "preventOverflow",
          // @ts-ignore
          options: { boundary: this.components.ui.viewerContainer },
        },
      ],
    });
    // #endregion
  }

  dispose(onlyChildren = false) {
    this.menu.dispose();
    if (!onlyChildren) {
      this.domElement.remove();
    }
  }

  get(): HTMLButtonElement {
    return this.domElement;
  }

  addButton(...button: Button[]) {
    this.menu.addButton(...button);
  }

  closeMenus() {
    this.menu.closeMenus();
    this.menu.visible = false;
  }

  private updateMenuPlacement() {
    let placement: Placement = "bottom";
    if (this.parent?.position === "bottom") {
      placement = this.parent?.parent ? "right" : "top";
    }
    if (this.parent?.position === "top") {
      placement = this.parent?.parent ? "right" : "bottom";
    }
    if (this.parent?.position === "left") {
      placement = "right";
    }
    if (this.parent?.position === "right") {
      placement = "left";
    }
    this._popper.setOptions({ placement });
  }
}
