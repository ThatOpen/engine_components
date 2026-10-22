// Store-only ZIP writer for OGC 3D Tiles archives (.3tz), assembled entirely in
// memory (no Node `fs`/`zlib`/`crypto`). Isomorphic version of the cloud component's
// `zip3tz.mjs` `write3tzToBuffer`.
//
//  - Every entry STORED (method 0, no deflate): SPZ stays gzipped-but-range-
//    addressable; a points cloud.bin stays sub-range sliceable.
//  - Root entry MUST be `tileset.json` (3tz convention).
//  - Emits the `@3dtilesIndex1@` fast-index (sorted md5(path) -> local-header
//    offset) as the last content entry; the ZIP central directory at EOF is the
//    universal fallback.
//  - Standard ZIP (32-bit). Entries / total > 4 GB need ZIP64 (throws for now).

import { crc32, md5 } from "./hash.js";

const U32_MAX = 0xffffffff;
const textEncoder = new TextEncoder();

/** A single archive entry: a name (path inside the archive) and its raw bytes. */
export interface Zip3tzEntry {
  name: string;
  data: Uint8Array;
}

interface EntryRecord {
  nameBytes: Uint8Array;
  hdrOffset: number;
  crc: number;
  size: number;
}

function localHeader(nameBytes: Uint8Array, crc: number, size: number): Uint8Array {
  const h = new Uint8Array(30 + nameBytes.length);
  const dv = new DataView(h.buffer);
  dv.setUint32(0, 0x04034b50, true);
  dv.setUint16(4, 20, true); // version needed
  dv.setUint16(6, 0, true); // flags
  dv.setUint16(8, 0, true); // method = stored
  dv.setUint16(10, 0, true); // mod time (fixed; no Date dependency)
  dv.setUint16(12, 0x21, true); // mod date = 1980-01-01 (valid)
  dv.setUint32(14, crc >>> 0, true);
  dv.setUint32(18, size, true); // compressed = uncompressed (stored)
  dv.setUint32(22, size, true);
  dv.setUint16(26, nameBytes.length, true);
  dv.setUint16(28, 0, true); // extra len
  h.set(nameBytes, 30);
  return h;
}

function centralRecord(r: EntryRecord): Uint8Array {
  const h = new Uint8Array(46 + r.nameBytes.length);
  const dv = new DataView(h.buffer);
  dv.setUint32(0, 0x02014b50, true);
  dv.setUint16(4, 20, true); // version made by
  dv.setUint16(6, 20, true); // version needed
  dv.setUint16(8, 0, true);
  dv.setUint16(10, 0, true); // stored
  dv.setUint16(12, 0, true);
  dv.setUint16(14, 0x21, true);
  dv.setUint32(16, r.crc >>> 0, true);
  dv.setUint32(20, r.size, true);
  dv.setUint32(24, r.size, true);
  dv.setUint16(28, r.nameBytes.length, true);
  dv.setUint16(30, 0, true); // extra
  dv.setUint16(32, 0, true); // comment
  dv.setUint16(34, 0, true); // disk start
  dv.setUint16(36, 0, true); // internal attr
  dv.setUint32(38, 0, true); // external attr
  dv.setUint32(42, r.hdrOffset, true);
  h.set(r.nameBytes, 46);
  return h;
}

function eocd(count: number, cdSize: number, cdOffset: number): Uint8Array {
  const h = new Uint8Array(22);
  const dv = new DataView(h.buffer);
  dv.setUint32(0, 0x06054b50, true);
  dv.setUint16(4, 0, true);
  dv.setUint16(6, 0, true);
  dv.setUint16(8, count, true);
  dv.setUint16(10, count, true);
  dv.setUint32(12, cdSize, true);
  dv.setUint32(16, cdOffset, true);
  dv.setUint16(20, 0, true);
  return h;
}

function compareBytes(a: Uint8Array, b: Uint8Array): number {
  const n = Math.min(a.length, b.length);
  for (let i = 0; i < n; i += 1) {
    if (a[i] !== b[i]) return a[i] - b[i];
  }
  return a.length - b.length;
}

function buildIndex(records: EntryRecord[]): Uint8Array {
  // [16-byte md5(name)] [8-byte LE local-header offset], sorted ascending by hash.
  const recs = records.map((r) => ({ hash: md5(r.nameBytes), off: r.hdrOffset }));
  recs.sort((a, b) => compareBytes(a.hash, b.hash));
  const buf = new Uint8Array(recs.length * 24);
  const dv = new DataView(buf.buffer);
  let o = 0;
  for (const r of recs) {
    buf.set(r.hash, o);
    o += 16;
    dv.setBigUint64(o, BigInt(r.off), true);
    o += 8;
  }
  return buf;
}

function concat(parts: Uint8Array[]): Uint8Array {
  let total = 0;
  for (const p of parts) total += p.length;
  const out = new Uint8Array(total);
  let o = 0;
  for (const p of parts) {
    out.set(p, o);
    o += p.length;
  }
  return out;
}

/**
 * Pack `entries` into a complete store-only `.3tz` archive (returned as a single
 * `Uint8Array`). `tileset.json` MUST be the first entry (3tz convention).
 */
export function write3tzToBuffer(entries: Zip3tzEntry[]): Uint8Array {
  const parts: Uint8Array[] = [];
  let offset = 0;
  const records: EntryRecord[] = [];

  for (const e of entries) {
    const nameBytes = textEncoder.encode(e.name);
    const { data } = e;
    const crc = crc32(data);
    const size = data.length;
    if (size > U32_MAX) {
      throw new Error(
        `[3tz] entry "${e.name}" is ${(size / 1073741824).toFixed(2)}GB — exceeds the 4GB ZIP32 limit. ` +
          `ZIP64 is not yet supported; shard the entry before packing.`,
      );
    }
    const lh = localHeader(nameBytes, crc, size);
    parts.push(lh);
    const hdrOffset = offset;
    offset += lh.length;
    parts.push(data);
    offset += size;
    records.push({ nameBytes, hdrOffset, crc, size });
  }

  // fast index (over content entries only)
  const triangleIndexArray = buildIndex(records);
  const idxName = textEncoder.encode("@3dtilesIndex1@");
  const idxLh = localHeader(idxName, crc32(triangleIndexArray), triangleIndexArray.length);
  parts.push(idxLh);
  const idxHdr = offset;
  offset += idxLh.length;
  parts.push(triangleIndexArray);
  offset += triangleIndexArray.length;
  records.push({
    nameBytes: idxName,
    hdrOffset: idxHdr,
    crc: crc32(triangleIndexArray),
    size: triangleIndexArray.length,
  });

  // central directory + EOCD
  const cdStart = offset;
  for (const r of records) {
    const cd = centralRecord(r);
    parts.push(cd);
    offset += cd.length;
  }
  parts.push(eocd(records.length, offset - cdStart, cdStart));

  return concat(parts);
}
