// eslint-disable-next-line import/no-extraneous-dependencies
import * as BUI from "@thatopen/ui";
// eslint-disable-next-line import/no-extraneous-dependencies
import { Components, Viewpoint, Viewpoints } from "../../../../../core";
import { Topic } from "../../Topic";

interface ViewpointUIActions {
  selectComponents: boolean;
  colorizeComponent: boolean;
  resetColors: boolean;
  updateCamera: boolean;
  delete: boolean;
  unlink: boolean;
}

export interface ViewpointsUI {
  components: Components;
  topic?: Topic;
  actions?: Partial<ViewpointUIActions>;
  onViewpointEnter?: (viewpoint: Viewpoint) => void | Promise<void>;
}

export const viewpointsListTemplate = (state: ViewpointsUI) => {
  const { components, topic, actions: _actions } = state;
  const actions: ViewpointUIActions = {
    selectComponents: true,
    colorizeComponent: true,
    resetColors: true,
    updateCamera: true,
    delete: true,
    unlink: !!topic,
    ..._actions,
  };
  const manager = components.get(Viewpoints);
  const viewpointIDs = state.topic?.viewpoints ?? manager.list.keys();
  const viewpoints: Viewpoint[] = [];
  for (const viewpointID of viewpointIDs) {
    const viewpoint = manager.list.get(viewpointID);
    if (viewpoint) viewpoints.push(viewpoint);
  }
  const onTableCreated = (e?: Element) => {
    if (!e) return;
    const table = e as BUI.Table;
    table.addEventListener("cellcreated", ({ detail }) => {
      const { cell } = detail;
      cell.style.padding = "0.25rem";
    });
    table.headersHidden = true;
    table.hiddenColumns = ["Guid"];
    table.columns = ["Title", { name: "Actions", width: "auto" }];
    table.dataTransform = {
      Actions: (_, rowData) => {
        const { Guid } = rowData;
        if (!(Guid && typeof Guid === "string")) return Guid;
        const viewpoints = components.get(Viewpoints);
        const viewpoint = viewpoints.list.get(Guid);
        if (!viewpoint) return Guid;
        return BUI.html`
          <bim-button icon="ph:eye-fill" @click=${() => viewpoint.go()}></bim-button>
          ${
            Object.values(actions).includes(true)
              ? BUI.html`
                <bim-button icon="prime:ellipsis-v">
                  <bim-context-menu>
                    ${actions.selectComponents ? BUI.html`<bim-button label="Select Components" @click=${() => console.log(viewpoint.selection)}></bim-button> ` : null}
                    ${actions.colorizeComponent ? BUI.html`<bim-button label="Colorize Components" @click=${() => viewpoint.colorize()}></bim-button> ` : null}
                    ${actions.resetColors ? BUI.html`<bim-button label="Reset Colors" @click=${() => viewpoint.resetColors()}></bim-button> ` : null}
                    ${actions.updateCamera ? BUI.html`<bim-button label="Update Camera" @click=${() => viewpoint.updateCamera()}></bim-button> ` : null}
                    ${actions.unlink ? BUI.html`<bim-button .disabled=${!topic} label="Unlink" @click=${() => topic?.viewpoints.delete(viewpoint.guid)}></bim-button> ` : null}
                    ${actions.delete ? BUI.html`<bim-button label="Delete" @click=${() => viewpoints.list.delete(viewpoint.guid)}></bim-button>` : null}
                  </bim-context-menu>
                </bim-button>
              `
              : null
          }
        `;
      },
    };

    table.data = viewpoints.map((viewpoint, index) => {
      return {
        data: {
          Guid: viewpoint.guid,
          Title: viewpoint.title ?? `Viewpoint ${state.topic ? index + 1 : ""}`,
          Actions: "",
        },
      };
    });
  };

  return BUI.html`
    <bim-table ${BUI.ref(onTableCreated)}>
      <bim-label slot="missing-data" icon="ph:warning-fill" style="--bim-icon--c: gold;">No viewpoints to show</bim-label>
    </bim-table>
  `;
};
