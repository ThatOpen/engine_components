import * as THREE from "three";
import { UUID } from "../../../utils";
import {
  Event,
  Base,
  World,
  BaseScene,
  BaseCamera,
  BaseRenderer,
} from "../../Types";
import { Components } from "../../Components";
import { Disposer } from "../../Disposer";

export class SimpleWorld<
    T extends BaseScene = BaseScene,
    U extends BaseCamera = BaseCamera,
    S extends BaseRenderer = BaseRenderer,
  >
  extends Base
  implements World
{
  /**
   * All the loaded [meshes](https://threejs.org/docs/#api/en/objects/Mesh).
   */
  readonly meshes = new Set<THREE.Mesh>();

  readonly onAfterUpdate = new Event();

  readonly onBeforeUpdate = new Event();

  isDisposing = false;

  enabled = true;

  uuid = UUID.create();

  name?: string;

  readonly onDisposed = new Event();

  private _scene?: T;

  private _camera?: U;

  private _renderer: S | null = null;

  get scene() {
    if (!this._scene) {
      throw new Error("No scene initialized!");
    }
    return this._scene;
  }

  set scene(scene: T) {
    this._scene = scene;
    scene.worlds.set(this.uuid, this);
    scene.currentWorld = this;
    scene.onWorldChanged.trigger({ world: this, action: "added" });
  }

  get camera() {
    if (!this._camera) {
      throw new Error("No camera initialized!");
    }
    return this._camera;
  }

  set camera(camera: U) {
    this._camera = camera;
    camera.worlds.set(this.uuid, this);
    camera.currentWorld = this;
    camera.onWorldChanged.trigger({ world: this, action: "added" });
  }

  get renderer() {
    return this._renderer;
  }

  set renderer(renderer: S | null) {
    this._renderer = renderer;
    if (renderer) {
      renderer.worlds.set(this.uuid, this);
      renderer.currentWorld = this;
      renderer.onWorldChanged.trigger({ world: this, action: "added" });
    }
  }

  constructor(components: Components) {
    super(components);
  }

  update(delta?: number) {
    if (!this.enabled) return;

    if (!this._scene || !this._camera) {
      return;
    }

    this.scene.currentWorld = this;
    this.camera.currentWorld = this;
    if (this.renderer) {
      this.renderer.currentWorld = this;
    }

    this.onBeforeUpdate.trigger();

    if (this.scene.isUpdateable()) {
      this.scene.update(delta);
    }

    if (this.camera.isUpdateable()) {
      this.camera.update(delta);
    }

    if (this.renderer) {
      this.renderer.update(delta);
    }

    this.onAfterUpdate.trigger();
  }

  dispose(disposeResources = true) {
    this.enabled = false;
    this.isDisposing = true;

    this.scene.onWorldChanged.trigger({ world: this, action: "removed" });
    this.camera.onWorldChanged.trigger({ world: this, action: "removed" });
    if (this.renderer) {
      this.renderer.onWorldChanged.trigger({ world: this, action: "removed" });
    }

    if (disposeResources) {
      const disposer = this.components.get(Disposer);

      this.scene.dispose();
      if (this.camera.isDisposeable()) {
        this.camera.dispose();
      }
      if (this.renderer) {
        this.renderer.dispose();
      }
      for (const mesh of this.meshes) {
        disposer.destroy(mesh);
      }

      this.meshes.clear();
    }

    this._scene = null as any;
    this._camera = null as any;
    this._renderer = null as any;

    this.onDisposed.trigger();
  }
}
