import {CameraComponent, ComponentBase, RendererComponent, SceneComponent} from "./base-types";
import * as THREE from "three";

export class Components {

  private readonly components: ComponentBase[] = [];
  public readonly meshes: THREE.Mesh[] = []

  private _renderer: RendererComponent | undefined
  private _scene: SceneComponent | undefined
  private _camera: CameraComponent | undefined

  private clock: THREE.Clock;
  private updateRequestCallback: number = -1;

  constructor() {
    this.clock = new THREE.Clock();
  }

  get renderer(){
    if(!this._renderer) throw new Error("Renderer hasn't been initialised.")
    return this._renderer;
  }

  set renderer(renderer: RendererComponent){
    this._renderer = renderer;
  }

  get scene(){
    if(!this._scene) throw new Error("Scene hasn't been initialised.")
    return this._scene;
  }

  set scene(scene: SceneComponent){
    this._scene = scene;
  }

  get camera(){
    if(!this._camera) throw new Error("Camera hasn't been initialised.")
    return this._camera;
  }

  set camera(camera: CameraComponent){
    this._camera = camera;
  }

  public init(){
    this.clock.start();
    this.updateComponents();
  }

  private updateComponents = () => {
    const delta = this.clock.elapsedTime;

    if(this.scene){
      this.scene.update(delta)
    }

    if(this.renderer){
      this.renderer.update(delta);
    }

    if(this.camera){
      this.camera.update(delta);
    }

    for(const component of this.components){
      component.update(delta);
    }
    this.updateRequestCallback = requestAnimationFrame(this.updateComponents)
  }

  dispose(){
    cancelAnimationFrame(this.updateRequestCallback)
  }

  addComponent(component: ComponentBase){
    this.components.push(component);
  }

  removeComponent(component: ComponentBase){
    const index = this.components.findIndex((c) => c === component);
    if(index > -1){
      this.components.splice(index, 1);
    }
  }
}