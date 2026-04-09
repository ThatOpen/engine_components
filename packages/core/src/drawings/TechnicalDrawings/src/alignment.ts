import * as THREE from "three";

/**
 * Computes a local-to-world transformation matrix that maps a technical
 * drawing's local coordinate system onto a target plane in 3D world space.
 *
 * Given three point pairs — each pair being a point on the drawing (local
 * space) and its corresponding point in the 3D world — the function returns
 * the `THREE.Matrix4` that, when applied to the drawing's container, will
 * align the drawing to the target plane.
 *
 * The transformation encodes **translation**, **rotation**, and **uniform
 * scale** (derived from the ratio of world vs drawing distances between the
 * first pair of points, which handles unit mismatches such as mm vs m).
 *
 * @throws If either set of points is collinear (cannot define a plane).
 * @throws If either set contains a degenerate first pair (zero distance).
 *
 * @param drawingPoints - Three non-collinear points in drawing local space.
 * @param worldPoints   - Three corresponding non-collinear points in world space.
 */
export function computeAlignmentMatrix(
  drawingPoints: THREE.Vector3[],
  worldPoints: THREE.Vector3[],
): THREE.Matrix4 {
  if (drawingPoints.length !== 3 || worldPoints.length !== 3) {
    throw new Error("computeAlignmentMatrix requires exactly 3 point pairs.");
  }

  // ── Collinearity validation ──────────────────────────────────────────────
  const checkCollinear = (pts: THREE.Vector3[], label: string) => {
    const v12 = new THREE.Vector3().subVectors(pts[1], pts[0]);
    const v13 = new THREE.Vector3().subVectors(pts[2], pts[0]);
    if (new THREE.Vector3().crossVectors(v12, v13).length() < 1e-6) {
      throw new Error(
        `${label} points are collinear — three non-collinear points are required to define a plane.`,
      );
    }
  };

  checkCollinear(drawingPoints, "Drawing");
  checkCollinear(worldPoints, "World");

  // ── Orthonormal frame from 3 points ──────────────────────────────────────
  // Returns only the rotation part (no translation, no scale).
  const buildRotation = (
    p1: THREE.Vector3,
    p2: THREE.Vector3,
    p3: THREE.Vector3,
  ): THREE.Matrix4 => {
    const v12 = new THREE.Vector3().subVectors(p2, p1);
    const v13 = new THREE.Vector3().subVectors(p3, p1);
    const axisX = v12.clone().normalize();
    const axisY = new THREE.Vector3().crossVectors(v12, v13).normalize();
    const axisZ = new THREE.Vector3().crossVectors(axisX, axisY).normalize();
    return new THREE.Matrix4().makeBasis(axisX, axisY, axisZ);
  };

  const R_drawing = buildRotation(drawingPoints[0], drawingPoints[1], drawingPoints[2]);
  const R_world = buildRotation(worldPoints[0], worldPoints[1], worldPoints[2]);

  // Net rotation: R = R_world * R_drawing^(-1)
  const R = R_world.clone().multiply(R_drawing.clone().invert());

  // ── Uniform scale ────────────────────────────────────────────────────────
  const distDrawing = drawingPoints[0].distanceTo(drawingPoints[1]);
  if (distDrawing < 1e-10) {
    throw new Error(
      "The first two drawing points are coincident — cannot compute scale.",
    );
  }
  const scale = worldPoints[0].distanceTo(worldPoints[1]) / distDrawing;

  // ── Translation ──────────────────────────────────────────────────────────
  // t = p1_world − R * (scale * p1_drawing)
  const p1Rotated = drawingPoints[0].clone().multiplyScalar(scale).applyMatrix4(R);
  const translation = new THREE.Vector3().subVectors(worldPoints[0], p1Rotated);

  // ── Assemble TRS matrix ──────────────────────────────────────────────────
  const rotation = new THREE.Quaternion().setFromRotationMatrix(R);
  const result = new THREE.Matrix4();
  result.compose(translation, rotation, new THREE.Vector3(scale, scale, scale));
  return result;
}
