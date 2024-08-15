/* eslint-disable import/no-extraneous-dependencies */
import * as BUI from "@thatopen/ui";
import { Components, Viewpoints, World } from "../../../../../core";
import { Topic } from "../../Topic";
import { viewpointsList } from "../../ViewpointsList";
import { topicComments } from "../../TopicComments";

interface DataStyles {
  priorities: {
    [name: string]: { icon?: string; style?: Record<string, string> };
  };
  statuses: {
    [name: string]: { icon?: string; style?: Record<string, string> };
  };
  types: {
    [name: string]: { icon?: string; style?: Record<string, string> };
  };
  users: {
    [email: string]: { name: string; picture?: string };
  };
}

interface TopicPanelActions {
  update: boolean;
  addComments: boolean;
  addViewpoints: boolean;
  linkViewpoints: boolean;
  linkTopics: boolean;
}

export interface TopicPanelUI {
  components: Components;
  topic?: Topic;
  styles?: Partial<DataStyles>;
  onUpdateInformation?: (topic: Topic) => void | Promise<void>;
  actions?: Partial<TopicPanelActions>;
  world?: World;
}

const defaultStyles: Required<DataStyles> = {
  users: {
    "jhon.doe@example.com": { name: "Jhon Doe" },
  },
  priorities: {
    "On hold": {
      icon: "flowbite:circle-pause-outline",
      style: {
        backgroundColor: "var(--bim-ui_bg-contrast-20)",
        "--bim-icon--c": "#767676",
      },
    },
    Minor: {
      icon: "mingcute:arrows-down-fill",
      style: {
        backgroundColor: "var(--bim-ui_bg-contrast-20)",
        "--bim-icon--c": "#4CAF50",
      },
    },
    Normal: {
      icon: "fa6-solid:grip-lines",
      style: {
        backgroundColor: "var(--bim-ui_bg-contrast-20)",
        "--bim-icon--c": "#FB8C00",
      },
    },
    Major: {
      icon: "mingcute:arrows-up-fill",
      style: {
        backgroundColor: "var(--bim-ui_bg-contrast-20)",
        "--bim-icon--c": "#FF5252",
      },
    },
    Critical: {
      icon: "ph:warning",
      style: {
        backgroundColor: "var(--bim-ui_bg-contrast-20)",
        "--bim-icon--c": "#FB8C00",
      },
    },
  },
  statuses: {
    Active: {
      icon: "prime:circle-fill",
      style: {
        backgroundColor: "#2E2E2E",
      },
    },
    "In Progress": {
      icon: "prime:circle-fill",
      style: {
        backgroundColor: "#fa89004d",
        "--bim-label--c": "#FB8C00",
        "--bim-icon--c": "#FB8C00",
      },
    },
    "In Review": {
      icon: "prime:circle-fill",
      style: {
        backgroundColor: "#9c6bff4d",
        "--bim-label--c": "#9D6BFF",
        "--bim-icon--c": "#9D6BFF",
      },
    },
    Done: {
      icon: "prime:circle-fill",
      style: {
        backgroundColor: "#4CAF504D",
        "--bim-label--c": "#4CAF50",
        "--bim-icon--c": "#4CAF50",
      },
    },
    Closed: {
      icon: "prime:circle-fill",
      style: {
        backgroundColor: "#2E2E2E",
        "--bim-label--c": "#727272",
        "--bim-icon--c": "#727272",
      },
    },
  },
  types: {
    Clash: {
      icon: "gg:close-r",
      style: {
        backgroundColor: "var(--bim-ui_bg-contrast-20)",
        "--bim-icon--c": "#FB8C00",
      },
    },
    Issue: {
      icon: "mdi:bug-outline",
      style: {
        backgroundColor: "var(--bim-ui_bg-contrast-20)",
        "--bim-icon--c": "#FF5252",
      },
    },
    Failure: {
      icon: "mdi:bug-outline",
      style: {
        backgroundColor: "var(--bim-ui_bg-contrast-20)",
        "--bim-icon--c": "#FF5252",
      },
    },
    Inquiry: {
      icon: "majesticons:comment-line",
      style: {
        backgroundColor: "var(--bim-ui_bg-contrast-20)",
        "--bim-icon--c": "#FF5252",
      },
    },
    Fault: {
      icon: "ph:warning",
      style: {
        backgroundColor: "var(--bim-ui_bg-contrast-20)",
        "--bim-icon--c": "#FF5252",
      },
    },
    Remark: {
      icon: "ph:note-blank-bold",
      style: {
        backgroundColor: "var(--bim-ui_bg-contrast-20)",
        "--bim-icon--c": "#FB8C00",
      },
    },
    Request: {
      icon: "mynaui:edit-one",
      style: {
        backgroundColor: "var(--bim-ui_bg-contrast-20)",
        "--bim-icon--c": "#9D6BFF",
      },
    },
  },
};

const baseTagStyle = {
  padding: "0.25rem 0.5rem",
  borderRadius: "999px",
  "--bim-label--c": "white",
};

const createAuthorTag = (value: string, styles?: Partial<DataStyles>) => {
  const userStyles = styles?.users ?? defaultStyles.users;
  const labelStyles = userStyles[value];
  const name = labelStyles?.name ?? value;
  const words = name.trim().split(/\s+/);
  let firstLetter;
  let secondLetter;
  if (words[0] && words[0][0]) {
    firstLetter = words[0][0].toUpperCase();
    if (words[0][1]) secondLetter = words[0][1].toUpperCase();
  }
  if (words[1] && words[1][0]) {
    secondLetter = words[1][0].toUpperCase();
  }
  return BUI.html`
  <div style="display: flex; gap: 0.25rem; overflow: hidden;">
    ${
      !labelStyles?.picture && (firstLetter || secondLetter)
        ? BUI.html`
      <bim-label
        style=${BUI.styleMap({
          borderRadius: "999px",
          padding: "0.375rem",
          backgroundColor: "var(--bim-ui_bg-contrast-20)",
          aspectRatio: "1",
          fontSize: "0.7rem",
        })}>${firstLetter}${secondLetter}</bim-label>
      `
        : null
    }
    <bim-label .img=${labelStyles?.picture}>${name}</bim-label>
  </div>
`;
};

export const topicPanelTemplate = (state: TopicPanelUI) => {
  const {
    components,
    topic,
    styles,
    onUpdateInformation,
    actions: _actions,
    world,
  } = state;

  const actions: TopicPanelActions = {
    update: true,
    addComments: true,
    linkViewpoints: true,
    addViewpoints: true,
    linkTopics: true,
    ..._actions,
  };

  const priorityStyles = styles?.priorities ?? defaultStyles.priorities;
  const statusStyles = styles?.statuses ?? defaultStyles.statuses;
  const typesStyles = styles?.types ?? defaultStyles.types;

  let priorityStyle;
  if (topic?.priority) {
    priorityStyle = priorityStyles[topic.priority];
  }

  let typeStyle;
  if (topic?.type) {
    typeStyle = typesStyles[topic.type];
  }

  let statusStyle;
  if (topic?.type) {
    statusStyle = statusStyles[topic.status];
  }

  let topicCommentsList;
  let viewpoints;
  if (topic) {
    topicCommentsList = topicComments({
      topic,
      styles: styles?.users,
    })[0];
    viewpoints = viewpointsList({
      components,
      topic,
    })[0];
  }

  const onAddViewpoint = () => {
    if (!(topic && world)) return;
    const viewpoints = components.get(Viewpoints);
    const viewpoint = viewpoints.create(world);
    topic.viewpoints.add(viewpoint);
  };

  return BUI.html`
   <bim-panel>
    ${
      topic
        ? BUI.html`
      <bim-panel-section label="Information" icon="ph:info-bold" collapsed>
      <div>
        <bim-label>Title</bim-label> 
        <bim-label style="--bim-label--c: var(--bim-ui_bg-contrast-100)">${topic.title}</bim-label> 
      </div>
      <div>
        <bim-label>Description</bim-label> 
        <bim-label style="--bim-label--c: var(--bim-ui_bg-contrast-100)">${topic.description}</bim-label> 
      </div>
      <div style="display: flex; gap: 0.375rem">
        <bim-label>Status</bim-label> 
        <bim-label .icon=${statusStyle?.icon} style=${BUI.styleMap({ ...baseTagStyle, ...statusStyle?.style })}
        >${topic.status}
        </bim-label>
      </div>
      <div style="display: flex; gap: 0.375rem">
        <bim-label>Type</bim-label> 
        <bim-label .icon=${typeStyle?.icon} style=${BUI.styleMap({ ...baseTagStyle, ...typeStyle?.style })}
        >${topic.type}
        </bim-label>
      </div>
      ${
        topic.priority
          ? BUI.html`
            <div style="display: flex; gap: 0.375rem">
              <bim-label>Priority</bim-label> 
              <bim-label .icon=${priorityStyle?.icon} style=${BUI.styleMap({ ...baseTagStyle, ...priorityStyle?.style })}
              >${topic.priority}
              </bim-label>
            </div>`
          : null
      }
      <div style="display: flex; gap: 0.375rem">
        <bim-label>Author</bim-label> 
        ${createAuthorTag(topic.creationAuthor, styles)}
      </div>
      ${
        topic.assignedTo
          ? BUI.html`
          <div style="display: flex; gap: 0.375rem">
            <bim-label>Assignee</bim-label> 
            ${createAuthorTag(topic.assignedTo, styles)}
          </div>`
          : null
      }
      ${
        topic.dueDate
          ? BUI.html`
          <div style="display: flex; gap: 0.375rem">
            <bim-label>Due Date</bim-label> 
            <bim-label style="--bim-label--c: var(--bim-ui_bg-contrast-100)">${topic.dueDate.toDateString()}</bim-label>
          </div>`
          : null
      }
      ${
        topic.modifiedAuthor
          ? BUI.html`
          <div style="display: flex; gap: 0.375rem">
            <bim-label>Modified By</bim-label> 
            ${createAuthorTag(topic.modifiedAuthor, styles)}
          </div>`
          : null
      }
      ${
        topic.modifiedDate
          ? BUI.html`
            <div style="display: flex; gap: 0.375rem">
              <bim-label>Modified Date</bim-label> 
              <bim-label style="--bim-label--c: var(--bim-ui_bg-contrast-100)">${topic.modifiedDate.toDateString()}</bim-label>
            </div>`
          : null
      }
      ${
        topic.labels.size !== 0
          ? BUI.html`
          <div style="display: flex; gap: 0.375rem">
            <bim-label>Labels</bim-label> 
            <bim-label style="--bim-label--c: var(--bim-ui_bg-contrast-100)">${[...topic.labels].join(", ")}</bim-label>
          </div>`
          : null
      }
      ${
        actions.update
          ? BUI.html`
            <bim-button @click=${() => {
              if (onUpdateInformation) onUpdateInformation(topic);
            }} label="Update Information" icon="tabler:refresh"></bim-button> 
          `
          : null
      }
    </bim-panel-section>
    <bim-panel-section label="Comments" icon="majesticons:comment-line">
      ${topicCommentsList}
      ${
        actions.addComments
          ? BUI.html`
            <bim-button label="Add Comment" icon="majesticons:comment-line"></bim-button>
          `
          : null
      }
    </bim-panel-section>
    <bim-panel-section label="Viewpoints" icon="tabler:camera">
      ${viewpoints}
      ${
        actions.linkViewpoints || actions.addViewpoints
          ? BUI.html`
          <div style="display: flex; gap: 0.375rem">
            ${actions.addViewpoints ? BUI.html`<bim-button @click=${onAddViewpoint} .disabled=${!world} label="Add Viewpoint" icon="mi:add"></bim-button> ` : null}
            ${actions.linkViewpoints ? BUI.html`<bim-button label="Link Viewpoint" icon="tabler:camera"></bim-button>` : null}
          </div>
          `
          : null
      }
    </bim-panel-section>
    <bim-panel-section label="Related Topics" icon="material-symbols:topic-outline">
      ${
        actions.linkViewpoints
          ? BUI.html`
            <bim-button label="Link Topic" icon="material-symbols:topic-outline"></bim-button> 
          `
          : null
      }
    </bim-panel-section>
    `
        : BUI.html`<bim-label>No topic selected!</bim-label>`
    }
   </bim-panel> 
  `;
};
