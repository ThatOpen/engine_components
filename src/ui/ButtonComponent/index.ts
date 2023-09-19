import {
  createPopper,
  Placement,
  Instance as PopperInstance,
  // @ts-ignore
} from "@popperjs/core/dist/esm";
import { Event } from "../../base-types";
import { Toolbar } from "../ToolbarComponent";
import { Components } from "../../core";
import { SimpleUIComponent } from "../SimpleUIComponent";

interface IButtonOptions {
  materialIconName?: string;
  iconURL?: string;
  id?: string;
  name?: string;
  tooltip?: string;
  closeOnClick?: boolean;
}

export class Button extends SimpleUIComponent<HTMLButtonElement> {
  name: string = "TooeenButton";
  menu: Toolbar;

  readonly onClick = new Event<any>();

  static Class = {
    Base: `
    relative flex gap-x-2 items-center bg-transparent text-white rounded-[10px] 
    max-h-8 p-2 hover:cursor-pointer hover:bg-ifcjs-200 hover:text-black
    data-[active=true]:cursor-pointer data-[active=true]:bg-ifcjs-200 data-[active=true]:text-black
    disabled:cursor-default disabled:bg-gray-600 disabled:text-gray-400 pointer-events-auto
    transition-all fill-white hover:fill-black
    `,
    Label: "text-sm tracking-[1.25px] whitespace-nowrap",
    Tooltip: `
    transition-opacity bg-ifcjs-100 text-sm text-gray-100 rounded-md 
    absolute left-1/2 -translate-x-1/2 -translate-y-12 opacity-0 mx-auto p-4 w-max h-4 flex items-center
    pointer-events-none
    `,
  };

  protected _parent: Toolbar | null = null;
  private _closeOnClick = true;
  private _popper: PopperInstance;

  set tooltip(value: string | null) {
    const element = this.innerElements.tooltip;
    element.textContent = value;
    if (value) {
      element.classList.remove("hidden");
    } else {
      element.classList.add("hidden");
    }
  }

  get tooltip() {
    return this.innerElements.tooltip.textContent;
  }

  set label(value: string | null) {
    const element = this.innerElements.label;
    element.textContent = value;
    if (value) {
      element.classList.remove("hidden");
    } else {
      element.classList.add("hidden");
    }
  }

  get label() {
    return this.innerElements.label.textContent;
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

  set materialIcon(name: string | null) {
    const icon = this.innerElements.icon;
    icon.textContent = name;
    if (name) {
      icon.style.display = "unset";
    } else {
      icon.style.display = "none";
    }
  }

  get materialIcon() {
    return this.innerElements.icon.textContent;
  }

  get customIcon() {
    return this.innerElements.customIcon.innerHTML;
  }

  innerElements: {
    icon: HTMLSpanElement;
    customIcon: HTMLSpanElement;
    label: HTMLParagraphElement;
    tooltip: HTMLSpanElement;
  };

  constructor(components: Components, options?: IButtonOptions) {
    const template = `
    <button class="${Button.Class.Base}">
      <span style="display: none" id="custom-icon" class="md-18"></span> 
      <span style="display: none" id="icon" class="material-icons md-18"></span> 
      <span id="tooltip" class="${Button.Class.Tooltip}"></span> 
      <p id="label" class="${Button.Class.Label}"></p>
    </button>
    `;
    super(components, template);

    this.innerElements = {
      customIcon: this.getInnerElement("custom-icon") as HTMLSpanElement,
      icon: this.getInnerElement("icon") as HTMLSpanElement,
      label: this.getInnerElement("label") as HTMLParagraphElement,
      tooltip: this.getInnerElement("tooltip") as HTMLSpanElement,
    };

    this.materialIcon = options?.materialIconName ?? null;
    this.label = options?.name ?? null;
    this.tooltip = options?.tooltip ?? null;
    this.alignment = "start";
    if (options?.closeOnClick !== undefined) {
      this._closeOnClick = options.closeOnClick;
    }

    this.domElement.onclick = async (e) => {
      e.stopImmediatePropagation();

      await this.onClick.trigger(e);

      if (this.menu.children.length) {
        this.menu.visible = true;
        this._popper.update();
      } else if (this._closeOnClick) {
        this._components.ui.closeMenus();
        this._components.ui.contextMenu.visible = false;

        if (this.parent) {
          if (!this.parent.parent) {
            this._components.ui.closeMenus();
          }
          if (this.parent.closeMenus) {
            this.parent.closeMenus();
          }
        }
      }
    };

    this.domElement.addEventListener("mouseover", ({ target }) => {
      if (this.isButton(target)) {
        if (this._components.ui.tooltipsEnabled) {
          this.innerElements.tooltip.classList.remove("opacity-0");
        }
      }
    });

    this.domElement.addEventListener("mouseleave", ({ target }) => {
      if (this.isButton(target)) {
        this.innerElements.tooltip.classList.add("opacity-0");
      }
    });

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

    this.onEnabled.add(() => (this.domElement.disabled = false));
    this.onDisabled.add(() => (this.domElement.disabled = true));
  }

  async dispose(onlyChildren = false) {
    await super.dispose(onlyChildren);
    await this.menu.dispose();
    if (!onlyChildren) {
      this.domElement.remove();
    }
    this.onClick.reset();
    this._popper.destroy();
  }

  addChild(...button: Button[]) {
    this.menu.addChild(...button);
  }

  closeMenus() {
    this.menu.closeMenus();
    this.menu.visible = false;
  }

  async setCustomIcon(url: string | null) {
    const { customIcon } = this.innerElements;
    if (url) {
      const response = await fetch(url);
      customIcon.innerHTML = await response.text();
      customIcon.style.display = "unset";
    } else {
      customIcon.style.display = "none";
    }
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

  private isButton(element: any) {
    return (
      element === this.get() ||
      element === this.innerElements.icon ||
      element === this.innerElements.label
    );
  }
}
