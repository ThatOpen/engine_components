import JSZip from "jszip";
import { Component, Configurable, Disposable, Event } from "../../core/Types";
import { BCFManagerConfig, Topic } from "./src";

export class BCFManager
  extends Component
  implements Disposable, Configurable<BCFManagerConfig>
{
  static uuid = "de977976-e4f6-4e4f-a01a-204727839802" as const;
  enabled = false;

  config: Required<BCFManagerConfig> = {
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
    includeMissingExtensionsOnExport: true,
  };

  readonly list = new Set<Topic>();

  readonly onSetup = new Event();
  isSetup = false;
  setup(config?: Partial<BCFManagerConfig>) {
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
    this.list.add(topic);
    this.onTopicCreated.trigger(topic);
    return topic;
  }

  deleteTopic(topic: Topic) {
    const { guid } = topic;
    const deleted = this.list.delete(topic);
    this.onTopicDeleted.trigger(guid);
    return deleted;
  }

  readonly onDisposed = new Event();
  dispose() {
    (this.list as any) = [];
    this.onDisposed.trigger();
    this.onDisposed.reset();
  }

  serializeExtensions() {
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
    for (const topic of topics) {
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
}

export * from "./src";
