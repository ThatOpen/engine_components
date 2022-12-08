import * as THREE from "three";
import { SimpleClipper } from "../../core";
import { EdgesPlane } from "./edges-plane";
import { EdgesStyles } from "./edges-styles";
import { Components } from "../../components";

/**
 * An more advanced version of {@link SimpleClipper} that also supports
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

  /**
   * Updates all the lines of the {@link ClippingEdges}.
   */
  updateEdges() {
    for (const plane of this._planes) {
      plane.update();
    }
  }

  protected newPlaneInstance(
    point: THREE.Vector3,
    normal: THREE.Vector3,
    isPlan: boolean
  ) {
    return new this.PlaneType(
      this.components,
      point,
      normal,
      this.size,
      this._material,
      isPlan,
      this.styles
    );
  }
}
