import { MeasureVolume } from "../../../utils/measure-volume";

export interface VolumeMeasurerTempData {
  preview?: MeasureVolume;
}

/**
 * Represents the modes available for the volume measurement tool.
 */
export type VolumeMeasurerModes = ["free"];
