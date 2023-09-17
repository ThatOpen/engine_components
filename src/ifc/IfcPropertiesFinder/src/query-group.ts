import { Components } from "../../../core";
import { SimpleUIComponent, Button, Dropdown } from "../../../ui";

import { AttributeQueryUI } from "./attribute-query";
import { QueryGroup, AttributeQuery, QueryOperators } from "./types";

export class QueryGroupUI extends SimpleUIComponent {
  operator: Dropdown;
  removeBtn: Button;

  get query() {
    const queriesMap = this.children.map((child) => {
      if (!(child instanceof AttributeQueryUI)) return null;
      return child.query;
    });
    const queries = queriesMap.filter(
      (query) => query !== null
    ) as AttributeQuery[];
    const query: QueryGroup = { queries };
    if (this.operator.visible)
      query.operator = this.operator.value as QueryOperators;
    return query;
  }

  set query(value: QueryGroup) {
    if (value.operator) this.operator.value = value.operator;
    for (const child of this.children) {
      if (!(child instanceof AttributeQueryUI)) continue;
      this.removeChild(child);
      child.dispose();
    }
    let first = true;
    for (const [index, query] of value.queries.entries()) {
      // @ts-ignore
      if (!query.condition) continue;
      const attributeQuery = query as AttributeQuery;
      if (index === 0 && attributeQuery.operator) {
        delete attributeQuery.operator;
      }
      const attributeQueryUI = new AttributeQueryUI(this._components);
      attributeQueryUI.query = attributeQuery;
      this.addChild(attributeQueryUI);
      if (first) {
        first = false;
      } else {
        attributeQueryUI.removeBtn.visible = true;
      }
    }
  }

  constructor(components: Components) {
    super(
      components,
      `<div class="flex flex-col gap-y-3 p-3 border border-solid border-ifcjs-120 rounded-md"></div>`
    );

    this.operator = new Dropdown(components);
    this.operator.visible = false;
    this.operator.label = null;
    this.operator.addOption("AND", "OR");

    const topContainer = new SimpleUIComponent(
      components,
      `<div class="flex gap-x-2 w-fit ml-auto"></div>`
    );

    const newRuleBtn = new Button(components, { materialIconName: "add" });
    newRuleBtn.get().classList.add("w-fit");
    newRuleBtn.label = "Add Rule";

    newRuleBtn.onClick.add(() => {
      const propertyQuery = new AttributeQueryUI(components);
      propertyQuery.operator.visible = true;
      propertyQuery.operator.value = propertyQuery.operator.options[0];
      propertyQuery.removeBtn.visible = true;
      this.addChild(propertyQuery);
    });

    const newGroupBtn = new Button(components, { materialIconName: "add" });
    newGroupBtn.get().classList.add("w-fit");
    newGroupBtn.label = "Add Group";

    this.removeBtn = new Button(components, { materialIconName: "delete" });
    this.removeBtn.label = "Delete Group";
    this.removeBtn.visible = false;
    this.removeBtn.onClick.add(async () => {
      if (this.parent instanceof SimpleUIComponent)
        this.parent.removeChild(this);
      await this.dispose();
    });

    topContainer.addChild(newRuleBtn, this.removeBtn);

    const propertyQuery = new AttributeQueryUI(components);

    this.addChild(topContainer, this.operator, propertyQuery);
  }

  async dispose(onlyChildren: boolean = false) {
    await super.dispose(onlyChildren);
    await this.operator.dispose();
    await this.removeBtn.dispose();
  }
}
