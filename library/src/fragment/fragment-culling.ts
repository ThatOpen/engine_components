import * as THREE from "three";
import { Fragment } from "bim-fragment";
import { Material } from "three";
import { Fragments } from ".";
import { Components } from "../components";
import { Event } from "../core";

export class FragmentCulling {
  readonly renderer: THREE.WebGLRenderer;
  readonly renderTarget: THREE.WebGLRenderTarget;
  readonly bufferSize: number;
  readonly buffer: Uint8Array;
  readonly materialCache: Map<string, THREE.MeshBasicMaterial>;
  readonly worker: Worker;

  enabled = true;
  viewUpdated = new Event();
  needsUpdate = false;
  exclusions = new Map<string, Fragment>();
  fragmentColorMap = new Map<string, Fragment>();
  renderDebugFrame = false;

  readonly meshes = new Map<string, THREE.InstancedMesh>();

  public visibleFragments: Fragment[] = [];
  private readonly previouslyVisibleMeshes = new Set<string>();

  private readonly transparentMat = new THREE.MeshBasicMaterial({
    transparent: true,
    opacity: 0,
  });

  private colors = { r: 0, g: 0, b: 0, i: 0 };

  // Alternative scene and meshes to make the visibility check
  private readonly scene = new THREE.Scene();

  constructor(
    private components: Components,
    private fragment: Fragments,
    readonly updateInterval = 1000,
    readonly rtWidth = 512,
    readonly rtHeight = 512,
    readonly autoUpdate = true
  ) {
    this.renderer = new THREE.WebGLRenderer();
    const planes = this.components.renderer.get().clippingPlanes;
    this.renderer.clippingPlanes = planes;
    this.renderTarget = new THREE.WebGLRenderTarget(rtWidth, rtHeight);
    this.bufferSize = rtWidth * rtHeight * 4;
    this.buffer = new Uint8Array(this.bufferSize);
    this.materialCache = new Map<string, THREE.MeshBasicMaterial>();

    const code = `
      addEventListener("message", (event) => {
        const { buffer } = event.data;
        const colors = new Set();
        for (let i = 0; i < buffer.length; i += 4) {
            const r = buffer[i];
            const g = buffer[i + 1];
            const b = buffer[i + 2];
            const code = "" + r + g + b;
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

  add(fragment: Fragment) {
    const { geometry, material } = fragment.mesh;

    const { r, g, b, code } = this.getNextColor();
    const colorMaterial = this.getMaterial(r, g, b);

    let newMaterial: Material[] | Material;

    if (Array.isArray(material)) {
      let transparentOnly = true;
      const matArray: any[] = [];

      for (const mat of material) {
        if (this.isTransparent(mat)) {
          matArray.push(this.transparentMat);
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

    this.fragmentColorMap.set(code, fragment);

    const mesh = new THREE.InstancedMesh(
      geometry,
      newMaterial,
      fragment.capacity
    );

    fragment.mesh.visible = false;

    mesh.instanceMatrix = fragment.mesh.instanceMatrix;
    mesh.applyMatrix4(fragment.mesh.matrix);
    mesh.updateMatrix();

    this.scene.add(mesh);
    this.meshes.set(fragment.id, mesh);
  }

  updateVisibility = (force?: boolean) => {
    if (!this.enabled) return;
    if (!this.needsUpdate && !force) return;

    const camera = this.components.camera.get();
    camera.updateMatrix();

    this.renderer.setSize(this.rtWidth, this.rtHeight);
    this.renderer.setRenderTarget(this.renderTarget);
    this.renderer.render(this.scene, camera);
    this.renderer.readRenderTargetPixels(
      this.renderTarget,
      0,
      0,
      this.rtWidth,
      this.rtHeight,
      this.buffer
    );

    this.renderer.setRenderTarget(null);

    if (this.renderDebugFrame) {
      this.renderer.render(this.scene, camera);
    }

    this.worker.postMessage({
      buffer: this.buffer,
    });

    this.needsUpdate = false;
    this.viewUpdated.trigger();
  };

  private handleWorkerMessage = (event: MessageEvent) => {
    const colors = event.data.colors as Set<string>;

    const meshesThatJustDisappeared = new Set(this.previouslyVisibleMeshes);
    this.previouslyVisibleMeshes.clear();

    this.visibleFragments = [];

    // Make found meshes visible
    for (const code of colors.values()) {
      const fragment = this.fragmentColorMap.get(code);
      if (fragment) {
        this.visibleFragments.push(fragment);
        fragment.mesh.visible = true;
        this.previouslyVisibleMeshes.add(fragment.id);
        meshesThatJustDisappeared.delete(fragment.id);
        this.cullEdges(fragment, true);
      }
    }

    // Hide meshes that were visible before but not anymore
    for (const id of meshesThatJustDisappeared) {
      const fragment = this.fragment.fragments[id];
      fragment.mesh.visible = false;
      this.cullEdges(fragment, false);
    }
  };

  private getMaterial(r: number, g: number, b: number) {
    const code = `rgb(${r}, ${g}, ${b})`;
    let material = this.materialCache.get(code);
    const clippingPlanes = this.components.renderer.get().clippingPlanes;
    if (!material) {
      material = new THREE.MeshBasicMaterial({
        color: new THREE.Color(code),
        clippingPlanes,
      });
      this.materialCache.set(code, material);
    }
    return material;
  }

  private isTransparent(material: THREE.Material) {
    return material.transparent && material.opacity < 1;
  }

  private getNextColor() {
    if (this.colors.i === 0) {
      this.colors.b++;
      if (this.colors.b === 256) {
        this.colors.b = 0;
        this.colors.i = 1;
      }
    }

    if (this.colors.i === 1) {
      this.colors.g++;
      this.colors.i = 0;
      if (this.colors.g === 256) {
        this.colors.g = 0;
        this.colors.i = 2;
      }
    }

    if (this.colors.i === 2) {
      this.colors.r++;
      this.colors.i = 1;
      if (this.colors.r === 256) {
        this.colors.r = 0;
        this.colors.i = 0;
      }
    }

    return {
      r: this.colors.r,
      g: this.colors.g,
      b: this.colors.b,
      code: `${this.colors.r}${this.colors.g}${this.colors.b}`,
    };
  }

  // If the edges need to be updated (e.g. some walls have been hidden)
  // this allows to compute them only when they are visibile
  private cullEdges(fragment: Fragment, visible: boolean) {
    if (visible) {
      this.updateEdges(fragment);
    }
    if (this.fragment.edges.edgesList[fragment.id]) {
      this.fragment.edges.edgesList[fragment.id].visible = visible;
    }
  }

  private updateEdges(fragment: Fragment) {
    if (this.fragment.edges.edgesToUpdate.has(fragment.id)) {
      this.fragment.edges.generate(fragment);
      this.fragment.edges.edgesToUpdate.delete(fragment.id);
    }
  }
}
