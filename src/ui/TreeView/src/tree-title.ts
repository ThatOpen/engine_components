import { UIComponent } from "../../../base-types/base-types";
import { Components } from "../../../core/Components";
import { Button } from "../../ButtonComponent";
import { UIComponentsStack } from "../../UIComponentsStack";

export class TreeTitle extends UIComponentsStack {
  rightContainer: UIComponentsStack;
  arrow: Button;
  private _titleElement: HTMLParagraphElement;
  private _descriptionElement: HTMLParagraphElement;

  set description(value: string | null | undefined) {
    if (value) {
      this._descriptionElement.textContent = value;
      this._descriptionElement.classList.remove("hidden");
    } else {
      this._descriptionElement.textContent = null;
      this._descriptionElement?.classList.add("hidden");
    }
  }

  get description() {
    return this._descriptionElement.textContent;
  }

  set title(value: string | null | undefined) {
    if (value) {
      this._titleElement.textContent = value;
    }
  }

  get title() {
    return this._titleElement.textContent;
  }

  constructor(components: Components) {
    super(components, "Horizontal");
    this.get().classList.add(
      "items-center",
      "text-base",
      "justify-between",
      "hover:bg-ifcjs-120",
      "rounded-md",
      "w-full",
      "min-h-[30px]"
    );

    this.arrow = new Button(components, { materialIconName: "arrow_right" });
    this.arrow.get().classList.remove("p-2");
    this.arrow.get().classList.add("p-1", "h-full");

    const leftContainer = new UIComponentsStack(components, "Horizontal");
    leftContainer.get().classList.add("items-center", "gap-x-2");
    leftContainer.addChild(this.arrow);

    const titleContainer = document.createElement("div");
    titleContainer.className = "flex flex-col items-start py-[5px]";

    this._titleElement = document.createElement("p");
    this._titleElement.className = "text-base";

    this._descriptionElement = document.createElement("p");
    this._descriptionElement.className = "text-sm text-gray-400 hidden";
    titleContainer.append(this._titleElement, this._descriptionElement);

    leftContainer.get().append(titleContainer);

    this.rightContainer = new UIComponentsStack(components, "Horizontal");
    this.rightContainer.get().classList.add("ml-5", "mr-[8px]");

    this.get().append(leftContainer.get(), this.rightContainer.get());
  }

  addChild(...items: UIComponent[]) {
    items.forEach((item) => {
      this.children.push(item);
      this.rightContainer.addChild(item);
    });
  }
}
