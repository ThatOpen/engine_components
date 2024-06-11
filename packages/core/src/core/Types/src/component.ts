import { Components } from "../../Components";
import { Base } from "./base";

/**
 * Components are the building blocks of this library. Components are singleton elements that contain specific functionality. For instance, the Clipper Component can create, delete and handle 3D clipping planes. Components must be unique (they can't be instanced more than once per Components instance), and have a static UUID that identifies them uniquely. The can be accessed globally using the {@link Components} instance.
 */
export abstract class Component extends Base {
  /**
   * Whether this component is active or not. The behaviour can vary depending
   * on the type of component. E.g. a disabled dimension tool will stop creating
   * dimensions, while a disabled camera will stop moving. A disabled component
   * will not be updated automatically each frame.
   */
  abstract enabled: boolean;
}
