import { Component, Disposable, Event } from "../../core/Types";
import { Topic } from "./src";

export class BCFManager extends Component implements Disposable {
  static uuid = "de977976-e4f6-4e4f-a01a-204727839802" as const;

  static types: Set<string> = new Set();
  static readonly onTypeAdded = new Event<string>();
  static addType(...name: string[]) {
    for (const type of name) {
      BCFManager.types.add(type);
      BCFManager.onTypeAdded.trigger(type);
    }
  }

  static statuses: Set<string> = new Set();
  static readonly onStatusAdded = new Event<string>();
  static addStatus(...name: string[]) {
    for (const status of name) {
      BCFManager.statuses.add(status);
      BCFManager.onStatusAdded.trigger(status);
    }
  }

  static priorities: Set<string> = new Set();
  static readonly onPriorityAdded = new Event<string>();
  static addPriority(...name: string[]) {
    for (const priority of name) {
      BCFManager.priorities.add(priority);
      BCFManager.onPriorityAdded.trigger(priority);
    }
    return BCFManager.priorities;
  }

  static labels: Set<string> = new Set();
  static readonly onLabelAdded = new Event<string>();
  static addLabel(...name: string[]) {
    for (const label of name) {
      BCFManager.labels.add(label);
      BCFManager.onLabelAdded.trigger(label);
    }
  }

  static stages: Set<string> = new Set();
  static readonly onStageAdded = new Event<string>();
  static addStage(...name: string[]) {
    for (const stage of name) {
      BCFManager.stages.add(stage);
      BCFManager.onStageAdded.trigger(stage);
    }
  }

  static users: Set<string> = new Set();
  static readonly onUserAdded = new Event<string>();
  static addUser(...name: string[]) {
    for (const user of name) {
      BCFManager.users.add(user);
      BCFManager.onUserAdded.trigger(user);
    }
    return BCFManager.users;
  }

  static getXMLExtensions() {
    let types = "";
    for (const type of BCFManager.types) {
      types += `<TopicType>${type}</TopicType>`;
    }
    let statuses = "";
    for (const type of BCFManager.statuses) {
      statuses += `<TopicStatuses>${type}</TopicStatuses>`;
    }
    let priorities = "";
    for (const type of BCFManager.priorities) {
      priorities += `<Priorities>${type}</Priorities>`;
    }
    let labels = "";
    for (const type of BCFManager.labels) {
      labels += `<TopicLabels>${type}</TopicLabels>`;
    }
    let stages = "";
    for (const type of BCFManager.stages) {
      stages += `<Stages>${type}</Stages>`;
    }
    let users = "";
    for (const type of BCFManager.users) {
      users += `<Users>${type}</Users>`;
    }
    return `
      <?xml version="1.0" encoding="UTF-8"?>
      <Extensions xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:noNamespaceSchemaLocation="your-schema-location.xsd">
        <TopicTypes>${types}</TopicTypes>
        <TopicStatuses>${statuses}</TopicStatuses>
        <Priorities>${priorities}</Priorities>
        <TopicLabels>${labels}</TopicLabels>
        <Stages>${stages}</Stages>
        <Users>${users}</Users>
      </Extensions>
    `;
  }

  enabled = true;
  readonly list: Topic[] = [];

  readonly onDisposed = new Event();
  dispose() {
    (this.list as any) = [];
    this.onDisposed.trigger();
    this.onDisposed.reset();
  }
}

export * from "./src";
