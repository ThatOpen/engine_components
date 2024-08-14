/* eslint-disable import/no-extraneous-dependencies */
import * as BUI from "@thatopen/ui";
import { Components, Viewpoints } from "../../../../../core";
import { Topic } from "../../Topic";

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

export interface TopicPanelUI {
  components: Components;
  topic: Topic;
  styles?: Partial<DataStyles>;
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
  const { components, topic, styles } = state;

  const viewpoints = components.get(Viewpoints);

  const priorityStyles = styles?.priorities ?? defaultStyles.priorities;
  const statusStyles = styles?.statuses ?? defaultStyles.statuses;
  const typesStyles = styles?.types ?? defaultStyles.types;

  let priorityStyle;
  if (topic.priority) {
    priorityStyle = priorityStyles[topic.priority];
  }

  const typeStyle = typesStyles[topic.type];
  const statusStyle = statusStyles[topic.status];

  const commentsTable = document.createElement("bim-table");
  commentsTable.headersHidden = true;
  commentsTable.hiddenColumns = ["Author"];
  commentsTable.data = [...topic.comments].map((comment) => {
    return { data: { Comment: comment.comment, Author: comment.author } };
  });
  return BUI.html`
   <bim-panel>
    <bim-panel-section label="Information" icon="ph:info-bold">
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
    </bim-panel-section>
    <bim-panel-section label="Comments" icon="mdi:comments-outline">${commentsTable}</bim-panel-section>
    <bim-panel-section label="Viewpoints" icon="tabler:camera"></bim-panel-section>
   </bim-panel> 
  `;
};
