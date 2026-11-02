import * as THREE from "three";
import { TEX_W } from "./shaders";

/**
 * The gaussian splat material for the WebGPU build: the SAME EWA projection as the GLSL one in
 * `shaders.ts`, written in TSL, line for line.
 *
 * 🔴 WHY IT IS A PORT AND NOT A SHARED SHADER. The GLSL material is a `RawShaderMaterial`, which
 * is by definition GLSL source handed to the driver; under WebGPU there is no driver to hand it
 * to. Everything ABOVE the shader is shared and untouched: the same data textures, the same
 * indexed quad, the same instanced `aSlot` sort order, the same covariance precompute, the same
 * uniform names and the same uniform OBJECTS. Only the shader body is rewritten.
 *
 * 🔴 THE ONE REAL DIVERGENCE: WHO DOES THE OCCLUSION. WebGL draws the splats into a colour layer
 * whose depth attachment is BORROWED from the BIM capture, so the depth unit hides a gaussian
 * behind a wall for free. WebGPU cannot lend that attachment (the scene pass destroys its depth
 * texture under any other target, which is why the overlay layers carry their own), and the splat
 * material writes no depth of its own to gate on, being transparent and sorted. So the scene's
 * depth arrives as a TEXTURE and the fragment discards what is behind it. Same picture, one
 * texture read per fragment, and it is the only way round that does not change the frame.
 *
 * Everything else the GLSL does — section clipping by splat centre, the near/behind-camera
 * rejection, the projection Jacobian with its orthographic branch, the INRIA low-pass dilation,
 * the eigen decomposition, the sub-pixel policy in both its modes, the extent-aware frustum cull,
 * the degree-1 spherical harmonics with their distance ramp — is here with the same arithmetic and
 * the same constants.
 */

/** Set once `three/tsl` has resolved; see {@link prepareWebgpuSplats}. */
let TSL_MODULE: any = null;

/**
 * Resolves `three/tsl` so a splat material can be built synchronously afterwards. Lazy on
 * purpose: under the WebGL build that specifier drags in the whole WebGPU bundle, and this module
 * is reachable from `shaders.ts`, which the WebGL road loads.
 *
 * ⚠️ CALLING THIS IS THE SWITCH. `mkSplatMaterial` builds a TSL material once this has resolved,
 * for every dataset in the process. Only `SplatLoader` calls it, and only when it has found a
 * WebGPU renderer, so "the page runs on WebGPU" and "splats are TSL" are the same fact. A page
 * running both engines at once would need the decision passed down instead.
 */
export async function prepareWebgpuSplats() {
  TSL_MODULE ??= await import("three/tsl");
}

/** Whether {@link createWebgpuSplatMaterial} can be called right now. */
export function webgpuSplatsReady() {
  return TSL_MODULE !== null;
}

/** The uniform block `mkSplatMaterial` is called with (see `shaders.ts`). */
export interface SplatMaterialInputs {
  texCenter: THREE.Texture;
  texCovA: THREE.Texture;
  texCovB: THREE.Texture;
  texColor: THREE.Texture;
  texSH?: THREE.Texture;
  shBands?: number;
  uViewport: { value: THREE.Vector2 };
  uFocal: { value: THREE.Vector2 };
  uMinPx: { value: number };
  uOrtho: { value: number };
}

export function createWebgpuSplatMaterial(inputs: SplatMaterialInputs) {
  const TSL = TSL_MODULE;
  if (!TSL) {
    throw new Error(
      "SplatLoader: call `prepareWebgpuSplats()` before building a webgpu splat material.",
    );
  }
  const {
    Fn, If, Discard, uniform, texture, textureLoad, varyingProperty,
    attribute, positionGeometry, modelViewMatrix, cameraProjectionMatrix,
    screenCoordinate, transpose, mat3, ivec2, int, uint, float, vec2, vec3, vec4,
    max, min, length, exp, sqrt, smoothstep, clamp, abs, bitAnd, shiftRight,
  } = TSL as any;

  const shBands = inputs.shBands ?? 0;

  // ── uniforms ────────────────────────────────────────────────────────────────────────────────
  //
  // The two Vector2s are the renderer's OWN objects, handed to the node as its value, so
  // `_uViewport.value.set(w, h)` every frame is seen without any bridging: three compares and
  // copies a vector uniform's contents on its way to the buffer.
  //
  // The two scalars cannot work that way — the renderer REPLACES `.value` on its own object, and
  // a node holding the old number would never hear about it — so they are bridged with
  // `onFrameUpdate`, whose return value three assigns to the node's value once per frame.
  const uViewport = uniform(inputs.uViewport.value);
  const uFocal = uniform(inputs.uFocal.value);
  const uMinPx = uniform(inputs.uMinPx.value).onFrameUpdate(() => inputs.uMinPx.value);
  const uOrtho = uniform(inputs.uOrtho.value).onFrameUpdate(() => inputs.uOrtho.value);

  const uSubPixel = uniform(0);
  const uSubMinA = uniform(0.1);
  const uShStrength = uniform(1);
  const uShMaxDist = uniform(0);
  const uShRange = uniform(new THREE.Vector2(4, -2));
  const uCamLocal = uniform(new THREE.Vector3());
  const uNumClip = uniform(0);
  // EIGHT PLAIN UNIFORMS, never a `uniformArray`: an array node mutated through `.array[i].set()`
  // was measured in this codebase never re-uploading (`section-blades.mjs` carries the note), and
  // a clipping test that silently always passes is the worst possible failure here.
  const clip = Array.from({ length: 8 }, () => uniform(new THREE.Vector4()));

  const texCenter = texture(inputs.texCenter);
  const texCovA = texture(inputs.texCovA);
  const texCovB = texture(inputs.texCovB);
  const texColor = texture(inputs.texColor);
  const texSH = shBands > 0 && inputs.texSH ? texture(inputs.texSH) : null;

  // The BIM depth to occlude against, handed over each frame by the loader from the seam context.
  // A 1x1 stand-in until then, so the material compiles before the first frame draws.
  const sceneDepth = texture(placeholderDepth());

  // ── varyings ────────────────────────────────────────────────────────────────────────────────
  const vPlace = varyingProperty("vec2", "vSplatPos");
  const vTint = varyingProperty("vec4", "vSplatColor");
  // The splat's CENTRE depth in NDC, which is what the vertex stage writes as the quad's depth
  // too. Carried so the fragment can compare it with the BIM depth without reconstructing it.
  const vDepth = varyingProperty("float", "vSplatDepth");

  const aSlot = attribute("aSlot", "float");

  const material = new (THREE as any).NodeMaterial();
  material.name = "WebgpuSplatMaterial";

  material.vertexNode = Fn(() => {
    // ⚠️ NO EARLY RETURN. The GLSL rejects a splat with `gl_Position = KILL; return;` six times
    // over, and TSL's `Return()` takes NO VALUE — it emits a bare `return`, which WGSL rejects in a
    // function that owes a varyings struct ("returned 'void', expected 'VaryingsStruct'"). So the
    // rejections set a flag and the blocks that must not run behind them are guarded by it. Flat,
    // not nested: once `alive` is 0 nothing further can turn it back on.
    const alive = int(1).toVar();
    const clipPos = vec4(0, 0, 2, 1).toVar(); // outside the clip volume: the rejected splat

    const idx = int(aSlot);
    const loc = ivec2(idx.mod(int(TEX_W)), idx.div(int(TEX_W)));
    const center = texCenter.load(loc).xyz.toVar();
    const ca = texCovA.load(loc).xyz;
    const cb = texCovB.load(loc).xyz;
    const colour = texColor.load(loc).toVar();
    // Σ's upper triangle, unpacked: covA = xx,xy,xz and covB = yy,yz,zz.
    const Vrk = mat3(ca.x, ca.y, ca.z, ca.y, cb.x, cb.y, ca.z, cb.y, cb.z);

    const cam = modelViewMatrix.mul(vec4(center, 1)).toVar();

    // Section clipping: drop the whole splat when its CENTRE is on the clipped side of any active
    // plane (planes already in view space). Same convention as three's material clipping, so a
    // gaussian is cut by exactly the planes that cut the BIM around it.
    for (let i = 0; i < 8; i++) {
      If(
        int(i)
          .lessThan(uNumClip)
          .and(cam.xyz.dot(clip[i].xyz).greaterThan(clip[i].w)),
        () => {
          alive.assign(int(0));
        },
      );
    }

    const pos2d = cameraProjectionMatrix.mul(cam).toVar();
    // Only the CENTRE behind the camera is rejected, where the perspective divide would flip. A
    // big splat straddling the near plane must still draw its visible part: the GPU near-clips the
    // quad per fragment. Culling those by centre made close splats pop out entirely.
    If(pos2d.w.lessThanEqual(0), () => {
      alive.assign(int(0));
    });

    const ndcZ = float(0).toVar();
    // Everything below divides by `pos2d.w`, which is why it is behind the flag and not merely
    // computed and thrown away.
    If(alive.equal(int(1)), () => {
      const vCenter = pos2d.xy.div(pos2d.w).toVar();
      ndcZ.assign(pos2d.z.div(pos2d.w));

      // Projection Jacobian ∂screen/∂view. PERSPECTIVE: depth-dependent, with the cam.x/z² term.
      // ORTHOGRAPHIC: constant (uFocal is already pixels per world unit for an ortho matrix), no
      // 1/depth, so a splat keeps its screen size with distance, as the cloud's ortho path does.
      const j00 = float(0).toVar();
      const j02 = float(0).toVar();
      const j11 = float(0).toVar();
      const j12 = float(0).toVar();
      If(uOrtho.greaterThan(0.5), () => {
        j00.assign(uFocal.x);
        j11.assign(uFocal.y);
      }).Else(() => {
        const z2 = cam.z.mul(cam.z);
        j00.assign(uFocal.x.div(cam.z));
        j02.assign(uFocal.x.mul(cam.x).div(z2).negate());
        j11.assign(uFocal.y.div(cam.z));
        j12.assign(uFocal.y.mul(cam.y).div(z2).negate());
      });
      // Column by column, exactly as the GLSL constructor filled it.
      const J = mat3(j00, float(0), j02, float(0), j11, j12, float(0), float(0), float(0));

      // 🔴 `mat3(mat4)` IS GLSL ONLY. WGSL has no such conversion constructor, so the upper-left
      // 3x3 is taken column by column, which both backends accept.
      const mv3 = mat3(
        modelViewMatrix.element(0).xyz,
        modelViewMatrix.element(1).xyz,
        modelViewMatrix.element(2).xyz,
      );
      const T = transpose(mv3).mul(J);
      const cov2d = transpose(T).mul(Vrk).mul(T);

      const d1 = cov2d.element(0).x.add(0.3).toVar(); // INRIA low-pass dilation
      const off = cov2d.element(0).y.toVar();
      const d2 = cov2d.element(1).y.add(0.3).toVar();
      const mid = d1.add(d2).mul(0.5).toVar();
      const rad = length(vec2(d1.sub(d2).mul(0.5), off)).toVar();
      const l1 = mid.add(rad).toVar();
      const l2 = max(mid.sub(rad), float(0.1)).toVar(); // minor-eigenvalue floor
      const eig = vec2(off, l1.sub(d1)).toVar();
      const eigLen = length(eig).toVar();
      const dvec = eigLen
        .greaterThan(1e-9)
        .select(eig.div(eigLen), vec2(1, 0))
        .toVar();
      const a1 = min(sqrt(l1.mul(2)), float(1024)).toVar();
      const a2 = min(sqrt(l2.mul(2)), float(1024)).toVar();

      // SUB-PIXEL SPLATS, both policies, for the reasons `shaders.ts` records at length.
      // DEFAULT: still discard under uMinPx, but RAMP the opacity over the band just above it, so
      // a splat fades out instead of blinking out and no boundary travels with the camera.
      // OPT-IN: grow the splat to the floor and scale its opacity by the area it gained, the only
      // mode where the finer gaussians a higher LOD streams in reach the screen at all.
      If(uMinPx.greaterThan(0), () => {
        const szPx = max(a1, a2).mul(2).toVar();
        If(uSubPixel.greaterThan(0.5), () => {
          const lowestR = uMinPx.mul(0.5);
          const b1 = max(a1, lowestR).toVar();
          const b2 = max(a2, lowestR).toVar();
          colour.a.mulAssign(a1.mul(a2).div(b1.mul(b2)));
          a1.assign(b1);
          a2.assign(b2);
          // The cull here is on ALPHA and never on size, which keeps the transition smooth.
          If(colour.a.lessThan(uSubMinA), () => {
            alive.assign(int(0));
          });
        }).Else(() => {
          If(szPx.lessThan(uMinPx), () => {
            alive.assign(int(0));
          });
          colour.a.mulAssign(smoothstep(uMinPx, uMinPx.mul(2), szPx));
        });
      });

      const longAxis = dvec.mul(a1).toVar();
      const narrowAxis = vec2(dvec.y, dvec.x.negate()).mul(a2).toVar();

      // EXTENT-AWARE frustum cull in x/y: a splat is dropped only when its screen AABB (centre
      // plus or minus the projected half-extent) is fully outside NDC, so a big gaussian near an
      // edge is not culled just because its centre left the frustum. Near/far stay with the GPU.
      const ext = abs(longAxis).add(abs(narrowAxis)).div(uViewport).mul(2).toVar();
      If(
        abs(vCenter.x).sub(ext.x).greaterThan(1).or(abs(vCenter.y).sub(ext.y).greaterThan(1)),
        () => {
          alive.assign(int(0));
        },
      );

      // Degree-1 spherical harmonics: the view-dependent colour the flat body drops. Built ONLY
      // for a dataset that carries them, so a flat one compiles a shader without the branch, the
      // texture or the fetch. Inside the `alive` gate, so a splat that will not be drawn never
      // pays for the lookup — the dominant cost of the feature.
      if (texSH) {
        If(alive.equal(int(1)), () => {
          const toSplat = center.sub(uCamLocal).toVar();
          const shDist = length(toSplat).toVar();
          const shAmt = uShStrength
            .mul(
              uShMaxDist
                .greaterThan(0)
                .select(
                  float(1).sub(smoothstep(uShMaxDist.mul(0.8), uShMaxDist, shDist)),
                  float(1),
                ),
            )
            .toVar();
          If(shAmt.greaterThan(0), () => {
            const d = toSplat.div(max(shDist, float(1e-6))).toVar();
            // ONE fetch, not three: all nine coefficients ride in a single RGBA32UI texel, three
            // bytes of r,g,b per basis. Every one of the quad's vertices repeats this lookup, so
            // trading two fetches for a handful of integer shifts is the right way round.
            const p = textureLoad(texSH, loc).toVar();
            const unpack = (word: any) =>
              vec3(
                float(bitAnd(word, uint(255))),
                float(bitAnd(shiftRight(word, uint(8)), uint(255))),
                float(bitAnd(shiftRight(word, uint(16)), uint(255))),
              )
                .div(255)
                .mul(uShRange.x)
                .add(uShRange.y);
            const c1 = unpack(p.x);
            const c2 = unpack(p.y);
            const c3 = unpack(p.z);
            // INRIA's basis, re-signed for our 180° flip about X on decode. Get it wrong and the
            // highlights track the wrong side of the scene: it looks lit, just backwards.
            const sh = c1.mul(d.y).sub(c2.mul(d.z)).sub(c3.mul(d.x)).mul(0.4886025119029199);
            colour.rgb.assign(clamp(colour.rgb.add(sh.mul(shAmt)), vec3(0), vec3(1)));
          });
        });
      }

      If(alive.equal(int(1)), () => {
        const offset = longAxis
          .mul(positionGeometry.x)
          .add(narrowAxis.mul(positionGeometry.y))
          .div(uViewport)
          .mul(2);
        clipPos.assign(vec4(vCenter.add(offset), ndcZ, 1));
      });
    });

    // Written on EVERY path: a varying left unassigned on one branch is undefined behaviour, and
    // the fragment of a rejected splat never runs anyway.
    vPlace.assign(positionGeometry.xy);
    vTint.assign(colour);
    vDepth.assign(ndcZ);
    return clipPos;
  })();

  material.fragmentNode = Fn(() => {
    const A = vPlace.dot(vPlace).negate().toVar();
    Discard(A.lessThan(-4));
    // 🔴 THE BIM OCCLUSION, DONE HERE. Under WebGL the depth unit does it against the borrowed
    // capture depth; here the scene's depth is a texture and the test is explicit. The splat's
    // depth is its CENTRE's, which is also what the vertex stage wrote for the whole quad, so this
    // is the same comparison the depth unit would have made.
    const scene = textureLoad(sceneDepth, ivec2(screenCoordinate.xy)).r;
    Discard(vDepth.greaterThan(scene));
    const B = exp(A).mul(vTint.a).toVar();
    return vec4(vTint.rgb.mul(B), B); // premultiplied
  })();

  material.side = THREE.DoubleSide; // the EWA offset can flip the quad's winding
  material.transparent = true;
  material.depthTest = false; // the fragment does the test; there is nothing to test against here
  material.depthWrite = false;
  material.fog = false;
  material.blending = THREE.CustomBlending;
  material.blendEquation = THREE.AddEquation;
  material.blendSrc = THREE.OneFactor;
  material.blendDst = THREE.OneMinusSrcAlphaFactor;

  // The loader and both renderers drive this material through `material.uniforms.X.value`, the
  // WebGL shape. The nodes wear it rather than teaching three call sites two shapes.
  const planes = clip.map((node: any) => node.value);
  const facade: any = {
    uCutPlanes: {
      get value() {
        return planes;
      },
      set value(list: THREE.Vector4[]) {
        for (let i = 0; i < 8; i++) clip[i].value.copy(list[i] ?? new THREE.Vector4());
      },
    },
    uShBands: { value: shBands },
    uTexW: { value: TEX_W },
  };
  const bridged: Record<string, any> = {
    texCenter, texCovA, texCovB, texColor, sceneDepth,
    uViewport, uFocal, uMinPx, uOrtho,
    uSubPixel, uSubMinA, uShStrength, uShMaxDist, uShRange, uCamLocal, uNumClip,
  };
  if (texSH) bridged.texSH = texSH;
  for (const key of Object.keys(bridged)) {
    const node = bridged[key];
    Object.defineProperty(facade, key, {
      enumerable: true,
      get: () => node,
      set: () => {},
    });
  }
  material.uniforms = facade;
  return material as THREE.Material & { uniforms: any };
}

/** 1x1 stand-in so the material compiles before the first seam frame hands over the real one. */
let _placeholderDepth: THREE.DataTexture | null = null;
function placeholderDepth(): THREE.DataTexture {
  if (!_placeholderDepth) {
    _placeholderDepth = new THREE.DataTexture(new Float32Array([1]), 1, 1, THREE.RedFormat, THREE.FloatType);
    _placeholderDepth.minFilter = _placeholderDepth.magFilter = THREE.NearestFilter;
    _placeholderDepth.colorSpace = THREE.NoColorSpace;
    _placeholderDepth.needsUpdate = true;
  }
  return _placeholderDepth;
}
