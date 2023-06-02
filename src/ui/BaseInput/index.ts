import { Components } from "../../core";
import { InputLabel } from "./src/input-label";
import { SimpleUIComponent } from "../SimpleUIComponent";
import { Event } from "../../base-types";

type InputElement =
  | HTMLInputElement
  | HTMLSelectElement
  | HTMLTextAreaElement
  | HTMLButtonElement;

export interface InputConfig {
  name: string;
}

export abstract class BaseInput<
  T extends InputElement = InputElement
> extends SimpleUIComponent<HTMLDivElement> {
  name = "TooeenBaseInput";
  inputElement: T;
  labelElement: HTMLLabelElement;
  wrapperElement: HTMLDivElement;
  onChange: Event<string> = new Event();

  constructor(
    components: Components,
    inputElement: T,
    config?: Partial<InputConfig>
  ) {
    const div = document.createElement("div");
    div.className = "flex flex-col";
    const _config: InputConfig = {
      name: "Tooeen Input",
      ...config,
    };
    super(components, div);
    this.wrapperElement = div;
    const label = new InputLabel(components, _config.name);
    this.labelElement = label.get();
    this.domElement.append(this.labelElement);
    this.inputElement = inputElement;
    this.domElement.append(this.inputElement);
    this.onEnabled.on(() => (this.inputElement.disabled = false));
    this.onDisabled.on(() => (this.inputElement.disabled = true));
    this.inputElement.onchange = () => {
      this.onChange.trigger(this.inputValue);
    };
  }

  get inputValue() {
    return this.inputElement.value;
  }

  set inputValue(value: string) {
    this.inputElement.value = value;
  }

  addChild() {
    console.warn("Input components doesn't allow children.");
  }
}
