import * as THREE from "three";
import { CSS2DRenderer } from "three/examples/jsm/renderers/CSS2DRenderer";
import { Intersection, Mesh } from "three";
import { LiteEvent } from "./lite-event";

export interface ComponentBase {
  update: (delta: number) => void;
}

export interface ToolComponent extends ComponentBase {
  name: string;
}

export interface IResizeable {
  resize: () => void;
}

export interface RendererComponent extends ComponentBase, IResizeable {
  renderer: THREE.WebGLRenderer;
  renderer2D: CSS2DRenderer;
  getSize: () => THREE.Vector2;
  onStartRender: LiteEvent<void>;
  onFinishRender: LiteEvent<void>;
  addClippingPlane: (plane: THREE.Plane) => void;
  removeClippingPlane: (plane: THREE.Plane) => void;
}

export interface SceneComponent extends ComponentBase {
  readonly scene: THREE.Scene;
  getScene: () => THREE.Scene;
}

export interface CameraComponent extends ComponentBase, IResizeable {
  activeCamera: THREE.Camera;
  getCamera: () => THREE.Camera;
}

export interface RaycasterComponent {
  castRay: (items?: Mesh[]) => Intersection | null;
}

export interface IDeletable {
  delete: () => void;
}

export function isDeletable(obj: any): obj is IDeletable {
  return "delete" in obj;
}

export interface IEnableable {
  enabled: boolean;
}

export function isEnableable(obj: any): obj is IEnableable {
  return "enabled" in obj;
}

export interface IHideable {
  visible: boolean;
}

export function isHideable(obj: any): obj is IHideable {
  return "visible" in obj;
}
