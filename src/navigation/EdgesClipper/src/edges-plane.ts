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
    this.edges.visible = true;
    this.draggingEnded.on(this.updateFill);
    this.draggingStarted.on(this.hideFills);
  }

  /** {@link Hideable.visible} */
  set visible(state: boolean) {
    super.visible = state;
    this.toggleControls(state);
    this.edges.visible = state;
  }

  /** {@link Component.enabled} */
  get enabled() {
    return super.enabled;
  }

  /** {@link Component.enabled} */
  set enabled(state: boolean) {
    super.enabled = state;
    if (state) {
      this.update();
    }
  }

  /** {@link Disposable.dispose} */
  dispose() {
    super.dispose();
    this.edges.dispose();
  }

  /** {@link Updateable.update} */
  update = () => {
    if (!this.enabled) return;

    this._plane.setFromNormalAndCoplanarPoint(
      this._normal,
      this._helper.position
    );

    // Rate limited edges update
    const now = Date.now();
    if (this.lastUpdate + this.edgesMaxUpdateRate < now) {
      this.lastUpdate = now;
      this.edges.update();
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

  private updateFill = () => {
    this.edges.updateFills();
    this.edges.fillVisible = true;
  };
}
