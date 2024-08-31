import * as THREE from "three";
import { CullerRenderer } from "./culler-renderer";
import { Components } from "../../Components";
import { Disposer } from "../../Disposer";
import { Event, World, Disposable } from "../../Types";
import { MaterialsUtils } from "../../../utils";

/**
 * A renderer to hide/show meshes depending on their visibility from the user's point of view.
 */
export class MeshCullerRenderer extends CullerRenderer implements Disposable {
  /**
   * Event triggered when the visibility of meshes is updated.
   * Contains two sets: seen and unseen.
   */
  readonly onViewUpdated: Event<{
    seen: Set<THREE.Mesh>;
    unseen: Set<THREE.Mesh>;
  }> = new Event();

  /**
   * Map of color code to THREE.InstancedMesh.
   * Used to keep track of color-coded meshes.
   */
  colorMeshes = new Map<string, THREE.InstancedMesh>();

  /**
   * @deprecated use config.threshold instead.
   */
  get threshold() {
    return this.config.threshold;
  }

  /**
   * @deprecated use config.threshold instead.
   */
  set threshold(value: number) {
    this.config.threshold = value;
  }

  private _colorCodeMeshMap = new Map<string, THREE.Mesh>();
  private _meshIDColorCodeMap = new Map<string, string>();
  private _currentVisibleMeshes = new Set<THREE.Mesh>();
  private _recentlyHiddenMeshes = new Set<THREE.Mesh>();

  private readonly _transparentMat = new THREE.MeshBasicMaterial({
    transparent: true,
    opacity: 0,
  });

  constructor(components: Components, world: World) {
    super(components, world);
    this.worker.addEventListener("message", this.handleWorkerMessage);

    this.onViewUpdated.add(({ seen, unseen }) => {
      for (const mesh of seen) {
        mesh.visible = true;
      }
      for (const mesh of unseen) {
        mesh.visible = false;
      }
    });
  }

  /** {@link Disposable.dispose} */
  dispose() {
    super.dispose();
    this._currentVisibleMeshes.clear();
    this._recentlyHiddenMeshes.clear();

    this._meshIDColorCodeMap.clear();
    this._transparentMat.dispose();
    this._colorCodeMeshMap.clear();
    const disposer = this.components.get(Disposer);
    for (const id in this.colorMeshes) {
      const mesh = this.colorMeshes.get(id);
      if (mesh) {
        disposer.destroy(mesh, true);
      }
    }
    this.colorMeshes.clear();
  }

  /**
   * Adds a mesh to the culler. When the mesh is not visibile anymore, it will be removed from the scene. When it's visible again, it will be added to the scene.
   * @param mesh - The mesh to add. It can be a regular THREE.Mesh or an instance of THREE.InstancedMesh.
   */
  add(mesh: THREE.Mesh | THREE.InstancedMesh) {
    if (!this.enabled) return;

    if (this.preventUpdate) {
      console.log("Culler processing not finished yet.");
      return;
    }

    this.preventUpdate = true;

    const isInstanced = mesh instanceof THREE.InstancedMesh;

    const { geometry, material } = mesh;

    const { colorMaterial, code } = this.getAvailableMaterial();

    let newMaterial: THREE.Material[] | THREE.Material;

    if (Array.isArray(material)) {
      let transparentOnly = true;
      const matArray: any[] = [];

      for (const mat of material) {
        if (MaterialsUtils.isTransparent(mat)) {
          matArray.push(this._transparentMat);
        } else {
          transparentOnly = false;
          matArray.push(colorMaterial);
        }
      }

      // If we find that all the materials are transparent then we must remove this from analysis
      if (transparentOnly) {
        colorMaterial.dispose();
        this.preventUpdate = false;
        return;
      }

      newMaterial = matArray;
    } else if (MaterialsUtils.isTransparent(material)) {
      // This material is transparent, so we must remove it from analysis
      // TODO: Make transparent meshes blink like in the memory culler?
      colorMaterial.dispose();
      this.preventUpdate = false;
      return;
    } else {
      newMaterial = colorMaterial;
    }

    this._colorCodeMeshMap.set(code, mesh);
    this._meshIDColorCodeMap.set(mesh.uuid, code);

    const count = isInstanced ? mesh.count : 1;
    const colorMesh = new THREE.InstancedMesh(geometry, newMaterial, count);

    if (isInstanced) {
      colorMesh.instanceMatrix = mesh.instanceMatrix;
    } else {
      colorMesh.setMatrixAt(0, new THREE.Matrix4());
    }

    mesh.visible = false;

    mesh.updateWorldMatrix(true, false);
    colorMesh.applyMatrix4(mesh.matrixWorld);
    colorMesh.updateMatrix();

    this.scene.add(colorMesh);
    this.colorMeshes.set(mesh.uuid, colorMesh);

    this.increaseColor();

    this.preventUpdate = false;
  }

  /**
   * Removes a mesh from the culler, so its visibility is not controlled by the culler anymore.
   * When the mesh is removed, it will be hidden from the scene and its color-coded mesh will be destroyed.
   * @param mesh - The mesh to remove. It can be a regular THREE.Mesh or an instance of THREE.InstancedMesh.
   */
  remove(mesh: THREE.Mesh | THREE.InstancedMesh) {
    if (this.preventUpdate) {
      console.log("Culler processing not finished yet.");
      return;
    }

    this.preventUpdate = true;

    const disposer = this.components.get(Disposer);

    this._currentVisibleMeshes.delete(mesh);
    this._recentlyHiddenMeshes.delete(mesh);

    const colorMesh = this.colorMeshes.get(mesh.uuid);
    const code = this._meshIDColorCodeMap.get(mesh.uuid);

    if (!colorMesh || !code) {
      this.preventUpdate = false;
      return;
    }

    this._colorCodeMeshMap.delete(code);
    this._meshIDColorCodeMap.delete(mesh.uuid);
    this.colorMeshes.delete(mesh.uuid);
    colorMesh.geometry = undefined as any;
    colorMesh.material = [];
    disposer.destroy(colorMesh, true);

    this._recentlyHiddenMeshes.delete(mesh);
    this._currentVisibleMeshes.delete(mesh);

    this.preventUpdate = false;
  }

  /**
   * Updates the given instanced meshes inside the culler. You should use this if you change the count property, e.g. when changing the visibility of fragments.
   *
   * @param meshes - The meshes to update.
   *
   * @returns {void}
   */
  updateInstanced(meshes: Iterable<THREE.InstancedMesh>) {
    for (const mesh of meshes) {
      const colorMesh = this.colorMeshes.get(mesh.uuid);
      if (!colorMesh) {
        continue;
      }
      colorMesh.count = mesh.count;
    }
  }

  private handleWorkerMessage = async (event: MessageEvent) => {
    if (this.preventUpdate) {
      return;
    }

    const colors = event.data.colors as Map<string, number>;

    this._recentlyHiddenMeshes = new Set(this._currentVisibleMeshes);
    this._currentVisibleMeshes.clear();

    for (const [code, pixels] of colors) {
      if (pixels < this.config.threshold) {
        continue;
      }
      const mesh = this._colorCodeMeshMap.get(code);
      if (mesh) {
        this._currentVisibleMeshes.add(mesh);
        this._recentlyHiddenMeshes.delete(mesh);
      }
    }

    this.onViewUpdated.trigger({
      seen: this._currentVisibleMeshes,
      unseen: this._recentlyHiddenMeshes,
    });

    this._isWorkerBusy = false;
  };

  private getAvailableMaterial() {
    const { r, g, b, code } = this.getAvailableColor();

    const colorEnabled = THREE.ColorManagement.enabled;
    THREE.ColorManagement.enabled = false;

    const color = new THREE.Color(`rgb(${r}, ${g}, ${b})`);

    if (!this.world.renderer) {
      throw new Error("Renderer not found in the world!");
    }

    const clippingPlanes = this.world.renderer.clippingPlanes;
    const colorMaterial = new THREE.MeshBasicMaterial({
      color,
      clippingPlanes,
      side: THREE.DoubleSide,
    });

    THREE.ColorManagement.enabled = colorEnabled;
    return { colorMaterial, code };
  }
}
