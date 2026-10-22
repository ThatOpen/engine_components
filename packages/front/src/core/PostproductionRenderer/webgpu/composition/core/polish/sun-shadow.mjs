// THE SUN'S VIEW OF THE SCENE, FOR THE CAST SHADOWS OF A DRAWING.
//
// 🔴 FLAT, BECAUSE THAT IS WHAT A DRAWING'S SHADOW IS. A sheet prints its shadows as one even tone laid over
// whatever they fall on, with no falloff and no light model, and three's own shadows are a term of a lit
// material's shading: on the flat surfaces a line drawing is made of there is no light for them to take away.
// So the shadow is decided per pixel in the composite (`deferred-look.mjs`), from depth alone: is this point
// the first thing the sun meets along its ray? What answers that is the scene's depth as the sun sees it, and
// this file is where the sun's camera is placed and fitted.
//
// The host states the sun with the WebGL pipeline's names (`SunShadowSettings`):
//
//   towardSun   unit vector from the scene toward the sun, in the world
//   tone        what a shadowed pixel is multiplied by: 1 is no shadow, 0 black
//   bounds      the world box whose geometry casts and receives
//   resolution  the most texels a side of the sun's map may have (4096)
//   groundAt    the height of a plane the shadows also fall on and nothing draws, or null

import * as THREE from "three";

/** What one pass's sun is: its camera, how many texels a side its map has, and whether there is one. */
export function sunStateNew(most = 4096) {
  return {
    on: false,
    /** The side of the target every map is drawn into a corner of, and so the most texels a map can have. */
    most: Math.max(256, Math.min(8192, Math.round(most))),
    camera: new THREE.OrthographicCamera(-1, 1, 1, -1, 0.01, 10),
    side: 256,
    /** Metres one texel of the map covers: what a lookup is pushed off its surface by. */
    texel: 0,
    /** How the last map was fitted, for whoever needs to see why a shadow is as sharp as it is. */
    lastFit: null,
  };
}

const centre = new THREE.Vector3();
const size = new THREE.Vector3();
const toward = new THREE.Vector3();
const point = new THREE.Vector3();
const lowCorner = new THREE.Vector3();
const pixelA = new THREE.Vector3();
const pixelB = new THREE.Vector3();

/**
 * Places the sun's camera for one pass and fits its map to what the pass shows.
 *
 * 🔴 FITTED TO WHAT THE PASS SEES, NOT TO THE WHOLE BOX. Fitted to the box, one texel of the map is the
 * model's size over its side whatever the zoom: fine on a whole sheet, a staircase along every shadow edge
 * close in. Only the surfaces the pass shows receive a shadow, so only they have to be in the map: a caster
 * outside the frame still lands inside it, because the map is taken along the sun's own direction and a caster
 * falls on the same spot of it as its shadow. Depth stays the whole box, so nothing between the sun and the
 * frame is left out.
 *
 * Two fits, both from the camera alone: the whole box when that is already as fine as a pixel of the pass,
 * and otherwise the pass's frame carried through the box's depth. ⚠️ The WebGL pipeline has a third, which
 * reads the pass's own depths back to fit to its surfaces; a WebGPU readback cannot be waited for inside a
 * frame, so close in on a small part of a deep model this map is coarser than that one.
 *
 * @param {object} state  from `sunStateNew`
 * @param {object|null} sun  the host's settings, or null for no sun
 * @param {THREE.Camera} seen  the camera of the pass being shadowed
 * @param {number} seenWidth  the width of that pass, in pixels
 * @param {boolean} reversed  whether depth runs near 1 to far 0
 */
export function sunFit(state, sun, seen, seenWidth, reversed) {
  state.on = !!sun;
  if (!sun) return;
  const most = Math.min(state.most, Math.max(256, Math.min(8192, Math.round(sun.resolution ?? 4096))));
  const camera = state.camera;
  // From the sun's side, looking back at the box's centre, deep enough for its whole diagonal.
  sun.bounds.getCenter(centre);
  const radius = Math.max(1e-3, sun.bounds.getSize(size).length() / 2);
  toward.copy(sun.towardSun).normalize();
  camera.position.copy(centre).addScaledVector(toward, radius * 2);
  // Any `up` that is not the sun's own direction.
  camera.up.set(0, 1, 0);
  if (Math.abs(toward.y) > 0.99) camera.up.set(0, 0, 1);
  camera.lookAt(centre);
  camera.updateMatrixWorld(true);
  const { sides, side, why, width } = sidesFor(camera, sun, seen, seenWidth, reversed, radius, most);
  camera.left = sides[0];
  camera.right = sides[1];
  camera.bottom = sides[2];
  camera.top = sides[3];
  camera.near = radius * 0.5;
  camera.far = radius * 3.5;
  camera.updateProjectionMatrix();
  camera.updateMatrixWorld(true);
  state.side = side;
  state.texel = (camera.right - camera.left) / side;
  state.lastFit = { width, texel: width / side, why };
}

function sidesFor(sunCamera, sun, seen, seenWidth, reversed, radius, most) {
  const whole = [-radius, radius, -radius, radius];
  if (!seen || !(seenWidth > 0)) return { sides: whole, side: most, why: "no pass to fit to", width: 2 * radius };
  seen.updateMatrixWorld();
  // How much of the world one pixel of the pass covers: a texel finer than that shows nothing.
  const pixel = pixelA.set(0, 0, 0.5).unproject(seen).distanceTo(pixelB.set(2 / seenWidth, 0, 0.5).unproject(seen));
  // As many texels as the width covered has pixels of the pass, in powers of two.
  const sideFor = (width) =>
    // `__sunFixedSide`: the control, every map at the most the settings allow.
    !globalThis.__sunFixedSide && Number.isFinite(pixel) && pixel > 0
      ? Math.min(most, Math.max(256, 2 ** Math.ceil(Math.log2(width / pixel))))
      : most;
  const wholly = (why) => ({ sides: whole, side: sideFor(2 * radius), why, width: 2 * radius });
  if ((2 * radius) / most <= pixel) return wholly("the whole box is as fine as the pass");
  // `__sunWholeBox`: the control, every map over the whole box.
  if (globalThis.__sunWholeBox) return wholly("asked for the whole box");

  const intoSun = sunCamera.matrixWorldInverse;
  const { bounds } = sun;
  const all = { lowX: Infinity, highX: -Infinity, lowY: Infinity, highY: -Infinity };
  const framed = { lowX: Infinity, highX: -Infinity, lowY: Infinity, highY: -Infinity };
  const widen = (into) => {
    into.lowX = Math.min(into.lowX, point.x);
    into.highX = Math.max(into.highX, point.x);
    into.lowY = Math.min(into.lowY, point.y);
    into.highY = Math.max(into.highY, point.y);
  };
  let nearestZ = Infinity;
  let farthestZ = -Infinity;
  for (let i = 0; i < 8; i += 1) {
    point.set(i & 1 ? bounds.max.x : bounds.min.x, i & 2 ? bounds.max.y : bounds.min.y, i & 4 ? bounds.max.z : bounds.min.z);
    // The box's depth range as the pass's own z, clamped below to what it can see.
    const z = pixelA.copy(point).project(seen).z;
    nearestZ = Math.min(nearestZ, z);
    farthestZ = Math.max(farthestZ, z);
    point.applyMatrix4(intoSun);
    widen(all);
  }
  // Clip depth runs zero to one here, whichever way round.
  for (const z of [Math.max(0, Math.min(1, nearestZ)), Math.max(0, Math.min(1, farthestZ))]) {
    for (const [x, y] of [[-1, -1], [1, -1], [-1, 1], [1, 1]]) {
      point.set(x, y, z).unproject(seen).applyMatrix4(intoSun);
      widen(framed);
    }
  }
  // Where the pass's frame crosses the ground plane, when there is one: those points receive a shadow with no
  // surface drawn under them.
  const groundAt = sun.groundAt ?? null;
  if (groundAt !== null) {
    const nearZ = reversed ? 1 : 0;
    const farZ = reversed ? 0 : 1;
    for (const [x, y] of [[-1, -1], [1, -1], [-1, 1], [1, 1]]) {
      lowCorner.set(x, y, nearZ).unproject(seen);
      point.set(x, y, farZ).unproject(seen);
      const run = point.y - lowCorner.y;
      if (Math.abs(run) < 1e-9) continue;
      const s = (groundAt - lowCorner.y) / run;
      if (s < 0 || s > 1) continue;
      point.sub(lowCorner).multiplyScalar(s).add(lowCorner).applyMatrix4(intoSun);
      widen(framed);
    }
  }
  // A square map over the frame, as wide as its wider side plus a margin for the lookup's own offset, in
  // quarter-doubling steps so a zoom changes it in steps, centred on a whole texel so a pan moves the map a
  // whole number of texels: a map that slides by a fraction makes every shadow edge crawl.
  const lowX = Math.max(framed.lowX, all.lowX);
  const highX = Math.min(framed.highX, all.highX);
  const lowY = Math.max(framed.lowY, all.lowY);
  const highY = Math.min(framed.highY, all.highY);
  if (!(highX > lowX && highY > lowY) || !Number.isFinite(lowX + highX + lowY + highY)) {
    return wholly("the frame falls outside the box");
  }
  const covers = Math.max((highX - lowX) * 1.05, (highY - lowY) * 1.05);
  const side = sideFor(covers);
  // Never finer than a pixel of the pass: the lookup is pushed off its surface by a texel and a half, and below
  // what the pass's own depth can tell apart a facade comes out striped with its own shadow.
  const wanted = Math.max(covers, Number.isFinite(pixel) ? pixel * side : 0);
  const width = Math.min(2 * radius, 2 ** (Math.ceil(Math.log2(wanted) * 4) / 4));
  if (width >= 2 * radius) return wholly("the frame through the box spans the whole box");
  const texel = width / side;
  const snappedCentreX = Math.round((lowX + highX) / 2 / texel) * texel;
  const snappedCentreY = Math.round((lowY + highY) / 2 / texel) * texel;
  return {
    sides: [snappedCentreX - width / 2, snappedCentreX + width / 2, snappedCentreY - width / 2, snappedCentreY + width / 2],
    side,
    why: "fitted to the frame through the box",
    width,
  };
}
