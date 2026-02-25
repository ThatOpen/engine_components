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
