import * as THREE from "three";
import * as OBC from "@thatopen/components";
import { Volume } from "./volume";
import { MeasureMark } from "./measure-mark";
import { Mesher } from "../fragments";

export class MeasureVolume {
  private readonly _root = new THREE.Group();
  private _components: OBC.Components;

  private _material = new THREE.MeshLambertMaterial({
    color: "red",
    transparent: true,
    opacity: 0.75,
    side: THREE.DoubleSide,
    depthTest: false,
  });

  set material(value: THREE.MeshLambertMaterial) {
    this._material.dispose();
    this._material = value;
    for (const mesh of this.meshes) {
      mesh.material = value;
    }
  }

  get material() {
    return this._material;
  }

  private _visible = true;

  set visible(value: boolean) {
    this._visible = value;
    this.label.visible = value;
    for (const mesh of this.meshes) {
      if (value) {
        this.world.scene.three.add(mesh);
      } else {
        mesh.removeFromParent();
      }
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

  set units(value: "m3" | "cm3" | "mm3" | "km3") {
    this.label.units = value;
  }

  get units() {
    return this.label.units as "m3" | "cm3" | "mm3" | "km3";
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
  world: OBC.World;
  volume: Volume;
  meshes: THREE.Mesh[] = [];

  constructor(
    components: OBC.Components,
    world: OBC.World,
    volume = new Volume(components),
  ) {
    this._components = components;
    this.world = world;
    this.volume = volume;
    this.label = new MeasureMark(world);
    this._root.renderOrder = 2;
    this.visible = true;
    this.update();
    this.volume.onItemsChanged.add(() => this.update());
  }

  private async updateMesh() {
    this.cleanMeshes();
    const mesher = this._components.get(Mesher);
    const result = await mesher.get(this.volume.items, {
      material: this.material,
    });

    this.meshes = mesher.getMeshesFromResult(result);
    for (const mesh of this.meshes) {
      this.world.scene.three.add(mesh);
    }
  }

  async update() {
    this.updateMesh();
    const value = await this.volume.getValue();
    this.label.visible = value !== 0;
    this.label.value = value;
    const center = await this.volume.getCenter();
    if (center) this.label.three.position.copy(center);
  }

  private cleanMeshes() {
    const disposer = this._components.get(OBC.Disposer);
    for (const mesh of this.meshes) {
      disposer.destroy(mesh, true, true);
    }

    const mesher = this._components.get(Mesher);
    mesher.remove();

    this.meshes = [];
  }

  dispose() {
    this.label.dispose();
    this.cleanMeshes();
    this.volume.items = {};
  }
}
