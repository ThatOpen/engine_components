import { Event } from "../../../base-types";
import { Components } from "../../../core";
import { Button, SimpleUIComponent } from "../../../ui";
import { QueryGroupUI } from "./query-group";
import { QueryGroup } from "./types";

export class QueryBuilder extends SimpleUIComponent {
  findButton: Button;

  readonly onQuerySet = new Event<QueryGroup[]>();

  get query() {
    const queriesMap = this.children.map((child) => {
      if (!(child instanceof QueryGroupUI)) return null;
      return child.query;
    });
    return queriesMap.filter((query) => query !== null) as QueryGroup[];
  }

  set query(value: QueryGroup[]) {
    for (const child of this.children) {
      if (child instanceof QueryGroupUI) {
        this.removeChild(child);
        child.dispose();
      }
    }
    let first = true;
    for (const [index, group] of value.entries()) {
      if (index === 0 && group.operator) {
        delete group.operator;
      }
      const attributeQueryUI = new QueryGroupUI(this._components);
      attributeQueryUI.removeBtn.visible = true;
      attributeQueryUI.query = group;
      this.addChild(attributeQueryUI);
      if (first) {
        first = false;
        attributeQueryUI.removeBtn.visible = false;
      }
    }
    this.get().append(this.findButton.get());
    this.onQuerySet.trigger(value);
  }

  constructor(components: Components) {
    super(components, `<div class="flex flex-col gap-y-3"></div>`);

    this.findButton = new Button(this._components, {
      materialIconName: "search",
    });
    this.findButton.label = "Find";
    this.findButton.alignment = "center";
    this.findButton
      .get()
      .classList.add(
        "border",
        "border-solid",
        "border-ifcjs-120",
        "hover:border-ifcjs-200"
      );

    const topContainer = new SimpleUIComponent(
      this._components,
      `<div class="flex gap-x-2 w-fit ml-auto"></div>`
    );

    const newGroupBtn = new Button(this._components, {
      materialIconName: "add",
    });
    newGroupBtn.get().classList.add("w-fit");
    newGroupBtn.label = "Add Group";
    newGroupBtn.onClick.add(() => {
      const queryGroup = new QueryGroupUI(this._components);
      queryGroup.operator.visible = true;
      queryGroup.operator.value = queryGroup.operator.options[0];
      queryGroup.removeBtn.visible = true;
      this.addChild(queryGroup);
      this.get().append(this.findButton.get());
    });

    const resetBtn = new Button(this._components, {
      materialIconName: "refresh",
    });
    resetBtn.label = "Reset";

    topContainer.addChild(newGroupBtn);

    const queryEditor = new QueryGroupUI(this._components);

    this.addChild(topContainer, queryEditor, this.findButton);

    // this.query = [
    //   {
    //     queries: [
    //       { attribute: "Name", condition: "includes", value: "Acabado" },
    //       {
    //         operator: "AND",
    //         attribute: "PredefinedType",
    //         condition: "is",
    //         value: "FLOOR",
    //       },
    //     ],
    //   },
    // ];
  }

  async dispose(onlyChildren: boolean = false) {
    await super.dispose(onlyChildren);
    await this.findButton.dispose();
    this.onQuerySet.reset();
  }
}
