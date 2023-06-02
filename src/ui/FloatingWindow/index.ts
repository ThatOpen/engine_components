import { generateUUID } from "three/src/math/MathUtils";
import { Vector2 } from "three";
import { SimpleUIComponent } from "../SimpleUIComponent";
import { Event, UIComponent } from "../../base-types";
import { Components } from "../../core";

interface FloatingWindowConfig {
  title: string;
  description?: string;
  id?: string;
  initialWidth?: number;
}

export class FloatingWindow extends SimpleUIComponent<HTMLDivElement> {
  private _components: Components;
  onMoved: Event<FloatingWindow> = new Event();
  onResized: Event<FloatingWindow> = new Event();
  referencePoints!: {
    topLeft: Vector2;
    top: Vector2;
    topRight: Vector2;
    left: Vector2;
    center: Vector2;
    right: Vector2;
    bottomLeft: Vector2;
    bottom: Vector2;
    bottomRight: Vector2;
  };

  set description(value: string | null) {
    const descriptionElement = document.getElementById(
      `${this.id}-description`
    );
    if (descriptionElement && value) {
      descriptionElement.textContent = value;
      descriptionElement.classList.remove("hidden");
    } else {
      descriptionElement?.classList.add("hidden");
    }
  }

  get description() {
    const descriptionElement = document.getElementById(
      `${this.id}-description`
    ) as HTMLElement;
    return descriptionElement.textContent;
  }

  constructor(
    components: Components,
    config: FloatingWindowConfig = { title: "Tooeen Floting Window" }
  ) {
    const { title, description, initialWidth } = config;
    const window = document.createElement("div");
    window.className = `absolute overflow-auto top-5 resize z-50 left-5 min-h-[80px] max-h-[750px] min-w-[150px] max-w-sm text-white bg-ifcjs-100 rounded-md`;
    window.style.width = initialWidth ? `${initialWidth.toString()}px` : "auto";
    const id = config.id ?? generateUUID().toLowerCase();
    window.id = id;
    window.innerHTML = `
        <div id="${id}-title-container" class="bg-ifcjs-120 sticky top-0 select-none cursor-move px-5 py-3 text-center ${
      !title && !description ? "hidden" : ""
    }">
            <h3 id="${id}-title" class="${
      !title ? "hidden" : ""
    } text-lg font-bold">${title}</h3>
            <p id="${id}-description" class="${
      !description ? "hidden" : ""
    }">${description}</p>
            <span id="${id}-close" class="material-icons md-16 absolute right-2 top-2 z-20 hover:cursor-pointer hover:text-ifcjs-200">close</span>
        </div>
        <div id="${id}-content" class="flex-col gap-y-3 p-4 hidden overflow-auto"></div>
        `;
    requestAnimationFrame(() => {
      const titleElement = document.getElementById(
        `${this.id}-title-container`
      ) as HTMLDivElement;
      const viewerContainer = this._components.renderer.get().domElement
        .parentNode as HTMLElement;

      let isMouseDown = false;
      let offsetX = 0;
      let offsetY = 0;

      titleElement.addEventListener("mousedown", (e) => {
        isMouseDown = true;
        const rect = this.domElement.getBoundingClientRect();
        offsetX = e.clientX - rect.left;
        offsetY = e.clientY - rect.top;
      });

      viewerContainer.addEventListener("mousemove", (e) => {
        if (!isMouseDown) {
          return;
        }
        this.domElement.style.left = `${e.clientX - offsetX}px`;
        this.domElement.style.top = `${e.clientY - offsetY}px`;
        this.onMoved.trigger(this);
      });

      viewerContainer.addEventListener("mouseup", () => (isMouseDown = false));

      const closeButton = document.getElementById(
        `${id}-close`
      ) as HTMLDivElement;
      closeButton.onclick = () => {
        this.visible = false;
      };
    });

    super(components, window, id);

    const observer = new ResizeObserver(() => {
      this.onResized.trigger(this);
    });
    observer.observe(window);

    this.referencePoints = {
      topLeft: new Vector2(),
      top: new Vector2(),
      topRight: new Vector2(),
      left: new Vector2(),
      center: new Vector2(),
      right: new Vector2(),
      bottomLeft: new Vector2(),
      bottom: new Vector2(),
      bottomRight: new Vector2(),
    };
    this._components = components;
  }

  addChild(...items: UIComponent[]) {
    const contentDiv = document.getElementById(
      `${this.id}-content`
    ) as HTMLDivElement;
    items.forEach((item) => {
      this.children.push(item);
      contentDiv.append(item.domElement);
    });
    if (contentDiv.classList.contains("hidden")) {
      contentDiv.classList.remove("hidden");
      contentDiv.classList.add("flex");
    }
  }

  updateReferencePoints() {
    const uiElementRect = this.domElement.getBoundingClientRect();
    this.referencePoints.topLeft.set(uiElementRect.x, uiElementRect.y);
    this.referencePoints.top.set(
      uiElementRect.x + uiElementRect.width / 2,
      uiElementRect.y
    );
    this.referencePoints.topRight.set(
      uiElementRect.x + uiElementRect.width,
      uiElementRect.y
    );
    this.referencePoints.left.set(
      uiElementRect.x,
      uiElementRect.y + uiElementRect.height / 2
    );
    this.referencePoints.center.set(
      uiElementRect.x + uiElementRect.width / 2,
      uiElementRect.y + uiElementRect.height / 2
    );
    this.referencePoints.right.set(
      uiElementRect.x + uiElementRect.width,
      uiElementRect.y + uiElementRect.height / 2
    );
    this.referencePoints.bottomLeft.set(
      uiElementRect.x,
      uiElementRect.y + uiElementRect.height
    );
    this.referencePoints.bottom.set(
      uiElementRect.x + uiElementRect.width / 2,
      uiElementRect.y + uiElementRect.height
    );
    this.referencePoints.bottomRight.set(
      uiElementRect.x + uiElementRect.width,
      uiElementRect.y + uiElementRect.height
    );
  }
}
