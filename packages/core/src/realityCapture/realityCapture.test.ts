import { describe, expect, it } from "vitest";
import {
  buildPotreeOctree,
  crc32,
  decodeLasStream,
  md5,
  POTREE_POINT_BYTES,
  streamLasPoints,
  write3tzToBuffer,
} from "./index";

// Every input here is generated in code: no capture file is (or may be) part
// of the repository.

const LAS_HEADER_SIZE = 227; // LAS 1.2 public header block
const FORMAT_2_RECORD = 26; // xyz int32 + intensity..pointSourceId (20 B) + rgb

interface SyntheticPoint {
  x: number;
  y: number;
  z: number;
  r: number;
  g: number;
  b: number;
}

/** A minimal LAS 1.2, point format 2 (RGB) file, built byte by byte. */
function synthLas(points: SyntheticPoint[], scale = 0.001, offset = 100) {
  const bytes = new Uint8Array(
    LAS_HEADER_SIZE + points.length * FORMAT_2_RECORD,
  );
  const dv = new DataView(bytes.buffer);
  bytes.set([0x4c, 0x41, 0x53, 0x46], 0); // "LASF"
  dv.setUint8(24, 1); // version 1.2
  dv.setUint8(25, 2);
  dv.setUint16(94, LAS_HEADER_SIZE, true);
  dv.setUint32(96, LAS_HEADER_SIZE, true); // offset to point data
  dv.setUint32(100, 0, true); // no VLRs
  dv.setUint8(104, 2); // point format
  dv.setUint16(105, FORMAT_2_RECORD, true);
  dv.setUint32(107, points.length, true);
  for (let i = 0; i < 3; i++) {
    dv.setFloat64(131 + i * 8, scale, true);
    dv.setFloat64(155 + i * 8, offset, true);
  }
  const axes = ["x", "y", "z"] as const;
  axes.forEach((axis, i) => {
    const values = points.map((p) => p[axis]);
    dv.setFloat64(179 + i * 16, Math.max(...values), true);
    dv.setFloat64(187 + i * 16, Math.min(...values), true);
  });
  points.forEach((p, i) => {
    const o = LAS_HEADER_SIZE + i * FORMAT_2_RECORD;
    dv.setInt32(o, Math.round((p.x - offset) / scale), true);
    dv.setInt32(o + 4, Math.round((p.y - offset) / scale), true);
    dv.setInt32(o + 8, Math.round((p.z - offset) / scale), true);
    dv.setUint16(o + 20, p.r, true);
    dv.setUint16(o + 22, p.g, true);
    dv.setUint16(o + 24, p.b, true);
  });
  return bytes;
}

/** Feed `bytes` as an async stream of `size`-byte chunks. */
async function* chunked(bytes: Uint8Array, size: number) {
  for (let o = 0; o < bytes.length; o += size) {
    yield bytes.subarray(o, o + size);
  }
}

/** A deterministic pseudo-random cube of points. */
function synthCloud(count: number): SyntheticPoint[] {
  let seed = 1234567;
  const rand = () => {
    seed = (seed * 1103515245 + 12345) % 2147483648;
    return seed / 2147483648;
  };
  return Array.from({ length: count }, () => ({
    x: 100 + rand() * 10,
    y: 100 + rand() * 10,
    z: 100 + rand() * 3,
    r: Math.floor(rand() * 256),
    g: Math.floor(rand() * 256),
    b: Math.floor(rand() * 256),
  }));
}

describe("realityCapture hashes", () => {
  it("computes the standard CRC-32 check value", () => {
    const input = new TextEncoder().encode("123456789");
    expect(crc32(input) >>> 0).toBe(0xcbf43926);
  });

  it("computes the MD5 of the empty input", () => {
    const hex = Array.from(md5(new Uint8Array(0)))
      .map((v) => v.toString(16).padStart(2, "0"))
      .join("");
    expect(hex).toBe("d41d8cd98f00b204e9800998ecf8427e");
  });
});

describe("realityCapture LAS", () => {
  const points = synthCloud(50);
  const las = synthLas(points);

  it("decodes coordinates across arbitrary chunk boundaries", async () => {
    // 7-byte chunks split both the header and every record.
    const decoded = await decodeLasStream(chunked(las, 7));
    expect(decoded.count).toBe(points.length);
    expect(decoded.header.pointFormatId).toBe(2);
    points.forEach((p, i) => {
      expect(decoded.x[i]).toBeCloseTo(p.x, 2);
      expect(decoded.y[i]).toBeCloseTo(p.y, 2);
      expect(decoded.z[i]).toBeCloseTo(p.z, 2);
    });
  });

  it("upscales 8-bit colour stored in the 16-bit fields", async () => {
    const decoded = await decodeLasStream(chunked(las, 4096));
    expect(decoded.r[0]).toBe(points[0].r * 257);
    expect(decoded.g[3]).toBe(points[3].g * 257);
  });

  it("stops early at maxPoints", async () => {
    const decoded = await decodeLasStream(chunked(las, 64), { maxPoints: 5 });
    expect(decoded.count).toBe(5);
  });

  it("streams the same points without materialising them", async () => {
    let seen = 0;
    await streamLasPoints(chunked(las, 13), (x) => {
      expect(x).toBeCloseTo(points[seen].x, 2);
      seen++;
    });
    expect(seen).toBe(points.length);
  });

  it("rejects a file without the LASF signature", async () => {
    const bad = las.slice();
    bad[0] = 0;
    await expect(decodeLasStream(chunked(bad, 512))).rejects.toThrow(/LAS/);
  });
});

describe("realityCapture Potree octree", () => {
  it("builds a Potree 2.0 dataset from synthetic points", () => {
    const cloud = synthCloud(2000);
    const output = buildPotreeOctree({
      x: cloud.map((p) => p.x),
      y: cloud.map((p) => p.y),
      z: cloud.map((p) => p.z),
      r: cloud.map((p) => p.r * 257),
      g: cloud.map((p) => p.g * 257),
      b: cloud.map((p) => p.b * 257),
      count: cloud.length,
    });
    expect(output.metadata.version).toBe("2.0");
    expect(output.metadata.points).toBeGreaterThan(0);
    expect(output.metadata.points).toBeLessThanOrEqual(cloud.length);
    expect(output.octree.byteLength).toBeGreaterThan(0);
    expect(output.octree.byteLength % POTREE_POINT_BYTES).toBe(0);
    expect(output.octree.byteLength).toBeLessThanOrEqual(
      cloud.length * POTREE_POINT_BYTES,
    );
    // 22-byte hierarchy records.
    expect(output.hierarchy.byteLength % 22).toBe(0);
    expect(output.hierarchy.byteLength).toBeGreaterThan(0);
  });
});

describe("realityCapture 3tz", () => {
  it("writes a store-only zip with every entry", () => {
    const entries = [
      { name: "tileset.json", data: new TextEncoder().encode("{}") },
      { name: "a/b.bin", data: new Uint8Array([1, 2, 3, 4]) },
    ];
    const zip = write3tzToBuffer(entries);
    // Local file header signature.
    expect(Array.from(zip.subarray(0, 4))).toEqual([0x50, 0x4b, 0x03, 0x04]);
    const text = new TextDecoder("latin1").decode(zip);
    expect(text).toContain("tileset.json");
    expect(text).toContain("a/b.bin");
    // End of central directory record.
    expect(text).toContain("PK\u0005\u0006");
  });
});
