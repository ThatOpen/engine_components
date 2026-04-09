import { Component, Components } from "../../core";
import { DxfExporter } from "./src/DxfExporter";

export * from "./src";

/**
 * Manages DXF import and export for technical drawings.
 *
 * ```ts
 * const manager = components.get(OBC.DxfManager);
 * const dxf = manager.exporter.export([{ drawing, viewports: [{ viewport }] }]);
 * ```
 */
export class DxfManager extends Component {
  static readonly uuid = "e9a2c3d4-5f67-4b89-a012-1c3d5e7f9b2a" as const;

  enabled = true;

  /** Handles DXF serialisation of {@link TechnicalDrawing} content. */
  readonly exporter = new DxfExporter(this.components);

  constructor(components: Components) {
    super(components);
    components.add(DxfManager.uuid, this);
  }
}
