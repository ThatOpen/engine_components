import { Components } from "../../core";
import { SimpleUIComponent } from "../SimpleUIComponent";
import { Event } from "../../base-types";

// TODO: Fix tooltips for buttons in drawers

export class Drawer extends SimpleUIComponent<HTMLDivElement> {
  onResized = new Event();

  protected _size = "10rem";
  protected _visible = true;
  protected _type: "top" | "bottom" | "left" | "right" = "left";

  slots: {
    content: SimpleUIComponent<HTMLDivElement>;
  };

  get visible() {
    return this._visible;
  }

  set visible(value: boolean) {
    const classes = this.domElement.classList;
    const isHorizontal = this._type === "top" || this._type === "bottom";

    if (isHorizontal) {
      const sign = this._type === "top" ? "-" : "";
      if (value) {
        classes.remove(`${sign}translate-y-full`);
      } else {
        classes.add(`${sign}translate-y-full`);
      }
    } else {
      const sign = this._type === "left" ? "-" : "";
      if (value) {
        classes.remove(`${sign}translate-x-full`);
      } else {
        classes.add(`${sign}translate-x-full`);
      }
    }

    this._visible = value;
  }

  get size() {
    return this._size;
  }

  set size(value: string) {
    this._size = value;
    const horizontal = this._type === "top" || this._type === "bottom";
    const height = horizontal ? this._size : "inherit";
    const width = horizontal ? "inherit" : this._size;
    this.domElement.style.height = height;
    this.domElement.style.width = width;
  }

  get containerSize() {
    const height = this.domElement.clientHeight;
    const width = this.domElement.clientWidth;
    return { height, width };
  }

  set alignment(value: typeof Drawer.prototype._type) {
    const classes = this.domElement.classList;

    this._type = value;

    classes.remove("h-full");
    classes.remove("w-full");
    classes.remove("top-0");
    classes.remove("bottom-0");
    classes.remove("left-0");
    classes.remove("right-0");
    classes.remove("-translate-x-full");
    classes.remove("-translate-y-full");
    classes.remove("translate-x-full");
    classes.remove("translate-y-full");

    if (value === "top" || value === "bottom") {
      classes.add("w-full");
      classes.add("left-0");
      classes.add(`${value}-0`);
    } else {
      classes.add("h-full");
      classes.add("top-0");
      classes.add(`${value}-0`);
    }

    this.size = this._size;
    this.visible = this._visible;
  }

  constructor(components: Components) {
    const template = `
        <div class="fixed bg-ifcjs-100 backdrop-blur-xl shadow-md overflow-auto z-20 top-0 left-0 h-full transition-all duration-500 transform text-white">
            <div data-tooeen-slot="content"></div>
        </div>
    `;

    super(components, template);

    this.domElement.style.width = this._size;

    this.slots = {
      content: new SimpleUIComponent(
        components,
        `<div class="flex flex-col gap-y-4 p-4 overflow-auto"></div>`
      ),
    };

    this.setSlots();

    const observer = new ResizeObserver(() => this.onResized.trigger());
    observer.observe(this.get());
  }

  addChild(...items: SimpleUIComponent[]) {
    const content = this.slots.content;
    content.addChild(...items);
    if (!content.visible) content.visible = true;
  }
}
