import * as THREE from "three";
import { Simple2DMarker } from "../../core/Simple2DMarker/index";
import { Hideable, Event, Disposable } from "../../base-types";
import { Component } from "../../base-types/component";
import { DimensionLabelClassName } from "../../core";
import { Components } from "../../core/Components";

interface Angle {
  points: THREE.Vector3[];
  angle: number;
}

export class AngleMeasureElement
  extends Component<Angle>
  implements Hideable, Disposable
{
  name: string = "AngleMeasureElement";
  enabled: boolean = true;
  visible: boolean = true;
  points: THREE.Vector3[] = [];
  labelMarker: Simple2DMarker;

  // @ts-ignore
  private _components: Components;
  private _defaultLineMaterial = new THREE.LineBasicMaterial({ color: "red" });
  private _lineGeometry = new THREE.BufferGeometry().setAttribute(
    "position",
    new THREE.Float32BufferAttribute([0, 0, 0, 0, 0, 0, 0, 0, 0], 3)
  );
  private _line = new THREE.Line(this._lineGeometry, this._defaultLineMaterial);

  readonly onAngleComputed = new Event<number>();
  readonly onPointAdded = new Event<THREE.Vector3>();

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
    const positionAttribute = this._lineGeometry.getAttribute("position");
    positionAttribute.setX(_index, point.x);
    positionAttribute.setY(_index, point.y);
    positionAttribute.setZ(_index, point.z);
    positionAttribute.needsUpdate = true;
  }

  constructor(components: Components, points?: THREE.Vector3[]) {
    super();
    this._components = components;
    const htmlText = document.createElement("div");
    htmlText.className = DimensionLabelClassName;
    this.labelMarker = new Simple2DMarker(components, htmlText);
    this.labelMarker.visible = false;
    this.onPointAdded.on(() => {
      if (this.points.length === 2) {
        this.labelMarker.visible = true;
      }
      if (this.points.length === 1) {
        this._components.scene.get().add(this._line);
      }
    });
    points?.forEach((point) => this.setPoint(point));
  }

  toggleLabel() {
    this.labelMarker.toggleVisibility();
  }

  private getGeometryPosition(index: 0 | 1 | 2) {
    const positionAttribute = this._lineGeometry.getAttribute("position");
    return new THREE.Vector3(
      positionAttribute.getX(index),
      positionAttribute.getY(index),
      positionAttribute.getZ(index)
    );
  }

  computeAngle() {
    const v0 = this.getGeometryPosition(0);
    const v1 = this.getGeometryPosition(1);
    const v2 = this.getGeometryPosition(2);
    const vA = new THREE.Vector3().subVectors(v1, v0);
    const vB = new THREE.Vector3().subVectors(v1, v2);
    const angle = THREE.MathUtils.radToDeg(vA.angleTo(vB));
    this.labelMarker.get().element.textContent = `${angle.toFixed(2)}°`;
    this.labelMarker.get().position.copy(v1);
    this.onAngleComputed.trigger(angle);
    return angle;
  }

  dispose() {
    this.points = [];
    this.labelMarker.dispose();
    this._line.removeFromParent();
    this._defaultLineMaterial.dispose();
    this._lineGeometry.dispose();
  }

  get(): Angle {
    return {
      points: this.points,
      angle: this.computeAngle(),
    };
  }
}
