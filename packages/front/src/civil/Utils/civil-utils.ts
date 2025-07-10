import * as THREE from "three";
import { CivilPoint } from "../Types";

export class CivilUtils {
  static alignmentPercentageToPoint(
    alignment: THREE.Group,
    percentage: number,
  ): CivilPoint | null {
    const v1 = new THREE.Vector3();
    const v2 = new THREE.Vector3();
    const length = this.alignmentLength(alignment);
    const absolutePercentage = percentage * length;
    let currentPercentage = 0;

    alignment.updateWorldMatrix(true, true);

    if (percentage === 1) {
      for (let i = alignment.children.length - 1; i >= 0; i--) {
        const curve = alignment.children[i];
        const points = curve.userData.points as Float32Array;
        if (!points) continue;

        const lastPoint = new THREE.Vector3(
          points[points.length - 3],
          points[points.length - 2],
          points[points.length - 1],
        );

        lastPoint.applyMatrix4(curve.matrixWorld);
        return {
          normal: new THREE.Vector3(),
          point: lastPoint,
          curve: curve as THREE.Line,
          alignment,
        };
      }
    }

    for (const curve of alignment.children) {
      const points = curve.userData.points as Float32Array;
      if (!points) continue;
      for (let i = 0; i < points.length - 3; i += 3) {
        const p1 = v1.set(points[i], points[i + 1], points[i + 2]);
        const p2 = v2.set(points[i + 3], points[i + 4], points[i + 5]);
        const progress = p1.distanceTo(p2);
        if (currentPercentage + progress >= absolutePercentage) {
          // This is the desired curve, now just compute the desired point
          const remaining = absolutePercentage - currentPercentage;
          const normal = p2.clone().sub(p1).normalize();
          const offset = normal.clone().multiplyScalar(remaining);
          p1.add(offset);

          p1.applyMatrix4(curve.matrixWorld);

          return {
            normal,
            point: p1,
            curve: curve as THREE.Line,
            alignment,
          };
        }
        currentPercentage += progress;
      }
    }

    return null;
  }

  static curvePercentageToPoint(
    alignment: THREE.Group,
    curve: THREE.Object3D,
    percentage: number,
  ): CivilPoint | null {
    const v1 = new THREE.Vector3();
    const v2 = new THREE.Vector3();
    const length = this.curveLength(curve);
    const absolutePercentage = percentage * length;
    let currentPercentage = 0;

    const points = curve.userData.points as Float32Array;
    if (!points) {
      throw new Error("No points found in curve");
    }

    for (let i = 0; i < points.length - 3; i += 3) {
      const p1 = v1.set(points[i], points[i + 1], points[i + 2]);
      const p2 = v2.set(points[i + 3], points[i + 4], points[i + 5]);
      const progress = p1.distanceTo(p2);
      if (currentPercentage + progress >= absolutePercentage) {
        // This is the desired segment, now just compute the desired point
        const remaining = absolutePercentage - currentPercentage;
        const normal = p2.clone().sub(p1).normalize();
        const offset = normal.clone().multiplyScalar(remaining);
        p1.add(offset);

        return {
          normal,
          point: p1,
          curve: curve as THREE.Line,
          alignment,
        };
      }
      currentPercentage += progress;
    }

    return null;
  }

  static alignmentLength(alignment: THREE.Group) {
    let length = 0;
    if (alignment.userData.length !== undefined) {
      return alignment.userData.length;
    }
    for (const curve of alignment.children) {
      if ("isLine2" in curve) {
        length += this.curveLength(curve);
      }
    }
    alignment.userData.length = length;
    return length;
  }

  static curveLength(curve: THREE.Object3D) {
    let length = 0;
    if (curve.userData.length !== undefined) {
      return curve.userData.length;
    }
    const v1 = new THREE.Vector3();
    const v2 = new THREE.Vector3();
    const points = curve.userData.points as Float32Array;
    if (!points) {
      throw new Error("No points found in curve");
    }
    // -2 to skip the 2 last coords, and -3 to skip the last point
    for (let i = 0; i < points.length - 2 - 3; i += 3) {
      const p1 = v1.set(points[i], points[i + 1], points[i + 2]);
      const p2 = v2.set(points[i + 3], points[i + 4], points[i + 5]);
      length += p1.distanceTo(p2);
    }
    curve.userData.length = length;
    return length;
  }

  static curvePointToAlignmentPercentage(
    alignment: THREE.Group,
    point: THREE.Vector3,
    targetCurve: THREE.Object3D,
  ) {
    const v1 = new THREE.Vector3();
    const v2 = new THREE.Vector3();
    const length = this.alignmentLength(alignment);
    let currentPercentage = 0;

    alignment.updateWorldMatrix(true, true);

    for (const curve of alignment.children) {
      const points = curve.userData.points as Float32Array;
      if (!points) continue;
      // -3 to skip the last point
      for (let i = 0; i < points.length - 3; i += 3) {
        const p1 = v1.set(points[i], points[i + 1], points[i + 2]);
        const p2 = v2.set(points[i + 3], points[i + 4], points[i + 5]);

        p1.applyMatrix4(curve.matrixWorld);
        p2.applyMatrix4(curve.matrixWorld);

        const progress = p1.distanceTo(p2);

        // Edge case: if there are various segments in he same curve where the start point and end point are aligned,
        // this can become problematic, but it's very rare. Fix when it happens, if it ever happens
        const isFirst = p1.distanceTo(point) < 0.001;
        const isLast = p2.distanceTo(point) < 0.001;
        const isContained = this.isPointbetweenTwoOthers(p1, p2, point);
        if (curve === targetCurve && (isFirst || isLast || isContained)) {
          const offset = p1.distanceTo(point);
          return (currentPercentage + offset) / length;
        }

        currentPercentage += progress;
      }
    }

    return null;
  }

  // Src: https://discourse.threejs.org/t/how-to-determine-wether-a-point-is-between-two-other-points/10047
  static isPointbetweenTwoOthers(
    pA: THREE.Vector3,
    pB: THREE.Vector3,
    pToCheck: THREE.Vector3,
  ) {
    const nvAtoB = new THREE.Vector3();
    nvAtoB.subVectors(pB, pA).normalize();

    const nvAtoC = new THREE.Vector3();
    nvAtoC.subVectors(pToCheck, pA).normalize();

    const nvBtoC = new THREE.Vector3();
    nvBtoC.subVectors(pToCheck, pB).normalize();

    const epsilon = 0.0016;
    const cos90epsi = 1.0 - epsilon;
    return nvAtoB.dot(nvAtoC) > cos90epsi && nvAtoB.dot(nvBtoC) < -cos90epsi;
  }
}
