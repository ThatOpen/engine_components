import {
  Component,
  UI,
  Event,
  FragmentIdMap,
  UIElement,
} from "../../../base-types";
import { TreeView, Button } from "../../../ui";
import { Components } from "../../../core";
import { FragmentClassifier } from "../../FragmentClassifier";

interface TreeItem {
  name: string;
  filter: { [groupSystemName: string]: string[] };
  children: TreeItem[];
}

export class FragmentTreeItem extends Component<TreeItem> implements UI {
  name = "FragmentTreeItem";
  enabled: boolean = true;
  filter: { [name: string]: string[] } = {};
  uiElement = new UIElement<{ main: Button; tree: TreeView }>();

  onSelected = new Event<FragmentIdMap>();
  onHovered = new Event<FragmentIdMap>();

  private _children: FragmentTreeItem[] = [];

  get children() {
    return this._children;
  }

  set children(children: FragmentTreeItem[]) {
    this._children = children;
    children.forEach((child) => {
      const subTree = child.uiElement.get("tree");
      this.uiElement.get("tree").addChild(subTree);
    });
  }

  constructor(
    components: Components,
    classifier: FragmentClassifier,
    content: string
  ) {
    super(components);

    const main = new Button(components);
    const tree = new TreeView(components, content);

    this.uiElement.set({ main, tree });
    tree.onClick.add(async () => {
      const found = await classifier.find(this.filter);
      await this.onSelected.trigger(found);
    });

    tree.get().onmouseenter = async () => {
      const found = await classifier.find(this.filter);
      await this.onHovered.trigger(found);
    };
  }

  async dispose() {
    this.uiElement.dispose();
    this.onSelected.reset();
    this.onHovered.reset();
    for (const child of this.children) {
      await child.dispose();
    }
  }

  get(): TreeItem {
    return { name: this.name, filter: this.filter, children: this.children };
  }
}
