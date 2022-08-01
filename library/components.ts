import {
  CameraComponent,
  isEnableable,
  isHideable,
  RendererComponent,
  SceneComponent,
  ToolComponent
} from "./core";
import * as THREE from "three";

export class Components {

  public readonly tools: ToolComponents;
  // private readonly components: ComponentBase[] = [];
  public readonly meshes: THREE.Mesh[] = []

  private _renderer: RendererComponent | undefined
  private _scene: SceneComponent | undefined
  private _camera: CameraComponent | undefined

  private clock: THREE.Clock;
  private updateRequestCallback: number = -1;

  constructor() {
    this.clock = new THREE.Clock();
    this.tools = new ToolComponents();
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
    this.update();
  }

  private update = () => {
    const delta = this.clock.elapsedTime;
    this.scene.update(delta)
    this.renderer.update(delta);
    this.camera.update(delta);
    this.tools.update(delta);
    this.updateRequestCallback = requestAnimationFrame(this.update)
  }

  dispose(){
    cancelAnimationFrame(this.updateRequestCallback)
  }
}

class ToolComponents {

  readonly tools: ToolComponent[] = [];

  add(tool: ToolComponent){
    this.tools.push(tool)
  }

  remove(tool: ToolComponent){
    const index = this.tools.findIndex((c) => c === tool);
    if(index > -1){
      this.tools.splice(index, 1);
      return true;
    }
    return false;
  }

  removeByName(name: string){
    const tool = this.get(name);
    if(tool){
      this.remove(tool)
      return true;
    }
    return false;
  }

  update(delta: number){
    for(const tool of this.tools){
      tool.update(delta)
    }
  }

  hideAll(){
    for(const tool of this.tools){
      if(tool && isHideable(tool)){
        tool.visible = false;
      }
    }
  }

  showAll(){
    for(const tool of this.tools){
      if(tool && isHideable(tool)){
        tool.visible = true;
      }
    }
  }

  toggleAllVisibility(){
    for(const tool of this.tools){
      if(tool && isHideable(tool)){
        tool.visible = !tool.visible;
      }
    }
  }

  enable(name: string, isolate: boolean = true){
    if(isolate === false){
      this.disableAll();
    }

    const tool = this.get(name)
    if(tool && isEnableable(tool)){
      tool.enabled = true;
      return true;
    }else {
      return false;
    }
  }

  disable(name: string){
    const tool = this.get(name)
    if(tool && isEnableable(tool)){
      tool.enabled = false;
      return true;
    }else {
      return false;
    }
  }

  disableAll(){
    for(const tool of this.tools){
      if(tool && isEnableable(tool)){
        console.log("Disabling tool: " + tool.name)
        tool.enabled = false;
      }
    }
  }

  toggle(name: string){
    const tool = this.get(name);
    if(tool && isEnableable(tool)){
      const enabled = tool.enabled
      this.disableAll();
      tool.enabled = !enabled;
    }
  }

  get(name: string){
    return this.tools.find((tool) => tool.name === name);
  }

  printToolsState(){
    const states = this.tools.map((tool) => ({
      name: tool.name,
      // @ts-ignore
      enabled: tool?.enabled,
      // @ts-ignore
      visible: tool?.enabled
    }))

    console.table(states)
  }
}