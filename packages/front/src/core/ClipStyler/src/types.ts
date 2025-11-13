import * as THREE from "three";
import * as OBC from "@thatopen/components";
import { LineMaterial } from "three/examples/jsm/lines/LineMaterial.js";

/**
 * Represents the style configuration for clipping edges, including materials for lines and fills.
 */
export interface ClipStyle {
  linesMaterial?: LineMaterial;
  fillsMaterial?: THREE.Material;
}

/**
 * Represents the style configuration for clip edges items.
 */
export interface ClipEdgesItemStyle {
  /**
   * The name of the style from the ClipStyler to apply.
   */
  style: string;

  /**
   * Optional classifier intersection input. If not set, all items cut will be styled.
   */
  data?: OBC.ClassifierIntersectionInput;
}

/**
 * Configuration for creating ClipEdges.
 */
export interface ClipEdgesCreationConfig {
  /**
   * If true, updates the ClipEdges based on the plane update.
   */
  link?: boolean;

  /**
   * The unique name of the ClipEdges.
   */
  id?: string;

  /**
   * The world in which the ClipEdges are going to be added.
   */
  world?: OBC.World;

  /**
   * A record of groups from the classifier to style based on the style name set.
   */
  items?: Record<string, ClipEdgesItemStyle>;
}
