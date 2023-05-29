import { Components } from "../../core";
import { BaseInput } from "../BaseInput";

export class Dropdown extends BaseInput<HTMLSelectElement> {
  name: string = "Dropdown";
  options: string[] = [];

  constructor(components: Components, name: string = "Tooeen Dropdown") {
    const input = document.createElement("select");
    input.className =
      "block w-full rounded-md border-0 h-[40px] text-white bg-ifcjs-100 ring-1 ring-inset ring-ifcjs-120 focus:ring-2 focus:ring-ifcjs-200";
    super(components, input);
    this.labelElement.textContent = name;
  }

  addOption(value: string) {
    this.options.push(value);
    this.updateOptions();
    return this;
  }

  removeOption(value: string) {
    this.options = this.options.filter((option) => option !== value);
    this.updateOptions();
    return this;
  }

  private updateOptions() {
    const currentOptions = [...this.inputElement.children].map((el) => {
      const optionText = el.textContent;
      if (optionText) {
        const inList = this.options.includes(optionText);
        if (!inList) {
          el.remove();
        }
      }
      return optionText;
    });

    const missingOptions = this.options.filter((option) => {
      if (option) {
        return !currentOptions.includes(option);
      }
      return false;
    });

    missingOptions.forEach((value) => {
      const option = document.createElement("option");
      option.textContent = value;
      this.inputElement.append(option);
    });
  }
}
