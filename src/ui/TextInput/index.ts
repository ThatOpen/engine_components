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
    block bg-ifcjs-100 w-full rounded-md border-0 h-[40px] px-3 text-white shadow-sm ring-1 
    ring-inset text-base ring-ifcjs-120 placeholder:text-gray-400 
    focus:ring-2 focus:ring-inset focus:ring-ifcjs-200
    `;
    super(components, input);
    this.labelElement.textContent = "Tooeen Text";
    // input.oninput = () => {
    //   this.onChange.trigger(this.inputValue);
    // };
  }
}
