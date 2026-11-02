import * as THREE from "three";
import { createWebgpuSplatMaterial, webgpuSplatsReady } from "./webgpu-splats";

/**
 * Shared GPU bits for BOTH splat renderers — the in-core {@link GSplat} (renderer.ts) and the
 * out-of-core {@link GSplatStream} (stream.ts). Both reuse the EXACT same shaders, material,
 * indexed-quad geometry, covariance precompute and DataTexture formats so they render
 * identically through the deferred occlusion seam; only the data-residency strategy differs.
 *
 * (Factored out of renderer.ts so streaming stays DRY — see the EWA/material comments there for
 * the deferred-seam reversed-Z depth rationale.)
 */

export const TEX_W = 2048;

// ---- shaders -------------------------------------------------------------------------------

const DECL = /* glsl */ `
in vec3 position;          // quad corner ∈ [-2,2]
in float aSlot;
uniform mat4 modelViewMatrix, projectionMatrix;
uniform int uTexW;
uniform float uMinPx;      // minimum projected splat size (0=off)
uniform float uSubPixel;   // 1 = keep sub-pixel splats (grow + compensate) instead of dropping them
uniform float uSubMinA;    // in that mode, drop a grown splat once its compensated alpha falls here
uniform float uOrtho;      // 1 = orthographic camera (constant Jacobian, no 1/depth)
uniform vec2 uViewport, uFocal;
uniform vec4 uCutPlanes[8];   // active clipping planes in VIEW space (xyz=normal, w=constant)
uniform int uNumClip;          // 0 = clipping off
uniform int uShBands;          // 0 = no spherical harmonics (flat colour), 1 = degree 1
uniform float uShStrength;     // 0..1 user dial over the view-dependent term
uniform vec2 uShRange;         // (scale, offset) dequant for the 8-bit SH texture
uniform vec3 uCamLocal;        // camera position in the DATASET's local space
uniform float uShMaxDist;      // drop SH beyond this distance from the camera (0 = no limit)
out vec2 vPos;
out vec4 vColor;`;

// Degree-1 spherical harmonics: the VIEW-DEPENDENT colour the flat FQC1 body drops. `texSH` is one
// RGBA32UI texel per splat, on the same grid as every other data texture, with x/y/z each packing
// one basis's r,g,b into three bytes — so the streaming slab's row allocator and whole-row uploads
// carry over unchanged.
//
// The basis: INRIA's eval_sh writes the degree-1 term as C1·(-y·sh1 + z·sh2 - x·sh3) with the
// direction taken CAMERA → SPLAT in the original ply frame. Our splats are rotated 180° about X on
// decode (y→-y, z→-z), so a render-space direction d maps back as (d.x, -d.y, -d.z); substituting
// turns the basis into (+d.y, -d.z, -d.x). Get this wrong and highlights track the wrong side of
// the scene — it looks lit, just backwards.
//
// It runs INSIDE the EWA block, AFTER the clip / near / min-pixel / frustum rejections, so a splat
// that is not going to be drawn never pays for the 3 texture fetches (~12 per splat, the dominant
// cost of the feature). Gating on uShStrength likewise makes the 0 setting a real bypass, not a
// multiply by zero.
//
// A smoothstep size-fade also lived here — skip SH on splats too small to show a highlight — on
// the assumption that the cost came from the many tiny splats. MEASURED AND REMOVED: paired trials
// showed the cost tracks the splat COUNT, not their size (3.4 ms at 4.0M drawn, below the noise
// floor at 0.8M), so the fade only lightened the case that was already cheap and could not touch
// the expensive one, where splats are large and none of them faded. It bought nothing at any
// viewpoint. The lever that does work on this cost is LOD, which draws fewer splats.
const SH_EVAL = /* glsl */ `
  // DISTANCE limit. The view-dependent term is only perceptible on surfaces close enough to read
  // as a surface; past that it is a per-splat cost paying for nothing. The vector to the splat is
  // needed for the SH direction anyway, so its length is nearly free and is computed BEFORE the
  // branch — that way a splat past the limit skips the texture fetch entirely, which is the whole
  // point. Ramped over the last 20% rather than cut, so splats don't change colour as they cross
  // it: a hard boundary here would reproduce the distance "cut" artefact this codebase was already
  // criticised for.
  vec3 toSplat = center - uCamLocal;
  float shDist = length(toSplat);
  float shAmt = uShStrength * (uShMaxDist > 0.0
    ? 1.0 - smoothstep(uShMaxDist * 0.8, uShMaxDist, shDist)
    : 1.0);
  if (uShBands > 0 && shAmt > 0.0) {
    vec3 d = toSplat / max(shDist, 1e-6);
    // ONE fetch, not three. All 9 coefficients ride in a single RGBA32UI texel: x/y/z each pack
    // one basis's r,g,b as three bytes (w spare). The quad has 4 vertices and every one of them
    // repeats this lookup, so fetch count is multiplied by 4 per splat — trading 3 fetches for a
    // handful of integer shifts is the right way round. The on-disk SHQ1 layout is UNCHANGED;
    // the decode worker does this packing, so existing datasets need no reconversion.
    uvec4 p = texelFetch(texSH, loc, 0);
    vec3 c1 = vec3((p.x >> 0) & 255u, (p.x >> 8) & 255u, (p.x >> 16) & 255u) / 255.0 * uShRange.x + uShRange.y;
    vec3 c2 = vec3((p.y >> 0) & 255u, (p.y >> 8) & 255u, (p.y >> 16) & 255u) / 255.0 * uShRange.x + uShRange.y;
    vec3 c3 = vec3((p.z >> 0) & 255u, (p.z >> 8) & 255u, (p.z >> 16) & 255u) / 255.0 * uShRange.x + uShRange.y;
    vec3 sh = 0.4886025119029199 * (d.y * c1 - d.z * c2 - d.x * c3);
    vColor.rgb = clamp(vColor.rgb + sh * shAmt, 0.0, 1.0);
  }`;

// Given `vec3 center`, `mat3 Vrk` and `vTint` set: project to a screen-space EWA quad and
// write the CENTRE depth so the borrowed BIM depth can occlude it (the deferred-seam change).
const EWA = /* glsl */ `
  vPos = position.xy;
  vec4 cam = modelViewMatrix * vec4(center, 1.0);
  // Section clipping: cull the whole splat when its centre is on the clipped side of
  // any active plane (planes pre-transformed to view space). Matches three's material
  // clipping convention (discard where dot(viewPos, n) > constant).
  for (int ci = 0; ci < 8; ci++) {
    if (ci >= uNumClip) break;
    if (dot(cam.xyz, uCutPlanes[ci].xyz) > uCutPlanes[ci].w) {
      gl_Position = vec4(0.0, 0.0, 2.0, 1.0); return;
    }
  }
  vec4 pos2d = projectionMatrix * cam;
  // Only reject splats whose CENTRE is behind the camera (the perspective divide would
  // flip). Do NOT cull on the near plane by centre: a large splat straddling the near
  // plane must still draw its visible part — the GPU near-clips the quad per-fragment via
  // gl_Position.z. Discarding the whole splat by centre made close splats pop out entirely.
  // (The screen-extent frustum cull happens below, once the projected size is known.)
  if (pos2d.w <= 0.0) { gl_Position = vec4(0.0, 0.0, 2.0, 1.0); return; }
  vec2 vCenter = pos2d.xy / pos2d.w;
  float ndcZ = pos2d.z / pos2d.w;   // splat-centre depth → occlude against the borrowed BIM depth
  // Projection Jacobian ∂screen/∂view. PERSPECTIVE: depth-dependent (focal/z, with the
  // cam.x/z² off-diagonal). ORTHOGRAPHIC: constant (uFocal is already pixels-per-world-unit
  // = 0.5·viewport·projElem for an ortho matrix), no 1/depth → splats keep a constant screen
  // size with distance, matching the point-cloud ortho path.
  mat3 J = uOrtho > 0.5
    ? mat3(uFocal.x, 0.0, 0.0,
           0.0, uFocal.y, 0.0,
           0.0, 0.0, 0.0)
    : mat3(uFocal.x / cam.z, 0.0, -(uFocal.x * cam.x) / (cam.z * cam.z),
           0.0, uFocal.y / cam.z, -(uFocal.y * cam.y) / (cam.z * cam.z),
           0.0, 0.0, 0.0);
  mat3 T = transpose(mat3(modelViewMatrix)) * J;
  mat3 cov2d = transpose(T) * Vrk * T;
  float d1 = cov2d[0][0] + 0.3;       // INRIA low-pass dilation
  float off = cov2d[0][1];
  float d2 = cov2d[1][1] + 0.3;
  float mid = 0.5 * (d1 + d2);
  float rad = length(vec2(0.5 * (d1 - d2), off));
  float l1 = mid + rad;
  float l2 = max(mid - rad, 0.1);     // minor-eigenvalue floor
  vec2 eig = vec2(off, l1 - d1);
  float eigLen = length(eig);
  vec2 dvec = eigLen > 1e-9 ? eig / eigLen : vec2(1.0, 0.0);
  float a1 = min(sqrt(2.0 * l1), 1024.0);
  float a2 = min(sqrt(2.0 * l2), 1024.0);
  // SUB-PIXEL SPLATS. This used to be a hard discard — anything projecting under uMinPx vanished —
  // and that is the "cut at a fixed distance" the capture looked like it had: a binary boundary
  // that travels with the camera. It also quietly capped detail, because the extra gaussians a
  // finer LOD adds are SMALLER, so they were discarded on arrival: raising lodQuality from 0.55 to
  // 2.0 drew 20% more splats and produced a bit-identical image, while with the discard off the
  // same change did alter it.
  //
  // Instead, grow a too-small splat to the floor size and scale its opacity by the area it gained,
  // so its total contribution (area x opacity) is preserved. Distant surfaces then thin out
  // continuously instead of ending at a line, and LOD detail actually reaches the screen. The
  // remaining cull is on ALPHA, not size: it drops only what has faded past 8-bit visibility, so
  // it can never produce a visible edge.
  // SUB-PIXEL SPLATS — two ways, because "no visible edge" and "distant detail survives" are
  // different goals with very different price tags.
  //
  // DEFAULT (uSubPixel = 0): still discard below uMinPx, so the cost is unchanged, but RAMP the
  // opacity down over the band just above the threshold. A splat now fades out and is only dropped
  // once it is already invisible, instead of blinking out at full strength. That removes the hard
  // boundary — the "cut at a fixed distance" — for free.
  //
  // OPT-IN (uSubPixel = 1): don't discard at all. Grow the splat to the floor size and scale its
  // opacity by the area it gained, preserving its total contribution. This is the only mode where
  // the finer gaussians a higher lodQuality streams in actually reach the screen: measured, with
  // the discard active, raising lodQuality 0.55 -> 2.0 drew 20% more splats and produced a
  // BIT-IDENTICAL image, because everything it added was immediately culled. It is expensive
  // (~2x frame time on a 4M-splat view) and, counter-intuitively, a LARGER uMinPx costs MORE here
  // since it inflates every tiny quad rather than removing it.
  if (uMinPx > 0.0) {
    float szPx = 2.0 * max(a1, a2);
    if (uSubPixel > 0.5) {
      float rMin = uMinPx * 0.5;
      float b1 = max(a1, rMin), b2 = max(a2, rMin);
      vColor.a *= (a1 * a2) / (b1 * b2);
      a1 = b1; a2 = b2;
      // The cull here is on ALPHA, never on size, which is what keeps the transition smooth: a
      // splat's opacity decays continuously with distance and it is dropped only once it has
      // faded to uSubMinA. Raising that threshold is therefore a pure cost/fidelity dial that
      // CANNOT reintroduce a hard edge — unlike a size cut, which is the artefact this whole
      // change exists to remove.
      if (vColor.a < uSubMinA) { gl_Position = vec4(0.0, 0.0, 2.0, 1.0); return; }
    } else {
      if (szPx < uMinPx) { gl_Position = vec4(0.0, 0.0, 2.0, 1.0); return; }
      vColor.a *= smoothstep(uMinPx, uMinPx * 2.0, szPx);
    }
  }
  vec2 majorAxis = a1 * dvec;
  vec2 minorAxis = a2 * vec2(dvec.y, -dvec.x);
  // EXTENT-AWARE frustum cull (x/y only): skip a splat only when its screen AABB —
  // centre ± projected half-extent — is fully outside NDC, so a big splat near a screen
  // edge (or that you're standing next to) isn't culled just because its centre left the
  // frustum. Near/far are handled by the GPU's per-fragment clip on gl_Position.z.
  vec2 ext = (abs(majorAxis) + abs(minorAxis)) / uViewport * 2.0;
  if (abs(vCenter.x) - ext.x > 1.0 || abs(vCenter.y) - ext.y > 1.0) {
    gl_Position = vec4(0.0, 0.0, 2.0, 1.0); return;
  }
${SH_EVAL}
  vec2 offset = (position.x * majorAxis + position.y * minorAxis) / uViewport * 2.0;
  gl_Position = vec4(vCenter + offset, ndcZ, 1.0);`;

export const VERT = /* glsl */ `${DECL}
uniform highp sampler2D texCenter, texCovA, texCovB;
uniform sampler2D texColor;
uniform highp usampler2D texSH;   // RGBA32UI: 9 SH bytes packed into one texel
void main() {
  int idx = int(aSlot);
  ivec2 loc = ivec2(idx % uTexW, idx / uTexW);
  vec3 center = texelFetch(texCenter, loc, 0).xyz;
  vec3 ca = texelFetch(texCovA, loc, 0).xyz; // xx,xy,xz
  vec3 cb = texelFetch(texCovB, loc, 0).xyz; // yy,yz,zz
  vColor = texelFetch(texColor, loc, 0);
  mat3 Vrk = mat3(ca.x, ca.y, ca.z,  ca.y, cb.x, cb.y,  ca.z, cb.y, cb.z);
${EWA}
}`;

export const FRAG = /* glsl */ `
precision highp float;
precision highp int;   // must match the vertex stage or shared-uniform link fails → black
in vec2 vPos;
in vec4 vColor;
out vec4 fragColor;
void main() {
  float A = -dot(vPos, vPos);
  if (A < -4.0) discard;
  float B = exp(A) * vColor.a;
  fragColor = vec4(B * vColor.rgb, B); // premultiplied
}`;

// ---- geometry + material -------------------------------------------------------------------

// instanced splat quad: 4 unique corners + a 6-index list (2 tris). Indexed → the GPU vertex
// cache reuses the 2 shared corners (~33% fewer VS invocations).
const QUAD4 = [-2, -2, 0, 2, -2, 0, 2, 2, 0, -2, 2, 0];
const QUAD_IDX = [0, 1, 2, 0, 2, 3];
export function mkQuadGeo() {
  const g = new THREE.InstancedBufferGeometry();
  g.setAttribute("position", new THREE.Float32BufferAttribute(QUAD4, 3));
  g.setIndex(QUAD_IDX);
  return g;
}

/** The shared splat material: premultiplied "over", depth-TESTED against the borrowed BIM depth
 * (reversed-Z, three auto-inverts LessEqual→GreaterEqual at GL level), never writing depth.
 * DoubleSide because the EWA offset can flip quad winding. The four data textures + frame
 * uniforms are passed in so both renderers wire their own DataTextures/uniform objects. */
/** 1×1 placeholder for `texSH` on datasets without spherical harmonics. GLSL needs every sampler
 * bound even when the branch that reads it never runs, and an unbound one samples as black on some
 * drivers and warns on others — cheaper to hand it one dead texel. It must be an INTEGER texture:
 * `usampler2D` bound to a normalized texture is an incomplete-texture error, not a silent read. */
let _dummySH: THREE.DataTexture | null = null;
function dummyShTexture(): THREE.DataTexture {
  if (!_dummySH) {
    _dummySH = new THREE.DataTexture(
      new Uint32Array(4), 1, 1, THREE.RGBAIntegerFormat, THREE.UnsignedIntType,
    );
    _dummySH.internalFormat = "RGBA32UI";
    _dummySH.minFilter = _dummySH.magFilter = THREE.NearestFilter;
    _dummySH.colorSpace = THREE.NoColorSpace;
    _dummySH.needsUpdate = true;
  }
  return _dummySH;
}

export function mkSplatMaterial(uniforms: {
  texCenter: THREE.Texture;
  texCovA: THREE.Texture;
  texCovB: THREE.Texture;
  texColor: THREE.Texture;
  /** Degree-1 SH coefficients (3 RGB texels/splat). Omit for a flat-colour dataset. */
  texSH?: THREE.Texture;
  /** Coefficient bands present in `texSH`; 0 (the default) skips the SH branch entirely. */
  shBands?: number;
  uViewport: { value: THREE.Vector2 };
  uFocal: { value: THREE.Vector2 };
  uMinPx: { value: number };
  uOrtho: { value: number };
}) {
  // Under WebGPU there is no driver to hand GLSL to, so the SAME material is built from nodes
  // instead — same uniform names, same uniform objects, same geometry, same blend. The switch is
  // whether `SplatLoader` has resolved `three/tsl`, which it only does for a WebGPU renderer.
  if (webgpuSplatsReady()) return createWebgpuSplatMaterial(uniforms) as any;
  return new THREE.RawShaderMaterial({
    glslVersion: THREE.GLSL3,
    vertexShader: VERT,
    fragmentShader: FRAG,
    side: THREE.DoubleSide,
    transparent: true,
    depthTest: true,
    depthWrite: false,
    depthFunc: THREE.LessEqualDepth,
    blending: THREE.CustomBlending,
    blendEquation: THREE.AddEquation,
    blendSrc: THREE.OneFactor,
    blendDst: THREE.OneMinusSrcAlphaFactor,
    uniforms: {
      texCenter: { value: uniforms.texCenter },
      texCovA: { value: uniforms.texCovA },
      texCovB: { value: uniforms.texCovB },
      texColor: { value: uniforms.texColor },
      texSH: { value: uniforms.texSH ?? dummyShTexture() },
      // Mutated live by the renderers: uCamLocal every frame, uShStrength from the quality UI.
      // uShRange must stay the inverse of the encoder's SH_RANGE_MIN/MAX (core fq-codec.ts).
      uShBands: { value: uniforms.shBands ?? 0 },
      uShStrength: { value: 1 },
      uShMaxDist: { value: 0 },
      uShRange: { value: new THREE.Vector2(4, -2) },
      uCamLocal: { value: new THREE.Vector3() },
      uTexW: { value: TEX_W },
      uViewport: uniforms.uViewport,
      uFocal: uniforms.uFocal,
      uMinPx: uniforms.uMinPx,
      uSubPixel: { value: 0 },
      uSubMinA: { value: 0.1 },
      uOrtho: uniforms.uOrtho,
      // Section clipping (view-space planes), updated per-frame by the loader. The pick
      // depth material shares this uniforms object by reference, so picks clip too.
      uCutPlanes: { value: Array.from({ length: 8 }, () => new THREE.Vector4()) },
      uNumClip: { value: 0 },
    },
  });
}

/**
 * The PICK depth-pack fragment for splats. Same EWA vertex stage (so each splat
 * lands at the SAME reversed-Z centre depth as the display splats), but instead of
 * blending premultiplied colour it computes the gaussian coverage `B` exactly like
 * {@link FRAG} and `discard`s the faint tails (`B < 0.5`), leaving only the SOLID
 * front surface of each gaussian to write depth. The kept fragments pack
 * `gl_FragCoord.z` via the picker's shared `packBody` (which declares
 * `vec4 packedDepth`), so the packed value decodes identically to the BIM depth.
 *
 * `depthWrite:true` here (unlike the display material) so splats depth-test against
 * one another and against BIM — nearest surface wins the read-back pixel — WITHOUT
 * needing the display sort. This is a separate material used ONLY in the pick pass,
 * so it never disturbs the on-screen render.
 */
export function splatDepthFrag(packBody: string): string {
  return /* glsl */ `
precision highp float;
precision highp int;
in vec2 vPos;
in vec4 vColor;
out vec4 fragColor;
void main() {
  float A = -dot(vPos, vPos);
  if (A < -4.0) discard;
  float B = exp(A) * vColor.a;
  if (B < 0.5) discard;              // front solid surface only — drop the faint tails
  ${packBody}
  fragColor = packedDepth;
}`;
}

/**
 * Build the splat PICK depth-pack material: the shared EWA {@link VERT} + the
 * discard-then-pack {@link splatDepthFrag}. Shares the display material's uniform
 * OBJECTS by reference (textures + per-frame uViewport/uFocal/uMinPx) so the depth
 * surface tracks exactly what's drawn. `depthTest:true, depthWrite:true`.
 */
export function mkSplatDepthMaterial(
  uniforms: { [name: string]: THREE.IUniform },
  packBody: string,
) {
  return new THREE.RawShaderMaterial({
    glslVersion: THREE.GLSL3,
    vertexShader: VERT,
    fragmentShader: splatDepthFrag(packBody),
    side: THREE.DoubleSide,
    transparent: false,
    depthTest: true,
    depthWrite: true,
    depthFunc: THREE.LessEqualDepth, // three auto-inverts to GreaterEqual under reversed-Z
    uniforms,
  });
}

// ---- covariance ----------------------------------------------------------------------------

// 3D covariance Σ = M Mᵀ, M = R(quat)·diag(scale). Writes the upper triangle into two
// caller-supplied RGBA buffers (4 floats/splat, only xyz used) at row-offset `dst` (in splats),
// so a streamed chunk can be baked straight into its slab region. covA = xx,xy,xz; covB = yy,yz,zz.
export function buildCovarianceInto(
  scales: Float32Array,
  quats: Float32Array,
  n: number,
  covA: Float32Array,
  covB: Float32Array,
  dst = 0,
) {
  for (let i = 0; i < n; i++) {
    const sx = scales[i * 3], sy = scales[i * 3 + 1], sz = scales[i * 3 + 2];
    const x = quats[i * 4], y = quats[i * 4 + 1], z = quats[i * 4 + 2], w = quats[i * 4 + 3];
    const r0x = 1 - 2 * (y * y + z * z), r0y = 2 * (x * y + w * z), r0z = 2 * (x * z - w * y);
    const r1x = 2 * (x * y - w * z), r1y = 1 - 2 * (x * x + z * z), r1z = 2 * (y * z + w * x);
    const r2x = 2 * (x * z + w * y), r2y = 2 * (y * z - w * x), r2z = 1 - 2 * (x * x + y * y);
    const m0x = r0x * sx, m0y = r0y * sx, m0z = r0z * sx;
    const m1x = r1x * sy, m1y = r1y * sy, m1z = r1z * sy;
    const m2x = r2x * sz, m2y = r2y * sz, m2z = r2z * sz;
    const o = (dst + i) * 4;
    covA[o] = m0x * m0x + m1x * m1x + m2x * m2x;
    covA[o + 1] = m0x * m0y + m1x * m1y + m2x * m2y;
    covA[o + 2] = m0x * m0z + m1x * m1z + m2x * m2z;
    covB[o] = m0y * m0y + m1y * m1y + m2y * m2y;
    covB[o + 1] = m0y * m0z + m1y * m1z + m2y * m2z;
    covB[o + 2] = m0z * m0z + m1z * m1z + m2z * m2z;
  }
}

/** Convenience: build covariance for `n` splats into freshly-allocated buffers (`textureLength` rows). */
export function buildCovariance(scales: Float32Array, quats: Float32Array, n: number, textureLength: number) {
  const covA = new Float32Array(textureLength * 4);
  const covB = new Float32Array(textureLength * 4);
  buildCovarianceInto(scales, quats, n, covA, covB, 0);
  return { covA, covB };
}
