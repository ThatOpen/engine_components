import { Component, Disposable, Event, Hideable } from "../../base-types";
import { Components } from "../../core";
import { tooeenRandomId } from "../../utils";

export class SimpleUIComponent<T extends HTMLElement = HTMLElement>
  extends Component<T>
  implements Hideable, Disposable
{
  name: string = "SimpleUIComponent";

  id: string;

  // TODO: Remove children and leave only slots?
  children: SimpleUIComponent<any>[] = [];

  data: Record<string, any> = {};

  // Slots are other UIComponents that inherits all the logic from SimpleUIComponent
  slots: { [name: string]: SimpleUIComponent } = {};

  // InnerElements are those HTML Elements which doesn't come from an UIComponent.
  innerElements: { [name: string]: HTMLElement } = {};

  static Class: { Base: string; [elementName: string]: string };

  readonly onVisible = new Event();
  readonly onHidden = new Event();
  readonly onEnabled = new Event();
  readonly onDisabled = new Event();

  protected _domElement?: T;
  protected _components: Components;
  protected _parent: SimpleUIComponent<any> | null = null;
  protected _enabled: boolean = true;
  protected _visible: boolean = true;
  protected _active: boolean = false;

  get domElement() {
    if (!this._domElement) {
      throw new Error("Dom element not initialized!");
    }
    return this._domElement;
  }

  set domElement(ele: T) {
    if (this._domElement) {
      this._domElement.remove();
    }
    this._domElement = ele;
  }

  set parent(value: SimpleUIComponent<any> | null) {
    this._parent = value;
  }

  get parent() {
    return this._parent;
  }

  get active() {
    return this._active;
  }
  set active(active: boolean) {
    this.domElement.setAttribute("data-active", String(active));
    this._active = active;
  }

  get visible() {
    return this._visible;
  }

  set visible(value: boolean) {
    this._visible = value;
    if (value) {
      this.domElement.classList.remove("hidden");
      this.onVisible.trigger(this.get());
    } else {
      this.domElement.classList.add("hidden");
      this.onHidden.trigger(this.get());
    }
  }

  get enabled() {
    return this._enabled;
  }

  set enabled(value: boolean) {
    this._enabled = value;
    if (value) {
      this.onEnabled.trigger(this.get());
    } else {
      this.onDisabled.trigger(this.get());
    }
    // this.onVisibilityChanged.trigger(value);
  }

  get hasElements() {
    return this.children.length > 0;
  }

  private set template(value: string) {
    const regex = /id="([^"]+)"/g;
    const temp = document.createElement("div");
    temp.innerHTML = value.replace(regex, `id="$1-${this.id}"`);
    const newElement = temp.firstElementChild as T;
    newElement.id = this.id;
    this.domElement = newElement;
    temp.remove();
  }

  constructor(components: Components, template?: string, id?: string) {
    super(components);
    this._components = components;
    this.id = id ?? tooeenRandomId();
    this.template = template ?? "<div></div>";
  }

  cleanData() {
    this.data = {};
  }

  get(): T {
    return this.domElement;
  }

  async dispose(onlyChildren = false) {
    for (const name in this.slots) {
      const slot = this.slots[name];
      await slot.dispose();
    }
    for (const child of this.children) {
      await child.dispose();
      this.removeChild(child);
    }
    for (const name in this.innerElements) {
      const element = this.innerElements[name];
      if (element) {
        element.remove();
      }
    }
    if (!onlyChildren) {
      if (this._domElement) {
        this._domElement.remove();
      }
      this.onVisible.reset();
      this.onHidden.reset();
      this.onEnabled.reset();
      this.onDisabled.reset();
      this.innerElements = {};
      this.children = [];
      this.slots = {};
      (this.parent as any) = null;
    }
  }

  addChild(...items: SimpleUIComponent[]) {
    for (const item of items) {
      this.children.push(item);
      this.domElement.append(item.domElement);
      item.parent = this;
    }
  }

  removeChild(...items: SimpleUIComponent[]) {
    for (const item of items) {
      item.domElement.remove();
      item.parent = null;
    }
    const filtered = this.children.filter((child) => !items.includes(child));
    this.children = filtered;
  }

  removeFromParent() {
    if (!this.parent) return;
    this.get().removeAttribute("data-tooeen-slot");
    this.parent.removeChild(this);
  }

  getInnerElement<T extends HTMLElement>(id: string) {
    return this.get().querySelector(`#${id}-${this.id}`) as T | null;
  }

  setSlot(name: string, uiComponent: SimpleUIComponent) {
    const slot = this.get().querySelector(`[data-tooeen-slot="${name}"]`);
    if (!slot)
      throw new Error(
        `Slot ${name} not found. You need to declare it in the UIComponent template using data-tooeen="${name}"`
      );
    const existingSlot = this.slots[name];
    if (existingSlot) existingSlot.removeFromParent();
    this.slots[name] = uiComponent;
    uiComponent.get().setAttribute("data-tooeen-slot", name);
    slot.replaceWith(uiComponent.get());
    this.children.push(uiComponent);
  }

  setSlots() {
    for (const name in this.slots) {
      const component = this.slots[name];
      this.setSlot(name, component);
    }
  }
}
