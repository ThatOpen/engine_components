import * as THREE from "three";

// Makes approx bounding box by rotating the object so that it's longest edge
// is aligned with the axes. Return the matrix that needs to be multiplied to
// a 1x1x1 box with its bottom corner at the origin to become the OBB
export function makeApproxBoundingBox(
  position: ArrayLike<number>,
  index: ArrayLike<number>
) {
  let longestDistance = -Number.MAX_VALUE;
  const longestStart = new THREE.Vector3();
  const longestEnd = new THREE.Vector3();
  const longestVector = new THREE.Vector3();

  const v1 = new THREE.Vector3();
  const v2 = new THREE.Vector3();
  const v3 = new THREE.Vector3();

  for (let i = 0; i < index.length; i += 3) {
    const i1 = index[i] * 3;
    const i2 = index[i + 1] * 3;
    const i3 = index[i + 2] * 3;

    const x1 = position[i1];
    const y1 = position[i1 + 1];
    const z1 = position[i1 + 2];
    v1.set(x1, y1, z1);

    const x2 = position[i2];
    const y2 = position[i2 + 1];
    const z2 = position[i2 + 2];
    v2.set(x2, y2, z2);

    const x3 = position[i3];
    const y3 = position[i3 + 1];
    const z3 = position[i3 + 2];
    v3.set(x3, y3, z3);

    const d1 = v1.distanceTo(v2);
    const d2 = v2.distanceTo(v3);
    const d3 = v3.distanceTo(v1);

    if (d1 > longestDistance) {
      longestDistance = d1;
      longestStart.copy(v1);
      longestEnd.copy(v2);
    }

    if (d2 > longestDistance) {
      longestDistance = d2;
      longestStart.copy(v2);
      longestEnd.copy(v3);
    }

    if (d3 > longestDistance) {
      longestDistance = d3;
      longestStart.copy(v3);
      longestEnd.copy(v1);
    }
  }

  longestVector.subVectors(longestEnd, longestStart);
  longestVector.normalize();
  longestVector.y = 0;
  longestVector.normalize();

  const isVertical = longestVector.x < 0.1 && longestVector.z < 0.1;
  const angle = isVertical ? 0 : Math.atan2(longestVector.x, longestVector.z);
  console.log((angle * 180) / Math.PI);

  const rotation = new THREE.Matrix4().makeRotationY(-angle);
  const v = new THREE.Vector3();

  const min = -Number.MAX_VALUE;
  const max = Number.MAX_VALUE;
  const minMax = new Float32Array([max, max, max, min, min, min]);

  for (let i = 0; i < position.length; i += 3) {
    v.set(position[i], position[i + 1], position[i + 2]);

    v.applyMatrix4(rotation);

    const { x, y, z } = v;

    if (x < minMax[0]) minMax[0] = x;
    if (y < minMax[1]) minMax[1] = y;
    if (z < minMax[2]) minMax[2] = z;
    if (x > minMax[3]) minMax[3] = x;
    if (y > minMax[4]) minMax[4] = y;
    if (z > minMax[5]) minMax[5] = z;
  }

  const translation = new THREE.Matrix4().makeTranslation(
    minMax[0],
    minMax[1],
    minMax[2]
  );
  const scale = new THREE.Matrix4().makeScale(
    minMax[3] - minMax[0],
    minMax[4] - minMax[1],
    minMax[5] - minMax[2]
  );

  rotation.invert();

  const result = new THREE.Matrix4();
  result.multiply(rotation).multiply(translation).multiply(scale);
  return result;
}
