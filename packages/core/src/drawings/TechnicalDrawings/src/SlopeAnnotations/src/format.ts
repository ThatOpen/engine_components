import { SlopeFormat } from "./types";

/**
 * Converts a slope ratio to a human-readable string.
 *
 * @param slope  - Rise / run ratio (e.g. `0.15` for 15 %).
 * @param format - Desired output format.
 * @returns Formatted string, e.g. `"15.00 %"`, `"1:6.67"`, or `"8.53°"`.
 */
export function formatSlope(slope: number, format: SlopeFormat): string {
  switch (format) {
    case "percentage":
      return `${(slope * 100).toFixed(2)} %`;
    case "ratio":
      return slope === 0 ? "1:∞" : `1:${(1 / slope).toFixed(2)}`;
    case "degrees":
      return `${((Math.atan(slope) * 180) / Math.PI).toFixed(2)}°`;
  }
}
