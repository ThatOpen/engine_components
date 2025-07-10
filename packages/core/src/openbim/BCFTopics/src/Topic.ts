import { UUID, XML } from "../../../utils";
import { Components } from "../../../core/Components";
import { Viewpoint, Viewpoints } from "../../../core/Viewpoints";
import { Comment } from "./Comment";
import { BCFTopics } from "..";
import { BCFApiTopic, BCFTopic } from "./types";
import { DataMap, DataSet } from "../../../core/Types";

export class Topic implements BCFTopic {
  /**
   * Default values for a BCF Topic, excluding `guid`, `creationDate`, and `creationAuthor`.
   */
  static default: Omit<
    Partial<BCFTopic> & {
      title: string;
      type: string;
      status: string;
    },
    "guid" | "creationDate" | "creationAuthor"
  > = {
    title: "BCF Topic",
    type: "Issue",
    status: "Active",
  };

  /**
   * A unique identifier for the topic.
   *
   * @remarks
   * The `guid` is automatically generated upon topic creation and by no means it should change.
   */
  guid = UUID.create();
  title = Topic.default.title;
  creationDate = new Date();
  creationAuthor = "";
  // Store viewpoint guids instead of the actual Viewpoint to prevent a possible memory leak
  readonly viewpoints = new DataSet<string>();
  // Store topic guids instead of the actual Topic to prevent a possible memory leak
  readonly relatedTopics = new DataSet<string>();
  // There is no problem to store the comment it-self as it is not referenced anywhere else
  readonly comments = new DataMap<string, Comment>();
  // Store document reference guids instead of the actual thing to prevent a possible memory leak
  readonly documentReferences = new DataSet<string>();
  customData: Record<string, any> = {};
  description?: string;
  serverAssignedId?: string;
  dueDate?: Date;
  modifiedAuthor?: string;
  modifiedDate?: Date;
  index?: number;

  // Based on the BCF API documentation, the files associated with a topic are the models that should be loaded when displaying the topic's viewpoints.
  // files: any

  private _type = Topic.default.type;

  set type(value: string) {
    const manager = this._components.get(BCFTopics);
    const { strict, types } = manager.config;
    const valid = strict ? types.has(value) : true;
    if (!valid) return;
    this._type = value;
  }

  get type() {
    return this._type;
  }

  private _status = Topic.default.status;

  set status(value: string) {
    const manager = this._components.get(BCFTopics);
    const { strict, statuses } = manager.config;
    const valid = strict ? statuses.has(value) : true;
    if (!valid) return;
    this._status = value;
  }

  get status() {
    return this._status;
  }

  private _priority? = Topic.default.priority;

  set priority(value: string | undefined) {
    const manager = this._components.get(BCFTopics);
    if (value) {
      const { strict, priorities } = manager.config;
      const valid = strict ? priorities.has(value) : true;
      if (!valid) return;
      this._priority = value;
    } else {
      this._priority = value;
    }
  }

  get priority() {
    return this._priority;
  }

  private _stage? = Topic.default.stage;

  set stage(value: string | undefined) {
    const manager = this._components.get(BCFTopics);
    if (value) {
      const { strict, stages } = manager.config;
      const valid = strict ? stages.has(value) : true;
      if (!valid) return;
      this._stage = value;
    } else {
      this._stage = value;
    }
  }

  get stage() {
    return this._stage;
  }

  private _assignedTo? = Topic.default.assignedTo;

  set assignedTo(value: string | undefined) {
    const manager = this._components.get(BCFTopics);
    if (value) {
      const { strict, users } = manager.config;
      const valid = strict ? users.has(value) : true;
      if (!valid) return;
      this._assignedTo = value;
    } else {
      this._assignedTo = value;
    }
  }

  get assignedTo() {
    return this._assignedTo;
  }

  private _labels = Topic.default.labels ?? new Set();

  set labels(value: Set<string>) {
    const manager = this._components.get(BCFTopics);
    const { strict, labels } = manager.config;
    if (strict) {
      const _value = new Set<string>();
      for (const label of value) {
        const valid = strict ? labels.has(label) : true;
        if (!valid) continue;
        _value.add(label);
      }
      this._labels = _value;
    } else {
      this._labels = value;
    }
  }

  get labels() {
    return this._labels;
  }

  private _components: Components;

  private get _managerVersion() {
    const manager = this._components.get(BCFTopics);
    return manager.config.version;
  }

  /**
   * Initializes a new instance of the `Topic` class representing a BCF (BIM Collaboration Format) topic.
   * It provides methods and properties to manage and serialize BCF topics.
   *
   * @remarks
   * The default creationUser is the one set in BCFTopics.config.author
   * It should not be created manually. Better use BCFTopics.create().
   *
   * @param components - The `Components` instance that provides access to other components and services.
   */
  constructor(components: Components) {
    this._components = components;
    const manager = components.get(BCFTopics);
    this.creationAuthor = manager.config.author;
    // Prevent the topic to reference it-self
    this.relatedTopics.guard = (guid) => guid !== this.guid;
  }

  /**
   * Sets properties of the BCF Topic based on the provided data.
   *
   * @remarks
   * This method iterates over the provided `data` object and updates the corresponding properties of the BCF Topic.
   * It skips the `guid` property as it should not be modified.
   *
   * @param data - An object containing the properties to be updated.
   * @returns The topic
   *
   * @example
   * ```typescript
   * const topic = new Topic(components);
   * topic.set({
   *   title: "New BCF Topic Title",
   *   description: "This is a new description.",
   *   status: "Resolved",
   * });
   * ```
   */
  set(data: Partial<BCFTopic>) {
    const _data = data as any;
    const _this = this as any;
    for (const key in data) {
      if (key === "guid") continue;
      const value = _data[key];
      if (key in this) _this[key] = value;
    }
    const manager = this._components.get(BCFTopics);
    manager.list.set(this.guid, this);
    return this;
  }

  /**
   * Creates a new comment associated with the current topic.
   *
   * @param text - The text content of the comment.
   * @param viewpoint - (Optional) The viewpoint associated with the comment.
   *
   * @returns The newly created comment.
   *
   * @example
   * ```typescript
   * const viewpoint = viewpoints.create(world); // Created with an instance of Viewpoints
   * const topic = topics.create(); // Created with an instance of BCFTopics
   * topic.viewpoints.add(viewpoint);
   * const comment = topic.createComment("This is a new comment", viewpoint);
   * ```
   */
  createComment(text: string, viewpoint?: string) {
    const comment = new Comment(this._components, text);
    comment.viewpoint = viewpoint;
    comment.topic = this;
    this.comments.set(comment.guid, comment);
    return comment;
  }

  private createLabelTags() {
    const labels = [...this.labels];

    const manager = this._components.get(BCFTopics);
    if (manager.config.exportCustomDataAsLabels) {
      for (const key in this.customData) {
        const value = this.customData[key];
        if (typeof value !== "string") continue;
        labels.push(value);
      }
    }

    return labels;
  }

  private createCommentTags() {
    return [...this.comments.values()].map((comment) => {
      return {
        $Guid: comment.guid,
        Date: comment.date.toISOString(),
        Author: comment.author,
        Comment: comment.comment,
        ModifiedAuthor: comment.modifiedAuthor,
        ModifiedDate: comment.modifiedDate?.toISOString(),
        Viewpoint: comment.viewpoint ? { $Guid: comment.viewpoint } : undefined,
      };
    });
  }

  private createViewpointTags() {
    // Make sure to only associate existing viewpoints
    const manager = this._components.get(Viewpoints);
    const viewpoints = [...this.viewpoints]
      .map((viewpointID) => manager.list.get(viewpointID))
      .filter((viewpoint) => viewpoint) as Viewpoint[];

    return viewpoints.map((viewpoint) => {
      const xmlData: Record<string, string> = {
        $Guid: viewpoint.guid,
        Viewpoint: `${viewpoint.title ?? viewpoint.guid}.bcfv`,
      };
      const snapshotData = manager.snapshots.get(viewpoint.snapshot);
      if (snapshotData) {
        const snapshotExtension = manager.getSnapshotExtension(
          viewpoint.snapshot,
        );
        xmlData.Snapshot = `${viewpoint.snapshot}.${snapshotExtension}`;
      }
      return xmlData;
    });
  }

  private createRelatedTopicTags() {
    return [...this.relatedTopics].map((guid) => {
      return { $Guid: guid };
    });
  }

  private createDocumentReferencesTag(version = this._managerVersion) {
    const references: Record<string, any>[] = [];
    if (!(version === "3" || version === "2.1")) return references;
    const manager = this._components.get(BCFTopics);
    for (const guid of this.documentReferences) {
      const doc = manager.documents.get(guid);
      if (!doc) continue;
      let reference: Record<string, any> = {
        $Guid: UUID.create(),
        Description: doc.description,
      };
      if (version === "2.1") {
        reference = {
          ...reference,
          $isExternal: doc.type === "external" ? true : undefined,
          ReferencedDocument:
            doc.type === "external" ? doc.url : `../${doc.fileName}`,
        };
      }
      if (version === "3") {
        reference = {
          ...reference,
          DocumentGuid: doc.type === "internal" ? guid : undefined,
          Url: doc.type === "external" ? doc.url : undefined,
        };
      }
      if (Object.keys(reference).length > 0) references.push(reference);
    }
    return references;
  }

  toJSON() {
    const result: BCFApiTopic = {
      guid: this.guid,
      server_assigned_id: this.serverAssignedId,
      topic_type: this.type,
      topic_status: this.status,
      title: this.title,
      priority: this.priority,
      index: this.index,
      labels: [...this.labels],
      creation_date: this.creationDate.toISOString(),
      creation_author: this.creationAuthor,
      modified_date: this.modifiedDate?.toISOString(),
      modified_author: this.modifiedAuthor,
      assigned_to: this.assignedTo,
      stage: this.stage,
      description: this.description,
      due_date: this.dueDate?.toISOString(),
      comments: [...this.comments].map(([_, comment]) => comment.toJSON()),
      relatedTopics: [...this.relatedTopics].map((guid) => {
        return { related_topic_guid: guid };
      }),
    };

    const viewpointsManager = this._components.get(Viewpoints);
    for (const guid of this.viewpoints) {
      const viewpoint = viewpointsManager.list.get(guid);
      if (!viewpoint) continue;
      if (!result.viewpoints) result.viewpoints = [];
      result.viewpoints.push(viewpoint.toJSON());
    }

    const topicsManager = this._components.get(BCFTopics);
    for (const guid of this.documentReferences) {
      const reference = topicsManager.documents.get(guid);
      if (!reference) continue;
      if (!result.document_references) result.document_references = [];
      if (reference.type === "external") {
        result.document_references.push({
          guid: UUID.create(), // TODO: this is for sure incorrect!
          description: reference.description,
          url: reference.url,
        });
      } else {
        result.document_references.push({
          guid: UUID.create(), // TODO: this is for sure incorrect!
          description: reference.description,
          document_guid: guid,
        });
      }
    }

    for (const [key, value] of Object.entries(result)) {
      if (value === undefined || (Array.isArray(value) && value.length === 0)) {
        delete (result as any)[key];
      }
    }

    return result;
  }

  /**
   * Serializes the BCF Topic instance into an XML string representation based on the official schema.
   *
   * @remarks
   * This method constructs an XML string based on the properties of the BCF Topic instance.
   * It includes the topic's guid, type, status, creation date, creation author, priority, index,
   * modified date, modified author, due date, assigned to, description, stage, labels, related topics,
   * comments, and viewpoints.
   *
   * @returns A string representing the XML serialization of the BCF Topic.
   *
   * @example
   * ```typescript
   * const topic = bcfTopics.create(); // Created with an instance of BCFTopics
   * const xml = topic.serialize();
   * console.log(xml);
   * ```
   */
  serialize() {
    const version = this._managerVersion;

    const topic: Record<string, any> = {
      $Guid: this.guid,
      $TopicType: this.type,
      $TopicStatus: this.status,
      $ServerAssignedId: this.serverAssignedId,
      Title: this.title,
      CreationAuthor: this.creationAuthor,
      CreationDate: this.creationDate.toISOString(),
      Priority: this.priority,
      Index: version === "2.1" ? this.index : undefined,
      ModifiedDate: this.modifiedDate?.toISOString(),
      ModifiedAuthor: this.modifiedAuthor,
      DueDate: this.dueDate?.toISOString(),
      AssignedTo: this.assignedTo,
      Description: this.description,
      Stage: this.stage,
      DocumentReferences:
        version === "3"
          ? { DocumentReference: this.createDocumentReferencesTag(version) }
          : undefined,
      RelatedTopics:
        version === "3"
          ? { RelatedTopic: this.createRelatedTopicTags() }
          : undefined,
      RelatedTopic:
        version === "2.1" ? this.createRelatedTopicTags() : undefined,
      Labels: version === "3" ? { Label: this.createLabelTags() } : undefined,
      Viewpoints:
        version === "3" ? { ViewPoint: this.createViewpointTags() } : undefined,
      Comments:
        version === "3" ? { Comment: this.createCommentTags() } : undefined,
    };

    if (version === "2.1") {
      topic.Labels = this.createLabelTags();
      topic.DocumentReference = this.createDocumentReferencesTag(version);
    }

    const markup: Record<string, any> = {
      Markup: { Topic: topic },
    };

    if (version === "2.1") {
      markup.Markup.Viewpoints = this.createViewpointTags();
      markup.Markup.Comment = this.createCommentTags();
    }

    return `<?xml version="1.0" encoding="UTF-8"?>
    ${XML.builder.build(markup)}`;
  }
}
