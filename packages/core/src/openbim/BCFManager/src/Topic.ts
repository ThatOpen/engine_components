import { UUID } from "../../../utils";
import { BCFTopic, BCFTopicComment } from "./types";
import { BCFViewpoint } from "../../../core";

export class Topic implements BCFTopic {
  guid = UUID.create();
  title = "BCF Topic";
  type = "Issue";
  creationAuthor = "jhon.doe@example.com";
  creationDate = new Date();
  status = "Active";
  comments: BCFTopicComment[] = [];
  viewpoints: BCFViewpoint[] = [];
  customData: Record<string, any> = {};
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
