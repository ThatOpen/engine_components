import * as THREE from "three";
import { LineTickBuilder, MeshTickBuilder } from "./types";

// ─── Line ticks ───────────────────────────────────────────────────────────────

/**
 * Diagonal slash tick (architectural style).
 * A single line crossing the dimension endpoint at 45° relative to the
 * dimension line direction.
 */
export const DiagonalTick: LineTickBuilder = (tip, lineDir, size) => {
  const perp = new THREE.Vector3(-lineDir.z, 0, lineDir.x);
  // 45° between lineDir and perp, normalised
  const diag = new THREE.Vector3(lineDir.x + perp.x, 0, lineDir.z + perp.z)
    .normalize()
    .multiplyScalar(size / 2);
  return [
    tip.x + diag.x, tip.y, tip.z + diag.z,
    tip.x - diag.x, tip.y, tip.z - diag.z,
  ];
};

/**
 * Closed arrowhead tick — two wing lines plus a base line connecting them,
 * forming a triangle outline (tip → wing1, tip → wing2, wing1 → wing2).
 */
export const ArrowTick: LineTickBuilder = (tip, lineDir, size) => {
  const perp = new THREE.Vector3(-lineDir.z, 0, lineDir.x);
  const wing1x = tip.x - lineDir.x * size + perp.x * size * 0.4;
  const wing1z = tip.z - lineDir.z * size + perp.z * size * 0.4;
  const wing2x = tip.x - lineDir.x * size - perp.x * size * 0.4;
  const wing2z = tip.z - lineDir.z * size - perp.z * size * 0.4;
  return [
    tip.x, tip.y, tip.z,  wing1x, tip.y, wing1z,
    tip.x, tip.y, tip.z,  wing2x, tip.y, wing2z,
    wing1x, tip.y, wing1z, wing2x, tip.y, wing2z,
  ];
};

/**
 * Open-V arrowhead tick — two lines from the tip to the wing points, no base.
 */
export const OpenArrowTick: LineTickBuilder = (tip, lineDir, size) => {
  const perp = new THREE.Vector3(-lineDir.z, 0, lineDir.x);
  const wing1x = tip.x - lineDir.x * size + perp.x * size * 0.4;
  const wing1z = tip.z - lineDir.z * size + perp.z * size * 0.4;
  const wing2x = tip.x - lineDir.x * size - perp.x * size * 0.4;
  const wing2z = tip.z - lineDir.z * size - perp.z * size * 0.4;
  return [
    tip.x, tip.y, tip.z, wing1x, tip.y, wing1z,
    tip.x, tip.y, tip.z, wing2x, tip.y, wing2z,
  ];
};

/**
 * No tick — dimension line ends cleanly at the extension lines.
 */
export const NoTick: LineTickBuilder = () => [];

/**
 * Dot tick — a small circle drawn with line segments at the endpoint.
 * Standard ISO tick for radius and diameter dimensions.
 * The circle is centred on the endpoint and independent of line direction.
 */
export const DotTick: LineTickBuilder = (tip, _lineDir, size) => {
  const r        = size * 0.4;
  const segments = 12;
  const coords: number[] = [];
  for (let i = 0; i < segments; i++) {
    const a0 = (i       / segments) * Math.PI * 2;
    const a1 = ((i + 1) / segments) * Math.PI * 2;
    coords.push(
      tip.x + Math.cos(a0) * r, tip.y, tip.z + Math.sin(a0) * r,
      tip.x + Math.cos(a1) * r, tip.y, tip.z + Math.sin(a1) * r,
    );
  }
  return coords;
};


// ─── Mesh ticks ───────────────────────────────────────────────────────────────

/**
 * Filled circle tick (solid disc, requires a `THREE.Mesh`).
 * The disc is centred on the endpoint and approximated with 16 triangles.
 */
export const FilledCircleTick: MeshTickBuilder = (tip, _lineDir, size) => {
  const r        = size * 0.4;
  const segments = 16;
  const coords: number[] = [];
  for (let i = 0; i < segments; i++) {
    const a0 = (i       / segments) * Math.PI * 2;
    const a1 = ((i + 1) / segments) * Math.PI * 2;
    // Fan triangulation: centre → p0 → p1 (XZ plane, Y = 0).
    coords.push(
      tip.x,                      tip.y, tip.z,
      tip.x + Math.cos(a0) * r,   tip.y, tip.z + Math.sin(a0) * r,
      tip.x + Math.cos(a1) * r,   tip.y, tip.z + Math.sin(a1) * r,
    );
  }
  return coords;
};

/**
 * Filled square tick (solid square, requires a `THREE.Mesh`).
 * The square is centred on the endpoint and oriented along the dimension line.
 * Common in structural and steel drawings.
 */
export const FilledSquareTick: MeshTickBuilder = (tip, lineDir, size) => {
  const perp = new THREE.Vector3(-lineDir.z, 0, lineDir.x);
  const half = size * 0.4;
  const p0 = tip.clone().addScaledVector(lineDir,  half).addScaledVector(perp,  half);
  const p1 = tip.clone().addScaledVector(lineDir,  half).addScaledVector(perp, -half);
  const p2 = tip.clone().addScaledVector(lineDir, -half).addScaledVector(perp, -half);
  const p3 = tip.clone().addScaledVector(lineDir, -half).addScaledVector(perp,  half);
  return [
    p0.x, p0.y, p0.z, p1.x, p1.y, p1.z, p2.x, p2.y, p2.z,
    p0.x, p0.y, p0.z, p2.x, p2.y, p2.z, p3.x, p3.y, p3.z,
  ];
};

/**
 * Filled arrowhead tick (solid triangle, requires a `THREE.Mesh`).
 * Use this as `meshTick` on a style — pair with `NoTick` as `tick` if you
 * want only the filled shape and no line arrowhead.
 */
export const FilledArrowTick: MeshTickBuilder = (tip, lineDir, size) => {
  const perp = new THREE.Vector3(-lineDir.z, 0, lineDir.x);
  const base = tip.clone().addScaledVector(lineDir, -size);
  const w1 = base.clone().addScaledVector(perp,  size * 0.4);
  const w2 = base.clone().addScaledVector(perp, -size * 0.4);
  return [
    tip.x, tip.y, tip.z,
    w1.x,  w1.y,  w1.z,
    w2.x,  w2.y,  w2.z,
  ];
};
