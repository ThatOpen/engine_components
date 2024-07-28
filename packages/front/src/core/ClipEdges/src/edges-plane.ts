import * as THREE from "three";
import * as OBC from "@thatopen/components";
import { ClippingEdges } from "./clipping-edges";

/**
 * A more advanced version of Clipper planes that also includes edges and fills.
 */
export class EdgesPlane extends OBC.SimplePlane {
  readonly edges: ClippingEdges;

  /**
   * The max rate in milliseconds at which edges can be regenerated.
   * To disable this behaviour set this to 0.
   */
  edgesMaxUpdateRate: number = 50;

  protected _visible = true;

  protected _edgesVisible = true;

  /**
   * Getter for the visibility state of the plane.
   * @returns {boolean} The current visibility state.
   */
  get visible() {
    return this._visible;
  }

  /**
   * Setter for the visibility state of the plane.
   * Also toggles the visibility of the controls.
   * @param {boolean} state - The new visibility state.
   */
  set visible(state: boolean) {
    super.visible = state;
    this.toggleControls(state);
  }

  /**
   * Setter for the enabled state of the plane.
   * Also sets the enabled state in the renderer.
   * @param {boolean} state - The new enabled state.
   */
  set enabled(state: boolean) {
    this._enabled = state;
    if (this.world.renderer) {
      this.world.renderer.setPlane(state, this.three);
    }
  }

  /**
   * Getter for the enabled state of the plane.
   * @returns {boolean} The current enabled state.
   */
  get enabled() {
    return super.enabled;
  }

  constructor(
    components: OBC.Components,
    world: OBC.World,
    origin: THREE.Vector3,
    normal: THREE.Vector3,
    material: THREE.Material,
    size = 5,
    activateControls = true,
  ) {
    super(components, world, origin, normal, material, size, activateControls);
    this.edges = new ClippingEdges(components, world, this.three);
    this.toggleControls(true);
    this.edges.visible = true;
    this.onDraggingEnded.add(() => {
      this.updateFill();
      this.edges.visible = true;
    });
    this.onDraggingStarted.add(() => (this.edges.visible = false));
  }

  /**
   * Disposes of the EdgesPlane and its associated ClippingEdges.
   * This method should be called when the EdgesPlane is no longer needed to free up resources.
   * After calling this method, the EdgesPlane and its ClippingEdges should not be used anymore.
   */
  dispose() {
    super.dispose();
    this.edges.dispose();
  }

  /**
   * Updates the fill of the edges.
   * This method sets the `fillNeedsUpdate` flag to true, triggers the `update` method of the `edges`,
   * and sets the visibility of the `edges` to the current value of `_visible`.
   *
   * @returns {void}
   */
  updateFill = () => {
    this.edges.fillNeedsUpdate = true;
    this.edges.update();
  };
}
