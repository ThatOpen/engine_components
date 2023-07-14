import {
  createPopper,
  Placement,
  Instance as PopperInstance,
} from "@popperjs/core";
import { Event } from "../../base-types/base-types";
import { Toolbar } from "../ToolbarComponent";
import { Components } from "../../core/Components";
import { SimpleUIComponent } from "../SimpleUIComponent";

interface IButtonOptions {
  materialIconName?: string;
  id?: string;
  name?: string;
  tooltip?: string;
  closeOnClick?: boolean;
}

export class Button extends SimpleUIComponent<HTMLButtonElement> {
  name: string = "TooeenButton";
  menu: Toolbar;

  onClicked = new Event<any>();

  static Class = {
    Base: `
    relative flex gap-x-2 items-center justify-start bg-transparent text-white text-base rounded-md h-fit p-2
    hover:cursor-pointer hover:bg-ifcjs-200 hover:text-ifcjs-100
    data-[active=true]:cursor-pointer data-[active=true]:bg-ifcjs-200 data-[active=true]:text-ifcjs-100
    disabled:cursor-default disabled:bg-transparent disabled:text-gray-500
    transition-all
    `,
    Label: "text-base whitespace-nowrap",
  };

  private _closeOnClick = true;
  private _parent!: Toolbar;
  private _popper: PopperInstance;
  private _label: string | null = null;
  private _labelElement = document.createElement("p");

  set label(value: string | null) {
    this._label = null;
    this._labelElement.textContent = value;
    if (value) {
      this._labelElement.classList.remove("hidden");
    } else {
      this._labelElement.classList.add("hidden");
    }
  }

  get label() {
    return this._label;
  }

  set onclick(listener: (e?: MouseEvent) => void) {
    this.domElement.onclick = (e) => {
      e.stopImmediatePropagation();
      listener(e);
      if (this._closeOnClick) {
        this._components.ui.closeMenus();
        this._components.ui.contextMenu.visible = false;
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
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = Button.Class.Base;
    super(components, btn, options?.id);
    this._labelElement.className = Button.Class.Label;
    this.label = options?.name ? options.name : null;
    if (options?.materialIconName) {
      const icon = document.createElement("span");
      icon.className = "material-icons md-18";
      icon.textContent = options?.materialIconName;
      btn.append(icon);
    }
    this.domElement.append(this._labelElement);
    if (options?.closeOnClick !== undefined) {
      this._closeOnClick = options.closeOnClick;
    }

    this.domElement.onclick = (e) => {
      e.stopImmediatePropagation();
      if (!this.parent?.parent) {
        this._components.ui.closeMenus();
      }
      this.parent?.closeMenus();
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
          options: { boundary: this._components.ui.viewerContainer },
        },
      ],
    });
    // #endregion

    this.onEnabled.on(() => (this.domElement.disabled = false));
    this.onDisabled.on(() => (this.domElement.disabled = true));
  }

  dispose(onlyChildren = false) {
    this.menu.dispose();
    if (!onlyChildren) {
      this.domElement.remove();
    }
  }

  addChild(...button: Button[]) {
    this.menu.addChild(...button);
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
