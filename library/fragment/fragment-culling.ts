import {Fragments} from "./fragments";
import {Components} from "../components";
import * as THREE from 'three';
import {Fragment} from "bim-fragment";

export default class FragmentCulling {

  readonly renderTarget: THREE.WebGLRenderTarget;
  readonly bufferSize: number;
  readonly buffer: Uint8Array
  readonly materialCache: Map<string, THREE.MeshBasicMaterial>;

  constructor(
    private components: Components,
    private fragment: Fragments,
    readonly updateInterval = 1000,
    readonly rtWidth = 512,
    readonly rtHeight = 512)

  {
    this.renderTarget = new THREE.WebGLRenderTarget(this.rtWidth, this.rtHeight);
    this.bufferSize = this.rtWidth * this.rtHeight * 4;
    this.buffer = new Uint8Array(this.bufferSize);
    this.materialCache = new Map<string, THREE.MeshBasicMaterial>();
    window.setInterval(this.updateVisibility, updateInterval)
  }

  private getMaterial(r: number, g: number, b: number) {
    const code = `rgb(${r}, ${g}, ${b})`
    let material = this.materialCache.get(code);
    if(!material){
      material = new THREE.MeshBasicMaterial({ color: new THREE.Color(code) })
      this.materialCache.set(code, material)
    }
    return material;
  }


  private updateVisibility = () => {

    this.components.renderer.renderer.setRenderTarget(this.renderTarget)

    let r = 0;
    let g = 0;
    let b = 0;
    let i = 0;

    const getNextColor = () => {
      if(i === 0) {
        b++;
        if(b === 256) {
          b = 0;
          i = 1
        }
      }
      if(i === 1) {
        g++;
        i = 0;
        if(g === 256){
          g = 0;
          i = 2
        }
      }
      if(i === 2) {
        r++;
        i = 1;
        if(r === 256){
          r = 0;
          i = 0
        }
      }
      return {
        r,
        g,
        b,
        code: `${r}${g}${b}`
      }
    }


    const fragmentColorMap = new Map<string, Fragment>();

    for (const fragment of this.fragment.fragments) {
      // Store original materials
      if (!fragment.mesh.userData.prevMat) {
        fragment.mesh.userData.prevMat = fragment.mesh.material;
      }

      const { r, g, b, code} = getNextColor();
      const mat = this.getMaterial(r, g, b);
      fragmentColorMap.set(code, fragment);

      if (Array.isArray(fragment.mesh.material)) {
        const matArray: any[] = [];
        for (const material of fragment.mesh.material) {
          if(material.opacity !== 1) {
          }
          matArray.push(mat)
        }
        fragment.mesh.material = matArray;
      } else {
        // @ts-ignore
        fragment.mesh.material = mat;

        // @ts-ignore
        if(fragment.mesh.material.opacity !== 1) {
        }
      }

      // Set to visible
      fragment.mesh.visible = true;
    }

    this.components.renderer.renderer.render(this.components.scene.getScene(), this.components.camera.getCamera())
    this.components.renderer.renderer.readRenderTargetPixels(this.renderTarget, 0, 0, this.rtWidth, this.rtHeight, this.buffer);

    for (let i = 0; i < this.bufferSize; i += 4) {
      const r = this.buffer[i];
      const g = this.buffer[i + 1]
      const b = this.buffer[i + 2]
      //const a = this.buffer[i + 3]
      const code = `${r}${g}${b}`
      fragmentColorMap.delete(code)
    }

    this.components.renderer.renderer.setRenderTarget(null)

    for(const [_code, fragment] of fragmentColorMap.entries()){
      fragment.mesh.visible = false;
    }

    // for(const fragment of this.fragment.fragments){
    //   // Restore material
    //   fragment.mesh.material = fragment.mesh.userData.prevMat;
    // }
  }
}