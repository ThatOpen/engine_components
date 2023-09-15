import * as THREE from "three";
import { Component, Disposable } from "../../base-types";
import { Components } from "../Components";

// TODO: Clean up and document
// TODO: Disable / enable instance color for instance meshes

export class MaterialManager extends Component<string[]> implements Disposable {
  static readonly uuid = "24989d27-fa2f-4797-8b08-35918f74e502" as const;

  /** {@link Component.enabled} */
  enabled = true;

  private _originalBackground: THREE.Color | null = null;

  private _originals: {
    [guid: string]: {
      material: THREE.Material[] | THREE.Material;
      instances?: any;
    };
  } = {};

  private _list: {
    [id: string]: {
      material: THREE.Material;
      meshes: Set<THREE.Mesh | THREE.InstancedMesh>;
    };
  } = {};

  constructor(components: Components) {
    super(components);
    this.components.tools.add(MaterialManager.uuid, this);
    this.components.tools.libraryUUIDs.add(MaterialManager.uuid);
  }

  /**
   * {@link Component.get}.
   * @return list of created materials.
   */
  get() {
    return Object.keys(this._list);
  }

  set(active: boolean, ids = Object.keys(this._list)) {
    for (const id of ids) {
      const { material, meshes } = this._list[id];
      for (const mesh of meshes) {
        if (active) {
          if (!this._originals[mesh.uuid]) {
            this._originals[mesh.uuid] = { material: mesh.material };
          }
          if (mesh instanceof THREE.InstancedMesh && mesh.instanceColor) {
            this._originals[mesh.uuid].instances = mesh.instanceColor;
            mesh.instanceColor = null;
          }
          mesh.material = material;
        } else {
          if (!this._originals[mesh.uuid]) continue;
          mesh.material = this._originals[mesh.uuid].material;
          const instances = this._originals[mesh.uuid].instances;
          if (mesh instanceof THREE.InstancedMesh && instances) {
            mesh.instanceColor = instances;
          }
        }
      }
    }
  }

  async dispose() {
    for (const id in this._list) {
      const { material } = this._list[id];
      material.dispose();
    }
    this._list = {};
    this._originals = {};
  }

  setBackgroundColor(color: THREE.Color) {
    const scene = this.components.scene.get();
    if (!this._originalBackground) {
      this._originalBackground = scene.background as THREE.Color;
    }
    if (this._originalBackground) {
      scene.background = color;
    }
  }

  resetBackgroundColor() {
    const scene = this.components.scene.get();
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
