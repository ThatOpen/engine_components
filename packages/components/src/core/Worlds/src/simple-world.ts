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
    if (this._scene) {
      this._scene.world = null;
    }
    this._scene = scene;
    scene.world = this;
  }

  get camera() {
    if (!this._camera) {
      throw new Error("No camera initialized!");
    }
    return this._camera;
  }

  set camera(camera: BaseCamera) {
    if (this._camera) {
      this._camera.world = null;
    }
    this._camera = camera;
    camera.world = this;
  }

  get renderer() {
    return this._renderer;
  }

  set renderer(renderer: BaseRenderer | null) {
    if (this._renderer) {
      this._renderer.world = null;
    }
    this._renderer = renderer;
    if (renderer) {
      renderer.world = this;
    }
  }

  constructor(components: Components) {
    super(components);
  }

  update(delta?: number) {
    if (!this.enabled) return;
    this.onBeforeUpdate.trigger();
    if (this.camera.isUpdateable()) {
      this.camera.update(delta);
    }
    if (this.renderer) {
      this.renderer.update(delta);
    }
    this.onAfterUpdate.trigger();
  }

  dispose() {
    this.enabled = false;
    this.scene.dispose();
    if (this.camera.isDisposeable()) {
      this.camera.dispose();
    }
    if (this.renderer) {
      this.renderer.dispose();
    }
  }
}
