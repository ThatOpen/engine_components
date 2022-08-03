import {Fragments} from "./fragments";
import {Components} from "../components";
import * as THREE from 'three';
import {Fragment} from "bim-fragment";

export default class FragmentCulling {

  renderTarget: THREE.WebGLRenderTarget;

  constructor(private components: Components, private fragment: Fragments) {

    const rtWidth = 512;
    const rtHeight = 512;
    this.renderTarget = new THREE.WebGLRenderTarget(rtWidth, rtHeight);
    window.setInterval(this.updateVisibility, 5000)
  }

  updateVisibility = () => {

    this.components.renderer.renderer.setRenderTarget(this.renderTarget)

    let r = 0;
    let g = 0;
    let b = 0;
    let i = 1;

    const getNextColor = () => {

      if (i === 1) {
        r++
        if (r === 255) {
          i++
        }
      }
      if (i === 2) {
        g++
        if (g === 255) {
          i++
        }
      }
      if (i === 3) {
        b++;
        if (b === 255) {
          i++
        }
      }
      if (i < 3) i++;
      else i = 1;
      return {
        color: new THREE.Color(`rgb(${r}, ${g}, ${b})`),
        code: `${r}${g}${b}`
      }
    }

    const fragmentColorMap = new Map<string, Fragment>();

    for (const fragment of this.fragment.fragments) {
      // Store original materials
      if (!fragment.mesh.userData.prevMat) {
        fragment.mesh.userData.prevMat = fragment.mesh.material;
      }

      const {color, code} = getNextColor();
      const mat = new THREE.MeshBasicMaterial({color})
      fragmentColorMap.set(code, fragment);

      if (Array.isArray(fragment.mesh.material)) {
        const matArray: any[] = [];
        for (const {} of fragment.mesh.material) {
          matArray.push(mat)
        }
        fragment.mesh.material = matArray;
      } else {
        // @ts-ignore
        fragment.mesh.material = mat;
      }

      // Set to visible
      fragment.mesh.visible = true;
    }

    this.components.renderer.renderer.render(this.components.scene.getScene(), this.components.camera.getCamera())

    const size = 512 * 512 * 4;
    const buffer = new Uint8Array(size)
    this.components.renderer.renderer.readRenderTargetPixels(this.renderTarget, 0, 0, 512, 512, buffer);


    for (let i = 0; i < size; i += 4) {
      const r = buffer[i];
      const g = buffer[i + 1]
      const b = buffer[i + 2]
      //const a = buffer[i + 3]
      const code = `${r}${g}${b}`
      fragmentColorMap.delete(code)
    }

    this.components.renderer.renderer.setRenderTarget(null)

    for(const [_code, fragment] of fragmentColorMap.entries()){
      fragment.mesh.visible = false;
    }


    for(const fragment of this.fragment.fragments){
      // Restore material
      fragment.mesh.material = fragment.mesh.userData.prevMat;
    }
  }
}