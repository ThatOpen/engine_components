import * as THREE from "three";
import { Component } from "./component";
import { Disposable } from "./base-types";

/**
 * A base component for other components whose main mission is to cast rays,
 * generally to pick objects with the mouse.
 */
export abstract class BaseRaycaster
  extends Component<THREE.Raycaster>
  implements Disposable
{
  /** Whether this component is able to cast rays. */
  abstract castRay(items?: THREE.Mesh[]): THREE.Intersection | null;

  /** {@link Component.enabled} */
  abstract enabled: boolean;

  /** {@link Component.get} */
  abstract get(): THREE.Raycaster;

  /** {@link Disposable.dispose} */
  abstract dispose(): Promise<void>;
}
