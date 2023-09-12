import { Components } from "../../core";
import { UIManager } from "../UIManager";
import { Event } from "../../base-types";
import { SimpleUIComponent } from "../SimpleUIComponent";

export class RangeInput extends SimpleUIComponent<HTMLDivElement> {
  name = "TooeenRangeInput";
  readonly onChange: Event<number> = new Event();

  set value(value: number) {
    this.innerElements.input.value = String(value);
    this.onChange.trigger(this.value);
  }

  get value() {
    return Number(this.innerElements.input.value);
  }

  set label(value: string | null) {
    this.innerElements.label.textContent = value;
    if (value) {
      this.innerElements.label.classList.remove("hidden");
    } else {
      this.innerElements.label.classList.add("hidden");
    }
  }

  get label() {
    return this.innerElements.label.textContent;
  }

  set min(value: number) {
    this.innerElements.input.min = String(value);
  }

  get min() {
    return Number(this.innerElements.input.min);
  }

  set max(value: number) {
    this.innerElements.input.max = String(value);
  }

  get max() {
    return Number(this.innerElements.input.max);
  }

  set step(value: number) {
    this.innerElements.input.step = String(value);
  }

  get step() {
    return Number(this.innerElements.input.step);
  }

  innerElements: {
    label: HTMLLabelElement;
    input: HTMLInputElement;
  };

  // @ts-ignore
  constructor(components: Components) {
    const template = `
    <div>
      <label id="label" class="${UIManager.Class.Label}"></label>
      <input id="input" type="range" class="block w-full rounded-md border-0 py-1.5 shadow-sm accent-ifcjs-300">
    </div>
    `;
    super(components, template);

    this.innerElements = {
      label: this.getInnerElement("label") as HTMLLabelElement,
      input: this.getInnerElement("input") as HTMLInputElement,
    };

    this.label = "Tooeen Range";

    this.innerElements.input.oninput = () => {
      this.onChange.trigger(this.value);
    };
  }
}
