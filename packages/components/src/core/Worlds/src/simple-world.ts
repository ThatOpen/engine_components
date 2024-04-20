import { UUID } from "../../UUID";
import {
  Event,
  Base,
  World,
  BaseScene,
  BaseCamera,
  BaseRenderer,
} from "../../Types";
import { Components } from "../../Components";

export class SimpleWorld extends Base implements World {
  readonly onAfterUpdate = new Event();

  readonly onBeforeUpdate = new Event();

  enabled = true;

  uuid = UUID.create();

  readonly onDisposed = new Event();

  private _scene?: BaseScene;

  private _camera?: BaseCamera;

  private _renderer: BaseRenderer | null = null;

  get scene() {
    if (!this._scene) {
      throw new Error("No scene initialized!");
    }
    return this._scene;
  }

  set scene(scene: BaseScene) {
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

  set camera(camera: BaseCamera) {
    this._camera = camera;
    camera.worlds.set(this.uuid, this);
    camera.currentWorld = this;
    camera.onWorldChanged.trigger({ world: this, action: "added" });
  }

  get renderer() {
    return this._renderer;
  }

  set renderer(renderer: BaseRenderer | null) {
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

    this.scene.onWorldChanged.trigger({ world: this, action: "removed" });
    this.camera.onWorldChanged.trigger({ world: this, action: "removed" });
    if (this.renderer) {
      this.renderer.onWorldChanged.trigger({ world: this, action: "removed" });
    }

    if (disposeResources) {
      this.scene.dispose();
      if (this.camera.isDisposeable()) {
        this.camera.dispose();
      }
      if (this.renderer) {
        this.renderer.dispose();
      }
    }

    this._scene = null as any;
    this._camera = null as any;
    this._renderer = null as any;
  }
}
