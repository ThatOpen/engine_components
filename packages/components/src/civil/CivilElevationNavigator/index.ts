import * as FRAGS from "bim-fragment";
import { UI, UIElement } from "../../base-types";
import { Drawer } from "../../ui";
import { Components } from "../../core";
import { CivilNavigator } from "../CivilNavigator";
import { CurveHighlighter } from "../CivilNavigator/src/curve-highlighter";
import { KPManager } from "../CivilNavigator/src/kp-manager";

export class CivilElevationNavigator extends CivilNavigator implements UI {
  static readonly uuid = "097eea29-2d5a-431a-a247-204d44670621" as const;
  private currentMesh?: FRAGS.CurveMesh;
  private offset: number = 10;
  private fontSize: number = 10;

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
    this.kpManager = new KPManager(
      components,
      this.scene.renderer,
      this.scene.get(),
      this.scene.controls,
      this.view,
    );
    this.highlighter = new CurveHighlighter(scene, this.view, this.kpManager);

    this.highlighter.onSelect.add((mesh) => {
      // Add markers elevation
      this.showElevationMarkers(mesh);
    });
  }

  get() {
    return null as any;
  }

  showKPStations(mesh: FRAGS.CurveMesh) {
    // TODO: Discuss and Implement the Logic for Vertical Views and KP Stations
    console.log(mesh);
  }

  updateOffset(height: number, width: number, _zoom: number) {
    const smallerSize = Math.min(height, width);
    const newOffset = smallerSize / (_zoom * 15);
    const fontSizeCalculation = smallerSize / (_zoom * 10);
    const minFontSize = 18;
    const maxFontSize = 25;
    const fontSize = Math.max(
      minFontSize,
      Math.min(maxFontSize, fontSizeCalculation),
    );
    if (newOffset !== this.offset || fontSize !== this.fontSize) {
      this.offset = newOffset;
      this.fontSize = fontSize;
      if (this.currentMesh) {
        this.showElevationMarkers(this.currentMesh);
      }
    }
  }

  showElevationMarkers(mesh: FRAGS.CurveMesh) {
    this.kpManager.dispose();
    this.currentMesh = mesh;

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
      const fontSize = this.fontSize;
      const labelOffset = this.offset;

      const slopeText = `S: ${slope[i].slope}%`;
      const heightText = `H: ${defSegments[i].end.y.toFixed(2)}`;

      this.kpManager.addCivilVerticalMarker(
        slopeText,
        align.mesh,
        "Slope",
        fontSize,
        labelOffset,
        scene,
      );

      this.kpManager.addCivilVerticalMarker(
        heightText,
        align.mesh,
        "Height",
        fontSize,
        labelOffset,
        scene,
      );
    }

    const firstMesh = alignment.vertical[0].mesh;
    const lastMesh = alignment.vertical[alignment.vertical.length - 1].mesh;

    this.kpManager.addCivilVerticalMarker(
      "KP: 0",
      firstMesh,
      "InitialKPV",
      this.fontSize,
      this.offset,
      scene,
    );

    this.kpManager.addCivilVerticalMarker(
      `KP: ${alignment.vertical.length}`,
      lastMesh,
      "FinalKPV",
      this.fontSize,
      this.offset,
      scene,
    );
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

    const updateOffsetAndSceneSize = () => {
      const { width, height } = drawer.containerSize;
      this.scene.setSize(height, width);
      const { zoom } = this.scene.camera;
      this.updateOffset(height, width, zoom);
    };

    drawer.onResized.add(updateOffsetAndSceneSize);
    this.scene.controls.addEventListener("update", updateOffsetAndSceneSize);

    if (this.components.renderer.isUpdateable()) {
      this.components.renderer.onAfterUpdate.add(async () => {
        if (drawer.visible) {
          await this.scene.update();
        }
      });
    }
  }
}
