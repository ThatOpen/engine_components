import { generateUUID } from "three/src/math/MathUtils";
import { SimpleUIComponent } from "../SimpleUIComponent";
import { Components } from "../../core";
import { UIComponentsStack } from "../UIComponentsStack";
import { UIComponent } from "../../base-types";

interface ICardInfo {
  title: string;
  description?: string;
  id?: string;
}

export class SimpleUICard extends SimpleUIComponent<HTMLDivElement> {
  name: string = "SimpleUICard";
  rightContainer: UIComponentsStack;

  constructor(components: Components, info: ICardInfo) {
    const card = document.createElement("div");
    card.className =
      "bg-ifcjs-120 p-2 text-white flex items-center rounded-lg border-transparent border border-solid";

    const id = info.id ?? generateUUID();

    const descriptionClass = "opacity-50 mt-4";

    const descriptionMenu = `
            <div id="${id}-before-description"></div>
                <p class="${descriptionClass}" id="${id}-description">${info.description}</p>
            <div id="${id}-after-description"></div>
    `;

    const description = info.description ? descriptionMenu : "";

    super(components, card, id);

    this.rightContainer = new UIComponentsStack(components, "Horizontal");

    const template = `
            <div class="mr-auto">
              <div id="${id}-before-title"></div>
              <h3 class="font-bold" id="${id}-title">${info.title}</h3>
              ${description}
            </div>
        `;
    card.innerHTML = template;
    card.appendChild(this.rightContainer.get());
  }

  addChild(...items: UIComponent[]) {
    items.forEach((item) => {
      this.children.push(item);
      this.rightContainer.addChild(item);
    });
  }
}
