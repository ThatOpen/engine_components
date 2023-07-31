import {
  createPopper,
  Placement,
  Instance as PopperInstance,
  // @ts-ignore
} from "@popperjs/core/dist/esm";
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
    group relative flex gap-x-2 items-center bg-transparent text-white rounded-[10px] 
    h-fit p-2 hover:cursor-pointer hover:bg-ifcjs-200 hover:text-black
    data-[active=true]:cursor-pointer data-[active=true]:bg-ifcjs-200 data-[active=true]:text-black
    disabled:cursor-default disabled:bg-gray-600 disabled:text-gray-400 pointer-events-auto
    transition-all
    `,
    Label: "text-sm uppercase tracking-[1.25px] font-bold whitespace-nowrap",
    Tooltip: `
    group-hover:opacity-100 transition-opacity bg-ifcjs-100 text-sm text-gray-100 rounded-md 
    absolute left-1/2 -translate-x-1/2 -translate-y-12 opacity-0 mx-auto p-4 w-max h-4 flex items-center
    pointer-events-none
    `,
  };

  protected _parent: Toolbar | null = null;
  private _closeOnClick = true;
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

  set parent(toolbar: Toolbar | null) {
    this._parent = toolbar;
    if (toolbar) {
      this.menu.position = toolbar.position;
      this.updateMenuPlacement();
    }
  }

  get parent() {
    return this._parent;
  }

  set alignment(value: "start" | "center" | "end") {
    this.domElement.classList.remove(
      "justify-start",
      "justify-center",
      "justify-end"
    );
    this.domElement.classList.add(`justify-${value}`);
  }

  constructor(components: Components, options?: IButtonOptions) {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = Button.Class.Base;
    super(components, btn, options?.id);
    this._labelElement.className = Button.Class.Label;
    this.label = options?.name ? options.name : null;
    this.alignment = "start";
    if (options?.materialIconName) {
      const icon = document.createElement("span");
      icon.className = "material-icons md-18";
      icon.textContent = options?.materialIconName;
      btn.append(icon);
    }
    if (options?.tooltip) {
      const tooltip = document.createElement("span");
      tooltip.textContent = options.tooltip;
      tooltip.className = Button.Class.Tooltip;
      btn.append(tooltip);
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
