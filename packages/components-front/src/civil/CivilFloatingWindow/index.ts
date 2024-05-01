import { FloatingWindow } from "../../ui";
import { Components, Simple2DScene } from "../../core";

export class CivilFloatingWindow {
  static get(components: Components, scene: Simple2DScene, name: string) {
    const floatingWindow = new FloatingWindow(components);
    floatingWindow.title = name;
    components.ui.add(floatingWindow);
    floatingWindow.visible = false;

    const hContainer = scene.uiElement.get("container");
    floatingWindow.addChild(hContainer);

    floatingWindow.onResized.add(() => scene.grid.regenerate());

    floatingWindow.slots.content.domElement.style.padding = "0";
    floatingWindow.slots.content.domElement.style.overflow = "hidden";

    floatingWindow.onResized.add(() => {
      const { width, height } = floatingWindow.containerSize;
      scene.setSize(height, width);
    });

    floatingWindow.domElement.style.width = "20rem";
    floatingWindow.domElement.style.height = "20rem";

    floatingWindow.onVisible.add(() => {
      if (floatingWindow.visible) {
        scene.grid.regenerate();
      }
    });

    if (components.renderer.isUpdateable()) {
      components.renderer.onAfterUpdate.add(async () => {
        if (floatingWindow.visible) {
          await scene.update();
        }
      });
    }

    floatingWindow.onResized.trigger();

    return floatingWindow;
  }
}
