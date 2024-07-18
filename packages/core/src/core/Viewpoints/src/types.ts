import * as FRAGS from "@thatopen/fragments";

export interface ViewpointPerspectiveCamera {
  aspect: number;
  fov: number;
  direction: { x: number; y: number; z: number };
  position: { x: number; y: number; z: number };
}

export interface ViewpointOrthographicCamera {
  aspect: number;
  viewtoWorld: number;
  direction: { x: number; y: number; z: number };
  position: { x: number; y: number; z: number };
}

export interface BCFViewpoint {
  guid: string;
  camera: ViewpointPerspectiveCamera | ViewpointOrthographicCamera;
  selectionComponents:
    | FRAGS.FragmentIdMap
    | Record<string, number[]>
    | Record<string, string[]>;
  spacesVisible: boolean;
  spaceBoundariesVisible: boolean;
  openingsVisible: boolean;
  defaultVisibility: boolean;
}
