import * as THREE from "three";
import { FullscreenQuad } from "./fullscreen-quad";

/**
 * AO denoise: cross-bilateral separable blur with a geometry-aware (depth +
 * normal) range term.
 *
 * Two separable 1-D passes (H then V). Each neighbour weighted by
 *   spatial(offset) * range_depth(|Δ linear depth|) * range_normal(1 - N·Ni)
 * so the blur smooths the decorrelation noise but is stopped at silhouettes
 * (depth) AND at coplanar creases (normal). The normal term matters specifically
 * for BIM floor-wall / wall-wall inside corners, which a depth-only bilateral
 * bleeds across. Renormalised by summed weight (essential at edges).
 */
const denoiseFragment = /* glsl */ `
  precision highp float;
  in vec2 vUv;
  out vec4 outColor;

  uniform sampler2D uOcclusion;        // R = AO
  uniform sampler2D uHiZ;       // R = linear eye depth (level 0)
  uniform sampler2D uNormal;    // RG = octahedral view normal
  uniform vec2 uTexel;          // 1 / resolution
  uniform vec2 uDirection;      // (1,0) horizontal | (0,1) vertical
  uniform int uRadius;          // taps each side
  uniform float uDepthSigma;    // depth edge sensitivity (linear units)
  uniform float uNormalSigma;   // crease sensitivity

  vec3 octDecode(vec2 e) {
    vec3 n = vec3(e.xy, 1.0 - abs(e.x) - abs(e.y));
    if (n.z < 0.0) {
      n.xy = (1.0 - abs(n.yx)) * vec2(n.x >= 0.0 ? 1.0 : -1.0, n.y >= 0.0 ? 1.0 : -1.0);
    }
    return normalize(n);
  }

  void main() {
    float aoC = texture(uOcclusion, vUv).r;
    float depthC = texture(uHiZ, vUv).r;
    vec3 nC = octDecode(texture(uNormal, vUv).rg);

    float sum = aoC;          // centre tap, weight 1
    float wsum = 1.0;

    for (int i = 1; i <= 16; i++) {
      if (i > uRadius) break;
      float spatial = exp(-float(i * i) / (2.0 * float(uRadius) * float(uRadius)));
      for (int s = -1; s <= 1; s += 2) {
        vec2 off = uDirection * uTexel * float(i * s);
        vec2 uv = vUv + off;
        float ao = texture(uOcclusion, uv).r;
        float depth = texture(uHiZ, uv).r;
        vec3 n = octDecode(texture(uNormal, uv).rg);

        float dd = (depth - depthC) / max(uDepthSigma, 1e-4);
        float wDepth = exp(-dd * dd);
        float nDiff = 1.0 - max(dot(nC, n), 0.0);
        float wNormal = exp(-(nDiff * nDiff) / max(uNormalSigma * uNormalSigma, 1e-6));

        float w = spatial * wDepth * wNormal;
        sum += ao * w;
        wsum += w;
      }
    }

    outColor = vec4(sum / max(wsum, 1e-4), 0.0, 0.0, 1.0);
  }
`;

export interface AoDenoiseSettings {
  radius: number;      // taps each side per separable pass
  depthSigma: number;  // linear-depth edge falloff width
  normalSigma: number; // crease falloff width
}

export const defaultDenoiseSettings: AoDenoiseSettings = {
  radius: 5,
  depthSigma: 0.5,
  normalSigma: 0.3,
};

export class AoDenoisePass {
  readonly settings: AoDenoiseSettings;
  readonly outputTarget: THREE.WebGLRenderTarget;

  private _scratch: THREE.WebGLRenderTarget;
  private _material: THREE.ShaderMaterial;
  private _quad: FullscreenQuad;
  private _width: number;
  private _height: number;

  constructor(width: number, height: number, settings = defaultDenoiseSettings) {
    this._width = Math.max(1, Math.floor(width));
    this._height = Math.max(1, Math.floor(height));
    this.settings = { ...settings };

    const opts: THREE.RenderTargetOptions = {
      format: THREE.RedFormat,
      type: THREE.UnsignedByteType,
      minFilter: THREE.LinearFilter,
      magFilter: THREE.LinearFilter,
      depthBuffer: false,
      stencilBuffer: false,
    };
    this._scratch = new THREE.WebGLRenderTarget(this._width, this._height, opts);
    this.outputTarget = new THREE.WebGLRenderTarget(this._width, this._height, opts);
    this._scratch.texture.name = "aoDenoiseH";
    this.outputTarget.texture.name = "aoDenoised";

    this._material = new THREE.ShaderMaterial({
      glslVersion: THREE.GLSL3,
      vertexShader: /* glsl */ `
        out vec2 vUv;
        void main() { vUv = uv; gl_Position = vec4(position, 1.0); }
      `,
      fragmentShader: denoiseFragment,
      uniforms: {
        uOcclusion: { value: null },
        uHiZ: { value: null },
        uNormal: { value: null },
        uTexel: { value: new THREE.Vector2(1 / this._width, 1 / this._height) },
        uDirection: { value: new THREE.Vector2(1, 0) },
        uRadius: { value: this.settings.radius },
        uDepthSigma: { value: this.settings.depthSigma },
        uNormalSigma: { value: this.settings.normalSigma },
      },
      depthTest: false,
      depthWrite: false,
    });
    this._quad = new FullscreenQuad(this._material);
  }

  get texture(): THREE.Texture {
    return this.outputTarget.texture;
  }

  setSize(width: number, height: number) {
    this._width = Math.max(1, Math.floor(width));
    this._height = Math.max(1, Math.floor(height));
    this._scratch.setSize(this._width, this._height);
    this.outputTarget.setSize(this._width, this._height);
    this._material.uniforms.uTexel.value.set(1 / this._width, 1 / this._height);
  }

  render(
    renderer: THREE.WebGLRenderer,
    aoTexture: THREE.Texture,
    hiZTexture: THREE.Texture,
    normalTexture: THREE.Texture,
  ) {
    const u = this._material.uniforms;
    u.uHiZ.value = hiZTexture;
    u.uNormal.value = normalTexture;
    u.uRadius.value = this.settings.radius;
    u.uDepthSigma.value = this.settings.depthSigma;
    u.uNormalSigma.value = this.settings.normalSigma;

    // Horizontal: AO -> scratch
    u.uOcclusion.value = aoTexture;
    u.uDirection.value.set(1, 0);
    this._quad.render(renderer, this._scratch);

    // Vertical: scratch -> output
    u.uOcclusion.value = this._scratch.texture;
    u.uDirection.value.set(0, 1);
    this._quad.render(renderer, this.outputTarget);
  }

  dispose() {
    this._material.dispose();
    this._scratch.dispose();
    this.outputTarget.dispose();
  }
}
