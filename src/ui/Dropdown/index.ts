import { Components } from "../../core";
import { Event } from "../../base-types";
import { SimpleUIComponent } from "../SimpleUIComponent";

export class Dropdown extends SimpleUIComponent {
  name: string = "Dropdown";
  options: string[] = [];

  readonly onChange: Event<string> = new Event();

  get inputValue() {
    return this._button.textContent;
  }

  set inputValue(value: string | null) {
    const option = this.options.find((v) => v === value) ?? this.options[0];
    this._button.textContent = option ?? null;
    this.onChange.trigger(this.inputValue as string);
  }

  set label(value: string | null) {
    this._label.textContent = value;
    if (value) {
      this._label.classList.remove("hidden");
    } else {
      this._label.classList.add("hidden");
    }
  }

  get label() {
    return this._label.textContent;
  }

  constructor(components: Components, name: string = "Tooeen Dropdown") {
    const div = document.createElement("div");
    div.className = "w-full";
    super(components, div);
    div.innerHTML += `
    <label id="label-${this.id}" class="block leading-6 text-gray-400 text-xs"></label>
    <button
    id="button-${this.id}"
    data-dropdown-toggle="dropdown-${this.id}"
    class="text-white w-full ring-1 ring-gray-500 focus:outline-none focus:ring-ifcjs-200 rounded-md text-base p-3 text-center inline-flex items-center"
    type="button">
      <svg class="w-2.5 h-2.5 ml-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 4 4 4-4"/>
      </svg>
      </button>
    <div id="dropdown-${this.id}" class="z-10 absolute hidden mt-1 max-h-[300px] w-fit overflow-auto bg-[#212121] rounded-md shadow">
      <ul id="dropdownList-${this.id}" class="py-2 text-sm text-white"></ul>
    </div>
    `;

    this._button.onclick = () => this.toggle();
    this.setClickOutside();

    this.label = name;
  }

  private setClickOutside() {
    document.addEventListener(
      "click",
      (e) => {
        if (!this.get().contains(e.target as Node))
          this._dropdown.classList.add("hidden");
      },
      true
    );
  }

  toggle() {
    if (this._dropdown.classList.contains("hidden")) {
      this._dropdown.classList.remove("hidden");
    } else {
      this._dropdown.classList.add("hidden");
    }
  }

  addOption(...value: string[]) {
    const options = value.filter((option) => !this.options.includes(option));
    for (const option of options) {
      this.options.push(option);
      const li = document.createElement("li");
      li.id = `${option.replace(/\s+/g, "_")}-${this.id}`;
      li.className = "px-4 py-2 text-base cursor-pointer hover:text-ifcjs-200";
      li.innerHTML = `<p class="block">${option}</p>`;
      li.onclick = () => {
        this.inputValue = option;
        this._dropdown.classList.add("hidden");
      };
      const dropdownList = this.get().querySelector(
        `#dropdownList-${this.id}`
      ) as HTMLUListElement;
      dropdownList.appendChild(li);
    }
    return this;
  }

  removeOption(...value: string[]) {
    const optionsToDelete = value.filter((option) =>
      this.options.includes(option)
    );
    for (const name of optionsToDelete) {
      const option = this.get().querySelector(
        `#${name.replace(/\s+/g, "_")}-${this.id}`
      );
      if (!option) continue;
      option.remove();
    }
    this.options = this.options.filter((option) => !value.includes(option));
    return this;
  }

  private getInnerElement<T extends HTMLElement>(id: string) {
    return this.get().querySelector(`#${id}-${this.id}`) as T | null;
  }

  private get _button() {
    return this.getInnerElement("button") as HTMLButtonElement;
  }

  private get _dropdown() {
    return this.getInnerElement("dropdown") as HTMLDivElement;
  }

  private get _label() {
    return this.getInnerElement("label") as HTMLLabelElement;
  }
}
