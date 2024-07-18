import { UUID } from "../../../utils";
import { Components } from "../../../core/Components";
import { Viewpoint } from "../../../core/Viewpoints";
import { Comment } from "./Comment";
import { BCFManager } from "..";

export class Topic {
  guid = UUID.create();
  title = "BCF Topic";
  type = "Issue";
  creationAuthor = "jhon.doe@example.com";
  creationDate = new Date();
  status = "Active";
  readonly comments = new Set<Comment>();
  readonly viewpoints = new Set<Viewpoint>();
  customData: Record<string, any> = {};
  description?: string;
  serverAssignedId?: string;
  priority?: string;
  stage?: string;
  labels = new Set<string>();
  assignedTo?: string;
  dueDate?: Date;
  modifiedAuthor?: string;
  modifiedDate?: Date;
  index?: number;

  private _components: Components;

  private get _managerVersion() {
    const manager = this._components.get(BCFManager);
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
