import {
  Disposable,
  Hideable,
  Resizeable,
  Updateable,
  Configurable,
} from "./interfaces";
import { Components } from "../../Components";

/**
 * Base class of the library. Useful for finding out the interfaces something implements.
 */
export abstract class Base {
  constructor(public components: Components) {}

  /** Whether is component is {@link Disposable}. */
  isDisposeable = (): this is Disposable => {
    return "dispose" in this && "onDisposed" in this;
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

  /** Whether is component is {@link Configurable}. */
  isConfigurable = (): this is Configurable<any, any> => {
    return "setup" in this && "config" in this && "onSetup" in this;
  };
}
