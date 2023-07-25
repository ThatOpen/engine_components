import { Event } from "../../../base-types";
import { Components } from "../../../core/Components";
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
    const query = queriesMap.filter((query) => query !== null) as QueryGroup[];
    return query;
  }

  set query(value: QueryGroup[]) {
    for (const child of this.children) {
      if (!(child instanceof QueryGroupUI)) continue;
      this.removeChild(child);
      child.dispose();
    }
    for (const [index, group] of value.entries()) {
      if (index === 0 && group.operator) delete group.operator;
      const attributeQueryUI = new QueryGroupUI(this._components);
      attributeQueryUI.query = group;
      this.addChild(attributeQueryUI);
    }
    this.onQuerySet.trigger(value);
  }

  constructor(components: Components) {
    const div = document.createElement("div");
    div.className = "flex-col gap-y-3 flex";
    super(components, div);

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
    this.findButton.onclick = () => {
      this.findButton.onClicked.trigger(this.query);
    };

    const topContainerDiv = document.createElement("div");
    const topContainer = new SimpleUIComponent(
      this._components,
      topContainerDiv
    );
    topContainer.get().classList.add("flex", "gap-x-2", "w-fit", "ml-auto");

    const newGroupBtn = new Button(this._components, {
      materialIconName: "add",
    });
    newGroupBtn.get().classList.add("w-fit");
    newGroupBtn.label = "Add Group";
    newGroupBtn.onclick = () => {
      const queryGroup = new QueryGroupUI(this._components);
      queryGroup.operator.visible = true;
      queryGroup.operator.inputValue = queryGroup.operator.options[0];
      queryGroup.removeBtn.visible = true;
      this.addChild(queryGroup);
      this.get().append(this.findButton.get());
    };

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
}
