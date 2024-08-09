// eslint-disable-next-line import/no-extraneous-dependencies
import * as BUI from "@thatopen/ui";
import { Components } from "../../../../../core";
import { Topic } from "../../Topic";
import { BCFTopics } from "../../..";

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

export interface BCFTopicsUI {
  components: Components;
  topics?: Iterable<Topic>;
  styles?: Partial<DataStyles>;
}

let table: BUI.Table;

const defaultStyles: Required<DataStyles> = {
  users: {
    "jhon.doe@example.com": { name: "Jhon Doe" },
  },
  priorities: {
    "On hold": {},
    Minor: {},
    Normal: {
      icon: "ph:arrow-up-bold",
      style: {
        backgroundColor: "var(--bim-ui_bg-contrast-20)",
        "--bim-icon--c": "#FF5252",
      },
    },
    Major: {},
    Critical: {},
  },
  statuses: {
    Active: {
      style: {
        backgroundColor: "#117a1187",
        "--bim-label--c": "#31ec31",
        "--bim-icon--c": "#31ec31",
      },
    },
    Done: {},
    Closed: {},
  },
  types: {
    Clash: {},
    Failure: {},
    Fault: {},
    Inquiry: {},
    Issue: {},
    Remark: {},
    Request: {},
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

export const bcfTopicsListTemplate = (state: BCFTopicsUI) => {
  const { components, styles } = state;
  const bcfTopics = components.get(BCFTopics);
  const topics = state.topics ?? bcfTopics.list.values();
  if (!table) {
    table = document.createElement("bim-table");
    table.hiddenColumns = ["Guid"];
    table.columns = ["Title"];
  }
  table.dataTransform = {
    // Title: (value) => {
    //   return BUI.html`
    //   <div style="display: flex; gap: 0.25rem; overflow: hidden;">
    //     <bim-button icon="iconamoon:enter-duotone"></bim-button>
    //     <bim-label>${value}</bim-label>
    //   </div>`;
    // },
    Priority: (value) => {
      if (typeof value !== "string") return value;
      const priorityStyles = styles?.priorities ?? defaultStyles.priorities;
      const labelStyles = priorityStyles[value];
      return BUI.html`
        <bim-label
          .icon=${labelStyles?.icon}
          style=${BUI.styleMap({ ...baseTagStyle, ...labelStyles?.style })}
        >${value}
        </bim-label>
      `;
    },
    Status: (value) => {
      if (typeof value !== "string") return value;
      const statusStyles = styles?.statuses ?? defaultStyles.statuses;
      const labelStyle = statusStyles[value];
      return BUI.html`
        <bim-label
          .icon=${labelStyle?.icon}
          style=${BUI.styleMap({ ...baseTagStyle, ...labelStyle?.style })}
        >${value}
        </bim-label>
      `;
    },
    Type: (value) => {
      if (typeof value !== "string") return value;
      const typesStyles = styles?.statuses ?? defaultStyles.statuses;
      const labelStyles = typesStyles[value];
      return BUI.html`
        <bim-label
          .icon=${labelStyles?.icon}
          style=${BUI.styleMap({ ...baseTagStyle, ...labelStyles?.style })}
        >${value}
        </bim-label>
      `;
    },
    Author: (value) => {
      if (typeof value !== "string") return value;
      return createAuthorTag(value, styles);
    },
    Assignee: (value) => {
      if (typeof value !== "string") return value;
      return createAuthorTag(value, styles);
    },
  };
  table.data = [...topics].map((topic) => {
    return {
      data: {
        Guid: topic.guid,
        Title: topic.title,
        Status: topic.status,
        Description: topic.description ?? "",
        Author: topic.creationAuthor,
        Assignee: topic.assignedTo ?? "",
        Date: topic.creationDate.toDateString(),
        DueDate: topic.dueDate?.toDateString() ?? "",
        Type: topic.type,
        Priority: topic.priority ?? "",
      },
    };
  });
  return BUI.html`${table}`;
};
