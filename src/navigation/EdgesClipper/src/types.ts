import * as THREE from "three";
import { LineMaterial } from "three/examples/jsm/lines/LineMaterial";
import { LineSegmentsGeometry } from "three/examples/jsm/lines/LineSegmentsGeometry";

/**
 * A style defines the appearance of the lines of the {@link ClippingEdges} for
 * a set of meshes.
 */
export interface LineStyle {
  /** The name of the style. */
  name: string;

  /** The meshes where the style will be applied. */
  meshes: THREE.Mesh[];

  /**
   * The material that defines the appearance of the lines of the
   * {@link ClippingEdges}.
   * */
  material: LineMaterial;
}

/**
 * The lines that are drawn when the clipping plane cuts the geometry specified
 * by the {@link LineStyle}.
 */
export interface Edge {
  /** The name of the style to which this Edges belong. */
  name: string;

  /** The visible clipping lines in the scene. */
  mesh: THREE.LineSegments;
}

/**
 * A line segments geometry whose
 * [BVH](https://github.com/gkjohnson/three-mesh-bvh) has been computed.
 */
export interface BvhLineSegmentsGeometry extends LineSegmentsGeometry {
  /** The computed BVH. */
  boundsTree: any;

  /** Disposes the data of the computed BVH. */
  disposeBoundsTree: () => void;
}
