import { Components } from "../../core";
import { BaseInput } from "../BaseInput";

interface RangeInputConfig {
  name: string;
  min?: number;
  max?: number;
  initialValue?: number;
  label?: string;
  id?: string;
}

export class RangeInput extends BaseInput<HTMLInputElement> {
  name = "TooeenRangeInput";

  // @ts-ignore
  constructor(components: Components, config?: RangeInputConfig) {
    const input = document.createElement("input");
    input.type = "range";
    input.className = "block w-full rounded-md border-0 py-1.5 shadow-sm";
    super(components, input);
    this.labelElement.textContent = "Tooeen Range";
    input.oninput = () => {
      this.onChange.trigger(this.inputValue);
    };
  }
}
