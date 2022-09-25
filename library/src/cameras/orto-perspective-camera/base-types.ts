import { Camera, OrthographicCamera, PerspectiveCamera } from "three";
import CameraControls from "camera-controls";
import { LiteEvent } from "../../core";

export enum CameraProjections {
  Perspective,
  Orthographic,
}

export enum NavigationModes {
  Orbit,
  FirstPerson,
  Plan,
}

export interface NavMode {
  mode: NavigationModes;
  toggle: (active: boolean, options?: any) => void;
  enabled: boolean;
  onChange: LiteEvent<any>;
  onChangeProjection: LiteEvent<Camera>;
  fitModelToFrame: any;
}

export interface AdvancedCamera {
  currentNavMode: NavMode;
  controls: CameraControls;
  orthoCamera: OrthographicCamera;
  perspectiveCamera: PerspectiveCamera;
  activeCamera: Camera;
  projection: CameraProjections;
  setNavigationMode: (mode: NavigationModes) => void;
}
