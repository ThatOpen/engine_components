import * as THREE from "three";
import { BaseScene } from "./base-scene";
import { BaseCamera } from "./base-camera";
import { BaseRenderer } from "./base-renderer";
import { Updateable, Disposable } from "./interfaces";
import { Event } from "./event";

/**
 * Represents a 3D world with meshes, scene, camera, renderer, and other properties.
 */
export interface World extends Disposable, Updateable {
  /**
   * A set of meshes present in the world. This is taken into account for operations like raycasting.
   */
  meshes: Set<THREE.Mesh>;

  /**
   * The base scene of the world.
   */
  scene: BaseScene;

  /**
   * The default camera of the world.
   */
  defaultCamera: BaseCamera;

  /**
   * The base camera of the world.
   */
  camera: BaseCamera;

  onCameraChanged: Event<any>;

  useDefaultCamera: () => void;

  /**
   * The base renderer of the world. Can be null if this world doesn't use a renderer (e.g. in a backend environment).
   */
  renderer: BaseRenderer | null;

  /**
   * A unique identifier for the world.
   */
  uuid: string;

  /**
   * Indicates whether the world is currently disposing. This is useful for cancelling logic that access the elements of a world (which are also disposed).
   */
  isDisposing: boolean;
}
