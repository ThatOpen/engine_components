import * as OBC from "@thatopen/components";
import { EdgesPlane } from "./src/edges-plane";
import { EdgesStyles } from "./src/edges-styles";

export * from "./src/edges-plane";

/**
 * A component that can add fills and outlines to the Clipper.
 */
export class ClipEdges extends OBC.Component implements OBC.Disposable {
  static readonly uuid = "24dfc306-a3c4-410f-8071-babc4afa5e4d" as const;

  readonly onDisposed = new OBC.Event();

  enabled = true;

  /** The list of defined LineStyle instances. */
  styles: EdgesStyles;

  fillsNeedUpdate = false;

  private _visible = true;

  get visible() {
    return this._visible;
  }

  set visible(active: boolean) {
    this._visible = active;
    const clipper = this.components.get(OBC.Clipper);
    for (const plane of clipper.list) {
      if (!(plane instanceof EdgesPlane)) {
        continue;
      }
      plane.edges.visible = active;
    }
  }

  constructor(components: OBC.Components) {
    super(components);
    this.components.list.set(ClipEdges.uuid, this);
    this.styles = new EdgesStyles();
  }

  dispose() {
    this.styles.dispose();
    this.onDisposed.trigger();
  }

  /**
   * Updates all the lines of the {@link ClippingEdges}.
   */
  async update(updateFills = false) {
    if (!this.enabled) return;
    const clipper = this.components.get(OBC.Clipper);
    for (const plane of clipper.list) {
      if (!(plane instanceof EdgesPlane)) {
        continue;
      }
      if (updateFills || this.fillsNeedUpdate) {
        plane.updateFill();
      } else {
        plane.update();
      }
    }
    this.fillsNeedUpdate = false;
  }
}
