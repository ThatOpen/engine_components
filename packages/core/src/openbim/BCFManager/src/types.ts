import { BCFViewpoint } from "../../../core/Viewpoints";

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
