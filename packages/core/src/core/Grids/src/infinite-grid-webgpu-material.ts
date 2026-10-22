import * as THREE from "three";

/**
 * The infinite-grid material for the webgpu build, formula-for-formula from
 * the GLSL ShaderMaterial in `simple-grid.ts` (which the webgpu NodeBuilder
 * refuses to compile). Expressed as TSL nodes via the `THREE.TSL` namespace
 * that ships IN the webgpu build — deliberately NOT `import "three/tsl"`,
 * which would drag the webgpu module graph into webgl pages.
 *
 * Standalone on purpose: it imports ONLY three, and is only called when the
 * world's renderer is a WebGPU one (`SimpleRenderer`'s `mode: "webgpu"`).
 *
 * The returned material carries a `uniforms` object of TSL uniform nodes
 * (each with `.value`), matching the ShaderMaterial surface that
 * `SimpleGrid`, its config manager and the fade/zoom setters mutate.
 */
export function newInfiniteGridWebgpuMaterial(
  fade: number,
  color: THREE.Color,
  primarySize: number,
  secondarySize: number,
  distance: number,
  /**
   * True when the grid draws straight to the canvas. WebGL's ShaderMaterial
   * writes the colour's stored (linear) value with no output encoding, so a
   * 0xbbbbbb line reaches the screen as ~0x7f; three's WebGPU output encodes
   * it to 0xbb, a grid measured half again as bright (line on grass 120 vs
   * 176). Decoding it first cancels the encoding. False inside a
   * postproduction overlay layer, which is composited over the already
   * encoded frame without any encoding of its own.
   */
  encodedOutput = true,
): THREE.Material {
  const { TSL, MeshBasicNodeMaterial } = THREE as any;
  const {
    sRGBTransferEOTF,
    uniform,
    positionGeometry,
    positionWorld,
    cameraPosition,
    fwidth,
    min,
    distance: dist,
    pow,
    mix,
    step,
    float,
    vec3,
    vec4,
    Fn,
    Discard,
  } = TSL;

  const uniforms = {
    uSize1: uniform(primarySize),
    uSize2: uniform(secondarySize),
    uColor: uniform(color),
    uDistance: uniform(distance),
    uFade: uniform(fade),
    uZoom: uniform(1),
  };

  // ⚠️ NO DEPTH WRITE. Under WebGL DEFERRED the grid never enters the capture:
  // it is redrawn over the finished frame, depth-tested but leaving the scene
  // depth alone. Under WebGPU it is drawn inside the postproduction's scene
  // pass, and a grid line that wrote depth there would read as a surface: the
  // composite would tonemap it, the AO would shade around it and the contour
  // would ink both sides of every line.
  const material = new MeshBasicNodeMaterial({
    side: THREE.DoubleSide,
    transparent: true,
    depthWrite: false,
  });

  // vertex: pos = position.xzy * uDistance; pos.xz += cameraPosition.xz.
  // positionNode overrides the local position, and the mesh has no
  // transform, so positionWorld in the fragment stage sees exactly the
  // GLSL's worldPosition varying.
  const scaled = positionGeometry.xzy.mul(uniforms.uDistance);
  material.positionNode = vec3(
    scaled.x.add(cameraPosition.x),
    scaled.y,
    scaled.z.add(cameraPosition.z),
  );

  const readLattice = (size: any) => {
    const r = positionWorld.xz.div(size);
    const grid = r.sub(0.5).fract().sub(0.5).abs().div(fwidth(r));
    const line = min(grid.x, grid.y);
    return float(1).sub(min(line, float(1)));
  };

  // `outputNode`, not `fragmentNode`: three skips the render target's MRT for
  // a material with a `fragmentNode`, so inside a pass with extra attachments
  // (the postproduction's face and normal) the pipeline had no output for them
  // and WebGPU rejected it, taking the whole frame's command buffer with it.
  // With `outputNode` the pass MRT applies, and its extra channels carry
  // alpha 0, so this blended grid leaves them as they were.
  material.outputNode = Fn(() => {
    const d = float(1).sub(
      min(
        dist(cameraPosition.xz, positionWorld.xz).div(uniforms.uDistance),
        float(1),
      ),
    );
    const g1 = readLattice(uniforms.uSize1);
    const g2 = readLattice(uniforms.uSize2);

    // Ortho camera fades the grid away when zooming out
    const minZoom = step(float(0.2), uniforms.uZoom);
    const zoomFactor = pow(min(uniforms.uZoom, float(1)), float(2)).mul(
      minZoom,
    );

    const base = mix(g2, g1, g1).mul(pow(d, uniforms.uFade));
    const alpha = mix(base.mul(0.5), base, g2).mul(zoomFactor);
    Discard(alpha.lessThanEqual(float(0)));
    return vec4(
      encodedOutput ? sRGBTransferEOTF(uniforms.uColor) : uniforms.uColor,
      alpha,
    );
  })();

  (material as any).uniforms = uniforms;
  return material as THREE.Material;
}
