import { Component, UI, Event } from "../../../base-types";
import { TreeView } from "../../../ui";
import { Components } from "../../../core";
import { FragmentClassifier } from "../../FragmentClassifier";

interface TreeItem {
  name: string;
  filter: { [groupSystemName: string]: string };
  children: TreeItem[];
}

export class FragmentTreeItem extends Component<TreeItem> implements UI {
  name = "FragmentTreeItem";
  enabled: boolean = true;
  filter: { [name: string]: string } = {};
  components: Components;
  uiElement: TreeView;

  selected = new Event<{ [name: string]: string[] }>();
  hovered = new Event<{ [name: string]: string[] }>();

  private _children: FragmentTreeItem[] = [];

  get children() {
    return this._children;
  }

  set children(children: FragmentTreeItem[]) {
    this._children = children;
    children.forEach((child) => this.uiElement.addChild(child.uiElement));
  }

  constructor(
    components: Components,
    classifier: FragmentClassifier,
    content: string
  ) {
    super();
    this.components = components;
    this.uiElement = new TreeView(this.components, content);
    this.uiElement.onclick = () => {
      const found = classifier.find(this.filter);
      this.selected.trigger(found);
    };
    this.uiElement.onmouseover = () => {
      const found = classifier.find(this.filter);
      this.hovered.trigger(found);
    };
  }

  dispose() {
    this.uiElement.dispose();
    this.selected.reset();
    this.hovered.reset();
    for (const child of this.children) {
      child.dispose();
    }
  }

  get(): TreeItem {
    return { name: this.name, filter: this.filter, children: this.children };
  }
}
