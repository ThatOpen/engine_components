import * as THREE from "three";
import * as FRAGS from "bim-fragment";
import { UI, UIElement } from "../../base-types";
import { FloatingWindow } from "../../ui";
import { Components, ToolComponent } from "../../core";
import { CivilNavigator } from "../CivilNavigator";
import { FragmentBoundingBox } from "../../fragments";
import { PlanHighlighter } from "./src/plan-highlighter";
import { CivilFloatingWindow } from "../CivilFloatingWindow";
import { KPManager } from "../CivilNavigator/src/kp-manager";

export class CivilPlanNavigator extends CivilNavigator implements UI {
  static readonly uuid = "3096dea0-5bc2-41c7-abce-9089b6c9431b" as const;

  readonly view = "horizontal";

  uiElement = new UIElement<{
    floatingWindow: FloatingWindow;
  }>();

  highlighter: PlanHighlighter;

  kpManager: KPManager;

  constructor(components: Components) {
    super(components);
    const scene = this.scene.get();

    this.kpManager = new KPManager(
      components,
      this.scene.renderer,
      this.scene.get(),
      this.scene.controls,
      this.view,
    );

    this.highlighter = new PlanHighlighter(scene, this.kpManager);

    this.setUI();

    this.components.tools.add(CivilPlanNavigator.uuid, this);

    this.onHighlight.add(({ mesh }) => {
      this.highlighter.showCurveInfo(mesh);
      this.fitCameraToAlignment(mesh);
    });
  }

  private async fitCameraToAlignment(curveMesh: FRAGS.CurveMesh) {
    const bbox = this.components.tools.get(FragmentBoundingBox);
    const alignment = curveMesh.curve.alignment;
    for (const curve of alignment.horizontal) {
      bbox.addMesh(curve.mesh);
    }
    const box = bbox.get();
    const center = new THREE.Vector3();
    const { min, max } = box;
    const offset = 1.2;
    const size = new THREE.Vector3(
      (max.x - min.x) * offset,
      (max.y - min.y) * offset,
      (max.z - min.z) * offset,
    );
    box.getCenter(center);
    box.setFromCenterAndSize(center, size);
    bbox.reset();
    await this.scene.controls.fitToBox(box, true);
  }

  // showKPStations(curveMesh: FRAGS.CurveMesh): void {
  //   this.kpStation.showKPStations(curveMesh);
  // }

  // clearKPStations(): void {
  //   this.kpStation.clearKPStations();
  // }

  private setUI() {
    const name = "Horizontal alignment";
    const floatingWindow = CivilFloatingWindow.get(
      this.components,
      this.scene,
      name,
    );
    this.uiElement.set({ floatingWindow });

    this.scene.controls.addEventListener("update", () => {
      const screenSize = floatingWindow.containerSize;
      const { zoom } = this.scene.camera;
      this.highlighter.updateOffset(screenSize, zoom, true);
    });
    floatingWindow.onResized.add(() => {
      const screenSize = floatingWindow.containerSize;
      const { zoom } = this.scene.camera;
      this.highlighter.updateOffset(screenSize, zoom, true);
    });
  }
}

ToolComponent.libraryUUIDs.add(CivilPlanNavigator.uuid);
