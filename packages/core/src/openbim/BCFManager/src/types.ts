import { BCFViewpoint } from "../../../core/Viewpoints";

export interface BCFTopicComment extends Record<string, any> {
  date: Date;
  author: string;
  guid: string;
  comment: string;
  viewpoint?: string;
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

export type BCFVersion = "2.1" | "3.0";

export interface BCFManagerConfig {
  // The BCF version used during export
  version: "2.1" | "3.0";
  // The user (usually an email) creating topics using this manager
  author: string;
  types: Set<string>;
  statuses: Set<string>;
  priorities: Set<string>;
  labels: Set<string>;
  stages: Set<string>;
  users: Set<string>;
  // Wether or not to include the AuthoringSoftwareId in the viewpoint components during export
  includeSelectionTag: boolean;
  // Updates the types, statuses, users, etc., after importing an external BCF
  updateExtensionsOnImport: boolean;
  // Only allow to use the extensions (types, statuses, etc.) defined in the manager
  strict: boolean;
  // If true, updates the extensions (types, status, etc.) based on Topics data
  includeMissingExtensionsOnExport: boolean;
}
