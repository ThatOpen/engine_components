import { Line, Raycaster, Vector3 } from "three";
import { CSS2DObject } from "three/examples/jsm/renderers/CSS2DRenderer";
import { Event, Updateable } from "../../base-types/base-types";
import { Mouse } from "../../base-types/mouse";
import { Component } from "../../base-types/component";
import { Components } from "../../core/Components";

interface LineIntersectionPickerConfig {
  snapDistance: number;
}

export class LineIntersectionPicker
  extends Component<Vector3 | null>
  implements Updateable
{
  name: string = "LineIntersectionPicker";
  afterUpdate: Event<LineIntersectionPicker> = new Event();
  beforeUpdate: Event<LineIntersectionPicker> = new Event();
  private _pickedPoint: Vector3 | null = null;
  private _config!: LineIntersectionPickerConfig;
  private _enabled!: boolean;
  private _components: Components;
  private _marker: CSS2DObject;
  private _raycaster = new Raycaster();
  private _mouse: Mouse;
  private _originVector = new Vector3();

  set enabled(value: boolean) {
    this._enabled = value;
    if (!value) {
      this._pickedPoint = null;
    }
  }

  get enabled() {
    return this._enabled;
  }

  constructor(
    components: Components,
    config?: Partial<LineIntersectionPickerConfig>
  ) {
    super();
    this._components = components;
    this.config = {
      snapDistance: 0.25,
      ...config,
    };
    if (this._raycaster.params.Line) {
      this._raycaster.params.Line.threshold = 0.2;
    }
    this._mouse = new Mouse(components.renderer.get().domElement);
    const marker = document.createElement("div");
    marker.className = "w-[15px] h-[15px] border-3 border-solid border-red-500";
    this._marker = new CSS2DObject(marker);
    this._marker.visible = false;
    this._components.scene.get().add(this._marker);
    this.enabled = false;
  }

  set config(value: Partial<LineIntersectionPickerConfig>) {
    this._config = { ...this._config, ...value };
  }

  get config() {
    return this._config;
  }

  /** {@link Updateable.update} */
  update() {
    if (!this.enabled) {
      return;
    }
    this.beforeUpdate.trigger(this);

    this._raycaster.setFromCamera(
      this._mouse.position,
      this._components.camera.get()
    );
    // @ts-ignore
    const lines = this._components.meshes.filter((mesh) => mesh.isLine);
    const intersects = this._raycaster.intersectObjects(lines);

    // console.log(intersects)
    if (intersects.length !== 2) {
      this._pickedPoint = null;
      this.updateMarker();
      return;
    }

    // if (!intersects[0].index || !intersects[1].index) {return}
    const lineA = intersects[0].object as Line;
    const lineB = intersects[1].object as Line;
    const indices = [intersects[0].index, intersects[1].index] as number[];
    const hitPoint = new Vector3()
      .copy(intersects[0].point)
      .add(intersects[1].point)
      .multiplyScalar(0.5);
    const isSameElement = lineA.uuid === lineB.uuid;
    if (isSameElement) {
      const line = lineA;
      const pos = line.geometry.getAttribute("position");
      const vectorA = new Vector3().fromBufferAttribute(pos, indices[0]);
      const vectorB = new Vector3().fromBufferAttribute(pos, indices[0] + 1);
      const vectorC = new Vector3().fromBufferAttribute(pos, indices[1]);
      const vectorD = new Vector3().fromBufferAttribute(pos, indices[1] + 1);
      const point = this.findIntersection(vectorA, vectorB, vectorC, vectorD);
      if (!point) {
        return;
      }
      this._pickedPoint = point;
      if (this._pickedPoint.distanceTo(hitPoint) > 0.25) {
        return;
      }
      this.updateMarker();
    } else {
      const pos1 = lineA.geometry.getAttribute("position");
      const pos2 = lineB.geometry.getAttribute("position");
      const vectorA = new Vector3().fromBufferAttribute(pos1, indices[0]);
      const vectorB = new Vector3().fromBufferAttribute(pos1, indices[0] + 1);
      const vectorC = new Vector3().fromBufferAttribute(pos2, indices[1]);
      const vectorD = new Vector3().fromBufferAttribute(pos2, indices[1] + 1);
      const point = this.findIntersection(vectorA, vectorB, vectorC, vectorD);
      if (!point) {
        return;
      }
      this._pickedPoint = point;
      if (this._pickedPoint.distanceTo(hitPoint) > 0.25) {
        return;
      }
      this.updateMarker();
    }

    this.afterUpdate.trigger(this);
  }

  private findIntersection(p1: Vector3, p2: Vector3, p3: Vector3, p4: Vector3) {
    const line1Dir = p2.sub(p1);
    const line2Dir = p4.sub(p3);
    const lineDirCross = new Vector3().crossVectors(line1Dir, line2Dir);
    const denominator = lineDirCross.lengthSq();
    if (denominator === 0) {
      return null;
    }
    const lineToPoint = p3.sub(p1);
    const lineToPointCross = new Vector3().crossVectors(
      lineDirCross,
      lineToPoint
    );
    const t1 = lineToPointCross.dot(line2Dir) / denominator;
    const intersectionPoint = new Vector3().addVectors(
      p1,
      line1Dir.multiplyScalar(t1)
    );
    return intersectionPoint;
  }

  private updateMarker() {
    this._marker.visible = !!this._pickedPoint;
    this._marker.position.copy(this._pickedPoint ?? this._originVector);
  }

  get(): Vector3 | null {
    return this._pickedPoint;
  }
}
