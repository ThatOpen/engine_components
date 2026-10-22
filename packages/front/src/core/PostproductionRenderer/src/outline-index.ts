import * as THREE from "three";

/**
 * Full-layout index attributes, one per fragments index array. Fragments may
 * rewrite a tile's GPU index in place to pack its visible runs into one draw
 * call (`userData.compactIndex`), keeping the original layout in
 * `userData.fullIndex`. Outline chunks are offsets into that original layout,
 * so a proxy drawing them through the packed index would outline other items'
 * triangles. The array is shared, not copied.
 */
const fullIndices = new WeakMap<ArrayLike<number>, THREE.BufferAttribute>();

/** The index an outline proxy of this tile geometry must draw its chunks from. */
export function outlineIndex(geometry: THREE.BufferGeometry) {
  const full = geometry.userData?.fullIndex as
    | Uint16Array
    | Uint32Array
    | undefined;
  if (!full) return geometry.index;
  let attribute = fullIndices.get(full);
  if (!attribute) {
    attribute = new THREE.BufferAttribute(full, 1);
    fullIndices.set(full, attribute);
  }
  return attribute;
}
