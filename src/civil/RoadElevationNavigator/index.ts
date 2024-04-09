import * as FRAGS from "bim-fragment";
import { UI, UIElement } from "../../base-types";
import { Drawer } from "../../ui";
import { Components } from "../../core";
import { RoadNavigator } from "../RoadNavigator";
import { CurveHighlighter } from "../RoadNavigator/src/curve-highlighter";

export class RoadElevationNavigator extends RoadNavigator implements UI {
  static readonly uuid = "097eea29-2d5a-431a-a247-204d44670621" as const;

  readonly view = "vertical";

  uiElement = new UIElement<{
    drawer: Drawer;
  }>();

  highlighter: CurveHighlighter;

  constructor(components: Components) {
    super(components);
    this.setUI();
    const scene = this.scene.get();
    this.highlighter = new CurveHighlighter(scene, "vertical");
  }

  get() {
    return null as any;
  }

  showKPStations(mesh: FRAGS.CurveMesh) {
    // TODO: Discuss and Implement the Logic for Vertical Views and KP Stations
    console.log(mesh);
  }

  clearKPStations(): void {
    // Clearing KP Stations
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

    drawer.onResized.add(() => {
      const { width, height } = drawer.containerSize;
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
