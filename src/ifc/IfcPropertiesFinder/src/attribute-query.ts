import { Components } from "../../../core";
import { SimpleUIComponent, Dropdown, Button, TextInput } from "../../../ui";

import { AttributeQuery, QueryConditions, QueryOperators } from "./types";
import { IfcCategoryMap } from "../../ifc-category-map";

export class AttributeQueryUI extends SimpleUIComponent {
  operator: Dropdown;
  attribute: Dropdown;
  condition: Dropdown;
  value: TextInput;
  ifcTypes: Dropdown;
  removeBtn: Button;

  negate: Dropdown;

  // Is ok to use Type Assertion in this case?
  get query() {
    const attribute = this.attribute.value as string;
    const condition = this.condition.value as QueryConditions;
    const operator = (this.operator.value as QueryOperators) || null;
    const value =
      attribute === "type"
        ? (this.getTypeConstant(this.ifcTypes.value as string) as number)
        : this.value.value;
    const negateResult = this.negate.value === "NOT A";
    const query: AttributeQuery = {
      attribute,
      condition,
      value,
      negateResult,
      operator,
    };
    if (this.operator.visible)
      query.operator = this.operator.value as QueryOperators;
    return query;
  }

  set query(value: AttributeQuery) {
    if (value.operator) {
      this.operator.value = value.operator;
      this.operator.visible = true;
    }
    this.attribute.value = value.attribute;
    this.condition.value = value.condition;
    this.negate.value = value.negateResult ? "NOT A" : "A";
    if (value.attribute === "type") {
      if (typeof value.value !== "number") {
        throw new Error("Corrupted IfcPropertiesFinder cached data!");
      }
      this.value.value = "";
      this.ifcTypes.value = IfcCategoryMap[value.value];
    } else {
      this.ifcTypes.value = null;
      this.value.value = String(value.value);
    }
  }

  private getTypeConstant(value: string) {
    for (const [key, val] of Object.entries(IfcCategoryMap)) {
      if (val === value) return Number(key);
    }
    return null;
  }

  constructor(components: Components) {
    super(components, `<div class="flex gap-x-2"></div>`);

    this.negate = new Dropdown(components);
    const negateClass = this.negate.domElement.classList;
    negateClass.remove("w-full");
    negateClass.add("min-w-[4.5rem]");
    this.negate.label = "Sign";
    this.negate.addOption("A", "NOT A");
    this.negate.value = "A";

    this.operator = new Dropdown(components);
    this.operator.visible = false;
    this.operator.label = "Operator";
    this.operator.get().style.width = "300px";
    this.operator.addOption("AND", "OR");

    this.attribute = new Dropdown(components);
    this.attribute.label = "Attribute";
    this.attribute.addOption(
      "type",
      "Name",
      "PredefinedType",
      "NominalValue",
      "Description"
    );

    this.attribute.onChange.add((selection) => {
      const attributeIsType = selection === "type";
      this.value.visible = !attributeIsType;
      this.ifcTypes.visible = attributeIsType;
    });

    this.condition = new Dropdown(components);
    this.condition.label = "Condition";
    this.condition.addOption(
      "is",
      "includes",
      "startsWith",
      "endsWith",
      "matches"
    );
    this.condition.value = this.condition.options[0];

    this.value = new TextInput(components);
    this.value.label = "Value";

    this.ifcTypes = new Dropdown(components);
    this.ifcTypes.allowSearch = true;
    this.ifcTypes.visible = false;
    this.ifcTypes.label = "Value";
    for (const type of Object.values(IfcCategoryMap)) {
      this.ifcTypes.addOption(type);
    }
    this.ifcTypes.value = "IFCWALL";

    this.removeBtn = new Button(components, { materialIconName: "remove" });
    this.removeBtn.visible = false;
    this.removeBtn.get().classList.remove("mt-auto", "hover:bg-ifcjs-200");
    this.removeBtn.get().classList.add("mt-auto", "mb-2", "hover:bg-error");
    this.removeBtn.onClick.add(async () => {
      if (this.parent instanceof SimpleUIComponent)
        this.parent.removeChild(this);
      await this.dispose();
    });

    this.addChild(
      this.operator,
      this.attribute,
      this.condition,
      this.negate,
      this.value,
      this.ifcTypes,
      this.removeBtn
    );

    this.attribute.value = "Name";
  }

  async dispose(onlyChildren: boolean = false) {
    await super.dispose(onlyChildren);
    await this.operator.dispose();
    await this.attribute.dispose();
    await this.condition.dispose();
    await this.value.dispose();
    await this.ifcTypes.dispose();
    await this.removeBtn.dispose();
    await this.negate.dispose();
  }
}
