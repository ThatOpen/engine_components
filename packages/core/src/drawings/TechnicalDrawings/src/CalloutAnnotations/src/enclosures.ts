import * as THREE from "three";
import { EnclosureBuilder } from "./types";

const CLOUD_ARC_SEGMENTS = 8;

/** Revision-cloud enclosure — a bumpy rectangle centred on `center`. */
export const CloudEnclosure: EnclosureBuilder = {
  buildGeometry(center: THREE.Vector3, halfW: number, halfH: number): number[] {
    const arcRadius = Math.min(halfW, halfH) * 0.25;

    const TL = new THREE.Vector3(center.x - halfW, 0, center.z - halfH);
    const TR = new THREE.Vector3(center.x + halfW, 0, center.z - halfH);
    const BR = new THREE.Vector3(center.x + halfW, 0, center.z + halfH);
    const BL = new THREE.Vector3(center.x - halfW, 0, center.z + halfH);

    const edges: Array<[THREE.Vector3, THREE.Vector3, THREE.Vector3]> = [
      [TL, TR, new THREE.Vector3(0, 0, -1)],
      [TR, BR, new THREE.Vector3(1, 0,  0)],
      [BR, BL, new THREE.Vector3(0, 0,  1)],
      [BL, TL, new THREE.Vector3(-1, 0, 0)],
    ];

    const positions: number[] = [];
    for (const [a, b, outward] of edges) {
      const edgeLen  = a.distanceTo(b);
      const numBumps = Math.max(1, Math.round(edgeLen / (2 * arcRadius)));
      const bumpLen  = edgeLen / numBumps;
      const r        = bumpLen / 2;
      const edgeDir  = new THREE.Vector3().subVectors(b, a).normalize();

      for (let i = 0; i < numBumps; i++) {
        const arcCenter = a.clone().addScaledVector(edgeDir, (i + 0.5) * bumpLen);
        const bumpStart = a.clone().addScaledVector(edgeDir, i * bumpLen);
        const fromVec   = new THREE.Vector3().subVectors(bumpStart, arcCenter);

        let prev = bumpStart.clone();
        for (let s = 1; s <= CLOUD_ARC_SEGMENTS; s++) {
          const t  = (s / CLOUD_ARC_SEGMENTS) * Math.PI;
          const nx = arcCenter.x + fromVec.x * Math.cos(t) + outward.x * r * Math.sin(t);
          const nz = arcCenter.z + fromVec.z * Math.cos(t) + outward.z * r * Math.sin(t);
          const next = new THREE.Vector3(nx, 0, nz);
          positions.push(prev.x, 0, prev.z, next.x, 0, next.z);
          prev = next;
        }
      }
    }

    return positions;
  },

  getAttachmentPoint(
    center: THREE.Vector3,
    halfW: number,
    halfH: number,
    dir: THREE.Vector3,
  ): THREE.Vector3 {
    const tx = Math.abs(dir.x) > 1e-10 ? halfW / Math.abs(dir.x) : Infinity;
    const tz = Math.abs(dir.z) > 1e-10 ? halfH / Math.abs(dir.z) : Infinity;
    const t  = Math.min(tx, tz);
    return new THREE.Vector3(center.x + dir.x * t, 0, center.z + dir.z * t);
  },
};

/** Rectangular enclosure — a plain axis-aligned rectangle centred on `center`. */
export const RectEnclosure: EnclosureBuilder = {
  buildGeometry(center: THREE.Vector3, halfW: number, halfH: number): number[] {
    const TL = new THREE.Vector3(center.x - halfW, 0, center.z - halfH);
    const TR = new THREE.Vector3(center.x + halfW, 0, center.z - halfH);
    const BR = new THREE.Vector3(center.x + halfW, 0, center.z + halfH);
    const BL = new THREE.Vector3(center.x - halfW, 0, center.z + halfH);
    return [
      TL.x, 0, TL.z, TR.x, 0, TR.z,
      TR.x, 0, TR.z, BR.x, 0, BR.z,
      BR.x, 0, BR.z, BL.x, 0, BL.z,
      BL.x, 0, BL.z, TL.x, 0, TL.z,
    ];
  },

  getAttachmentPoint(
    center: THREE.Vector3,
    halfW: number,
    halfH: number,
    dir: THREE.Vector3,
  ): THREE.Vector3 {
    const tx = Math.abs(dir.x) > 1e-10 ? halfW / Math.abs(dir.x) : Infinity;
    const tz = Math.abs(dir.z) > 1e-10 ? halfH / Math.abs(dir.z) : Infinity;
    const t  = Math.min(tx, tz);
    return new THREE.Vector3(center.x + dir.x * t, 0, center.z + dir.z * t);
  },
};

/** Elliptical enclosure — an ellipse approximated with line segments centred on `center`. */
export const CircleEnclosure: EnclosureBuilder = {
  buildGeometry(center: THREE.Vector3, halfW: number, halfH: number): number[] {
    const segments = 32;
    const positions: number[] = [];
    for (let i = 0; i < segments; i++) {
      const a0 = (i       / segments) * Math.PI * 2;
      const a1 = ((i + 1) / segments) * Math.PI * 2;
      positions.push(
        center.x + Math.cos(a0) * halfW, 0, center.z + Math.sin(a0) * halfH,
        center.x + Math.cos(a1) * halfW, 0, center.z + Math.sin(a1) * halfH,
      );
    }
    return positions;
  },

  getAttachmentPoint(
    center: THREE.Vector3,
    halfW: number,
    halfH: number,
    dir: THREE.Vector3,
  ): THREE.Vector3 {
    // Ellipse boundary: point where the ray from center in direction dir intersects
    // x²/halfW² + z²/halfH² = 1. For unit dir: s = 1/sqrt((dx/halfW)²+(dz/halfH)²).
    const dxa = dir.x / halfW;
    const dza = dir.z / halfH;
    const len = Math.sqrt(dxa * dxa + dza * dza);
    const s   = len > 1e-10 ? 1 / len : halfW;
    return new THREE.Vector3(center.x + dir.x * s, 0, center.z + dir.z * s);
  },
};
