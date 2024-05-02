import * as THREE from "three";
import * as FRAGS from "bim-fragment";
import * as OBC from "@thatopen/components";
import { CivilNavigator } from "../CivilNavigator";
import { PlanHighlighter } from "./src/plan-highlighter";

export class CivilPlanNavigator extends CivilNavigator {
  static readonly uuid = "3096dea0-5bc2-41c7-abce-9089b6c9431b" as const;

  readonly view = "horizontal";

  private planHighlighter?: PlanHighlighter;

  set world(world: OBC.World) {
    super.world = world;
    if (!world) return;
    this.planHighlighter?.dispose();
    this.planHighlighter = new PlanHighlighter(
      this.components,
      world.scene.three,
    );
  }

  constructor(components: OBC.Components) {
    super(components);
    this.components.add(CivilPlanNavigator.uuid, this);

    this.onHighlight.add(({ mesh }) => {
      if (!this.highlighter || !this.planHighlighter) {
        return;
      }
      this.planHighlighter.showCurveInfo(mesh);
      this.fitCameraToAlignment(mesh);
    });
  }

  private async fitCameraToAlignment(curveMesh: FRAGS.CurveMesh) {
    const bbox = this.components.get(OBC.FragmentBoundingBox);
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
    if (this.world && this.world.camera.hasCameraControls()) {
      await this.world.camera.controls.fitToBox(box, true);
    }
  }
}
