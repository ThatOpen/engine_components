import * as THREE from 'three';
import {CSS2DRenderer} from "three/examples/jsm/renderers/CSS2DRenderer";
import {LiteEvent} from "./utils/LiteEvent";

export interface ComponentBase {
  update: (delta: number) => void
}

export interface ToolComponent extends ComponentBase {
  enabled: boolean
}

export interface RendererComponent extends ComponentBase {
  renderer: THREE.WebGLRenderer,
  renderer2D: CSS2DRenderer,
  getSize: () => THREE.Vector2,
  onStartRender: LiteEvent<void>
  onFinishRender: LiteEvent<void>
  addClippingPlane: (plane: THREE.Plane) => void,
  removeClippingPlane: (plane: THREE.Plane) => void
}

export interface SceneComponent extends ComponentBase {
  readonly scene: THREE.Scene
  getScene: () => THREE.Scene;
}

export interface CameraComponent extends ComponentBase {
  activeCamera: THREE.Camera;
  getCamera: () => THREE.Camera;
}