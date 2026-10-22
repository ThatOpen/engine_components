// AMBIENT OCCLUSION, WHOLE, EVERY FRAME.
//
// The estimator and its numbers are the same as the WebGL deferred pipeline's, which is the look Antonio
// approved. Changing them is changing an approved image, so they are fixed constants rather than parameters
// to tune away from.
//
//   16 samples · a 5-turn spiral · radius in world metres · separable bilateral denoise of radius 5
//   Alchemy/SAO falloff (1/d²), not 1/d: a contact occluder weighs far more than one at mid distance,
//   which is what makes a corner read as a corner instead of a diffuse smudge.
//
// ⚰️ ═══ THE BAND SLICING IS DEAD. IT WORKED ON EVERY NUMBER AND FAILED THE ONLY JUDGE THAT COUNTS. ═══
//
// It used to recompute 1/N of the screen per frame, one horizontal band at a time. The performance case
// for it was real and is reproduced here so that nobody rebuilds it on the strength of the same table:
//
//     bands   AO GPU ms   factor
//       1       2.105       1.00
//       2       1.260       1.67
//       4       0.784       2.68
//       8       0.552       3.81
//      16       0.430       4.90
//
// Median AND pct95 came down together, which is what separates slicing from skipping — skipping (recompute
// everything every N frames) lowers the median and removes no hitch, because the criterion is "no frame of
// two vsyncs" and moving cost around does not help it.
//
// 🔴 AND IT DOES NOT MATTER, BECAUSE THE ARTEFACT IS NOT NEGOTIABLE. Antonio, twice, three weeks apart:
//
//   *"when I move the camera the shadows seem to lag behind and take a while to catch up."* (translated)
//   *"the AO spread over several frames DOES NOT WORK, it lags too far behind, even with 2 bands.
//    Kill it and document why."* (translated)
//
// ⚠️ WHY EVEN TWO BANDS FAIL, WHICH IS THE PART WORTH KEEPING. The instinct is that N=2 is "only one frame
// of lag" and therefore invisible at 90 fps. It is not one frame of lag, and the reason is that a band is
// a fixed region of the SCREEN while the shading belongs to the SURFACE under it. When the camera moves,
// the surface crosses the band boundary, so a wall can carry occlusion computed for whatever geometry
// occupied those pixels one frame ago — not its own shading arriving late, but *another surface's shading*
// sitting on it. That is a discontinuity along a horizontal line across the middle of the screen, and the
// eye locks onto a straight edge that moves with nothing in the scene. Halving the number of bands halves
// how often it refreshes; it does not make the seam less of a straight line. There is no N that fixes it,
// which is why this is a removal and not a retuning.
//
// 🔴 WHAT THIS COSTS US, STATED PLAINLY: the AO's only lever for getting cheap is gone. It is 2.105 ms of
// GPU, whole, every frame, and the way to afford it is now a better ESTIMATOR — fewer, better-placed taps,
// the depth pyramid the occlusion already builds, a compute pass that shares its depth reads across a
// workgroup — and not less of it per frame. Anything that computes a pixel's AO from a frame it did not
// belong to lands back here.
//
// 🪦 Removed with it: the `Discard` band gate, the `bandCount`/`bandIndex` uniforms, the priming that
// stopped unwritten bands showing uninitialised memory, and the `autoClear = false` wrapper around the
// three targets — that wrapper existed ONLY so untouched bands kept last frame's value, and with every
// pixel written every frame it would now just hide a target that failed to draw.

import * as THREE from "three";
import {
  Fn, If, Loop, Discard, float, int, uv, vec2, vec3, vec4, uniform, rtt, texture, screenCoordinate,
  floor, mix, smoothstep, cos, sin, normalize, cross,
} from "three/tsl";

/**
 * The sampling-spiral cap, converted from DEVICE PIXELS into texels of the pass that runs it.
 *
 * One line, exported, because its inverse shipped for a whole campaign: the estimator MULTIPLIED the
 * ceiling by device-pixels-per-texel where the screen-constant reading divides, so at divisor 2 the main
 * pass reached 128 device pixels on screen while the full-resolution refinement reached 32 — the exact
 * disagreement the scaling exists to prevent. `test/shade-cap.test.mjs` pins both readings; the witness
 * in `terms.mjs` computes `toneLidApparatusDots` through this same function from the live uniforms.
 *
 * @param {number} capApparatusDots the dial, `BLOCKING_KNOBS.spreadCapImagels`
 * @param {number} apparatusDotsPerSweepImagel 1 at full resolution, `divisor` at reduced
 */
export function lidInSweepImagels(capApparatusDots, apparatusDotsPerSweepImagel) {
  return capApparatusDots / Math.max(apparatusDotsPerSweepImagel, 1e-6);
}

export const BLOCKING_KNOBS = {
  /**
   * 🔴 WHETHER A RIBBON OCCLUDES ITS NEIGHBOURS. `false` is shipped; `?ribbonsCastAo=1` is the control.
   *
   * They never received AO — that was settled long ago and it is one read at the centre pixel. They went
   * on CASTING it, because the sample loop reads the depth texture and a ribbon's depth is in there. What
   * that looks like is a dark smudge on the parapet coping at every roof clamp, which Antonio spotted in
   * a screenshot and which the code's own comment had predicted without anyone acting on it.
   */
  streamersThrowTone: false,
  /**
   * 🔴 SAMPLES PER PIXEL. **8, on Antonio's own eye**, and `?shadeTaps=4` and `?shadeTaps=16` are the
   * controls.
   *
   * ⚰️ THIS COMMENT SAID 4 WHILE THE VALUE SAID 8, AND THE VALUE WAS RIGHT. He chose 4 from the table
   * below at 21:22 (`c94c971`), and then at 22:46 (`2a61627`) he was shown 8 samples with the blur radius
   * dropped from 5 to 2 — the two together cost what 4 samples with a wide blur did — looked at it, and
   * said *"shadeTaps=8&aoBlur=2 se ve bien"*: **less grain AND less smearing for the same money.** The
   * later decision supersedes the earlier one and the comment was never updated to say so.
   *
   * ⚠️ A stale comment beside a live value is worse than no comment: it is how somebody later "corrects"
   * a number that was already right. The two must be changed together or not at all.
   *
   * 16 was the beta's number and the look he originally approved. The estimator is exactly
   * `0.311 ms + 0.1382 per sample` at 1440x765 (`MEASUREMENTS.md`), and a tap-spread sweep showed the tap
   * cost is latency and arithmetic rather than cache misses — so the sample count is the ONLY lever the
   * AO has. Nine tours alternating 16/8/4 inside one page:
   *
   *     samples   late %            mean     360° turn median
   *        16     52.55/55.37/51.63  53.18        19.93 ms
   *         8     43.54/43.37/42.61  43.17        18.97 ms
   *         4     40.26/39.01/39.63  39.63        18.00 ms
   *
   * ⚠️ IT WAS NOT MY DECISION TO MAKE AND IT IS NOT IN THE TERMS. The RESOLUTION is the invariant —
   * one AO texel per CSS pixel, never less, still or moving (`COMPASS.md` §1). The sample count changes
   * the still image, which is Antonio's to judge, and he judged it twice: first at 8 — *"se ve bien"* —
   * and then, shown all three at an identical camera with the table above under them, at 4:
   *
   *     *"I would leave it at 4 by default for now. If tomorrow somebody wants a touch more definition
   *      and can afford it, they will be able to raise it."* (translated)
   *
   * — and then a third time, at 8 with `gentleDownSpread` 2, which is what ships. It is the default because he
   * asked for it, it is reversible with one parameter, and it is his to change the moment it stops looking
   * right in motion. What is NOT allowed, and never will be, is this number following the camera.
   */
  samples: 8,
  /**
   * 🔴 HOW FAR THE AO REACHES, IN METRES OF VIEW DEPTH. **0 is off and is the control**, and off is what
   * has always shipped.
   *
   * Antonio: *"maybe it would help performance to limit the AO to more or less near distances, so that what
   * is far away generates no ao at all?"* (translated).
   *
   * ⚠️ AND MY FIRST READING OF THIS FILE SAID THE SAVING WAS ALREADY THERE AND BEING THROWN AWAY. There is
   * an `excluded` test at the end of the estimator that returns a flat value for `z >= FAR` — but `FAR` is
   * `1e5`, a hundred kilometres. That test is the SKY, not distance, and it never fires on geometry. So
   * this is a new cut and it changes the picture, rather than a free win hiding in plain sight.
   *
   * 🔴 THE SKIP IS A BRANCH AROUND THE SAMPLE LOOP, NOT A `select` AFTER IT. `GRAVEYARD.md` §0.9 is about
   * exactly the other shape: a uniform that zeroes a result still pays for every sample that produced it.
   * A far pixel here does no texture reads at all.
   *
   * ⚠️ IT IS A DEPTH, SO IT IS SPATIALLY COHERENT, which is why the branch is worth having on a GPU: the
   * far part of a frame is a connected region, so whole waves take the same side of it. A per-pixel
   * predicate scattered across the screen would cost the branch and save nothing.
   */
  farthestRange: 0,
  /** Turns of the spiral. */
  turns: 5,
  /** Occlusion radius, in world metres. */
  radius: 2,
  /**
   * 🔴 A CEILING ON THE SAMPLE DISC, IN DEVICE PIXELS — the depth texture's own unit. 0 removes it,
   * which is the control.
   *
   * 🪦 THE NAME SAYS TEXELS AND FOR A WHOLE CAMPAIGN THE CODE AGREED WITH THE NAME INSTEAD OF THE
   * INTENT: the estimator MULTIPLIED this by the device-pixels-per-texel factor where the screen-constant
   * reading requires DIVIDING, so at divisor 2 the shipped reach was 128 device pixels and at 4 it was
   * 512 — the backlog's item 2. `lidInSweepImagels` now carries the conversion, the estimator calls the
   * same arithmetic, and `test/shade-cap.test.mjs` pins both readings so neither can drift back.
   *
   * The radius above is in WORLD metres, so its size on screen grows without bound as the camera closes in.
   * Measured on superbig at DPR 2, per-pass GPU, three cameras:
   *
   *     camera            AO GPU    scene GPU   total GPU
   *     far  (r=400)       1.76        4.30        9.60
   *     close (r=60)       5.53        6.80       15.83
   *     inside (r=8)       4.96        6.08       14.53
   *
   * The AO triples without one extra pixel to shade. It is not doing more work per pixel — the loop is
   * always 16 taps — it is reading them further apart, and a spiral whose radius is hundreds of texels
   * misses the texture cache on every single tap. **+3.76 ms of the +6.23 ms that closing in costs is this
   * one number**, which makes it the largest single item in the whole frame.
   */
  spreadCapImagels: 32,
  bias: 0.012,
  /**
   * Which dither rotates each pixel's sampling spiral. 0 none, 1 the shipped ramp, 2 interleaved gradient
   * noise. `?aoSpin=` sets it and `LOOKOUT.ao.uniforms.whirlLayoutPlan.value` moves it live. See `bayer`.
   */
  whirlLayoutPlan: 1,
  /**
   * Snap every depth tap to the centre of the texel it reads, so the UV a view position is reconstructed
   * from and the depth that comes back describe the same point. `?aoSnap=0` is the control, and
   * `LOOKOUT.ao.uniforms.latchTicks.value` moves it live. See `vistaLocus`.
   */
  latchTicks: true,
  /** Guard on the denominator: too small and samples nearly in contact blow up to black. */
  epsilon: 0.05,
  intensity: 1.05,
  contrast: 1.75,
  /**
   * 🔴 RESOLUTION DIVISOR — AND IT IS PART OF THE IMAGE TERMS, NOT A PERFORMANCE KNOB.
   *
   * **2. The AO is estimated at HALF the drawing buffer and never less.** At DPR 2 on this machine that
   * is a 2880x1530 buffer and a 1440x765 AO. This is the beta's half-res, which is the look Antonio
   * looked at and approved. See `docs/COMPASS.md` §1.
   *
   * ⚠️ IT WAS 4 FOR MOST OF THIS PROJECT AND THE WHOLE CAMPAIGN CALLED THAT "AO A 1/2". It is not: 4 is
   * a QUARTER of the drawing buffer. It is half of the CSS pixels, which is where the confusion came
   * from, and the comment that used to sit here even admitted *"IT IS A LOOK... Antonio has not judged
   * it"* — the look had been changed without him seeing it, and then every measurement in the project
   * was taken on it and reported as the configuration he asked for.
   *
   * Shown both frames side by side at an identical camera on 2026-09-04, he chose half the DRAWING
   * BUFFER. So this is now a floor, not a default: **lowering it is forbidden**, including "only while
   * the camera moves", and the contract witness throws if it is ever observed at anything else.
   *
   * What that costs, measured then, interleaved in one page so the two sides could not drift apart:
   *
   *     camera    div 2   div 4    late frames of 440
   *     far       12.2    11.5      34 -> 8
   *     close     18.5    14.9     117 -> 95
   *     inside    17.0    13.9      99 -> 87
   *
   * Those are the milliseconds the campaign has to find somewhere else. The estimator is the whole cost
   * of the AO — the two blurs are 0.63 ms and do not move — and it is bound by how far apart its taps
   * land rather than by how many pixels it shades.
   */
  divisor: 2,
  /**
   * 🔴 SEPARABLE BILATERAL DENOISE RADIUS. **2, and it is one half of a single decision with `samples`.**
   *
   * Measured: the two blur passes cost `0.26 ms + 0.16 per unit of radius`, so radius 5 is 1.06 ms —
   * which at 4 samples was LARGER than the 0.86 ms estimator it was cleaning up. Every earlier look at
   * the AO went after the estimator because that is the half with a sample count on it.
   *
   * Samples and radius are therefore interchangeable at nearly constant cost, and that is the useful part:
   *
   *     4 samples, blur 5   0.86 estimator + 1.06 blurs = 1.92 ms   <- the previous default
   *     8 samples, blur 2   1.42 estimator + 0.52 blurs = 1.94 ms   <- this one
   *
   * The same money, spent either on blurring a lot of noise heavily or on having less noise to blur.
   * Shown both at an identical camera and asked which he preferred, Antonio: *"shadeTaps=8&aoBlur=2 se ve
   * bien"*, and chose it over the cheaper-looking alternative on the grounds it names — less grain and
   * less smearing for the same price.
   *
   * ⚠️ 5 WAS THE BETA'S NUMBER AND CARRIED NO MEASUREMENT WITH IT. It was inherited as "what the
   * interleave needs" from a configuration with sixteen samples; at eight it is simply over-provisioned.
   * `?aoBlur=N` and `?shadeTaps=N` drive both halves.
   */
  gentleDownSpread: 2,
  /**
   * Whether the three AO render targets carry a depth attachment. **false**, and it is a pure waste
   * removed — a full-screen quad cannot use one. `?aoDepthBuffer=1` restores it as the control.
   */
  depthBuffer: false,
  /** DIAGNOSTIC ONLY, see `BLOCKING_GOAL`: byte-wide intermediates to separate bandwidth from taps. */
  nibbleTargets: false,
  deepnessSigma: 0.5,
  perpendicularSigma: 0.3,
  /**
   * 🔴 THE UPSAMPLE'S DEPTH TOLERANCE, AS A FRACTION OF THE PIXEL'S OWN DEPTH. See `upsampled`.
   *
   * Relative rather than absolute because this scene spans half a metre and a hundred inside one frame:
   * a fixed sigma in metres either welds a window frame to its wall up close, or rejects every tap far
   * away and falls back to the bilinear everywhere, which is the thing being replaced.
   *
   * 0.02 is two per cent of the distance — 1 cm at 50 cm, 2 m at 100 m — which is wide enough to keep the
   * four taps of a flat surface and narrow enough to drop one across a mullion.
   */
  upscaleReach: 0.02,
  /**
   * Recompute the AO at full resolution where the depth curves. See `upsampled`.
   *
   * 🔴 OFF, AND IT WAS ON FOR A FEW HOURS UNTIL A BISECT CAUGHT IT. Antonio: *"I am 100% sure that
   * before I told you the things I was seeing, 1 model was running very close to 90 fps"* (translated). He was right, and this was
   * the largest single cause.
   *
   * Bisected commit by commit over the scripted TOUR — three tours each after discarding a warm-up run,
   * with the scene pass carried alongside as a thermometer so heat could not be mistaken for code:
   *
   *     commit                               late frames   scene GPU
   *     1580fc6  the baseline he remembers       16.83 %      4.22 ms
   *     50a27d3  ribbon knob, default UNCHANGED  18.72 %      4.43     ← the method's noise floor, ~2 points
   *     b797aa5  the ribbon band's two edges     19.67 %      4.37
   *     f3084e0  everything but this commit      21.54 %      4.46
   *     1dded06  with this on                    28.57 %      4.64
   *
   * Then confirmed live at HEAD, interleaved off/on/off/on, scene pass steady at 4.38-4.44:
   *
   *     sharpenRims   late frames        composite   the 360° turn
   *     off           22.73 / 20.47 %    2.00 ms     63-68 % on time, median 14.8
   *     on            28.09 / 28.50 %    2.86 ms     56.6 %,          median 16.0
   *
   * Switching it off lands on 21.6 %, which is `f3084e0`'s 21.54 % to within the noise: the attribution
   * closes exactly.
   *
   * ⚠️ THE FAULT WAS THE METHOD, NOT THE IDEA. It was measured at ONE STILL CAMERA, where it costs 0.87 ms
   * and looked affordable, and shipped without ever being run over the TOUR — the acceptance test set at
   * the start of this campaign. A still camera cannot see a cost that scales with how much detail is on
   * screen, and this one does: +1.6 ms at a close viewpoint with twice the triangles.
   *
   * The idea survives and still works: full-resolution creases for a tenth of what `aoDiv=1` costs, and
   * Antonio judged the look good. It has to become affordable before it goes back on.
   */
  sharpenRims: false,
  /**
   * 🔴 HOW MUCH CURVATURE COUNTS AS AN EDGE, in units of the pixel's own depth.
   *
   * Antonio: *"if you push me, I only need it on the convex edges. Maybe you can get that from the
   * normal?"* (translated). The second derivative of depth IS that test: a change in slope is a change in normal, so
   * the same three taps that spot a silhouette also spot a crease, and a flat or merely SLOPED surface —
   * a floor at a glancing angle, which the first derivative would flag along its whole length — reads
   * zero. Reconstructing normals explicitly would cost two extra depth taps per neighbour to answer the
   * same question.
   *
   * Lower refines more of the screen and costs more. 0 refines everything, which is exactly full
   * resolution and is the upper control; a very large value refines nothing and is the lower one. Both
   * ends are what turn "how much does this cost" into a measurement.
   *
   * 🔴 AND THE VALUE COMES FROM THE GEOMETRY, NOT FROM TASTE — my first guess was 0.004 and it made the
   * mask EMPTY, which Antonio read straight off the screen: *"I think it does not work? I see almost no
   * difference, neither in fps nor in look"* (translated). Two symptoms at once, no change in look AND no change in cost, is
   * what an empty mask looks like, and it should have been the first thing I checked rather than the
   * third.
   *
   * The arithmetic. At a 60° field over 1530 device pixels, one pixel spans `2·z·tan(30°)/1530 = 7.5e-4·z`
   * metres of depth on a surface at 45° to the ray. Where two such surfaces meet, the slope reverses, so
   * `|zl + zr − 2·zc|` is twice that: `1.5e-3·z`. Divided by `z` — which is why it is divided by `z` — a
   * crease reads **0.0015 at any distance**, and a threshold of 0.004 sits above every one of them.
   *
   * 0.0005 catches a crease with a factor of three to spare, and a flat surface still reads zero to within
   * the depth buffer's own noise.
   */
  rimSeverance: 0.0005,
  /**
   * 🔴 ABOVE THIS FIRST-DERIVATIVE STEP IT IS A SILHOUETTE, AND SILHOUETTES ARE NOT REFINED.
   *
   * Antonio, narrowing it himself: *"the AO in the convex corners is the one that matters, the one on depth
   * jumps is not"* (translated). A silhouette is one surface ending in front of another; the AO there is a thin
   * contact fringe that the contour is drawing a line over anyway. A CREASE is where the eye reads the
   * shape of the room, and it is where the quarter-resolution gradient shows its steps.
   *
   * The two separate cleanly on which derivative moves: a silhouette jumps in the FIRST — the depth itself
   * steps — while a crease is continuous in depth and only bends, so it moves the SECOND and not the
   * first. Refining on curvature AND a small step is therefore "creases only", and it is also cheaper than
   * curvature alone, because silhouettes are the long lines in a building.
   */
  rimLengthiestStride: 0.06,
};

/** Anything at or beyond this is sky and does not occlude. */
const FAR = 1e5;
const TAU = Math.PI * 2;

/**
 * Builds the AO chain over a scene pass.
 *
 * @param {import("three").WebGPURenderer} renderer
 * @param {{ deepnessTick: any, camera: import("three").PerspectiveCamera }} inputs
 */
export function withGentleTone(renderer, { deepnessTick, camera, facetKeyVertexPoint = null }) {
  const width = Math.max(1, Math.ceil(renderer.domElement.width / BLOCKING_KNOBS.divisor));
  const height = Math.max(1, Math.ceil(renderer.domElement.height / BLOCKING_KNOBS.divisor));

  const castingA = uniform(0.5);
  const castingB = uniform(-1);
  const castCoefficient = uniform(0.5);
  // 🔴 AN ORTHOGRAPHIC CAMERA IS DECIDED WHEN THE NODE IS BUILT, NOT BY A UNIFORM.
  //
  // Everything below reconstructs view positions from the depth buffer, and the perspective formulas
  // (`-m14 / (d + m10)` for depth, `fov` and `aspect` for x and y) do not describe an orthographic
  // projection: it has neither a field of view nor a hyperbolic depth. Under one the shaders failed to
  // compile and the whole frame went black (the plan view of BuildingConfigurator). The host remounts
  // the pipeline when the camera changes, so the branch is taken once, the perspective graph is exactly
  // the one every measurement in this file was taken with, and the orthographic one pays for no switch.
  //
  // Orthographic, with the projection matrix `m`: `d = m10·z + m14` gives `z = (d − m14) / m10`, and
  // `ndc = m0·x + m12` (and `m5·y + m13`) gives x and y. The visible height is the constant `2 / m5`.
  const ortho = camera?.isOrthographicCamera === true;
  /** Orthographic only: the per-axis `ndc = scale · view + offset` of the projection matrix. */
  const orthoScale = uniform(new THREE.Vector2(1, 1));
  const orthoOffset = uniform(new THREE.Vector2(0, 0));
  const texel = uniform(new THREE.Vector2(1 / width, 1 / height));
  /** The DEVICE texel, which is what the edge test and the refinement run at. Follows the canvas, not the divisor. */
  const fullImagel = uniform(new THREE.Vector2(
    1 / renderer.domElement.width, 1 / renderer.domElement.height,
  ));
  const radius = uniform(BLOCKING_KNOBS.radius);
  const bias = uniform(BLOCKING_KNOBS.bias);
  const epsilon = uniform(BLOCKING_KNOBS.epsilon);
  const intensity = uniform(BLOCKING_KNOBS.intensity);
  const contrast = uniform(BLOCKING_KNOBS.contrast);
  const spreadCapImagels = uniform(BLOCKING_KNOBS.spreadCapImagels);
  const tickCensus = uniform(BLOCKING_KNOBS.samples);
  const gentleDownSpread = uniform(BLOCKING_KNOBS.gentleDownSpread);
  /** Metres of view depth beyond which the estimator does no work at all. 0 is off. See `farthestRange`. */
  const farthestRange = uniform(BLOCKING_KNOBS.farthestRange);
  /**
   * 🔴 2 PAINTS THE REFINED PIXELS BLACK, so the cost of the edge refinement can be SEEN rather than
   * inferred from a millisecond count.
   *
   * Antonio judges this through a composite — scene, times AO, contour on top — and when he said an edge
   * looked pixelated there were three mechanisms that could produce it and no argument that separated
   * them. I spent two rounds proposing mechanisms for pixels I cannot see; he settled it in one try by
   * switching the resolution to 1. This exists so the next question of that shape is answered by looking.
   *
   * ⚠️ ONLY 2 IS IMPLEMENTED. 0 is off. 1 is reserved for "the AO alone in grey", which needs the page's
   * composite to change rather than this node, and is not wired.
   */
  const debug = uniform(0);

  // Perspective: `castingA / (d + castingB)` with (−m14, m10). Orthographic: `(d − castingA) / castingB`
  // with (m14, m10). Both return the view-space z, negative in front of the camera.
  const vistaDeepness = ortho
    ? (coord) => deepnessTick.sample(coord).r.sub(castingA).div(castingB)
    : (coord) => castingA.div(deepnessTick.sample(coord).r.add(castingB));
  /**
   * 🔴 EVERY TAP IS SNAPPED TO THE CENTRE OF THE DEPTH TEXEL IT WILL ACTUALLY READ. `latchTicks = 0` is the
   * control and is the unsnapped version this replaces.
   *
   * The estimator runs at HALF resolution and reads a FULL-resolution depth texture, so an unsnapped tap
   * reconstructs its view position from a continuous UV while the depth that comes back belongs to the
   * texel that UV happens to land in, up to half a texel away. The two describe different points on the
   * wall, so `v` is not the vector to the sampled surface and `v · n` is not zero for a sample that is
   * coplanar with the centre. On a wall seen obliquely, where one texel spans tens of centimetres, that
   * error is metres of apparent occlusion, and because the snapping is a step function of the texel index
   * it is the SAME error for every pixel in a texel column.
   *
   * That is why the streaks survive everything aimed at noise: a blur from radius 2 to 12 moves them by
   * 0.9 %, four to thirty-two samples by nothing, and replacing the dither by an isotropic one by 2.8 %.
   * Noise is what those knobs remove. This is not noise, it is a deterministic function of the texel grid,
   * and the one knob that HAS moved it is the resolution: at `aoDiv=1`, where the estimator's grid and the
   * depth's grid are the same grid and the snapping is exact, the worst column halves from 8.62 to 4.46.
   */
  const latchTicks = uniform(BLOCKING_KNOBS.latchTicks ? 1 : 0);
  const vistaLocus = (coord) => {
    const snapped = coord.div(fullImagel).floor().add(float(0.5)).mul(fullImagel);
    const at = latchTicks.greaterThan(float(0)).select(snapped, coord).toVar();
    const z = vistaDeepness(at);
    const ndc = at.mul(2).sub(1);
    if (ortho) {
      return vec3(ndc.x.sub(orthoOffset.x).div(orthoScale.x), ndc.y.sub(orthoOffset.y).div(orthoScale.y), z);
    }
    return vec3(ndc.x.mul(castCoefficient).mul(float(camera.aspect)), ndc.y.mul(castCoefficient), float(-1)).mul(z.negate());
  };

  // The normal from the depth derivative. No normal attribute: flat shading takes it from the triangle,
  // and a G-buffer normal would be another full-resolution attachment for something reconstructable.
  //
  // ⚰️ TAKING THE NEARER OF THE TWO NEIGHBOURS ON EACH AXIS INSTEAD OF ONE FORWARD TAP DOES NOTHING HERE,
  // AND IT WAS BUILT, DELIVERED BEHIND A LIVE UNIFORM, AND MEASURED BEFORE BEING TAKEN OUT AGAIN.
  //
  // The reasoning was sound and the result was flat. A forward tap reads the surface on the far side of a
  // silhouette, one half-resolution texel spans 35 cm of wall at 230 m, and the bias sweep says the AO is
  // occluding ITSELF — bias 0.012 -> 0.4 takes the streaks from 403.6 to 51.5 while taking two thirds of
  // the AO with it, and the bias exists for nothing but self-occlusion. Self-occlusion on a flat surface
  // is what a wrong normal produces, so the normal was the suspect.
  //
  // Interleaved A/B/A/B in one page, at the camera the detector picked as the worst of twenty-four
  // (radius 110, elevation 0.35, azimuth 2.094):
  //
  //     forward tap        stripeSum 1098.7   stripeMax 8.62   aoPotency -11.56
  //     nearer neighbour   stripeSum 1094.7   stripeMax 8.99   aoPotency -11.13
  //
  // 0.4 % on the streaks and the worst column slightly WORSE, for two more depth reads per pixel. The
  // normal is not what is wrong, and the next suspect is what the sample coordinates are reconstructed
  // FROM: this estimator runs at half resolution and point-samples a FULL-resolution depth texture, so the
  // UV it reconstructs the view position from and the texel it actually reads are up to half a texel
  // apart. On a slanted surface that is a beat between two grids, which is what a streak whose spacing
  // varies smoothly across the screen looks like.
  const perpendicularOutwardOfDeepness = (coord, position, imagelVertexPoint) => {
    const dx = vistaLocus(coord.add(vec2(imagelVertexPoint.x, 0))).sub(position);
    const dy = vistaLocus(coord.add(vec2(0, imagelVertexPoint.y))).sub(position);
    return normalize(cross(dx, dy));
  };

  // 🔴 THE DITHER, AND IT IS THE SUSPECT FOR THE VERTICAL STREAKS. `whirlLayoutPlan` picks between three, live,
  // because a dither is judged on the picture and the picture cannot be compared across two page loads.
  //
  //   0   no rotation at all. Every pixel samples the same spiral. The control: it shows what the raw
  //       estimator looks like with nothing hiding its structure.
  //   1   the shipped `(4x + y)/16`, kept because it is what every number in this file was taken with.
  //   2   interleaved gradient noise (Jimenez), which is isotropic and has no preferred axis.
  //
  // ⚠️ AND THE DELIVERED ONE IS NOT A BAYER MATRIX. A 4x4 Bayer matrix is a specific permutation chosen so
  // that near neighbours get FAR APART values in every direction. `(4x + y)/16` is a ramp: step one column
  // and the spiral turns 90 degrees, step one ROW and it turns 22.5. So the sampling error is decorrelated
  // horizontally and correlated vertically over the whole height of a surface, and a vertical streak on a
  // flat wall is exactly what that produces.
  //
  // Antonio, having been shown a bias raise that took the streaks from 403.6 to 175.2: *"The streaks are still
  // there, they are lighter because the whole ao has become lighter"* (translated). He was right and the number said so
  // too — the AO fell from -17.15 to -8.83 over the same sweep, which is 23.5 -> 19.8 per unit of AO, a
  // 16 % change dressed up as a 57 % one. Every judgement below is therefore `stripeSum / aoStrength`.
  const whirlLayoutPlan = uniform(BLOCKING_KNOBS.whirlLayoutPlan);
  const bayer = (coord) => {
    const x = coord.x.toInt().bitAnd(int(3)).toFloat();
    const y = coord.y.toInt().bitAnd(int(3)).toFloat();
    const ramp = x.mul(4).add(y).div(float(16));
    // Jimenez's interleaved gradient noise: one madd and two fracts, and unlike the ramp it has no axis.
    const gradient = coord.x.mul(0.06711056).add(coord.y.mul(0.00583715)).mul(52.9829189).fract();
    return whirlLayoutPlan.equal(float(0)).select(
      float(0),
      whirlLayoutPlan.equal(float(2)).select(gradient, ramp),
    );
  };

  // 🔴 THE ESTIMATOR, PARAMETERISED BY THE TEXEL IT IS RUNNING AT, so the same code can run at a quarter
  // resolution for the whole screen and at FULL resolution for the handful of pixels that need it. The
  // texel size was baked in three places — the normal's derivative, the world-radius-in-texels, and the
  // spiral's step — and every one of them has to move together or the two resolutions measure different
  // neighbourhoods and disagree at the seam between them.
  // 🔴 AND THE CAP IS A DISTANCE ON SCREEN, NOT A NUMBER OF TEXELS, or the two resolutions look at
  // different amounts of world and disagree wherever they meet.
  //
  // `lidCoefficient` is how many device pixels a texel of THIS pass covers, and converting a ceiling given in
  // DEVICE pixels into texels of this pass means DIVIDING by it — `lidInSweepImagels` above is that one
  // line, and the unit test pins it against both readings.
  //
  // 🪦 THIS CODE DELIVERED MULTIPLYING, for a whole campaign. The story around it was right — the two
  // resolutions must sample the same neighbourhood on screen — and the operation was its inverse, so at
  // divisor 2 the main pass reached 128 device pixels while the refinement reached 32: the exact
  // disagreement the scaling existed to prevent, doubled twice. A spiral whose radius is hundreds of
  // texels misses the texture cache on every tap, which is why this single character was +2 ms of AO at
  // the close camera (see `spreadCapImagels`). Nothing threw: a too-wide AO is a picture, not an error.
  const estimate = (imagelVertexPoint) => {
    const lidCoefficient = imagelVertexPoint.y.div(fullImagel.y);
    const position = vistaLocus(uv()).toVar();
    const z = position.z.abs().toVar();

    /**
     * 🔴 THE DISTANCE CUT, AND EVERYTHING BELOW IT IS INSIDE THE BRANCH.
     *
     * `farthestRange` 0 means the condition is never true, so the shipped configuration takes the same path
     * it always has — one comparison against a uniform, outside the loop, once per pixel.
     *
     * The result starts at the "no occlusion" value rather than at zero, because that is what a pixel the
     * AO declines to shade must contribute: `vec4(1, z, 0, 0)` is the same thing the sky path writes, and
     * writing it as a marker rather than as `ao = 1` is what keeps it out of the bilateral blur instead of
     * smearing a one across the surface next to it.
     */
    const skipped = farthestRange.greaterThan(float(0)).and(z.greaterThan(farthestRange));
    const out = vec4(1, z, 0, 0).toVar();
    If(skipped.not(), () => {
    const normal = perpendicularOutwardOfDeepness(uv(), position, imagelVertexPoint).toVar();

    // The world radius in texels of THIS pass: the visible height at distance z is 2·z·tan(fov/2), and
    // under an orthographic camera it is the same at every distance, 2 / m5.
    const visibleHeight = ortho ? float(2).div(orthoScale.y) : z.mul(castCoefficient).mul(2);
    const imagelsInGlobe = radius.div(visibleHeight.max(float(1e-4))).div(imagelVertexPoint.y).toVar();
    // ⚠️ AND THEN CAPPED, WHICH IS A DELIBERATE LOSS OF REACH TRADED FOR CACHE LOCALITY. Above the cap the
    // AO stops being "occlusion within 2 metres" and becomes "occlusion within N texels", so up close it
    // measures contact rather than the room. That is the right end to lose: at a metre from a wall the
    // two-metre neighbourhood is mostly off screen anyway, and what the eye reads is the corner.
    // A cap of 0 keeps the uncapped behaviour and is the control.
    const cap = spreadCapImagels.div(lidCoefficient.max(float(1e-6)));
    const rangeInImagels = spreadCapImagels.greaterThan(float(0))
      .select(imagelsInGlobe.min(cap), imagelsInGlobe).toVar();
    // The spiral starts at one texel and fades instead of cutting. A sample inside the centre's own texel
    // reads the same depth, so the sample-to-centre vector lies in the image plane and stops measuring an
    // obstacle; and a hard cut draws a visible line, because the threshold is crossed along a curve of
    // constant depth.
    const strength = smoothstep(float(1), float(3), rangeInImagels).toVar();

    const base = bayer(screenCoordinate).toVar();
    const spin = base.mul(float(TAU));
    const offset = base.mul(float(1.6180339887)).fract();

    const total = float(0).toVar();
    // 🔴 THE COUNT IS A UNIFORM, NOT A CONSTANT, so the sample count can be judged without a reload.
    //
    // Antonio: *"I would like it all to be live, with no reload"* (translated). This was already a TSL `Loop` — the
    // only thing baking it in was `int(BLOCKING_KNOBS.samples)` as its bound — so the change is the bound and
    // the two divisions that normalise by it, and nothing about the estimator itself.
    //
    // ⚠️ AND IT IS NOT FREE OF CONSEQUENCE: a loop whose trip count the compiler can no longer see may be
    // scheduled differently from one it can. Every AO cost in this file was measured with the constant, so
    // the dynamic version is re-measured against it at the same sample count rather than assumed equal.
    Loop({ start: int(0), end: tickCensus.toInt() }, ({ i }) => {
      const a = float(i).add(offset).div(tickCensus);
      const angle = a.mul(float(BLOCKING_KNOBS.turns * TAU)).add(spin);
      // The radius grows with the index so the samples spread over the disc's AREA, not its rim.
      const r = mix(float(1), rangeInImagels, a);
      const coord = uv().add(vec2(cos(angle), sin(angle)).mul(r).mul(imagelVertexPoint));
      const sample = vistaLocus(coord);
      const v = sample.sub(position);
      // Alchemy/SAO: falls off with 1/d², so a contact occluder dominates.
      const term = v.dot(normal).sub(bias).max(float(0)).div(v.dot(v).add(epsilon));
      // 🔴 AND A RIBBON DOES NOT CAST EITHER, WHICH IS THE OTHER HALF OF "the ribbons must NOT have AO" (translated).
      //
      // Antonio, looking at a roof: *"you assured me the ribbons did not use AO, and yet the roof
      // clamps seem to generate AO on the parapet?"* (translated) — and they do. Excluding them as RECEIVERS is one
      // read at the centre pixel and has been in place for a long time; excluding them as OCCLUDERS needs
      // the face channel at every SAMPLE, because this loop reads the depth texture and a ribbon's depth
      // sits in it like anything else. The note below this loop has said exactly that since it was
      // written, and it took his eye on the coping to make it matter.
      //
      // ⚠️ IT COSTS, IT DOES NOT SAVE: one more texture read per sample. The reason is the picture. A
      // two-pixel stand-in for a clamp is not a surface, and the dark smudge it leaves on the coping is
      // not shading, it is the stand-in showing through.
      const withinRange = sample.z.abs().lessThan(float(FAR));
      const keep = facetKeyVertexPoint !== null && !BLOCKING_KNOBS.streamersThrowTone
        ? withinRange.and(facetKeyVertexPoint.sample(coord).r.greaterThan(float(0.99)).not())
        : withinRange;
      total.addAssign(keep.select(term, float(0)));
    });

    const raw = float(1).sub(total.mul(intensity.mul(2).div(tickCensus))).max(float(0));
    const ao = mix(float(1), raw.pow(contrast), strength);
    // 🔴 RIBBONS GET NO AO. Antonio: *"the ribbons must NOT have AO."* (translated)
    //
    // A ribbon is a two-pixel-wide stand-in for an element too small to draw as a mesh, not a surface.
    // Shading it means nothing, and at that width its occlusion is contact noise against whatever is
    // behind it. They are recognised by the face channel, where they write 255 and surfaces write 1..254.
    //
    // ⚠️ This removes them from RECEIVING, not from CASTING: the sample loop reads the depth texture
    // directly, so a ribbon still occludes its neighbours. Taking it out of there costs one face read per
    // sample -- sixteen more per pixel -- and that is a measurement, not an assumption.
    const appearsAkinStreamer = facetKeyVertexPoint !== null
      ? facetKeyVertexPoint.sample(uv()).r.greaterThan(float(0.99))
      : null;
    // The AO does not travel alone: R the occlusion, G the linear depth, BA the normal, so the bilateral
    // blur has its geometry in the same texel and does not need a second lookup per tap.
    // Marked as sky rather than as "ao = 1", so it also drops out of the bilateral blur: the range weight
    // separates it from the surface behind instead of smearing its value over it.
    const excluded = appearsAkinStreamer === null
      ? z.greaterThanEqual(float(FAR))
      : z.greaterThanEqual(float(FAR)).or(appearsAkinStreamer);
    out.assign(excluded.select(vec4(1, z, 0, 0), vec4(ao, z, normal.x, normal.y)));
    });
    return out;
  };

  /**
   * 🔴 NO DEPTH ATTACHMENT ON ANY OF THE THREE AO TARGETS, AND `?aoDepthBuffer=1` IS THE CONTROL.
   *
   * `rtt(node, w, h)` defaults to `{ type: HalfFloatType }` and `RenderTarget` then defaults `depthBuffer`
   * to TRUE — so all three AO targets were allocating and binding a depth attachment that a full-screen
   * quad cannot use. At 1440x765 that is 4.4 MB apiece, bound and cleared every frame, on a machine whose
   * frame is bandwidth-bound (`MEASUREMENTS.md`: 73 % of it is fill, and the target is an integrated Iris
   * Xe sharing system memory).
   *
   * It was found by asking what the passes WRITE rather than what they compute: the breakdown says the AO
   * chain moves 26.4 MB a frame across three RGBA16F targets, and the depth buffers were another 13 MB
   * nobody had ever looked at.
   */
  /**
   * 🔴 `BLOCKING_KNOBS.nibbleTargets` IS A DIAGNOSTIC, NOT A SETTING, AND IT PRODUCES A WRONG IMAGE.
   *
   * Shipping 8 samples with blur 2 beat its own cost model by 0.7 ms — the model predicted a wash and it
   * measured −0.80. The candidate explanation is that the blurs are not paying for their TAPS but for
   * their BYTES: three targets at 1440x765, read and written across three passes, is tens of megabytes a
   * frame on a machine whose whole frame is bandwidth-bound.
   *
   * Halving the channel width answers it without changing a single tap. G carries LINEAR DEPTH, which at
   * eight bits is far too coarse — so the bilateral weights collapse and the picture is wrong. That is
   * accepted: this exists to separate bandwidth from arithmetic, and if the blurs barely move then there
   * is nothing in them worth a compute rewrite.
   */
  const BLOCKING_GOAL = {
    type: BLOCKING_KNOBS.nibbleTargets ? THREE.UnsignedByteType : THREE.HalfFloatType,
    depthBuffer: BLOCKING_KNOBS.depthBuffer,
  };

  const crudeTick = Fn(() => estimate(texel));
  const crudePanel = rtt(crudeTick(), width, height, BLOCKING_GOAL);

  // 🔴 SEPARABLE, IN TWO PASSES, WHICH IS WHAT THE BETA'S DEFERRED BRANCH DOES.
  //
  // A square of radius R costs (2R+1)² reads; two passes of 1×(2R+1) cost 2(2R+1). For the ~24 reads that
  // were already being paid: a 5×5 square is radius 2 and 25 reads, separable H+V is radius 5 and 22
  // reads. The same cost buys 2.5× the reach, and reach is exactly what an interleaved AO needs.
  // 🔴 THE RADIUS IS A UNIFORM TOO, AND HERE IT MATTERS MOST. The blurs are 0.15 ms at a quarter
  // resolution and **2.79 ms at full** — they are a fixed number of TEXELS, so raising the resolution
  // makes them cover less of the world for more money. Whether a higher-resolution AO is affordable is
  // therefore a question about this number as much as about the estimator, and it could not be asked
  // without a reload.
  //
  // ⚠️ TWO TAPS PER ITERATION, one either side, which is also what removes the old `if (i === 0) continue`:
  // the loop starts at one, so the centre is never re-read.
  const gentleDownSweep = (source, direction, keepPerpendicular) => Fn(() => {
    const centre = source.sample(uv()).toVar();
    const sum = centre.r.toVar();
    const weight = float(1).toVar();
    const dir = vec2(direction[0], direction[1]);
    Loop({ start: int(1), end: gentleDownSpread.toInt().add(int(1)) }, ({ i }) => {
      for (const sign of [1, -1]) {
        const coord = uv().add(dir.mul(float(i).mul(float(sign))).mul(texel));
        const tap = source.sample(coord);
        const deepnessPortionOut = tap.g.sub(centre.g).abs().div(float(BLOCKING_KNOBS.deepnessSigma)).negate().exp();
        const perpendicularPortionOut = tap.b.sub(centre.b).abs().add(tap.a.sub(centre.a).abs())
          .div(float(BLOCKING_KNOBS.perpendicularSigma)).negate().exp();
        const w = deepnessPortionOut.mul(perpendicularPortionOut);
        sum.addAssign(tap.r.mul(w));
        weight.addAssign(w);
      }
    });
    const value = sum.div(weight);
    return keepPerpendicular ? vec4(value, centre.g, centre.b, centre.a) : vec4(value, centre.g, 0, 0);
  });

  const horizontal = rtt(gentleDownSweep(crudePanel, [1, 0], true)(), width, height, BLOCKING_GOAL);
  /**
   * 🔴 THE SECOND BLUR'S TARGET IS **RG**, NOT RGBA, AND IT IS FOUR BYTES A PIXEL INSTEAD OF EIGHT.
   *
   * `gentleDownSweep(..., keepPerpendicular = false)` returns `vec4(value, centre.g, 0, 0)` — occlusion in R and linear
   * depth in G, and the normal deliberately dropped because nothing downstream wants it. Grepped rather
   * than assumed: `blurred` is read in exactly two places, `upsampled()` for `.r` and the upsample's
   * bilateral for `.g`. Nothing reads `.b` or `.a`, which were being allocated, written and read back as
   * zeroes.
   *
   * ⚠️ AND IT IS A BANDWIDTH TEST AS MUCH AS A SAVING. The three AO targets were RGBA16F at 8 bytes a
   * pixel, so the chain moves about 44 MB a frame at 1440x765 — which on a machine measured at roughly
   * 50 GB/s is ~0.9 ms, suspiciously close to the 1.06 ms the two blurs actually cost. If halving one of
   * the three moves the number, the blurs are bandwidth and a compute doing estimate-and-denoise in
   * shared memory is worth building. If it does not, they are arithmetic and that plan is dead.
   */
  const blurred = rtt(gentleDownSweep(horizontal, [0, 1], false)(), width, height,
    { ...BLOCKING_GOAL, format: THREE.RGFormat });

  // 🔴 NAMED, BECAUSE THREE OF THEM ARE THE SAME SIZE AND THE BREAKDOWN ADDED THEM TOGETHER.
  //
  // `momentStages` identifies a pass by its target — every full-screen pass is called "QuadMesh" — so all
  // three AO passes arrived as one row, "RTT -> 1440x765, everyStillRank 3". That is enough to say the AO costs
  // 5.39 ms and not enough to say WHICH of the three does, and they want opposite fixes: the estimator is
  // bound by how far apart its taps land, the blurs are a fixed 22 local taps that no radius cap touches.
  // Aggregating them hid a floor of 2.8 ms behind the number that was moving.
  for (const [node, name] of [[crudePanel, "ao-raw"], [horizontal, "ao-blur-h"], [blurred, "ao-blur-v"]]) {
    const target = node.renderTarget ?? node.value ?? null;
    const texture = Array.isArray(target?.texture) ? target.texture[0] : target?.texture;
    if (texture) texture.name = name;
  }

  // 🪦 THE `autoClear = false` WRAPPER AROUND THESE THREE TARGETS WAS HERE AND IS GONE WITH THE BANDS.
  //
  // It existed for exactly one reason: a discarded band must keep last frame's value or it goes black, so
  // the AO targets could not be cleared. Every pixel is written every frame now, so not clearing would buy
  // nothing and would cost something real — a pass that failed to draw would show the previous frame
  // instead of showing black, which is the difference between a bug that is obvious and a bug that looks
  // like a mild artefact.

  // 🔴 THE UPSAMPLE, WHICH IS WHERE THE SHARPNESS WAS BEING LOST — NOT IN THE ESTIMATOR.
  //
  // Antonio: *"the AO does not look bad but it smells of low resolution, especially in detailed places like
  // windows ... without AO the image at DPR2 is ULTRA SHARP"* (translated). The composite was `colour.mul(ao.texture.r)`:
  // a plain BILINEAR stretch of a quarter-resolution map, blind to depth. 276,000 estimated pixels spread
  // over 4.4 million by a filter that does not know where the edges are, so at a window mullion the wall's
  // occlusion and the frame's are averaged together and the low-resolution grid shows through.
  //
  // 🔴 AND RAISING THE ESTIMATOR'S RESOLUTION IS RULED OUT BY ARITHMETIC, not by preference. `ao-raw` costs
  // 0.78 ms over 276,000 pixels — **2.8 ns a pixel** — so half resolution is ~3.1 ms and full is ~12.5,
  // against a whole frame budget of 11.1. His other suggestion, blurring at full resolution, is worse than
  // it looks: the blurs are 0.08 ms at a quarter, which is ~1.3 ms at full — more than the estimator — to
  // redistribute detail rather than recover it.
  //
  // So the fix has to cost nothing, and it can, because everything it needs is already paid for:
  //
  //   · the AO texture already carries LINEAR DEPTH in G, written by the estimator and passed through both
  //     blurs untouched, because the bilateral blur needed it. No extra attachment, no extra pass.
  //   · the composite is a pass that already runs at full resolution and already reads the depth.
  //
  // Four low-resolution taps, weighted by bilinear position AND by how close each tap's depth is to this
  // full-resolution pixel's. A tap on the other side of an edge is metres away in Z and its weight
  // collapses, so the AO stops crossing the edge and the grid stops showing.
  //
  // ⚠️ IT FALLS BACK TO THE PLAIN BILINEAR WHEN EVERY TAP IS REJECTED. A pixel whose four neighbours are
  // all on the far side of an edge would otherwise divide by ~0 and flash. Erring towards the old, softer
  // answer is the same rule the rest of this engine uses: when you cannot prove the sharp answer, take the
  // safe one.
  const upscaleReach = uniform(BLOCKING_KNOBS.upscaleReach);
  const sharpenRims = uniform(BLOCKING_KNOBS.sharpenRims ? 1 : 0);
  const rimSeverance = uniform(BLOCKING_KNOBS.rimSeverance);
  const rimLengthiestStride = uniform(BLOCKING_KNOBS.rimLengthiestStride);
  const upsampled = Fn(() => {
    const bilinear = blurred.sample(uv()).r.toVar();
    const middleDeepness = vistaDeepness(uv()).abs().toVar();

    // 🔴 THE EDGE TEST IS THE SECOND DERIVATIVE OF DEPTH, NOT THE FIRST, and that is what stops a floor
    // seen at a glancing angle from counting as one long edge.
    //
    // Depth across a receding floor changes fast, so `|dz|` flags the whole surface and the refinement
    // stops being sparse — which removes the entire saving while adding the cost. What a real silhouette
    // has and a slope does not is CURVATURE: the two neighbours straddle a step rather than sitting on a
    // ramp, so their average is far from the centre. Measured in units of the centre's own depth, for the
    // same reason the upsample's sigma is: this scene spans half a metre and a hundred in one frame.
    const zl = vistaDeepness(uv().sub(vec2(fullImagel.x, 0))).abs();
    const zr = vistaDeepness(uv().add(vec2(fullImagel.x, 0))).abs();
    const zd = vistaDeepness(uv().sub(vec2(0, fullImagel.y))).abs();
    const zu = vistaDeepness(uv().add(vec2(0, fullImagel.y))).abs();
    const curvature = zl.add(zr).sub(middleDeepness.mul(2)).abs()
      .add(zd.add(zu).sub(middleDeepness.mul(2)).abs());
    const rimPotency = curvature.div(middleDeepness.max(float(1e-4))).toVar();
    // And the FIRST derivative, which is what tells a crease from a silhouette. See `rimLengthiestStride`.
    const step = zr.sub(zl).abs().add(zu.sub(zd).abs()).div(middleDeepness.max(float(1e-4))).toVar();
    // The four low-resolution texels around this pixel, in texel space.
    const p = uv().div(texel).sub(float(0.5)).toVar();
    const base = floor(p).toVar();
    const f = p.sub(base).toVar();
    const sum = float(0).toVar();
    const weight = float(0).toVar();
    for (let j = 0; j < 2; j++) {
      for (let i = 0; i < 2; i++) {
        const coord = base.add(vec2(i, j)).add(float(0.5)).mul(texel);
        const tap = blurred.sample(coord);
        const biplanarPortionOut = (i === 0 ? float(1).sub(f.x) : f.x).mul(j === 0 ? float(1).sub(f.y) : f.y);
        // ⚠️ RELATIVE TO THE DEPTH, not absolute. A fixed sigma in metres is far too tight at fifty metres
        // and far too loose at half a metre, and this scene spans both inside one frame.
        const deepnessPortionOut = tap.g.sub(middleDeepness).abs()
          .div(middleDeepness.mul(upscaleReach).max(float(1e-4))).negate().exp();
        const w = biplanarPortionOut.mul(deepnessPortionOut);
        sum.addAssign(tap.r.mul(w));
        weight.addAssign(w);
      }
    }
    const filtered = weight.greaterThan(float(1e-3)).select(sum.div(weight), bilinear).toVar();

    // 🔴 AND WHERE THE FILTER CANNOT WIN, THE ESTIMATOR RUNS AT FULL RESOLUTION — FOR THOSE PIXELS ONLY.
    //
    // Antonio settled this by trying it: *"raising the AO resolution to 1 fixes it completely"* (translated), and
    // *"the left corner looks fine to me, but several edges are sort of pixelated"* (translated). Both halves matter.
    // The first says no reconstruction is enough — a quarter-resolution estimate genuinely lacks the
    // information, and my upsample cannot invent it. The second says WHERE it lacks it: flat wall, fine;
    // depth discontinuity, blocky. A wall's AO is a slow gradient that a quarter resolution carries
    // perfectly well.
    //
    // So the resolution is spent where the eye is looking rather than everywhere. Full resolution costs
    // 6.79 ms against a whole-frame budget of 11.1 and an AO allowance of about 1.75; if edges are a few
    // per cent of the screen, this costs a few per cent of that.
    //
    // ⚠️ `If` AND NOT `select`, and the difference is the entire point. `select` evaluates both sides and
    // throws one away, which would run the estimator on every pixel and cost MORE than doing it properly.
    // The saving is real only because the branch is skipped, and it is skipped per subgroup rather than
    // per pixel — which is why an edge mask that follows lines pays off and one that speckles would not.
    const refined = filtered.toVar();
    const restsOnPleat = rimPotency.greaterThan(rimSeverance)
      .and(step.lessThan(rimLengthiestStride))
      .and(sharpenRims.greaterThan(float(0)));
    If(restsOnPleat, () => {
      refined.assign(estimate(fullImagel).r);
    });
    // 🔴 THE MASK ITSELF, SHOWN ON DEMAND: `debug = 2` returns 0 for a refined pixel, so the composite
    // multiplies the scene by zero and the refined set comes out BLACK over the normal image.
    //
    // The whole cost of this idea is the fraction of the screen in that set, and it is a thing to LOOK at
    // before it is a thing to argue about. A mask that speckles across a flat wall is a full-resolution AO
    // with extra steps, and it would not announce itself in a millisecond count — it would just be
    // expensive for a reason nobody could see.
    return debug.equal(float(2)).select(restsOnPleat.select(float(0), refined), refined);
  });

  return {
    texture: blurred,
    /** The depth-aware upsample. `texture.r` is the plain bilinear it replaces, and is the control. */
    upsampled: upsampled(),
    settings: BLOCKING_KNOBS,
    /**
     * 🔴 EXPOSED SO THE SWEEP CAN RUN IN ONE PAGE. Comparing AO settings across reloads carries the drift
     * of two loads, and this project has measured that drift reaching +1.90 ms when the effect being looked
     * for was 1.77 — an error larger than the signal.
     */
    uniforms: {
      radius, spreadCapImagels, intensity, contrast, bias, upscaleReach, tickCensus, gentleDownSpread,
      farthestRange,
      sharpenRims, rimSeverance, rimLengthiestStride, debug, whirlLayoutPlan, latchTicks,
      // 🔴 EXPOSED FOR THE TERMS WITNESS, AND IT HAD TO BE THESE TWO RATHER THAN THE RENDER TARGET.
      //
      // `contract.mjs` first read `texture.width` and it was a lie: the object handed out as `texture` is
      // an `RTTNode`, and its `width` stayed at 1440 through a `divisor = 4` plus a `setSize` — so a
      // deliberately quartered AO measured as perfectly compliant, TWICE, and the witness issued a clean
      // bill for the exact fault it exists to catch.
      //
      // `texel` cannot lie the same way. It is `1/width, 1/height` of the estimator's own target and it
      // is what the shader multiplies its tap offsets by; if it disagreed with the real resolution the AO
      // would be visibly wrong on screen. `fullImagel` is the DEVICE texel and deliberately does NOT follow
      // the divisor, which is what lets the witness tell the two apart.
      texel, fullImagel,
    },
    /**
     * 🔴 STOPS THE THREE TARGETS RENDERING, WHICH IS NOT THE SAME AS NOTHING SAMPLING THEM.
     *
     * ⚰️ Switching the visual style to PEN at runtime repointed the pipeline at a graph with no AO in it,
     * reported `mannerQueriesTone: false`, and the per-pass breakdown still showed **all three AO passes
     * running**. An `rtt` node keeps updating once per frame on its own account; dropping the only
     * reference to it from the output graph does not stop it. So the switch looked right in every piece of
     * state and cost exactly what it cost before — which is the shape of fault this repository keeps
     * writing epitaphs about, and it was caught by reading the pass list instead of trusting the flag.
     *
     * ⚠️ AND A FRESH PAGE AT `?style=1` WAS ALWAYS FINE — zero AO passes — which is why this only appeared
     * once the style became switchable. A load-time path and a runtime path that disagree is worse than
     * either being wrong, because one of them tests the other and passes.
     */
    employActive(on) {
      for (const target of [crudePanel, horizontal, blurred]) {
        if (target && "autoUpdate" in target) target.autoUpdate = on;
      }
    },
    /** Call once per frame, before rendering. */
    advance() {
      const m = camera.projectionMatrix.elements;
      if (ortho) {
        castingA.value = m[14];
        castingB.value = m[10];
        orthoScale.value.set(m[0], m[5]);
        orthoOffset.value.set(m[12], m[13]);
        return;
      }
      castingA.value = -m[14];
      castingB.value = m[10];
      castCoefficient.value = Math.tan((camera.fov * Math.PI) / 360);
    },
    /**
     * 🪦 Kept as a no-op because the page and the lab both call it after a resize. It used to re-prime the
     * bands; with no bands there is nothing to prime, and every pixel is rewritten on the next frame.
     */
    prime() {},
    setSize(w, h) {
      const aw = Math.max(1, Math.ceil(w / BLOCKING_KNOBS.divisor));
      const ah = Math.max(1, Math.ceil(h / BLOCKING_KNOBS.divisor));
      crudePanel.setSize(aw, ah);
      horizontal.setSize(aw, ah);
      blurred.setSize(aw, ah);
      texel.value.set(1 / aw, 1 / ah);
      // ⚠️ THE DEVICE TEXEL DOES NOT FOLLOW THE DIVISOR. It is what the edge test and the refinement run
      // at, and tying it to the divisor by accident would make the refinement quietly re-estimate at the
      // low resolution — the fix would then measure as free and change nothing, which is the worst pair.
      fullImagel.value.set(1 / w, 1 / h);
    },
  };
}

void texture;
void If;
void Discard;
void floor;
