import * as THREE from "three";
import * as OBC from "@thatopen/components";
import { EdgesPlane } from "./src/edges-plane";
import { EdgesStyles } from "./src/edges-styles";

export * from "./src/edges-plane";

/**
 * A more advanced version of SimpleClipper that also supports
 * {@link ClippingEdges} with customizable lines.
 */
export class EdgesClipper extends OBC.Clipper<EdgesPlane> {
  /** The list of defined LineStyle instances. */
  styles: EdgesStyles;

  fillsNeedUpdate = false;

  constructor(components: OBC.Components) {
    super(components);
    this.components.list.set(EdgesClipper.uuid, this);
    this.PlaneType = EdgesPlane;
    this.styles = new EdgesStyles();
  }

  dispose() {
    super.dispose();
    this.styles.dispose();
  }

  /**
   * Updates all the lines of the {@link ClippingEdges}.
   */
  async updateEdges(updateFills = false) {
    if (!this.enabled) return;
    for (const plane of this.list) {
      if (updateFills || this.fillsNeedUpdate) {
        await plane.updateFill();
        this.fillsNeedUpdate = false;
      } else {
        await plane.update();
      }
    }
  }

  protected newPlaneInstance(
    world: OBC.World,
    point: THREE.Vector3,
    normal: THREE.Vector3,
  ) {
    return new this.PlaneType(
      this.components,
      world,
      point,
      normal,
      this._material,
      this.styles,
    ) as EdgesPlane;
  }
}
