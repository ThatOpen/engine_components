import * as THREE from "three";
import { FullscreenQuad } from "./fullscreen-quad";

/**
 * Hi-Z depth min-mip pyramid. Each coarser level holds the MINIMUM (closest, in
 * standard-Z) linear eye depth of its 2x2 finer texels, so AO taps at large
 * screen-space distance read coarse mips and the per-pixel working set stays
 * roughly constant regardless of disk size (McGuire et al., Scalable Ambient
 * Obscurance, 2012).
 *
 * Level 0 linearizes the captured float32 NDC depth into positive view-space
 * distance; levels 1..N are min-reductions of the level below.
 *
 * Storage: each level is its OWN single-mip render target rather than a mip of
 * one texture. three.js does not allocate per-mip storage for a render-target
 * texture, so rendering into setRenderTarget(rt, 0, level>0) attaches a zero-size
 * mip (GL_INVALID_FRAMEBUFFER_OPERATION). Independent per-level targets are the
 * portable shape; the AO sampler selects a level texture instead of textureLod.
 * The depth convention here is standard-Z (min = closest); on a reverse-Z buffer
 * the reduction operator must flip to max.
 */
const linearizeFragment = /* glsl */ `
  precision highp float;
  in vec2 vUv;
  out vec4 outColor;

  uniform sampler2D uDepthSheet;   // float32 NDC depth in [0,1]
  uniform float uNear;
  uniform float uFar;
  uniform bool uReversed;     // reversed-Z buffer (ZERO_TO_ONE, near->1 far->0)
  uniform bool uOrtho;        // orthographic projection (depth is already linear)

  // NDC depth -> positive linear eye distance. Reversed-Z keeps precision
  // near-uniform with the float32 buffer (no distance z-fighting); standard-Z is
  // the GL default. The host sets uReversed from the renderer's actual depth mode.
  //
  // Orthographic projection maps eye-Z to NDC depth LINEARLY (no perspective
  // divide), so the perspective rational formula below is wrong for it: eye
  // distance is just a linear remap of the [0,1] depth across [near, far]. Without
  // this branch every ortho frame reconstructs nonsensical depths and AO breaks.
  float linearizeDepth(float d) {
    if (uOrtho) {
      // d in [0,1]; reversed-Z flips near<->far. Positive eye distance.
      float t = uReversed ? (1.0 - d) : d;
      return uNear + t * (uFar - uNear);
    }
    if (uReversed) return (uNear * uFar) / (uNear - (uNear - uFar) * d);
    float z = d * 2.0 - 1.0;                       // NDC z in [-1,1]
    return (2.0 * uNear * uFar) / (uFar + uNear - z * (uFar - uNear));
  }

  void main() {
    float d = texture(uDepthSheet, vUv).r;
    // Cleared/far texels: depth 0 under reversed-Z, 1 under standard-Z. Mapped to
    // uFar; downstream treats >= uFar as "no geometry".
    bool isFar = uReversed ? (d <= 0.0) : (d >= 1.0);
    outColor = vec4(isFar ? uFar : linearizeDepth(d), 0.0, 0.0, 1.0);
  }
`;

const minReduceFragment = /* glsl */ `
  precision highp float;
  in vec2 vUv;
  out vec4 outColor;

  uniform sampler2D uFinerLevel;   // finer level (its own target, sampled at lod 0)
  uniform vec2 uSourceTexel;   // 1 / finer-level size
  uniform float uFar;

  void main() {
    // Gather the 2x2 block of the finer level and keep the closest (min) depth.
    // Background/far texels are sentinelled out so they never win the min unless
    // the whole footprint is background.
    vec2 base = vUv - 0.5 * uSourceTexel;
    float a = texture(uFinerLevel, base + uSourceTexel * vec2(0.25, 0.25)).r;
    float b = texture(uFinerLevel, base + uSourceTexel * vec2(0.75, 0.25)).r;
    float c = texture(uFinerLevel, base + uSourceTexel * vec2(0.25, 0.75)).r;
    float d = texture(uFinerLevel, base + uSourceTexel * vec2(0.75, 0.75)).r;
    float SENT = 1.0e9;
    a = a >= uFar ? SENT : a;
    b = b >= uFar ? SENT : b;
    c = c >= uFar ? SENT : c;
    d = d >= uFar ? SENT : d;
    float m = min(min(a, b), min(c, d));
    if (m >= SENT) m = uFar;
    outColor = vec4(m, 0.0, 0.0, 1.0);
  }
`;

/** Hard cap on levels: keeps the AO sampler's bound texture units small and is
 *  far more than the AO disk ever selects at sane radii. */
export const MAX_HIZ_LEVELS = 8;

export class DepthMipPyramid {
  readonly levels: number;

  private _targets: THREE.WebGLRenderTarget[] = [];
  private _width: number;
  private _height: number;
  private _linearizeMat: THREE.ShaderMaterial;
  private _minReduceMat: THREE.ShaderMaterial;
  private _quad: FullscreenQuad;

  constructor(width: number, height: number) {
    this._width = Math.max(1, Math.floor(width));
    this._height = Math.max(1, Math.floor(height));
    this.levels = Math.min(
      MAX_HIZ_LEVELS,
      Math.floor(Math.log2(Math.max(this._width, this._height))) + 1,
    );

    this._linearizeMat = new THREE.ShaderMaterial({
      glslVersion: THREE.GLSL3,
      vertexShader: this._vertex(),
      fragmentShader: linearizeFragment,
      uniforms: {
        uDepthSheet: { value: null },
        uNear: { value: 0.1 },
        uFar: { value: 1000 },
        uReversed: { value: false },
        uOrtho: { value: false },
      },
      depthTest: false,
      depthWrite: false,
    });

    this._minReduceMat = new THREE.ShaderMaterial({
      glslVersion: THREE.GLSL3,
      vertexShader: this._vertex(),
      fragmentShader: minReduceFragment,
      uniforms: {
        uFinerLevel: { value: null },
        uSourceTexel: { value: new THREE.Vector2() },
        uFar: { value: 1000 },
      },
      depthTest: false,
      depthWrite: false,
    });

    this._quad = new FullscreenQuad(this._linearizeMat);
    this._allocate();
  }

  private _vertex(): string {
    return /* glsl */ `
      out vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = vec4(position, 1.0);
      }
    `;
  }

  private _levelSize(level: number): { w: number; h: number } {
    return {
      w: Math.max(1, this._width >> level),
      h: Math.max(1, this._height >> level),
    };
  }

  private _allocate() {
    for (const t of this._targets) t.dispose();
    this._targets = [];
    for (let level = 0; level < this.levels; level++) {
      const { w, h } = this._levelSize(level);
      const target = new THREE.WebGLRenderTarget(w, h, {
        format: THREE.RedFormat,
        type: THREE.FloatType,
        minFilter: THREE.NearestFilter,
        magFilter: THREE.NearestFilter,
        generateMipmaps: false,
        depthBuffer: false,
        stencilBuffer: false,
      });
      target.texture.name = `hiZLevel${level}`;
      this._targets.push(target);
    }
  }

  /** Level-0 (full-res) linear-depth texture; what the denoise + composite read. */
  get texture(): THREE.Texture {
    return this._targets[0].texture;
  }

  /** All level textures, finest first. */
  get textures(): THREE.Texture[] {
    return this._targets.map((t) => t.texture);
  }

  setSize(width: number, height: number) {
    const w = Math.max(1, Math.floor(width));
    const h = Math.max(1, Math.floor(height));
    if (w === this._width && h === this._height) return;
    this._width = w;
    this._height = h;
    this._allocate();
  }

  /** Build the pyramid from the captured float32 depth. */
  build(
    renderer: THREE.WebGLRenderer,
    depthTexture: THREE.Texture,
    camera: THREE.PerspectiveCamera | THREE.OrthographicCamera,
  ) {
    // Level 0: linearize the NDC depth into positive eye distance.
    this._linearizeMat.uniforms.uDepthSheet.value = depthTexture;
    this._linearizeMat.uniforms.uNear.value = camera.near;
    this._linearizeMat.uniforms.uFar.value = camera.far;
    this._linearizeMat.uniforms.uReversed.value =
      (renderer.capabilities as { reversedDepthBuffer?: boolean })
        .reversedDepthBuffer === true;
    this._linearizeMat.uniforms.uOrtho.value =
      // Read off the projection, not the camera's class: a sheet's perspective is an orthographic camera
      // whose matrix projects in perspective, and reconstructed as ortho its depth changed with every tile.
      camera.projectionMatrix.elements[15] !== 0;
    this._quad.material = this._linearizeMat;
    this._quad.render(renderer, this._targets[0]);

    // Levels 1..N-1: min-reduce the level below (each its own target, read at lod 0).
    this._quad.material = this._minReduceMat;
    this._minReduceMat.uniforms.uFar.value = camera.far;
    for (let level = 1; level < this.levels; level++) {
      const src = this._levelSize(level - 1);
      this._minReduceMat.uniforms.uFinerLevel.value = this._targets[level - 1].texture;
      this._minReduceMat.uniforms.uSourceTexel.value.set(1 / src.w, 1 / src.h);
      this._quad.render(renderer, this._targets[level]);
    }
  }

  dispose() {
    this._linearizeMat.dispose();
    this._minReduceMat.dispose();
    for (const t of this._targets) t.dispose();
    this._targets = [];
  }
}
