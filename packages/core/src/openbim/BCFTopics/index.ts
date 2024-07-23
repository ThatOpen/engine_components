import JSZip from "jszip";
import { XMLParser } from "fast-xml-parser";
import { Component, Configurable, Disposable, Event } from "../../core/Types";
import { BCFTopicsConfig, BCFVersion, Topic } from "./src";
import { Viewpoints } from "../../core/Viewpoints";
import { Comment } from "./src/Comment";

export class BCFTopics
  extends Component
  implements Disposable, Configurable<BCFTopicsConfig>
{
  static uuid = "de977976-e4f6-4e4f-a01a-204727839802" as const;
  enabled = false;

  private _xmlParser = new XMLParser({
    allowBooleanAttributes: true,
    attributeNamePrefix: "",
    ignoreAttributes: false,
    ignoreDeclaration: true,
    ignorePiTags: true,
    numberParseOptions: { leadingZeros: true, hex: true },
    parseAttributeValue: true,
    preserveOrder: false,
    processEntities: false,
    removeNSPrefix: true,
    trimValues: true,
  });

  config: Required<BCFTopicsConfig> = {
    author: "jhon.doe@example.com",
    version: "2.1",
    types: new Set(["Issue"]),
    statuses: new Set(["Active"]),
    priorities: new Set(),
    labels: new Set(),
    stages: new Set(),
    users: new Set(),
    includeSelectionTag: false,
    updateExtensionsOnImport: true,
    strict: false,
    includeAllExtensionsOnExport: true,
    fallbackVersionOnImport: "2.1",
    ignoreIncompleteTopicsOnImport: false,
  };

  readonly list = new Map<string, Topic>();

  readonly onSetup = new Event();
  isSetup = false;
  setup(config?: Partial<BCFTopicsConfig>) {
    if (this.isSetup) return;
    this.config = { ...this.config, ...config };
    this.isSetup = true;
    this.enabled = true;
    this.onSetup.trigger();
  }

  readonly onTopicCreated = new Event<Topic>();
  readonly onTopicDeleted = new Event<string>();

  createTopic() {
    const topic = new Topic(this.components);
    this.list.set(topic.guid, topic);
    this.onTopicCreated.trigger(topic);
    return topic;
  }

  deleteTopic(topic: Topic) {
    const { guid } = topic;
    const deleted = this.list.delete(guid);
    this.onTopicDeleted.trigger(guid);
    return deleted;
  }

  readonly onDisposed = new Event();
  dispose() {
    (this.list as any) = [];
    this.onDisposed.trigger();
    this.onDisposed.reset();
  }

  /**
   * Retrieves the unique set of topic types used across all topics.
   *
   * @returns A Set containing the unique topic types.
   */
  get usedTypes() {
    const types = [...this.list].map(([_, topic]) => topic.type);
    return new Set(types);
  }

  /**
   * Retrieves the unique set of topic statuses used across all topics.
   *
   * @returns A Set containing the unique topic statuses.
   */
  get usedStatuses() {
    const statuses = [...this.list].map(([_, topic]) => topic.status);
    return new Set(statuses);
  }

  /**
   * Retrieves the unique set of topic priorities used across all topics.
   *
   * @returns A Set containing the unique topic priorities.
   * Note: This method filters out any null or undefined priorities.
   */
  get usedPriorities() {
    const priorities = [...this.list]
      .map(([_, topic]) => topic.priority)
      .filter((priority) => priority);
    return new Set(priorities);
  }

  /**
   * Retrieves the unique set of topic stages used across all topics.
   *
   * @returns A Set containing the unique topic stages.
   * Note: This method filters out any null or undefined stages.
   */
  get usedStages() {
    const stages = [...this.list]
      .map(([_, topic]) => topic.stage)
      .filter((stage) => stage);
    return new Set(stages);
  }

  /**
   * Retrieves the unique set of users associated with topics.
   *
   * @returns A Set containing the unique users.
   * Note: This method collects users from the creation author, assigned to, modified author, and comment authors.
   */
  get usedUsers() {
    const users: string[] = [];
    for (const [_, topic] of this.list) {
      users.push(topic.creationAuthor);
      if (topic.assignedTo) users.push(topic.assignedTo);
      if (topic.modifiedAuthor) users.push(topic.modifiedAuthor);
      for (const comment of topic.comments) {
        users.push(comment.author);
        if (comment.modifiedAuthor) users.push(comment.modifiedAuthor);
      }
    }
    return new Set(users);
  }

  /**
   * Retrieves the unique set of labels used across all topics.
   *
   * @returns A Set containing the unique labels.
   */
  get usedLabels() {
    const labels: string[] = [];
    for (const [_, topic] of this.list) labels.push(...topic.labels);
    return new Set(labels);
  }

  /**
   * Updates the set of extensions (types, statuses, priorities, labels, stages, users) based on the current topics.
   * This method iterates through each topic in the list and adds its properties to the corresponding sets in the config.
   */
  updateExtensions() {
    for (const [_, topic] of this.list) {
      for (const label of topic.labels) this.config.labels.add(label);
      this.config.types.add(topic.type);
      if (topic.priority) this.config.priorities.add(topic.priority);
      if (topic.stage) this.config.stages.add(topic.stage);
      this.config.statuses.add(topic.status);
      this.config.users.add(topic.creationAuthor);
      if (topic.assignedTo) this.config.users.add(topic.assignedTo);
      if (topic.modifiedAuthor) this.config.users.add(topic.modifiedAuthor);
      for (const comment of topic.comments) {
        this.config.users.add(comment.author);
        if (comment.modifiedAuthor)
          this.config.users.add(comment.modifiedAuthor);
      }
    }
  }

  private serializeExtensions() {
    const types = [...this.config.types]
      .map((type) => `<TopicType>${type}</TopicType>`)
      .join("\n");

    const statuses = [...this.config.statuses]
      .map((status) => `<TopicStatuses>${status}</TopicStatuses>`)
      .join("\n");

    const priorities = [...this.config.priorities]
      .map((priority) => `<Priorities>${priority}</Priorities>`)
      .join("\n");

    const labels = [...this.config.labels]
      .map((label) => `<TopicLabels>${label}</TopicLabels>`)
      .join("\n");

    const stages = [...this.config.stages]
      .map((stage) => `<Stages>${stage}</Stages>`)
      .join("\n");

    const users = [...this.config.users]
      .map((user) => `<Users>${user}</Users>`)
      .join("\n");

    return `
      <?xml version="1.0" encoding="UTF-8"?>
      <Extensions xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:noNamespaceSchemaLocation="your-schema-location.xsd">
        ${types.length !== 0 ? `<TopicTypes>\n${types}\n</TopicTypes>` : ""}
        ${statuses.length !== 0 ? `<TopicStatuses>\n${statuses}\n</TopicStatuses>` : ""}
        ${priorities.length !== 0 ? `<Priorities>\n${priorities}\n</Priorities>` : ""}
        ${labels.length !== 0 ? `<TopicLabels>\n${labels}\n</TopicLabels>` : ""}
        ${stages.length !== 0 ? `<Stages>\n${stages}\n</Stages>` : ""}
        ${users.length !== 0 ? `<Users>\n${users}\n</Users>` : ""}
      </Extensions>
    `;
  }

  async export(topics = this.list) {
    const zip = new JSZip();
    zip.file(
      "bcf.version",
      `<?xml version="1.0" encoding="UTF-8"?>
    <Version VersionId="${this.config.version}" xsi:noNamespaceSchemaLocation="https://raw.githubusercontent.com/buildingSMART/BCF-XML/release_3_0/Schemas/version.xsd"
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
    </Version>`,
    );
    zip.file("bcf.extensions", this.serializeExtensions());
    for (const [_, topic] of topics) {
      const topicFolder = zip.folder(topic.guid) as JSZip;
      topicFolder.file("markup.bcf", topic.serialize());
      for (const viewpoint of topic.viewpoints) {
        const image = await fetch("/topic-viewpoint-snapshot.jpeg");
        topicFolder.file(`${viewpoint.guid}.jpeg`, image.blob(), {
          binary: true,
        });
        topicFolder.file(`${viewpoint.guid}.bcfv`, await viewpoint.serialize());
      }
    }
    const content = await zip.generateAsync({ type: "blob" });
    return content;
  }

  private processComment(markupComment: any) {
    const { Guid, Date, Author, Comment, Viewpoint } = markupComment;
    if (!(Guid && Date && Author && (Comment || Viewpoint))) return null;
    const viewpoints = this.components.get(Viewpoints);
    const comment = new Comment(this.components, Comment ?? "") as Comment;
    comment.guid = Guid;
    comment.date = Date;
    comment.author = Author;
    comment.viewpoint = viewpoints.list.get(Viewpoint);
    comment.modifiedAuthor = markupComment.ModifiedAuthor;
    comment.modifiedDate = markupComment.ModifiedDate
      ? new Date(markupComment.ModifiedDate)
      : undefined;
    return comment;
  }

  private getCommentsFromXML(markup: any, version: BCFVersion) {
    let data: any;
    if (version === "2.1") data = markup.Comment;
    if (version === "3") data = markup.Topic.Comments?.Comment;
    if (!data) return [];
    data = Array.isArray(data) ? data : [data];
    const comments = data
      .map((comment: any) => this.processComment(comment))
      .filter((comment: any) => comment) as Comment[];
    const array = Array.isArray(comments) ? comments : [comments];
    return array;
  }

  private getLabelsFromXML(markup: any, version: BCFVersion) {
    let data: any;
    if (version === "2.1") data = markup.Topic.Labels;
    if (version === "3") data = markup.Topic.Labels?.Label;
    if (!data) return [];
    const labels: string[] = Array.isArray(data) ? data : [data];
    return labels;
  }

  async import(data: Uint8Array) {
    const { fallbackVersionOnImport, ignoreIncompleteTopicsOnImport } =
      this.config;
    const zip = new JSZip();
    await zip.loadAsync(data);

    const files = Object.values(zip.files);

    // Get BCF Version from incomming data
    let bcfVersion = fallbackVersionOnImport;
    const versionFile = files.find((file) => file.name.endsWith(".version"));
    if (versionFile) {
      const versionXML = await versionFile.async("string");
      const version = this._xmlParser.parse(versionXML).Version.VersionId;
      bcfVersion = String(version) as BCFVersion;
    }

    // Viewpoints need to be processed first as they don't care about the topic, but the topic comments care about them
    // const viewpointFiles = files.filter( file => file.name.endsWith(".bcfv") )
    // for (const viewpointFile of viewpointFiles) {
    //   const xml = await viewpointFile.async("string")
    //   const viewpointObject = BCFManager.xmlParser.parse(xml).VisualizationInfo
    //   const camera = viewpointObject.PerspectiveCamera?? viewpointObject.OrthogonalCamera
    //   const viewpoint: Partial<Viewpoint> = {
    //     guid: viewpointObject.Guid,
    //     perspectiveCamera: true,
    //     camera: {
    //       fov: 45,
    //       aspect: camera.AspectRatio?? 1,
    //       direction: {
    //         x: isNaN(camera.CameraDirection.X)? camera.CameraDirection.X : Number(camera.CameraDirection.X),
    //         y: isNaN(camera.CameraDirection.Z)? camera.CameraDirection.Z : Number(camera.CameraDirection.Z),
    //         z: isNaN(-camera.CameraDirection.Y)? -camera.CameraDirection.Y : Number(-camera.CameraDirection.Y),
    //       },
    //       position: {
    //         x: isNaN(camera.CameraViewPoint.X)? -camera.CameraViewPoint.X : Number(-camera.CameraViewPoint.X),
    //         y: isNaN(-camera.CameraViewPoint.Z)? camera.CameraViewPoint.Z : Number(-camera.CameraViewPoint.Z),
    //         z: isNaN(camera.CameraViewPoint.Y)? -camera.CameraViewPoint.Y : Number(camera.CameraViewPoint.Y),
    //       }
    //     }
    //   }

    //   viewpointObject.Components?.Visibility?.DefaultVisibility && ( viewpoint.defaultVisibility =  viewpointObject.Components.Visibility.DefaultVisibility)
    //   viewpointObject.Components?.ViewSetupHints?.OpeningsVisible && ( viewpoint.openingsVisible =  viewpointObject.Components.ViewSetupHints.OpeningsVisible)
    //   viewpointObject.Components?.ViewSetupHints?.SpaceBoundariesVisible && ( viewpoint.spaceBoundariesVisible =  viewpointObject.Components.ViewSetupHints.SpaceBoundariesVisible)
    //   viewpointObject.Components?.ViewSetupHints?.SpacesVisible && ( viewpoint.spacesVisible =  viewpointObject.Components.ViewSetupHints.SpacesVisible)

    //   if (viewpointObject.Components?.Selection?.Component) {
    //     viewpoint.selectionComponents = convertToArray<{IfcGuid: string}>(viewpointObject.Components.Selection.Component).map( component => {return component.IfcGuid} )
    //   }

    //   const topic = topics.find( t => t.guid === file.name.split("/")[0] ) as ITopic
    //   const position = (viewpoint as Viewpoint).camera.position
    //   topic.viewpoints.push(viewpoint as Viewpoint)
    // }
    // for (const topic of topics) this.createTopic(topic);

    // Process markup files
    const markupFiles = files.filter((file) => file.name.endsWith(".bcf"));
    for (const markupFile of markupFiles) {
      const xml = await markupFile.async("string");
      const markup = this._xmlParser.parse(xml).Markup;
      const markupTopic = markup.Topic;
      const { Guid, Type, Status, Title, CreationDate, CreationAuthor } =
        markupTopic;

      // Required Data
      if (ignoreIncompleteTopicsOnImport) {
        if (
          !(Guid && Type && Status && Title && CreationDate && CreationAuthor)
        )
          continue;
      }
      const topic = new Topic(this.components);
      topic.guid = Guid ?? topic.guid;
      topic.type = Type ?? topic.type;
      topic.status = Status ?? topic.status;
      topic.title = Title ?? topic.title;
      topic.creationDate = CreationDate
        ? new Date(CreationDate)
        : topic.creationDate;
      topic.creationAuthor = CreationAuthor ?? topic.creationAuthor;

      // Optional Data
      topic.serverAssignedId = markupTopic.ServerAssignedId;
      topic.priority = markupTopic.Priority;
      topic.index = markupTopic.Index;
      topic.modifiedDate = markupTopic.ModifiedDate
        ? new Date(markupTopic.ModifiedDate)
        : undefined;
      topic.modifiedAuthor = markupTopic.ModifiedAuthor;
      topic.dueDate = markupTopic.DueDate
        ? new Date(markupTopic.DueDate)
        : undefined;
      topic.assignedTo = markupTopic.AssignedTo;
      topic.description = markupTopic.Description;
      topic.stage = markupTopic.Stage;
      const labels = this.getLabelsFromXML(markup, bcfVersion);
      for (const label of labels) topic.labels.add(label);
      const comments = this.getCommentsFromXML(markup, bcfVersion);
      for (const comment of comments) topic.comments.add(comment);
      this.list.set(topic.guid, topic);
      this.onTopicCreated.trigger(topic);
    }
  }
}

export * from "./src";
