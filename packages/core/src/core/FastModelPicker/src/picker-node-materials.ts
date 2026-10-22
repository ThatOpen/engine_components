import * as THREE from "three";

/**
 * The picker's encoder materials for a WebGPU renderer: TSL twins of the
 * GLSL pick shader in fast-model-picker.ts, formula for formula, one output
 * per material:
 *
 *   id     → vec4(modelByte/255, id.yzw/255)  (id = vec4 vertex attribute)
 *   depth  → the EXACT pack convention of the GLSL shader: window depth v,
 *            r=fract(v·256³) g=fract(v·256²) b=fract(v·256) a=v, the
 *            yzw -= xyz/256 residual shave, and the ×256/255 upscale, so the
 *            single JS-side `unpackDepthFromRGBA` decodes both renderers'
 *            bytes identically.
 *   normal → world normal in RGB, facing the camera.
 *
 * The window depth is computed from a perspective-correct clip-space varying
 * (z/w). Under WebGPU, NDC z is already [0,1] and three builds the
 * projection matrix for that coordinate system, so z/w IS the window depth
 * the hardware writes.
 *
 * Only built under `SimpleRenderer`'s `mode: "webgpu"`, where the
 * application resolves `three` to `three/webgpu`: everything is read off the
 * `THREE` namespace at call time (`THREE.TSL`, `THREE.NodeMaterial`), so
 * this module imports nothing beyond `three` and loads nothing extra for a
 * WebGL application.
 *
 * Known divergence from the GLSL shader: no clipping-plane cutout of its
 * own (a `fragmentNode` override bypasses the node clipping setup). Picks
 * respect the planes `SimpleRenderer` hands to the scene's clipping group.
 *
 * Each material exposes the `uniforms.<name>.value` surface the picker
 * mutates (only `modelByte`), via TSL uniform nodes.
 */

function tsl() {
  const T = (THREE as any).TSL;
  if (!T || typeof (THREE as any).NodeMaterial !== "function") {
    throw new Error(
      "picker-node-materials: WebGPU only. The application must resolve " +
        '`three` to `three/webgpu` (see SimpleRenderer\'s `mode: "webgpu"`).',
    );
  }
  return T;
}

function newBase(): any {
  const material = new (THREE as any).NodeMaterial();
  material.side = THREE.DoubleSide;
  return material;
}

/** Perspective-correct window depth (z/w of the clip-space varying). */
function windowDepth(T: any) {
  const {
    varying,
    vec4,
    positionGeometry,
    modelViewMatrix,
    cameraProjectionMatrix,
  } = T;
  const vClip = varying(
    cameraProjectionMatrix.mul(modelViewMatrix.mul(vec4(positionGeometry, 1))),
  );
  return vClip.z.div(vClip.w);
}

/** The `id` output: model byte in R, the lower three bytes of `itemId + 1` in GBA. */
export function newIdNodeMaterial(): THREE.ShaderMaterial {
  const T = tsl();
  const { uniform, attribute, varying, vec4, Fn } = T;

  const uniforms = { modelByte: uniform(1) };
  const vertexKey = varying(attribute("id", "vec4"));

  const material = newBase();
  material.fragmentNode = Fn(() =>
    vec4(
      uniforms.modelByte.div(255),
      vertexKey.y.div(255),
      vertexKey.z.div(255),
      vertexKey.w.div(255),
    ),
  )();
  material.uniforms = uniforms;
  return material as THREE.ShaderMaterial;
}

/** The `depth` output: the window depth packed into four bytes. */
export function newDepthNodeMaterial(): THREE.ShaderMaterial {
  const T = tsl();
  const { vec4, fract, Fn } = T;

  const material = newBase();
  material.fragmentNode = Fn(() => {
    const v = windowDepth(T);
    const packed = vec4(
      fract(v.mul(16777216)),
      fract(v.mul(65536)),
      fract(v.mul(256)),
      v,
    ).toVar();
    packed.yzw.subAssign(packed.xyz.mul(1 / 256));
    packed.mulAssign(256 / 255);
    return packed;
  })();
  material.uniforms = {};
  return material as THREE.ShaderMaterial;
}

/** The `normal` output: `normal * 0.5 + 0.5` in RGB, alpha 1. */
export function newNormalNodeMaterial(): THREE.ShaderMaterial {
  const T = tsl();
  const {
    vec4,
    normalize,
    cross,
    dFdx,
    dFdy,
    positionWorld,
    cameraPosition,
    sign,
    dot,
    Fn,
  } = T;

  const material = newBase();
  material.fragmentNode = Fn(() => {
    // The facet normal from screen-space derivatives, oriented toward the
    // camera: it needs no `normal` attribute, settles the dFdy sign
    // convention of the API, and gives what the GLSL shader's backface flip
    // gives. Divergence from the GLSL shader: on a smooth-shaded curved
    // surface that one answers the interpolated vertex normal and this one
    // the facet's, which is what plane creation and surface alignment want.
    const flat = normalize(
      cross(dFdx(positionWorld), dFdy(positionWorld)),
    ).toVar();
    const n = flat.mul(sign(dot(flat, cameraPosition.sub(positionWorld))));
    return vec4(n.mul(0.5).add(0.5), 1);
  })();
  material.uniforms = {};
  return material as THREE.ShaderMaterial;
}
