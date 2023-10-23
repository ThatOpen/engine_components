import * as THREE from "three";
import { SimplePlane, Components } from "../../../core";
import { ClippingEdges } from "./clipping-edges";
import { EdgesStyles } from "./edges-styles";

/**
 * A more advanced version of {@link SimpleClipper} that also includes
 * {@link ClippingEdges} with customizable lines.
 */
export class EdgesPlane extends SimplePlane {
  readonly edges: ClippingEdges;

  /**
   * The max rate in milliseconds at which edges can be regenerated.
   * To disable this behaviour set this to 0.
   */
  edgesMaxUpdateRate: number = 50;
  private lastUpdate: number = -1;
  private updateTimeout: number = -1;

  constructor(
    components: Components,
    origin: THREE.Vector3,
    normal: THREE.Vector3,
    material: THREE.Material,
    styles: EdgesStyles
  ) {
    super(components, origin, normal, material, 5, false);
    this.edges = new ClippingEdges(components, this._plane, styles);
    this.toggleControls(true);
    this.edges.setVisible(true);
    this.onDraggingEnded.add(this.updateFill);
    this.onDraggingStarted.add(this.hideFills);
  }

  /** {@link Component.enabled} */
  get enabled() {
    return super.enabled;
  }

  /** {@link Disposable.dispose} */
  async dispose() {
    await super.dispose();
    await this.edges.dispose();
  }

  /** {@link Component.enabled} */
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

  /** {@link Updateable.update} */
  update = async () => {
    if (!this.enabled) return;

    this._plane.setFromNormalAndCoplanarPoint(
      this.normal,
      this._helper.position
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
