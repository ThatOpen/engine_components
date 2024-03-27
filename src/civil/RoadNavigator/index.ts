import * as THREE from "three";
import * as FRAGS from "bim-fragment";
import { FragmentsGroup } from "bim-fragment";
import { Component, Event } from "../../base-types";
import { Components, Simple2DScene } from "../../core";
import { CurveHighlighter } from "./src/curve-highlighter";

export abstract class RoadNavigator extends Component<any> {
  enabled = true;

  scene: Simple2DScene;

  abstract view: "horizontal" | "vertical";

  abstract highlighter: CurveHighlighter;

  readonly onHighlight = new Event<FRAGS.CurveMesh>();

  private _curveMeshes: FRAGS.CurveMesh[] = [];

  protected constructor(components: Components) {
    super(components);
    this.scene = new Simple2DScene(this.components, false);
    this.setupEvents();
    this.adjustRaycasterOnZoom();
  }

  get() {
    return null as any;
  }

  async draw(model: FragmentsGroup, ids?: Iterable<number>) {
    if (!model.civilData) {
      throw new Error("The provided model doesn't have civil data!");
    }
    const { alignments } = model.civilData;
    const allIDs = ids || alignments.keys();

    const scene = this.scene.get();

    const totalBBox: THREE.Box3 = new THREE.Box3();
    totalBBox.makeEmpty();
    totalBBox.min.set(Number.MAX_VALUE, Number.MAX_VALUE, Number.MAX_VALUE);
    totalBBox.max.set(-Number.MAX_VALUE, -Number.MAX_VALUE, -Number.MAX_VALUE);

    for (const id of allIDs) {
      const alignment = alignments.get(id);
      if (!alignment) {
        throw new Error("Alignment not found!");
      }

      for (const curve of alignment[this.view]) {
        scene.add(curve.mesh);
        this._curveMeshes.push(curve.mesh);

        if (!totalBBox.isEmpty()) {
          totalBBox.expandByObject(curve.mesh);
        } else {
          curve.mesh.geometry.computeBoundingBox();
          const cbox = curve.mesh.geometry.boundingBox;

          if (cbox instanceof THREE.Box3) {
            totalBBox.copy(cbox).applyMatrix4(curve.mesh.matrixWorld);
          }
        }
      }
    }

    await this.scene.controls.fitToBox(totalBBox, false);
  }

  setupEvents() {
    const mousePositionSphere = new THREE.Mesh(
      new THREE.SphereGeometry(0.5),
      new THREE.MeshBasicMaterial({ color: 0xff0000 })
    );

    this.scene.get().add(mousePositionSphere);

    this.scene.uiElement
      .get("container")
      .domElement.addEventListener("mousemove", (event) => {
        const dom = this.scene.uiElement.get("container").domElement;

        const intersects = this.highlighter.castRay(
          event,
          this.scene.camera,
          dom,
          this._curveMeshes
        );

        if (intersects) {
          const { point, object } = intersects;
          mousePositionSphere.position.copy(point);
          this.highlighter.hover(object as FRAGS.CurveMesh);
          return;
        }

        this.highlighter.unHover();
      });

    this.scene.uiElement
      .get("container")
      .domElement.addEventListener("click", async (event) => {
        const dom = this.scene.uiElement.get("container").domElement;

        const intersects = this.highlighter.castRay(
          event,
          this.scene.camera,
          dom,
          this._curveMeshes
        );

        if (intersects) {
          const { point, object } = intersects;
          mousePositionSphere.position.copy(point);
          const curve = object as FRAGS.CurveMesh;
          this.highlighter.select(curve);
          await this.onHighlight.trigger(curve);
          return;
        }

        this.highlighter.unSelect();
      });
  }

  async dispose() {
    this.highlighter.dispose();
    this.clear();
    this.onHighlight.reset();
    await this.scene.dispose();
    this._curveMeshes = [];
  }

  clear() {
    for (const mesh of this._curveMeshes) {
      mesh.removeFromParent();
    }
  }

  private adjustRaycasterOnZoom() {
    this.scene.controls.addEventListener("update", () => {
      const { zoom, left, right, top, bottom } = this.scene.camera;
      const width = left - right;
      const height = top - bottom;
      const screenSize = Math.max(width, height);
      const realScreenSize = screenSize / zoom;
      const range = 50;
      const { caster } = this.highlighter;
      caster.params.Line.threshold = realScreenSize / range;
    });
  }
}
