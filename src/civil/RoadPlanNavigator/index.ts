import * as THREE from "three";
import * as FRAGS from "bim-fragment";
import { UI, UIElement } from "../../base-types";
import { FloatingWindow } from "../../ui";
import { Components, ToolComponent } from "../../core";
import { RoadNavigator } from "../RoadNavigator";
import { FragmentBoundingBox } from "../../fragments";
import { PlanHighlighter } from "./src/plan-highlighter";
import { CivilFloatingWindow } from "../CivilFloatingWindow";
import { MarkerManager } from "../../core/Simple2DMarker/src/marker-manager";

export class RoadPlanNavigator extends RoadNavigator implements UI {
  static readonly uuid = "3096dea0-5bc2-41c7-abce-9089b6c9431b" as const;

  readonly view = "horizontal";

  uiElement = new UIElement<{
    floatingWindow: FloatingWindow;
  }>();

  highlighter: PlanHighlighter;

  constructor(components: Components) {
    super(components);
    const scene = this.scene.get();
    this.highlighter = new PlanHighlighter(scene);
    this.markerManager = new MarkerManager(components, this.scene);
    this.setupEvents();
    this.setUI();

    this.components.tools.add(RoadPlanNavigator.uuid, this);

    this.onHighlight.add(({ mesh }) => {
      this.highlighter.showCurveInfo(mesh);
      this.addCurveLabel(mesh);
      this.fitCameraToAlignment(mesh);
    });
  }

  addCurveLabel(curve: FRAGS.CurveMesh) {
    switch (curve.curve.data.TYPE) {
      case "LINE":
        this.lineLabels(curve);
        break;
      case "CLOTHOID":
        this.lineLabels(curve);
        break;
      case "CIRCULARARC":
        console.log(
          "Labels not defined yet for curve type:",
          curve.curve.data.TYPE
        );
        break;
      default:
        console.log("Unknown curve type:", curve.curve.data.TYPE);
        break;
    }
  }

  lineLabels(curve: FRAGS.CurveMesh): void {
    const lengthLabelPosition = this.highlighter.lineLengthLabelPosition(curve);
    const label = this.markerManager.addCivilMarker(
      "spaceholder",
      curve,
      "Length"
    );
    label.get().position.copy(lengthLabelPosition);
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
      (max.z - min.z) * offset
    );
    box.getCenter(center);
    box.setFromCenterAndSize(center, size);
    bbox.reset();
    await this.scene.controls.fitToBox(box, true);
  }

  private setUI() {
    const name = "Horizontal alignment";
    const floatingWindow = CivilFloatingWindow.get(
      this.components,
      this.scene,
      name
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

ToolComponent.libraryUUIDs.add(RoadPlanNavigator.uuid);
