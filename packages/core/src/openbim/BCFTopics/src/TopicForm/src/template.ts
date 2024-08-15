/* eslint-disable import/no-extraneous-dependencies */
import * as BUI from "@thatopen/ui";
import { createRef } from "lit/directives/ref.js";
import { Topic } from "../../Topic";
import { Components } from "../../../../../core";
import { BCFTopic, BCFTopics } from "../../..";

interface DataStyles {
  users: {
    [email: string]: { name: string; picture?: string };
  };
}

export interface TopicFormUI {
  components: Components;
  topic?: Topic;
  onSubmit?: (topic: Topic) => void | Promise<void>;
  onCancel?: () => void | Promise<void>;
  styles?: Partial<DataStyles>;
}

export const topicFormTemplate = (state: TopicFormUI) => {
  const { components, topic, onCancel, onSubmit: _onSubmit, styles } = state;
  const onSubmit = _onSubmit ?? (() => {});
  const bcfTopics = components.get(BCFTopics);

  const title = topic?.title ?? null;
  const status = topic?.status ?? null;
  const type = topic?.type ?? null;
  const priority = topic?.priority ?? null;
  const assignedTo = topic?.assignedTo ?? null;
  const labels = topic?.labels ?? null;
  const stage = topic?.stage ?? null;
  const description = topic?.description ?? null;
  const dueDate = topic?.dueDate
    ? topic.dueDate.toISOString().split("T")[0]
    : null;

  const statuses = new Set([...bcfTopics.config.statuses]);
  if (status) statuses.add(status);

  const types = new Set([...bcfTopics.config.types]);
  if (type) types.add(type);

  const priorities = new Set([...bcfTopics.config.priorities]);
  if (priority) priorities.add(priority);

  const users = new Set([...bcfTopics.config.users]);
  if (assignedTo) users.add(assignedTo);

  const labelsList = new Set([...bcfTopics.config.labels]);
  if (labels) {
    for (const label of labels) labelsList.add(label);
  }

  const stages = new Set([...bcfTopics.config.stages]);
  if (stage) stages.add(stage);

  const topicForm = createRef<BUI.PanelSection>();

  const onAddTopic = async () => {
    const { value: form } = topicForm;
    if (!form) return;
    if (Object.values(form.valueTransform).length === 0) {
      form.valueTransform = {
        dueDate: (value) => {
          if (!(typeof value === "string" && value.trim() !== ""))
            return undefined;
          return new Date(value);
        },
        status: (value) => {
          if (Array.isArray(value) && value.length !== 0) return value[0];
          return undefined;
        },
        type: (value) => {
          if (Array.isArray(value) && value.length !== 0) return value[0];
          return undefined;
        },
        priority: (value) => {
          if (Array.isArray(value) && value.length !== 0) return value[0];
          return undefined;
        },
        assignedTo: (value) => {
          if (Array.isArray(value) && value.length !== 0) return value[0];
          return undefined;
        },
      };
    }

    const topicData = form.value as Partial<BCFTopic>;
    if (topic) {
      topic.set(topicData);
      await onSubmit(topic);
    } else {
      const newTopic = bcfTopics.create(topicData);
      await onSubmit(newTopic);
    }
  };

  return BUI.html`
    <bim-panel style="border-radius: var(--bim-ui_size-base); outline: 2px solid var(--bim-ui_bg-contrast-20); width: 22rem;">
      <bim-panel-section ${BUI.ref(topicForm)} fixed label="New Topic" name="topic">
        <div style="display: flex; gap: 0.375rem">
          <bim-text-input vertical label="Title" name="title" .value=${title}></bim-text-input>
          ${
            topic
              ? BUI.html`
              <bim-dropdown vertical label="Status" name="status" required>
                ${[...statuses].map((s) => BUI.html`<bim-option label=${s} .checked=${status === s}></bim-option>`)}
              </bim-dropdown>`
              : BUI.html``
          }
        </div>
        <div style="display: flex; gap: 0.375rem">
          <bim-dropdown vertical label="Type" name="type" required>
            ${[...types].map((t) => BUI.html`<bim-option label=${t} .checked=${type === t}></bim-option>`)}
          </bim-dropdown>
          <bim-dropdown vertical label="Priority" name="priority">
            ${[...priorities].map((p) => BUI.html`<bim-option label=${p} .checked=${priority === p}></bim-option>`)}
          </bim-dropdown>
        </div>
        <div style="display: flex; gap: 0.375rem">
          <bim-dropdown vertical label="Labels" name="labels" multiple>
            ${[...labelsList].map((l) => BUI.html`<bim-option label=${l} .checked=${labels?.has(l)}></bim-option>`)}
          </bim-dropdown>
          <bim-dropdown vertical label="Assignee" name="assignedTo">
            ${[...users].map((u) => {
              const userStyle = styles?.users ? styles.users[u] : null;
              const name = userStyle ? userStyle.name : u;
              const img = userStyle?.picture;
              return BUI.html`<bim-option label=${name} value=${u} .img=${img} .checked=${assignedTo === u}></bim-option>`;
            })}
          </bim-dropdown>
        </div>
        <div style="display: flex; gap: 0.375rem">
          <bim-text-input vertical type="date" label="Due Date" name="dueDate" .value=${dueDate}></bim-text-input> 
          <bim-dropdown vertical label="Stage" name="stage">
            ${[...stages].map((s) => BUI.html`<bim-option label=${s} .checked=${stage === s}></bim-option>`)}
          </bim-dropdown>
        </div>
        <bim-text-input vertical label="Description" name="description" type="area" .value=${description ?? null}></bim-text-input>
        <div style="justify-content: right; display: flex; gap: 0.375rem">
          <style>
            #A7T9K {
              background-color: transparent;
            }

            #A7T9K:hover {
              --bim-label--c: #FF5252;
            }

            #W3F2J:hover {
              background-color: #329936;
            }
          </style>
          <bim-button @click=${onCancel} style="flex: 0" id="A7T9K" label="Cancel"></bim-button>
          <bim-button @click=${onAddTopic} style="flex: 0" id="W3F2J" label=${topic ? "Update Topic" : "Add Topic"} icon=${topic ? "tabler:refresh" : "mi:add"}></bim-button>
        </div>
      </bim-panel-section>
    </bim-panel>
  `;
};
