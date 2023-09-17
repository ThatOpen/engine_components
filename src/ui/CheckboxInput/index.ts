import { Components } from "../../core";
import { Event } from "../../base-types";
import { SimpleUIComponent } from "../SimpleUIComponent";
import { UIManager } from "../UIManager";

export class CheckboxInput extends SimpleUIComponent<HTMLDivElement> {
  name = "TooeenCheckboxInput";
  readonly onChange: Event<Boolean> = new Event();

  set value(value: boolean) {
    this.innerElements.input.checked = value;
    this.onChange.trigger(this.value);
  }

  get value() {
    return this.innerElements.input.checked;
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

  constructor(components: Components) {
    const template = `
    <div class="w-full flex gap-x-2 items-center">
        <input id="input" type="checkbox" 
            class="h-4 w-4 rounded border-gray-300 accent-ifcjs-300 text-ifcjs-300 focus:ring-ifcjs-300">
        <label id="label" class="${UIManager.Class.Label}"></label>
    </div>
    `;
    super(components, template);

    this.innerElements = {
      label: this.getInnerElement("label") as HTMLLabelElement,
      input: this.getInnerElement("input") as HTMLInputElement,
    };

    this.innerElements.input.addEventListener("change", () => {
      this.onChange.trigger(this.value);
    });

    this.label = "Tooeen Checkbox";
  }

  async dispose(onlyChildren: boolean = false) {
    await super.dispose(onlyChildren);
    this.onChange.reset();
  }
}
