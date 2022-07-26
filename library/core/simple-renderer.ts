import {RendererComponent} from "./base-types";
import * as THREE from 'three'
import { CSS2DRenderer } from "three/examples/jsm/renderers/CSS2DRenderer";
import {Components} from "../components";
import {LiteEvent} from "./lite-event";

export class SimpleRenderer implements RendererComponent {

  renderer: THREE.WebGLRenderer;
  renderer2D = new CSS2DRenderer();
  tempCanvas?: HTMLCanvasElement;
  tempRenderer?: THREE.WebGLRenderer;
  blocked = false;

  private readonly components: Components;
  private readonly container: HTMLElement;

  public readonly onStartRender = new LiteEvent();
  public readonly onFinishRender = new LiteEvent();
  private _enabled: boolean = true;

  constructor(components: Components, container: HTMLElement) {
    this.components = components
    this.container = container;
    this.renderer = new THREE.WebGLRenderer({
      antialias: true
    });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    this.setupRenderers();
    this.adjustRendererSize();
  }

  addClippingPlane(plane: THREE.Plane) {
    this.renderer.clippingPlanes.push(plane)
  }

  removeClippingPlane (plane: THREE.Plane){
    const index = this.renderer.clippingPlanes.indexOf(plane);
    if(index > -1){
      this.renderer.clippingPlanes.splice(index, 1)
    }
  }

  dispose() {
    this.renderer.domElement.remove();
    this.renderer.dispose();
    (this.renderer as any) = null;
    (this.renderer2D as any) = null;
    (this.container as any) = null;
    this.tempRenderer?.dispose();
    this.tempCanvas?.remove();
  }

  update(_delta: number) {
    if (this.blocked) return;
    const scene = this.components.scene?.getScene();
    const camera = this.components.camera?.getCamera();
    if(!scene || !camera) return;
    this.onStartRender.trigger();
    this.renderer.render(scene, camera);
    this.renderer2D.render(scene, camera);
    this.onFinishRender.trigger();
  }

  getSize() {
    return new THREE.Vector2(this.renderer.domElement.clientWidth, this.renderer.domElement.clientHeight);
  }

  adjustRendererSize() {
    const width = this.container.clientWidth;
    const height = this.container.clientHeight;
    this.renderer.setSize(width, height);
    this.renderer2D.setSize(width, height);
  }

  /*newScreenshot(camera?: THREE.Camera, dimensions?: THREE.Vector2) {
    const previousDimensions = this.getSize();

    const domElement = this.renderer.domElement;
    const tempCanvas = domElement.cloneNode(true) as HTMLCanvasElement;

    // Using a new renderer to make screenshots without updating what the user sees in the canvas
    if (!this.tempRenderer) {
      this.tempRenderer = new THREE.WebGLRenderer({ canvas: tempCanvas, antialias: true });
      this.tempRenderer.localClippingEnabled = true;
    }

    if (dimensions) {
      this.tempRenderer.setSize(dimensions.x, dimensions.y);
      this.context.ifcCamera.updateAspect(dimensions);
    }

    // todo add this later to have a centered screenshot
    // await this.context.getIfcCamera().currentNavMode.fitModelToFrame();

    const scene = this.context.getScene();
    const cameraToRender = camera || this.context.getCamera();
    this.tempRenderer.render(scene, cameraToRender);
    const result = this.tempRenderer.domElement.toDataURL();

    if (dimensions) this.context.ifcCamera.updateAspect(previousDimensions);

    return result;
  }*/

  private setupRenderers() {
    this.renderer.localClippingEnabled = true;
    this.container.appendChild(this.renderer.domElement);

    this.renderer2D.domElement.style.position = 'absolute';
    this.renderer2D.domElement.style.top = '0px';
    this.renderer2D.domElement.style.pointerEvents = 'none';
    this.container.appendChild(this.renderer2D.domElement);
  }

  get enabled(){
    return this._enabled;
  }

  set enabled(enabled: boolean) {
    this._enabled = enabled;
  }

}