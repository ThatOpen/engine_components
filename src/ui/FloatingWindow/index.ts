import { Vector2 } from "three";
import { SimpleUIComponent } from "../SimpleUIComponent";
import { Event } from "../../base-types";
import { Components } from "../../core";

export class FloatingWindow extends SimpleUIComponent<HTMLDivElement> {
  private _resizeable = true;
  private _movable = true;

  static Class = {
    Base: "absolute flex flex-col backdrop-blur-xl shadow-md overflow-auto top-5 resize z-50 left-5 min-h-[80px] min-w-[150px] w-fit h-fit text-white bg-ifcjs-100 rounded-md",
    Description: "text-base text-gray-400",
  };

  onMoved = new Event<FloatingWindow>();
  onResized = new Event();

  private _isMouseDown = false;
  private _offsetX = 0;
  private _offsetY = 0;

  referencePoints: {
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

  get containerSize() {
    const baseHeight = this.domElement.clientHeight;
    const titleHeight = this.innerElements.titleContainer.clientHeight;
    const height = baseHeight - titleHeight;
    const width = this.domElement.clientWidth;
    return { height, width };
  }

  get viewerContainer() {
    return this._components.renderer.get().domElement
      .parentElement as HTMLElement;
  }

  set description(value: string | null) {
    const element = this.innerElements.description;
    element.textContent = value;
    if (value) {
      element.classList.remove("hidden");
    } else {
      element?.classList.add("hidden");
    }
  }

  get description() {
    return this.innerElements.description.textContent;
  }

  set title(value: string | null) {
    const element = this.innerElements.title;
    element.textContent = value;
    if (value) {
      element.classList.remove("hidden");
    } else {
      element.classList.add("hidden");
    }
  }

  get title() {
    return this.innerElements.title.textContent;
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

  set movable(value: boolean) {
    this._movable = value;
    if (value) {
      this.innerElements.titleContainer.classList.add("cursor-move");
    } else {
      this.innerElements.titleContainer.classList.remove("cursor-move");
    }
  }

  get movable() {
    return this._movable;
  }

  innerElements: {
    title: HTMLHeadingElement;
    description: HTMLHeadingElement;
    titleContainer: HTMLDivElement;
    closeBtn: HTMLSpanElement;
  };

  slots: {
    content: SimpleUIComponent<HTMLDivElement>;
  };

  constructor(components: Components, id?: string) {
    const template = `
    <div class="${FloatingWindow.Class.Base}">
      <div id="title-container" class="z-10 flex justify-between items-center top-0 select-none cursor-move px-6 py-3 border-b-2 border-solid border-[#3A444E]">
        <div class="flex flex-col">
          <h3 id="title">Tooeen Floating Window</h3>
          <p id="description" class="${FloatingWindow.Class.Description}"></p>
        </div>
        <span id="close" class="material-icons text-2xl ml-4 text-gray-400 z-20 hover:cursor-pointer hover:text-ifcjs-200">close</span>
      </div>
      <div data-tooeen-slot="content"></div>
    </div>
    `;

    super(components, template, id);

    this.innerElements = {
      title: this.getInnerElement("title") as HTMLHeadingElement,
      description: this.getInnerElement("description") as HTMLHeadingElement,
      titleContainer: this.getInnerElement("title-container") as HTMLDivElement,
      closeBtn: this.getInnerElement("close") as HTMLSpanElement,
    };

    this.slots = {
      content: new SimpleUIComponent(
        components,
        `<div class="flex flex-col gap-y-4 p-4 overflow-auto"></div>`
      ),
    };
    this.setSlots();

    this.innerElements.closeBtn.onclick = () => (this.visible = false);
    this.setMovableListeners();

    const observer = new ResizeObserver(() => this.onResized.trigger());
    observer.observe(this.get());

    this.description = null;
    this.movable = true;
    this.resizeable = true;

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
    this.domElement.style.width = "400px";
    this.domElement.style.height = "250px";
  }

  async dispose(onlyChildren = false) {
    await super.dispose(onlyChildren);
    this.setupEvents(false);
    this.onMoved.reset();
    this.onResized.reset();
  }

  private setMovableListeners() {
    // For node.js
    try {
      // eslint-disable-next-line no-unused-expressions
      this._components.renderer;
    } catch (_e) {
      return;
    }

    this.setupEvents(true);
  }

  addChild(...items: SimpleUIComponent[]) {
    const content = this.slots.content;
    content.addChild(...items);
    if (!content.visible) content.visible = true;
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

  private setupEvents(active: boolean) {
    const title = this.innerElements.titleContainer;
    const container = this.viewerContainer;
    if (active) {
      if (title) {
        title.addEventListener("mousedown", this.onMOuseDown);
      }
      container.addEventListener("mousemove", this.onMouseMove);
      container.addEventListener("mouseup", this.onMouseUp);
    } else {
      if (title) {
        title.removeEventListener("mousedown", this.onMOuseDown);
      }
      container.removeEventListener("mousemove", this.onMouseMove);
      container.removeEventListener("mouseup", this.onMouseUp);
    }
  }

  private onMOuseDown = (event: MouseEvent) => {
    if (!this.movable) return;
    this._isMouseDown = true;
    const rect = this.domElement.getBoundingClientRect();
    this._offsetX = event.clientX - rect.left;
    this._offsetY = event.clientY - rect.top;
  };

  private onMouseUp = () => {
    this._isMouseDown = false;
  };

  private onMouseMove = (event: MouseEvent) => {
    if (!(this._isMouseDown && this.movable)) return;
    const { width, height } = this.domElement.getBoundingClientRect();
    const {
      x,
      y,
      width: containerWidth,
      height: containerHeight,
    } = this.viewerContainer.getBoundingClientRect();
    const maxLeft = containerWidth - width;
    const maxTop = containerHeight - height;
    const left = Math.max(
      0,
      Math.min(event.clientX - this._offsetX - x, maxLeft)
    );
    const top = Math.max(
      0,
      Math.min(event.clientY - this._offsetY - y, maxTop)
    );
    this.domElement.style.left = `${left}px`;
    this.domElement.style.top = `${top}px`;
    this.onMoved.trigger(this);
  };
}
