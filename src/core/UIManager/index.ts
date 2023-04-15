import { createPopper } from "@popperjs/core";
import { Component, Components } from "../../types";
import { Toolbar } from "../ToolbarComponent";

export type IContainerPosition = "top" | "right" | "bottom" | "left";

type IContainerAlingment = "start" | "center" | "end";

interface IContainers {
  [key: string]: HTMLDivElement;
}

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
    this.contextMenu.domElement.classList.add("vtoolbar");
    this.contextMenu.setDirection("vertical");
    this.contextMenu.position = "left";
    this.components = components;

    for (const id in this.containers) {
      const container = this.containers[id];
      container.classList.add("tooeen-toolbar-container");
      container.id = `${id}-toolbar-container`;
      this.setContainerAlignment(id as IContainerPosition, "center");
    }

    this.containers.top.classList.add("hcontainer");
    this.containers.right.classList.add("vcontainer");
    this.containers.bottom.classList.add("hcontainer");
    this.containers.left.classList.add("vcontainer");
  }

  setup() {
    this.viewerContainer = this.components.renderer.get().domElement
      .parentElement as HTMLElement;

    // #region Context menu
    const contextParent = document.createElement("div");
    contextParent.style.position = "absolute";
    contextParent.append(this.contextMenu.domElement);

    // TODO: Find out why popper needs this to work
    // @ts-ignore
    window.process = { env: {} };

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
