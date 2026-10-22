/**
 * The postproduction enums live in their own leaf module ON PURPOSE.
 *
 * They used to be declared in `./index`, which imports the renderer back from
 * `..` — a cycle. Which module evaluates first then depends on the consumer's
 * bundler, and a class field initialized from one of these enums can read it
 * while its module is still half-initialized (`undefined.DEFERRED`, a
 * TypeError at load). A leaf module has no imports, so it can never lose that
 * race. Do not import anything here.
 */

export enum PostproductionAspect {
  COLOR = 0,
  PEN = 1,
  PEN_SHADOWS = 2,
  COLOR_PEN = 3,
  COLOR_SHADOWS = 4,
  COLOR_PEN_SHADOWS = 5,
}

/**
 * The rendering pipeline the postproduction runs. COMPOSER is the default
 * EffectComposer style stack; DEFERRED is the forward + auxiliary-geometry-prepass
 * pipeline. An enum (rather than a boolean) leaves room for further modes.
 */
export enum PostproductionMode {
  COMPOSER = 0,
  DEFERRED = 1,
}
