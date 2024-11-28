import JSZip from "jszip";
import * as THREE from "three";
import { XMLParser } from "fast-xml-parser";
import {
  Component,
  Configurable,
  Disposable,
  Event,
  World,
  DataMap,
} from "../../core";

import {
  BCFTopic,
  BCFVersion,
  Topic,
  extensionsImporter,
  BCFTopicsConfigManager,
  BCFTopicsConfig,
  Comment,
} from "./src";

import {
  BCFViewpoint,
  Viewpoint,
  ViewpointCamera,
  Viewpoints,
} from "../../core/Viewpoints";

import { Clipper } from "../../core/Clipper";

// TODO: Extract import/export logic in its own class for better maintenance.

/**
 * BCFTopics manages Building Collaboration Format (BCF) data the engine. It provides functionality for importing, exporting, and manipulating BCF data.
 */
export class BCFTopics
  extends Component
  implements Disposable, Configurable<BCFTopicsConfigManager, BCFTopicsConfig>
{
  static uuid = "de977976-e4f6-4e4f-a01a-204727839802" as const;
  enabled = false;

  static xmlParser = new XMLParser({
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

  protected _defaultConfig: Required<BCFTopicsConfig> = {
    author: "jhon.doe@example.com",
    version: "2.1",
    types: new Set([
      "Clash",
      "Failure",
      "Fault",
      "Inquiry",
      "Issue",
      "Remark",
      "Request",
    ]),
    statuses: new Set(["Active", "In Progress", "Done", "In Review", "Closed"]),
    priorities: new Set(["On hold", "Minor", "Normal", "Major", "Critical"]),
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

  config = new BCFTopicsConfigManager(
    this,
    this.components,
    "BCF Topics",
    BCFTopics.uuid,
  );

  readonly list = new DataMap<string, Topic>();

  readonly onSetup = new Event();
  isSetup = false;
  setup(config?: Partial<BCFTopicsConfig>) {
    if (this.isSetup) return;

    const fullConfig = { ...this._defaultConfig, ...config };

    this.config.version = fullConfig.version;
    this.config.author = fullConfig.author;
    this.config.types = fullConfig.types;
    this.config.statuses = fullConfig.statuses;
    this.config.priorities = fullConfig.priorities;
    this.config.labels = fullConfig.labels;
    this.config.stages = fullConfig.stages;
    this.config.users = fullConfig.users;
    this.config.includeSelectionTag = fullConfig.includeSelectionTag;
    this.config.updateExtensionsOnImport = fullConfig.updateExtensionsOnImport;
    this.config.strict = fullConfig.strict;
    this.config.includeAllExtensionsOnExport =
      fullConfig.includeAllExtensionsOnExport;

    this.config.fallbackVersionOnImport =
      fullConfig.fallbackVersionOnImport || "";

    this.config.ignoreIncompleteTopicsOnImport =
      fullConfig.ignoreIncompleteTopicsOnImport;

    this.isSetup = true;
    this.enabled = true;
    this.onSetup.trigger();
  }

  readonly onBCFImported = new Event<Topic[]>();

  /**
   * Creates a new BCFTopic instance and adds it to the list.
   *
   * @param data - Optional partial BCFTopic object to initialize the new topic with.
   * If not provided, default values will be used.
   * @returns The newly created BCFTopic instance.
   */
  create(data?: Partial<BCFTopic>) {
    const topic = new Topic(this.components);
    if (data) {
      topic.guid = data.guid ?? topic.guid;
      topic.set(data);
    } else {
      this.list.set(topic.guid, topic);
    }
    return topic;
  }

  readonly onDisposed = new Event();

  /**
   * Disposes of the BCFTopics component and triggers the onDisposed event.
   *
   * @remarks
   * This method clears the list of topics and triggers the onDisposed event.
   * It also resets the onDisposed event listener.
   */
  dispose() {
    this.list.dispose();
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
      for (const [_, comment] of topic.comments) {
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
      for (const [_, comment] of topic.comments) {
        this.config.users.add(comment.author);
        if (comment.modifiedAuthor)
          this.config.users.add(comment.modifiedAuthor);
      }
    }
  }

  /**
   * Updates the references to viewpoints in the topics.
   * This function iterates through each topic and checks if the viewpoints exist in the viewpoints list.
   * If a viewpoint does not exist, it is removed from the topic's viewpoints.
   */
  updateViewpointReferences() {
    const viewpoints = this.components.get(Viewpoints);
    for (const [_, topic] of this.list) {
      for (const viewpointID of topic.viewpoints) {
        const exists = viewpoints.list.has(viewpointID);
        if (!exists) topic.viewpoints.delete(viewpointID);
      }
    }
  }

  /**
   * Exports the given topics to a BCF (Building Collaboration Format) zip file.
   *
   * @param topics - The topics to export. Defaults to all topics in the list.
   * @returns A promise that resolves to a Blob containing the exported BCF zip file.
   */
  async export(topics: Iterable<Topic> = this.list.values()) {
    const zip = new JSZip();
    zip.file(
      "bcf.version",
      `<?xml version="1.0" encoding="UTF-8"?>
    <Version VersionId="${this.config.version}" xsi:noNamespaceSchemaLocation="https://raw.githubusercontent.com/buildingSMART/BCF-XML/release_3_0/Schemas/version.xsd"
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
    </Version>`,
    );
    zip.file("bcf.extensions", this.serializeExtensions());
    const image = await fetch(
      "https://thatopen.github.io/engine_components/resources/favicon.ico",
    );
    const imgBlob = await image.arrayBuffer();
    const viewpoints = this.components.get(Viewpoints);
    for (const topic of topics) {
      const topicFolder = zip.folder(topic.guid) as JSZip;
      topicFolder.file("markup.bcf", topic.serialize());
      for (const viewpointID of topic.viewpoints) {
        const viewpoint = viewpoints.list.get(viewpointID);
        if (!viewpoint) continue;
        topicFolder.file(`${viewpointID}.jpeg`, imgBlob, {
          binary: true,
        });
        topicFolder.file(`${viewpointID}.bcfv`, await viewpoint.serialize());
      }
    }
    const content = await zip.generateAsync({ type: "blob" });
    return content;
  }

  private serializeExtensions() {
    const types = [...this.config.types]
      .map((type) => `<TopicType>${type}</TopicType>`)
      .join("\n");

    const statuses = [...this.config.statuses]
      .map((status) => `<TopicStatus>${status}</TopicStatus>`)
      .join("\n");

    const priorities = [...this.config.priorities]
      .map((priority) => `<Priority>${priority}</Priority>`)
      .join("\n");

    const labels = [...this.config.labels]
      .map((label) => `<TopicLabel>${label}</TopicLabel>`)
      .join("\n");

    const stages = [...this.config.stages]
      .map((stage) => `<Stage>${stage}</Stage>`)
      .join("\n");

    const users = [...this.config.users]
      .map((user) => `<User>${user}</User>`)
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

  private processMarkupComment(markupComment: any) {
    const {
      Guid,
      Date: CommentDate,
      Author,
      Comment: CommentText,
      Viewpoint,
    } = markupComment;
    if (!(Guid && CommentDate && Author && (Comment || Viewpoint))) return null;
    const viewpoints = this.components.get(Viewpoints);
    const comment = new Comment(this.components, CommentText ?? "") as Comment;
    comment.guid = Guid;
    comment.date = new Date(CommentDate);
    comment.author = Author;
    comment.viewpoint = Viewpoint?.Guid
      ? viewpoints.list.get(Viewpoint.Guid)
      : undefined;
    comment.modifiedAuthor = markupComment.ModifiedAuthor;
    comment.modifiedDate = markupComment.ModifiedDate
      ? new Date(markupComment.ModifiedDate)
      : undefined;
    return comment;
  }

  private getMarkupComments(markup: any, version: BCFVersion) {
    let data: any;
    if (version === "2.1") data = markup.Comment;
    if (version === "3") data = markup.Topic.Comments?.Comment;
    if (!data) return [];
    data = Array.isArray(data) ? data : [data];
    const comments = data
      .map((comment: any) => this.processMarkupComment(comment))
      .filter((comment: any) => comment) as Comment[];
    const array = Array.isArray(comments) ? comments : [comments];
    return array;
  }

  private getMarkupLabels(markup: any, version: BCFVersion) {
    let data: any;
    if (version === "2.1") data = markup.Topic.Labels;
    if (version === "3") data = markup.Topic.Labels?.Label;
    if (!data) return [];
    const labels: string[] = Array.isArray(data) ? data : [data];
    return labels;
  }

  private getMarkupViewpoints(markup: any, version: BCFVersion) {
    let data: any;
    if (version === "2.1") data = markup.Viewpoints;
    if (version === "3") data = markup.Topic.Viewpoints?.ViewPoint;
    if (!data) return [];
    data = Array.isArray(data) ? data : [data];
    return data;
  }

  private getMarkupRelatedTopics(markup: any, version: BCFVersion) {
    let data: any;
    if (version === "2.1") data = markup.Topic.RelatedTopic;
    if (version === "3") data = markup.Topic.RelatedTopics?.RelatedTopic;
    if (!data) return [];
    const topics: { Guid: string }[] = Array.isArray(data) ? data : [data];
    return topics.map((topic) => topic.Guid);
  }

  /**
   * Loads BCF (Building Collaboration Format) data into the engine.
   *
   * @param world - The default world where the viewpoints are going to be created.
   * @param data - The BCF data to load.
   *
   * @returns A promise that resolves to an object containing the created viewpoints and topics.
   *
   * @throws An error if the BCF version is not supported.
   */
  async load(data: Uint8Array, world: World) {
    const {
      fallbackVersionOnImport,
      ignoreIncompleteTopicsOnImport,
      updateExtensionsOnImport,
    } = this.config;
    const zip = new JSZip();
    await zip.loadAsync(data);

    const files = Object.values(zip.files);

    // Get BCF Version from incomming data
    let version = fallbackVersionOnImport;
    const versionFile = files.find((file) => file.name.endsWith(".version"));
    if (versionFile) {
      const versionXML = await versionFile.async("string");
      const bcfVersion =
        BCFTopics.xmlParser.parse(versionXML).Version.VersionId;
      version = String(bcfVersion) as BCFVersion;
    }

    if (!(version && (version === "2.1" || version === "3"))) {
      throw new Error(`BCFTopics: ${version} is not supported.`);
    }

    // Get BCF Extensions file
    const extensionsFile = files.find((file) =>
      file.name.endsWith(".extensions"),
    );

    if (updateExtensionsOnImport && extensionsFile) {
      const extensionsXML = await extensionsFile.async("string");
      extensionsImporter(this, extensionsXML);
    }

    // Viewpoints must be processed first as they don't care about the topic, but the topic and comments care about them
    const createdViewpoints: Viewpoint[] = [];
    const viewpoints = this.components.get(Viewpoints);
    const viewpointFiles = files.filter((file) => file.name.endsWith(".bcfv"));
    for (const viewpointFile of viewpointFiles) {
      const xml = await viewpointFile.async("string");
      const visualizationInfo =
        BCFTopics.xmlParser.parse(xml).VisualizationInfo;
      if (!visualizationInfo) {
        console.warn("Missing VisualizationInfo in Viewpoint");
        continue;
      }

      const bcfViewpoint: Partial<BCFViewpoint> = {};

      const {
        Guid,
        ClippingPlanes,
        Components,
        OrthogonalCamera,
        PerspectiveCamera,
      } = visualizationInfo;

      if (Guid) bcfViewpoint.guid = Guid;

      if (Components) {
        const { Selection, Visibility } = Components;
        if (Selection && Selection.Component) {
          const components = Array.isArray(Selection.Component)
            ? Selection.Component
            : [Selection.Component];
          bcfViewpoint.selectionComponents = components
            .map((component: any) => component.IfcGuid)
            .filter((guid: any) => guid);
        }
        if (Visibility && "DefaultVisibility" in Visibility) {
          bcfViewpoint.defaultVisibility = Visibility.DefaultVisibility;
        }
        if (
          Visibility &&
          Visibility.Exceptions &&
          "Component" in Visibility.Exceptions
        ) {
          const { Component } = Visibility.Exceptions;
          const components = Array.isArray(Component) ? Component : [Component];
          bcfViewpoint.exceptionComponents = components
            .map((component: any) => component.IfcGuid)
            .filter((guid: any) => guid);
        }
        let ViewSetupHints;
        if (version === "2.1") {
          ViewSetupHints = Components.ViewSetupHints;
        }
        if (version === "3") {
          ViewSetupHints = Components.Visibility?.ViewSetupHints;
        }
        if (ViewSetupHints) {
          if ("OpeningsVisible" in ViewSetupHints) {
            bcfViewpoint.openingsVisible = ViewSetupHints.OpeningsVisible;
          }
          if ("SpacesVisible" in ViewSetupHints) {
            bcfViewpoint.spacesVisible = ViewSetupHints.SpacesVisible;
          }
          if ("SpaceBoundariesVisible" in ViewSetupHints) {
            bcfViewpoint.spaceBoundariesVisible =
              ViewSetupHints.SpaceBoundariesVisible;
          }
        }
      }

      if (OrthogonalCamera || PerspectiveCamera) {
        const camera =
          visualizationInfo.PerspectiveCamera ??
          visualizationInfo.OrthogonalCamera;
        const { CameraViewPoint, CameraDirection } = camera;

        const position = new THREE.Vector3(
          Number(CameraViewPoint.X),
          Number(CameraViewPoint.Z),
          Number(-CameraViewPoint.Y),
        );

        const direction = new THREE.Vector3(
          Number(CameraDirection.X),
          Number(CameraDirection.Z),
          Number(-CameraDirection.Y),
        );

        const viewpointCamera: ViewpointCamera = {
          position: { x: position.x, y: position.y, z: position.z },
          direction: { x: direction.x, y: direction.y, z: direction.z },
          aspectRatio: "AspectRatio" in camera ? camera.AspectRatio : 1, // Temporal simplification
        };

        if ("ViewToWorldScale" in camera) {
          bcfViewpoint.camera = {
            ...viewpointCamera,
            viewToWorldScale: camera.ViewToWorldScale,
          };
        }

        if ("FieldOfView" in camera) {
          bcfViewpoint.camera = {
            ...viewpointCamera,
            fov: camera.FieldOfView,
          };
        }
      }

      const viewpoint = new Viewpoint(this.components, world, {
        data: bcfViewpoint,
        setCamera: false,
      });

      if (Components) {
        const { Coloring } = Components;
        if (Coloring && Coloring.Color) {
          const colors = Array.isArray(Coloring.Color)
            ? Coloring.Color
            : [Coloring.Color];
          for (const colorData of colors) {
            const { Color, Component } = colorData;
            const components = Array.isArray(Component)
              ? Component
              : [Component];
            const guids = components.map((component) => component.IfcGuid);
            viewpoint.componentColors.set(Color, guids);
          }
        }
      }

      createdViewpoints.push(viewpoint);

      if (ClippingPlanes) {
        const clipper = this.components.get(Clipper);
        const planes = Array.isArray(ClippingPlanes.ClippingPlane)
          ? ClippingPlanes.ClippingPlane
          : [ClippingPlanes.ClippingPlane];
        for (const plane of planes) {
          const { Location, Direction } = plane;
          if (!(Location && Direction)) continue;
          const location = new THREE.Vector3(
            Location.X,
            Location.Z,
            -Location.Y,
          );
          const direction = new THREE.Vector3(
            Direction.X,
            -Direction.Z,
            Direction.Y,
          );
          const clippingPlane = clipper.createFromNormalAndCoplanarPoint(
            world,
            direction,
            location,
          );
          clippingPlane.visible = false;
          clippingPlane.enabled = false;
          viewpoint.clippingPlanes.add(clippingPlane);
        }
      }
    }

    // Process markup files
    const topicRelations: { [guid: string]: Set<string> } = {};
    const topics: Topic[] = [];
    const markupFiles = files.filter((file) => file.name.endsWith(".bcf"));
    for (const markupFile of markupFiles) {
      const xml = await markupFile.async("string");
      const markup = BCFTopics.xmlParser.parse(xml).Markup;
      const markupTopic = markup.Topic;
      const {
        Guid,
        TopicType,
        TopicStatus,
        Title,
        CreationDate,
        CreationAuthor,
      } = markupTopic;

      // Required Data
      if (ignoreIncompleteTopicsOnImport) {
        if (
          !(
            Guid &&
            TopicType &&
            TopicStatus &&
            Title &&
            CreationDate &&
            CreationAuthor
          )
        )
          continue;
      }

      const topic = new Topic(this.components);
      topic.guid = Guid ?? topic.guid;
      const relatedTopics = this.getMarkupRelatedTopics(markup, version);
      topicRelations[topic.guid] = new Set(relatedTopics);
      topic.type = TopicType ?? topic.type;
      topic.status = TopicStatus ?? topic.status;
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
      const labels = this.getMarkupLabels(markup, version);
      for (const label of labels) topic.labels.add(label);

      // Comments
      const comments = this.getMarkupComments(markup, version);
      for (const comment of comments) topic.comments.set(comment.guid, comment);

      // Viewpoints
      const markupViewpoints = this.getMarkupViewpoints(markup, version);
      for (const markupViewpoint of markupViewpoints) {
        if (!(markupViewpoint && markupViewpoint.Guid)) continue;
        const viewpoint = viewpoints.list.get(markupViewpoint.Guid);
        if (viewpoint) topic.viewpoints.add(viewpoint.guid);
      }

      this.list.set(topic.guid, topic);
      topics.push(topic);
    }

    for (const topicID in topicRelations) {
      const topic = this.list.get(topicID);
      if (!topic) continue;
      const relations = topicRelations[topicID];
      for (const guid of relations) {
        topic.relatedTopics.add(guid);
      }
    }

    this.onBCFImported.trigger(topics);
    return { viewpoints: createdViewpoints, topics };
  }
}

export * from "./src";
