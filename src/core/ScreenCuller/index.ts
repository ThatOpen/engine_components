import * as THREE from "three";
import { Material } from "three";
import { Component, Disposable, Event } from "../../base-types";
import { Components } from "../Components";
import { Disposer } from "../Disposer";

// TODO: Clean up and document
// TODO: Work at the instance level instead of the mesh level

export class ScreenCuller extends Component<null> implements Disposable {
  readonly renderer: THREE.WebGLRenderer;
  readonly renderTarget: THREE.WebGLRenderTarget;
  readonly bufferSize: number;
  readonly materialCache: Map<string, THREE.MeshBasicMaterial>;
  readonly worker: Worker;

  name: string = "ScreenCuller";
  enabled = true;
  viewUpdated = new Event();
  needsUpdate = false;
  meshColorMap = new Map<string, THREE.Mesh>();
  renderDebugFrame = false;
  visibleMeshes: THREE.Mesh[] = [];
  colorMeshes = new Map<string, THREE.InstancedMesh>();
  meshes = new Map<string, THREE.Mesh>();

  private readonly _previouslyVisibleMeshes = new Set<string>();
  private readonly _transparentMat = new THREE.MeshBasicMaterial({
    transparent: true,
    opacity: 0,
  });

  private _disposer = new Disposer();
  private _colors = { r: 0, g: 0, b: 0, i: 0 };

  // Alternative scene and meshes to make the visibility check
  private readonly _scene = new THREE.Scene();
  private readonly _buffer: Uint8Array;

  constructor(
    private components: Components,
    readonly updateInterval = 1000,
    readonly rtWidth = 512,
    readonly rtHeight = 512,
    readonly autoUpdate = true
  ) {
    super();
    this.renderer = new THREE.WebGLRenderer();
    const planes = this.components.renderer.clippingPlanes;
    this.renderer.clippingPlanes = planes;
    this.renderTarget = new THREE.WebGLRenderTarget(rtWidth, rtHeight);
    this.bufferSize = rtWidth * rtHeight * 4;
    this._buffer = new Uint8Array(this.bufferSize);
    this.materialCache = new Map<string, THREE.MeshBasicMaterial>();

    const code = `
      addEventListener("message", (event) => {
        const { buffer } = event.data;
        const colors = new Set();
        for (let i = 0; i < buffer.length; i += 4) {
            const r = buffer[i];
            const g = buffer[i + 1];
            const b = buffer[i + 2];
            const code = "" + r + "-" + g + "-" + b;
            colors.add(code);
        }
        postMessage({ colors });
      });
    `;

    const blob = new Blob([code], { type: "application/javascript" });
    this.worker = new Worker(URL.createObjectURL(blob));
    this.worker.addEventListener("message", this.handleWorkerMessage);
    if (autoUpdate) window.setInterval(this.updateVisibility, updateInterval);
  }

  get(): null {
    return null;
  }

  dispose() {
    this.enabled = false;
    this._scene.children.length = 0;
    this.viewUpdated.reset();
    this.worker.terminate();
    this.renderer.dispose();
    this.renderTarget.dispose();
    (this._buffer as any) = null;
    this._transparentMat.dispose();
    this.viewUpdated.reset();
    this.meshColorMap.clear();
    this.visibleMeshes = [];
    for (const id in this.materialCache) {
      const material = this.materialCache.get(id);
      if (material) {
        material.dispose();
      }
    }
    for (const id in this.colorMeshes) {
      const mesh = this.colorMeshes.get(id);
      if (mesh) {
        this._disposer.dispose(mesh);
      }
    }
    this.colorMeshes.clear();
    this.meshes.clear();
  }

  add(mesh: THREE.Mesh | THREE.InstancedMesh) {
    if (!this.enabled) return;

    const isInstanced = mesh instanceof THREE.InstancedMesh;

    const { geometry, material } = mesh;

    const { r, g, b, code } = this.getNextColor();
    const colorMaterial = this.getMaterial(r, g, b);

    let newMaterial: Material[] | Material;

    if (Array.isArray(material)) {
      let transparentOnly = true;
      const matArray: any[] = [];

      for (const mat of material) {
        if (this.isTransparent(mat)) {
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
    } else if (this.isTransparent(material)) {
      // This material is transparent, so we must remove it from analysis
      colorMaterial.dispose();
      return;
    } else {
      newMaterial = colorMaterial;
    }

    this.meshColorMap.set(code, mesh);

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

    this._scene.add(colorMesh);
    this.colorMeshes.set(mesh.uuid, colorMesh);
    this.meshes.set(mesh.uuid, mesh);
  }

  updateVisibility = (force?: boolean) => {
    if (!this.enabled) return;
    if (!this.needsUpdate && !force) return;

    const camera = this.components.camera.get();
    camera.updateMatrix();

    this.renderer.setSize(this.rtWidth, this.rtHeight);
    this.renderer.setRenderTarget(this.renderTarget);
    this.renderer.render(this._scene, camera);
    this.renderer.readRenderTargetPixels(
      this.renderTarget,
      0,
      0,
      this.rtWidth,
      this.rtHeight,
      this._buffer
    );

    this.renderer.setRenderTarget(null);

    if (this.renderDebugFrame) {
      this.renderer.render(this._scene, camera);
    }

    this.worker.postMessage({
      buffer: this._buffer,
    });

    this.needsUpdate = false;
    this.viewUpdated.trigger();
  };

  private handleWorkerMessage = (event: MessageEvent) => {
    const colors = event.data.colors as Set<string>;

    const meshesThatJustDisappeared = new Set(this._previouslyVisibleMeshes);
    this._previouslyVisibleMeshes.clear();

    this.visibleMeshes = [];

    // Make found meshes visible
    for (const code of colors.values()) {
      const mesh = this.meshColorMap.get(code);
      if (mesh) {
        this.visibleMeshes.push(mesh);
        mesh.visible = true;
        this._previouslyVisibleMeshes.add(mesh.uuid);
        meshesThatJustDisappeared.delete(mesh.uuid);
        // this.cullEdges(mesh, true);
      }
    }

    // Hide meshes that were visible before but not anymore
    for (const uuid of meshesThatJustDisappeared) {
      const mesh = this.meshes.get(uuid);
      if (mesh === undefined) continue;
      mesh.visible = false;
      // this.cullEdges(mesh, false);
    }
  };

  private getMaterial(r: number, g: number, b: number) {
    THREE.ColorManagement.enabled = false;
    const code = `rgb(${r}, ${g}, ${b})`;
    const color = new THREE.Color(code);
    let material = this.materialCache.get(code);
    const clippingPlanes = this.components.renderer.clippingPlanes;
    if (!material) {
      material = new THREE.MeshBasicMaterial({
        color,
        clippingPlanes,
        side: THREE.DoubleSide,
      });
      this.materialCache.set(code, material);
    }
    THREE.ColorManagement.enabled = true;
    return material;
  }

  private isTransparent(material: THREE.Material) {
    return material.transparent && material.opacity < 1;
  }

  private getNextColor() {
    if (this._colors.i === 0) {
      this._colors.b++;
      if (this._colors.b === 256) {
        this._colors.b = 0;
        this._colors.i = 1;
      }
    }

    if (this._colors.i === 1) {
      this._colors.g++;
      this._colors.i = 0;
      if (this._colors.g === 256) {
        this._colors.g = 0;
        this._colors.i = 2;
      }
    }

    if (this._colors.i === 2) {
      this._colors.r++;
      this._colors.i = 1;
      if (this._colors.r === 256) {
        this._colors.r = 0;
        this._colors.i = 0;
      }
    }

    return {
      r: this._colors.r,
      g: this._colors.g,
      b: this._colors.b,
      code: `${this._colors.r}-${this._colors.g}-${this._colors.b}`,
    };
  }

  // TODO: Decouple culling from fragments
  // If the edges need to be updated (e.g. some walls have been hidden)
  // this allows to compute them only when they are visibile
  // private cullEdges(fragment: Fragment, visible: boolean) {
  //   if (visible) {
  //     this.updateEdges(fragment);
  //   }
  // if (this.fragment.edges.edgesList[fragment.id]) {
  //   this.fragment.edges.edgesList[fragment.id].visible = visible;
  // }
  // }

  // private updateEdges(_fragment: Fragment) {
  // if (this.fragment.edges.edgesToUpdate.has(fragment.id)) {
  //   this.fragment.edges.generate(fragment);
  //   this.fragment.edges.edgesToUpdate.delete(fragment.id);
  // }
  // }
}
