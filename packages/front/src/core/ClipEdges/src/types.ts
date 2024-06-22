import * as THREE from "three";
import * as FRAGS from "@thatopen/fragments";
import { LineSegmentsGeometry } from "three/examples/jsm/lines/LineSegmentsGeometry.js";
import { ClippingFills } from "./clipping-fills";

/**
 * A style defines the appearance of the lines of the {@link ClippingEdges} for a set of meshes.
 */
export interface ClipStyle {
  /** The name of the style. */
  name: string;

  /** The meshes where the style will be applied. */
  meshes: Set<THREE.Mesh | THREE.InstancedMesh>;

  /**
   * The material that defines the appearance of the lines of the
   * {@link ClippingEdges}.
   */
  lineMaterial: THREE.LineBasicMaterial;

  /** The IDs of the fragment items that are clipped by this style. */
  fragments: FRAGS.FragmentIdMap;

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
 * The lines that are drawn when the clipping plane cuts the geometry specified by the {@link ClipStyle}.
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
 * A line segments geometry whose [BVH](https://github.com/gkjohnson/three-mesh-bvh) has been computed.
 */
export interface BvhLineSegmentsGeometry extends LineSegmentsGeometry {
  /** The computed BVH. */
  boundsTree: any;

  /** Disposes the data of the computed BVH. */
  disposeBoundsTree: () => void;
}

/**
 * A map used to map the triangles of the clipping fill with the original fragment item. It's used to be able to trace to which elements a specific triangle of the clipping fill's face belongs (e.g. for highlighting an item when selecting one of its clipping fills).
 */
export type IndexFragmentMap = Map<number, FRAGS.FragmentIdMap>;
