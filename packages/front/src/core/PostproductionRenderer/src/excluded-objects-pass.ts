import * as THREE from "three";
import {
  Pass,
  FullScreenQuad,
} from "three/examples/jsm/postprocessing/Pass.js";
import * as OBC from "@thatopen/components";

export class ExcludedObjectsPass extends Pass {
  // All items of this color will be excluded from postproduction
  materialToExclude = new THREE.MeshBasicMaterial({ color: 0x000000 });

  private _excludedMaterials = new Set<THREE.Material>();
  private _originalMaterials = new Map<THREE.Mesh, THREE.Material>();
  // @ts-ignore
  private _renderer: OBC.BaseRenderer;
  private _world: OBC.World;
  private _fsQuad: FullScreenQuad;
  private _combineMaterial: THREE.ShaderMaterial;
  private _excludedRenderTarget: THREE.WebGLRenderTarget;

  constructor(renderer: OBC.BaseRenderer, world: OBC.World) {
    super();
    this._renderer = renderer;
    this._world = world;

    this._excludedRenderTarget = new THREE.WebGLRenderTarget(1, 1, {
      minFilter: THREE.LinearFilter,
      magFilter: THREE.LinearFilter,
      format: THREE.RGBAFormat,
    });

    this._combineMaterial = new THREE.ShaderMaterial({
      uniforms: {
        tDiffuse: { value: null }, // Input pass texture
        tExcluded: { value: null }, // Excluded objects texture
      },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform sampler2D tDiffuse;
        uniform sampler2D tExcluded;
        varying vec2 vUv;

        void main() {
          vec4 inputColor = texture2D(tDiffuse, vUv);
          vec4 excludedColor = texture2D(tExcluded, vUv);
          
          // If excluded pixel is black (or very dark), use input color
          // Otherwise, use excluded color
          float excludedLuminance = (excludedColor.r + excludedColor.g + excludedColor.b) / 3.0;
          float threshold = 0.01; // Adjust this threshold as needed
          
          if (excludedLuminance < threshold) {
            gl_FragColor = inputColor;
          } else {
            gl_FragColor = excludedColor;
          }
        }
      `,
    });

    this._fsQuad = new FullScreenQuad(this._combineMaterial);
  }

  /**
   * Add materials to be excluded from postproduction
   */
  addExcludedMaterial(material: THREE.Material) {
    this._excludedMaterials.add(material);
  }

  /**
   * Remove materials from the excluded list
   */
  removeExcludedMaterial(material: THREE.Material) {
    this._excludedMaterials.delete(material);
  }

  /**
   * Clear all excluded materials
   */
  clearExcludedMaterials() {
    this._excludedMaterials.clear();
  }

  /**
   * Get the list of excluded materials
   */
  get excludedMaterials() {
    return Array.from(this._excludedMaterials);
  }

  setSize(width: number, height: number) {
    this._excludedRenderTarget.setSize(width, height);
  }

  render(
    renderer: THREE.WebGLRenderer,
    writeBuffer: THREE.WebGLRenderTarget,
    readBuffer: THREE.WebGLRenderTarget,
  ) {
    const scene = this._world.scene.three as THREE.Scene;
    const camera = this._world.camera.three;

    // Store original clear color and set to black
    const originalClearColor = renderer.getClearColor(new THREE.Color());
    const originalClearAlpha = renderer.getClearAlpha();
    renderer.setClearColor(0x000000, 0);

    // Step 1: Traverse scene and substitute non-excluded materials with black material
    this._substituteMaterials(scene);

    // Step 2: Render the scene with substituted materials to excluded render target
    renderer.setRenderTarget(this._excludedRenderTarget);
    renderer.render(scene, camera);

    // Step 3: Restore original materials
    this._restoreMaterials();

    // Step 4: Combine the excluded render with the input pass
    this._combineMaterial.uniforms.tDiffuse.value = readBuffer.texture;
    this._combineMaterial.uniforms.tExcluded.value =
      this._excludedRenderTarget.texture;

    if (this.renderToScreen) {
      renderer.setRenderTarget(null);
    } else {
      renderer.setRenderTarget(writeBuffer);
    }

    this._fsQuad.render(renderer);

    // Restore original clear color
    renderer.setClearColor(originalClearColor, originalClearAlpha);
  }

  private _substituteMaterials(object: THREE.Object3D) {
    if (object instanceof THREE.Mesh) {
      const material = object.material;

      if (Array.isArray(material)) {
        for (const m of material) {
          if ("isLodMaterial" in m) {
            return;
          }
        }
      } else if ("isLodMaterial" in material) {
        return;
      }

      // Check if the material should be excluded
      if (!this._excludedMaterials.has(material)) {
        // Store original material and substitute with black material
        this._originalMaterials.set(object, material);
        object.material = this.materialToExclude;
      }
    }

    // Recursively process children
    for (const child of object.children) {
      this._substituteMaterials(child);
    }
  }

  private _restoreMaterials() {
    // Restore all original materials
    for (const [mesh, material] of this._originalMaterials) {
      mesh.material = material;
    }
    this._originalMaterials.clear();
  }

  dispose() {
    this.materialToExclude.dispose();
    this._combineMaterial.dispose();
    this._fsQuad.dispose();
    this._excludedRenderTarget.dispose();
    this._excludedMaterials.clear();
    this._originalMaterials.clear();
  }
}
