// LAS (ASPRS) point-cloud reading — the input side of the Potree pipeline
// ({@link buildPotreeOctree} is the output side).
//
// Both readers consume the file as an ASYNC ITERABLE of byte chunks rather than a whole
// buffer, so a multi-GB cloud never has to be resident: the caller feeds a `fetch` body,
// a Node stream, or a File slice, and the decoder carries partial records across chunk
// boundaries itself.
//
// Isomorphic: DataView/Uint8Array only — no Node `Buffer`, no `fs`. The environment-specific
// part (opening the file / issuing the HTTP request) stays with the caller.
//
// Two entry points, for the two shapes of job:
//  - {@link decodeLasStream} materialises every point into typed arrays. Use when the cloud
//    fits in RAM (it allocates ~38 bytes/point) and you want to hand the result straight to
//    {@link buildPotreeOctree}.
//  - {@link streamLasPoints} calls back per point and allocates NOTHING. Use for bounded-memory
//    passes over clouds that do NOT fit in RAM — counting/bounds (the PLAN pass) or filtering
//    to one octree cell (the BUILD pass).
//
// LAZ is NOT supported (it is compressed; the signature check rejects it).

/** Minimum bytes of the public header block before it can be parsed. */
const HEADER_MIN = 400;

/** Point-record formats that carry an RGB triple. */
const RGB_FORMATS = [2, 3, 5, 7, 8, 10];

/** The subset of the LAS public header block this pipeline needs. */
export interface LasHeader {
  /** Byte offset of the first point record (past the header + VLRs). */
  offsetToPointData: number;
  /** Point Data Record Format id (0..10). */
  pointFormatId: number;
  /** Bytes per point record. */
  pointRecordLength: number;
  /** Number of point records in the file. */
  pointCount: number;
  scaleX: number; scaleY: number; scaleZ: number;
  offsetX: number; offsetY: number; offsetZ: number;
  minX: number; maxX: number;
  minY: number; maxY: number;
  minZ: number; maxZ: number;
}

/** An axis-aligned bounding box. */
export interface Bounds {
  min: [number, number, number];
  max: [number, number, number];
}

/**
 * Read ONLY the header, then stop pulling bytes.
 *
 * Cheap enough to call before deciding how to process a multi-GB file: it consumes just enough
 * chunks to cover the public header block and then closes the stream.
 */
export async function readLasHeader(chunks: AsyncIterable<Uint8Array>): Promise<LasHeader> {
  let head = new Uint8Array(0);
  for await (const chunk of chunks) {
    head = concatBytes(head, chunk);
    if (head.length >= HEADER_MIN) return parseLasHeader(head);
  }
  throw new LasError("LAS truncated: file ends before the header.", "LAS_TRUNCATED");
}

/**
 * Whether a LAS header's declared bounding box can be trusted to frame the octree.
 *
 * It often CANNOT. A LAS header carries min/max fields, but plenty of real-world writers leave
 * them at zero or fill them in wrong, and the file is still perfectly valid — the point records
 * are the truth. That matters because the distributed build derives the octree's root cube from
 * these fields: a zero box collapses the root to a 1-metre cube and every point lands in the
 * same cell, silently producing a garbage octree.
 *
 * So: check before trusting, and fall back to {@link scanLasBounds} when this returns false.
 * (A box that is too LARGE is harmless — just a roomier root cube. Only a degenerate or
 * too-small box corrupts the tree.)
 */
export function hasUsableBounds(h: LasHeader): boolean {
  const spans = [h.maxX - h.minX, h.maxY - h.minY, h.maxZ - h.minZ];
  if (spans.some((s) => !Number.isFinite(s) || s < 0)) return false;
  return spans.some((s) => s > 0); // at least one non-degenerate axis
}

/** The bounding box a LAS header declares. Only meaningful when {@link hasUsableBounds}. */
export function boundsFromHeader(h: LasHeader): Bounds {
  return { min: [h.minX, h.minY, h.minZ], max: [h.maxX, h.maxY, h.maxZ] };
}

/**
 * Compute a LAS file's REAL bounding box by streaming its points.
 *
 * One bounded-memory pass, allocating nothing. Use when {@link hasUsableBounds} rejects the
 * header — the cost is one extra read of the source, which is the price of a correct octree.
 */
export async function scanLasBounds(chunks: AsyncIterable<Uint8Array>): Promise<Bounds> {
  let minX = Infinity, minY = Infinity, minZ = Infinity;
  let maxX = -Infinity, maxY = -Infinity, maxZ = -Infinity;
  await streamLasPoints(chunks, (x, y, z) => {
    if (x < minX) minX = x; if (x > maxX) maxX = x;
    if (y < minY) minY = y; if (y > maxY) maxY = y;
    if (z < minZ) minZ = z; if (z > maxZ) maxZ = z;
  });
  if (!Number.isFinite(minX)) throw new LasError("LAS has zero points.", "LAS_EMPTY");
  return { min: [minX, minY, minZ], max: [maxX, maxY, maxZ] };
}

/** Point arrays produced by {@link decodeLasStream}; shaped for {@link buildPotreeOctree}. */
export interface LasPoints {
  /** World coordinates (LAS-native, Z-up), scale+offset already applied. */
  x: Float64Array; y: Float64Array; z: Float64Array;
  /** Colour, 0..65535. Formats without RGB get a neutral grey. */
  r: Uint16Array; g: Uint16Array; b: Uint16Array;
  count: number;
  header: LasHeader;
}

/** Options for {@link decodeLasStream}. */
export interface LasDecodeOptions {
  /** Stop after this many points (used to cheaply detect "too big for one pass"). */
  maxPoints?: number;
  /** Progress callback (pct 0..100, message). */
  onProgress?: (pct: number, msg: string) => void;
}

/** Called once per point by {@link streamLasPoints}. Colour is 0..65535 (NOT upscaled — see note). */
export type LasPointVisitor = (
  x: number, y: number, z: number,
  r: number, g: number, b: number,
) => void;

/** Colour used for point formats that carry no RGB. */
const NO_COLOUR = 40000;

/** Error thrown for malformed / unsupported LAS input. `code` discriminates the cause. */
export class LasError extends Error {
  constructor(message: string, readonly code: "LAS_BAD_MAGIC" | "LAS_EMPTY" | "LAS_TRUNCATED") {
    super(message);
    this.name = "LasError";
  }
}

/**
 * Parse the LAS public header block.
 *
 * @param bytes At least the first {@link HEADER_MIN} bytes of the file.
 * @throws {LasError} `LAS_BAD_MAGIC` if the `LASF` signature is absent (e.g. a LAZ file).
 */
export function parseLasHeader(bytes: Uint8Array): LasHeader {
  const dv = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  // "LASF" signature.
  if (dv.getUint8(0) !== 0x4c || dv.getUint8(1) !== 0x41 || dv.getUint8(2) !== 0x53 || dv.getUint8(3) !== 0x46) {
    throw new LasError("Not a LAS file (bad LASF signature). LAZ is not supported.", "LAS_BAD_MAGIC");
  }
  const versionMinor = dv.getUint8(25);
  // LAS 1.4 moved the point count to a 64-bit field at 247; the legacy 32-bit field at 107
  // is left at 0 by some writers and populated by others, so fall back to it when 247 is 0.
  const legacyCount = dv.getUint32(107, true);
  let pointCount = versionMinor >= 4 ? Number(dv.getBigUint64(247, true)) : legacyCount;
  if (versionMinor >= 4 && pointCount === 0 && legacyCount > 0) pointCount = legacyCount;

  return {
    offsetToPointData: dv.getUint32(96, true),
    pointFormatId: dv.getUint8(104),
    pointRecordLength: dv.getUint16(105, true),
    pointCount,
    scaleX: dv.getFloat64(131, true), scaleY: dv.getFloat64(139, true), scaleZ: dv.getFloat64(147, true),
    offsetX: dv.getFloat64(155, true), offsetY: dv.getFloat64(163, true), offsetZ: dv.getFloat64(171, true),
    maxX: dv.getFloat64(179, true), minX: dv.getFloat64(187, true),
    maxY: dv.getFloat64(195, true), minY: dv.getFloat64(203, true),
    maxZ: dv.getFloat64(211, true), minZ: dv.getFloat64(219, true),
  };
}

/** Byte offset of the RGB triple within a point record, per point format. */
function rgbOffsetFor(pointFormatId: number): number {
  if (pointFormatId === 3 || pointFormatId === 5) return 28;
  if (pointFormatId === 7 || pointFormatId === 8 || pointFormatId === 10) return 30;
  return 20;
}

/** Concatenate two byte runs (replaces `Buffer.concat` — kept local so the lib stays Node-free). */
function concatBytes(a: Uint8Array, b: Uint8Array): Uint8Array {
  if (a.length === 0) return b;
  if (b.length === 0) return a;
  const out = new Uint8Array(a.length + b.length);
  out.set(a, 0);
  out.set(b, a.length);
  return out;
}

/**
 * Walks the record stream shared by both readers: skips the header + VLRs, splits the byte
 * stream into whole point records (carrying a partial record across the chunk boundary), and
 * hands each record's DataView + offset to `onRecord`. Returns the parsed header.
 *
 * `onRecord` returns `false` to stop early (the caller has all the points it wants).
 */
async function walkLasRecords(
  chunks: AsyncIterable<Uint8Array>,
  onHeader: (h: LasHeader) => void,
  onRecord: (dv: DataView, offset: number) => boolean,
): Promise<LasHeader> {
  let header: LasHeader | null = null;
  let head = new Uint8Array(0);
  let leftover = new Uint8Array(0);
  let stride = 0;
  let skip = 0;
  let stop = false;

  for await (const raw of chunks) {
    let chunk: Uint8Array = raw instanceof Uint8Array ? raw : new Uint8Array(raw as ArrayLike<number>);

    if (header === null) {
      head = concatBytes(head, chunk);
      if (head.length < HEADER_MIN) continue;
      header = parseLasHeader(head);
      stride = header.pointRecordLength;
      skip = header.offsetToPointData;
      onHeader(header);
      // Re-process the bytes accumulated while waiting for a full header.
      chunk = head;
      head = new Uint8Array(0);
    }

    // Skip forward to the first point record.
    if (skip > 0) {
      if (chunk.length <= skip) { skip -= chunk.length; continue; }
      chunk = chunk.subarray(skip);
      skip = 0;
    }

    const buf = leftover.length ? concatBytes(leftover, chunk) : chunk;
    const usable = buf.length - (buf.length % stride);
    if (usable > 0) {
      const dv = new DataView(buf.buffer, buf.byteOffset, buf.byteLength);
      for (let o = 0; o < usable; o += stride) {
        if (!onRecord(dv, o)) { stop = true; break; }
      }
    }
    if (stop) break; // don't await another chunk we won't read
    // Copy the trailing partial record out — the source chunk's memory may be reused.
    leftover = buf.slice(usable);
  }

  if (header === null) throw new LasError("LAS truncated: no header.", "LAS_TRUNCATED");
  return header;
}

/**
 * Stream a LAS point-by-point in BOUNDED memory — nothing is allocated per point.
 *
 * Use for passes over clouds too large to materialise: counting points per octree cell
 * (PLAN) or filtering the source down to one cell (BUILD). Colour is passed through RAW,
 * so 8-bit-encoded RGB is NOT upscaled here — {@link decodeLasStream} does that, since it
 * needs the whole file to know whether the file is 8-bit or 16-bit.
 *
 * @param chunks The file's bytes, as an async iterable (e.g. a `fetch` response body).
 * @param eachPoint Called once per point with world coordinates + colour.
 * @param onHeader Called once, as soon as the header is parsed.
 * @returns The parsed header.
 */
export async function streamLasPoints(
  chunks: AsyncIterable<Uint8Array>,
  eachPoint: LasPointVisitor,
  onHeader: (h: LasHeader) => void = () => {},
): Promise<LasHeader> {
  let H!: LasHeader;
  let hasRGB = false;
  let rgbOff = 20;

  return walkLasRecords(
    chunks,
    (h) => {
      H = h;
      hasRGB = RGB_FORMATS.includes(h.pointFormatId);
      rgbOff = rgbOffsetFor(h.pointFormatId);
      onHeader(h);
    },
    (dv, o) => {
      const x = dv.getInt32(o, true) * H.scaleX + H.offsetX;
      const y = dv.getInt32(o + 4, true) * H.scaleY + H.offsetY;
      const z = dv.getInt32(o + 8, true) * H.scaleZ + H.offsetZ;
      if (hasRGB) {
        eachPoint(x, y, z,
          dv.getUint16(o + rgbOff, true),
          dv.getUint16(o + rgbOff + 2, true),
          dv.getUint16(o + rgbOff + 4, true));
      } else {
        eachPoint(x, y, z, NO_COLOUR, NO_COLOUR, NO_COLOUR);
      }
      return true;
    },
  );
}

/**
 * Decode a LAS into parallel typed arrays, ready for {@link buildPotreeOctree}.
 *
 * Allocates ~38 bytes/point (3×f64 + 3×u16), so only use this when the cloud fits in RAM —
 * otherwise take the bounded-memory {@link streamLasPoints} path. The raw file is never fully
 * buffered either way.
 *
 * Colour: LAS nominally stores 16-bit RGB, but many writers emit 8-bit values in the 16-bit
 * field. If every channel in the file is <= 255 the colour is upscaled (×257) to 16-bit, so
 * the output is always genuinely 16-bit.
 *
 * @throws {LasError} `LAS_EMPTY` if the file declares zero points, `LAS_TRUNCATED` if it ends early.
 */
export async function decodeLasStream(
  chunks: AsyncIterable<Uint8Array>,
  opts: LasDecodeOptions = {},
): Promise<LasPoints> {
  const report = opts.onProgress ?? (() => {});
  const max = opts.maxPoints ?? Infinity;

  let H!: LasHeader;
  let hasRGB = false;
  let rgbOff = 20;
  let x!: Float64Array, y!: Float64Array, z!: Float64Array;
  let r!: Uint16Array, g!: Uint16Array, b!: Uint16Array;
  let n = 0;      // points written
  let want = 0;   // points we intend to write
  let rgbMax = 0; // to detect 8-bit-in-16-bit colour

  const header = await walkLasRecords(
    chunks,
    (h) => {
      H = h;
      hasRGB = RGB_FORMATS.includes(h.pointFormatId);
      rgbOff = rgbOffsetFor(h.pointFormatId);
      want = Math.min(h.pointCount, max);
      if (!(want > 0)) throw new LasError("LAS has zero points.", "LAS_EMPTY");
      x = new Float64Array(want); y = new Float64Array(want); z = new Float64Array(want);
      r = new Uint16Array(want); g = new Uint16Array(want); b = new Uint16Array(want);
      report(5, `LAS ${h.pointCount.toLocaleString()} pts, fmt ${h.pointFormatId}, recLen ${h.pointRecordLength}`);
    },
    (dv, o) => {
      x[n] = dv.getInt32(o, true) * H.scaleX + H.offsetX;
      y[n] = dv.getInt32(o + 4, true) * H.scaleY + H.offsetY;
      z[n] = dv.getInt32(o + 8, true) * H.scaleZ + H.offsetZ;
      if (hasRGB) {
        const rr = dv.getUint16(o + rgbOff, true);
        const gg = dv.getUint16(o + rgbOff + 2, true);
        const bb = dv.getUint16(o + rgbOff + 4, true);
        r[n] = rr; g[n] = gg; b[n] = bb;
        if (rr > rgbMax) rgbMax = rr;
        if (gg > rgbMax) rgbMax = gg;
        if (bb > rgbMax) rgbMax = bb;
      } else {
        r[n] = NO_COLOUR; g[n] = NO_COLOUR; b[n] = NO_COLOUR;
      }
      n++;
      if ((n & 0x3fffff) === 0) report(5 + (80 * n) / want, `decoded ${n.toLocaleString()} / ${want.toLocaleString()}`);
      return n < want; // stop as soon as we have what we asked for
    },
  );

  if (n < want) throw new LasError(`LAS truncated: decoded ${n} of ${want} points.`, "LAS_TRUNCATED");

  if (hasRGB && rgbMax > 0 && rgbMax <= 255) {
    report(86, "RGB looks 8-bit; upscaling *257 to 16-bit");
    for (let i = 0; i < want; i++) { r[i] *= 257; g[i] *= 257; b[i] *= 257; }
  }

  return { x, y, z, r, g, b, count: want, header };
}
