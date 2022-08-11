import * as THREE from "three";
import { BufferGeometry, Mesh, Plane } from "three";
import {
  acceleratedRaycast,
  computeBoundsTree,
  disposeBoundsTree,
} from "three-mesh-bvh";
import {
  CameraComponent,
  RaycasterComponent,
  RendererComponent,
  SceneComponent,
  ToolComponents,
} from "./core";

export class Components {
  public readonly tools: ToolComponents;
  // private readonly components: ComponentBase[] = [];
  public readonly meshes: THREE.Mesh[] = [];
  public readonly clipplingPlanes: Plane[] = [];

  private _renderer?: RendererComponent;
  private _scene?: SceneComponent;
  private _camera?: CameraComponent;
  private _raycaster?: RaycasterComponent;

  private clock: THREE.Clock;
  private updateRequestCallback: number = -1;

  constructor() {
    this.clock = new THREE.Clock();
    this.tools = new ToolComponents();
    Components.setupBVH();
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

  get raycaster() {
    if (!this._raycaster) throw new Error("Raycaster hasn't been initialised.");
    return this._raycaster;
  }

  set raycaster(raycaster: RaycasterComponent) {
    this._raycaster = raycaster;
  }

  public init() {
    this.clock.start();
    this.update();
  }

  private update = () => {
    const delta = this.clock.getDelta();
    this.scene.update(delta);
    this.renderer.update(delta);
    this.camera.update(delta);
    this.tools.update(delta);
    this.updateRequestCallback = requestAnimationFrame(this.update);
  };

  dispose() {
    cancelAnimationFrame(this.updateRequestCallback);
  }

  private static setupBVH() {
    BufferGeometry.prototype.computeBoundsTree = computeBoundsTree;
    BufferGeometry.prototype.disposeBoundsTree = disposeBoundsTree;
    Mesh.prototype.raycast = acceleratedRaycast;
  }
}
