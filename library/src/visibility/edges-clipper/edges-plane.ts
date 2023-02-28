import * as THREE from "three";
import { SimplePlane } from "../../core";
import { ClippingEdges } from "./clipping-edges";
import { Components } from "../../components";
import { EdgesStyles } from "./edges-styles";

/**
 * An more advanced version of {@link SimpleClipper} that also includes
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
    size: number,
    material: THREE.Material,
    isPlan: boolean,
    styles: EdgesStyles
  ) {
    super(components, origin, normal, size, material, isPlan);
    this.edges = new ClippingEdges(components, this._plane, styles);
  }

  /** {@link Disposable.dispose} */
  set enabled(state: boolean) {
    super.enabled = state;
    this.edges.visible = state;
  }

  /** {@link Disposable.dispose} */
  dispose() {
    super.dispose();
    this.edges.dispose();
  }

  /** {@link Updateable.update} */
  update() {
    super.update();

    // Rate limited edges update
    const now = Date.now();
    if(this.lastUpdate + this.edgesMaxUpdateRate < now){
      this.lastUpdate = now;
      this.edges.update();
    }else {
      if(this.updateTimeout === -1){
        this.updateTimeout = window.setTimeout(() => {
          this.update();
          this.updateTimeout = -1;
        }, this.edgesMaxUpdateRate)
      }
    }
  }
}
