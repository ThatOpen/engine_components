import * as THREE from "three";
import CameraControls from "camera-controls";
import { Event } from "./event";
import { EventManager } from "./event-manager";

/**
 * Whether this component has to be manually destroyed once you are done with it to prevent [memory leaks](https://threejs.org/docs/#manual/en/introduction/How-to-dispose-of-objects). This also ensures that the DOM events created by that component will be cleaned up.
 */
export interface Disposable {
  /**
   * Destroys the object from memory to prevent a
   * [memory leak](https://threejs.org/docs/#manual/en/introduction/How-to-dispose-of-objects).
   */
  dispose: () => void | Promise<void>;

  /** Fired after the tool has been disposed.  */
  readonly onDisposed: Event<any>;
}

/**
 * Whether the geometric representation of this component can be hidden or shown in the [Three.js scene](https://threejs.org/docs/#api/en/scenes/Scene).
 */
export interface Hideable {
  /**
   * Whether the geometric representation of this component is
   * currently visible or not in the
   * [Three.js scene](https://threejs.org/docs/#api/en/scenes/Scene).
   */
  visible: boolean;
}

/**
 * Whether this component can be resized. The meaning of this can vary depending on the component: resizing a [Renderer](https://threejs.org/docs/#api/en/renderers/WebGLRenderer) component could mean changing its resolution, whereas resizing a [Mesh](https://threejs.org/docs/#api/en/objects/Mesh) would change its scale.
 */
export interface Resizeable {
  /**
   * Sets size of this component (e.g. the resolution of a
   * [Renderer](https://threejs.org/docs/#api/en/renderers/WebGLRenderer)
   * component.
   */
  resize: (size?: THREE.Vector2) => void;

  /** Event that fires when the component has been resized. */
  onResize: Event<THREE.Vector2>;

  /**
   * Gets the current size of this component (e.g. the resolution of a
   * [Renderer](https://threejs.org/docs/#api/en/renderers/WebGLRenderer)
   * component.
   */
  getSize: () => THREE.Vector2;
}

/** Whether this component should be updated each frame. */
export interface Updateable {
  /** Actions that should be executed after updating the component. */
  onAfterUpdate: Event<any>;

  /** Actions that should be executed before updating the component. */
  onBeforeUpdate: Event<any>;

  /**
   * Function used to update the state of this component each frame. For
   * instance, a renderer component will make a render each frame.
   */
  update(delta?: number): void;
}

/** Basic type to describe the progress of any kind of process. */
export interface Progress {
  /** The amount of things that have been done already. */
  current: number;

  /** The total amount of things to be done by the process. */
  total: number;
}

/**
 * Whether this component supports create and destroy operations. This generally applies for components that work with instances, such as clipping planes or dimensions.
 */
export interface Createable {
  /** Creates a new instance of an element (e.g. a new Dimension). */
  create: (data: any) => void;

  /**
   * Finish the creation process of the component, successfully creating an
   * instance of whatever the component creates.
   */
  endCreation?: (data: any) => void;

  /**
   * Cancels the creation process of the component, going back to the state
   * before starting to create.
   */
  cancelCreation?: (data: any) => void;

  /** Deletes an existing instance of an element (e.g. a Dimension). */
  delete: (data: any) => void;
}

/**
 * Whether this component supports to be configured.
 */
export interface Configurable<T, U> {
  /** Wether this components has been already configured. */
  isSetup: boolean;

  /** Use the provided configuration to set up the tool. */
  setup: (config?: Partial<U>) => void | Promise<void>;

  /** Fired after successfully calling {@link Configurable.setup()}  */
  readonly onSetup: Event<any>;

  /** Object holding the tool configuration. You can edit this directly to change the object.
   */
  config: Required<T>;
}

/**
 * Whether a camera uses the Camera Controls library.
 */
export interface CameraControllable {
  /**
   * An instance of CameraControls that provides camera control functionalities.
   * This instance is used to manipulate the camera.
   */
  controls: CameraControls;
}

/**
 * Whether it has events or not.
 */
export interface Eventable {
  /**
   * The object in charge of managing all the events.
   */
  eventManager: EventManager;
}

/**
 * Whether it has a UI or not.
 */
export interface WithUi {
  /**
   * The UI of the component.
   */
  ui: {
    [key: string]: () => HTMLElement;
  };
}

export interface SerializationResult<
  D extends Record<string, any> = Record<string, any>,
  S extends Record<string, any> = Record<string, any>,
> {
  data?: D[];
  settings?: S;
}

export interface Serializable<
  D extends Record<string, any> = Record<string, any>,
  S extends Record<string, any> = Record<string, any>,
> {
  import: (result: SerializationResult<D, S>, ...args: any) => any;
  export: (...args: any) => SerializationResult<D, S>;
}
