import {
  createPopper,
  Placement,
  Instance as PopperInstance,
  // @ts-ignore
} from "@popperjs/core/dist/esm";
import { Component, Components, Hideable, UIComponent } from "../../types";
import { Toolbar } from "../ToolbarComponent";

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

  private _closeOnClick = true;

  #enabled: boolean = true;
  #visible: boolean = true;
  #parent!: Toolbar;
  #popper: PopperInstance;
  #active: boolean = false;

  get active() {
    return this.#active;
  }
  set active(active: boolean) {
    this.domElement.setAttribute("data-active", String(active));
    this.#active = active;
  }

  set visible(visible: boolean) {
    this.#visible = visible;
  } // Not implemented yet.
  get visible() {
    return this.#visible;
  }

  set enabled(enabled: boolean) {
    this.domElement.disabled = !enabled;
    this.#enabled = enabled;
  }

  get enabled() {
    return this.#enabled;
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
    this.#parent = toolbar;
    this.menu.position = toolbar.position;
    this.#updateMenuPlacement();
  }

  get parent() {
    return this.#parent;
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
      btn.classList.add("tooeen-button");
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
      this.#popper.update();
    };

    // #region Extensible menu
    this.menu = new Toolbar(components);
    this.menu.visible = false;
    this.menu.parent = this;
    this.menu.domElement.classList.add("vtoolbar");
    this.domElement.append(this.menu.domElement);
    this.#popper = createPopper(this.domElement, this.menu.domElement, {
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

  #updateMenuPlacement() {
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
    this.#popper.setOptions({ placement });
  }
}
