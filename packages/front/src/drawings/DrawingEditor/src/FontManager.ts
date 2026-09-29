import { Font } from "three/examples/jsm/loaders/FontLoader.js";
import * as THREE from "three";

/** Manages font loading and creates Three.js text meshes for annotation labels. */
export class FontManager {
  font: Font | null = null;

  /**
   * Owned by {@link DrawingEditor} and shared across all built-in tools.
   */
  constructor() {}

  /**
   * Loads a TTF font from `url`.
   *
   * `TTFLoader` is imported here, at the point of use, and not at the top of
   * the module: since three r185 it imports opentype.js from a CDN
   * (`https://cdn.jsdelivr.net/...`), so a static import made every consumer
   * of this package fetch that URL on load (and fail to link in Node), even
   * apps that never load a font. Rejects if the loader, opentype.js or the
   * font cannot be fetched.
   *
   * Apps that must not reach a CDN can alias that URL to a local copy of
   * opentype.js in their bundler, or assign an already parsed font to
   * {@link FontManager.font} directly.
   */
  async load(url: string): Promise<void> {
    // @ts-ignore
    const { TTFLoader } = await import("three/examples/jsm/loaders/TTFLoader.js");
    const loader = new TTFLoader();
    const ttf = await new Promise<unknown>((resolve, reject) => {
      loader.load(url, resolve, undefined, reject);
    });
    this.font = new Font(ttf as any);
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
