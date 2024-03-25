import { UI, UIElement } from "../../base-types";
import { FloatingWindow } from "../../ui";
import { Components } from "../../core";
import { RoadNavigator } from "../RoadNavigator";

export class RoadPlanNavigator extends RoadNavigator implements UI {
  static readonly uuid = "3096dea0-5bc2-41c7-abce-9089b6c9431b" as const;

  readonly view = "horizontal";

  uiElement = new UIElement<{
    floatingWindow: FloatingWindow;
  }>();

  constructor(components: Components) {
    super(components);
    this.setUI();
  }

  private setUI() {
    const floatingWindow = new FloatingWindow(this.components);
    this.components.ui.add(floatingWindow);
    floatingWindow.visible = false;
    const hContainer = this.scene.uiElement.get("container");
    floatingWindow.addChild(hContainer);

    floatingWindow.onResized.add(() => this.scene.grid.regenerate());

    floatingWindow.slots.content.domElement.style.padding = "0";
    floatingWindow.slots.content.domElement.style.overflow = "hidden";

    floatingWindow.onResized.add(() => {
      const { width, height } = floatingWindow.containerSize;
      this.scene.setSize(height, width);
    });

    floatingWindow.domElement.style.width = "20rem";
    floatingWindow.domElement.style.height = "20rem";

    floatingWindow.onVisible.add(() => {
      if (floatingWindow.visible) {
        this.scene.grid.regenerate();
      }
    });

    if (this.components.renderer.isUpdateable()) {
      this.components.renderer.onAfterUpdate.add(async () => {
        if (floatingWindow.visible) {
          await this.scene.update();
        }
      });
    }

    floatingWindow.onResized.trigger();

    this.uiElement.set({ floatingWindow });
  }
}
