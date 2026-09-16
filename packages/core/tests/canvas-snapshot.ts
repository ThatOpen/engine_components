/* eslint-disable import/no-extraneous-dependencies */
import { vi } from "vitest";

/** A copy of the pixels handed to one `putImageData` call. */
export interface CanvasBlit {
  width: number;
  height: number;
  data: Uint8ClampedArray;
}

/**
 * Records every `putImageData` on any 2D context, so a test can look at what
 * was actually drawn.
 *
 * Needs a DOM (`// @vitest-environment happy-dom`) and the canvas mock that
 * `vitest.setup.ts` installs: happy-dom on its own returns `null` from
 * `getContext("2d")`, and the mock records that the call happened but not the
 * pixels it carried. `vi.restoreAllMocks()` undoes this.
 */
export const recordCanvasBlits = (): CanvasBlit[] => {
  const blits: CanvasBlit[] = [];
  const context = document.createElement("canvas").getContext("2d");
  if (!context) {
    throw new Error(
      "No 2D context. Does the file opt into happy-dom, and is vitest.setup.ts loaded?",
    );
  }
  vi.spyOn(Object.getPrototypeOf(context), "putImageData").mockImplementation(
    (...args: unknown[]) => {
      const image = args[0] as CanvasBlit;
      blits.push({
        width: image.width,
        height: image.height,
        data: new Uint8ClampedArray(image.data),
      });
    },
  );
  return blits;
};

/**
 * A blit as one character per pixel, for `toMatchSnapshot()`: `.` where the
 * channel is 0, otherwise a letter per value (`A` = 1, `B` = 2, …). Read off
 * the red channel of the picker's id output, that is one letter per model,
 * laid out the way the overlay shows it, top row first.
 *
 * `step` samples every nth pixel, which keeps a viewport-sized blit small
 * enough to read in a snapshot.
 */
export const asciiSnapshot = (
  blit: CanvasBlit,
  { step = 1, channel = 0 }: { step?: number; channel?: number } = {},
) => {
  const rows: string[] = [];
  for (let y = 0; y < blit.height; y += step) {
    let row = "";
    for (let x = 0; x < blit.width; x += step) {
      const value = blit.data[(y * blit.width + x) * 4 + channel];
      row +=
        value === 0 ? "." : String.fromCharCode(64 + ((value - 1) % 26) + 1);
    }
    rows.push(row);
  }
  return rows.join("\n");
};
