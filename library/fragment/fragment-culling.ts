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

  fragmentColorMap = new Map<string, Fragment>();

  constructor(
    private components: Components,
    private fragment: Fragments,
    readonly updateInterval = 1000,
    readonly rtWidth = 512,
    readonly rtHeight = 512,
    readonly autoUpdate = true
  ) {
    this.renderTarget = new THREE.WebGLRenderTarget(
      this.rtWidth,
      this.rtHeight
    );
    this.bufferSize = this.rtWidth * this.rtHeight * 4;
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
    `
    const blob = new Blob([code], {type: 'application/javascript'})
    this.worker = new Worker(URL.createObjectURL(blob));
    this.worker.addEventListener("message", this.handleWorkerMessage)

    if(autoUpdate)
      window.setInterval(this.updateVisibility, updateInterval);
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

  public updateVisibility = async () => {
    const frags = Object.values(this.fragment.fragments);

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

    for (const fragment of frags) {
      // Store original materials
      if (!fragment.mesh.userData.prevMat) {
        fragment.mesh.userData.prevMat = fragment.mesh.material;
      }

      const { r, g, b, code } = getNextColor();
      const mat = this.getMaterial(r, g, b);
      this.fragmentColorMap.set(code, fragment);

      if (Array.isArray(fragment.mesh.userData.prevMat)) {
        const matArray: any[] = [];

        for (const _material of fragment.mesh.userData.prevMat) {
          /*if(material.transparent && material.opacity < 0.9) {
            mat.opacity = 0;
            mat.transparent = true;
          }*/
          matArray.push(mat)
        }
        fragment.mesh.material = matArray;
      } else {
        // @ts-ignore
        /*if(fragment.mesh.userData.prevMat.transparent && fragment.mesh.userData.prevMat.opacity < 0.9) {
          mat.opacity = 0;
          mat.transparent = true;
        }*/
        // @ts-ignore
        fragment.mesh.material = mat;
      }

      fragment.mesh.userData.prevVisible = fragment.mesh.visible;

      // Set to visible
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
      fragment.mesh.visible = fragment.mesh.userData.prevVisible;
    }

    this.components.renderer.renderer.setRenderTarget(null);

    this.worker.postMessage({
      buffer: this.buffer
    })
  };

  private handleWorkerMessage = (event: MessageEvent) => {
    const colors = event.data.colors as Set<string>;

    const visibleFragments: Fragment[] = [];
    for (const code of colors.values()) {
      const fragment = this.fragmentColorMap.get(code);
      if (fragment) {
        fragment.mesh.visible = true;
        visibleFragments.push(fragment);
        this.fragmentColorMap.delete(code);
      }
    }

    this.fragment.highlighter.fragments = visibleFragments;

    for (const [_code, fragment] of this.fragmentColorMap.entries()) {
      fragment.mesh.visible = false;
    }

    // Clear the color map for the next iteration
    this.fragmentColorMap.clear();
  }
}
