import { Components } from "../../core";
import { Event } from "../../base-types";
import { SimpleUIComponent } from "../SimpleUIComponent";
import { UIManager } from "../UIManager";

export class ColorInput extends SimpleUIComponent<HTMLDivElement> {
  name = "TooeenColorInput";
  readonly onChange: Event<string> = new Event();

  set value(value: string) {
    this.innerElements.input.value = value;
    this.onChange.trigger(this.value);
  }

  get value() {
    return this.innerElements.input.value;
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

  innerElements: {
    label: HTMLLabelElement;
    input: HTMLInputElement;
  };

  // @ts-ignore
  constructor(components: Components) {
    const template = `
    <div class="w-full">
      <label id="label" class="${UIManager.Class.Label}"></label>
      <input id="input" type="color" class="block w-full h-[48px] rounded-md text-white text-base ring-gray-500 focus:ring-ifcjs-200 focus:outline-none">
    </div>
    `;
    super(components, template);

    this.innerElements = {
      label: this.getInnerElement("label") as HTMLLabelElement,
      input: this.getInnerElement("input") as HTMLInputElement,
    };

    this.label = "Tooeen Color";
    this.value = "#BCF124";

    this.innerElements.input.oninput = () => {
      this.onChange.trigger(this.value);
    };
  }

  async dispose(onlyChildren: boolean = false) {
    await super.dispose(onlyChildren);
    this.onChange.reset();
  }
}
