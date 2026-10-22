// THE WEBGL DEFERRED COMPOSITE, IN TSL: THE LOOK A COMPONENTS WORLD HAS UNDER WEBGPU.
//
// 🔴 THE SAME COMPOSITE AS WEBGL, NOT THE OLDER CUES. Antonio, 2026-09-13: *"when somebody sets PEN it
// should look THE SAME as in webgl (with better performance). With PEN_SHADOWS, edges with AO, etc. And for
// both the perspective and the orthographic camera"* (translated), with the WebGL DEFERRED pipeline as the
// reference. The reference is the WebGL combined composite pass, and every block
// below names the step of it that it reproduces. `hints.mjs` and `quill.mjs` stay as their own
// pipeline has them; they differ from this in ways that show on screen:
//
//   - the contour here comes from the face id ALONE, a symmetric seed plus a distance coverage, and inks
//     the background side of a silhouette too. `quill.mjs` thresholds a depth jump and a one-sided id step.
//   - the sheen here is a LINEAR remap of gloss + highlight between its floor and ceiling. `hints.mjs`
//     puts a smoothstep there.
//   - the tonal shade and the sheen read a real normal channel, as the WebGL G-buffer does, and they apply
//     to the paper styles too: WebGL does not gate them by style.
//   - the shaded colour is tonemapped (Narkowicz ACES) and the frame is gamma-encoded (2.2) HERE, so the
//     pipeline mounting this must switch its own output transform off.
//
// 🔴 THE SETTINGS CARRY THE WEBGL NAMES, because they ARE that composite's settings: a panel written against
// `deferred.composite.settings` under WebGL drives this one unchanged. Most of them are uniforms re-read
// every frame, as WebGL re-reads its own. Three decide what is COMPILED instead, and changing them means
// building the node again: `colorEnabled` (colour or paper), `contourEnabled`, and the line's reach in
// whole pixels (`lineRadius`), which fixes how many seeds the coverage reads. A style that shows no ink
// compiles no contour, which is the saving `portionsRequiredBy` exists for.

import * as THREE from "three";
import {
  Fn, If, float, vec2, vec3, vec4, uv, uniform, screenCoordinate, screenSize, mix, smoothstep, normalize,
  max, abs, pow, clamp, sin, dot, fract, getViewPosition, sRGBTransferOETF, dFdx, dFdy, cross,
} from "three/tsl";
import { sunFit } from "./sun-shadow.mjs";

/** The WebGL composite's defaults (`defaultCompositeSettings`), with its names. A fresh object each call. */
export function deferredLookDefaults() {
  return {
    colorEnabled: true,
    contourEnabled: true,
    aoStrength: 1.0,
    tonalShadingEnabled: true,
    tonalFloor: 0.7,
    edgeColor: new THREE.Color(0, 0, 0),
    paperColor: new THREE.Color(1, 1, 1),
    edgeStrength: 0.8,
    edgeHalfWidth: 0.6,
    edgeAA: 0.7,
    glossExp: 10,
    glossFactor: 0.2,
    fresnelExp: 7,
    fresnelFactor: 0.0,
    sheenOutMin: 0.0,
    sheenOutMax: 0.5,
    sheenColor: new THREE.Color(1, 1, 1),
    ditherAmount: 1.0 / 255.0,
    // Gradient reflection (not in the WebGL composite; 0 = off, so the look above is unchanged by default).
    reflectionFactor: 0.0,
    reflectionPower: 5,
    reflectionF0: 0.04,
    reflectionTop: new THREE.Color(1, 1, 1),
    reflectionBottom: new THREE.Color(0.32, 0.34, 0.38),
  };
}

/** WebGL's `MAX_EDGE_RADIUS`: the widest window the contour reads, in pixels. */
export const MAX_LINE_RADIUS = 6;

/**
 * How far the contour looks for a seed: the first step of 1, √2, 2, 3, 4, 5, 6 that covers the band's outer
 * edge `edgeHalfWidth + edgeAA`, which is where the coverage reaches zero. Seeds are read strictly inside it,
 * so the result is the same as WebGL's window (`radius = ceil(...)`, 1..6) and the cost is not: the √2 step
 * keeps the default band (0.6 + 0.7) at the centre and its four neighbours, as before. This, and not the
 * width, is what gets compiled.
 *
 * 🔴 THE WIDTH ITSELF IS A UNIFORM. It used to be compiled in, with a fixed 5×5 window, which is the
 * window WebGL had before its own was widened: a line never came out wider than about 5 px whatever was
 * asked, and a sheet drawn at paper weights changes the width at every zoom, so every zoom also compiled a
 * new pipeline. Measured on school, sheet 4 in paper: the projection line 4 → 9 px from ×8,000 to ×20,000
 * under WebGL, 4 → 5 px here, and 3 compiles for 3 zooms. Now a width only recompiles when it crosses a
 * step, seven shapes at most, and a host keeps those.
 * ⚠️ `webgpu-postproduction.ts` (components) repeats these steps to decide when to remount; keep them the same.
 */
export function lineRadius(settings) {
  const outer = settings.edgeHalfWidth + settings.edgeAA;
  for (const step of LINE_STEPS) if (outer <= step) return step;
  return MAX_LINE_RADIUS;
}
const LINE_STEPS = [1, Math.SQRT2, 2, 3, 4, 5, MAX_LINE_RADIUS];

/** Half a byte: two face ids read back from an 8-bit channel are different faces past this. */
const ID_STEP = 0.5 / 255;

/**
 * Knobs read when the composite is BUILT (a change needs a remount).
 *
 * `emptyFromFace`: the contour reads the depth only where the face texel still holds the attachment's clear.
 * three clears every MRT attachment but the first to (0, 0, 0, 1), so a texel holding anything else was drawn
 * and cannot be empty; only a texel that still reads (0, 0, 0, 1) can be, and there the depth decides as
 * before. Same lines, and on a large federation close up the 13 depth taps per pixel were the cost: the
 * contour was 5-8 painted frames a second at 2880x1688, the one-byte face (no depth taps) won most of it back.
 * ON BY DEFAULT: 0 pixels differ on a still frame and +13 % painted frames close up. `false` is the control
 * (`?emptyFromFace=0`); a host mounts the composite before the facade reads its query, so the control needs a
 * remount after it is set.
 */
export const LOOK_KNOBS = { emptyFromFace: true };

/** Narkowicz ACES rational fit, input clamped at zero first as WebGL does (a negative channel hue-shifts). */
const narkowiczAces = (x) => {
  const c = max(x, vec3(0));
  return clamp(c.mul(c.mul(2.51).add(0.03)).div(c.mul(c.mul(2.43).add(0.59)).add(0.14)), 0, 1);
};

/**
 * Builds the composite over a scene pass.
 *
 * @param {object} options
 * @param {object} options.colourTex  the scene pass's colour texture node (linear)
 * @param {object} options.depthImage   the scene pass's depth texture node
 * @param {object} options.normalTex  RGB = view normal × 0.5 + 0.5
 * @param {object|null} options.faceTex  RGB = face id, A = role (1 translucent); null compiles no contour
 * @param {object|null} options.ao    the occlusion as a float node; null when the frame shows no shadows
 * @param {THREE.Camera} options.camera
 * @param {object} options.renderer  read for its depth convention
 * @param {object} options.settings  `deferredLookDefaults()`-shaped, read live every frame
 * @param {object|null} options.view  what the VIEW being drawn says beyond its look, read live every frame, with
 *   the WebGL pipeline's names (`DeferredPipelineSettings`): `crop` (`{ centre, right, up, width, height }`, where
 *   the model is clipped, so the contour draws no line along it) and `background` (the same plus `sky`, `horizon`
 *   and `ground`, painted where the pass has no model) and `sunShadow` (see `sun-shadow.mjs`). Null compiles
 *   none of them in.
 * @param {object|null} options.sunDepth  the depth texture node of the sun's pass, and `options.sunState` what
 *   that pass draws with (`sunStateNew`), fitted here before each frame. Both or neither.
 */
export function withDeferredLook({
  colourTex, depthImage, normalTex = null, faceTex = null, faceHasRole = true, ao = null, camera, renderer, settings,
  pageColour = null, view = null, sunDepth = null, sunState = null, seedDistance = null, sceneScale = 1,
}) {
  const ortho = camera?.isOrthographicCamera === true;
  const reversed = renderer?.reversedDepthBuffer === true;
  const paper = settings.colorEnabled !== true;
  const inks = settings.contourEnabled === true && faceTex !== null;
  const reach = lineRadius(settings);
  // ⚠️ ALSO THE GLOBAL ONE: a host can reach this module through a second path (components' alias to the
  // system sources against the facade's own import), and then holds a second `LOOK_KNOBS` the facade never set.
  const emptyFromFace = (globalThis.__lookKnobs ?? LOOK_KNOBS).emptyFromFace === true;

  const unprojectMatrix = uniform(new THREE.Matrix4());
  const aoStrength = uniform(settings.aoStrength);
  const tonalEnabled = uniform(settings.tonalShadingEnabled ? 1 : 0);
  const tonalFloor = uniform(settings.tonalFloor);
  const outlineTint = uniform(settings.edgeColor);
  // The paper a pen style prints its surfaces in (linear), white unless the host says another ground: a plan looked at
  // live over a dark world (`paperColor`, the WebGL composite's same setting). Read live, as the ink is.
  const paperTint = uniform(settings.paperColor ?? new THREE.Color(1, 1, 1));
  const edgeStrength = uniform(settings.edgeStrength);
  const edgeAA = uniform(settings.edgeAA);
  const halfWidth = uniform(settings.edgeHalfWidth);
  const glossExp = uniform(settings.glossExp);
  const glossFactor = uniform(settings.glossFactor);
  const fresnelExp = uniform(settings.fresnelExp);
  const fresnelFactor = uniform(settings.fresnelFactor);
  const sheenOutMin = uniform(settings.sheenOutMin);
  const sheenOutMax = uniform(settings.sheenOutMax);
  const sheenColour = uniform(settings.sheenColor);
  const ditherAmount = uniform(settings.ditherAmount);
  const reflectionFactor = uniform(settings.reflectionFactor ?? 0);
  const reflectionPower = uniform(settings.reflectionPower ?? 5);
  const reflectionF0 = uniform(settings.reflectionF0 ?? 0.04);
  const reflectionTop = uniform(settings.reflectionTop ?? new THREE.Color(1, 1, 1));
  const reflectionBottom = uniform(settings.reflectionBottom ?? new THREE.Color(0.32, 0.34, 0.38));
  // The camera's rotation, every frame (the reflection is read in world space; `viewToWorld` below is only kept
  // current when there is a view).
  const eyeToWorld = uniform(new THREE.Matrix4());
  // What an opaque canvas shows where WebGL's transparent one lets the page through (see the background).
  const page = pageColour ? uniform(pageColour) : null;
  // 🔴 WHAT A TRANSPARENT PIXEL CARRIES IS THE HOST'S CLEAR COLOUR, as in WebGL, and not black. Under WebGPU the
  // scene pass clears with the colour premultiplied by its alpha, so a clear of paper white at no opacity reached
  // here as (0, 0, 0, 0). Invisible where it lies, but a photograph is SAMPLED: every filtered read across the
  // edge of what was drawn mixed that black in, and a view cut by its crop came out framed by a grey line on the
  // sheet (racbasic's A104 details). WebGL's capture passes its clear through untouched, (255, 255, 255, 0).
  const clearRgb = uniform(new THREE.Vector3(0, 0, 0));
  const clearRead = new THREE.Color();

  // --- What the view says: its crop and its sky (see `view` above) ---
  //
  // 🔴 A CROP DRAWS NO LINE OF ITS OWN. The model is clipped at the crop, and to the contour a surface that stops
  // there against nothing is a silhouette: every view whose model reaches its crop came out framed. Given the
  // crop's rectangle on the frame, the contour neither starts a line outside it nor across its edge. The whole
  // frame and a margin when the view has none, so nothing is outside it.
  const cropOnFrame = uniform(new THREE.Vector4(-1, -1, 2, 2));
  const skyOn = uniform(0);
  const skyColour = uniform(new THREE.Vector3());
  const horizonColour = uniform(new THREE.Vector3());
  const groundColour = uniform(new THREE.Vector3());
  const viewToWorld = uniform(new THREE.Matrix4());
  const cropCentre = uniform(new THREE.Vector3());
  const cropRight = uniform(new THREE.Vector3(1, 0, 0));
  const cropUp = uniform(new THREE.Vector3(0, 1, 0));
  const cropHalf = uniform(new THREE.Vector2());
  const skyTop = uniform(0);
  const skyBottom = uniform(0);
  const orthographic = uniform(ortho ? 1 : 0);
  const projectionScale = uniform(new THREE.Vector2(1, 1));
  const projectionOffset = uniform(new THREE.Vector2(0, 0));
  const nearAt = uniform(0.1);
  const inCrop = (coord) => coord.x.greaterThanEqual(cropOnFrame.x).and(coord.y.greaterThanEqual(cropOnFrame.y))
    .and(coord.x.lessThanEqual(cropOnFrame.z)).and(coord.y.lessThanEqual(cropOnFrame.w));
  /**
   * The view-space point of a frame position at a distance, exact for an OFF-CENTRE frustum too: a sheet is
   * photographed in pieces, each through a camera cropped to its region, and the symmetric formula puts every
   * pixel metres from where it is.
   */
  const viewPointAt = (coord, distance) => {
    // The frame's `v` runs down here and clip space's `y` runs up.
    const ndc = vec2(coord.x, coord.y.oneMinus()).mul(2).sub(1);
    const flat = vec2(ndc.sub(projectionOffset).div(projectionScale));
    const deep = vec2(ndc.add(projectionOffset).div(projectionScale).mul(distance));
    return vec3(mix(deep, flat, orthographic), float(distance).negate());
  };
  /** The view's sky behind the model at a frame position, and whether there is any: none outside the crop. */
  const skyAt = (coord) => {
    const world = viewToWorld.mul(vec4(viewPointAt(coord, nearAt), 1)).xyz;
    const fromCentre = world.sub(cropCentre);
    const inside = abs(dot(fromCentre, cropRight)).lessThanEqual(cropHalf.x)
      .and(abs(dot(fromCentre, cropUp)).lessThanEqual(cropHalf.y));
    const height = world.y;
    const above = mix(horizonColour, skyColour,
      skyTop.greaterThan(0).select(clamp(height.div(skyTop), 0, 1), float(1)));
    const below = mix(horizonColour, groundColour,
      skyBottom.lessThan(0).select(clamp(height.div(skyBottom), 0, 1), float(1)));
    const colour = height.greaterThanEqual(0).select(above, below);
    return vec4(colour, inside.select(skyOn, float(0)));
  };

  // --- The sun's cast shadow (see `sun-shadow.mjs`): a depth map seen from the sun and one flat tone ---
  const sunOn = uniform(0);
  const sunTone = uniform(1);
  const viewToSunClip = uniform(new THREE.Matrix4());
  const viewToSunView = uniform(new THREE.Matrix4());
  // The map is the first `side` texels each way of a larger target: what its lookup is scaled by.
  const sunShare = uniform(1);
  const sunNear = uniform(0.01);
  const sunFar = uniform(10);
  // Metres the lookup is pushed along the normal, against acne, and metres of slack in the comparison.
  const sunNormalBias = uniform(0);
  const sunBias = uniform(0);
  // The view's shadows also fall on a plane that is not drawn, at this height (world +Y).
  const groundOn = uniform(0);
  const groundAt = uniform(0);
  const nearDepth = reversed ? 1 : 0;
  const farDepth = reversed ? 0 : 1;
  /** The view-space point of a frame position at a depth of the buffer, exact for an off-centre frustum too. */
  const viewPointOf = (coord, depth) => getViewPosition(coord, depth, unprojectMatrix);
  /**
   * Whether something the sun's map holds is nearer the sun than this view-space point. A point outside the
   * map, or over a texel the map never wrote (cleared to its far end), is lit, not dark.
   */
  const behindTheSun = (eyeSpacePoint, slack) => {
    const clip = viewToSunClip.mul(vec4(eyeSpacePoint, 1));
    const sunMapCoord = clip.xy.div(clip.w).mul(0.5).add(0.5);
    const inside = sunMapCoord.x.greaterThanEqual(0).and(sunMapCoord.x.lessThanEqual(1))
      .and(sunMapCoord.y.greaterThanEqual(0)).and(sunMapCoord.y.lessThanEqual(1));
    // The map's `v` runs down and clip space's `y` runs up.
    const held = sunDepth.sample(vec2(sunMapCoord.x, sunMapCoord.y.oneMinus()).mul(sunShare)).r;
    const along = reversed ? held.oneMinus() : held;
    const mapDistance = sunNear.add(along.mul(sunFar.sub(sunNear)));
    const pointDistance = viewToSunView.mul(vec4(eyeSpacePoint, 1)).z.negate();
    return inside.and(along.lessThan(0.9999)).and(pointDistance.greaterThan(mapDistance.add(slack)));
  };
  /** Whether the sun's shadow falls on the view's ground plane at a frame position. */
  const groundInShadow = (coord) => {
    const near = viewPointOf(coord, float(nearDepth));
    const far = viewPointOf(coord, float(farDepth));
    const nearHeight = viewToWorld.mul(vec4(near, 1)).y;
    const farHeight = viewToWorld.mul(vec4(far, 1)).y;
    const run = farHeight.sub(nearHeight);
    const along = groundAt.sub(nearHeight).div(run);
    const crosses = abs(run).greaterThan(1e-6).and(along.greaterThanEqual(0)).and(along.lessThanEqual(1));
    return sunOn.greaterThan(0.5).and(groundOn.greaterThan(0.5)).and(crosses)
      .and(behindTheSun(mix(near, far, along), sunBias));
  };
  const passSize = new THREE.Vector2();
  const corner = new THREE.Vector3();
  /** The crop's rectangle on the frame, into `out`; the whole frame without a crop or in perspective. */
  const cropOnFrameOf = (crop, out) => {
    out.set(-1, -1, 2, 2);
    if (!crop || camera?.isOrthographicCamera !== true) return;
    camera.updateMatrixWorld();
    let minX = Infinity;
    let minY = Infinity;
    let maxX = -Infinity;
    let maxY = -Infinity;
    for (const sx of [-1, 1]) {
      for (const sy of [-1, 1]) {
        corner.copy(crop.centre)
          .addScaledVector(crop.right, (sx * crop.width) / 2 / crop.right.length())
          .addScaledVector(crop.up, (sy * crop.height) / 2 / crop.up.length())
          .project(camera);
        const x = corner.x * 0.5 + 0.5;
        // Down the frame, as `uv()` runs here.
        const y = 1 - (corner.y * 0.5 + 0.5);
        minX = Math.min(minX, x);
        maxX = Math.max(maxX, x);
        minY = Math.min(minY, y);
        maxY = Math.max(maxY, y);
      }
    }
    if ([minX, minY, maxX, maxY].every(Number.isFinite)) out.set(minX, minY, maxX, maxY);
  };

  const farAt = (coord) => {
    const d = depthImage.sample(coord).r;
    return reversed ? d.lessThanEqual(0) : d.greaterThanEqual(1);
  };

  const node = Fn(() => {
    const here = uv();
    // A texel of the SCENE's targets, which a lower-scale mount draws at a fraction of the canvas.
    const texel = vec2(1).div(sceneScale === 1 ? screenSize : screenSize.mul(sceneScale));
    const scene = colourTex.sample(here).toVar();
    const rawDepth = depthImage.sample(here).r.toVar();
    const far = (reversed ? rawDepth.lessThanEqual(0) : rawDepth.greaterThanEqual(1)).toVar();

    // --- The contour's coverage (edgeCoverage), shared by both branches below ---
    //
    // WebGL clears the id attachment to a "no element" sentinel, marks as a seed every pixel whose id differs
    // from ANY of its four neighbours, and ramps coverage by the distance to the nearest seed in a 5×5
    // window. Two things differ in how this gets there, and neither changes the result:
    //
    //   - the background. A WebGPU pass clears every attachment with the same clear colour, so an empty
    //     pixel's id is that colour and not the sentinel. It is read as the sentinel from the depth instead,
    //     which is also what materials without an id write, so a ground plane meeting the sky draws no line.
    //   - the window. Coverage is `1 − smoothstep(w − aa, w + aa, distance)`, so a seed at or past `w + aa`
    //     contributes exactly nothing, and only the offsets closer than its step (`lineRadius`) are compiled
    //     in, which is `w + aa` or a little past it. At the default
    //     0.6 ± 0.7 that is the centre and its four neighbours: five seeds, thirteen id reads, not 125.
    let coverage = float(0);
    if (inks && seedDistance && !view && faceHasRole) {
      // The same nearest-seed distance, computed once per tile (`contour-tiles.mjs`).
      coverage = float(1)
        .sub(smoothstep(halfWidth.sub(edgeAA), halfWidth.add(edgeAA), seedDistance))
        .toVar();
    } else if (inks) {
      const ids = new Map();
      // 🔴 A ONE-BYTE FACE (no role byte) READS "EMPTY" FROM THE ID ITSELF, NOT FROM THE DEPTH. The cleared
      // attachment is 0 and a material without an id writes 1; both are the sentinel, and streamed ids run
      // 0..253/255, so nothing real reads as 1. That drops the depth tap each of the thirteen id reads paid
      // for the far test, and compares one float instead of three. Id 0 then also reads as empty, which is
      // what a one-byte contour does anyway (a byte of 0 draws no line against the clear).
      const identityAt = (x, y) => {
        const key = `${x},${y}`;
        if (!ids.has(key)) {
          const coord = here.add(texel.mul(vec2(x, y)));
          if (faceHasRole && emptyFromFace) {
            const face = faceTex.sample(coord).toVar();
            const id = face.rgb.toVar();
            const cleared = face.r.max(face.g).max(face.b).lessThan(ID_STEP).and(face.a.greaterThan(0.5));
            // Explicit level: a sample inside a branch that is not uniform has no derivatives to pick one.
            If(cleared, () => {
              const d = depthImage.level(0).sample(coord).r;
              If(reversed ? d.lessThanEqual(0) : d.greaterThanEqual(1), () => id.assign(vec3(1)));
            });
            ids.set(key, id);
          } else if (faceHasRole) {
            ids.set(key, farAt(coord).select(vec3(1), faceTex.sample(coord).rgb).toVar());
          } else {
            const byte = faceTex.sample(coord).r;
            ids.set(key, byte.lessThan(ID_STEP).select(float(1), byte).toVar());
          }
        }
        return ids.get(key);
      };
      const differs = faceHasRole
        ? (a, b) => {
          const d = a.sub(b).abs();
          return d.x.max(d.y).max(d.z).greaterThan(ID_STEP);
        }
        : (a, b) => a.sub(b).abs().greaterThan(ID_STEP);
      // Inside the view's crop, when the host states one: a pixel outside it is no seed, and a neighbour
      // outside it is no difference (see `cropOnFrame`).
      const insides = new Map();
      const insideAt = (x, y) => {
        const key = `${x},${y}`;
        if (!insides.has(key)) insides.set(key, inCrop(here.add(texel.mul(vec2(x, y)))).toVar());
        return insides.get(key);
      };
      const seedAt = (x, y) => {
        const c = identityAt(x, y);
        if (!view) {
          return differs(identityAt(x + 1, y), c).or(differs(identityAt(x, y + 1), c))
            .or(differs(identityAt(x - 1, y), c)).or(differs(identityAt(x, y - 1), c));
        }
        const across = (nx, ny) => insideAt(nx, ny).and(differs(identityAt(nx, ny), c));
        return insideAt(x, y).and(
          across(x + 1, y).or(across(x, y + 1)).or(across(x - 1, y)).or(across(x, y - 1)),
        );
      };
      const nearest = float(1e3).toVar();
      const side = Math.floor(reach);
      for (let oy = -side; oy <= side; oy++) {
        for (let ox = -side; ox <= side; ox++) {
          const length = Math.hypot(ox, oy);
          // At the cap the whole square is read, as WebGL's window is a square: past the cap a wide pen
          // still reaches its corners there.
          if (reach < MAX_LINE_RADIUS && length >= reach) continue;
          nearest.assign(seedAt(ox, oy).select(nearest.min(float(length)), nearest));
        }
      }
      coverage = float(1)
        .sub(smoothstep(halfWidth.sub(edgeAA), halfWidth.add(edgeAA), nearest))
        .toVar();
    }

    const result = vec4(0).toVar();

    If(far, () => {
      // --- Background: the clear passes through untonemapped and unencoded, as in WebGL ---
      // A paper style paints glass over the background white, and the silhouette's ink reaches out onto
      // the background side so exterior lines are as thick as interior ones.
      // 🔴 ENCODED, WHICH IS WHERE THIS DIVERGES FROM THE WEBGL COMPOSITE ON PURPOSE. That one passes the
      // clear through raw, so a background colour (linear in the target) reaches the screen as its linear
      // values: `scene.background` 0x202932 measured `050608` here before this, near black. WebGL's own
      // DEFERRED capture does not even show `scene.background` (it nulls it and clears with the renderer's
      // colour), and what users see under WebGL's default mode is the real 0x202932. A defect in the
      // reference gets fixed, not copied, so the background is encoded with the sRGB curve, the one
      // that turns the colour the user asked for back into itself: a 2.2 gamma measured `292e34` for
      // 0x202932. A transparent clear is black, so the page painted behind it is unaffected.
      let bgColour = sRGBTransferOETF(max(scene.rgb, vec3(0)));
      let bgAlpha = scene.a;
      if (paper) {
        const glass = scene.a.greaterThan(0.001);
        bgColour = glass.select(sRGBTransferOETF(paperTint), bgColour);
        bgAlpha = glass.select(float(1), scene.a);
      }
      if (view) {
        // The view's sky, under whatever the pass left here (glass keeps its tint over it). Its colours are
        // display values and are written as they are.
        const sky = skyAt(here).toVar();
        const painted = sky.a.greaterThan(0.5);
        bgColour = painted.select(mix(sky.rgb, bgColour, bgAlpha), bgColour);
        bgAlpha = painted.select(float(1), bgAlpha);
      }
      if (view && sunDepth) {
        // The ground plane's shadow, over whatever is behind: where nothing is painted here, a black of the
        // shadow's strength over the paper, so white prints at the tone exactly.
        const shaded = groundInShadow(here).toVar();
        const paintedHere = bgAlpha.greaterThan(0.001);
        bgColour = shaded.select(paintedHere.select(bgColour.mul(sunTone), vec3(0)), bgColour);
        bgAlpha = shaded.select(paintedHere.select(bgAlpha, float(1).sub(sunTone)), bgAlpha);
      }
      // Nothing painted here: the colour the host clears with (see `clearRgb`). Only without a page, which paints
      // its own colour into every such pixel below.
      if (!page) bgColour = bgAlpha.greaterThan(0).select(bgColour, clearRgb);
      let rgb = bgColour;
      let alpha = bgAlpha;
      if (inks) {
        const k = edgeStrength.mul(coverage);
        rgb = mix(bgColour, outlineTint, k);
        alpha = max(bgAlpha, k);
      }
      if (page) {
        // 🔴 THE PAGE, PAINTED IN. A scene without a background leaves this pixel transparent, and WebGL's
        // canvas (alpha, premultiplied) shows the page through it: what reaches the screen there is
        // `rgb + page · (1 − alpha)`. The WebGPU canvas is opaque by default (Antonio, 2026-09-12, over the
        // cost of a transparent one), so that same sum is done here with the page's colour, which is how
        // it looks the same without paying for transparency (Antonio's choice, 2026-09-13).
        result.assign(vec4(rgb.add(page.mul(float(1).sub(alpha))), 1));
      } else {
        result.assign(vec4(rgb, alpha));
      }
    }).Else(() => {
      // --- Surface colour vs paper: tonemap only the shaded colour ---
      // 🔴 ON PAPER, A SURFACE THE VIEW REPAINTS KEEPS ITS PAINT. A line drawing prints surfaces white, but a view
      // that overrides a category's surface colour prints that colour (DACH 2-04 and 4-02: furniture beige,
      // stairs grey). The shell marks such a pixel in the face role byte (0.4, between opaque 0 and translucent 1,
      // see `shell-layer-nodes.ts`), and only a tinted shell does, so a drawing with no tints is untouched.
      const tinted = paper && faceTex && faceHasRole
        ? (() => {
            const role = faceTex.sample(here).a;
            return role.greaterThan(0.25).and(role.lessThan(0.5));
          })()
        : null;
      const colour = (paper
        ? tinted ? tinted.select(narkowiczAces(scene.rgb), paperTint) : vec3(paperTint)
        : narkowiczAces(scene.rgb)).toVar();

      // --- AO multiply; translucent surfaces (role byte) opt out ---
      if (ao) {
        // A one-byte face attachment has no role byte, and its alpha reads 1: every surface would opt out.
        const occlusion = faceTex && faceHasRole ? faceTex.sample(here).a.greaterThan(0.5).select(float(1), ao) : ao;
        colour.mulAssign(mix(float(1), occlusion, aoStrength));
      }

      if (view && sunDepth) {
        // --- Cast shadow (flat): is this point the first thing the sun meets along its ray? ---
        // Read in the sun's own depth map, after pushing the point a little off its surface along the normal
        // so a face does not shadow itself. Before the contour, so the ink stays black over it; translucent
        // surfaces opt out. The normal is the surface's own when the frame carries one and the face the
        // depth describes when it does not: a line drawing compiles no normal channel.
        const eyeSpacePoint = viewPointOf(here, rawDepth).toVar();
        let facing;
        if (normalTex) {
          facing = normalize(normalTex.sample(here).rgb.mul(2).sub(1));
        } else {
          const across = normalize(cross(dFdx(eyeSpacePoint), dFdy(eyeSpacePoint))).toVar();
          facing = across.z.lessThan(0).select(across.negate(), across);
        }
        // 🔴 BELOW THE GROUND PLANE, THE PLANE TAKES THE SHADOW: a surface lower than the view's ground plane
        // is under it, and the shadow is read where this pixel's ray crosses the plane. Only where the view
        // looks down through the plane: an elevation's rays run along it and never cross it.
        const nearHeight = viewToWorld.mul(vec4(viewPointOf(here, float(nearDepth)), 1)).y;
        const farHeight = viewToWorld.mul(vec4(viewPointOf(here, float(farDepth)), 1)).y;
        const under = groundOn.greaterThan(0.5).and(nearHeight.sub(farHeight).greaterThan(1e-3))
          .and(viewToWorld.mul(vec4(eyeSpacePoint, 1)).y.lessThan(groundAt.sub(sunBias)));
        const shaded = under.select(
          groundInShadow(here),
          behindTheSun(eyeSpacePoint.add(facing.mul(sunNormalBias)), sunBias),
        );
        const opaque = faceTex && faceHasRole ? faceTex.sample(here).a.lessThanEqual(0.5) : sunOn.greaterThan(-1);
        // The tone is a fraction of the PRINTED light, and this colour is encoded with gamma 2.2 at the end.
        colour.mulAssign(sunOn.greaterThan(0.5).and(opaque).and(shaded).select(pow(sunTone, 2.2), float(1)));
      }

      if (normalTex) {
        const normal = normalize(normalTex.sample(here).rgb.mul(2).sub(1)).toVar();
        // Orthographic rays are parallel, so the direction back to the eye is +Z everywhere; reading it from
        // the position would put a hotspot on a flat plane that moves with the camera.
        const view = (ortho
          ? vec3(0, 0, 1)
          : normalize(getViewPosition(here, rawDepth, unprojectMatrix).negate())).toVar();
        const nv = dot(normal, view).toVar();

        // --- Tonal orientation shade: grazing surfaces fall toward the floor ---
        colour.mulAssign(mix(float(1), mix(tonalFloor, float(1), abs(nv)), tonalEnabled));

        // --- Sheen: grazing gloss plus a facing highlight, remapped LINEARLY ---
        const facing = max(nv, float(0)).toVar();
        const gloss = glossFactor.mul(pow(float(1).sub(facing), glossExp));
        const highlight = fresnelFactor.mul(pow(facing, fresnelExp));
        colour.addAssign(sheenColour.mul(sheenOutMin.add(sheenOutMax.sub(sheenOutMin).mul(gloss.add(highlight)))));

        // --- Gradient reflection: Schlick's Fresnel (1994) over a two-tone vertical gradient ---
        // The surface reflects a plain gradient, bright where the reflected ray points up and darker where it
        // points down, weighted by Schlick's approximation F0 + (1 − F0)(1 − N·V)^p: almost nothing face-on, most
        // of it at grazing angles. So upper edges and surfaces seen edge-on catch light, and the rest keeps its
        // colour. No environment map: the gradient is two colours and a smoothstep on the world height of the ray.
        // Turned to face the eye first: BIM faces often come wound inside out, and the stored normal then points
        // away. Taken as is (04-10), such a face read as seen from behind, got the full Fresnel and reflected
        // downward: floors went flat grey at rest, while the moving pass (normal from depth, always facing the
        // eye) did not. The tonal shade above sidesteps the same thing with |N·V|.
        const towards = nv.lessThan(0).select(normal.negate(), normal);
        const reflected = view.negate().sub(towards.mul(dot(view.negate(), towards).mul(2)));
        const upward = eyeToWorld.mul(vec4(reflected, 0)).y;
        const fresnel = reflectionF0.add(float(1).sub(reflectionF0).mul(pow(float(1).sub(abs(nv)), reflectionPower)));
        const gradient = mix(reflectionBottom, reflectionTop, smoothstep(float(-0.35), float(0.65), upward));
        colour.assign(mix(colour, gradient, clamp(reflectionFactor.mul(fresnel), 0, 1)));
      } else {
        // No normal compiled (tonal shade and sheen both off): what the sheen still adds is its constant floor.
        colour.addAssign(sheenColour.mul(sheenOutMin));
      }

      // --- Ink last: over what is already composed ---
      if (inks) colour.assign(mix(colour, outlineTint, edgeStrength.mul(coverage)));

      // --- Gamma 2.2, then dither ---
      colour.assign(pow(max(colour, vec3(0)), vec3(1 / 2.2)));
      const noise = fract(sin(dot(screenCoordinate.xy, vec2(12.9898, 78.233))).mul(43758.5453));
      colour.addAssign(noise.sub(0.5).mul(ditherAmount));
      result.assign(vec4(colour, 1));
    });

    return result;
  })();

  return {
    node,
    settings,
    inks,
    paper,
    /** What was compiled in, so a host can tell when a settings change needs the node built again. */
    compiled: {
      colorEnabled: settings.colorEnabled, contourEnabled: settings.contourEnabled, reach, normal: normalTex !== null,
      emptyFromFace,
    },
    /**
     * Whether a frame position lies inside the view's crop (always, without a view or a crop). What the
     * composition keeps of its overlay layers: see `OverlayPass` there.
     */
    insideCrop: view ? (coord) => inCrop(coord) : null,
    /** Once per frame, before rendering: the camera, then every live setting. */
    advance() {
      unprojectMatrix.value.copy(camera.projectionMatrixInverse);
      aoStrength.value = settings.aoStrength;
      tonalEnabled.value = settings.tonalShadingEnabled ? 1 : 0;
      tonalFloor.value = settings.tonalFloor;
      outlineTint.value = settings.edgeColor;
      if (settings.paperColor) paperTint.value = settings.paperColor;
      edgeStrength.value = settings.edgeStrength;
      edgeAA.value = settings.edgeAA;
      halfWidth.value = settings.edgeHalfWidth;
      glossExp.value = settings.glossExp;
      glossFactor.value = settings.glossFactor;
      fresnelExp.value = settings.fresnelExp;
      fresnelFactor.value = settings.fresnelFactor;
      sheenOutMin.value = settings.sheenOutMin;
      sheenOutMax.value = settings.sheenOutMax;
      sheenColour.value = settings.sheenColor;
      ditherAmount.value = settings.ditherAmount;
      reflectionFactor.value = settings.reflectionFactor ?? 0;
      reflectionPower.value = settings.reflectionPower ?? 5;
      reflectionF0.value = settings.reflectionF0 ?? 0.04;
      if (settings.reflectionTop) reflectionTop.value = settings.reflectionTop;
      if (settings.reflectionBottom) reflectionBottom.value = settings.reflectionBottom;
      camera.updateMatrixWorld();
      eyeToWorld.value.copy(camera.matrixWorld);
      if (renderer?.getClearColor) {
        renderer.getClearColor(clearRead);
        clearRgb.value.set(clearRead.r, clearRead.g, clearRead.b);
      }
      if (!view) return;
      // What the view says, read as live as the look: a host that draws several views sets it per pass.
      cropOnFrameOf(view.crop ?? null, cropOnFrame.value);
      const projection = camera.projectionMatrix.elements;
      const isOrtho = camera.isOrthographicCamera === true;
      orthographic.value = isOrtho ? 1 : 0;
      projectionScale.value.set(projection[0], projection[5]);
      if (isOrtho) projectionOffset.value.set(projection[12], projection[13]);
      else projectionOffset.value.set(projection[8], projection[9]);
      nearAt.value = camera.near;
      camera.updateMatrixWorld();
      viewToWorld.value.copy(camera.matrixWorld);
      const sun = sunDepth && sunState ? (view.sunShadow ?? null) : null;
      if (sunState) {
        sunFit(sunState, sun, camera, renderer.getDrawingBufferSize(passSize).x, reversed);
      }
      sunOn.value = sun ? 1 : 0;
      if (sun) {
        const sunCamera = sunState.camera;
        viewToSunView.value.multiplyMatrices(sunCamera.matrixWorldInverse, camera.matrixWorld);
        viewToSunClip.value.multiplyMatrices(sunCamera.projectionMatrix, viewToSunView.value);
        sunShare.value = Math.min(sunState.side, sunState.most) / sunState.most;
        sunNear.value = sunCamera.near;
        sunFar.value = sunCamera.far;
        sunTone.value = sun.tone;
        const ground = sun.groundAt ?? null;
        groundOn.value = ground === null ? 0 : 1;
        groundAt.value = ground ?? 0;
        // A texel and a half along the normal, and one texel of slack: the map's own resolution is what a
        // surface can be mistaken for being behind itself by.
        sunNormalBias.value = sunState.texel * 1.5;
        sunBias.value = sunState.texel;
      }
      const background = view.background ?? null;
      skyOn.value = background ? 1 : 0;
      if (!background) return;
      skyColour.value.fromArray(background.sky);
      horizonColour.value.fromArray(background.horizon);
      groundColour.value.fromArray(background.ground);
      cropCentre.value.copy(background.centre);
      cropRight.value.copy(background.right).normalize();
      cropUp.value.copy(background.up).normalize();
      cropHalf.value.set(background.width / 2, background.height / 2);
      // The heights of the crop's top and bottom edges: the world's up is +Y.
      const halfUp = Math.abs(cropUp.value.y * (background.height / 2));
      skyTop.value = background.centre.y + halfUp;
      skyBottom.value = background.centre.y - halfUp;
    },
  };
}
