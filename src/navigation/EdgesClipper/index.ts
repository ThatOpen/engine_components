import * as THREE from "three";
import { Components, SimpleClipper, SimplePlane } from "../../core";
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

  constructor(components: Components) {
    super(components);

    this.components.tools.list.set(EdgesClipper.uuid, this);

    this.PlaneType = SimplePlane;
    this.styles = new EdgesStyles(components);
  }

  /** {@link Component.get} */
  async dispose() {
    await super.dispose();
    this.styles.dispose();
  }

  /**
   * Updates all the lines of the {@link ClippingEdges}.
   */
  updateEdges(updateFills = false) {
    if (!this.enabled) return;
    for (const plane of this._planes) {
      if (updateFills) {
        plane.updateFill();
      } else {
        plane.update();
      }
    }
  }

  protected newPlaneInstance(point: THREE.Vector3, normal: THREE.Vector3) {
    return new this.PlaneType(
      this.components,
      point,
      normal,
      this._material,
      this.styles
    ) as EdgesPlane;
  }
}
