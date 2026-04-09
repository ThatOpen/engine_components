import * as THREE from "three";
import * as FRAGS from "@thatopen/fragments";
import { DrawingViewport, DrawingViewportConfig } from "./DrawingViewport";

/**
 * Manages the viewports of a {@link TechnicalDrawing}.
 *
 * Accessible via `drawing.viewports`. Extends `DataMap` so consumers get
 * reactive events (`onItemSet`, `onBeforeDelete`, …) for free.
 *
 * ```ts
 * const vp = drawing.viewports.create({ left: -1, right: 5, top: 1, bottom: -4 });
 * drawing.viewports.delete(vp.uuid); // disposes and removes
 * ```
 */
export class DrawingViewports extends FRAGS.DataMap<string, DrawingViewport> {
  private readonly _container: THREE.Group;

  constructor(container: THREE.Group) {
    super();
    this._container = container;
    // Remove camera from scene and dispose the viewport before it leaves the map.
    this.onBeforeDelete.add(({ value: viewport }) => {
      this._container.remove(viewport.camera);
      viewport.dispose();
    });
  }

  /**
   * Creates a new {@link DrawingViewport}, adds its camera to the drawing
   * container, and registers it.
   *
   * @param config - Bounds and scale for the new viewport.
   * @returns The newly created viewport.
   */
  create(config: DrawingViewportConfig): DrawingViewport {
    const viewport = new DrawingViewport(config);
    this._container.add(viewport.camera);
    viewport.setContainer(this._container);
    this.set(viewport.uuid, viewport);
    return viewport;
  }
}
