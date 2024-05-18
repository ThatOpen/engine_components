import * as THREE from "three";
import * as OBC from "@thatopen/components";
import { ClippingEdges } from "./clipping-edges";

/**
 * A more advanced version of SimpleClipper that also includes
 * {@link ClippingEdges} with customizable lines.
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

  get visible() {
    return this._visible;
  }

  set visible(state: boolean) {
    super.visible = state;
    this.toggleControls(state);
  }

  set enabled(state: boolean) {
    this._enabled = state;
    if (this.world.renderer) {
      this.world.renderer.setPlane(state, this.three);
    }
  }

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
    });
    this.onDraggingStarted.add(() => (this.edges.visible = false));
  }

  dispose() {
    super.dispose();
    this.edges.dispose();
  }

  updateFill = () => {
    if (!this.enabled) return;
    this.edges.fillNeedsUpdate = true;
    this.edges.update();
    if (this._visible) {
      this.edges.visible = true;
    }
  };
}
