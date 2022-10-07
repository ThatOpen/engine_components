import * as THREE from "three";
import { Event } from "./event";

/**
 * Whether this component has to be manually destroyed once you are done with
 * it to prevent
 * [memory leaks](https://threejs.org/docs/#manual/en/introduction/How-to-dispose-of-objects).
 * This also ensures that the DOM events created by that component will be
 * cleaned up.
 */
export interface Disposable {
  /**
   * Destroys the object from memory to prevent a
   * [memory leak](https://threejs.org/docs/#manual/en/introduction/How-to-dispose-of-objects).
   */
  dispose: () => void;
}

/**
 * Whether the geometric representation of this component can be
 * hidden or shown in the
 * [Three.js scene](https://threejs.org/docs/#api/en/scenes/Scene).
 */
export interface Hideable {
  /** Whether the geometric representation of this component is
   * currently visible or not in the
   [Three.js scene](https://threejs.org/docs/#api/en/scenes/Scene). */
  visible: boolean;
}

/**
 * Whether this component can be resized. The meaning of this can vary depending
 * on the component: resizing a
 * [Renderer](https://threejs.org/docs/#api/en/renderers/WebGLRenderer)
 * component could mean changing its resolution, whereas resizing a
 * [Mesh](https://threejs.org/docs/#api/en/objects/Mesh) would change its scale.
 */
export interface Resizeable {
  /** Sets size of this component (e.g. the resolution of a
   * [Renderer](https://threejs.org/docs/#api/en/renderers/WebGLRenderer)
   * component. */
  resize: (size?: THREE.Vector2) => void;

  /** Gets the current size of this component (e.g. the resolution of a
   * [Renderer](https://threejs.org/docs/#api/en/renderers/WebGLRenderer)
   * component. */
  getSize: () => THREE.Vector2;
}

/**
 * Whether this component supports create and destroy operations. This generally
 * applies for components that work with instances, such as clipping planes or
 * dimensions.
 */
export interface Createable {
  /** Creates a new instance of an element (e.g. a new Dimension). */
  create: (data: any) => void;

  /** Deletes an existing instance of an element (e.g. a Dimension). */
  delete: (data: any) => void;
}

/** Whether this component should be updated each frame. */
export interface Updateable {
  /** Actions that should be executed after updating the component. */
  afterUpdate: Event<any>;

  /** Actions that should be executed before updating the component. */
  beforeUpdate: Event<any>;

  /**
   * Function used to update the state of this component each frame. For
   * instance, a renderer component will make a render each frame.
   */
  update(delta?: number): void;
}

/** Whether this component is able to cast rays. */
export interface Raycaster {
  castRay: (items?: THREE.Mesh[]) => THREE.Intersection | null;
}
