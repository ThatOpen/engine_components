import * as THREE from "three";
import * as OBC from "@thatopen/components";
import { GTAOPass } from "three/examples/jsm/postprocessing/GTAOPass.js";

export class AOPass extends GTAOPass {
  private _fragments: OBC.FragmentsManager;
  private _hiddenMaterials: Map<THREE.Material, boolean> = new Map();

  constructor(
    fragments: OBC.FragmentsManager,
    scene: THREE.Scene,
    camera: THREE.Camera,
    width: number,
    height: number,
  ) {
    super(scene, camera, width, height);
    this._fragments = fragments;
  }

  render(
    renderer: THREE.WebGLRenderer,
    writeBuffer: THREE.WebGLRenderTarget,
    readBuffer: THREE.WebGLRenderTarget,
    deltaTime: number,
    maskActive: boolean,
  ) {
    this._hideLodMaterials();
    super.render(renderer, writeBuffer, readBuffer, deltaTime, maskActive);
    this._restoreLodMaterials();
  }

  private _hideLodMaterials() {
    this._hiddenMaterials.clear();
    if (!this._fragments.initialized) return;
    for (const [, material] of this._fragments.core.models.materials.list) {
      if ("isLodMaterial" in material) {
        this._hiddenMaterials.set(material, material.visible);
        material.visible = false;
      }
    }
  }

  private _restoreLodMaterials() {
    for (const [material, wasVisible] of this._hiddenMaterials) {
      material.visible = wasVisible;
    }
    this._hiddenMaterials.clear();
  }
}
