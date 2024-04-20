import * as THREE from "three";
import { Disposable } from "./interfaces";
import { Event } from "./event";
import { Components } from "../../Components";
import { Disposer } from "../../Utils";
import { BaseWorldItem } from "./base-world-item";

export abstract class BaseScene extends BaseWorldItem implements Disposable {
  /** {@link Disposable.onDisposed} */
  readonly onDisposed = new Event();

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
