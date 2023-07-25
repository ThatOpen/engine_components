import { Components } from "../../../core/Components";
import { SimpleUIComponent } from "../../../ui/SimpleUIComponent";
import { Dropdown } from "../../../ui/Dropdown";
import { Button, TextInput } from "../../../ui";
import { AttributeQuery, QueryConditions, QueryOperators } from "./types";
import { IfcCategoryMap } from "../../ifc-category-map";

export class AttributeQueryUI extends SimpleUIComponent {
  operator: Dropdown;
  attribute: Dropdown;
  condition: Dropdown;
  value: TextInput;
  ifcTypes: Dropdown;
  removeBtn: Button;

  // Is ok to use Type Assertion in this case?
  get query() {
    const attribute = this.attribute.inputValue as string;
    const condition = this.condition.inputValue as QueryConditions;
    const value =
      attribute === "type"
        ? this.getTypeConstant(this.ifcTypes.inputValue as string)
        : this.value.inputValue;
    const query: AttributeQuery = { attribute, condition, value };
    if (this.operator.visible)
      query.operator = this.operator.inputValue as QueryOperators;
    return query;
  }

  set query(value: AttributeQuery) {
    if (value.operator) this.operator.inputValue = value.operator;
    this.attribute.inputValue = value.attribute;
    this.condition.inputValue = value.condition;
    if (value.attribute === "type") {
      this.value.inputValue = null;
      this.ifcTypes.inputValue = value.value.toString();
    } else {
      this.ifcTypes.inputValue = null;
      this.value.inputValue = value.value;
    }
  }

  private getTypeConstant(value: string) {
    for (const [key, val] of Object.entries(IfcCategoryMap)) {
      if (val === value) return Number(key);
    }
    return null;
  }

  constructor(components: Components) {
    const div = document.createElement("div");
    div.className = "flex gap-x-2";
    super(components, div);

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
    this.attribute.onChange.on((selection) => {
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
    this.condition.inputValue = this.condition.options[0];

    this.value = new TextInput(components);
    this.value.labelElement.textContent = "Value";

    this.ifcTypes = new Dropdown(components);
    this.ifcTypes.visible = false;
    this.ifcTypes.label = "Value";
    for (const type of Object.values(IfcCategoryMap)) {
      this.ifcTypes.addOption(type);
    }
    this.ifcTypes.inputValue = "IFCWALL";

    this.removeBtn = new Button(components, { materialIconName: "remove" });
    this.removeBtn.visible = false;
    this.removeBtn.get().classList.remove("mt-auto", "hover:bg-ifcjs-200");
    this.removeBtn.get().classList.add("mt-auto", "mb-2", "hover:bg-error");
    this.removeBtn.onclick = () => {
      if (this.parent instanceof SimpleUIComponent)
        this.parent.removeChild(this);
      this.dispose();
    };

    this.addChild(
      this.operator,
      this.attribute,
      this.condition,
      this.value,
      this.ifcTypes,
      this.removeBtn
    );

    this.attribute.inputValue = "Name";
  }
}
