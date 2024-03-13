import * as THREE from "three";
import { Component, Disposable, Event } from "../../base-types";
import { Components } from "../Components";
import { ToolComponent } from "../ToolsComponent";

// TODO: Clean up and document
// TODO: Disable / enable instance color for instance meshes

/**
 * A tool to easily handle the materials of massive amounts of
 * objects and scene background easily.
 */
export class MaterialManager extends Component<string[]> implements Disposable {
  static readonly uuid = "24989d27-fa2f-4797-8b08-35918f74e502" as const;

  /** {@link Component.enabled} */
  enabled = true;

  private _originalBackground: THREE.Color | null = null;

  /** {@link Disposable.onDisposed} */
  readonly onDisposed = new Event<string>();

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
  }

  /**
   * {@link Component.get}.
   * @return list of created materials.
   */
  get() {
    return Object.keys(this._list);
  }

  /**
   * Turns the specified material styles on or off.
   *
   * @param active whether to turn it on or off.
   * @param ids the ids of the style to turn on or off.
   */
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

  /** {@link Disposable.dispose} */
  async dispose() {
    for (const id in this._list) {
      const { material } = this._list[id];
      material.dispose();
    }
    this._list = {};
    this._originals = {};
    await this.onDisposed.trigger(MaterialManager.uuid);
    this.onDisposed.reset();
  }

  /**
   * Sets the color of the background of the scene.
   *
   * @param color: the color to apply.
   */
  setBackgroundColor(color: THREE.Color) {
    const scene = this.components.scene.get();
    if (!this._originalBackground) {
      this._originalBackground = scene.background as THREE.Color;
    }
    if (this._originalBackground) {
      scene.background = color;
    }
  }

  /**
   * Resets the scene background to the color that was being used
   * before applying the material manager.
   */
  resetBackgroundColor() {
    const scene = this.components.scene.get();
    if (this._originalBackground) {
      scene.background = this._originalBackground;
    }
  }

  /**
   * Creates a new material style.
   * @param id the identifier of the style to create.
   * @param material the material of the style.
   */
  addMaterial(id: string, material: THREE.Material) {
    if (this._list[id]) {
      throw new Error("This ID already exists!");
    }
    this._list[id] = { material, meshes: new Set() };
  }

  /**
   * Assign meshes to a certain style.
   * @param id the identifier of the style.
   * @param meshes the meshes to assign to the style.
   */
  addMeshes(id: string, meshes: THREE.Mesh[]) {
    if (!this._list[id]) {
      throw new Error("This ID doesn't exists!");
    }
    for (const mesh of meshes) {
      this._list[id].meshes.add(mesh);
    }
  }

  /**
   * Remove meshes from a certain style.
   * @param id the identifier of the style.
   * @param meshes the meshes to assign to the style.
   */
  removeMeshes(id: string, meshes: THREE.Mesh[]) {
    if (!this._list[id]) {
      throw new Error("This ID doesn't exists!");
    }
    for (const mesh of meshes) {
      this._list[id].meshes.delete(mesh);
    }
  }
}

ToolComponent.libraryUUIDs.add(MaterialManager.uuid);
