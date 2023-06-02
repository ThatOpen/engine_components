import { SimpleUIComponent } from "../../SimpleUIComponent";
import { Components } from "../../../core";

export class InputLabel extends SimpleUIComponent<HTMLLabelElement> {
  name: string = "InputLabel";
  constructor(components: Components, value: string) {
    const label = document.createElement("label");
    label.className = `block leading-6 text-gray-300 text-sm`;
    label.textContent = value;
    super(components, label);
  }
}
