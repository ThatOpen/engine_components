import * as THREE from "three";
import * as FRAGS from "bim-fragment";
import { FragmentsGroup } from "bim-fragment";
import { Component, Event } from "../../base-types";
import { Components, Simple2DScene } from "../../core";
import { CurveHighlighter } from "./src/curve-highlighter";
import { MarkerManager } from "../../core/Simple2DMarker/src/marker-manager";

export abstract class RoadNavigator extends Component<any> {
  enabled = true;

  scene: Simple2DScene;

  abstract view: "horizontal" | "vertical";

  abstract highlighter: CurveHighlighter;

  readonly onHighlight = new Event<{
    point: THREE.Vector3;
    mesh: FRAGS.CurveMesh;
  }>();

  private _curveMeshes: FRAGS.CurveMesh[] = [];

  markerManager: MarkerManager;

  protected constructor(components: Components) {
    super(components);
    this.scene = new Simple2DScene(this.components, false);
    this.markerManager = new MarkerManager(this.components, this.scene);
    this.setupEvents();
    this.adjustRaycasterOnZoom();
  }

  get() {
    return null as any;
  }

  async draw(model: FragmentsGroup, filter?: Iterable<FRAGS.Alignment>) {
    if (!model.civilData) {
      throw new Error("The provided model doesn't have civil data!");
    }
    const { alignments } = model.civilData;
    const allAlignments = filter || alignments.values();

    const scene = this.scene.get();

    const totalBBox: THREE.Box3 = new THREE.Box3();
    totalBBox.makeEmpty();
    totalBBox.min.set(Number.MAX_VALUE, Number.MAX_VALUE, Number.MAX_VALUE);
    totalBBox.max.set(-Number.MAX_VALUE, -Number.MAX_VALUE, -Number.MAX_VALUE);

    for (const alignment of allAlignments) {
      if (!alignment) {
        throw new Error("Alignment not found!");
      }

      // TODO: Generate All The KPs and Stations
      this.markerManager.addCivilMarker(
        `0+${alignment.initialKP.toFixed(2)}`,
        alignment[this.view][0].mesh,
        "InitialKP"
      );

      this.markerManager.addCivilMarker(
        "end",
        alignment[this.view][alignment[this.view].length - 1].mesh,
        "FinalKP"
      );

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

    const scaledBbox = new THREE.Box3();
    const size = new THREE.Vector3();
    const center = new THREE.Vector3();
    totalBBox.getCenter(center);
    totalBBox.getSize(size);
    size.multiplyScalar(1.2);
    scaledBbox.setFromCenterAndSize(center, size);

    await this.scene.controls.fitToBox(scaledBbox, false);
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
          const mesh = object as FRAGS.CurveMesh;
          this.highlighter.select(mesh);
          // TODO: Example and Test, should be replaced with the actual implementation
          // this.markerManager.addCivilMarker("Curve", mesh, "Length");
          await this.onHighlight.trigger({ mesh, point });
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
    this.markerManager.dispose();
  }

  clear() {
    this.highlighter.unSelect();
    this.highlighter.unHover();
    for (const mesh of this._curveMeshes) {
      mesh.removeFromParent();
    }
    this._curveMeshes = [];
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
