// Minimal 3DGS .ply parser (INRIA/binary_little_endian). Decodes the gaussian fields we
// render: center (xyz), scale (exp of stored log), rotation (normalised quaternion), and
// colour+opacity (SH degree-0 DC term + sigmoid opacity). SH rest is skipped for now.

export interface SplatData {
  count: number;
  centers: Float32Array;   // N*3
  scales: Float32Array;    // N*3 (world-space stddevs)
  quats: Float32Array;     // N*4 (x,y,z,w)
  colors: Float32Array;    // N*4 (r,g,b,a) in 0..1
}

const SH_C0 = 0.28209479177387814;
const sigmoid = (x: number) => 1 / (1 + Math.exp(-x));

export function parsePly(buffer: ArrayBuffer): SplatData {
  const bytes = new Uint8Array(buffer);
  // header is ascii up to "end_header\n"
  const headingEnd = findHeaderEnd(bytes);
  const header = new TextDecoder().decode(bytes.subarray(0, headingEnd));
  const lines = header.split(/\r?\n/);

  let count = 0;
  const props: string[] = [];
  for (const ln of lines) {
    const m = ln.match(/^element vertex (\d+)/);
    if (m) count = parseInt(m[1], 10);
    const p = ln.match(/^property float (\S+)/);
    if (p) props.push(p[1]);
  }
  if (!count) throw new Error("no vertices in ply");

  const stride = props.length * 4; // all float32 here
  const off: Record<string, number> = {};
  props.forEach((name, i) => { off[name] = i * 4; });
  const need = (n: string) => { if (!(n in off)) throw new Error(`missing property ${n}`); return off[n]; };

  const atX = need("x"), atY = need("y"), atZ = need("z");
  const oS0 = need("scale_0"), oS1 = need("scale_1"), oS2 = need("scale_2");
  const oR0 = need("rot_0"), oR1 = need("rot_1"), oR2 = need("rot_2"), oR3 = need("rot_3");
  const oOp = need("opacity");
  const oC0 = need("f_dc_0"), oC1 = need("f_dc_1"), oC2 = need("f_dc_2");

  const dv = new DataView(buffer, headingEnd);
  const centers = new Float32Array(count * 3);
  const scales = new Float32Array(count * 3);
  const quats = new Float32Array(count * 4);
  const colors = new Float32Array(count * 4);

  for (let i = 0; i < count; i++) {
    const b = i * stride;
    centers[i * 3] = dv.getFloat32(b + atX, true);
    centers[i * 3 + 1] = dv.getFloat32(b + atY, true);
    centers[i * 3 + 2] = dv.getFloat32(b + atZ, true);

    scales[i * 3] = Math.exp(dv.getFloat32(b + oS0, true));
    scales[i * 3 + 1] = Math.exp(dv.getFloat32(b + oS1, true));
    scales[i * 3 + 2] = Math.exp(dv.getFloat32(b + oS2, true));

    // stored quaternion is (w, x, y, z); three uses (x, y, z, w). Normalise.
    const qw = dv.getFloat32(b + oR0, true);
    const qx = dv.getFloat32(b + oR1, true);
    const qy = dv.getFloat32(b + oR2, true);
    const qz = dv.getFloat32(b + oR3, true);
    const ql = Math.hypot(qw, qx, qy, qz) || 1;
    quats[i * 4] = qx / ql; quats[i * 4 + 1] = qy / ql; quats[i * 4 + 2] = qz / ql; quats[i * 4 + 3] = qw / ql;

    colors[i * 4] = unitClamp(0.5 + SH_C0 * dv.getFloat32(b + oC0, true));
    colors[i * 4 + 1] = unitClamp(0.5 + SH_C0 * dv.getFloat32(b + oC1, true));
    colors[i * 4 + 2] = unitClamp(0.5 + SH_C0 * dv.getFloat32(b + oC2, true));
    colors[i * 4 + 3] = sigmoid(dv.getFloat32(b + oOp, true));
  }

  return { count, centers, scales, quats, colors };
}

function unitClamp(x: number) { return x < 0 ? 0 : x > 1 ? 1 : x; }

// 3DGS/COLMAP plys are Y-down; three.js is Y-up. Rotate the whole scene 180° about X
// (Y→-Y, Z→-Z). A proper rotation (not a mirror), so handedness/covariance stay valid:
// centers negate y,z; orientation quat q → r⊗q with r = 180°-about-X = (1,0,0,0) xyzw,
// which maps (qx,qy,qz,qw) → (qw, -qz, qy, -qx). Mutates in place.
export function flipToYUp(s: SplatData) {
  for (let i = 0; i < s.count; i++) {
    s.centers[i * 3 + 1] = -s.centers[i * 3 + 1];
    s.centers[i * 3 + 2] = -s.centers[i * 3 + 2];
    const qx = s.quats[i * 4], qy = s.quats[i * 4 + 1], qz = s.quats[i * 4 + 2], qw = s.quats[i * 4 + 3];
    s.quats[i * 4] = qw; s.quats[i * 4 + 1] = -qz; s.quats[i * 4 + 2] = qy; s.quats[i * 4 + 3] = -qx;
  }
}

// The compressed.ply format (16 B/splat, bit-packed, CHUNK_SIZE=256). CPU decode into our
// SplatData (centers, linear scales, xyzw quats, rgba 0..1) so it reuses the existing render
// path — proves the bit-unpack before we move it onto the GPU. Spec: FORMAT-SPEC.md §A.
export function parseCompressedPly(buffer: ArrayBuffer): SplatData {
  const bytes = new Uint8Array(buffer);
  const headingEnd = findHeaderEnd(bytes);
  const header = new TextDecoder().decode(bytes.subarray(0, headingEnd));
  const elements: { name: string; count: number; props: string[] }[] = [];
  for (const ln of header.split(/\r?\n/)) {
    const em = ln.match(/^element\s+(\S+)\s+(\d+)/);
    if (em) { elements.push({ name: em[1], count: parseInt(em[2], 10), props: [] }); continue; }
    const pm = ln.match(/^property\s+\S+\s+(\S+)/);
    if (pm && elements.length) elements[elements.length - 1].props.push(pm[1]);
  }
  const chunkEl = elements.find(e => e.name === "chunk");
  const vertEl = elements.find(e => e.name === "vertex");
  if (!chunkEl || !vertEl) throw new Error("not a compressed.ply (missing chunk/vertex element)");
  const cstride = chunkEl.props.length;          // 18 (with color bounds) or 12
  const carriesTint = chunkEl.props.includes("min_r");
  const N = vertEl.count;

  const dv = new DataView(buffer);
  let off = headingEnd;
  const chunk = new Float32Array(chunkEl.count * cstride);
  for (let i = 0; i < chunk.length; i++) { chunk[i] = dv.getFloat32(off, true); off += 4; }

  return unpackChunkPacked(dv, off, N, chunk, cstride, carriesTint);
}

// The shared per-splat bit-unpack for both compressed.ply and our FQC1 node blobs
// (`parseFqChunk`) — they carry the SAME body (256-sub-chunk min/max: pos 11-10-11, log-scale
// 11-10-11, color 8888, rotation 2-10-10-10 largest-component). `chunk` holds all sub-chunk
// bound records (cstride floats each), `bodyOff` is the byte offset of the packed uint32 stream.
function unpackChunkPacked(
  dv: DataView, bodyOff: number, N: number,
  chunk: Float32Array, cstride: number, carriesTint: boolean,
): SplatData {
  const centers = new Float32Array(N * 3);
  const scales = new Float32Array(N * 3);
  const quats = new Float32Array(N * 4);
  const colors = new Float32Array(N * 4);
  const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
  const un = (v: number, bits: number) => (v & ((1 << bits) - 1)) / ((1 << bits) - 1);
  const S2 = Math.SQRT2;

  let off = bodyOff;
  for (let i = 0; i < N; i++) {
    const pp = dv.getUint32(off, true), pr = dv.getUint32(off + 4, true);
    const ps = dv.getUint32(off + 8, true), pc = dv.getUint32(off + 12, true); off += 16;
    const ci = Math.floor(i / 256) * cstride;

    centers[i * 3] = lerp(chunk[ci], chunk[ci + 3], un(pp >>> 21, 11));
    centers[i * 3 + 1] = lerp(chunk[ci + 1], chunk[ci + 4], un(pp >>> 11, 10));
    centers[i * 3 + 2] = lerp(chunk[ci + 2], chunk[ci + 5], un(pp, 11));

    const a = (un(pr >>> 20, 10) - 0.5) * S2, b = (un(pr >>> 10, 10) - 0.5) * S2, c = (un(pr, 10) - 0.5) * S2;
    const m = Math.sqrt(Math.max(0, 1 - (a * a + b * b + c * c)));
    const li = pr >>> 30;
    // largest-component index → (x,y,z,w)
    if (li === 0) { quats[i * 4] = a; quats[i * 4 + 1] = b; quats[i * 4 + 2] = c; quats[i * 4 + 3] = m; }
    else if (li === 1) { quats[i * 4] = m; quats[i * 4 + 1] = b; quats[i * 4 + 2] = c; quats[i * 4 + 3] = a; }
    else if (li === 2) { quats[i * 4] = b; quats[i * 4 + 1] = m; quats[i * 4 + 2] = c; quats[i * 4 + 3] = a; }
    else { quats[i * 4] = b; quats[i * 4 + 1] = c; quats[i * 4 + 2] = m; quats[i * 4 + 3] = a; }

    scales[i * 3] = Math.exp(lerp(chunk[ci + 6], chunk[ci + 9], un(ps >>> 21, 11)));     // log → linear
    scales[i * 3 + 1] = Math.exp(lerp(chunk[ci + 7], chunk[ci + 10], un(ps >>> 11, 10)));
    scales[i * 3 + 2] = Math.exp(lerp(chunk[ci + 8], chunk[ci + 11], un(ps, 11)));

    const rn = un(pc >>> 24, 8), gn = un(pc >>> 16, 8), bn = un(pc >>> 8, 8);
    // clamp to [0,1] like parsePly — packed colors can sit just outside the range, which wraps
    // around (psychedelic speckles) when later quantized to 8-bit.
    colors[i * 4] = unitClamp(carriesTint ? lerp(chunk[ci + 12], chunk[ci + 15], rn) : rn);
    colors[i * 4 + 1] = unitClamp(carriesTint ? lerp(chunk[ci + 13], chunk[ci + 16], gn) : gn);
    colors[i * 4 + 2] = unitClamp(carriesTint ? lerp(chunk[ci + 14], chunk[ci + 17], bn) : bn);
    colors[i * 4 + 3] = un(pc, 8); // opacity already 0..1
  }
  return { count: N, centers, scales, quats, colors };
}

// FQC1 — our flat-quant node blob (see core realityCapture/fq-codec.ts, the exact encoder).
// Same packed body as compressed.ply but header-less: a 12-byte binary head + a float32
// sub-chunk-bounds table (always 18-float/color-bearing records) + the uint32 stream, so a
// node is one byte-range-able file. Decodes into the same SplatData (linear scales, xyzw quats,
// rgba 0..1) the renderer already consumes.
export function parseFqChunk(buffer: ArrayBuffer): SplatData {
  const dv = new DataView(buffer);
  if (dv.getUint32(0, false) !== 0x46514331) throw new Error("not an FQC1 chunk"); // "FQC1"
  const N = dv.getUint32(4, true);
  const numSub = dv.getUint32(8, true);
  const cstride = 18; // FQC1 always carries color bounds
  const chunk = new Float32Array(numSub * cstride);
  let off = 12;
  for (let i = 0; i < chunk.length; i++) { chunk[i] = dv.getFloat32(off, true); off += 4; }
  return unpackChunkPacked(dv, off, N, chunk, cstride, true);
}

// Synthetic debug scene: a few BIG, known, anisotropic splats at the origin so the EWA
// projection is trivially inspectable (orientation, axis ratio, color all known a priori).
// Already in post-parse form (scales = actual stddevs, quat = x,y,z,w, colors = 0..1).
export function makeSynthetic(): SplatData {
  // [cx,cy,cz, sx,sy,sz, rotZdeg, r,g,b,a]
  const defs = [
    [0, 0, 0, 0.40, 0.10, 0.20, 45, 1.0, 0.2, 0.2, 0.95],  // red, elongated, tilted 45°
    [0.9, 0, 0, 0.30, 0.08, 0.08, 0, 0.2, 1.0, 0.2, 0.95], // green, horizontal
    [-0.9, 0, 0, 0.08, 0.30, 0.08, 0, 0.3, 0.5, 1.0, 0.95], // blue, vertical
  ];
  const count = defs.length;
  const centers = new Float32Array(count * 3);
  const scales = new Float32Array(count * 3);
  const quats = new Float32Array(count * 4);
  const colors = new Float32Array(count * 4);
  defs.forEach((d, i) => {
    centers[i * 3] = d[0]; centers[i * 3 + 1] = d[1]; centers[i * 3 + 2] = d[2];
    scales[i * 3] = d[3]; scales[i * 3 + 1] = d[4]; scales[i * 3 + 2] = d[5];
    const h = (d[6] * Math.PI) / 360; // half-angle, rotation about Z
    quats[i * 4] = 0; quats[i * 4 + 1] = 0; quats[i * 4 + 2] = Math.sin(h); quats[i * 4 + 3] = Math.cos(h);
    colors[i * 4] = d[7]; colors[i * 4 + 1] = d[8]; colors[i * 4 + 2] = d[9]; colors[i * 4 + 3] = d[10];
  });
  return { count, centers, scales, quats, colors };
}

function findHeaderEnd(bytes: Uint8Array): number {
  // Find "end_header" then advance past the next newline — handles both \n and \r\n.
  const marker = "end_header";
  const max = Math.min(bytes.length, 1 << 16);
  for (let i = 0; i < max; i++) {
    let ok = true;
    for (let j = 0; j < marker.length; j++) if (bytes[i + j] !== marker.charCodeAt(j)) { ok = false; break; }
    if (ok) {
      let k = i + marker.length;
      while (k < bytes.length && bytes[k] !== 0x0a) k++; // skip \r and anything to the \n
      return k + 1;
    }
  }
  throw new Error("end_header not found");
}
