// eslint-disable-next-line import/no-extraneous-dependencies
import * as BUI from "@thatopen/ui";
import { Topic } from "../../Topic";
import { Viewpoint } from "../../../../../core";
import { Comment } from "../../Comment";

interface UserStyles {
  [email: string]: { name: string; picture?: string };
}

interface TopicCommentsActions {
  delete: boolean;
}

export interface TopicCommentsUI {
  topic: Topic;
  viewpoint?: Viewpoint;
  styles?: UserStyles;
  actions?: Partial<TopicCommentsActions>;
}

const defaultStyles: UserStyles = {
  "jhon.doe@example.com": {
    name: "Jhon Doe",
    picture:
      "https://www.profilebakery.com/wp-content/uploads/2023/04/Profile-Image-AI.jpg",
  },
};

const createAuthorTag = (value: string, styles?: UserStyles) => {
  const userStyles = styles ?? defaultStyles;
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

export const topicCommentsTemplate = (state: TopicCommentsUI) => {
  const { topic, styles, viewpoint, actions: _actions } = state;

  const actions: TopicCommentsActions = { delete: true, ..._actions };

  const onTableCreated = (e?: Element) => {
    if (!e) return;
    const table = e as BUI.Table;
    table.headersHidden = true;
    table.hiddenColumns = ["guid", "author"];
    table.dataTransform = {
      Comment: (value, rowData) => {
        const { guid } = rowData;
        if (typeof guid !== "string") return value;
        const comment = topic.comments.get(guid);
        if (!comment) return value;
        const onDeleteClick = () => {
          topic.comments.delete(guid);
        };

        return BUI.html`
        <div style="display: flex; flex-direction: column; gap: 0.25rem; flex: 1">
          <div style="display: flex; justify-content: space-between;">
            <div style="display: flex; gap: 0.375rem;">
              ${createAuthorTag(comment.author, styles)}
              <bim-label style="color: var(--bim-ui_bg-contrast-40)">@ ${comment.date.toDateString()}</bim-label>
            </div>
            <div>
              <style>
                #TCDBT {
                  background-color: transparent;
                  --bim-label--c: var(--bim-ui_bg-contrast-60)
                }

                #TCDBT:hover {
                  --bim-label--c: #FF5252;
                }
              </style>
              ${actions?.delete ? BUI.html`<bim-button @click=${onDeleteClick} id="TCDBT" icon="majesticons:delete-bin"></bim-button>` : null}
            </div>
          </div>
          <bim-label style="margin-left: 1.7rem; white-space: normal">${comment.comment}</bim-label>
        </div>
      `;
      },
    };

    let comments: Iterable<Comment> = topic.comments.values();
    if (viewpoint) {
      comments = [...topic.comments.values()].filter(
        (comment) => comment.viewpoint === viewpoint,
      );
    }

    table.data = [...comments].map((comment) => {
      return {
        data: {
          guid: comment.guid,
          Comment: comment.comment,
          author: (() => {
            const userStyles = styles;
            if (!userStyles) return comment.author;
            const authorData = userStyles[comment.author];
            return authorData?.name ?? comment.author;
          })(),
        },
      };
    });
  };

  return BUI.html`<bim-table @cellcreated=${({ detail }: any) => {
    const { cell } = detail;
    cell.style.marginLeft = "0";
  }} ${BUI.ref(onTableCreated)}><bim-label slot="missing-data" icon="ph:warning-fill" style="--bim-icon--c: gold;">This topic has no comments</bim-label></bim-table>`;
};
