import * as THREE from "three";
import {
  CameraComponent,
  RendererComponent,
  SceneComponent,
  ToolComponents,
} from "./core";

export class Components {
  public readonly tools: ToolComponents;
  // private readonly components: ComponentBase[] = [];
  public readonly meshes: THREE.Mesh[] = [];

  private _renderer: RendererComponent | undefined;
  private _scene: SceneComponent | undefined;
  private _camera: CameraComponent | undefined;

  private clock: THREE.Clock;
  private updateRequestCallback: number = -1;

  constructor() {
    this.clock = new THREE.Clock();
    this.tools = new ToolComponents();
  }

  get renderer() {
    if (!this._renderer) throw new Error("Renderer hasn't been initialised.");
    return this._renderer;
  }

  set renderer(renderer: RendererComponent) {
    this._renderer = renderer;
  }

  get scene() {
    if (!this._scene) throw new Error("Scene hasn't been initialised.");
    return this._scene;
  }

  set scene(scene: SceneComponent) {
    this._scene = scene;
  }

  get camera() {
    if (!this._camera) throw new Error("Camera hasn't been initialised.");
    return this._camera;
  }

  set camera(camera: CameraComponent) {
    this._camera = camera;
  }

  public init() {
    this.clock.start();
    this.update();
  }

  private update = () => {
    const delta = this.clock.elapsedTime;
    this.scene.update(delta);
    this.renderer.update(delta);
    this.camera.update(delta);
    this.tools.update(delta);
    this.updateRequestCallback = requestAnimationFrame(this.update);
  };

  dispose() {
    cancelAnimationFrame(this.updateRequestCallback);
  }
}
