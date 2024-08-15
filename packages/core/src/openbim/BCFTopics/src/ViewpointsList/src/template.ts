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
          <bim-button @click=${() => viewpoint.go()} icon="ph:eye-fill"></bim-button> 
          <bim-button @click=${() => console.log(viewpoint.selection)} icon="ph:cursor-fill"></bim-button> 
          <bim-button @click=${() => viewpoint.updateCamera()} icon="jam:refresh"></bim-button> 
          <bim-button @click=${() => viewpoints.list.delete(viewpoint.guid)} icon="tabler:trash-filled"></bim-button>
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
