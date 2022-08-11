import * as THREE from "three";
import { Fragment } from "bim-fragment";
import { Fragments } from "./fragments";
import { Components } from "../components";

export default class FragmentCulling {
  readonly renderTarget: THREE.WebGLRenderTarget;
  readonly bufferSize: number;
  readonly buffer: Uint8Array;
  readonly materialCache: Map<string, THREE.MeshBasicMaterial>;
  readonly worker: Worker;

  exclusions = new Map<string, Fragment>();
  fragmentColorMap = new Map<string, Fragment>();
  cameraMoved = false;

  constructor(
    private components: Components,
    private fragment: Fragments,
    readonly updateInterval = 1000,
    readonly rtWidth = 512,
    readonly rtHeight = 512,
    readonly autoUpdate = true
  ) {
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

    const controls = this.components.camera.controls;
    controls.addEventListener("control", () => (this.cameraMoved = true));
    controls.addEventListener("controlstart", () => (this.cameraMoved = true));
    controls.addEventListener("wake", () => (this.cameraMoved = true));
    controls.addEventListener("controlend", () => (this.cameraMoved = true));
    controls.addEventListener("sleep", () => (this.cameraMoved = true));

    const dom = this.components.renderer.renderer.domElement;
    dom.addEventListener("wheel", () => (this.cameraMoved = true));

    if (autoUpdate) window.setInterval(this.updateVisibility, updateInterval);
  }

  private getMaterial(r: number, g: number, b: number) {
    const code = `rgb(${r}, ${g}, ${b})`;
    let material = this.materialCache.get(code);
    if (!material) {
      material = new THREE.MeshBasicMaterial({ color: new THREE.Color(code) });
      this.materialCache.set(code, material);
    }
    return material;
  }

  public updateVisibility = () => {
    if (!this.cameraMoved) return;

    const frags = Object.values(this.fragment.fragments);
    const transparentMat = new THREE.MeshBasicMaterial({
      transparent: true,
      opacity: 0,
    });

    let r = 0;
    let g = 0;
    let b = 0;
    let i = 0;

    const getNextColor = () => {
      if (i === 0) {
        b++;
        if (b === 256) {
          b = 0;
          i = 1;
        }
      }
      if (i === 1) {
        g++;
        i = 0;
        if (g === 256) {
          g = 0;
          i = 2;
        }
      }
      if (i === 2) {
        r++;
        i = 1;
        if (r === 256) {
          r = 0;
          i = 0;
        }
      }
      return {
        r,
        g,
        b,
        code: `${r}${g}${b}`,
      };
    };
    const isTransparent = (material: THREE.Material) =>
      material.transparent && material.opacity < 1;

    for (const fragment of frags) {
      // Store original materials
      if (!fragment.mesh.userData.prevMat) {
        fragment.mesh.userData.prevMat = fragment.mesh.material;
      }

      // Generate a color for this fragment and get the material
      const { r, g, b, code } = getNextColor();
      const colorMaterial = this.getMaterial(r, g, b);

      // Index this fragment to the color map,
      this.fragmentColorMap.set(code, fragment);

      // Check the materials for transparency and update them accordingly
      if (Array.isArray(fragment.mesh.userData.prevMat)) {
        let transparentOnly = true;
        const matArray: any[] = [];

        for (const prevMat of fragment.mesh.userData.prevMat) {
          if (isTransparent(prevMat)) {
            matArray.push(transparentMat);
          } else {
            transparentOnly = false;
            matArray.push(colorMaterial);
          }
        }

        // If we find that all the materials are transparent then we must remove this from analysis
        if (transparentOnly) {
          this.fragmentColorMap.delete(code);
          this.updateEdges(fragment);
        }

        fragment.mesh.material = matArray;
      } else if (isTransparent(fragment.mesh.userData.prevMat)) {
        // This material is transparent, so we must remove it from analysis
        this.fragmentColorMap.delete(code);
        // @ts-ignore
        fragment.mesh.material = transparentMat;
      } else {
        // @ts-ignore
        fragment.mesh.material = colorMaterial;
      }

      // Set to visible
      // fragment.mesh.userData.prevVisible = fragment.mesh.visible;
      fragment.mesh.visible = true;
    }

    this.components.renderer.renderer.setRenderTarget(this.renderTarget);

    this.components.renderer.renderer.render(
      this.components.scene.getScene(),
      this.components.camera.getCamera()
    );
    this.components.renderer.renderer.readRenderTargetPixels(
      this.renderTarget,
      0,
      0,
      this.rtWidth,
      this.rtHeight,
      this.buffer
    );

    for (const fragment of frags) {
      // Restore material
      fragment.mesh.material = fragment.mesh.userData.prevMat;
      // fragment.mesh.visible = fragment.mesh.userData.prevVisible;
    }

    this.components.renderer.renderer.setRenderTarget(null);

    this.worker.postMessage({
      buffer: this.buffer,
    });

    this.cameraMoved = false;
  };

  private handleWorkerMessage = (event: MessageEvent) => {
    const colors = event.data.colors as Set<string>;

    const visibleFragments: Fragment[] = [];
    for (const code of colors.values()) {
      const fragment = this.fragmentColorMap.get(code);
      if (fragment) {
        fragment.mesh.visible = true;
        this.cullEdges(fragment, true);
        visibleFragments.push(fragment);
        this.fragmentColorMap.delete(code);
      }
    }

    for (const [_code, fragment] of this.fragmentColorMap.entries()) {
      fragment.mesh.visible = false;
      this.cullEdges(fragment, false);
    }

    // Clear the color map for the next iteration
    this.fragmentColorMap.clear();
  };

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
