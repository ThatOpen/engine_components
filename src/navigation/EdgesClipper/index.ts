import * as THREE from "three";
import { Components, SimpleClipper } from "../../core";
import { EdgesPlane } from "./src/edges-plane";
import { EdgesStyles } from "./src/edges-styles";

export * from "./src/edges-plane";

/**
 * A more advanced version of {@link SimpleClipper} that also supports
 * {@link ClippingEdges} with customizable lines.
 */
export class EdgesClipper extends SimpleClipper<EdgesPlane> {
  /** The list of defined {@link LineStyle} instances. */
  styles: EdgesStyles;

  /** {@link Component.name} */
  name = "EdgesClipper";

  constructor(
    components: Components,
    PlaneType: new (...args: any) => EdgesPlane
  ) {
    super(components, PlaneType);
    this.styles = new EdgesStyles(components);
  }

  /** {@link Component.get} */
  dispose() {
    super.dispose();
    this.styles.dispose();
  }

  /**
   * Updates all the lines of the {@link ClippingEdges}.
   */
  updateEdges() {
    if (!this.enabled) return;
    for (const plane of this._planes) {
      plane.update();
    }
  }

  protected newPlaneInstance(point: THREE.Vector3, normal: THREE.Vector3) {
    return new this.PlaneType(
      this.components,
      point,
      normal,
      this._material,
      this.styles
    );
  }
}
