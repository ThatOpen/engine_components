import { Disposable, Hideable, Resizeable, Updateable, UI } from "./base-types";
import { Components } from "../core";

/**
 * Components are the building blocks of this library. Everything is a
 * component: tools, scenes, objects, cameras, etc.
 * All components must inherit from this class. The `Type` parameter defines
 * the type of the core of this component. For instance, a component containing a
 */
export abstract class Component<Type> {
  /**
   * Whether this component is active or not. The behaviour can vary depending
   * on the type of component. E.g. a disabled dimension tool will stop creating
   * dimensions, while a disabled camera will stop moving. A disabled component
   * will not be updated automatically each frame.
   */
  abstract enabled: boolean;

  /**
   * The core of the component. For instance, if it's a camera component, it
   * could be a [THREE.Camera](https://threejs.org/docs/#api/en/cameras/Camera).
   */
  abstract get(...args: any): Type;

  constructor(public components: Components) {}

  /** Whether is component is {@link Disposable}. */
  isDisposeable = (): this is Disposable => {
    return "dispose" in this;
  };

  /** Whether is component is {@link Resizeable}. */
  isResizeable = (): this is Resizeable => {
    return "resize" in this && "getSize" in this;
  };

  /** Whether is component is {@link Updateable}. */
  isUpdateable = (): this is Updateable => {
    return (
      "onAfterUpdate" in this && "onBeforeUpdate" in this && "update" in this
    );
  };

  /** Whether is component is {@link Hideable}. */
  isHideable = (): this is Hideable => {
    return "visible" in this;
  };

  /** Whether is component implements any kind of {@link UI}. */
  hasUI = (): this is UI => {
    return "uiElement" in this;
  };
}
