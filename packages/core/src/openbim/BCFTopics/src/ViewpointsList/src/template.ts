// eslint-disable-next-line import/no-extraneous-dependencies
import * as BUI from "@thatopen/ui";
import { Components, Viewpoint, Viewpoints } from "../../../../../core";
import { Topic } from "../../Topic";

export interface ViewpointsUI {
  components: Components;
  topic?: Topic;
  onViewpointEnter?: (viewpoint: Viewpoint) => void | Promise<void>;
}

export const viewpointsListTemplate = (state: ViewpointsUI) => {
  const { components } = state;
  const manager = components.get(Viewpoints);
  const viewpoints = state.topic?.viewpoints ?? manager.list.values();
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
          <bim-button icon="prime:ellipsis-v">
            <bim-context-menu>
              <bim-button label="Select Components" @click=${() => console.log(viewpoint.selection)}></bim-button> 
              <bim-button label="Update Camera" @click=${() => viewpoint.updateCamera()}></bim-button> 
              <bim-button label="Delete" @click=${() => viewpoints.list.delete(viewpoint.guid)}></bim-button>
            </bim-context-menu>
          </bim-button>
        `;
      },
    };

    table.data = [...viewpoints].map((viewpoint, index) => {
      return {
        data: {
          Guid: viewpoint.guid,
          Title: viewpoint.title ?? `Viewpoint ${index}`,
          Actions: "",
        },
      };
    });
  };

  return BUI.html`
    <bim-table ${BUI.ref(onTableCreated)}>
      <bim-label slot="missing-data">No viewpoints to show!</bim-label>
    </bim-table>
  `;
};
