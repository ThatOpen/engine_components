// @ts-ignore
import { createPopper } from "@popperjs/core/dist/esm";
import { Component } from "../../base-types";
import { Toolbar } from "../ToolbarComponent";
import { Components } from "../../core";

export type IContainerPosition = "top" | "right" | "bottom" | "left";

type IContainerAlingment = "start" | "center" | "end";

interface IContainers {
  [key: string]: HTMLDivElement;
}

/**
 * A component that handles all UI components.
 */
export class UIManager extends Component<Toolbar[]> {
  name: string = "UIManager";
  enabled: boolean = true;
  components: Components;
  toolbars: Toolbar[] = [];
  contextMenu: Toolbar;
  viewerContainer?: HTMLElement;
  containers: IContainers = {
    top: document.createElement("div"),
    right: document.createElement("div"),
    bottom: document.createElement("div"),
    left: document.createElement("div"),
  };

  get(): Toolbar[] {
    return this.toolbars;
  }

  constructor(components: Components) {
    super();
    this.contextMenu = new Toolbar(components);
    this.contextMenu.setDirection("vertical");
    this.contextMenu.position = "left";
    this.components = components;

    const containerClasses: Record<string, string[]> = {
      top: ["top-0", "pt-4"],
      right: ["top-0", "right-0", "pr-4"],
      bottom: ["bottom-0", "pb-4"],
      left: ["top-0", "left-0", "pl-4"],
    };

    for (const id in this.containers) {
      const container = this.containers[id];
      container.className =
        "absolute flex gap-y-3 gap-x-3 pointer-events-none p-4";
      container.classList.add(...containerClasses[id]);
      container.id = `${id}-toolbar-container`;
      this.setContainerAlignment(id as IContainerPosition, "center");
    }

    const hContainerClass = ["flex-row", "w-full"];
    const vContainerClass = ["flex-column", "h-full"];
    this.containers.top.classList.add(...hContainerClass);
    this.containers.right.classList.add(...vContainerClass);
    this.containers.bottom.classList.add(...hContainerClass);
    this.containers.left.classList.add(...vContainerClass);
  }

  setup() {
    this.viewerContainer = this.components.renderer.get().domElement
      .parentElement as HTMLElement;

    // #region Context menu
    const contextParent = document.createElement("div");
    contextParent.style.position = "absolute";
    contextParent.append(this.contextMenu.domElement);

    const popperInstance = createPopper(
      contextParent,
      this.contextMenu.domElement,
      {
        placement: "bottom-start",
        modifiers: [
          {
            name: "preventOverflow",
            options: {
              boundary: this.viewerContainer,
            },
          },
        ],
      }
    );

    let mouseMoved = false;
    let mouseDown = false;

    this.viewerContainer.addEventListener("contextmenu", (e) => {
      if (mouseMoved) {
        mouseMoved = false;
        return;
      }
      e.preventDefault();
      e.stopImmediatePropagation();
      this.closeMenus();
      contextParent.style.left = `${e.offsetX}px`;
      contextParent.style.top = `${e.offsetY}px`;
      this.contextMenu.visible = true;
      popperInstance.update();
    });

    this.viewerContainer.addEventListener("mousedown", (e) => {
      mouseDown = true;
      const canvas = this.components.renderer.get().domElement;
      if (e.target === canvas) {
        this.closeMenus();
        this.contextMenu.visible = false;
      }
    });

    this.viewerContainer.addEventListener("mousemove", () => {
      if (mouseDown) {
        mouseMoved = true;
      }
    });

    this.viewerContainer.addEventListener("mouseup", () => {
      mouseDown = false;
    });
    // #endregion

    this.viewerContainer.append(
      this.containers.top,
      this.containers.right,
      this.containers.bottom,
      this.containers.left,
      contextParent
    );
  }

  closeMenus() {
    this.toolbars.forEach((toolbar) => toolbar.closeMenus());
    this.contextMenu.closeMenus();
  }

  setContainerAlignment(
    container: IContainerPosition,
    alingment: IContainerAlingment
  ) {
    this.containers[container].style.justifyContent = alingment;
    this.containers[container].style.alignItems = alingment;
  }

  addToolbar(...toolbar: Toolbar[]) {
    toolbar.forEach((tlbr) => {
      const container = this.containers[tlbr.position];
      if (!container) {
        return;
      }
      container.append(tlbr.domElement);
      this.toolbars.push(tlbr);
    });
    this.updateToolbars();
  }

  updateToolbars() {
    this.toolbars.forEach((toolbar) => {
      toolbar.visible = true;
      toolbar.updateElements();
      if (toolbar.position === "bottom" || toolbar.position === "top") {
        toolbar.setDirection("horizontal");
      } else {
        toolbar.setDirection("vertical");
      }
    });
  }
}
