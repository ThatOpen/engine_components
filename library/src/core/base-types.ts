import {
  Camera,
  Intersection,
  Mesh,
  Plane,
  Scene,
  Vector2,
  WebGLRenderer,
} from "three";
import CameraControls from "camera-controls";
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
  get: () => WebGLRenderer;
  getSize: () => Vector2;
  onStartRender: LiteEvent<void>;
  onFinishRender: LiteEvent<void>;
  addClippingPlane: (plane: Plane) => void;
  removeClippingPlane: (plane: Plane) => void;
}

export interface SceneComponent extends ComponentBase {
  readonly scene: Scene;
  get: () => Scene;
}

export interface CameraComponent extends ComponentBase, IResizeable {
  get: () => Camera;
  enabled: boolean;
  controls?: CameraControls;
  onChangeProjection?: LiteEvent<Camera>;
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
