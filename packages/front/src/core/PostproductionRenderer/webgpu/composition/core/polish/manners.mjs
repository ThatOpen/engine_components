// THE VISUAL STYLES, AND THE CUES A STYLE TURNS ON.
//
// Parity with the WebGL deferred post-production, and Antonio's words:
// *"that the post-production has THE SAME effects and styles as the deferred post-production in components
// beta ... Same parameters."* (translated)
//
// 🔴 THE PUBLIC NAMES AND DEFAULTS ARE THE WEBGL POST-PRODUCTION'S ON PURPOSE: an API that "works igual"
// under both renderers is the whole point of this step.
//
// 🔴 AND A STYLE IS THREE SWITCHES, NOT SIX PIPELINES. The WebGL COMPOSER path really does build a different
// `EffectComposer` chain per style; the WebGL DEFERRED path — the one this matches — reduces the whole enum to
// `hueSwitchedOn`, `profileEdgeSwitchedOn` and `aoEnabled`, because one full-screen composite already has every cue
// in it. This one is the same shape, so it has the same simplification.

/**
 * Which cues a frame shows. The numeric values match the WebGL post-production's and are part of the API:
 * code that stores a style as a number, or switches on one, has to keep working under both renderers.
 */
export const PostproductionAspect = {
  COLOR: 0,
  PEN: 1,
  QUILL_SHADOWS: 2,
  HUE_QUILL: 3,
  HUE_SHADOWS: 4,
  HUE_QUILL_SHADOWS: 5,
};

/**
 * The smallest thing that can stand in for their `Event`.
 *
 * Their post-production exposes `onMannerSelected` and callers subscribe with `.add(listener)`. That surface
 * is part of what "the API works igual" means, so it exists here with the same three methods and nothing
 * else — this is a parity shim, not a general event system, and if it ever needs to become one it should
 * become theirs rather than a second one.
 */
export class Signal {
  #listeners = new Set();

  add(listener) {
    this.#listeners.add(listener);
    return listener;
  }

  remove(listener) {
    this.#listeners.delete(listener);
  }

  trigger(value) {
    // ⚠️ OVER A COPY. A listener that unsubscribes itself while being notified would otherwise mutate the
    // set being iterated, and the listener after it would be skipped — silently, and only sometimes.
    for (const listener of [...this.#listeners]) listener(value);
  }

  get count() {
    return this.#listeners.size;
  }
}

/** The reverse map, for error messages and for the panel. */
export const facetAngleLabel = (value) =>
  Object.keys(PostproductionAspect).find((k) => PostproductionAspect[k] === value) ?? `unknown(${value})`;

/**
 * The three switches a style resolves to.
 *
 * ⚠️ ANTI-ALIASING IS DELIBERATELY NOT ONE OF THEM, and theirs says why: it is a general tail that is
 * valuable for every style, especially when an adaptive resolution is upscaling the frame, so it stays
 * under the user's control instead of being toggled by the look.
 */
export function flipsFor(aspect) {
  const A = PostproductionAspect;
  const extraHue =
    aspect === A.COLOR ||
    aspect === A.HUE_QUILL ||
    aspect === A.HUE_SHADOWS ||
    aspect === A.HUE_QUILL_SHADOWS;
  const extraPigment =
    aspect === A.PEN ||
    aspect === A.QUILL_SHADOWS ||
    aspect === A.HUE_QUILL ||
    aspect === A.HUE_QUILL_SHADOWS;
  const extraShadeCast =
    aspect === A.QUILL_SHADOWS ||
    aspect === A.HUE_SHADOWS ||
    aspect === A.HUE_QUILL_SHADOWS;
  return { extraHue, extraPigment, extraShadeCast };
}

/**
 * 🔴 EVERY SETTING THEIR COMPOSITE HAS, WITH THEIR DEFAULTS.
 *
 * Values copied deliberately: a parity claim between two engines is worthless if the two are also running
 * different numbers, and this project has already recorded that trap in `contour.mjs` — *"picking numbers
 * that merely look similar would turn a comparison between two engines into a comparison between two
 * settings."*
 *
 * The comments record what each one is FOR, because a table of seventeen floats with no reasons is how a
 * later change picks the wrong one to tune.
 */
export const HINT_KNOBS = {
  /** False replaces the shaded surface with flat white: the "paper" drawing the pen styles want. */
  hueSwitchedOn: true,
  /** Gates the ink separately from its strength, so a style can drop it without losing a tuned value. */
  profileEdgeSwitchedOn: true,
  /** How much of the ambient occlusion reaches the picture. */
  aoPotency: 1.0,
  /**
   * The orientation shade: surface colour multiplied by `mix(tonefulBase, 1, |N·V|)`, so grazing faces
   * darken toward the floor. It is a volume cue that costs one dot product once a normal is in hand.
   */
  tonefulShadingSwitchedOn: true,
  /** 0.7 — grazing surfaces at about 70 % brightness. Low enough to read, high enough not to crush walls. */
  tonefulBase: 0.7,
  /** The ink's colour. Black. */
  rimHue: [0, 0, 0],
  rimPotency: 0.8,
  /** Line half-width in pixels, for the distance-transform coverage. */
  rimSemiBreadth: 0.6,
  /** Antialiasing softness of the line, in pixels. */
  rimAA: 0.7,
  /** The grazing-edge sheen. */
  lusterPower: 10,
  lusterCoefficient: 0.2,
  rimPower: 7,
  /**
   * 0 — THE RenderedFaces HIGHLIGHT IS OFF, and theirs records why rather than just defaulting it: on a flat
   * matte slab `pow(N·V)` produced a soft white hotspot that slid with the camera. Raise it for a glossier
   * look; the grazing sheen above is a different term and stays on.
   */
  rimCoefficient: 0.0,
  glossOutwardLeast: 0.0,
  glossOutwardMost: 0.5,
  sheenColor: [1, 1, 1],
  /** One 8-bit step of dither, which is what stops banding on the large flat gradients. */
  stippleAmount: 1 / 255,
};

/**
 * Which of the heavy pieces a style actually needs built.
 *
 * 🔴 THIS IS THE POINT OF THE WHOLE STEP, in Antonio's words: *"what would be desirable is that when using PEN we do not
 * pay for things that are not used, such as the AO"* (translated). The answer is a pipeline per style with the unused
 * nodes NOT COMPILED IN, not a uniform set to zero — `GRAVEYARD.md` §0.9 measured that trap here: with the
 * effect "off" by uniform the shader still ran every sample and multiplied by zero at the end, and the
 * comparison read 16.8 against 17.2, which is noise presented as a saving.
 *
 * @returns {{ requestsTone: boolean, requestsPigment: boolean, requestsPerpendicular: boolean }}
 */
export function portionsRequiredBy(aspect, settings = HINT_KNOBS) {
  const { extraHue, extraPigment, extraShadeCast } = flipsFor(aspect);
  // The normal is not free here. Their deferred pipeline has one in its G-buffer; this one reconstructs it
  // from depth, so it is only worth building when a cue actually reads it.
  const queriesToneful = settings.tonefulShadingSwitchedOn && extraHue;
  const queriesGloss =
    extraHue && (settings.lusterCoefficient > 0 || settings.rimCoefficient > 0);
  return {
    requestsTone: extraShadeCast && settings.aoPotency > 0,
    requestsPigment: extraPigment && settings.rimPotency > 0,
    requestsPerpendicular: queriesToneful || queriesGloss,
    queriesToneful,
    queriesGloss,
    extraHue,
  };
}
