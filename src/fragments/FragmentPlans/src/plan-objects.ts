import * as THREE from "three";
import { Components } from "../../../core";
import { FragmentBoundingBox } from "../../FragmentBoundingBox";

export class PlanObjects {
  offsetFactor = 0.2;

  private _min = new THREE.Vector3();
  private _max = new THREE.Vector3();
  private _components: Components;
  private _objects: { [id: string]: THREE.Group } = {};
  private _visible = false;
  private _geometry = new THREE.PlaneGeometry(1, 1, 1);
  private _material = new THREE.MeshBasicMaterial({
    transparent: true,
    opacity: 0.3,
  });

  get visible() {
    return this._visible;
  }

  set visible(active: boolean) {
    this._visible = active;
    const scene = this._components.scene.get();
    for (const id in this._objects) {
      const item = this._objects[id];
      if (active) {
        scene.add(item);
      } else {
        item.removeFromParent();
      }
    }
  }

  constructor(components: Components) {
    this._components = components;
    this.resetBounds();
  }

  dispose() {
    this.visible = false;
    this._objects = {};
    this._geometry.dispose();
    this._material.dispose();
    (this._components as any) = null;
  }

  add(id: string, point: THREE.Vector3) {
    const root = new THREE.Group();
    const mesh = new THREE.Mesh(this._geometry, this._material);
    mesh.scale.x = 10;
    mesh.scale.y = 10;
    mesh.rotation.x = -Math.PI / 2;
    mesh.position.copy(point);
    root.add(mesh);
    this._objects[id] = root;
  }

  setBounds(points: THREE.Vector3[], override = false) {
    if (override) {
      this.resetBounds();
    }
    const bbox = FragmentBoundingBox.getBounds(points, this._min, this._max);
    this._min = bbox.min;
    this._max = bbox.max;
    const dimensions = FragmentBoundingBox.getDimensions(bbox);
    const { width, depth, center } = dimensions;
    const offset = (width + depth / 2) * this.offsetFactor;
    for (const id in this._objects) {
      const object = this._objects[id];
      const plane = object.children[0];
      plane.scale.set(width + offset, depth + offset, 1);
      object.position.x = center.x;
      object.position.z = center.z;
    }
  }

  private resetBounds() {
    this._min = FragmentBoundingBox.newBound(true);
    this._max = FragmentBoundingBox.newBound(false);
  }
}
