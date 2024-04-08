import * as THREE from "three";
import * as FRAGS from "bim-fragment";
import { Alignment, FragmentsGroup } from "bim-fragment";
import { Component, Event } from "../../base-types";
import { Components, Simple2DMarker, Simple2DScene } from "../../core";
import { CurveHighlighter } from "./src/curve-highlighter";
import { MarkerManager } from "../../core/Simple2DMarker/src/marker-manager";

export type CivilMarkerType = "hover" | "select";

export abstract class RoadNavigator extends Component<any> {
  enabled = true;

  scene: Simple2DScene;

  abstract view: "horizontal" | "vertical";

  abstract highlighter: CurveHighlighter;

  readonly onHighlight = new Event<{
    point: THREE.Vector3;
    mesh: FRAGS.CurveMesh;
  }>();

  readonly onMarkerChange = new Event<{
    alignment: FRAGS.Alignment;
    percentage: number;
    type: CivilMarkerType;
  }>();

  private _curveMeshes: FRAGS.CurveMesh[] = [];

  markerManager: MarkerManager;

  mouseMarkers: {
    hover: Simple2DMarker;
    select: Simple2DMarker;
  };

  protected constructor(components: Components) {
    super(components);
    this.scene = new Simple2DScene(this.components, false);
    this.markerManager = new MarkerManager(this.components, this.scene);

    this.mouseMarkers = {
      select: this.newMouseMarker(components, "#ffffff"),
      hover: this.newMouseMarker(components, "#575757"),
    };

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
    this.scene.uiElement
      .get("container")
      .domElement.addEventListener("mousemove", async (event) => {
        const dom = this.scene.uiElement.get("container").domElement;

        const result = this.highlighter.castRay(
          event,
          this.scene.camera,
          dom,
          this._curveMeshes
        );

        if (result) {
          const { object } = result;
          this.highlighter.hover(object as FRAGS.CurveMesh);
          await this.updateMarker(result, "hover");
          return;
        }

        this.mouseMarkers.hover.visible = false;
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
          const result = intersects;
          const mesh = result.object as FRAGS.CurveMesh;
          this.highlighter.select(mesh);
          await this.updateMarker(result, "select");

          await this.onHighlight.trigger({ mesh, point: result.point });
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

  setMarker(alignment: Alignment, percentage: number, type: CivilMarkerType) {
    if (!this._curveMeshes.length) {
      return;
    }
    const found = alignment.getCurveAt(percentage, this.view);
    const point = alignment.getPointAt(percentage, this.view);
    const { index } = found.curve.getSegmentAt(found.percentage);
    this.setMouseMarker(point, found.curve.mesh, index, type);
  }

  private adjustRaycasterOnZoom() {
    this.scene.controls.addEventListener("update", () => {
      const { zoom, left, right, top, bottom } = this.scene.camera;
      const width = left - right;
      const height = top - bottom;
      const screenSize = Math.max(width, height);
      const realScreenSize = screenSize / zoom;
      const range = 40;
      const { caster } = this.highlighter;
      caster.params.Line.threshold = realScreenSize / range;
    });
  }

  private newMouseMarker(components: Components, color: string) {
    const scene = this.scene.get();
    const hoverHtml = document.createElement("div");
    const hoverHtmlBar = document.createElement("div");
    hoverHtml.appendChild(hoverHtmlBar);
    hoverHtmlBar.style.backgroundColor = color;
    hoverHtmlBar.style.width = "3rem";
    hoverHtmlBar.style.height = "3px";
    const mouseMarker = new Simple2DMarker(components, hoverHtml, scene);
    mouseMarker.visible = false;
    return mouseMarker;
  }

  private setMouseMarker(
    point: THREE.Vector3,
    object: THREE.Object3D,
    index: number | undefined,
    type: CivilMarkerType
  ) {
    if (index === undefined) {
      return;
    }
    this.mouseMarkers[type].visible = true;
    const marker = this.mouseMarkers[type].get();
    marker.position.copy(point);
    const curveMesh = object as FRAGS.CurveMesh;
    const { startPoint, endPoint } = curveMesh.curve.getSegment(index);
    const angle = Math.atan2(
      endPoint.y - startPoint.y,
      endPoint.x - startPoint.x
    );
    const bar = marker.element.children[0] as HTMLDivElement;
    const trueAngle = 90 - (angle / Math.PI) * 180;
    bar.style.transform = `rotate(${trueAngle}deg)`;
  }

  private async updateMarker(
    intersects: THREE.Intersection,
    type: CivilMarkerType
  ) {
    const { point, index, object } = intersects;
    const mesh = object as FRAGS.CurveMesh;
    const alignment = mesh.curve.alignment;
    const percentage = alignment.getPercentageAt(point, this.view);
    const markerPoint = point.clone();
    this.setMouseMarker(markerPoint, mesh, index, type);
    if (percentage !== null) {
      await this.onMarkerChange.trigger({ alignment, percentage, type });
    }
  }
}
