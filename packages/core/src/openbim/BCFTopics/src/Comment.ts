import { BCFTopics } from "..";
import { Viewpoint } from "../../../core/Viewpoints";
import { Components } from "../../../core/Components";
import { UUID } from "../../../utils";

/**
 * Represents a comment in a BCF Topic.
 */
export class Comment {
  date = new Date();
  author: string;
  guid = UUID.create();
  viewpoint?: Viewpoint;
  modifiedAuthor?: string;
  modifiedDate?: Date;

  private get _managerVersion() {
    const manager = this._components.get(BCFTopics);
    return manager.config.version;
  }

  private _components: Components;
  private _comment: string = "";

  /**
   * Sets the comment text and updates the modified date and author.
   * @param value - The new comment text.
   */
  set comment(value: string) {
    const manager = this._components.get(BCFTopics);
    this._comment = value;
    this.modifiedDate = new Date();
    this.modifiedAuthor = manager.config.author;
  }

  /**
   * Gets the comment text.
   * @returns The comment text.
   */
  get comment() {
    return this._comment;
  }

  /**
   * Constructs a new BCF Topic Comment instance.
   * @param components - The Components instance.
   * @param text - The initial comment text.
   */
  constructor(components: Components, text: string) {
    this._components = components;
    this._comment = text; // Set the comment to the private property to prevent setting a modifiedDate and author
    const manager = this._components.get(BCFTopics);
    this.author = manager.config.author;
  }

  serialize(version = this._managerVersion) {
    console.log(version);
    let viewpointTag: string | null = null;
    if (this.viewpoint) {
      viewpointTag = `<Viewpoint Guid="${this.viewpoint.guid}"/>`;
    }

    let modifiedDateTag: string | null = null;
    if (this.modifiedDate) {
      modifiedDateTag = `<ModifiedDate>${this.modifiedDate.toISOString()}</ModifiedDate>`;
    }

    let modifiedAuthorTag: string | null = null;
    if (this.modifiedAuthor) {
      modifiedAuthorTag = `<ModifiedAuthor>${this.modifiedAuthor}</ModifiedAuthor>`;
    }

    return `
      <Comment Guid="${this.guid}">
        <Date>${this.date.toISOString()}</Date>
        <Author>${this.author}</Author>
        <Comment>${this.comment}</Comment>
        ${viewpointTag ?? ""}
        ${modifiedAuthorTag ?? ""}
        ${modifiedDateTag ?? ""}
      </Comment>
    `;
  }
}
