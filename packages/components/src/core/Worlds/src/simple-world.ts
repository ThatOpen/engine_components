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

// const components = new Components();
// const worlds = components.get(Worlds);
// const world = new SimpleWorld(components);
// worlds.list.add(world);
//
// world.scene = new SimpleScene();
// world.renderer = new SimpleRenderer(container);
// world.camera = new SimpleCamera();
//
// world.enabled = true;
//
// const {scene} = worlds.get("id");

export class SimpleWorld extends Base implements World {
  readonly onAfterUpdate = new Event();

  readonly onBeforeUpdate = new Event();

  enabled = false;

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
    camera.world = this;
  }

  get renderer() {
    return this._renderer;
  }

  set renderer(renderer: BaseRenderer | null) {
    if (this._renderer) {
      this._renderer.world = null;
    }
    if (renderer) {
      renderer.world = this;
    }
  }

  constructor(components: Components) {
    super(components);
  }

  update() {
    if (!this.enabled) return;
    this.onBeforeUpdate.trigger();
    if (this.renderer) {
      this.renderer.update();
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
