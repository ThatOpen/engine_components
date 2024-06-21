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

export interface BCFTopicComment extends Record<string, any> {
  author: string;
  guid: string;
  comment: string;
  date: Date;
  viewpoint: string;
  modifiedAuthor?: string;
  modifiedDate?: Date;
}

export interface BCFTopic extends Record<string, any> {
  guid: string;
  title: string;
  type: string;
  creationAuthor: string;
  creationDate: Date;
  status: string;
  comments: BCFTopicComment[];
  viewpoints: BCFViewpoint[];
  customData: Record<string, any>;
  description?: string;
  serverAssignedId?: string;
  priority?: string;
  stage?: string;
  labels?: string[];
  assignedTo?: string;
  dueDate?: Date;
  modifiedAuthor?: string;
  modifiedDate?: Date;
}
