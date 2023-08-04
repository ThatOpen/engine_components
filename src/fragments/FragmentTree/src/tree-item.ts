import { Component, UI, Event } from "../../../base-types";
import { TreeView } from "../../../ui/TreeView";
import { Components } from "../../../core";
import { FragmentClassifier } from "../../FragmentClassifier";
import { Button } from "../../../ui/ButtonComponent";

interface TreeItem {
  name: string;
  filter: { [groupSystemName: string]: string[] };
  children: TreeItem[];
}

export class FragmentTreeItem extends Component<TreeItem> implements UI {
  name = "FragmentTreeItem";
  enabled: boolean = true;
  filter: { [name: string]: string[] } = {};
  components: Components;
  uiElement: { main: Button; tree: TreeView };

  selected = new Event<{ [name: string]: string[] }>();
  hovered = new Event<{ [name: string]: string[] }>();

  private _children: FragmentTreeItem[] = [];

  get children() {
    return this._children;
  }

  set children(children: FragmentTreeItem[]) {
    this._children = children;
    children.forEach((child) =>
      this.uiElement.tree.addChild(child.uiElement.tree)
    );
  }

  constructor(
    components: Components,
    classifier: FragmentClassifier,
    content: string
  ) {
    super();
    this.components = components;
    this.uiElement = {
      main: new Button(components),
      tree: new TreeView(components, content),
    };
    this.uiElement.tree.onclick = () => {
      const found = classifier.find(this.filter);
      this.selected.trigger(found);
    };
    this.uiElement.tree.get().onmouseenter = () => {
      const found = classifier.find(this.filter);
      this.hovered.trigger(found);
    };
  }

  dispose() {
    this.uiElement.tree.dispose();
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
