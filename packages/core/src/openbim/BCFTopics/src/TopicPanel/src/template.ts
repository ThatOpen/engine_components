/* eslint-disable import/no-extraneous-dependencies */
import * as BUI from "@thatopen/ui";
import { Components, Viewpoints, World } from "../../../../../core";
import { Topic } from "../../Topic";
import { viewpointsList } from "../../ViewpointsList";
import { topicComments } from "../../TopicComments";
import { bcfTopicsList } from "../../TopicsList";
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

interface NewCommentUI {
  components?: Components;
  topic?: Topic;
}

const [newCommentPopup, updateCommentPopup] = BUI.Component.create<
  HTMLDialogElement,
  NewCommentUI
>((state: NewCommentUI) => {
  const { topic } = state;
  const input = document.createElement("bim-text-input");
  input.type = "area";

  const removeDialog = () => {
    input.value = "";
    newCommentPopup.close();
    newCommentPopup.remove();
  };

  const onAddComment = () => {
    const comment = input.value;
    if (!topic || comment.trim() === "") return;
    topic.createComment(comment);
    removeDialog();
  };

  return BUI.html`
     <dialog>
      ${
        topic
          ? BUI.html`
            <bim-panel style="border-radius: var(--bim-ui_size-base); outline: 2px solid var(--bim-ui_bg-contrast-20); width: 20rem;">
              <bim-panel-section label="New Comment" fixed>
                ${input}
                <div style="justify-content: right; display: flex; gap: 0.375rem">
                  <style>
                    #PAISD {
                      background-color: transparent;
                    }

                    #PAISD:hover {
                      --bim-label--c: #FF5252;
                    }

                    #MDOG9:hover {
                      background-color: #329936;
                    }
                  </style>
                  <bim-button @click=${removeDialog} style="flex: 0" id="PAISD" label="Cancel"></bim-button>
                  <bim-button @click=${onAddComment} style="flex: 0" id="MDOG9" label="Add Comment"} icon="mi:add"}></bim-button>
                </div>
              </bim-panel-section>
            </bim-panel> 
          `
          : BUI.html`<bim-label>No topic refereced</bim-label>`
      }
     </dialog> 
    `;
}, {});

const [linkViewpointPopup, updateLinkViewpoint] = BUI.Component.create<
  HTMLDialogElement,
  NewCommentUI
>((state: NewCommentUI) => {
  const { components, topic } = state;

  let viewpoints: BUI.Table | undefined;
  if (components) {
    viewpoints = viewpointsList({
      components,
      actions: {
        delete: false,
        updateCamera: false,
        colorizeComponent: false,
        resetColors: false,
        selectComponents: false,
      },
    })[0];
    viewpoints.selectableRows = true;
  }

  const removeDialog = () => {
    linkViewpointPopup.close();
    linkViewpointPopup.remove();
    viewpoints?.remove();
  };

  const onLinkTopics = () => {
    if (!(viewpoints && topic)) return;
    const selection = viewpoints.selection;
    for (const entry of selection) {
      const { Guid } = entry;
      if (typeof Guid !== "string") continue;
      topic.viewpoints.add(Guid);
    }
    removeDialog();
  };

  return BUI.html`
     <dialog>
      ${
        topic
          ? BUI.html`
            <bim-panel style="border-radius: var(--bim-ui_size-base); outline: 2px solid var(--bim-ui_bg-contrast-20); width: 20rem;">
              <bim-panel-section label="Link Viewpoints" fixed>
                ${viewpoints}
                <div style="justify-content: right; display: flex; gap: 0.375rem">
                  <style>
                    #PAISD {
                      background-color: transparent;
                    }

                    #PAISD:hover {
                      --bim-label--c: #FF5252;
                    }

                    #MDOG9:hover {
                      background-color: #329936;
                    }
                  </style>
                  <bim-button @click=${removeDialog} style="flex: 0" id="PAISD" label="Cancel"></bim-button>
                  <bim-button @click=${onLinkTopics} style="flex: 0" id="MDOG9" label="Link Viewpoints"} icon="mi:add"}></bim-button>
                </div>
              </bim-panel-section>
            </bim-panel> 
          `
          : BUI.html`<bim-label>No topic refereced</bim-label>`
      }
     </dialog> 
    `;
}, {});

const [linkTopicPopup, updateLinkTopic] = BUI.Component.create<
  HTMLDialogElement,
  NewCommentUI
>((state: NewCommentUI) => {
  const { components, topic } = state;

  let topics: BUI.Table | undefined;
  if (components) {
    const bcfTopics = components.get(BCFTopics);
    const topicsList = [...bcfTopics.list.values()].filter((t) => t !== topic);
    topics = bcfTopicsList({
      components,
      topics: topicsList,
    })[0];
    topics.selectableRows = true;
    topics.hiddenColumns = ["Guid", "Author", "Assignee", "Date", "DueDate"];
  }

  const removeDialog = () => {
    linkTopicPopup.close();
    linkTopicPopup.remove();
    topics?.remove();
  };

  const onLinkTopics = () => {
    if (!(topics && topic)) return;
    const selection = topics.selection;
    for (const entry of selection) {
      const { Guid } = entry;
      if (typeof Guid !== "string") continue;
      topic.relatedTopics.add(Guid);
    }
    removeDialog();
  };

  return BUI.html`
     <dialog>
        <bim-panel style="border-radius: var(--bim-ui_size-base); outline: 2px solid var(--bim-ui_bg-contrast-20); width: 50rem;">
          <bim-panel-section label="Link Viewpoints" fixed>
            ${topics}
            <div style="justify-content: right; display: flex; gap: 0.375rem">
              <style>
                #PAISD {
                  background-color: transparent;
                }

                #PAISD:hover {
                  --bim-label--c: #FF5252;
                }

                #MDOG9:hover {
                  background-color: #329936;
                }
              </style>
              <bim-button @click=${removeDialog} style="flex: 0" id="PAISD" label="Cancel"></bim-button>
              <bim-button @click=${onLinkTopics} style="flex: 0" id="MDOG9" label="Link Topics"} icon="mi:add"}></bim-button>
            </div>
          </bim-panel-section>
        </bim-panel> 
     </dialog> 
    `;
}, {});

export const topicPanelTemplate = (state: TopicPanelUI) => {
  const {
    components,
    topic,
    styles,
    onUpdateInformation,
    actions: _actions,
    world,
  } = state;

  // const bcfTopics = components.get(BCFTopics);

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
  let relatedTopicsList;
  if (topic) {
    topicCommentsList = topicComments({
      topic,
      styles: styles?.users,
    })[0];
    viewpoints = viewpointsList({
      components,
      topic,
    })[0];
    // const relatedTopics = [...bcfTopics.list.values()].filter((t) =>
    //   topic.relatedTopics.has(t.guid),
    // );
    // const [topicsList, updateTopicsList] = bcfTopicsList({
    //   components,
    //   topics: relatedTopics,
    // });
    // topic.relatedTopics.onItemAdded.add(() => updateTopicsList());
    // topic.relatedTopics.onItemDeleted.add(() => updateTopicsList());
    // topic.relatedTopics.onCleared.add(() => updateTopicsList());
    // relatedTopicsList = topicsList;
    // relatedTopicsList.selectableRows = false;
    // relatedTopicsList.headersHidden = true;
    // relatedTopicsList.hiddenColumns = [
    //   "Guid",
    //   "Status",
    //   "Description",
    //   "Author",
    //   "Assignee",
    //   "Date",
    //   "DueDate",
    //   "Type",
    //   "Priority",
    // ];
  }

  const onAddViewpoint = () => {
    if (!(topic && world)) return;
    const viewpoints = components.get(Viewpoints);
    const viewpoint = viewpoints.create(world);
    topic.viewpoints.add(viewpoint.guid);
  };

  const onAddComment = () => {
    updateCommentPopup({ topic });
    document.body.append(newCommentPopup);
    newCommentPopup.showModal();
  };

  const onLinkViewpoint = () => {
    updateLinkViewpoint({ components, topic });
    document.body.append(linkViewpointPopup);
    linkViewpointPopup.showModal();
  };

  const onLinkTopic = () => {
    updateLinkTopic({ components, topic });
    document.body.append(linkTopicPopup);
    linkTopicPopup.showModal();
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
            <bim-button @click=${onAddComment} label="Add Comment" icon="majesticons:comment-line"></bim-button>
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
            ${actions.linkViewpoints ? BUI.html`<bim-button @click=${onLinkViewpoint} label="Link Viewpoint" icon="tabler:camera"></bim-button>` : null}
          </div>
          `
          : null
      }
    </bim-panel-section>
    <!-- <bim-panel-section label="Related Topics" icon="material-symbols:topic-outline">
      ${relatedTopicsList}
      ${
        actions.linkViewpoints
          ? BUI.html`
            <bim-button @click=${onLinkTopic} label="Link Topic" icon="material-symbols:topic-outline"></bim-button> 
          `
          : null
      }
    </bim-panel-section> -->
    `
        : BUI.html`<bim-label>No topic selected!</bim-label>`
    }
   </bim-panel> 
  `;
};
