import { Components } from "../../core";
import { BaseInput } from "../BaseInput";

interface RangeInputConfig {
  name?: string;
  min?: number;
  max?: number;
  step?: number;
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
    input.min = config?.min ? config.min.toString() : input.min;
    input.max = config?.max ? config.max.toString() : input.max;
    input.step = config?.step ? config.step.toString() : input.step;
    input.className =
      "block w-full rounded-md border-0 py-1.5 shadow-sm accent-ifcjs-300";
    super(components, input);
    this.labelElement.textContent = config?.label || "Tooeen Range";
    input.oninput = () => {
      this.onChange.trigger(this.inputValue);
    };
  }
}
