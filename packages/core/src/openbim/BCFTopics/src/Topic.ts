import { UUID } from "../../../utils";
import { Components } from "../../../core/Components";
import { Viewpoint, Viewpoints } from "../../../core/Viewpoints";
import { Comment } from "./Comment";
import { BCFTopics } from "..";
import { BCFTopic } from "./types";
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
  customData: Record<string, any> = {};
  description?: string;
  serverAssignedId?: string;
  dueDate?: Date;
  modifiedAuthor?: string;
  modifiedDate?: Date;
  index?: number;

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
  createComment(text: string, viewpoint?: Viewpoint) {
    const comment = new Comment(this._components, text);
    comment.viewpoint = viewpoint;
    comment.topic = this;
    this.comments.set(comment.guid, comment);
    return comment;
  }

  private createLabelTags(version = this._managerVersion) {
    let tag = "Labels";
    if (version === "2.1") tag = "Labels";
    if (version === "3") tag = "Label";

    let tags = [...this.labels]
      .map((label) => `<${tag}>${label}</${tag}>`)
      .join("\n");

    for (const key in this.customData) {
      const value = this.customData[key];
      if (typeof value !== "string") continue;
      tags += `\n<${tag}>${value}</${tag}>`;
    }

    if (version === "2.1") return tags;
    if (version === "3") {
      if (tags.length !== 0) return `<Labels>\n${tags}\n</Labels>`;
      return "<Labels/>";
    }

    return tags;
  }

  private createCommentTags(version = this._managerVersion) {
    const tags = [...this.comments.values()]
      .map((comment) => comment.serialize())
      .join("\n");

    if (version === "2.1") return tags;
    if (version === "3") {
      if (tags.length !== 0) return `<Comments>\n${tags}\n</Comments>`;
      return "<Comments/>";
    }

    return tags;
  }

  private createViewpointTags(version = this._managerVersion) {
    let tag = "Viewpoints";
    if (version === "2.1") tag = "Viewpoints";
    if (version === "3") tag = "ViewPoint";

    // Make sure to only associate existing viewpoints
    const manager = this._components.get(Viewpoints);
    const viewpoints = [...this.viewpoints]
      .map((viewpointID) => manager.list.get(viewpointID))
      .filter((viewpoint) => viewpoint) as Viewpoint[];

    const tags = viewpoints
      .map((viewpoint) => {
        return `<${tag} Guid="${viewpoint.guid}">
          <Viewpoint>${viewpoint.guid}.bcfv</Viewpoint>
          <Snapshot>${viewpoint.guid}.jpeg</Snapshot>
        </${tag}>
      `;
      })
      .join("\n");

    if (version === "2.1") return tags;
    if (version === "3") {
      if (tags.length !== 0) return `<Viewpoints>\n${tags}\n</Viewpoints>`;
      return "<Viewpoints />";
    }

    return tags;
  }

  private createRelatedTopicTags(version = this._managerVersion) {
    const tags = [...this.relatedTopics]
      .map(
        (guid) => `<RelatedTopic Guid="${guid}"></RelatedTopic>
      `,
      )
      .join("\n");

    if (version === "2.1") return tags;
    if (version === "3") {
      if (tags.length !== 0)
        return `<RelatedTopics>\n${tags}\n</RelatedTopics>`;
      return "<RelatedTopics />";
    }

    return tags;
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

    let serverAssignedIdAttribute: string | null = null;
    if (this.serverAssignedId) {
      serverAssignedIdAttribute = `ServerAssignedId="${this.serverAssignedId}"`;
    }

    let priorityTag: string | null = null;
    if (this.priority) {
      priorityTag = `<Priority>${this.priority}</Priority>`;
    }

    let indexTag: string | null = null;
    if (this.index && version === "2.1") {
      indexTag = `<Index>${this.index}</Index>`;
    }

    let modifiedDateTag: string | null = null;
    if (this.modifiedDate) {
      modifiedDateTag = `<ModifiedDate>${this.modifiedDate.toISOString()}</ModifiedDate>`;
    }

    let modifiedAuthorTag: string | null = null;
    if (this.modifiedAuthor) {
      modifiedAuthorTag = `<ModifiedAuthor>${this.modifiedAuthor}</ModifiedAuthor>`;
    }

    let dueDateTag: string | null = null;
    if (this.dueDate) {
      dueDateTag = `<DueDate>${this.dueDate.toISOString()}</DueDate>`;
    }

    let assignedToTag: string | null = null;
    if (this.assignedTo) {
      assignedToTag = `<AssignedTo>${this.assignedTo}</AssignedTo>`;
    }

    let descriptionTag: string | null = null;
    if (this.description) {
      descriptionTag = `<Description>${this.description}</Description>`;
    }

    let stageTag: string | null = null;
    if (this.stage) {
      stageTag = `<Stage>${this.stage}</Stage>`;
    }

    const commentTags = this.createCommentTags(version);
    const viewpointTags = this.createViewpointTags(version);
    const labelTags = this.createLabelTags(version);
    const relatedTopicTags = this.createRelatedTopicTags(version);

    return `
      <?xml version="1.0" encoding="UTF-8"?>
      <Markup>
        <Topic Guid="${this.guid}" TopicType="${this.type}" TopicStatus="${this.status}" ${serverAssignedIdAttribute ?? ""}>
          <Title>${this.title}</Title>
          <CreationDate>${this.creationDate.toISOString()}</CreationDate>
          <CreationAuthor>${this.creationAuthor}</CreationAuthor>
          ${priorityTag ?? ""}
          ${indexTag ?? ""}
          ${modifiedDateTag ?? ""}
          ${modifiedAuthorTag ?? ""}
          ${dueDateTag ?? ""}
          ${assignedToTag ?? ""}
          ${descriptionTag ?? ""}
          ${stageTag ?? ""}
          ${labelTags}
          ${relatedTopicTags}
          ${version === "3" ? commentTags : ""}
          ${version === "3" ? viewpointTags : ""}
        </Topic>
        ${version === "2.1" ? commentTags : ""}
        ${version === "2.1" ? viewpointTags : ""}
      </Markup>
    `;
  }
}
