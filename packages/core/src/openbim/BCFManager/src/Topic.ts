import { UUID } from "../../../utils";
import { BCFTopic, BCFTopicComment, BCFViewpoint } from "./types";

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
  description?: string | undefined;
  serverAssignedId?: string | undefined;
  priority?: string | undefined;
  stage?: string | undefined;
  labels?: string[] | undefined;
  assignedTo?: string | undefined;
  dueDate?: Date | undefined;
  modifiedAuthor?: string | undefined;
  modifiedDate?: Date | undefined;
}
