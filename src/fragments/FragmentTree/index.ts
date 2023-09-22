import {
  Component,
  Disposable,
  Event,
  FragmentIdMap,
  UI,
  UIElement,
} from "../../base-types";
import { FragmentTreeItem } from "./src/tree-item";
import { Components, ToolComponent } from "../../core";
import { FragmentClassifier } from "../FragmentClassifier";
import { Button, FloatingWindow } from "../../ui";

export class FragmentTree
  extends Component<FragmentTreeItem>
  implements UI, Disposable
{
  static readonly uuid = "5af6ebe1-26fc-4053-936a-801b6c7cb37e" as const;

  enabled: boolean = true;
  onSelected = new Event<FragmentIdMap>();

  onHovered = new Event<FragmentIdMap>();

  private _title = "Model Tree";
  private _tree?: FragmentTreeItem;

  uiElement = new UIElement<{ main: Button; window: FloatingWindow }>();

  constructor(components: Components) {
    super(components);

    this.components.tools.add(FragmentTree.uuid, this);
  }

  get(): FragmentTreeItem {
    if (!this._tree) {
      throw new Error("Fragment tree not initialized yet!");
    }
    return this._tree;
  }

  async init() {
    const classifier = await this.components.tools.get(FragmentClassifier);
    const tree = new FragmentTreeItem(
      this.components,
      classifier,
      "Model Tree"
    );
    this._tree = tree;
    if (this.components.ui.enabled) {
      this.setupUI(tree);
    }
  }

  async dispose() {
    this.onSelected.reset();
    this.onHovered.reset();
    this.uiElement.dispose();
    if (this._tree) {
      await this._tree.dispose();
    }
  }

  async update(groupSystems: string[]) {
    if (!this._tree) return;
    const classifier = await this.components.tools.get(FragmentClassifier);
    if (this._tree.children.length) {
      await this._tree.dispose();
      this._tree = new FragmentTreeItem(
        this.components,
        classifier,
        this._title
      );
    }
    this._tree.children = await this.regenerate(groupSystems);
  }

  private setupUI(tree: FragmentTreeItem) {
    const window = new FloatingWindow(this.components);
    const subTree = tree.uiElement.get("tree");
    window.addChild(subTree);
    window.title = "Model tree";
    this.components.ui.add(window);
    window.visible = false;

    const main = new Button(this.components);
    main.materialIcon = "account_tree";
    main.tooltip = "Model tree";
    main.onClick.add(() => {
      window.visible = !window.visible;
    });

    this.uiElement.set({ main, window });
  }

  private async regenerate(groupSystemNames: string[], result = {}) {
    const classifier = await this.components.tools.get(FragmentClassifier);
    const systems = classifier.get();
    const groups: FragmentTreeItem[] = [];
    const currentSystemName = groupSystemNames[0]; // storeys
    const systemGroups = systems[currentSystemName];
    if (!currentSystemName || !systemGroups) {
      return groups;
    }
    for (const name in systemGroups) {
      // name is N00, N01, N02...
      // { storeys: "N00" }, { storeys: "N01" }...
      const classifier = await this.components.tools.get(FragmentClassifier);
      const filter = { ...result, [currentSystemName]: [name] };
      const found = await classifier.find(filter);
      const hasElements = Object.keys(found).length > 0;
      if (hasElements) {
        const firstLetter = currentSystemName[0].toUpperCase();
        const treeItemName = firstLetter + currentSystemName.slice(1); // Storeys

        const treeItem = new FragmentTreeItem(
          this.components,
          classifier,
          `${treeItemName}: ${name}`
        );

        treeItem.onHovered.add((result) => this.onHovered.trigger(result));
        treeItem.onSelected.add((result) => this.onSelected.trigger(result));

        treeItem.filter = filter;
        groups.push(treeItem);
        treeItem.children = await this.regenerate(
          groupSystemNames.slice(1),
          filter
        );
      }
    }
    return groups;
  }
}

ToolComponent.libraryUUIDs.add(FragmentTree.uuid);
