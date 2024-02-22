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

  fillsNeedUpdate = false;

  constructor(components: Components) {
    super(components);

    this.components.tools.list[EdgesClipper.uuid] = this;

    this.PlaneType = EdgesPlane;
    this.styles = new EdgesStyles(components);
  }

  /** {@link Component.get} */
  async dispose() {
    await super.dispose();
    await this.styles.dispose();
  }

  /**
   * Updates all the lines of the {@link ClippingEdges}.
   */
  async updateEdges(updateFills = false) {
    if (!this.enabled) return;
    for (const plane of this._planes) {
      if (updateFills || this.fillsNeedUpdate) {
        await plane.updateFill();
        this.fillsNeedUpdate = false;
      } else {
        await plane.update();
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
