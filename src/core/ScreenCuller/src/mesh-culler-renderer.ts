import * as THREE from "three";
import { CullerRenderer, CullerRendererSettings } from "./culler-renderer";
import { Components } from "../../Components";
import { isTransparent } from "../../../utils";
import { Event } from "../../../base-types";
import { Disposer } from "../../Disposer";

// TODO: Use just one manterial and instanceColor for all colorMeshes

/**
 * A renderer to determine a mesh visibility on screen
 */
export class MeshCullerRenderer extends CullerRenderer {
  readonly onViewUpdated = new Event<{
    seen: Set<THREE.Mesh>;
    unseen: Set<THREE.Mesh>;
  }>();

  colorMeshes = new Map<string, THREE.InstancedMesh>();

  private _colorCodeMeshMap = new Map<string, THREE.Mesh>();
  private _meshIDColorCodeMap = new Map<string, string>();

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

    this._meshIDColorCodeMap.clear();
    this._transparentMat.dispose();
    this._colorCodeMeshMap.clear();
    const disposer = this.components.tools.get(Disposer);
    for (const id in this.colorMeshes) {
      const mesh = this.colorMeshes.get(id);
      if (mesh) {
        disposer.destroy(mesh, true);
      }
    }
    this.colorMeshes.clear();
  }

  add(mesh: THREE.Mesh | THREE.InstancedMesh) {
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

    colorMesh.applyMatrix4(mesh.matrix);
    colorMesh.updateMatrix();

    this.scene.add(colorMesh);
    this.colorMeshes.set(mesh.uuid, colorMesh);
  }

  remove(mesh: THREE.Mesh | THREE.InstancedMesh) {
    // Strategy: Substitute mesh to delete by the last mesh
    const disposer = this.components.tools.get(Disposer);

    this._currentVisibleMeshes.delete(mesh);
    this._recentlyHiddenMeshes.delete(mesh);

    const { code } = this.getLastColor();

    const colorMeshToDelete = this.colorMeshes.get(mesh.uuid);
    const previousCode = this._meshIDColorCodeMap.get(mesh.uuid);
    if (!colorMeshToDelete || !previousCode) {
      return;
    }
    const lastMesh = this._colorCodeMeshMap.get(code);
    if (!lastMesh) {
      throw new Error("Last mesh not found!");
    }
    const lastColorMesh = this.colorMeshes.get(lastMesh.uuid);
    if (!lastColorMesh) {
      throw new Error("Last color mesh not found!");
    }

    if (mesh !== lastMesh) {
      // Get the color of the mesh to delete and give it to the
      // last mesh

      const colorOfMeshToDelete = new THREE.Color();
      let colorFound = false;
      if (Array.isArray(colorMeshToDelete.material)) {
        for (const mat of colorMeshToDelete.material as THREE.MeshBasicMaterial[]) {
          if (mat !== this._transparentMat) {
            colorOfMeshToDelete.copy(mat.color);
            colorFound = true;
            mat.dispose();
            break;
          }
        }
      } else if (colorMeshToDelete.material !== this._transparentMat) {
        const mat = colorMeshToDelete.material as THREE.MeshBasicMaterial;
        colorOfMeshToDelete.copy(mat.color);
        colorFound = true;
        mat.dispose();
      }

      if (!colorFound) {
        throw new Error("Color of mesh to delete not found!");
      }

      if (Array.isArray(lastColorMesh.material)) {
        for (const mat of lastColorMesh.material as THREE.MeshBasicMaterial[]) {
          if (mat !== this._transparentMat) {
            mat.color.copy(colorOfMeshToDelete);
          }
        }
      } else if (lastColorMesh.material !== this._transparentMat) {
        const mat = lastColorMesh.material as THREE.MeshBasicMaterial;
        mat.color.copy(colorOfMeshToDelete);
      }
    }

    // Make the last color available again
    this.decreaseNextColor();

    // Change the deleted mesh by the last mesh

    this._colorCodeMeshMap.delete(code);
    this._colorCodeMeshMap.set(previousCode, lastMesh);
    this._meshIDColorCodeMap.delete(lastMesh.uuid);
    this._meshIDColorCodeMap.set(lastMesh.uuid, previousCode);

    // dispose the colorMesh of the deleted geometry

    this.colorMeshes.delete(mesh.uuid);
    colorMeshToDelete.geometry = new THREE.BufferGeometry();
    disposer.destroy(colorMeshToDelete, false);
  }

  private handleWorkerMessage = async (event: MessageEvent) => {
    const colors = event.data.colors as Map<string, number>;

    this._recentlyHiddenMeshes = new Set(this._currentVisibleMeshes);
    this._currentVisibleMeshes.clear();

    for (const [code] of colors) {
      const mesh = this._colorCodeMeshMap.get(code);
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
    const clippingPlanes = this.components.renderer.clippingPlanes;
    const colorMaterial = new THREE.MeshBasicMaterial({
      color,
      clippingPlanes,
      side: THREE.DoubleSide,
    });
    THREE.ColorManagement.enabled = colorEnabled;
    return { colorMaterial, code };
  }
}
