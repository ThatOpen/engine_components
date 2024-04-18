import * as THREE from "three";
import { Vector2 } from "three";
import { Event } from "./event";
import { BaseWorldItem } from "./base-world-item";
import { Disposable, Resizeable, Updateable } from "./interfaces";

export abstract class BaseRenderer
  extends BaseWorldItem
  implements Updateable, Disposable, Resizeable
{
  abstract three: THREE.Renderer;

  /** {@link Updateable.onBeforeUpdate} */
  onAfterUpdate = new Event();

  /** {@link Updateable.onAfterUpdate} */
  onBeforeUpdate = new Event();

  /** {@link Disposable.onDisposed} */
  readonly onDisposed = new Event<undefined>();

  readonly onResize = new Event<THREE.Vector2>();

  abstract update(delta?: number): void | Promise<void>;

  abstract dispose(): void;

  abstract getSize(): Vector2;

  abstract resize(size: Vector2 | undefined): void;
}
