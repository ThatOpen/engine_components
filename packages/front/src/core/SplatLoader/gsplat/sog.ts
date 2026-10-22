// SOG format loader (meta.json + lossless WebP textures). We upload the WebP ImageBitmaps
// directly as GL textures and unpack in the vertex shader — a 2D-canvas readback would
// un-premultiply alpha and corrupt the sh0 color indices. Centers are ALSO decoded on the CPU
// (good enough for the depth-sort worker). Spec: FORMAT-SPEC.md §B. SH (shN) is ignored.

import type { SplatData } from "./ply";

export interface SOGData {
  count: number;
  meansMin: [number, number, number];
  meansMax: [number, number, number];
  scalesCodebook: Float32Array;   // 256 (log scale)
  sh0Codebook: Float32Array;      // 256 (f_dc)
  imgs: { meansL: ImageBitmap; meansU: ImageBitmap; scales: ImageBitmap; quats: ImageBitmap; sh0: ImageBitmap };
  width: number; height: number;
  centers: Float32Array;          // N*3, Y-up flipped (for the sort worker)
}

const toArr = (o: any): number[] => Array.isArray(o) ? o : Object.keys(o).sort((a, b) => +a - +b).map(k => o[k]);

async function fetchImg(url: string): Promise<ImageBitmap> {
  const buf = await (await fetch(url)).arrayBuffer();
  return createImageBitmap(new Blob([buf], { type: "image/webp" }), { premultiplyAlpha: "none", colorSpaceConversion: "none" });
}

// decode just the centers (means) on the CPU via a canvas — means' alpha is unused so the
// premultiply roundtrip is harmless here, and the worker only needs approximate depth anyway.
function decodeCenters(meansL: ImageBitmap, meansU: ImageBitmap, mins: number[], maxs: number[], count: number): Float32Array {
  const w = meansL.width, h = meansL.height;
  const cv = new OffscreenCanvas(w, h);
  const ctx = cv.getContext("2d", { willReadFrequently: true })!;
  ctx.drawImage(meansL, 0, 0); const lo = ctx.getImageData(0, 0, w, h).data;
  ctx.clearRect(0, 0, w, h); ctx.drawImage(meansU, 0, 0); const hi = ctx.getImageData(0, 0, w, h).data;
  const centers = new Float32Array(count * 3);
  const dec = (c: number, i: number) => {
    const u16 = (hi[i * 4 + c] << 8) | lo[i * 4 + c];
    const log = mins[c] + (maxs[c] - mins[c]) * (u16 / 65535);
    return Math.sign(log) * (Math.exp(Math.abs(log)) - 1);
  };
  for (let i = 0; i < count; i++) {
    centers[i * 3] = dec(0, i);
    centers[i * 3 + 1] = -dec(1, i); // Y-up flip (180° about X): negate y,z
    centers[i * 3 + 2] = -dec(2, i);
  }
  return centers;
}

export async function loadSOG(baseUrl: string): Promise<SOGData> {
  const meta = await (await fetch(`${baseUrl}/meta.json`)).json();
  const count: number = meta.count;
  const mFiles = toArr(meta.means.files), sFiles = toArr(meta.scales.files), qFiles = toArr(meta.quats.files), cFiles = toArr(meta.sh0.files);
  const [meansL, meansU, scales, quats, sh0] = await Promise.all([
    fetchImg(`${baseUrl}/${mFiles[0]}`), fetchImg(`${baseUrl}/${mFiles[1]}`),
    fetchImg(`${baseUrl}/${sFiles[0]}`), fetchImg(`${baseUrl}/${qFiles[0]}`), fetchImg(`${baseUrl}/${cFiles[0]}`),
  ]);
  const mins = toArr(meta.means.mins), maxs = toArr(meta.means.maxs);
  return {
    count, meansMin: [mins[0], mins[1], mins[2]], meansMax: [maxs[0], maxs[1], maxs[2]],
    scalesCodebook: Float32Array.from(toArr(meta.scales.codebook)),
    sh0Codebook: Float32Array.from(toArr(meta.sh0.codebook)),
    imgs: { meansL, meansU, scales, quats, sh0 }, width: meansL.width, height: meansL.height,
    centers: decodeCenters(meansL, meansU, mins, maxs, count),
  };
}

// ─── Full CPU decode of a SOG folder into SplatData ──────────────────────────
// Unpacks meta.json + lossless WebP textures entirely on the CPU (no GPU), matching the
// authoritative VERT_SOG shader unpack INCLUDING the Y-up flips, so the result lines up with a
// flipToYUp-ed compressed.ply. CRITICAL: textures are decoded via WebCodecs ImageDecoder to get
// raw UN-premultiplied RGBA — a 2D-canvas roundtrip would corrupt the quat "mode" (alpha) and
// the sh0 opacity. Spec: FORMAT-SPEC.md §B.

const unitClamp = (x: number) => (x < 0 ? 0 : x > 1 ? 1 : x);
const SH_C0_SOG = 0.2820948; // SH degree-0 DC factor (matches VERT_SOG)

// Decode a lossless WebP to raw, UN-premultiplied RGBA bytes.
async function decodeWebpRGBA(bytes: ArrayBuffer): Promise<{ data: Uint8Array; width: number; height: number }> {
  const ID = (globalThis as any).ImageDecoder;
  if (ID) {
    // Preferred path: ImageDecoder yields a VideoFrame with no alpha premultiply.
    const dec = new ID({ data: bytes, type: "image/webp" });
    const { image }: any = await dec.decode();          // image is a VideoFrame
    const w = image.displayWidth, h = image.displayHeight;
    const size = image.allocationSize({ format: "RGBA" });
    const out = new Uint8Array(size);
    await image.copyTo(out, { format: "RGBA" });
    image.close?.();
    return { data: out, width: w, height: h };
  }
  // Fallback (no ImageDecoder): createImageBitmap + OffscreenCanvas. Accept the known alpha
  // imprecision here — getImageData un-premultiplies and can perturb alpha by ±1 LSB.
  const bmp = await createImageBitmap(new Blob([bytes], { type: "image/webp" }), {
    premultiplyAlpha: "none", colorSpaceConversion: "none",
  });
  const w = bmp.width, h = bmp.height;
  const cv = new OffscreenCanvas(w, h);
  const ctx = cv.getContext("2d", { willReadFrequently: true })!;
  ctx.drawImage(bmp, 0, 0);
  const data = new Uint8Array(ctx.getImageData(0, 0, w, h).data.buffer.slice(0));
  bmp.close?.();
  return { data, width: w, height: h };
}

// The 5 raw (still-encoded) WebP buffers + the meta scalars a chunk needs, with NO decode done.
// This is the MAIN-THREAD half of the streaming split: fetch happens here (so an app-supplied
// fetcher / requestManager keeps working) and the heavy per-splat decode is handed to the decode
// worker (see decode-worker-src.ts). The buffers are meant to be TRANSFERRED into the worker.
export interface SOGChunkRaw {
  count: number;
  mins: [number, number, number];
  maxs: [number, number, number];
  scalesCodebook: Float32Array;   // 256 (log scale)
  sh0Codebook: Float32Array;      // 256 (f_dc)
  webp: {
    meansL: ArrayBuffer; meansU: ArrayBuffer;
    scales: ArrayBuffer; quats: ArrayBuffer; sh0: ArrayBuffer;
  };
}

// Fetch a SOG chunk's meta.json + its 5 WebP files as ArrayBuffers WITHOUT decoding. Resolves the
// texture URLs exactly as loadSOGChunkData does; the caller (stream.ts) transfers the buffers to a
// decode worker. Kept separate so loadSOGChunkData can reuse it and nothing else breaks.
export async function fetchSOGChunkRaw(
  baseUrl: string,
  fetcher?: (url: string) => Promise<Response>,
): Promise<SOGChunkRaw> {
  const get = fetcher ?? ((u: string) => fetch(u));
  const meta = await (await get(`${baseUrl}/meta.json`)).json();
  const count: number = meta.count;

  const mFiles = toArr(meta.means.files), sFiles = toArr(meta.scales.files);
  const qFiles = toArr(meta.quats.files), cFiles = toArr(meta.sh0.files);
  const fetchBytes = async (file: string | number) => (await get(`${baseUrl}/${file}`)).arrayBuffer();
  const [meansL, meansU, scales, quats, sh0] = await Promise.all([
    fetchBytes(mFiles[0]), fetchBytes(mFiles[1]),
    fetchBytes(sFiles[0]), fetchBytes(qFiles[0]), fetchBytes(cFiles[0]),
  ]);

  const mins = toArr(meta.means.mins), maxs = toArr(meta.means.maxs);
  return {
    count,
    mins: [mins[0], mins[1], mins[2]],
    maxs: [maxs[0], maxs[1], maxs[2]],
    scalesCodebook: Float32Array.from(toArr(meta.scales.codebook)),
    sh0Codebook: Float32Array.from(toArr(meta.sh0.codebook)),
    webp: { meansL, meansU, scales, quats, sh0 },
  };
}

export async function loadSOGChunkData(
  baseUrl: string,
  fetcher?: (url: string) => Promise<Response>,
): Promise<SplatData> {
  const raw = await fetchSOGChunkRaw(baseUrl, fetcher);
  const count = raw.count;

  const [loImg, hiImg, scImg, qImg, cImg] = await Promise.all([
    decodeWebpRGBA(raw.webp.meansL), decodeWebpRGBA(raw.webp.meansU),
    decodeWebpRGBA(raw.webp.scales), decodeWebpRGBA(raw.webp.quats),
    decodeWebpRGBA(raw.webp.sh0),
  ]);
  const lo = loImg.data, hi = hiImg.data, sc = scImg.data, qd = qImg.data, c0 = cImg.data;

  const mins = raw.mins, maxs = raw.maxs;
  const scalesCodebook = raw.scalesCodebook;
  const sh0Codebook = raw.sh0Codebook;

  const centers = new Float32Array(count * 3);
  const scales = new Float32Array(count * 3);
  const quats = new Float32Array(count * 4);
  const colors = new Float32Array(count * 4);
  const S2 = Math.SQRT2;

  for (let i = 0; i < count; i++) {
    const o = i * 4;

    // means: 16-bit per comp from (hi*256 + lo) → log → center, then Y-up flip (negate y,z).
    let cx = 0, cy = 0, cz = 0;
    for (let cc = 0; cc < 3; cc++) {
      const nrm = (hi[o + cc] * 256 + lo[o + cc]) / 65535;
      const logp = mins[cc] + (maxs[cc] - mins[cc]) * nrm;
      const v = Math.sign(logp) * (Math.exp(Math.abs(logp)) - 1);
      if (cc === 0) cx = v; else if (cc === 1) cy = v; else cz = v;
    }
    centers[i * 3] = cx; centers[i * 3 + 1] = -cy; centers[i * 3 + 2] = -cz;

    // scales: codebook lookup by byte index, then exp → linear.
    scales[i * 3] = Math.exp(scalesCodebook[Math.round(sc[o])]);
    scales[i * 3 + 1] = Math.exp(scalesCodebook[Math.round(sc[o + 1])]);
    scales[i * 3 + 2] = Math.exp(scalesCodebook[Math.round(sc[o + 2])]);

    // quats: largest-component mode in alpha; reconstruct (x,y,z,w) then Y-up flip.
    const a = (qd[o] / 255 - 0.5) * S2, b = (qd[o + 1] / 255 - 0.5) * S2, c = (qd[o + 2] / 255 - 0.5) * S2;
    const dd = Math.sqrt(Math.max(0, 1 - (a * a + b * b + c * c)));
    const mode = Math.round((qd[o + 3] / 255) * 255) - 252; // 0..3
    let qx: number, qy: number, qz: number, qw: number;
    if (mode === 0) { qx = a; qy = b; qz = c; qw = dd; }
    else if (mode === 1) { qx = dd; qy = b; qz = c; qw = a; }
    else if (mode === 2) { qx = b; qy = dd; qz = c; qw = a; }
    else { qx = b; qy = c; qz = dd; qw = a; }
    // Y-up flip: (qx,qy,qz,qw) → (qw, -qz, qy, -qx).
    quats[i * 4] = qw; quats[i * 4 + 1] = -qz; quats[i * 4 + 2] = qy; quats[i * 4 + 3] = -qx;

    // color: sh0 codebook DC term → rgb, alpha straight from byte.
    colors[i * 4] = unitClamp(0.5 + SH_C0_SOG * sh0Codebook[Math.round(c0[o])]);
    colors[i * 4 + 1] = unitClamp(0.5 + SH_C0_SOG * sh0Codebook[Math.round(c0[o + 1])]);
    colors[i * 4 + 2] = unitClamp(0.5 + SH_C0_SOG * sh0Codebook[Math.round(c0[o + 2])]);
    colors[i * 4 + 3] = c0[o + 3] / 255;
  }

  return { count, centers, scales, quats, colors };
}
