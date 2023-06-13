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
    super(components, origin, normal, material);
    this.edges = new ClippingEdges(components, this._plane, styles);
    this.visible = true;
  }

  /** {@link Hideable.visible} */
  set visible(state: boolean) {
    super.visible = state;
    this.edges.visible = state;
  }

  /** {@link Disposable.dispose} */
  dispose() {
    super.dispose();
    this.edges.dispose();
  }

  /** {@link Updateable.update} */
  update = () => {
    if (!this.enabled) return;
    this.beforeUpdate.trigger(this._plane);

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

    this.afterUpdate.trigger(this._plane);
  };
}
