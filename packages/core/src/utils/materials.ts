import * as THREE from "three";

export class MaterialsUtils {
  static isTransparent(material: THREE.Material) {
    return material.transparent && material.opacity < 1;
  }
}
