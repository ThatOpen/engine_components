import * as THREE from "three";

// WebGPU tone-maps the WHOLE frame in its output pass, clear colour included, while WebGL tone-maps inside each
// material and clears with the plain colour. So under WebGPU a scene background (or the page colour an opaque
// canvas clears to) came out darker than under WebGL whenever tone mapping was on: 0x202932 with Neutral drew
// #0C1823 instead of #232931. The fix is to clear with the colour that the active curve maps BACK to the
// intended one. These are three's own curves (nodes/display/ToneMappingFunctions.js), in linear sRGB, exposure
// included; the pre-image is found numerically so every curve shares one solver.

type Vec3 = [number, number, number];

const unitClamp = (v: number) => Math.min(1, Math.max(0, v));

const RRTAndODTFit = (x: number) => {
  const a = x * (x + 0.0245786) - 0.000090537;
  const b = x * (0.983729 * x + 0.432951) + 0.238081;
  return a / b;
};

// TSL mat3(...) takes its nine values column by column, like GLSL.
const mulColumns = (m: number[], v: Vec3): Vec3 => [
  m[0] * v[0] + m[3] * v[1] + m[6] * v[2],
  m[1] * v[0] + m[4] * v[1] + m[7] * v[2],
  m[2] * v[0] + m[5] * v[1] + m[8] * v[2],
];

const ACES_IN = [0.59719, 0.35458, 0.04823, 0.076, 0.90834, 0.01566, 0.0284, 0.13383, 0.83777];
const ACES_OUT = [1.60475, -0.53108, -0.07367, -0.10208, 1.10813, -0.00605, -0.00327, -0.07276, 1.07602];

const curves: Partial<Record<number, (c: Vec3, exposure: number) => Vec3>> = {
  [THREE.LinearToneMapping]: (c, e) => c.map((v) => unitClamp(v * e)) as Vec3,
  [THREE.ReinhardToneMapping]: (c, e) => c.map((v) => unitClamp((v * e) / (1 + v * e))) as Vec3,
  [THREE.CineonToneMapping]: (c, e) =>
    c.map((v) => {
      const x = Math.max(v * e - 0.004, 0);
      return ((x * (6.2 * x + 0.5)) / (x * (6.2 * x + 1.7) + 0.06)) ** 2.2;
    }) as Vec3,
  [THREE.ACESFilmicToneMapping]: (c, e) => {
    const input = mulColumns(ACES_IN, c.map((v) => (v * e) / 0.6) as Vec3);
    const framedIn = input.map(RRTAndODTFit) as Vec3;
    return mulColumns(ACES_OUT, framedIn).map(unitClamp) as Vec3;
  },
  [THREE.NeutralToneMapping]: (c, e) => {
    const compressionStart = 0.8 - 0.04;
    const greyingAmount = 0.15;
    let color = c.map((v) => v * e) as Vec3;
    const x = Math.min(color[0], color[1], color[2]);
    const offset = x < 0.08 ? x - 6.25 * x * x : 0.04;
    color = color.map((v) => v - offset) as Vec3;
    const peak = Math.max(color[0], color[1], color[2]);
    if (peak < compressionStart) return color;
    const d = 1 - compressionStart;
    const newPeak = 1 - (d * d) / (peak + d - compressionStart);
    color = color.map((v) => (v * newPeak) / peak) as Vec3;
    const g = 1 - 1 / (greyingAmount * (peak - newPeak) + 1);
    return color.map((v) => v + (newPeak - v) * g) as Vec3;
  },
};

/**
 * Writes into `out` the linear colour that the given tone mapping turns into `target`. Returns false (and leaves
 * `out` untouched) when the curve is not one this knows (AgX, custom), so the caller can keep the plain colour.
 */
export function untoneMap(
  target: THREE.Color,
  toneMapping: THREE.ToneMapping,
  exposure: number,
  out: THREE.Color,
): boolean {
  const curve = curves[toneMapping];
  if (!curve) return false;
  const goal: Vec3 = [target.r, target.g, target.b];
  const c: Vec3 = [...goal];
  const h = 1e-5;
  for (let iteration = 0; iteration < 30; iteration++) {
    const f = curve(c, exposure);
    const leftoverError: Vec3 = [f[0] - goal[0], f[1] - goal[1], f[2] - goal[2]];
    if (Math.max(Math.abs(leftoverError[0]), Math.abs(leftoverError[1]), Math.abs(leftoverError[2])) < 1e-7) break;
    // Numeric Jacobian, one column per channel (the curves mix channels, so it is not diagonal).
    const J: number[][] = [[], [], []];
    for (let j = 0; j < 3; j++) {
      const step: Vec3 = [...c];
      step[j] += h;
      const fj = curve(step, exposure);
      for (let i = 0; i < 3; i++) J[i][j] = (fj[i] - f[i]) / h;
    }
    const m = new THREE.Matrix3().set(
      J[0][0], J[0][1], J[0][2],
      J[1][0], J[1][1], J[1][2],
      J[2][0], J[2][1], J[2][2],
    );
    if (Math.abs(m.determinant()) < 1e-12) break;
    const delta = new THREE.Vector3(...leftoverError).applyMatrix3(m.invert());
    c[0] = Math.max(0, c[0] - delta.x);
    c[1] = Math.max(0, c[1] - delta.y);
    c[2] = Math.max(0, c[2] - delta.z);
  }
  out.setRGB(c[0], c[1], c[2]);
  return true;
}
