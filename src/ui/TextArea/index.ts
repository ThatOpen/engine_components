import { Components } from "../../core";
import { Event } from "../../base-types";
import { SimpleUIComponent } from "../SimpleUIComponent";
import { UIManager } from "../UIManager";

export class TextArea extends SimpleUIComponent<HTMLDivElement> {
  name = "TooeenTextArea";
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

  set placeholder(value: string) {
    this.innerElements.input.placeholder = value;
  }

  get placeholder() {
    return this.innerElements.input.placeholder;
  }

  innerElements: {
    label: HTMLLabelElement;
    input: HTMLInputElement;
  };

  constructor(components: Components) {
    const template = `
    <div class="w-full">
      <label id="label" for="message" class="${UIManager.Class.Label}"></label>
      <textarea id="input" rows="4" class="block bg-transparent w-full rounded-md p-3 text-white ring-1 text-base ring-gray-500 focus:ring-ifcjs-200 focus:outline-none placeholder:text-gray-400"></textarea>
    </div>
    `;
    super(components, template);

    this.innerElements = {
      label: this.getInnerElement("label") as HTMLLabelElement,
      input: this.getInnerElement("input") as HTMLInputElement,
    };

    this.label = "Tooeen Text Area";
    this.placeholder = "Write something...";

    this.innerElements.label.setAttribute("for", `input-${this.id}`);
  }

  async dispose(onlyChildren: boolean = false) {
    await super.dispose(onlyChildren);
    this.onChange.reset();
  }
}
