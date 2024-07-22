import { UUID } from "../../../utils";
import { Components } from "../../../core/Components";
import { Viewpoint } from "../../../core/Viewpoints";
import { Comment } from "./Comment";
import { BCFTopics } from "..";

export class Topic {
  guid = UUID.create();
  title = "BCF Topic";
  creationDate = new Date();
  readonly comments = new Set<Comment>();
  readonly viewpoints = new Set<Viewpoint>();
  customData: Record<string, any> = {};
  description?: string;
  serverAssignedId?: string;
  dueDate?: Date;
  modifiedAuthor?: string;
  modifiedDate?: Date;
  index?: number;

  get creationAuthor() {
    const manager = this._components.get(BCFTopics);
    const author = manager.config.author;
    return author;
  }

  private _type = "Issue";

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

  private _status = "Active";

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

  private _priority?: string;

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

  private _stage?: string;

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

  private _assignedTo?: string;

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

  private _labels = new Set<string>();

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

  constructor(components: Components) {
    this._components = components;
  }

  createComment(text: string) {
    const comment = new Comment(this._components, text);
    this.comments.add(comment);
    return comment;
  }

  serialize(version = this._managerVersion) {
    let serverAssignedIdAttribute: string | null = null;
    if (this.serverAssignedId) {
      serverAssignedIdAttribute = `ServerAssignedId="${this.serverAssignedId}"`;
    }

    let priorityTag: string | null = null;
    if (this.priority) {
      priorityTag = `<ModifiedAuthor>${this.priority}</ModifiedAuthor>`;
    }

    let indexTag: string | null = null;
    if (this.index) {
      indexTag = `<ModifiedAuthor>${this.index}</ModifiedAuthor>`;
    }

    let labelTags = [...this.labels]
      .map((label) => `<Labels>${label}</Labels>`)
      .join("\n");

    for (const key in this.customData) {
      const value = this.customData[key];
      if (typeof value !== "string") continue;
      labelTags += `\n<Labels>${value}</Labels>`;
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

    const commentTags = [...this.comments]
      .map((comment) => comment.serialize(version))
      .join("\n");

    const viewpointTags = [...this.viewpoints]
      .map(
        (viewpoint) =>
          `<Viewpoints Guid="${viewpoint.guid}">
          <Viewpoint>${viewpoint.guid}.bcfv</Viewpoint>
          <Snapshot>${viewpoint.guid}.jpeg</Snapshot>
        </Viewpoints>
      `,
      )
      .join("\n");

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
        </Topic>
        ${commentTags}
        ${viewpointTags}
      </Markup>
    `;
  }
}
