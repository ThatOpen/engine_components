// The splat DECODE worker, inlined as a SOURCE STRING so it can be instantiated from a Blob URL
// (`new Worker(URL.createObjectURL(new Blob([DECODE_WORKER_SRC])))`) — same rationale as
// `sort-worker-src.ts`: a published library can't assume any bundler-specific worker-asset path.
//
// It moves the HEAVY per-splat decode (means/scales/quats/colours), the 3D-covariance build and
// the float32→float16 quantization OFF the main render thread. The main thread only does the
// network fetch (so an app-supplied fetcher/requestManager keeps working) and the final memcpy +
// GPU upload.
//
// TWO node formats share the SAME output tail (`emitSlab`: Y-up flip + covariance Σ = M Mᵀ +
// half-quant + slab writes), differing only in how a node's bytes are decoded to per-splat
// (center, linear scale, xyzw quat, rgba) BEFORE the flip:
//   - "decode"   → SOG (per-node WebP + codebooks); math identical to `loadSOGChunkData` (sog.ts)
//   - "decodeFQ" → FQC1 flat-quant blob; math identical to `parseFqChunk` (ply.ts) / fq-codec.ts
// `emitSlab` MUST stay byte-for-byte identical to `buildCovarianceInto` (shaders.ts) + the SOG
// Y-up flips + `THREE.DataUtils.toHalfFloat` (reproduced inline as `toHalf`), or it renders WRONG.
//
// Protocol OUT (both): { type:'decoded', file, count,
//   center :Float32Array(count*4)  // RGBA: xyz + 0 pad → slab _bufCenter
//   covA   :Uint16Array(count*4)   // RGBA half: xx,xy,xz + 0
//   covB   :Uint16Array(count*4)   // RGBA half: yy,yz,zz + 0
//   color  :Uint8Array(count*4)    // RGBA u8
//   centers:Float32Array(count*3)  // xyz-only → the sort worker
//   sh     :Uint32Array(count*4)|null // one RGBA32UI texel/splat: degree-1 SH, when a sidecar came
// } (every non-null buffer transferred)
//
// Plain JS (no imports / no TS types) so it runs verbatim as a classic worker.
export const DECODE_WORKER_SRC = /* js */ `
const clamp01 = (x) => (x < 0 ? 0 : x > 1 ? 1 : x);
const SH_C0_SOG = 0.2820948; // SH degree-0 DC factor (matches VERT_SOG / loadSOGChunkData)

// float32 → float16 (half). Standard bit-twiddle via aliased Float32/Uint32 views. Reproduces
// THREE.DataUtils.toHalfFloat exactly (round-to-nearest-even, subnormals, Inf/NaN).
const _f32 = new Float32Array(1);
const _u32 = new Uint32Array(_f32.buffer);
function toHalf(val) {
  _f32[0] = val;
  const x = _u32[0];
  const bits = (x >> 16) & 0x8000;
  let m = (x >> 12) & 0x07ff;
  const e = (x >> 23) & 0xff;
  if (e < 103) return bits;
  if (e > 142) {
    let out = bits | 0x7c00;
    out |= (e === 255 ? 0 : 1) && (x & 0x007fffff);
    return out;
  }
  if (e < 113) {
    m |= 0x0800;
    return bits | ((m >> (114 - e)) + ((m >> (113 - e)) & 1));
  }
  let out = bits | ((e - 112) << 10) | (m >> 1);
  out += m & 1;
  return out;
}

// Decode a lossless WebP ArrayBuffer to raw, UN-premultiplied RGBA bytes. Preferred path is
// WebCodecs ImageDecoder (workers support it) — a 2D-canvas roundtrip would un-premultiply and
// perturb the quat "mode" (alpha) + sh0 opacity by ±1 LSB. Same logic as sog.ts decodeWebpRGBA.
async function decodeWebpRGBA(bytes) {
  const ID = self.ImageDecoder;
  if (ID) {
    const dec = new ID({ data: bytes, type: "image/webp" });
    const res = await dec.decode();
    const image = res.image; // a VideoFrame
    const w = image.displayWidth, h = image.displayHeight;
    const size = image.allocationSize({ format: "RGBA" });
    const out = new Uint8Array(size);
    await image.copyTo(out, { format: "RGBA" });
    if (image.close) image.close();
    return { data: out, width: w, height: h };
  }
  const bmp = await createImageBitmap(new Blob([bytes], { type: "image/webp" }), {
    premultiplyAlpha: "none", colorSpaceConversion: "none",
  });
  const w = bmp.width, h = bmp.height;
  const cv = new OffscreenCanvas(w, h);
  const ctx = cv.getContext("2d", { willReadFrequently: true });
  ctx.drawImage(bmp, 0, 0);
  const data = new Uint8Array(ctx.getImageData(0, 0, w, h).data.buffer.slice(0));
  if (bmp.close) bmp.close();
  return { data, width: w, height: h };
}

// Allocate the OUT slab arrays for a node of \`count\` splats. \`withSh\` also allocates the
// spherical-harmonics slab: ONE RGBA32UI texel per splat (4 uint32) holding all 9 coefficients.
function allocOut(count, withSh) {
  return {
    center: new Float32Array(count * 4),   // xyz + 0 pad
    covA: new Uint16Array(count * 4),       // half xx,xy,xz + 0
    covB: new Uint16Array(count * 4),       // half yy,yz,zz + 0
    color: new Uint8Array(count * 4),       // RGBA u8
    centers: new Float32Array(count * 3),   // xyz-only for the sort worker
    sh: withSh ? new Uint32Array(count * 4) : null,
  };
}

// SHQ1 sidecar → the texSH slab layout. Positional: splat i of the .sh IS splat i of the .fq.
//
// The 9 file bytes (basis-major, rgb interleaved) pack into ONE texel: x/y/z each carry one
// basis's r,g,b in their low three bytes, w spare. It used to be 3 RGB texels, which cost the
// vertex shader 3 fetches — and the quad has 4 vertices, so 12 lookups per splat. The FILE layout
// is untouched by this, so datasets converted before the change still load.
//
// Returns false when the sidecar doesn't match the node: a mismatched pair would tint splats with
// a neighbour's coefficients, so drop it and render flat rather than render wrong.
// Two magics: "SHQ1" carries r,g,b per basis; "SHQM" carries ONE value per basis, which is
// replicated across r,g,b right here. Doing the replication in the worker keeps the shader and the
// texture layout identical for both, so mono is purely a transport saving (9 -> 3 bytes/splat).
function expandSh(o, count, shBytes) {
  if (!o.sh || !shBytes) return false;
  const dv = new DataView(shBytes);
  const magic = dv.getUint32(0, false);
  const mono = magic === 0x5348514d; // "SHQM"
  if (!mono && magic !== 0x53485131) return false; // "SHQ1"
  if (dv.getUint32(4, true) !== count) return false;
  const per = mono ? 3 : 9;
  const src = new Uint8Array(shBytes, 20);
  if (src.length < count * per) return false;
  const dst = o.sh;
  for (let i = 0; i < count; i++) {
    const s = i * per, d = i * 4;
    if (mono) {
      const v0 = src[s], v1 = src[s + 1], v2 = src[s + 2];
      dst[d] = (v0 | (v0 << 8) | (v0 << 16)) >>> 0;
      dst[d + 1] = (v1 | (v1 << 8) | (v1 << 16)) >>> 0;
      dst[d + 2] = (v2 | (v2 << 8) | (v2 << 16)) >>> 0;
    } else {
      dst[d] = (src[s] | (src[s + 1] << 8) | (src[s + 2] << 16)) >>> 0;
      dst[d + 1] = (src[s + 3] | (src[s + 4] << 8) | (src[s + 5] << 16)) >>> 0;
      dst[d + 2] = (src[s + 6] | (src[s + 7] << 8) | (src[s + 8] << 16)) >>> 0;
    }
    dst[d + 3] = 0;
  }
  return true;
}

// The SHARED output tail. Inputs are per-splat, PRE Y-up flip: center (cx,cy,cz), LINEAR scale
// (sx,sy,sz), quat (qx,qy,qz,qw), colour (r,g,b,a in 0..1). Applies the 180°-about-X Y-up flip
// (negate y,z; quat (qx,qy,qz,qw) → (qw,-qz,qy,-qx)), builds covariance Σ = M Mᵀ (M = R·diag(s)),
// half-quantizes it, and writes center/covA/covB/color/centers at index i.
function emitSlab(o, i, cx, cy, cz, sx, sy, sz, qx, qy, qz, qw, r, g, b, a) {
  const co = i * 4, ce = i * 3;
  const fx = cx, fy = -cy, fz = -cz;
  o.center[co] = fx; o.center[co + 1] = fy; o.center[co + 2] = fz; o.center[co + 3] = 0;
  o.centers[ce] = fx; o.centers[ce + 1] = fy; o.centers[ce + 2] = fz;
  // Y-up flip: (qx,qy,qz,qw) → (qw, -qz, qy, -qx).
  const rx = qw, ry = -qz, rz = qy, rw = -qx;
  const r0x = 1 - 2 * (ry * ry + rz * rz), r0y = 2 * (rx * ry + rw * rz), r0z = 2 * (rx * rz - rw * ry);
  const r1x = 2 * (rx * ry - rw * rz), r1y = 1 - 2 * (rx * rx + rz * rz), r1z = 2 * (ry * rz + rw * rx);
  const r2x = 2 * (rx * rz + rw * ry), r2y = 2 * (ry * rz - rw * rx), r2z = 1 - 2 * (rx * rx + ry * ry);
  const m0x = r0x * sx, m0y = r0y * sx, m0z = r0z * sx;
  const m1x = r1x * sy, m1y = r1y * sy, m1z = r1z * sy;
  const m2x = r2x * sz, m2y = r2y * sz, m2z = r2z * sz;
  o.covA[co] = toHalf(m0x * m0x + m1x * m1x + m2x * m2x);
  o.covA[co + 1] = toHalf(m0x * m0y + m1x * m1y + m2x * m2y);
  o.covA[co + 2] = toHalf(m0x * m0z + m1x * m1z + m2x * m2z);
  o.covA[co + 3] = 0;
  o.covB[co] = toHalf(m0y * m0y + m1y * m1y + m2y * m2y);
  o.covB[co + 1] = toHalf(m0y * m0z + m1y * m1z + m2y * m2z);
  o.covB[co + 2] = toHalf(m0z * m0z + m1z * m1z + m2z * m2z);
  o.covB[co + 3] = 0;
  o.color[co] = clamp01(r) * 255;
  o.color[co + 1] = clamp01(g) * 255;
  o.color[co + 2] = clamp01(b) * 255;
  o.color[co + 3] = a * 255;
}

function postDecoded(file, count, o, hasSh) {
  const msg = { type: "decoded", file, count,
    center: o.center.buffer, covA: o.covA.buffer, covB: o.covB.buffer,
    color: o.color.buffer, centers: o.centers.buffer, sh: null };
  const transfer = [o.center.buffer, o.covA.buffer, o.covB.buffer, o.color.buffer, o.centers.buffer];
  if (hasSh) { msg.sh = o.sh.buffer; transfer.push(o.sh.buffer); }
  self.postMessage(msg, transfer);
}

// SOG node: 5 WebP images + codebooks → per-splat (pre-flip) → emitSlab.
async function decodeSOG(m) {
  const { file, count, mins, maxs, scalesCodebook, sh0Codebook, webp } = m;
  const [loImg, hiImg, scImg, qImg, cImg] = await Promise.all([
    decodeWebpRGBA(webp.meansL), decodeWebpRGBA(webp.meansU),
    decodeWebpRGBA(webp.scales), decodeWebpRGBA(webp.quats), decodeWebpRGBA(webp.sh0),
  ]);
  const lo = loImg.data, hi = hiImg.data, sc = scImg.data, qd = qImg.data, c0 = cImg.data;
  const o = allocOut(count, false); // SOG carries its own SH bands; not wired up here
  const S2 = Math.SQRT2;
  for (let i = 0; i < count; i++) {
    const p = i * 4;
    // means: 16-bit per comp (hi*256 + lo) → log → center (pre-flip).
    let cx = 0, cy = 0, cz = 0;
    for (let cc = 0; cc < 3; cc++) {
      const nrm = (hi[p + cc] * 256 + lo[p + cc]) / 65535;
      const logp = mins[cc] + (maxs[cc] - mins[cc]) * nrm;
      const v = Math.sign(logp) * (Math.exp(Math.abs(logp)) - 1);
      if (cc === 0) cx = v; else if (cc === 1) cy = v; else cz = v;
    }
    // scales: codebook lookup by byte index, then exp → linear.
    const sx = Math.exp(scalesCodebook[Math.round(sc[p])]);
    const sy = Math.exp(scalesCodebook[Math.round(sc[p + 1])]);
    const sz = Math.exp(scalesCodebook[Math.round(sc[p + 2])]);
    // quats: largest-component mode in alpha; reconstruct (x,y,z,w) (pre-flip).
    const a = (qd[p] / 255 - 0.5) * S2, b = (qd[p + 1] / 255 - 0.5) * S2, c = (qd[p + 2] / 255 - 0.5) * S2;
    const dd = Math.sqrt(Math.max(0, 1 - (a * a + b * b + c * c)));
    const mode = Math.round((qd[p + 3] / 255) * 255) - 252; // 0..3
    let qx, qy, qz, qw;
    if (mode === 0) { qx = a; qy = b; qz = c; qw = dd; }
    else if (mode === 1) { qx = dd; qy = b; qz = c; qw = a; }
    else if (mode === 2) { qx = b; qy = dd; qz = c; qw = a; }
    else { qx = b; qy = c; qz = dd; qw = a; }
    // color: sh0 codebook DC term → rgb (0..1), alpha straight from byte (0..1).
    const r = clamp01(0.5 + SH_C0_SOG * sh0Codebook[Math.round(c0[p])]);
    const g = clamp01(0.5 + SH_C0_SOG * sh0Codebook[Math.round(c0[p + 1])]);
    const bl = clamp01(0.5 + SH_C0_SOG * sh0Codebook[Math.round(c0[p + 2])]);
    const al = c0[p + 3] / 255;
    emitSlab(o, i, cx, cy, cz, sx, sy, sz, qx, qy, qz, qw, r, g, bl, al);
  }
  postDecoded(file, count, o, false);
}

// FQC1 node: one flat-quant blob (see fq-codec.ts / ply.ts parseFqChunk) → per-splat (pre-flip)
// → emitSlab. Header: "FQC1" + uint32 count + uint32 numSubChunks + float32[numSub*18] bounds +
// uint32[count*4] packed (pos 11-10-11, rot 2-10-10-10, scale-log 11-10-11, color 8888).
function decodeFQ(m) {
  const dv = new DataView(m.bytes);
  const N = dv.getUint32(4, true);
  const numSub = dv.getUint32(8, true);
  const cstride = 18;
  const chunk = new Float32Array(numSub * cstride);
  let boff = 12;
  for (let i = 0; i < chunk.length; i++) { chunk[i] = dv.getFloat32(boff, true); boff += 4; }
  const o = allocOut(N, !!m.sh);
  const hasSh = expandSh(o, N, m.sh);
  const un = (v, bits) => (v & ((1 << bits) - 1)) / ((1 << bits) - 1);
  const lerp = (a, b, t) => a + (b - a) * t;
  const S2 = Math.SQRT2;
  let off = boff;
  for (let i = 0; i < N; i++) {
    const pp = dv.getUint32(off, true), pr = dv.getUint32(off + 4, true);
    const ps = dv.getUint32(off + 8, true), pc = dv.getUint32(off + 12, true); off += 16;
    const ci = Math.floor(i / 256) * cstride;
    const cx = lerp(chunk[ci], chunk[ci + 3], un(pp >>> 21, 11));
    const cy = lerp(chunk[ci + 1], chunk[ci + 4], un(pp >>> 11, 10));
    const cz = lerp(chunk[ci + 2], chunk[ci + 5], un(pp, 11));
    const a = (un(pr >>> 20, 10) - 0.5) * S2, b = (un(pr >>> 10, 10) - 0.5) * S2, c = (un(pr, 10) - 0.5) * S2;
    const dd = Math.sqrt(Math.max(0, 1 - (a * a + b * b + c * c)));
    const li = pr >>> 30;
    let qx, qy, qz, qw;
    if (li === 0) { qx = a; qy = b; qz = c; qw = dd; }
    else if (li === 1) { qx = dd; qy = b; qz = c; qw = a; }
    else if (li === 2) { qx = b; qy = dd; qz = c; qw = a; }
    else { qx = b; qy = c; qz = dd; qw = a; }
    const sx = Math.exp(lerp(chunk[ci + 6], chunk[ci + 9], un(ps >>> 21, 11)));
    const sy = Math.exp(lerp(chunk[ci + 7], chunk[ci + 10], un(ps >>> 11, 10)));
    const sz = Math.exp(lerp(chunk[ci + 8], chunk[ci + 11], un(ps, 11)));
    const r = lerp(chunk[ci + 12], chunk[ci + 15], un(pc >>> 24, 8));
    const g = lerp(chunk[ci + 13], chunk[ci + 16], un(pc >>> 16, 8));
    const bl = lerp(chunk[ci + 14], chunk[ci + 17], un(pc >>> 8, 8));
    const al = un(pc, 8);
    emitSlab(o, i, cx, cy, cz, sx, sy, sz, qx, qy, qz, qw, r, g, bl, al);
  }
  postDecoded(m.file, N, o, hasSh);
}

self.onmessage = async (e) => {
  const m = e.data;
  if (m.type === "decode") await decodeSOG(m);
  else if (m.type === "decodeFQ") decodeFQ(m);
};
`;
