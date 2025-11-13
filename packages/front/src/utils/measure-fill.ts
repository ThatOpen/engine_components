import * as THREE from "three";
import * as OBC from "@thatopen/components";
import { Area } from "./area";
import { MeasureMark } from "./measure-mark";

export class MeasureFill {
  private readonly _root = new THREE.Group();
  private _components: OBC.Components;

  private _material = new THREE.MeshLambertMaterial({
    color: "red",
    transparent: true,
    opacity: 0.5,
    side: THREE.DoubleSide,
    depthTest: false,
  });

  set material(value: THREE.MeshLambertMaterial) {
    this._material.dispose();
    this._material = value;
    this.three.material = value;
  }

  get material() {
    return this._material;
  }

  private _visible = true;

  set visible(value: boolean) {
    this._visible = value;
    this.label.visible = value;
    const label = this.label.three;

    if (value) {
      this._root.add(label, this.three);
      this.world.scene.three.add(this._root);
    } else {
      label.removeFromParent();
      this._root.removeFromParent();
    }
  }

  get visible() {
    return this._visible;
  }

  set rounding(value: number) {
    this.label.rounding = value;
  }

  get rounding() {
    return this.label.rounding;
  }

  set units(value: "m2" | "cm2" | "mm2" | "km2") {
    this.label.units = value;
  }

  get units() {
    return this.label.units as "m2" | "cm2" | "mm2" | "km2";
  }

  private _color = new THREE.Color();

  set color(color: THREE.Color) {
    this._color = color;
    this.label.color = color;
    this._material.color.set(color);
  }

  get color() {
    return this._color;
  }

  readonly label: MeasureMark;
  readonly three = new THREE.Mesh();
  world: OBC.World;
  area: Area;

  constructor(components: OBC.Components, world: OBC.World, area = new Area()) {
    this._components = components;
    this.world = world;
    this.area = area;
    this.world.scene.three.add(this.three);
    this.label = new MeasureMark(world);
    this._root.renderOrder = 2;
    this.visible = true;
    this.update();

    area.points.onItemAdded.add(this._triggerUpdate);
    area.points.onItemDeleted.add(this._triggerUpdate);
    area.points.onCleared.add(this._triggerUpdate);
  }

  applyPlanesVisibility(planes: THREE.Plane[]) {
    // Using wasVisible prevents showing labels that were hidden before
    if (!this.label.wasVisible) {
      return;
    }
    let isHidden = false;
    const center = this.area.center;
    if (center) {
      for (const plane of planes) {
        if (plane.distanceToPoint(center) < 0) {
          isHidden = true;
          break;
        }
      }
    }
    this.label.three.visible = !isHidden;
  }

  private _triggerUpdate = () => this.update();

  private updateMesh() {
    if (this.area.points.size < 3) return;

    const points = [...this.area.points];

    const vertices = points.flatMap((point) => [point.x, point.y, point.z]);

    // Generate indices for the triangles (assuming the points are coplanar and ordered)
    const indices: number[] = [];
    for (let i = 1; i < points.length - 1; i++) {
      indices.push(0, i, i + 1); // Create triangles from the first point and subsequent pairs
    }

    this.three.geometry.dispose();

    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.Float32BufferAttribute(vertices, 3));
    geo.setIndex(indices);
    this.three.geometry = geo;

    this.three.material = this.material;
  }

  update() {
    this.updateMesh();
    if (this.area.value === 0) {
      this.label.visible = false;
    } else {
      this.label.value = this.area.rawValue;
      this.label.visible = true;
      const center = this.area.center;
      if (center) this.label.three.position.copy(center);
    }
  }

  dispose() {
    this.label.dispose(); // Just in case
    const disposer = this._components.get(OBC.Disposer);
    disposer.destroy(this._root, true, true);
    this.area.points.clear();
  }
}
