import { MeasureToUnitMap } from "./types";

export const defaultUnits: Record<
  keyof MeasureToUnitMap,
  MeasureToUnitMap[keyof MeasureToUnitMap]
> = {
  length: "m",
  area: "m2",
  volume: "m3",
};
