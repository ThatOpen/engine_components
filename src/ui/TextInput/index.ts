import { Components } from "../../core";
import { BaseInput } from "../BaseInput";

interface TextInputConfig {
  name: string;
  initialValue?: string;
  label?: string;
  placeholder?: string;
  id?: string;
}

export class TextInput extends BaseInput<HTMLInputElement> {
  name = "TooeenTextInput";

  // @ts-ignore
  constructor(components: Components, config?: TextInputConfig) {
    const input = document.createElement("input");
    input.className = `
    block bg-transparent w-full rounded-md p-3 text-white ring-1 
    ring text-base ring-gray-500 placeholder:text-gray-400 
    focus:ring-1 focus:ring-ifcjs-200 focus:outline-none
    `;
    super(components, input);
    this.labelElement.textContent = "Tooeen Text";
    // input.oninput = () => {
    //   this.onChange.trigger(this.inputValue);
    // };
  }
}
