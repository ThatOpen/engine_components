import { UI, UIElement } from "../../base-types";
import { Drawer } from "../../ui";
import { Components } from "../../core";
import { RoadNavigator } from "../RoadNavigator";

export class RoadElevationNavigator extends RoadNavigator implements UI {
  static readonly uuid = "097eea29-2d5a-431a-a247-204d44670621" as const;

  readonly view = "vertical";

  uiElement = new UIElement<{
    drawer: Drawer;
  }>();

  constructor(components: Components) {
    super(components);
    this.setUI();
  }

  get() {
    return null as any;
  }

  private setUI() {
    const drawer = new Drawer(this.components);
    this.components.ui.add(drawer);
    drawer.alignment = "top";

    drawer.onVisible.add(() => {
      this.scene.grid.regenerate();
    });
    drawer.visible = false;

    drawer.slots.content.domElement.style.padding = "0";
    drawer.slots.content.domElement.style.overflow = "hidden";

    const { clientWidth, clientHeight } = drawer.domElement;
    this.scene.setSize(clientHeight, clientWidth);

    const vContainer = this.scene.uiElement.get("container");
    drawer.addChild(vContainer);

    this.uiElement.set({ drawer });

    drawer.onResized.add(() => {
      const width = window.innerWidth;
      const height = this.scene.size.y;
      this.scene.setSize(height, width);
    });

    if (this.components.renderer.isUpdateable()) {
      this.components.renderer.onAfterUpdate.add(async () => {
        if (drawer.visible) {
          await this.scene.update();
        }
      });
    }
  }
}
