import * as THREE from "three";
import { Pass } from "three/examples/jsm/postprocessing/Pass.js";

// Copied from three.js RenderPass.js, extended to allow for material override
// useful to exclude lod materials
export class BasePass extends Pass {
  scene: THREE.Scene;
  camera: THREE.Camera;
  overrideMaterial: THREE.Material | null;
  clearColor: THREE.Color | null;
  clearAlpha: number | null;
  clearDepth: boolean;
  needsSwap: boolean;

  isolatedMaterials: THREE.Material[] = [];

  private _oldClearColor: THREE.Color;

  constructor(
    scene: THREE.Scene,
    camera: THREE.Camera,
    overrideMaterial = null,
    clearColor = null,
    clearAlpha = null,
  ) {
    super();

    this.scene = scene;

    this.camera = camera;

    this.overrideMaterial = overrideMaterial;

    this.clearColor = clearColor;

    this.clearAlpha = clearAlpha;

    this.clear = true;

    this.clearDepth = false;

    this.needsSwap = false;
    this._oldClearColor = new THREE.Color();
  }

  render(
    renderer: THREE.WebGLRenderer,
    // @ts-ignore
    writeBuffer: THREE.WebGLRenderTarget,
    readBuffer: THREE.WebGLRenderTarget,
    /* , deltaTime, maskActive */
  ) {
    for (const material of this.isolatedMaterials) {
      if (material.userData.wasVisibleBasePass !== undefined) {
        material.visible = material.userData.wasVisibleBasePass;
      }
    }

    const oldAutoClear = renderer.autoClear;
    renderer.autoClear = false;

    let oldClearAlpha;
    let oldOverrideMaterial;

    if (this.overrideMaterial !== null) {
      oldOverrideMaterial = this.scene.overrideMaterial;

      this.scene.overrideMaterial = this.overrideMaterial;
    }

    if (this.clearColor !== null) {
      renderer.getClearColor(this._oldClearColor);
      renderer.setClearColor(this.clearColor, renderer.getClearAlpha());
    }

    if (this.clearAlpha !== null) {
      oldClearAlpha = renderer.getClearAlpha();
      renderer.setClearAlpha(this.clearAlpha);
    }

    if (this.clearDepth === true) {
      renderer.clearDepth();
    }

    renderer.setRenderTarget(this.renderToScreen ? null : readBuffer);

    if (this.clear === true) {
      // TODO: Avoid using autoClear properties, see https://github.com/mrdoob/three.js/pull/15571#issuecomment-465669600
      renderer.clear(
        renderer.autoClearColor,
        renderer.autoClearDepth,
        renderer.autoClearStencil,
      );
    }

    renderer.render(this.scene, this.camera);

    // restore

    if (this.clearColor !== null) {
      renderer.setClearColor(this._oldClearColor);
    }

    if (this.clearAlpha !== null) {
      // @ts-ignore
      renderer.setClearAlpha(oldClearAlpha);
    }

    if (this.overrideMaterial !== null) {
      // @ts-ignore
      this.scene.overrideMaterial = oldOverrideMaterial;
    }

    renderer.autoClear = oldAutoClear;

    for (const material of this.isolatedMaterials) {
      material.userData.wasVisibleBasePass = material.visible;
      material.visible = false;
    }
  }
}
