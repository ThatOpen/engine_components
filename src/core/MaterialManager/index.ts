import * as THREE from "three";
import { Component, Disposable } from "../../base-types";
import { Components } from "../Components";

// TODO: Clean up and document
// TODO: Disable / enable instance color for instance meshes

export class MaterialManager extends Component<string[]> implements Disposable {
  private _components: Components;
  private _originalBackground: THREE.Color | null = null;

  enabled = true;
  name = "MaterialManager";

  private _originals: {
    [guid: string]: THREE.Material[] | THREE.Material;
  } = {};

  private _list: {
    [id: string]: {
      material: THREE.Material;
      meshes: Set<THREE.Mesh>;
    };
  } = {};

  constructor(components: Components) {
    super();
    this._components = components;
  }

  get() {
    return Object.keys(this._list);
  }

  set(active: boolean, ids = Object.keys(this._list)) {
    for (const id of ids) {
      const { material, meshes } = this._list[id];
      for (const mesh of meshes) {
        if (active) {
          this._originals[mesh.uuid] = mesh.material;
          mesh.material = material;
        } else {
          mesh.material = this._originals[mesh.uuid];
        }
      }
    }
  }

  dispose() {
    for (const id in this._list) {
      const { material } = this._list[id];
      material.dispose();
    }
    this._list = {};
    this._originals = {};
    (this._components as any) = null;
  }

  setBackgroundColor(color: THREE.Color) {
    const scene = this._components.scene.get();
    this._originalBackground = scene.background as THREE.Color;
    if (this._originalBackground) {
      scene.background = color;
    }
  }

  resetBackgroundColor() {
    const scene = this._components.scene.get();
    if (this._originalBackground) {
      scene.background = this._originalBackground;
    }
  }

  addMaterial(id: string, material: THREE.Material) {
    if (this._list[id]) {
      throw new Error("This ID already exists!");
    }
    this._list[id] = { material, meshes: new Set() };
  }

  addMeshes(id: string, meshes: THREE.Mesh[]) {
    if (!this._list[id]) {
      throw new Error("This ID doesn't exists!");
    }
    for (const mesh of meshes) {
      this._list[id].meshes.add(mesh);
    }
  }
}
