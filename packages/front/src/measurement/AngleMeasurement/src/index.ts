import * as THREE from "three";
import * as OBC from "@thatopen/components";
import { LineGeometry } from "three/examples/jsm/lines/LineGeometry.js";
import { LineMaterial } from "three/examples/jsm/lines/LineMaterial.js";
import { Line2 } from "three/examples/jsm/lines/Line2.js";
import { Mark } from "../../../core";
import { newDimensionMark } from "../../utils";

interface Angle {
  points: THREE.Vector3[];
  angle: number;
}

export class AngleMeasureElement implements OBC.Hideable, OBC.Disposable {
  enabled: boolean = true;

  visible: boolean = true;

  points: THREE.Vector3[] = [];

  world: OBC.World;

  readonly onDisposed = new OBC.Event();

  private _lineMaterial = new LineMaterial({
    color: 0x6528d7,
    linewidth: 2,
  });

  private _lineGeometry = new LineGeometry();

  private _line = new Line2(this._lineGeometry, this._lineMaterial);

  private _labelMarker: Mark;

  readonly onAngleComputed = new OBC.Event<number>();
  readonly onPointAdded = new OBC.Event();

  set lineMaterial(material: LineMaterial) {
    this._lineMaterial.dispose();
    this._lineMaterial = material;
    this._line.material = material;
    this._lineMaterial.resolution.set(window.innerWidth, window.innerHeight);
  }

  get lineMaterial() {
    return this._lineMaterial;
  }

  set labelMarker(marker: Mark) {
    this._labelMarker.dispose();
    this._labelMarker = marker;
  }

  get labelMarker() {
    return this._labelMarker;
  }

  get angle(): Angle {
    return {
      points: this.points,
      angle: this.computeAngle(),
    };
  }

  constructor(world: OBC.World, points?: THREE.Vector3[]) {
    this.world = world;

    const htmlText = newDimensionMark();
    this._labelMarker = new Mark(world, htmlText);
    this.labelMarker.visible = true;

    this.onPointAdded.add(() => {
      if (this.points.length === 1) world.scene.three.add(this._line);
      if (this.points.length === 3) this.labelMarker.visible = true;
    });

    this.onAngleComputed.add((angle) => {
      this.labelMarker.three.element.textContent = `${angle.toFixed(2)}°`;
      this.labelMarker.three.position.copy(
        this.points[1] ?? new THREE.Vector3(),
      );
    });

    points?.forEach((point) => this.setPoint(point));
  }

  setPoint(point: THREE.Vector3, index?: 0 | 1 | 2) {
    let _index: number;
    if (!index) {
      _index = this.points.length === 0 ? 0 : this.points.length;
    } else {
      _index = index;
    }
    if (![0, 1, 2].includes(_index)) return;
    this.points[_index] = point;
    this.onPointAdded.trigger(point);
    const points = this.points.map((point) => {
      return [point.x, point.y, point.z];
    });
    this._lineGeometry.setPositions(points.flat());
  }

  toggleLabel() {
    this.labelMarker.toggleVisibility();
  }

  computeAngle() {
    const v0 = this.points[0];
    const v1 = this.points[1];
    const v2 = this.points[2];
    if (!(v0 && v1 && v2)) return 0;
    const vA = new THREE.Vector3().subVectors(v1, v0);
    const vB = new THREE.Vector3().subVectors(v1, v2);
    const angle = THREE.MathUtils.radToDeg(vA.angleTo(vB));
    this.onAngleComputed.trigger(angle);
    return angle;
  }

  dispose() {
    this.points = [];
    this.labelMarker.dispose();
    this.onAngleComputed.reset();
    this.onPointAdded.reset();
    this.labelMarker.dispose();
    this._line.removeFromParent();
    this._lineMaterial.dispose();
    this._lineGeometry.dispose();
    this.onDisposed.trigger();
    this.onDisposed.reset();
  }
}
