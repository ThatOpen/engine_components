import * as THREE from "three";
import * as FRAGS from "bim-fragment";
import { Alignment, FragmentsGroup } from "bim-fragment";
import { Component, Event } from "../../base-types";
import { Components, Simple2DMarker, Simple2DScene } from "../../core";
import { CurveHighlighter } from "./src/curve-highlighter";
import { KPManager } from "./src/kp-manager";

export type CivilMarkerType = "hover" | "select";

export abstract class CivilNavigator extends Component<any> {
  enabled = true;

  scene: Simple2DScene;

  abstract view: "horizontal" | "vertical";

  abstract highlighter: CurveHighlighter;

  // abstract showKPStations(curveMesh: FRAGS.CurveMesh): void;
  // abstract clearKPStations(): void;

  abstract kpManager: KPManager;

  readonly onHighlight = new Event<{
    point: THREE.Vector3;
    mesh: FRAGS.CurveMesh;
  }>();

  readonly onMarkerChange = new Event<{
    alignment: FRAGS.Alignment;
    percentage: number;
    type: CivilMarkerType;
    curve: FRAGS.CivilCurve;
  }>();

  readonly onMarkerHidden = new Event<{
    type: CivilMarkerType;
  }>();

  private _curveMeshes: FRAGS.CurveMesh[] = [];

  private _previousAlignment: FRAGS.Alignment | null = null;

  mouseMarkers: {
    hover: Simple2DMarker;
    select: Simple2DMarker;
  };

  kpLabels: {
    hover: Simple2DMarker;
    select: Simple2DMarker;
  };

  protected constructor(components: Components) {
    super(components);
    this.scene = new Simple2DScene(this.components, false);

    this.mouseMarkers = {
      select: this.newMouseMarker("#ffffff"),
      hover: this.newMouseMarker("#575757"),
    };
    this.kpLabels = {
      select: this.newKPLabel("#ffffff"),
      hover: this.newKPLabel("#575757"),
    };

    this.setupEvents();
    this.adjustRaycasterOnZoom();
  }

  initialize() {
    console.log("View for CivilNavigator: ", this.view);
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
          this._curveMeshes,
        );

        if (result) {
          const { object } = result;
          this.highlighter.hover(object as FRAGS.CurveMesh);
          await this.updateMarker(result, "hover");
          return;
        }

        this.mouseMarkers.hover.visible = false;
        this.kpLabels.hover.visible = false;
        this.highlighter.unHover();
        await this.onMarkerHidden.trigger({ type: "hover" });
      });

    this.scene.uiElement
      .get("container")
      .domElement.addEventListener("click", async (event) => {
        const dom = this.scene.uiElement.get("container").domElement;

        const intersects = this.highlighter.castRay(
          event,
          this.scene.camera,
          dom,
          this._curveMeshes,
        );

        if (intersects) {
          const result = intersects;
          const mesh = result.object as FRAGS.CurveMesh;
          this.highlighter.select(mesh);
          await this.updateMarker(result, "select");

          await this.onHighlight.trigger({ mesh, point: result.point });

          if (this._previousAlignment !== mesh.curve.alignment) {
            this.kpManager.clearKPStations();
            // this.showKPStations(mesh);
            this.kpManager.showKPStations(mesh);
            // this.kpManager.createKP();
            this._previousAlignment = mesh.curve.alignment;
          }
        }
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
    this.setKPLabel(found.curve.mesh, point, type);
  }

  setDefSegments(segmentsArray: any[]) {
    const defSegments: any = [];
    const slope: any = [];

    const calculateSlopeSegment = (point1: number[], point2: number[]) => {
      const deltaY = point2[1] - point1[1];
      const deltaX = point2[0] - point1[0];
      return deltaY / deltaX;
    };

    for (let i = 0; i < segmentsArray.length; i++) {
      const segment = segmentsArray[i];
      let startX: number;
      let startY: number;
      let endX: number;
      let endY: number;

      // Set start
      for (let j = 0; j < Object.keys(segment).length / 3; j++) {
        if (segment[j * 3] !== undefined && segment[j * 3 + 1] !== undefined) {
          startX = segment[j * 3];
          startY = segment[j * 3 + 1];
          break;
        }
      }

      // Set end
      for (let j = Object.keys(segment).length / 3 - 1; j >= 0; j--) {
        if (segment[j * 3] !== undefined && segment[j * 3 + 1] !== undefined) {
          endX = segment[j * 3];
          endY = segment[j * 3 + 1];
          break;
        }
      }

      const defSlope = calculateSlopeSegment(
        // @ts-ignore
        [startX, startY],
        // @ts-ignore
        [endX, endY],
      );

      const slopeSegment = (defSlope * 100).toFixed(2);
      slope.push({ slope: slopeSegment });
    }

    for (const segment of segmentsArray) {
      for (let i = 0; i < segment.length - 3; i += 3) {
        const startX = segment[i];
        const startY = segment[i + 1];
        const startZ = segment[i + 2];

        const endX = segment[i + 3];
        const endY = segment[i + 4];
        const endZ = segment[i + 5];

        defSegments.push({
          start: new THREE.Vector3(startX, startY, startZ),
          end: new THREE.Vector3(endX, endY, endZ),
        });
      }
    }

    return { defSegments, slope };
  }

  hideMarker(type: CivilMarkerType) {
    this.mouseMarkers[type].visible = false;
    this.kpLabels[type].visible = false;
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

  private newMouseMarker(color: string) {
    const scene = this.scene.get();
    const root = document.createElement("div");
    const bar = document.createElement("div");
    root.appendChild(bar);
    bar.style.backgroundColor = color;
    bar.style.width = "1.5rem";
    bar.style.height = "3px";
    const mouseMarker = new Simple2DMarker(this.components, root, scene);
    mouseMarker.visible = false;
    return mouseMarker;
  }

  private setMouseMarker(
    point: THREE.Vector3,
    object: THREE.Object3D,
    index: number | undefined,
    type: CivilMarkerType,
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
      endPoint.x - startPoint.x,
    );
    const bar = marker.element.children[0] as HTMLDivElement;
    const trueAngle = 90 - (angle / Math.PI) * 180;
    bar.style.transform = `rotate(${trueAngle}deg)`;
  }

  private newKPLabel(color: string) {
    const scene = this.scene;
    const div = document.createElement("div");
    div.style.color = color;
    div.textContent = `${0o0}`;
    const parentObject = scene.get();
    const kpLabel = new Simple2DMarker(this.components, div, parentObject);
    kpLabel.visible = false;
    return kpLabel;
  }
  private setKPLabel(
    mesh: FRAGS.CurveMesh,
    point: THREE.Vector3,
    type: CivilMarkerType,
  ) {
    if (!this.kpLabels[type]) {
      console.error(`Label for type "${type}" is not created yet!`);
      return;
    }
    const kpLabel = this.kpLabels[type];
    const KpPoint = point.clone();
    KpPoint.y += 8;
    const markerElement = kpLabel.get().element as HTMLDivElement;

    const { alignment } = mesh.curve;
    const alignmentLength = alignment.getLength("horizontal");

    let percentage = alignment.getPercentageAt(point, "horizontal");
    if (percentage === null) {
      percentage = alignment.getPercentageAt(point, "vertical") || 0;
    }

    const length = alignmentLength * percentage;
    const kp = this.kpManager.getShortendKPValue(length);
    markerElement.textContent = `KP: ${kp}`;

    kpLabel.get().position.copy(KpPoint);
    kpLabel.visible = true;
  }

  private async updateMarker(
    intersects: THREE.Intersection,
    type: CivilMarkerType,
  ) {
    const { point, index, object } = intersects;
    const mesh = object as FRAGS.CurveMesh;
    const curve = mesh.curve;
    const alignment = mesh.curve.alignment;
    const percentage = alignment.getPercentageAt(point, this.view);
    const markerPoint = point.clone();
    this.setMouseMarker(markerPoint, mesh, index, type);
    this.setKPLabel(mesh, markerPoint, type);
    if (percentage !== null) {
      await this.onMarkerChange.trigger({ alignment, percentage, type, curve });
    }
  }
}
