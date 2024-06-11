import * as THREE from "three";
import { Disposable } from "./interfaces";
import { Event } from "./event";
import { Components } from "../../Components";
import { Disposer } from "../../Disposer";
import { BaseWorldItem } from "./base-world-item";

/**
 * Abstract class representing a base scene in the application. All scenes should use this class as a base.
 */
export abstract class BaseScene extends BaseWorldItem implements Disposable {
  /** {@link Disposable.onDisposed} */
  readonly onDisposed = new Event();

   /**
   * Abstract property representing the three.js object associated with this scene.
   * It should be implemented by subclasses.
   */
  abstract three: THREE.Object3D;

  protected constructor(components: Components) {
    super(components);
  }

  /** {@link Disposable.dispose} */
  dispose() {
    const disposer = this.components.get(Disposer);
    for (const child of this.three.children) {
      const mesh = child as THREE.Mesh;
      if (mesh.geometry) {
        disposer.destroy(mesh);
      }
    }
    this.three.children = [];
    this.onDisposed.trigger();
    this.onDisposed.reset();
  }
}
