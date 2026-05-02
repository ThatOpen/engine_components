export type MeasureToUnitMap = {
  length: "mm" | "cm" | "m" | "km";
  area: "mm2" | "cm2" | "m2" | "km2";
  volume: "mm3" | "cm3" | "m3" | "km3";
  angle: "deg" | "rad";
};

export type MeasurementStateChange =
  | "mode"
  | "color"
  | "units"
  | "rounding"
  | "visibility"
  | "enabled";

/**
 * When the measurement tool runs the snap pick that drives the
 * preview marker / dimension line.
 *
 * - {@link MeasurementPickMode.MOUSE_MOVE}: pick once per animation
 *   frame while the cursor is moving. Snappy feedback; defaults
 *   here. Heavy on big models because every move triggers a pick
 *   (~15 ms GPU readback) plus a snap fetch on first sight of each
 *   new item.
 * - {@link MeasurementPickMode.MOUSE_STOP}: pick only after the
 *   cursor settles for {@link Measurement.delay} ms. One pick per
 *   stop, regardless of how the user got there. Recommended for
 *   large scenes — the marker only appears where the user actually
 *   pauses, which is also where they're about to click.
 */
export enum MeasurementPickMode {
  MOUSE_MOVE = "mousemove",
  MOUSE_STOP = "mousestop",
}
