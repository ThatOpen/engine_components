// THE WEBGL DEFERRED PIPELINE'S FXAA, IN TSL.
//
// 🔴 THE SAME ALGORITHM AS THE WEBGL DEFERRED FXAA PASS, NOT three's. three's `FXAANode` is a
// different FXAA (edge search along the line, contrast threshold 0.0312, full subpixel blending), and it
// spread a one-pixel contour far more than the WebGL pass does: measured across the same wall edge in PEN,
// WebGL `8a 7e 7e a1` against `9c 7e 9c` with three's node, over a composite whose contour was already
// identical (`f3 7e 7e 7e f3` with anti-aliasing off). The look is the WebGL one, so its FXAA is too.
//
// The WebGL pass is the compact Lottes variant: five luma taps (centre and corners), a pass-through below
// `max(1/24, lMax / 8)`, a direction from the corner gradients, and a 4-tap blend along it mixed 75 % into
// the centre. Its taps come in pairs symmetric about the pixel (±1/6 and ±1/2 of the direction), so WebGPU's
// flipped texture y changes nothing and this version matches it line for line.

import * as THREE from "three";
import {
  Fn, If, vec2, vec3, vec4, float, uv, screenSize, dot, min, max, abs, clamp, mix, rtt,
} from "three/tsl";

/**
 * 🔴 THE COMPOSITE THE FXAA READS IS 8 BITS AND HAS NO DEPTH BUFFER (`FXAA_KNOBS`, both default on).
 *
 * `convertToTexture(node)` made a full-resolution RGBA16F target WITH a depth attachment (three's
 * `RenderTarget` defaults `depthBuffer` to true), cleared and bound every frame for a full-screen quad that
 * never tests depth: at 2880x1418 that is 33 MB of colour and 16 MB of depth a frame. The composite is
 * already display-encoded, which is what the canvas stores in 8 bits anyway, so the anti-aliasing reads
 * the same values the screen would show. `target8: false` / `depthBuffer: true` restore the old target.
 */
export const FXAA_KNOBS = { target8: true, depthBuffer: false };

const EDGE_MIN = 1.0 / 24.0;
const EDGE_THRESHOLD = 1.0 / 8.0;
const SUBPIX = 0.75;
const SPAN_MAX = 8.0;

/**
 * Anti-aliases a finished, display-encoded frame as the WebGL deferred pipeline's last step does.
 *
 * @param {object} node  the composite's output (display-referred colour)
 * @param {{ scale?: number }} [options]  `scale` < 1 draws the composite at that fraction of the canvas; the
 *   taps step in its texels and the bilinear reads upscale it
 */
export function withDeferredFxaa(node, { scale = 1 } = {}) {
  const source = rtt(node, null, null, {
    type: FXAA_KNOBS.target8 ? THREE.UnsignedByteType : THREE.HalfFloatType,
    depthBuffer: FXAA_KNOBS.depthBuffer,
  });
  if (scale !== 1) source.setResolutionScale(scale);
  const luma = (c) => dot(c, vec3(0.299, 0.587, 0.114));

  return Fn(() => {
    const here = uv();
    const texel = vec2(1).div(scale === 1 ? screenSize : screenSize.mul(scale));
    const texM = source.sample(here).toVar();
    const lumaHere = luma(texM.rgb).toVar();
    const lNW = luma(source.sample(here.add(vec2(texel.x.negate(), texel.y.negate()))).rgb).toVar();
    const lNE = luma(source.sample(here.add(vec2(texel.x, texel.y.negate()))).rgb).toVar();
    const lSW = luma(source.sample(here.add(vec2(texel.x.negate(), texel.y))).rgb).toVar();
    const lSE = luma(source.sample(here.add(vec2(texel.x, texel.y))).rgb).toVar();

    const lMin = min(lumaHere, min(min(lNW, lNE), min(lSW, lSE))).toVar();
    const lMax = max(lumaHere, max(max(lNW, lNE), max(lSW, lSE))).toVar();
    const range = lMax.sub(lMin);

    // Not an edge: passed through, alpha included.
    const result = texM.toVar();
    If(range.greaterThanEqual(max(float(EDGE_MIN), lMax.mul(EDGE_THRESHOLD))), () => {
      // Edge direction from the corner luma gradient.
      const dirX = lNW.add(lNE).sub(lSW.add(lSE)).negate();
      const dirY = lNW.add(lSW).sub(lNE.add(lSE));
      const reduce = max(lNW.add(lNE).add(lSW).add(lSE).mul(0.25 / 8.0), float(1.0 / 128.0));
      const rcpMin = float(1).div(min(abs(dirX), abs(dirY)).add(reduce));
      const dir = clamp(vec2(dirX, dirY).mul(rcpMin), -SPAN_MAX, SPAN_MAX).mul(texel).toVar();

      const rgbA = source.sample(here.add(dir.mul(1.0 / 3.0 - 0.5))).rgb
        .add(source.sample(here.add(dir.mul(2.0 / 3.0 - 0.5))).rgb)
        .mul(0.5)
        .toVar();
      const rgbB = rgbA.mul(0.5).add(
        source.sample(here.add(dir.mul(-0.5))).rgb.add(source.sample(here.add(dir.mul(0.5))).rgb).mul(0.25),
      ).toVar();

      const lumaFar = luma(rgbB);
      const outside = lumaFar.lessThan(lMin).or(lumaFar.greaterThan(lMax));
      const picked = outside.select(rgbA, rgbB);
      result.assign(vec4(mix(texM.rgb, picked, SUBPIX), texM.a));
    });
    return result;
  })();
}
