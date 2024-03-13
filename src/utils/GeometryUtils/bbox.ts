import * as THREE from "three";
import { ConvexHull } from "three/examples/jsm/math/ConvexHull";

// src: https://github.com/Mugen87/yuka/blob/844b2581d29de0105336be80eb2fe4cc8dca4ede/src/math/OBB.js#L409-L597

type EigenResult = {
  unitary: THREE.Matrix3;
  diagonal: THREE.Matrix3;
};

const colVal = [2, 2, 1];
const rowVal = [1, 0, 0];

function getElementIndex(column: number, row: number) {
  return column * 3 + row;
}

function frobeniusNorm(matrix: THREE.Matrix3) {
  const e = matrix.elements;
  let norm = 0;

  for (let i = 0; i < 9; i++) {
    norm += e[i] * e[i];
  }

  return Math.sqrt(norm);
}

function offDiagonalFrobeniusNorm(source: THREE.Matrix3) {
  const e = source.elements;
  let norm = 0;

  for (let i = 0; i < 3; i++) {
    const t = e[getElementIndex(colVal[i], rowVal[i])];
    norm += 2 * t * t; // multiply the result by two since the matrix is symetric
  }

  return Math.sqrt(norm);
}

function shurDecomposition(source: THREE.Matrix3, result: THREE.Matrix3) {
  let maxDiagonal = 0;
  let rotAxis = 1;

  // find pivot (rotAxis) based on largest off-diagonal term

  const e = source.elements;

  for (let i = 0; i < 3; i++) {
    const t = Math.abs(e[getElementIndex(colVal[i], rowVal[i])]);

    if (t > maxDiagonal) {
      maxDiagonal = t;
      rotAxis = i;
    }
  }

  let c = 1;
  let s = 0;

  const p = rowVal[rotAxis];
  const q = colVal[rotAxis];

  if (Math.abs(e[getElementIndex(q, p)]) > Number.EPSILON) {
    const qq = e[getElementIndex(q, q)];
    const pp = e[getElementIndex(p, p)];
    const qp = e[getElementIndex(q, p)];

    const tau = (qq - pp) / 2 / qp;

    let t;

    if (tau < 0) {
      t = -1 / (-tau + Math.sqrt(1 + tau * tau));
    } else {
      t = 1 / (tau + Math.sqrt(1.0 + tau * tau));
    }

    c = 1.0 / Math.sqrt(1.0 + t * t);
    s = t * c;
  }

  result.identity();

  result.elements[getElementIndex(p, p)] = c;
  result.elements[getElementIndex(q, q)] = c;
  result.elements[getElementIndex(q, p)] = s;
  result.elements[getElementIndex(p, q)] = -s;

  return result;
}

function eigenDecomposition(source: THREE.Matrix3, result: EigenResult) {
  let count = 0;
  let sweep = 0;

  const maxSweeps = 10;

  result.unitary.identity();
  result.diagonal.copy(source);

  const unitaryMatrix = result.unitary;
  const diagonalMatrix = result.diagonal;

  const m1 = new THREE.Matrix3();
  const m2 = new THREE.Matrix3();

  const epsilon = Number.EPSILON * frobeniusNorm(diagonalMatrix);

  while (
    sweep < maxSweeps &&
    offDiagonalFrobeniusNorm(diagonalMatrix) > epsilon
  ) {
    shurDecomposition(diagonalMatrix, m1);
    m2.copy(m1).transpose();
    diagonalMatrix.multiply(m1);
    diagonalMatrix.premultiply(m2);
    unitaryMatrix.multiply(m1);

    if (++count > 2) {
      sweep++;
      count = 0;
    }
  }

  return result;
}

export function obbFromPoints(vertices: ArrayLike<number>) {
  const points: THREE.Vector3[] = [];
  for (let i = 0; i < vertices.length - 2; i += 3) {
    const x = vertices[i];
    const y = vertices[i + 1];
    const z = vertices[i + 2];
    points.push(new THREE.Vector3(x, y, z));
  }

  const convexHull = new ConvexHull();
  convexHull.setFromPoints(points);

  const eigenDecomposed: EigenResult = {
    unitary: new THREE.Matrix3(),
    diagonal: new THREE.Matrix3(),
  };

  // 1. iterate over all faces of the convex hull and triangulate

  const faces = convexHull.faces;
  const edges = [];
  const triangles = [];

  for (let i = 0, il = faces.length; i < il; i++) {
    const face = faces[i];
    let edge = face.edge;

    edges.length = 0;

    // gather edges

    do {
      edges.push(edge);

      edge = edge.next;
    } while (edge !== face.edge);

    // triangulate

    const triangleCount = edges.length - 2;

    for (let j = 1, jl = triangleCount; j <= jl; j++) {
      const v1 = edges[0].vertex;
      const v2 = edges[j + 0].vertex;
      const v3 = edges[j + 1].vertex;

      triangles.push(v1.point.x, v1.point.y, v1.point.z);
      triangles.push(v2.point.x, v2.point.y, v2.point.z);
      triangles.push(v3.point.x, v3.point.y, v3.point.z);
    }
  }

  // 2. build covariance matrix

  const p = new THREE.Vector3();
  const q = new THREE.Vector3();
  const r = new THREE.Vector3();

  const qp = new THREE.Vector3();
  const rp = new THREE.Vector3();

  const v = new THREE.Vector3();

  const mean = new THREE.Vector3();
  const weightedMean = new THREE.Vector3();
  let areaSum = 0;

  let cxx = 0;
  let cxy = 0;
  let cxz = 0;
  let cyy = 0;
  let cyz = 0;
  let czz = 0;

  for (let i = 0, l = triangles.length; i < l; i += 9) {
    p.fromArray(triangles, i);
    q.fromArray(triangles, i + 3);
    r.fromArray(triangles, i + 6);

    mean.set(0, 0, 0);
    mean.add(p).add(q).add(r).divideScalar(3);

    qp.subVectors(q, p);
    rp.subVectors(r, p);

    const area = v.crossVectors(qp, rp).length() / 2; // .length() represents the frobenius norm here
    weightedMean.add(v.copy(mean).multiplyScalar(area));

    areaSum += area;

    cxx +=
      (9.0 * mean.x * mean.x + p.x * p.x + q.x * q.x + r.x * r.x) * (area / 12);
    cxy +=
      (9.0 * mean.x * mean.y + p.x * p.y + q.x * q.y + r.x * r.y) * (area / 12);
    cxz +=
      (9.0 * mean.x * mean.z + p.x * p.z + q.x * q.z + r.x * r.z) * (area / 12);
    cyy +=
      (9.0 * mean.y * mean.y + p.y * p.y + q.y * q.y + r.y * r.y) * (area / 12);
    cyz +=
      (9.0 * mean.y * mean.z + p.y * p.z + q.y * q.z + r.y * r.z) * (area / 12);
    czz +=
      (9.0 * mean.z * mean.z + p.z * p.z + q.z * q.z + r.z * r.z) * (area / 12);
  }

  weightedMean.divideScalar(areaSum);

  cxx /= areaSum;
  cxy /= areaSum;
  cxz /= areaSum;
  cyy /= areaSum;
  cyz /= areaSum;
  czz /= areaSum;

  cxx -= weightedMean.x * weightedMean.x;
  cxy -= weightedMean.x * weightedMean.y;
  cxz -= weightedMean.x * weightedMean.z;
  cyy -= weightedMean.y * weightedMean.y;
  cyz -= weightedMean.y * weightedMean.z;
  czz -= weightedMean.z * weightedMean.z;

  const covarianceMatrix = new THREE.Matrix3();

  covarianceMatrix.elements[0] = cxx;
  covarianceMatrix.elements[1] = cxy;
  covarianceMatrix.elements[2] = cxz;
  covarianceMatrix.elements[3] = cxy;
  covarianceMatrix.elements[4] = cyy;
  covarianceMatrix.elements[5] = cyz;
  covarianceMatrix.elements[6] = cxz;
  covarianceMatrix.elements[7] = cyz;
  covarianceMatrix.elements[8] = czz;

  // 3. compute rotation, center and half sizes

  eigenDecomposition(covarianceMatrix, eigenDecomposed);

  const unitary = eigenDecomposed.unitary;

  const v1 = new THREE.Vector3();
  const v2 = new THREE.Vector3();
  const v3 = new THREE.Vector3();

  unitary.extractBasis(v1, v2, v3);

  let u1 = -Infinity;
  let u2 = -Infinity;
  let u3 = -Infinity;
  let l1 = Infinity;
  let l2 = Infinity;
  let l3 = Infinity;

  for (let i = 0, l = points.length; i < l; i++) {
    const p = points[i];

    u1 = Math.max(v1.dot(p), u1);
    u2 = Math.max(v2.dot(p), u2);
    u3 = Math.max(v3.dot(p), u3);

    l1 = Math.min(v1.dot(p), l1);
    l2 = Math.min(v2.dot(p), l2);
    l3 = Math.min(v3.dot(p), l3);
  }

  v1.multiplyScalar(0.5 * (l1 + u1));
  v2.multiplyScalar(0.5 * (l2 + u2));
  v3.multiplyScalar(0.5 * (l3 + u3));

  // center

  const center = new THREE.Vector3();
  const halfSizes = new THREE.Vector3();
  const rotation = new THREE.Matrix3();

  center.add(v1).add(v2).add(v3);

  halfSizes.x = u1 - l1;
  halfSizes.y = u2 - l2;
  halfSizes.z = u3 - l3;

  // halfSizes

  halfSizes.multiplyScalar(0.5);

  // rotation

  rotation.copy(unitary);

  // Whole matrix to be multiplied by a 1x1x1 box with one of
  // its lower conrners at the origin

  const { x, y, z } = halfSizes;

  const scale = new THREE.Matrix4();
  scale.makeScale(x * 2, y * 2, z * 2);
  const offset = new THREE.Matrix4();
  offset.makeTranslation(-x, -y, -z);
  const translation = new THREE.Matrix4();
  translation.makeTranslation(center.x, center.y, center.z);
  const rot = new THREE.Matrix4();
  rot.setFromMatrix3(rotation);

  const transformation = new THREE.Matrix4();
  transformation.multiply(translation);
  transformation.multiply(rot);
  transformation.multiply(offset);
  transformation.multiply(scale);

  return { center, halfSizes, rotation, transformation };
}
