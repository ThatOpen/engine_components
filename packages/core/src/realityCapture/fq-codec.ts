// Flat-quant node codec ("FQC1") — the CPU-only, GPU-free splat chunk format the cloud
// converter emits and the SplatLoader streams. It is the PlayCanvas compressed.ply body
// (per-256-sub-chunk min/max quantization: pos 11-10-11, log-scale 11-10-11, color 8888,
// rotation 2-10-10-10 largest-component) with the ascii ply header replaced by a tiny
// binary head, so a node is one byte-range-able blob. NO WebP, NO k-means, NO GPU — pure
// integer bit-packing, which is why it runs single-core in a memory-bounded cloud worker.
//
// This module is AGNOSTIC: it takes typed arrays + returns a Uint8Array. No three.js, no
// Node, no platform/infra references. The decode side lives in the loader (SplatLoader/
// gsplat/ply.ts `parseFqChunk`) and MUST stay the exact inverse of the packing here.
//
// Layout (all little-endian):
//   0  : "FQC1"                          magic (4 bytes)
//   4  : uint32  numSplats
//   8  : uint32  numSubChunks            = ceil(numSplats / 256)
//   12 : float32[numSubChunks * 18]      per-sub-chunk bounds, order:
//          [minX,minY,minZ, maxX,maxY,maxZ,                 // position (linear)
//           minLsX,minLsY,minLsZ, maxLsX,maxLsY,maxLsZ,     // scale (LOG, clamped [-20,20])
//           minR,minG,minB, maxR,maxG,maxB]                 // color (rgb, 0..1)
//   .. : uint32[numSplats * 4]           packed (position, rotation, scale, color)

/** One batch of splats to encode. Scales are LINEAR world-space stddevs, quats are (x,y,z,w),
 * colors are rgba in 0..1 — the exact post-parse form the loader renders (see ply.ts). */
export interface SplatBatch {
  count: number;
  centers: Float32Array; // count * 3
  scales: Float32Array; // count * 3, LINEAR
  quats: Float32Array; // count * 4, (x,y,z,w)
  colors: Float32Array; // count * 4, (r,g,b,a) 0..1
}

export const FQ_MAGIC = "FQC1";
export const SH_MAGIC = "SHQ1";
/** Monochrome variant: one coefficient per basis instead of three (see packShChunkMono). It gets
 * its OWN magic on purpose — a reader that doesn't know it rejects the sidecar on the magic check
 * and renders flat, which is a safe fallback, rather than misreading a third of the data. */
export const SH_MAGIC_MONO = "SHQM";
// Fixed dequant range for the SH rest coefficients. Trained 3DGS f_rest values sit well inside
// ±2 (they are pre-C1 coefficients, and C1 ≈ 0.489 scales them down again), so a FIXED range
// beats per-sub-chunk bounds here: the GPU texture is 8-bit anyway, so file-side bounds would
// only buy accuracy the texture immediately throws away — and a fixed range makes the decode a
// straight byte copy instead of a per-splat lerp. Step = 4/255 ≈ 0.0157 → ≈0.008 of colour.
export const SH_RANGE_MIN = -2;
export const SH_RANGE_MAX = 2;
const SUB = 256; // sub-chunk size — MUST match the decoder's `Math.floor(i / 256)`
const CSTRIDE = 18; // floats per sub-chunk bound record
const LOG_MIN = -20;
const JOURNAL_CAP = 20;

// round-to-nearest unsigned normalized integer in `bits` bits (inverse of ply.ts `un`).
const packUnorm = (v: number, bits: number) => {
  const max = (1 << bits) - 1;
  const q = Math.round(v * max);
  return q < 0 ? 0 : q > max ? max : q;
};
const clamp = (v: number, lo: number, hi: number) => (v < lo ? lo : v > hi ? hi : v);
// normalize into [0,1] over [lo,hi]; a zero-width range collapses to 0 (decode → lerp gives lo).
const norm = (v: number, lo: number, hi: number) => (hi > lo ? (v - lo) / (hi - lo) : 0);

/** Encode a batch (any count) into one FQC1 blob. */
export function packFqChunk(batch: SplatBatch): Uint8Array {
  const { count, centers, scales, quats, colors } = batch;
  const numSub = Math.ceil(count / SUB) || 0;

  const leadingBytes = 12 + numSub * CSTRIDE * 4;
  const out = new ArrayBuffer(leadingBytes + count * 16);
  const dv = new DataView(out);
  const u8 = new Uint8Array(out);
  u8[0] = 0x46; u8[1] = 0x51; u8[2] = 0x43; u8[3] = 0x31; // "FQC1"
  dv.setUint32(4, count, true);
  dv.setUint32(8, numSub, true);

  const bounds = new Float32Array(numSub * CSTRIDE);

  // Pass 1: per-sub-chunk min/max (position linear, scale in log space, color rgb).
  for (let s = 0; s < numSub; s++) {
    const start = s * SUB;
    const end = Math.min(start + SUB, count);
    let mnx = Infinity, mny = Infinity, mnz = Infinity, mxx = -Infinity, mxy = -Infinity, mxz = -Infinity;
    let msx = Infinity, msy = Infinity, msz = Infinity, Msx = -Infinity, Msy = -Infinity, Msz = -Infinity;
    let mnr = Infinity, mng = Infinity, mnb = Infinity, mxr = -Infinity, mxg = -Infinity, mxb = -Infinity;
    for (let i = start; i < end; i++) {
      const p = i * 3, c = i * 4;
      const x = centers[p], y = centers[p + 1], z = centers[p + 2];
      if (x < mnx) mnx = x; if (x > mxx) mxx = x;
      if (y < mny) mny = y; if (y > mxy) mxy = y;
      if (z < mnz) mnz = z; if (z > mxz) mxz = z;
      const lsx = clamp(Math.log(scales[p]), LOG_MIN, JOURNAL_CAP);
      const lsy = clamp(Math.log(scales[p + 1]), LOG_MIN, JOURNAL_CAP);
      const lsz = clamp(Math.log(scales[p + 2]), LOG_MIN, JOURNAL_CAP);
      if (lsx < msx) msx = lsx; if (lsx > Msx) Msx = lsx;
      if (lsy < msy) msy = lsy; if (lsy > Msy) Msy = lsy;
      if (lsz < msz) msz = lsz; if (lsz > Msz) Msz = lsz;
      const r = colors[c], g = colors[c + 1], b = colors[c + 2];
      if (r < mnr) mnr = r; if (r > mxr) mxr = r;
      if (g < mng) mng = g; if (g > mxg) mxg = g;
      if (b < mnb) mnb = b; if (b > mxb) mxb = b;
    }
    const o = s * CSTRIDE;
    bounds[o] = mnx; bounds[o + 1] = mny; bounds[o + 2] = mnz;
    bounds[o + 3] = mxx; bounds[o + 4] = mxy; bounds[o + 5] = mxz;
    bounds[o + 6] = msx; bounds[o + 7] = msy; bounds[o + 8] = msz;
    bounds[o + 9] = Msx; bounds[o + 10] = Msy; bounds[o + 11] = Msz;
    bounds[o + 12] = mnr; bounds[o + 13] = mng; bounds[o + 14] = mnb;
    bounds[o + 15] = mxr; bounds[o + 16] = mxg; bounds[o + 17] = mxb;
  }
  for (let i = 0; i < bounds.length; i++) dv.setFloat32(12 + i * 4, bounds[i], true);

  // Pass 2: per-splat packing against its sub-chunk bounds.
  let off = leadingBytes;
  for (let i = 0; i < count; i++) {
    const p = i * 3, q = i * 4;
    const b = Math.floor(i / SUB) * CSTRIDE;

    const pp =
      ((packUnorm(norm(centers[p], bounds[b], bounds[b + 3]), 11) << 21) |
        (packUnorm(norm(centers[p + 1], bounds[b + 1], bounds[b + 4]), 10) << 11) |
        packUnorm(norm(centers[p + 2], bounds[b + 2], bounds[b + 5]), 11)) >>> 0;

    const lsx = clamp(Math.log(scales[p]), LOG_MIN, JOURNAL_CAP);
    const lsy = clamp(Math.log(scales[p + 1]), LOG_MIN, JOURNAL_CAP);
    const lsz = clamp(Math.log(scales[p + 2]), LOG_MIN, JOURNAL_CAP);
    const ps =
      ((packUnorm(norm(lsx, bounds[b + 6], bounds[b + 9]), 11) << 21) |
        (packUnorm(norm(lsy, bounds[b + 7], bounds[b + 10]), 10) << 11) |
        packUnorm(norm(lsz, bounds[b + 8], bounds[b + 11]), 11)) >>> 0;

    const pc =
      ((packUnorm(norm(colors[q], bounds[b + 12], bounds[b + 15]), 8) << 24) |
        (packUnorm(norm(colors[q + 1], bounds[b + 13], bounds[b + 16]), 8) << 16) |
        (packUnorm(norm(colors[q + 2], bounds[b + 14], bounds[b + 17]), 8) << 8) |
        packUnorm(clamp(colors[q + 3], 0, 1), 8)) >>> 0;

    const pr = packRotation(quats[q], quats[q + 1], quats[q + 2], quats[q + 3]);

    dv.setUint32(off, pp, true);
    dv.setUint32(off + 4, pr, true);
    dv.setUint32(off + 8, ps, true);
    dv.setUint32(off + 12, pc, true);
    off += 16;
  }

  return u8;
}

// ── SHQ1: the optional spherical-harmonics SIDECAR ──────────────────────────────────────────
//
// FQC1 bakes colour flat (SH degree 0 / the DC term only), so a splat looks the same from every
// angle — that is the "loses detail vs SuperSplat" feedback: what's missing is the VIEW-DEPENDENT
// part (specular highlights, sheen on glass and polished floors), which lives in the higher SH
// bands the source .ply carries as `f_rest_*`.
//
// Those bands are big: degree 1 is 9 more coefficients per splat, degree 3 is 45 — against the
// 16 bytes/splat FQC1 spends in TOTAL. So they go in a SEPARATE file per node rather than inline:
//   - existing datasets keep working untouched (no format bump, no reconversion),
//   - the viewer streams the sidecar only when the user asks for that detail level,
//   - a node's base geometry still arrives in one byte-range-able blob.
//
// Layout (little-endian). No bounds table: see SH_RANGE_MIN/MAX above.
//   0  : "SHQ1"                       magic (4 bytes)
//   4  : uint32  numSplats            MUST equal the paired .fq node's count, same splat order
//   8  : uint32  bands                1 = degree 1 (3 basis × rgb = 9 coeffs/splat)
//   12 : float32 rangeMin
//   16 : float32 rangeMax
//   20 : uint8[numSplats * 9]         basis-major, rgb interleaved:
//          b1r,b1g,b1b, b2r,b2g,b2b, b3r,b3g,b3b
//
// The byte order is exactly the GPU texel order the loader wants (3 RGB texels per splat), so
// decoding is a copy with alpha padding — no per-splat math. Keep it that way.

/** Coefficients per splat at a given band count. Degree 1 only, for now. `mono` keeps ONE value
 * per basis instead of one per colour channel. */
export const shCoeffCount = (bands: number, mono = false) => (bands >= 1 ? (mono ? 3 : 9) : 0);

/** Quantize one SH rest coefficient to a byte against the fixed range. */
export const packShCoeff = (v: number) =>
  packUnorm(norm(v, SH_RANGE_MIN, SH_RANGE_MAX), 8);

/** Wrap ALREADY-QUANTIZED coefficients (`count * shCoeffCount(bands)` bytes, in the layout above)
 * in the SHQ1 head. The encoder quantizes at PLY-parse time so the full-resolution float
 * coefficients never have to be held in memory — 9 bytes/splat instead of 36. */
export function packShChunk(harmonicWeights: Uint8Array, count: number, bands = 1, mono = false): Uint8Array {
  const per = shCoeffCount(bands, mono);
  if (harmonicWeights.length < count * per) {
    throw new Error(`packShChunk: got ${harmonicWeights.length} bytes, need ${count * per}`);
  }
  const out = new Uint8Array(20 + count * per);
  const dv = new DataView(out.buffer);
  const magic = mono ? SH_MAGIC_MONO : SH_MAGIC;
  for (let i = 0; i < 4; i += 1) out[i] = magic.charCodeAt(i);
  dv.setUint32(4, count, true);
  dv.setUint32(8, bands, true);
  dv.setFloat32(12, SH_RANGE_MIN, true);
  dv.setFloat32(16, SH_RANGE_MAX, true);
  out.set(harmonicWeights.subarray(0, count * per), 20);
  return out;
}

// 2-10-10-10 largest-component quaternion pack — the EXACT inverse of ply.ts
// `parseCompressedPly` (tag 0=w,1=x,2=y,3=z largest; stored triples per that table).
// NOTE: this convention differs from PlayCanvas's own packer (0=x..3=w); do not copy theirs.
const INV_SQRT2 = 1 / Math.SQRT2;
function packRotation(x: number, y: number, z: number, w: number): number {
  // normalize
  const len = Math.hypot(x, y, z, w) || 1;
  x /= len; y /= len; z /= len; w /= len;
  // largest |component| → tag; then sign-flip whole quat so that component is positive
  // (decode reconstructs it as +sqrt(1-...), so the stored triple must assume it positive).
  const ax = Math.abs(x), ay = Math.abs(y), az = Math.abs(z), aw = Math.abs(w);
  let tag: number, big: number, a: number, b: number, c: number;
  if (aw >= ax && aw >= ay && aw >= az) { tag = 0; big = w; a = x; b = y; c = z; }
  else if (ax >= ay && ax >= az) { tag = 1; big = x; a = w; b = y; c = z; }
  else if (ay >= az) { tag = 2; big = y; a = w; b = x; c = z; }
  else { tag = 3; big = z; a = w; b = x; c = y; }
  if (big < 0) { a = -a; b = -b; c = -c; }
  // each stored component f ∈ [-1/√2, 1/√2] → u = f/√2 + 0.5 ∈ [0,1], 10-bit unorm
  const ua = packUnorm(a * INV_SQRT2 + 0.5, 10);
  const ub = packUnorm(b * INV_SQRT2 + 0.5, 10);
  const uc = packUnorm(c * INV_SQRT2 + 0.5, 10);
  return ((tag << 30) | (ua << 20) | (ub << 10) | uc) >>> 0;
}
