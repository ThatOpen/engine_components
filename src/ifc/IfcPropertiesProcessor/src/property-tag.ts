import { SimpleUIComponent } from "../../../ui/SimpleUIComponent";
import { Components } from "../../../core/Components";
import { UIComponent } from "../../../base-types/base-types";

export class PropertyTag extends SimpleUIComponent {
  name: string = "PropertyTag";
  private _rightContainer = document.createElement("div");
  private _labelElement = document.createElement("p");
  private _valueElement = document.createElement("p");
  private _label: string | null = null;
  private _value: string | number | boolean | null = null;

  get label() {
    return this._label;
  }
  set label(value: string | null) {
    this._label = value;
    this._labelElement.textContent = value;
  }

  get value() {
    return this._value;
  }
  set value(value: string | number | boolean | null) {
    this._value = value;
    this._valueElement.textContent = value?.toString() ?? null;
  }

  constructor(components: Components) {
    const wrapper = document.createElement("div");
    wrapper.className =
      "flex gap-x-2 hover:bg-ifcjs-120 py-1 px-3 rounded-md items-center min-h-[40px]";
    const tagInfo = document.createElement("div");
    tagInfo.className = "flex flex-col grow";

    super(components, wrapper);

    this._labelElement.className = "text-sm text-gray-400 font-medium";
    this._valueElement.className = "text-base";
    tagInfo.append(this._labelElement, this._valueElement);

    wrapper.append(tagInfo, this._rightContainer);
    this._rightContainer.className = "flex gap-x-2";
  }

  addChild(...items: UIComponent[]) {
    items.forEach((item) => {
      this.children.push(item);
      this._rightContainer.append(item.domElement);
    });
  }
}
