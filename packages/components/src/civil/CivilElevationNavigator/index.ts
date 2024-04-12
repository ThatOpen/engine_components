import * as FRAGS from "bim-fragment";
import { UI, UIElement } from "../../base-types";
import { Drawer } from "../../ui";
import { Components } from "../../core";
import { CivilNavigator } from "../CivilNavigator";
import { CurveHighlighter } from "../CivilNavigator/src/curve-highlighter";
import { KPManager } from "../CivilNavigator/src/kp-manager";

export class CivilElevationNavigator extends CivilNavigator implements UI {
  static readonly uuid = "097eea29-2d5a-431a-a247-204d44670621" as const;

  readonly view = "vertical";

  uiElement = new UIElement<{
    drawer: Drawer;
  }>();

  highlighter: CurveHighlighter;

  kpManager: KPManager;

  constructor(components: Components) {
    super(components);
    this.setUI();
    const scene = this.scene.get();
    this.highlighter = new CurveHighlighter(scene, "vertical");
    this.kpManager = new KPManager(
      components,
      this.scene.renderer,
      this.scene.get(),
      this.scene.controls,
      this.view
    );

    this.highlighter.onSelect.add((mesh) => {
      // Add markers elevation

      this.kpManager.dispose();

      const { alignment } = mesh.curve;
      const positionsVertical = [];

      for (const align of alignment.vertical) {
        const pos = align.mesh.geometry.attributes.position.array;
        positionsVertical.push(pos);
      }

      const { defSegments, slope } = this.setDefSegments(positionsVertical);

      const scene = this.scene.get();

      for (let i = 0; i < alignment.vertical.length; i++) {
        const align = alignment.vertical[i];

        this.kpManager.addCivilVerticalMarker(
          `S: ${slope[i].slope}%`,
          align.mesh,
          "Slope",
          scene
        );

        this.kpManager.addCivilVerticalMarker(
          `H: ${defSegments[i].end.y.toFixed(2)}`,
          align.mesh,
          "Height",
          scene
        );
      }

      this.kpManager.addCivilVerticalMarker(
        "KP: 0",
        alignment.vertical[0].mesh,
        "InitialKPV",
        scene
      );

      this.kpManager.addCivilVerticalMarker(
        `KP: ${alignment.vertical.length}`,
        alignment.vertical[alignment.vertical.length - 1].mesh,
        "FinalKPV",
        scene
      );
    });
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
