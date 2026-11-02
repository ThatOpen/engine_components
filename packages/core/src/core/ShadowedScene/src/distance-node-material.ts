import * as THREE from "three";

/**
 * The distance renderer's depth-visualisation quad material for the WEBGPU
 * build — TSL twin of the GLSL `depthMaterial` in distance-renderer.ts,
 * formula-for-formula:
 *
 *   viewZ = perspectiveDepthToViewZ(d)  = (near·far) / ((far−near)·d − far)
 *   depth = viewZToOrthographicDepth(z) = (z + near) / (near − far)
 *   out   = vec4(vec3(1 − depth), 1)
 *
 * The two conversions are written out by hand (three's packing.glsl
 * formulas) instead of leaning on TSL re-exports, so this file only assumes
 * the TSL namespace basics.
 *
 * Exposes the same `uniforms.<name>.value` surface distance-renderer
 * mutates per compute (`tDiffuse`, `tDepth` swapped to the temp target's
 * textures; `cameraNear`/`cameraFar` from the world camera).
 */
export function newDistanceNodeMaterial(
  near: number,
  far: number,
): THREE.ShaderMaterial {
  const T = (THREE as any).TSL;
  if (!T) {
    throw new Error(
      "distance-node-material: WebGPU only. The application must resolve " +
        '`three` to `three/webgpu` (see SimpleRenderer\'s `mode: "webgpu"`).',
    );
  }
  const { uniform, texture, float, vec3, vec4, Fn } = T;

  // Placeholder textures so the nodes exist before the first compute swaps
  // in the real ones via `.value`. `texture(tex)` samples at the geometry
  // uv by default — the post quad's plane uv, same as the GLSL vUv.
  const placeholders = {
    tDiffuse: new THREE.Texture(),
    tDepth: new THREE.DepthTexture(1, 1),
  };

  const uniforms = {
    cameraNear: uniform(near),
    cameraFar: uniform(far),
    tDiffuse: texture(placeholders.tDiffuse),
    tDepth: texture(placeholders.tDepth),
  };

  const material = new (THREE as any).NodeMaterial();
  material.fragmentNode = Fn(() => {
    const d = uniforms.tDepth.x;
    const closeU = uniforms.cameraNear;
    const farU = uniforms.cameraFar;
    // perspectiveDepthToViewZ
    const viewZ = closeU
      .mul(farU)
      .div(farU.sub(closeU).mul(d).sub(farU));
    // viewZToOrthographicDepth
    const depthValue = viewZ.add(closeU).div(closeU.sub(farU));
    return vec4(vec3(float(1).sub(depthValue)), 1);
  })();

  (material as any).uniforms = uniforms;
  return material as THREE.ShaderMaterial;
}
