import * as THREE from "three";
import { Component, Disposable, Event, World } from "../Types";
import { Components } from "../Components";

// TODO: Clean up and document
// TODO: Disable / enable instance color for instance meshes

/**
 * A tool to easily handle the materials of massive amounts of
 * objects and scene background easily.
 */
export class Materials extends Component implements Disposable {
  static readonly uuid = "24989d27-fa2f-4797-8b08-35918f74e502" as const;

  /** {@link Component.enabled} */
  enabled = true;

  private _originalBackground = new Map<string, THREE.Color>();

  /** {@link Disposable.onDisposed} */
  readonly onDisposed = new Event<string>();

  list: {
    [id: string]: {
      material: THREE.Material;
      meshes: Set<THREE.Mesh | THREE.InstancedMesh>;
    };
  } = {};

  private _originals: {
    [guid: string]: {
      material: THREE.Material[] | THREE.Material;
      instances?: any;
    };
  } = {};

  constructor(components: Components) {
    super(components);
    this.components.add(Materials.uuid, this);
  }

  /**
   * Turns the specified material styles on or off.
   *
   * @param active whether to turn it on or off.
   * @param ids the ids of the style to turn on or off.
   */
  set(active: boolean, ids = Object.keys(this.list)) {
    for (const id of ids) {
      const { material, meshes } = this.list[id];
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
  dispose() {
    for (const id in this.list) {
      const { material } = this.list[id];
      material.dispose();
    }
    this.list = {};
    this._originals = {};
    this.onDisposed.trigger(Materials.uuid);
    this.onDisposed.reset();
    this._originalBackground.clear();
  }

  /**
   * Sets the color of the background of the scene.
   *
   * @param color: the color to apply.
   */
  setBackgroundColor(color: THREE.Color, world: World) {
    const scene = world.scene.three;
    if (!(scene instanceof THREE.Scene)) {
      return;
    }
    if (!this._originalBackground.has(world.uuid)) {
      this._originalBackground.set(world.uuid, scene.background as THREE.Color);
    }
    if (this._originalBackground) {
      scene.background = color;
    }
  }

  /**
   * Resets the scene background to the color that was being used
   * before applying the material manager.
   */
  resetBackgroundColor(world: World) {
    const scene = world.scene.three;
    if (!(scene instanceof THREE.Scene)) {
      return;
    }
    const color = this._originalBackground.get(world.uuid);
    if (color) {
      scene.background = color;
    }
  }

  /**
   * Creates a new material style.
   * @param id the identifier of the style to create.
   * @param material the material of the style.
   */
  addMaterial(id: string, material: THREE.Material) {
    if (this.list[id]) {
      throw new Error("This ID already exists!");
    }
    this.list[id] = { material, meshes: new Set() };
  }

  /**
   * Assign meshes to a certain style.
   * @param id the identifier of the style.
   * @param meshes the meshes to assign to the style.
   */
  addMeshes(id: string, meshes: THREE.Mesh[]) {
    if (!this.list[id]) {
      throw new Error("This ID doesn't exists!");
    }
    for (const mesh of meshes) {
      this.list[id].meshes.add(mesh);
    }
  }

  /**
   * Remove meshes from a certain style.
   * @param id the identifier of the style.
   * @param meshes the meshes to assign to the style.
   */
  removeMeshes(id: string, meshes: THREE.Mesh[]) {
    if (!this.list[id]) {
      throw new Error("This ID doesn't exists!");
    }
    for (const mesh of meshes) {
      this.list[id].meshes.delete(mesh);
    }
  }
}
