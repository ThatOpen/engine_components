import * as OBC from "@thatopen/components";
import { EdgesPlane } from "./src/edges-plane";
import { EdgesStyles } from "./src/edges-styles";

export * from "./src";

/**
 * A component that can add fills and outlines to the Clipper. 📕 [Tutorial](https://docs.thatopen.com/Tutorials/Components/Front/ClipEdges). 📘 [API](https://docs.thatopen.com/api/@thatopen/components-front/classes/ClipEdges).
 */
export class ClipEdges extends OBC.Component implements OBC.Disposable {
  /**
   * A unique identifier for the component.
   * This UUID is used to register the component within the Components system.
   */
  static readonly uuid = "24dfc306-a3c4-410f-8071-babc4afa5e4d" as const;

  /** {@link OBC.Disposable.onDisposed} */
  readonly onDisposed = new OBC.Event();

  /** {@link OBC.Component.enabled} */
  enabled = true;

  /**
   * The styling properties for the edges.
   */
  styles: EdgesStyles;

  /**
   * A flag indicating whether the fills need to be updated.
   */
  fillsNeedUpdate = false;

  private _visible = true;

  /**
   * Gets the visibility state of the edges.
   * @returns {boolean} The current visibility state.
   */
  get visible() {
    return this._visible;
  }

  /**
   * Sets the visibility state of the edges.
   * Updates the visibility of the associated {@link EdgesPlane} instances.
   * @param {boolean} active - The new visibility state.
   */
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

  /** {@link OBC.Disposable.dispose} */
  dispose() {
    this.styles.dispose();
    this.onDisposed.trigger();
  }

  /**
   * Updates all the lines of the component.
   *
   * @param {boolean} [updateFills=false] - If true, the fills will be updated regardless of the `fillsNeedUpdate` flag.
   * @returns {Promise<void>} - A promise that resolves when the update is complete.
   *
   * @remarks
   * This method iterates through all the {@link EdgesPlane} instances associated with the {@link Clipper} component.
   */
  async update(updateFills = false) {
    if (!this.enabled) {
      return;
    }
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
