import { Component, UI } from "../../../base-types";
import { TreeView } from "../../../ui";
import { FragmentHighlighter } from "../../FragmentHighlighter";
import { FragmentGrouper } from "../../FragmentGrouper";
import { Components } from "../../../core/Components";

interface TreeItem {
  name: string;
  filter: { [groupSystemName: string]: string };
  children: TreeItem[];
}

interface FragmentTreeItemOptions {
  selectionHighlighterName: string;
  highlightHighlighterName: string;
}

export class FragmentTreeItem extends Component<TreeItem> implements UI {
  name: string;
  enabled: boolean = true;
  filter: { [groupSystemName: string]: string } = {};
  components: Components;
  uiElement: TreeView;
  private _children: FragmentTreeItem[] = [];
  private readonly _options: FragmentTreeItemOptions;

  get children() {
    return this._children;
  }

  set children(children: FragmentTreeItem[]) {
    this._children = children;
    children.forEach((child) => this.uiElement.addChild(child.uiElement));
  }

  constructor(
    components: Components,
    private _fragmentHighlighter: FragmentHighlighter,
    private _fragmentGrouper: FragmentGrouper,
    name: string,
    config?: FragmentTreeItemOptions
  ) {
    super();
    this.components = components;
    this.name = name;
    const defaultConfig: FragmentTreeItemOptions = {
      selectionHighlighterName: "select",
      highlightHighlighterName: "highlight",
    };
    this._options = { ...defaultConfig, ...config };
    this.uiElement = new TreeView(this.components, name);
    this.uiElement.onclick = () => this.select();
    this.uiElement.onmouseover = () => this.highlight();
  }

  get(): TreeItem {
    return { name: this.name, filter: this.filter, children: this.children };
  }

  select() {
    const selectorName = this._options.selectionHighlighterName;
    this._fragmentHighlighter.highlightByID(
      selectorName,
      this._fragmentGrouper.find(this.filter)
    );
  }

  highlight() {
    const highlighterName = this._options.highlightHighlighterName;
    this._fragmentHighlighter.highlightByID(
      highlighterName,
      this._fragmentGrouper.find(this.filter)
    );
  }
}
