import { Components } from "../../core";
import { BaseInput } from "../BaseInput";

interface ColorInputConfig {
  name: string;
  initialValue?: string;
  label?: string;
  id?: string;
}

export class ColorInput extends BaseInput<HTMLInputElement> {
  name = "TooeenColorInput";

  // @ts-ignore
  constructor(components: Components, config?: ColorInputConfig) {
    const input = document.createElement("input");
    input.type = "color";
    input.value = "#BCF124";
    input.className = `
      block w-full h-[30px] rounded-md border-0 text-gray-900 shadow-sm ring-1 
      ring-inset ring-gray-300
      focus:ring-2 focus:ring-inset focus:ring-ifcjs-200`;
    super(components, input);
    this.labelElement.textContent = "Tooeen Color";
    input.oninput = () => {
      this.onChange.trigger(this.inputValue);
    };
  }
}
