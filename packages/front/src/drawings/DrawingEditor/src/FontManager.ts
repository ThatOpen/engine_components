// @ts-ignore
import { TTFLoader } from "three/examples/jsm/loaders/TTFLoader.js";
import { Font } from "three/examples/jsm/loaders/FontLoader.js";
import * as THREE from "three";

/** Manages font loading and creates Three.js text meshes for annotation labels. */
export class FontManager {
  font: Font | null = null;

  /**
   * Owned by {@link DrawingEditor} and shared across all built-in tools.
   */
  constructor() {}

  load(url: string): Promise<void> {
    return new Promise((resolve) => {
      const loader = new TTFLoader();
      loader.load(url, (ttf: unknown) => {
        this.font = new Font(ttf as any);
        resolve();
      });
    });
  }

  /**
   * Creates a text mesh in the XZ plane (rotation.x = -π/2).
   * Returns null if the font is not yet loaded.
   */
  createTextMesh(text: string, fontSize: number, color: number, opacity = 1): THREE.Mesh | null {
    if (!this.font) return null;
    const shapes = this.font.generateShapes(text, fontSize);
    const geo = new THREE.ShapeGeometry(shapes);
    const mat = new THREE.MeshBasicMaterial({
      color,
      side: THREE.DoubleSide,
      transparent: opacity < 1,
      opacity,
    });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.layers.set(1);
    mesh.rotation.x = -Math.PI / 2;
    return mesh;
  }

  getBBox(mesh: THREE.Mesh): THREE.Box3 {
    return new THREE.Box3().setFromObject(mesh);
  }
}
