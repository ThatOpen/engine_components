import * as THREE from "three";
import { FullscreenQuad } from "./fullscreen-quad";
import { DepthMipPyramid, MAX_HIZ_LEVELS } from "./depth-mip-pyramid";

/**
 * Scalable Ambient Obscurance (McGuire et al. 2012), built on the Alchemy AO
 * estimator (McGuire et al. 2011) and accelerated with a Hi-Z min-mip depth
 * pyramid.
 *
 * Per pixel: reconstruct view-space P from the Hi-Z level-0 linear depth + normal
 * from the octahedral G-buffer attachment; sample a per-pixel-rotated spiral disk
 * of mapped screen radius; for each tap select a Hi-Z mip from its screen distance
 * and reconstruct Q; accumulate the Alchemy obscurance.
 *
 * Estimator knobs (intensity sigma, contrast k, bias beta, epsilon) are exposed as
 * settings with neutral, first-principles defaults.
 */
// GLSL ES 3.00 (WebGL2) requires a sampler-array index to be a *literal*
// constant integral expression; a for-loop counter does NOT qualify (that was
// only legal in WebGL1). So unroll the level selector into literal-indexed
// branches generated from the level count.
// Levels 1..N-1 as assignments to a single result (level 0 is the initializer
// in sampleHiZ). A single initialized result + one return avoids the HLSL/ANGLE
// X4000 "potentially uninitialized variable" warning that an early-return chain
// triggers when cross-compiled to some native GPU backends.
const sampleHiZChain = Array.from({ length: MAX_HIZ_LEVELS }, (_, i) =>
  i === 0 ? null : `    if (lvl == ${i}) result = texture(uHiZ[${i}], uv).r;`,
)
  .filter(Boolean)
  .join("\n");

const aoFragment = /* glsl */ `
  precision highp float;
  #define MAX_MIPS ${MAX_HIZ_LEVELS}
  in vec2 vUv;
  out vec4 outColor;

  uniform sampler2D uHiZ[MAX_MIPS]; // per-level linear eye depth (Hi-Z min-mip chain)
  uniform sampler2D uNormal;    // RG = octahedral view normal
  uniform sampler2D uFaceId;    // RGBA8: A = role byte (1 = translucent)
  uniform vec2 uDrawnPixels;     // full-res pixel size
  uniform float uMaxMip;
  uniform vec2 uProjScaleXY;    // (P00, P11) of the projection matrix
  uniform float uProjScalePx;   // pixels-per-world-unit (perspective: at unit eye distance; ortho: constant)
  uniform bool uOrtho;          // orthographic projection
  uniform float uRadius;        // world-space AO radius
  uniform float uBias;          // beta: normal self-occlusion bias
  uniform float uEpsilon;       // denominator guard
  uniform float uIntensity;     // sigma
  uniform float uContrast;      // k
  uniform float uFar;
  uniform int uSamples;

  const float TWO_PI = 6.2831853071795864;
  const float SPIRAL_TURNS = 7.0;

  vec3 octDecode(vec2 e) {
    vec3 n = vec3(e.xy, 1.0 - abs(e.x) - abs(e.y));
    if (n.z < 0.0) {
      n.xy = (1.0 - abs(n.yx)) * vec2(n.x >= 0.0 ? 1.0 : -1.0, n.y >= 0.0 ? 1.0 : -1.0);
    }
    return normalize(n);
  }

  // View-space position from linear eye depth at uv. Perspective: x_view scales
  // with depth (x = ndc.x * z / P00). Orthographic: the eye-X/Y of a pixel is
  // INDEPENDENT of depth (x = ndc.x / P00, where ortho P00 = 2/(r-l)); applying
  // the perspective formula there skews every reconstructed point and breaks AO.
  vec3 viewPos(vec2 uv, float linearDepth) {
    vec2 ndc = uv * 2.0 - 1.0;
    float sx = uOrtho ? 1.0 : linearDepth;
    return vec3(
      ndc.x * sx / uProjScaleXY.x,
      ndc.y * sx / uProjScaleXY.y,
      -linearDepth
    );
  }

  float hash(vec2 p) {
    // Per-pixel spiral rotation (decorrelation).
    return fract(52.9829189 * fract(dot(p, vec2(0.06711056, 0.00583715))));
  }

  // Sample a chosen Hi-Z level. A sampler array must be indexed by a literal
  // constant integral expression in GLSL ES 3.00, so the level selector is
  // unrolled into literal-indexed branches (generated from MAX_MIPS).
  float sampleHiZ(vec2 uv, int lvl) {
    // Level 0 is the initializer/fallback; higher levels overwrite it. See
    // sampleHiZChain for why this is a single-result/single-return form.
    float result = texture(uHiZ[0], uv).r;
${sampleHiZChain}
    return result;
  }

  void main() {
    float depth = sampleHiZ(vUv, 0);
    if (depth >= uFar) { outColor = vec4(1.0); return; } // background: fully open

    // Translucent surfaces opt out of AO: emit fully open so the denoise has a
    // clean value to spread instead of a hole.
    if (texture(uFaceId, vUv).a > 0.5) { outColor = vec4(1.0); return; }

    vec3 P = viewPos(vUv, depth);
    vec3 N = octDecode(texture(uNormal, vUv).rg);

    // Screen-space disk radius for the world AO radius. Perspective: apparent
    // size shrinks with distance (divide by depth). Orthographic: world->screen
    // scale is constant, so the disk radius is depth-independent.
    float screenRadiusPx = uOrtho ? (uProjScalePx * uRadius)
                                  : (uProjScalePx * uRadius / depth);
    float rotation = hash(gl_FragCoord.xy) * TWO_PI;

    int n = uSamples;
    float occlusion = 0.0;
    for (int i = 0; i < 64; i++) {
      if (i >= n) break;
      float alpha = (float(i) + 0.5) / float(n);
      float angle = alpha * SPIRAL_TURNS * TWO_PI + rotation;
      float sampleRadiusPx = alpha * screenRadiusPx;
      vec2 offsetPx = vec2(cos(angle), sin(angle)) * sampleRadiusPx;
      vec2 sampleUv = vUv + offsetPx / uDrawnPixels;
      if (sampleUv.x < 0.0 || sampleUv.x > 1.0 || sampleUv.y < 0.0 || sampleUv.y > 1.0) continue;

      // Mip selection from screen distance: distant taps read coarser mips so the
      // working set stays bounded (Hi-Z). base step ~ a few texels.
      float mip = clamp(floor(log2(max(sampleRadiusPx, 1.0) / 4.0)), 0.0, uMaxMip);
      float sampleDepth = sampleHiZ(sampleUv, int(mip));
      if (sampleDepth >= uFar) continue;

      // Translucent occluders do not cast AO onto opaque geometry.
      if (texture(uFaceId, sampleUv).a > 0.5) continue;

      vec3 Q = viewPos(sampleUv, sampleDepth);
      vec3 V = Q - P;
      float vv = dot(V, V);
      float vn = dot(V, N);
      occlusion += max(0.0, vn - uBias) / (vv + uEpsilon);
    }

    float ao = max(0.0, 1.0 - (2.0 * uIntensity / float(n)) * occlusion);
    ao = pow(ao, uContrast);
    outColor = vec4(ao, ao, ao, 1.0);
  }
`;

export interface ScreenSpaceAoSettings {
  radius: number;
  bias: number;
  epsilon: number;
  intensity: number;
  contrast: number;
  samples: number;
}

export const defaultAoSettings: ScreenSpaceAoSettings = {
  radius: 0.5,
  bias: 0.012,
  // Denominator guard / view-space softening floor. Too small (~1cm) lets
  // near-contact taps (v.v -> 0) spike to near-black; ~0.02 (a ~14cm soft
  // radius at unit scale) keeps tight creases readable as soft contact AO.
  epsilon: 0.05,
  intensity: 0.85,
  contrast: 1.0,
  samples: 16,
};

export class ScreenSpaceAoPass {
  readonly renderTarget: THREE.WebGLRenderTarget;
  readonly settings: ScreenSpaceAoSettings;

  private _material: THREE.ShaderMaterial;
  private _quad: FullscreenQuad;
  private _width: number;
  private _height: number;

  constructor(width: number, height: number, settings = defaultAoSettings) {
    this._width = Math.max(1, Math.floor(width));
    this._height = Math.max(1, Math.floor(height));
    this.settings = { ...settings };

    this.renderTarget = new THREE.WebGLRenderTarget(this._width, this._height, {
      format: THREE.RedFormat,
      type: THREE.UnsignedByteType,
      minFilter: THREE.LinearFilter,
      magFilter: THREE.LinearFilter,
      depthBuffer: false,
      stencilBuffer: false,
    });
    this.renderTarget.texture.name = "aoRaw";

    this._material = new THREE.ShaderMaterial({
      glslVersion: THREE.GLSL3,
      vertexShader: /* glsl */ `
        out vec2 vUv;
        void main() { vUv = uv; gl_Position = vec4(position, 1.0); }
      `,
      fragmentShader: aoFragment,
      uniforms: {
        uHiZ: { value: [] as THREE.Texture[] },
        uNormal: { value: null },
        uFaceId: { value: null },
        uDrawnPixels: { value: new THREE.Vector2(this._width, this._height) },
        uMaxMip: { value: 1 },
        uProjScaleXY: { value: new THREE.Vector2(1, 1) },
        uProjScalePx: { value: 1 },
        uOrtho: { value: false },
        uRadius: { value: this.settings.radius },
        uBias: { value: this.settings.bias },
        uEpsilon: { value: this.settings.epsilon },
        uIntensity: { value: this.settings.intensity },
        uContrast: { value: this.settings.contrast },
        uFar: { value: 1000 },
        uSamples: { value: this.settings.samples },
      },
      depthTest: false,
      depthWrite: false,
    });

    this._quad = new FullscreenQuad(this._material);
  }

  get texture(): THREE.Texture {
    return this.renderTarget.texture;
  }

  setSize(width: number, height: number) {
    this._width = Math.max(1, Math.floor(width));
    this._height = Math.max(1, Math.floor(height));
    this.renderTarget.setSize(this._width, this._height);
    this._material.uniforms.uDrawnPixels.value.set(this._width, this._height);
  }

  render(
    renderer: THREE.WebGLRenderer,
    pyramid: DepthMipPyramid,
    normalTexture: THREE.Texture,
    faceIdTexture: THREE.Texture,
    camera: THREE.PerspectiveCamera | THREE.OrthographicCamera,
  ) {
    const u = this._material.uniforms;
    // Bind one sampler per level; pad unused slots with the coarsest texture so
    // every declared array element points at a valid texture (the AO disk never
    // selects past uMaxMip = levels - 1).
    const levels = pyramid.textures;
    const bound: THREE.Texture[] = [];
    for (let i = 0; i < MAX_HIZ_LEVELS; i++) {
      bound.push(levels[Math.min(i, levels.length - 1)]);
    }
    u.uHiZ.value = bound;
    u.uNormal.value = normalTexture;
    u.uFaceId.value = faceIdTexture;
    u.uMaxMip.value = pyramid.levels - 1;
    u.uFar.value = camera.far;
    // Projection scale: P00, P11 from the projection matrix. pixels-per-world-unit
    // = 0.5 * height * P11; this holds for BOTH perspective (at unit eye distance)
    // and orthographic (P11 = 2/(t-b) makes it the constant world->screen scale).
    const p = camera.projectionMatrix.elements;
    u.uProjScaleXY.value.set(p[0], p[5]);
    u.uProjScalePx.value = 0.5 * this._height * p[5];
    u.uOrtho.value =
      // Read off the projection, not the camera's class: a sheet's perspective is an orthographic camera
      // whose matrix projects in perspective, and reconstructed as ortho its depth changed with every tile.
      camera.projectionMatrix.elements[15] !== 0;
    u.uRadius.value = this.settings.radius;
    u.uBias.value = this.settings.bias;
    u.uEpsilon.value = this.settings.epsilon;
    u.uIntensity.value = this.settings.intensity;
    u.uContrast.value = this.settings.contrast;
    u.uSamples.value = this.settings.samples;
    this._quad.render(renderer, this.renderTarget);
  }

  dispose() {
    this._material.dispose();
    this.renderTarget.dispose();
  }
}
