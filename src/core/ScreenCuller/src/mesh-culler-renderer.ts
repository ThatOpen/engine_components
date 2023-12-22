import * as THREE from "three";
import { CullerRenderer, CullerRendererSettings } from "./culler-renderer";
import { Components } from "../../Components";
import { isTransparent } from "../../../utils";
import { Event } from "../../../base-types";
import { Disposer } from "../../Disposer";

/**
 * A renderer to determine a mesh visibility on screen
 */
export class MeshCullerRenderer extends CullerRenderer {
  readonly onViewUpdated = new Event<{
    seen: Set<THREE.Mesh>;
    unseen: Set<THREE.Mesh>;
  }>();

  colorMeshes = new Map<string, THREE.InstancedMesh>();

  private readonly materialCache = new Map<string, THREE.MeshBasicMaterial>();
  private _meshColorMap = new Map<string, THREE.Mesh>();
  private _meshes = new Map<string, THREE.Mesh>();

  private _currentVisibleMeshes = new Set<THREE.Mesh>();
  private _recentlyHiddenMeshes = new Set<THREE.Mesh>();

  private readonly _transparentMat = new THREE.MeshBasicMaterial({
    transparent: true,
    opacity: 0,
  });

  constructor(components: Components, settings?: CullerRendererSettings) {
    super(components, settings);
    this.worker.addEventListener("message", this.handleWorkerMessage);
    if (this.autoUpdate) {
      window.setInterval(this.updateVisibility, this.updateInterval);
    }
  }

  async dispose() {
    await super.dispose();
    this._currentVisibleMeshes.clear();
    this._recentlyHiddenMeshes.clear();

    this._transparentMat.dispose();
    this._meshColorMap.clear();
    for (const id in this.materialCache) {
      const material = this.materialCache.get(id);
      if (material) {
        material.dispose();
      }
    }
    const disposer = this.components.tools.get(Disposer);
    for (const id in this.colorMeshes) {
      const mesh = this.colorMeshes.get(id);
      if (mesh) {
        disposer.destroy(mesh);
      }
    }
    this.colorMeshes.clear();
    this._meshes.clear();
  }

  add(mesh: THREE.Mesh | THREE.InstancedMesh): void {
    if (!this.enabled) return;

    const isInstanced = mesh instanceof THREE.InstancedMesh;

    const { geometry, material } = mesh;

    const { colorMaterial, code } = this.getNextMaterial();

    let newMaterial: THREE.Material[] | THREE.Material;

    if (Array.isArray(material)) {
      let transparentOnly = true;
      const matArray: any[] = [];

      for (const mat of material) {
        if (isTransparent(mat)) {
          matArray.push(this._transparentMat);
        } else {
          transparentOnly = false;
          matArray.push(colorMaterial);
        }
      }

      // If we find that all the materials are transparent then we must remove this from analysis
      if (transparentOnly) {
        colorMaterial.dispose();
        return;
      }

      newMaterial = matArray;
    } else if (isTransparent(material)) {
      // This material is transparent, so we must remove it from analysis
      colorMaterial.dispose();
      return;
    } else {
      newMaterial = colorMaterial;
    }

    this._meshColorMap.set(code, mesh);

    const count = isInstanced ? mesh.count : 1;
    const colorMesh = new THREE.InstancedMesh(geometry, newMaterial, count);

    if (isInstanced) {
      colorMesh.instanceMatrix = mesh.instanceMatrix;
    } else {
      colorMesh.setMatrixAt(0, new THREE.Matrix4());
    }

    mesh.visible = false;

    colorMesh.applyMatrix4(mesh.matrix);
    colorMesh.updateMatrix();

    this.scene.add(colorMesh);
    this.colorMeshes.set(mesh.uuid, colorMesh);
    this._meshes.set(mesh.uuid, mesh);
  }

  private handleWorkerMessage = async (event: MessageEvent) => {
    const colors = event.data.colors as Set<string>;

    this._recentlyHiddenMeshes = new Set(this._currentVisibleMeshes);
    this._currentVisibleMeshes.clear();

    for (const code of colors.values()) {
      const mesh = this._meshColorMap.get(code);
      if (mesh) {
        this._currentVisibleMeshes.add(mesh);
        this._recentlyHiddenMeshes.delete(mesh);
      }
    }

    await this.onViewUpdated.trigger({
      seen: this._currentVisibleMeshes,
      unseen: this._recentlyHiddenMeshes,
    });
  };

  private getNextMaterial() {
    const { r, g, b, code } = this.getNextColor();
    const colorEnabled = THREE.ColorManagement.enabled;
    THREE.ColorManagement.enabled = false;
    const color = new THREE.Color(`rgb(${r}, ${g}, ${b})`);
    let colorMaterial = this.materialCache.get(code);
    if (!colorMaterial) {
      const clippingPlanes = this.components.renderer.clippingPlanes;
      colorMaterial = new THREE.MeshBasicMaterial({
        color,
        clippingPlanes,
        side: THREE.DoubleSide,
      });
      this.materialCache.set(code, colorMaterial);
    }
    THREE.ColorManagement.enabled = colorEnabled;
    return { colorMaterial, code };
  }
}
