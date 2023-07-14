import { Vector2 } from "three";
import { SimpleUIComponent } from "../SimpleUIComponent";
import { Event, UIComponent } from "../../base-types";
import { Components } from "../../core";

interface FloatingWindowConfig {
  title?: string;
  description?: string;
  id?: string;
}

export class FloatingWindow extends SimpleUIComponent<HTMLDivElement> {
  private _resizeable = true;

  static Class = {
    Base: "absolute backdrop-blur-md shadow-md overflow-auto top-5 resize z-50 left-5 min-h-[80px] min-w-[150px] w-fit h-fit text-white bg-ifcjs-100 rounded-md",
    Title: "text-lg font-bold",
    Description: "text-base text-gray-400",
  };

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

  set description(value: string | null | undefined) {
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

  set title(value: string | null | undefined) {
    const titleElement = document.getElementById(`${this.id}-title`);
    if (titleElement && value) {
      titleElement.textContent = value;
      titleElement.classList.remove("hidden");
    }
  }

  get title() {
    const titleElement = document.getElementById(
      `${this.id}-title`
    ) as HTMLElement;
    return titleElement.textContent;
  }

  set resizeable(value: boolean) {
    this._resizeable = value;
    if (value) {
      this.get().classList.add("resize");
    } else {
      this.get().classList.remove("resize");
    }
  }

  get resizeable() {
    return this._resizeable;
  }

  constructor(components: Components, config?: FloatingWindowConfig) {
    const window = document.createElement("div");
    window.className = FloatingWindow.Class.Base;

    super(components, window, config?.id);

    this.resizeable = true;

    const titleElement = document.createElement("h3");
    titleElement.id = `${this.id}-title`;
    titleElement.textContent = "Tooeen Floating Window";
    titleElement.className = FloatingWindow.Class.Title;

    const descriptionElement = document.createElement("p");
    descriptionElement.id = `${this.id}-description`;
    descriptionElement.className = FloatingWindow.Class.Description;

    const closeElement = document.createElement("span");
    closeElement.onclick = () => (this.visible = false);
    closeElement.innerText = "close";
    closeElement.className =
      "material-icons md-16 absolute right-2 top-2 z-20 hover:cursor-pointer hover:text-ifcjs-200";

    const titleContainer = document.createElement("div");
    titleContainer.id = `${this.id}-title-container`;
    titleContainer.className =
      "bg-ifcjs-120 sticky z-10 top-0 select-none cursor-move px-5 py-3 text-center";
    titleContainer.append(titleElement, descriptionElement, closeElement);

    const content = document.createElement("div");
    content.id = `${this.id}-content`;
    content.className = "flex-col gap-y-3 p-3 hidden overflow-auto";

    this.domElement.append(titleContainer, content);

    const viewerContainer = this._components.renderer.get().domElement
      .parentNode as HTMLElement;

    let isMouseDown = false;
    let offsetX = 0;
    let offsetY = 0;

    titleContainer.addEventListener("mousedown", (e) => {
      isMouseDown = true;
      const rect = this.domElement.getBoundingClientRect();
      offsetX = e.clientX - rect.left;
      offsetY = e.clientY - rect.top;
    });

    viewerContainer.addEventListener("mousemove", (e) => {
      if (!isMouseDown) {
        return;
      }
      const { width, height } = this.domElement.getBoundingClientRect();
      const {
        x,
        y,
        width: containerWidth,
        height: containerHeight,
      } = viewerContainer.getBoundingClientRect();
      const maxLeft = containerWidth - width;
      const maxTop = containerHeight - height;
      const left = Math.max(0, Math.min(e.clientX - offsetX - x, maxLeft));
      const top = Math.max(0, Math.min(e.clientY - offsetY - y, maxTop));
      this.domElement.style.left = `${left}px`;
      this.domElement.style.top = `${top}px`;
      this.onMoved.trigger(this);
    });

    viewerContainer.addEventListener("mouseup", () => (isMouseDown = false));
    requestAnimationFrame(() => {});

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
  }

  addChild(...items: UIComponent[]) {
    const contentDiv = document.getElementById(
      `${this.id}-content`
    ) as HTMLDivElement;
    items.forEach((item) => {
      this.children.push(item);
      contentDiv.append(item.domElement);
    });
    contentDiv.classList.remove("hidden");
    contentDiv.classList.add("flex");
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
