import { SimpleUIComponent } from "../SimpleUIComponent";
import { Components } from "../../core";

export class SimpleUICard extends SimpleUIComponent<HTMLDivElement> {
  name: string = "SimpleUICard";

  set title(value: string | null) {
    this.innerElements.title.textContent = value;
  }

  get title() {
    return this.innerElements.title.textContent;
  }

  set description(value: string | null) {
    this.innerElements.description.textContent = value;
  }

  get description() {
    return this.innerElements.description.textContent;
  }

  innerElements: {
    title: HTMLHeadElement;
    description: HTMLParagraphElement;
  };

  slots: {
    rightContainer: SimpleUIComponent;
  };

  constructor(components: Components, id?: string) {
    const template = `
    <div class="p-2 text-white flex items-center rounded-lg border-transparent border border-solid">
      <div class="mr-auto">
        <p id="title" class="text-base"></p>
        <p id="description" class="text-sm text-gray-400"></p>
      </div>
      <div data-tooeen-slot="rightContainer"></div> 
    </div> 
    `;

    super(components, template, id);

    this.innerElements = {
      title: this.getInnerElement("title") as HTMLHeadElement,
      description: this.getInnerElement("description") as HTMLParagraphElement,
    };

    this.slots = {
      rightContainer: new SimpleUIComponent(
        components,
        `<div class="flex"></div>`
      ),
    };
    this.setSlots();
  }

  addChild(...items: SimpleUIComponent[]) {
    items.forEach((item) => {
      this.slots.rightContainer.addChild(item);
    });
  }
}
