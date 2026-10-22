import * as THREE from "three";

/**
 * Minimal fullscreen-triangle driver shared by the screen-space effect passes
 * (Hi-Z build, AO, denoise, composite, FXAA). A single oversized triangle covers
 * the viewport with no diagonal seam and one fewer vertex than a quad.
 */
export class FullscreenQuad {
  private static _geometry: THREE.BufferGeometry | null = null;
  private readonly _mesh: THREE.Mesh;
  private readonly _camera: THREE.OrthographicCamera;
  private readonly _scene: THREE.Scene;

  constructor(material: THREE.Material) {
    if (!FullscreenQuad._geometry) {
      const geometry = new THREE.BufferGeometry();
      // Clip-space triangle covering [-1,1]^2; UVs in [0,2] so the visible
      // [0,1] region maps 1:1 to the screen.
      geometry.setAttribute(
        "position",
        new THREE.BufferAttribute(
          new Float32Array([-1, -1, 0, 3, -1, 0, -1, 3, 0]),
          3,
        ),
      );
      geometry.setAttribute(
        "uv",
        new THREE.BufferAttribute(new Float32Array([0, 0, 2, 0, 0, 2]), 2),
      );
      FullscreenQuad._geometry = geometry;
    }

    this._camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    this._mesh = new THREE.Mesh(FullscreenQuad._geometry, material);
    this._mesh.frustumCulled = false;
    this._scene = new THREE.Scene();
    this._scene.add(this._mesh);
  }

  get material(): THREE.Material {
    return this._mesh.material as THREE.Material;
  }

  set material(material: THREE.Material) {
    this._mesh.material = material;
  }

  render(
    renderer: THREE.WebGLRenderer,
    target: THREE.WebGLRenderTarget | null,
    mipLevel = 0,
  ) {
    const oldTarget = renderer.getRenderTarget();
    const oldAutoClear = renderer.autoClear;
    renderer.autoClear = false;
    renderer.setRenderTarget(target, 0, mipLevel);
    renderer.render(this._scene, this._camera);
    renderer.setRenderTarget(oldTarget);
    renderer.autoClear = oldAutoClear;
  }

  dispose() {
    this.material.dispose();
  }
}
