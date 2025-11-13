import { BCFApiComment, BCFTopics, Topic } from "..";
import { Components } from "../../../core/Components";
import { UUID } from "../../../utils";

/**
 * Represents a comment in a BCF Topic.
 */
export class Comment {
  date = new Date();
  author: string;
  guid = UUID.create();
  viewpoint?: string;
  modifiedAuthor?: string;
  modifiedDate?: Date;
  topic?: Topic;

  private _components: Components;
  private _comment: string = "";

  /**
   * Sets the comment text and updates the modified date and author.
   * The author will be the one defined in BCFTopics.config.author
   * @param value - The new comment text.
   */
  set comment(value: string) {
    const manager = this._components.get(BCFTopics);
    this._comment = value;
    this.modifiedDate = new Date();
    this.modifiedAuthor = manager.config.author;
    this.topic?.comments.set(this.guid, this);
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

  toJSON() {
    const result: BCFApiComment = {
      guid: this.guid,
      date: this.date.toISOString(),
      author: this.author,
      comment: this.comment,
      topic_guid: this.topic?.guid,
      viewpoint_guid: this.viewpoint,
      modified_date: this.modifiedDate?.toISOString(),
      modified_author: this.modifiedAuthor,
    };

    for (const [key, value] of Object.entries(result)) {
      if (value === undefined) delete (result as any)[key];
    }

    return result;
  }
}
