import * as THREE from "three";
import { FullscreenQuad } from "./fullscreen-quad";

/**
 * FXAA tail pass. Screen-space AA is the canonical deferred-pipeline AA path,
 * since hardware MSAA on a G-buffer is rarely worth it. Compact luma-based FXAA
 * (Lottes), run on the LDR composited output as the final step before the
 * framebuffer. Operates on sRGB-encoded colour: luma from the encoded RGB is the
 * standard FXAA input.
 */
const fxaaFragment = /* glsl */ `
  precision highp float;
  in vec2 vUv;
  out vec4 outColor;

  uniform sampler2D uImage;
  uniform vec2 uTexel;

  const float EDGE_MIN = 1.0 / 24.0;
  const float EDGE_THRESHOLD = 1.0 / 8.0;
  const float SUBPIX = 0.75;
  const float SPAN_MAX = 8.0;

  float luma(vec3 c) { return dot(c, vec3(0.299, 0.587, 0.114)); }

  void main() {
    vec4 texM = texture(uImage, vUv);
    vec3 rgbM = texM.rgb;
    float lumaHere = luma(rgbM);
    float lNW = luma(texture(uImage, vUv + vec2(-uTexel.x, -uTexel.y)).rgb);
    float lNE = luma(texture(uImage, vUv + vec2( uTexel.x, -uTexel.y)).rgb);
    float lSW = luma(texture(uImage, vUv + vec2(-uTexel.x,  uTexel.y)).rgb);
    float lSE = luma(texture(uImage, vUv + vec2( uTexel.x,  uTexel.y)).rgb);

    float lMin = min(lumaHere, min(min(lNW, lNE), min(lSW, lSE)));
    float lMax = max(lumaHere, max(max(lNW, lNE), max(lSW, lSE)));
    float range = lMax - lMin;

    // Not an edge: pass through (alpha preserved so a transparent background survives).
    if (range < max(EDGE_MIN, lMax * EDGE_THRESHOLD)) {
      outColor = vec4(rgbM, texM.a);
      return;
    }

    // Edge direction from the corner luma gradient.
    vec2 dir;
    dir.x = -((lNW + lNE) - (lSW + lSE));
    dir.y =  ((lNW + lSW) - (lNE + lSE));

    float reduce = max((lNW + lNE + lSW + lSE) * 0.25 * (1.0 / 8.0), 1.0 / 128.0);
    float rcpMin = 1.0 / (min(abs(dir.x), abs(dir.y)) + reduce);
    dir = clamp(dir * rcpMin, -SPAN_MAX, SPAN_MAX) * uTexel;

    vec3 rgbA = 0.5 * (
      texture(uImage, vUv + dir * (1.0 / 3.0 - 0.5)).rgb +
      texture(uImage, vUv + dir * (2.0 / 3.0 - 0.5)).rgb);
    vec3 rgbB = rgbA * 0.5 + 0.25 * (
      texture(uImage, vUv + dir * -0.5).rgb +
      texture(uImage, vUv + dir * 0.5).rgb);

    float lumaFar = luma(rgbB);
    vec3 result = (lumaFar < lMin || lumaFar > lMax) ? rgbA : rgbB;
    outColor = vec4(mix(rgbM, result, SUBPIX), texM.a);
  }
`;

export class FxaaPass {
  private _material: THREE.ShaderMaterial;
  private _quad: FullscreenQuad;

  constructor(width: number, height: number) {
    this._material = new THREE.ShaderMaterial({
      glslVersion: THREE.GLSL3,
      vertexShader: /* glsl */ `
        out vec2 vUv;
        void main() { vUv = uv; gl_Position = vec4(position, 1.0); }
      `,
      fragmentShader: fxaaFragment,
      uniforms: {
        uImage: { value: null },
        uTexel: { value: new THREE.Vector2(1 / Math.max(1, width), 1 / Math.max(1, height)) },
      },
      depthTest: false,
      depthWrite: false,
    });
    this._quad = new FullscreenQuad(this._material);
  }

  setSize(width: number, height: number) {
    this._material.uniforms.uTexel.value.set(1 / Math.max(1, width), 1 / Math.max(1, height));
  }

  render(
    renderer: THREE.WebGLRenderer,
    inputTexture: THREE.Texture,
    target: THREE.WebGLRenderTarget | null,
  ) {
    this._material.uniforms.uImage.value = inputTexture;
    this._quad.render(renderer, target);
  }

  dispose() {
    this._material.dispose();
  }
}
