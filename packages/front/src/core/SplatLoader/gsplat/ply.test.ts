import { describe, expect, it } from "vitest";
import { flipToYUp, parsePly } from "./ply";

// The PLY is generated in code: no capture file is (or may be) part of the
// repository.

const PROPS = [
  "x", "y", "z",
  "f_dc_0", "f_dc_1", "f_dc_2",
  "opacity",
  "scale_0", "scale_1", "scale_2",
  "rot_0", "rot_1", "rot_2", "rot_3",
];

type Gaussian = Record<(typeof PROPS)[number], number>;

/** A binary little-endian INRIA 3DGS PLY with the given gaussians. */
function synthPly(gaussians: Gaussian[]): ArrayBuffer {
  const header =
    "ply\nformat binary_little_endian 1.0\n" +
    `element vertex ${gaussians.length}\n` +
    PROPS.map((p) => `property float ${p}\n`).join("") +
    "end_header\n";
  const head = new TextEncoder().encode(header);
  const stride = PROPS.length * 4;
  const bytes = new Uint8Array(head.length + gaussians.length * stride);
  bytes.set(head, 0);
  const dv = new DataView(bytes.buffer, head.length);
  gaussians.forEach((g, i) => {
    PROPS.forEach((p, j) => dv.setFloat32(i * stride + j * 4, g[p], true));
  });
  return bytes.buffer;
}

const gaussian = (x: number, y: number, z: number): Gaussian => ({
  x, y, z,
  f_dc_0: 0, f_dc_1: 0, f_dc_2: 0, // DC 0 -> mid grey
  opacity: 0, // sigmoid(0) = 0.5
  scale_0: Math.log(2), scale_1: 0, scale_2: Math.log(0.5),
  rot_0: 2, rot_1: 0, rot_2: 0, rot_3: 0, // (w,x,y,z), unnormalised
});

describe("SplatLoader PLY parser", () => {
  it("decodes centres, scales, rotation, colour and opacity", () => {
    const data = parsePly(synthPly([gaussian(1, 2, 3), gaussian(-4, 5, -6)]));
    expect(data.count).toBe(2);
    expect(Array.from(data.centers)).toEqual([1, 2, 3, -4, 5, -6]);
    expect(data.scales[0]).toBeCloseTo(2);
    expect(data.scales[1]).toBeCloseTo(1);
    expect(data.scales[2]).toBeCloseTo(0.5);
    // Stored (w,x,y,z) = (2,0,0,0) -> normalised (x,y,z,w) = (0,0,0,1).
    expect(Array.from(data.quats.subarray(0, 4))).toEqual([0, 0, 0, 1]);
    expect(data.colors[0]).toBeCloseTo(0.5);
    expect(data.colors[3]).toBeCloseTo(0.5);
  });

  it("flips Y-down captures to Y-up with a rotation, not a mirror", () => {
    const data = parsePly(synthPly([gaussian(1, 2, 3)]));
    flipToYUp(data);
    expect(Array.from(data.centers)).toEqual([1, -2, -3]);
    const [x, y, z, w] = data.quats;
    expect(Math.hypot(x, y, z, w)).toBeCloseTo(1);
  });

  it("rejects a PLY without vertices", () => {
    expect(() => parsePly(synthPly([]))).toThrow(/no vertices/);
  });
});
