import * as THREE from "three";
import * as FRAGS from "@thatopen/fragments";
import * as OBC from "@thatopen/components";
import { Alignment, FragmentsGroup } from "@thatopen/fragments";
import { CurveHighlighter } from "./src/curve-highlighter";
import { CivilMarker } from "../CivilMarker";
import { Mark } from "../../core";

export type CivilMarkerType = "hover" | "select";

export abstract class CivilNavigator extends OBC.Component {
  abstract view: "horizontal" | "vertical";

  enabled = true;

  highlighter?: CurveHighlighter;

  // abstract showKPStations(curveMesh: FRAGS.CurveMesh): void;
  // abstract clearKPStations(): void;

  readonly onHighlight = new OBC.Event<{
    point: THREE.Vector3;
    mesh: FRAGS.CurveMesh;
  }>();

  readonly onMarkerChange = new OBC.Event<{
    alignment: FRAGS.Alignment;
    percentage: number;
    type: CivilMarkerType;
    curve: FRAGS.CivilCurve;
  }>();

  mouseMarkers?: {
    hover: Mark;
    select: Mark;
  };

  readonly onMarkerHidden = new OBC.Event<{
    type: CivilMarkerType;
  }>();

  private _curves: FRAGS.CurveMesh[] = [];

  private _previousAlignment: FRAGS.Alignment | null = null;

  private _world: OBC.World | null = null;

  get world() {
    return this._world;
  }

  set world(world: OBC.World | null) {
    if (world === this._world) {
      return;
    }

    if (this._world) {
      this.setupEvents(false);
    }

    this._world = world;

    this.highlighter?.dispose();
    this.mouseMarkers?.hover.dispose();
    this.mouseMarkers?.select.dispose();

    if (!world) {
      return;
    }

    const scene = world.scene.three;
    this.highlighter = new CurveHighlighter(scene, this.view);

    this.mouseMarkers = {
      select: this.newMouseMarker("#ffffff", world),
      hover: this.newMouseMarker("#575757", world),
    };

    this.setupEvents(true);
  }

  protected constructor(components: OBC.Components) {
    super(components);
  }

  async draw(model: FragmentsGroup, filter?: Iterable<FRAGS.Alignment>) {
    if (!model.civilData) {
      throw new Error("The provided model doesn't have civil data!");
    }

    if (!this._world) {
      throw new Error("No world was given for this navigator!");
    }

    const { alignments } = model.civilData;
    const allAlignments = filter || alignments.values();

    const scene = this._world.scene.three;

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
        this._curves.push(curve.mesh);

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
    const scaledBbox = this.getScaledBox(totalBBox, 1.2);

    if (this._world.camera.hasCameraControls()) {
      await this._world.camera.controls.fitToBox(scaledBbox, false);
    }
  }

  async dispose() {
    this.highlighter?.dispose();
    this.clear();
    this.onHighlight.reset();
    this._curves = [];
  }

  clear() {
    this.highlighter?.unSelect();
    this.highlighter?.unHover();
    for (const mesh of this._curves) {
      mesh.removeFromParent();
    }
    this._curves = [];
  }

  setMarker(alignment: Alignment, percentage: number, type: CivilMarkerType) {
    if (!this._curves.length) {
      return;
    }
    const found = alignment.getCurveAt(percentage, this.view);
    const point = alignment.getPointAt(percentage, this.view);
    const { index } = found.curve.getSegmentAt(found.percentage);
    this.setMouseMarker(point, found.curve.mesh, index, type);
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
    if (this.mouseMarkers) {
      this.mouseMarkers[type].visible = false;
    }
  }

  private setupEvents(active: boolean) {
    if (!this._world) {
      throw new Error("No world was given for this navigator!");
    }

    if (!this._world.renderer) {
      return;
    }

    const canvas = this._world.renderer.three.domElement;
    const container = canvas.parentElement as HTMLElement;

    container.removeEventListener("mousemove", this.onMouseMove);
    container.removeEventListener("click", this.onClick);
    if (this._world.camera.hasCameraControls()) {
      const controls = this._world.camera.controls;
      controls.removeEventListener("update", this.onControlsUpdated);
    }

    if (active) {
      container.addEventListener("mousemove", this.onMouseMove);
      container.addEventListener("click", this.onClick);
      if (this._world.camera.hasCameraControls()) {
        const controls = this._world.camera.controls;
        controls.addEventListener("update", this.onControlsUpdated);
      }
    }
  }

  private newMouseMarker(color: string, world: OBC.World) {
    if (!this._world) {
      throw new Error("No world was given for this navigator!");
    }
    const scene = world.scene.three;
    const root = document.createElement("div");
    const bar = document.createElement("div");
    root.appendChild(bar);
    bar.style.backgroundColor = color;
    bar.style.width = "3rem";
    bar.style.height = "3px";
    const mouseMarker = new Mark(this._world, root, scene);
    mouseMarker.visible = false;
    return mouseMarker;
  }

  private setMouseMarker(
    point: THREE.Vector3,
    object: THREE.Object3D,
    index: number | undefined,
    type: CivilMarkerType,
  ) {
    if (index === undefined || !this.mouseMarkers) return;
    this.mouseMarkers[type].visible = true;
    const marker = this.mouseMarkers[type].three;
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

  private updateMarker(intersects: THREE.Intersection, type: CivilMarkerType) {
    const { point, index, object } = intersects;
    const mesh = object as FRAGS.CurveMesh;
    const curve = mesh.curve;
    const alignment = mesh.curve.alignment;
    const percentage = alignment.getPercentageAt(point, this.view);
    const markerPoint = point.clone();
    this.setMouseMarker(markerPoint, mesh, index, type);
    if (percentage !== null) {
      this.onMarkerChange.trigger({ alignment, percentage, type, curve });
    }
  }

  private onMouseMove = (event: MouseEvent) => {
    if (!this._world) {
      throw new Error("No world was given for this navigator!");
    }

    if (!this._world.renderer) {
      return;
    }

    const canvas = this._world.renderer.three.domElement;
    const dom = canvas.parentElement as HTMLElement;
    const camera = this._world.camera.three;

    const result = this.highlighter?.castRay(event, camera, dom, this._curves);

    if (result) {
      const { object } = result;
      this.highlighter?.hover(object as FRAGS.CurveMesh);
      this.updateMarker(result, "hover");
      return;
    }

    if (this.mouseMarkers) {
      this.mouseMarkers.hover.visible = false;
    }
    this.highlighter?.unHover();
    this.onMarkerHidden.trigger({ type: "hover" });
  };

  private onClick = (event: MouseEvent) => {
    if (!this._world) {
      throw new Error("No world was given for this navigator!");
    }

    if (!this._world.renderer) {
      return;
    }

    const canvas = this._world.renderer.three.domElement;
    const dom = canvas.parentElement as HTMLElement;
    const camera = this._world.camera.three;

    const found = this.highlighter?.castRay(event, camera, dom, this._curves);

    if (found) {
      const result = found;
      const mesh = result.object as FRAGS.CurveMesh;
      this.highlighter?.select(mesh);
      this.updateMarker(result, "select");

      if (this._world.camera.hasCameraControls()) {
        if (!mesh.geometry.boundingBox) {
          mesh.geometry.computeBoundingBox();
        }
        if (mesh.geometry.boundingBox) {
          const box = this.getScaledBox(mesh.geometry.boundingBox, 2);
          this._world.camera.controls.fitToBox(box, true);
        }
      }

      this.onHighlight.trigger({ mesh, point: result.point });

      if (this._previousAlignment !== mesh.curve.alignment) {
        const marker = this.components.get(CivilMarker);

        marker.deleteByType();
        marker.showKPStations(mesh);
        this._previousAlignment = mesh.curve.alignment;
      }
    }

    // this.highlighter.unSelect();
    // this.clearKPStations();
  };

  private onControlsUpdated = () => {
    if (!this._world) {
      throw new Error("No world was given for this navigator!");
    }

    if (!(this._world.camera.three instanceof THREE.OrthographicCamera)) {
      return;
    }

    if (!this.highlighter) {
      return;
    }

    const { zoom, left, right, top, bottom } = this._world.camera.three;
    const width = left - right;
    const height = top - bottom;
    const screenSize = Math.max(width, height);
    const realScreenSize = screenSize / zoom;
    const range = 40;
    const { caster } = this.highlighter;
    caster.params.Line.threshold = realScreenSize / range;
  };

  private getScaledBox(totalBBox: THREE.Box3, factor: number) {
    const scaledBbox = new THREE.Box3();
    const size = new THREE.Vector3();
    const center = new THREE.Vector3();
    totalBBox.getCenter(center);
    totalBBox.getSize(size);
    size.multiplyScalar(factor);
    scaledBbox.setFromCenterAndSize(center, size);
    return scaledBbox;
  }
}
