import * as THREE from "three";
import { LineSegmentsGeometry } from "three/examples/jsm/lines/LineSegmentsGeometry";
import { ClippingFills } from "./clipping-fills";
import { FragmentIdMap } from "../../../base-types";

/**
 * A style defines the appearance of the lines of the {@link ClippingEdges} for
 * a set of meshes.
 */
export interface ClipStyle {
  /** The name of the style. */
  name: string;

  /** The meshes where the style will be applied. */
  meshes: Set<THREE.Mesh>;

  /**
   * The material that defines the appearance of the lines of the
   * {@link ClippingEdges}.
   */
  lineMaterial: THREE.LineBasicMaterial;

  /** The IDs of the fragment items that are clipped by this style. */
  fragments: FragmentIdMap;

  /**
   * The material that defines the appearance of the fill of the
   * {@link ClippingEdges}.
   */
  fillMaterial?: THREE.Material;

  /**
   * The material that defines the appearance of the outline of the
   * {@link ClippingEdges}. This requires to use the {@link PostproductionRenderer}
   * and {@link fillMaterial}.
   */
  outlineMaterial?: THREE.MeshBasicMaterial;
}

/**
 * The lines that are drawn when the clipping plane cuts the geometry specified
 * by the {@link ClipStyle}.
 */
export interface Edge {
  /** The name of the style to which this Edges belong. */
  name: string;

  /** The visible clipping lines in the scene. */
  mesh: THREE.LineSegments;

  /** The fill of the section. */
  fill?: ClippingFills;
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
