import { Vector3 } from "three";
import { SimplePlane } from "../../core";
import { ClippingEdges } from "./clipping-edges";
import { Components } from "../../components";

export class EdgesPlane extends SimplePlane {
  readonly edges: ClippingEdges;

  constructor(
    components: Components,
    origin: Vector3,
    normal: Vector3,
    onStartDragging: Function,
    onEndDragging: Function,
    planeSize: number,
    isDraggable: boolean
  ) {
    super(
      components,
      origin,
      normal,
      onStartDragging,
      onEndDragging,
      planeSize,
      isDraggable
    );

    this.edges = new ClippingEdges(this.plane);
  }

  onPlaneChanged() {
    super.onPlaneChanged();
    this.edges.updateEdges();
  }

  set visible(state: boolean) {
    super.visible = state;
    this.edges.visible = state;
  }

  set enabled(state: boolean) {
    super.enabled = state;
    this.edges.visible = state;
  }

  dispose() {
    super.dispose();
    this.edges.disposeStylesAndHelpers();
    (this.edges as any) = null;
  }
}
