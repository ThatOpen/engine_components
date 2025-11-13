import { BCFViewpoint } from "../../../core/Viewpoints";

export type BCFVersion = "2.1" | "3";

export interface BCFTopic {
  guid: string;
  serverAssignedId?: string;
  type: string;
  status: string;
  title: string;
  priority?: string;
  index?: number;
  labels: Set<string>;
  creationDate: Date;
  creationAuthor: string;
  modifiedDate?: Date;
  modifiedAuthor?: string;
  dueDate?: Date;
  assignedTo?: string;
  description?: string;
  stage?: string;
}

export interface DocumentReference {
  type: "internal" | "external";
  description?: string;
}

export interface InternalDocumentReference extends DocumentReference {
  type: "internal";
  fileName: string;
  data: Uint8Array;
}

export interface ExternalDocumentReference extends DocumentReference {
  type: "external";
  url: string;
}

export interface BCFApiComment {
  guid: string;
  date: string;
  author: string;
  comment: string;
  topic_guid?: string; // this is required in the BCF API specification
  viewpoint_guid?: string;
  modified_date?: string;
  modified_author?: string;
}

export interface BCFApiTopic {
  guid: string;
  server_assigned_id?: string;
  topic_type?: string;
  topic_status?: string;
  reference_links?: string[];
  title: string;
  priority?: string;
  index?: number;
  labels?: string[];
  creation_date: string;
  creation_author: string;
  modified_date?: string;
  modified_author?: string;
  assigned_to?: string;
  stage?: string;
  description?: string;
  bim_snippet?: {
    snippet_type: string;
    is_external: boolean;
    reference: string;
    reference_schema: string;
  };
  due_date?: string;
  comments?: BCFApiComment[];
  viewpoints?: BCFViewpoint[];
  relatedTopics?: { related_topic_guid: string }[];
  document_references?: {
    guid: string;
    document_guid?: string;
    url?: string;
    description?: string;
  }[];
}
