import { UIComponent, Event } from "../../base-types/base-types";
import { Components } from "../../core";
import { SimpleUIComponent } from "../SimpleUIComponent";
import { UIComponentsStack } from "../UIComponentsStack";
import { TreeTitle } from "./src/tree-title";

export class TreeView extends SimpleUIComponent<HTMLDivElement> {
  titleElement: TreeTitle;
  private _childrenContainer: UIComponentsStack;
  private _expanded: boolean = true;

  readonly onExpand = new Event();
  readonly onCollapse = new Event();

  get expanded() {
    return this._expanded;
  }

  set expanded(expanded: boolean) {
    this._expanded = expanded;
    this._childrenContainer.visible = expanded;
    if (expanded) {
      this.onExpand.trigger();
      this.titleElement.get().classList.add("bg-ifcjs-120");
    } else {
      this.onCollapse.trigger();
      this.titleElement.get().classList.remove("bg-ifcjs-120");
    }
  }

  set onclick(listener: (e?: MouseEvent) => void) {
    this.domElement.onclick = (e) => {
      e.stopImmediatePropagation();
      listener(e);
    };
  }

  set onmouseover(listener: (e?: MouseEvent) => void) {
    this.domElement.onmouseover = (e) => {
      e.stopImmediatePropagation();
      listener(e);
    };
  }

  constructor(components: Components, name?: string) {
    const div = document.createElement("div");
    div.className = `
    flex flex-col items-start w-full box-border cursor-pointer text-base
    `;
    super(components, div);
    this.titleElement = new TreeTitle(components);
    this.titleElement.title = name;
    this.titleElement.arrow.onclick = () => {
      this.toggle();
    };

    this._childrenContainer = new UIComponentsStack(components, "Vertical");
    this._childrenContainer.get().classList.add("pl-[22px]", "w-full");
    this.collapse();

    div.append(this.titleElement.get(), this._childrenContainer.get());
  }

  dispose(onlyChildren = false) {
    this.children.forEach((child) => child.dispose());
    if (!onlyChildren) {
      this.domElement.remove();
      this._childrenContainer.dispose();
    }
  }

  toggle(deep = false) {
    if (deep) {
      if (this.expanded) {
        this.collapse();
      } else {
        this.expand();
      }
    } else {
      this.expanded = !this.expanded;
    }
  }

  addChild(...items: UIComponent[]) {
    items.forEach((item) => {
      this.children.push(item);
      this._childrenContainer.addChild(item);
    });
  }

  collapse(deep = true) {
    if (!this.expanded) return;
    this.expanded = false;
    if (!deep) return;
    for (const child of this.children)
      if (child instanceof TreeView) child.collapse(deep);
  }

  expand(deep = true) {
    if (this.expanded) return;
    this.expanded = true;
    if (!deep) return;
    for (const child of this.children)
      if (child instanceof TreeView) child.expand(deep);
  }
}
