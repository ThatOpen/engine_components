import * as THREE from "three";
import * as OBC from "@thatopen/components";
import { ClippingEdges } from "./clipping-edges";
import { EdgesStyles } from "./edges-styles";

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
  private lastUpdate: number = -1;
  private updateTimeout: number = -1;

  constructor(
    components: OBC.Components,
    world: OBC.World,
    origin: THREE.Vector3,
    normal: THREE.Vector3,
    material: THREE.Material,
    styles: EdgesStyles,
  ) {
    super(components, world, origin, normal, material, 5, false);
    this.edges = new ClippingEdges(components, world, this.three, styles);
    this.toggleControls(true);
    this.edges.setVisible(true);
    this.onDraggingEnded.add(this.updateFill);
    this.onDraggingStarted.add(this.hideFills);
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

  dispose() {
    super.dispose();
    this.edges.dispose();
  }

  async setEnabled(state: boolean) {
    super.enabled = state;
    if (state) {
      await this.update();
    }
  }

  async setVisible(state: boolean) {
    super.visible = state;
    this.toggleControls(state);
    await this.edges.setVisible(true);
  }

  updateFill = async () => {
    this.edges.fillNeedsUpdate = true;
    await this.edges.update();
    if (this._visible) {
      this.edges.fillVisible = true;
    }
  };

  update = async () => {
    if (!this.enabled) return;

    this.three.setFromNormalAndCoplanarPoint(
      this.normal,
      this._helper.position,
    );

    // Rate limited edges update
    const now = Date.now();
    if (this.lastUpdate + this.edgesMaxUpdateRate < now) {
      this.lastUpdate = now;
      await this.edges.update();
    } else if (this.updateTimeout === -1) {
      this.updateTimeout = window.setTimeout(() => {
        this.update();
        this.updateTimeout = -1;
      }, this.edgesMaxUpdateRate);
    }
  };

  private hideFills = () => {
    this.edges.fillVisible = false;
  };
}
