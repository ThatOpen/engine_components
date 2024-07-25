// eslint-disable-next-line import/no-extraneous-dependencies
import * as BUI from "@thatopen/ui";
import * as THREE from "three";
import * as OBC from "../..";

BUI.Manager.init();

const components = new OBC.Components();

const worlds = components.get(OBC.Worlds);
const world = worlds.create();

const sceneComponent = new OBC.SimpleScene(components);
sceneComponent.setup();
world.scene = sceneComponent;

world.scene.three.add(new THREE.AxesHelper(10));

const viewport = document.createElement("bim-viewport");
const rendererComponent = new OBC.SimpleRenderer(components, viewport);
world.renderer = rendererComponent;

const cameraComponent = new OBC.SimpleCamera(components);
world.camera = cameraComponent;

viewport.addEventListener("resize", () => {
  rendererComponent.resize();
  cameraComponent.updateAspect();
});

const viewerGrids = components.get(OBC.Grids);
viewerGrids.create(world);

components.init();

const ifcLoader = components.get(OBC.IfcLoader);
await ifcLoader.setup();

const indexer = components.get(OBC.IfcRelationsIndexer);

const fragments = components.get(OBC.FragmentsManager);
fragments.onFragmentsLoaded.add(async (model) => {
  world.scene.three.add(model);
  if (model.hasProperties) await indexer.process(model);
  for (const fragment of model.items) world.meshes.add(fragment.mesh);
});

const loadModels = async (urls: string[]) => {
  for (const url of urls) {
    const file = await fetch(url);
    const data = await file.arrayBuffer();
    const buffer = new Uint8Array(data);
    await ifcLoader.load(buffer);
  }
};

// await loadModels([
//   "https://thatopen.github.io/engine_components/resources/small.ifc",
// ]);

await loadModels([
  "/resources/NAV-IPI-ET1_E03-ZZZ-M3D-EST.ifc",
  "/resources/NAV-IPI-ET1_E07-ZZZ-M3D-EST.ifc",
]);

const bcfTopics = components.get(OBC.BCFTopics);
bcfTopics.setup({
  types: new Set(["Clash, Inquiry, Information, Coordination"]),
  statuses: new Set([
    "Active",
    "In Progress",
    "Completed",
    "In Review",
    "Closed",
  ]),
  priorities: new Set(["Low", "Normal", "High", "Critical"]),
});

const viewpoints = components.get(OBC.Viewpoints);
viewpoints.list.onItemSet.add(({ value: viewpoint }) => console.log(viewpoint));

// Importing an external BCF (topics and viewpoints are going to be created)
const bcfFile = await fetch("/resources/topics.bcf");
const bcfData = await bcfFile.arrayBuffer();
await bcfTopics.import(world, new Uint8Array(bcfData));

// Creating a custom Topic
const topicsTable = document.createElement("bim-table");
topicsTable.hiddenColumns = ["Guid"];
topicsTable.columns = ["Title"];
topicsTable.dataTransform = {
  Actions: (_, rowData) => {
    const { Guid } = rowData;
    if (!(Guid && typeof Guid === "string")) return Guid;
    const viewpoints = components.get(OBC.Viewpoints);
    const viewpoint = viewpoints.list.get(Guid);
    if (!viewpoint) return Guid;
    return BUI.html`
      <bim-button @click=${() => viewpoint.go()} icon="ph:eye-fill"></bim-button> 
      <bim-button @click=${() => console.log(viewpoint.selection)} icon="ph:cursor-fill"></bim-button> 
      <bim-button @click=${() => viewpoint.update()} icon="jam:refresh"></bim-button> 
      <bim-button @click=${() => viewpoints.list.delete(viewpoint.guid)} icon="tabler:trash-filled"></bim-button>
    `;
  },
};

const [topicsList, updatetopicsList] = BUI.Component.create(
  (state: { components: OBC.Components }) => {
    const { components } = state;
    const topics = components.get(OBC.BCFTopics);
    topicsTable.data = [...topics.list.values()].map((topic) => {
      return {
        data: {
          Guid: topic.guid,
          Title: topic.title,
          Description: topic.description ?? "",
          Author: topic.creationAuthor,
          Date: topic.creationDate.toDateString(),
          Type: topic.type,
          Status: topic.status,
          Priority: topic.priority ?? "",
          Labels: [...topic.labels].join(", "),
        },
      };
    });
    return BUI.html`${topicsTable}`;
  },
  { components },
);

bcfTopics.list.onItemSet.add(() => updatetopicsList());
bcfTopics.list.onCleared.add(() => updatetopicsList());
bcfTopics.list.onItemDeleted.add(() => updatetopicsList());

const topic = bcfTopics.create({
  description: "It seems these elements are badly defined.",
  type: "Information",
  priority: "High",
  stage: "Design",
  labels: new Set(["Architecture", "Cost Estimation"]),
});

// Creating a custom viewpoint
const viewpointsTable = document.createElement("bim-table");
viewpointsTable.headersHidden = true;
viewpointsTable.hiddenColumns = ["Guid"];
viewpointsTable.columns = ["Name", { name: "Actions", width: "auto" }];
viewpointsTable.dataTransform = {
  Actions: (_, rowData) => {
    const { Guid } = rowData;
    if (!(Guid && typeof Guid === "string")) return Guid;
    const viewpoints = components.get(OBC.Viewpoints);
    const viewpoint = viewpoints.list.get(Guid);
    if (!viewpoint) return Guid;
    return BUI.html`
      <bim-button @click=${() => viewpoint.go()} icon="ph:eye-fill"></bim-button> 
      <bim-button @click=${() => console.log(viewpoint.selection)} icon="ph:cursor-fill"></bim-button> 
      <bim-button @click=${() => viewpoint.update()} icon="jam:refresh"></bim-button> 
      <bim-button @click=${() => viewpoints.list.delete(viewpoint.guid)} icon="tabler:trash-filled"></bim-button>
    `;
  },
};

const [viewpointsList, updateViewpointsList] = BUI.Component.create(
  (state: { components: OBC.Components }) => {
    const { components } = state;
    const viewpoints = components.get(OBC.Viewpoints);
    viewpointsTable.data = [...viewpoints.list.values()].map((viewpoint) => {
      return {
        data: {
          Guid: viewpoint.guid,
          Name: viewpoint.name,
          Actions: "",
        },
      };
    });
    return BUI.html`${viewpointsTable}`;
  },
  {
    components,
  },
);

viewpoints.list.onItemSet.add(() => updateViewpointsList());
viewpoints.list.onItemDeleted.add(() => updateViewpointsList());
viewpoints.list.onCleared.add(() => updateViewpointsList());

const viewpoint = viewpoints.create(world, { name: "Custom Viewpoint" });
// viewpoint.addComponentsFromMap(model.getFragmentMap([186])); // You can provide a FragmentIdMap to the viewpoint selection
// viewpoint.selectionComponents.add("2idC0G3ezCdhA9WVjWemcy"); // You can provide a GlobalId to the viewpoint selection
// viewpoint.selection gives the fragmentIdMap to select elements with the highlighter from @thatopen/components-front

topic.viewpoints.add(viewpoint);
topic.createComment("Hi there! I agree.");

const leftPanel = BUI.Component.create(() => {
  return BUI.html`
   <bim-panel>
    <bim-panel-section label="Viewpoints">
      ${viewpointsList}
    </bim-panel-section>
   </bim-panel> 
  `;
});

const bottomPanel = BUI.Component.create(() => {
  const onBcfDownload = async () => {
    const bcf = await bcfTopics.export();
    const bcfFile = new File([bcf], "topics.bcf");
    const a = document.createElement("a");
    a.href = URL.createObjectURL(bcfFile);
    a.download = bcfFile.name;
    a.click();
    URL.revokeObjectURL(a.href);
  };

  return BUI.html`
   <bim-panel>
    <bim-panel-section label="Topics">
      <bim-button label="Download" @click=${onBcfDownload}></bim-button> 
      ${topicsList}
    </bim-panel-section>
   </bim-panel> 
  `;
});

const app = document.getElementById("app") as BUI.Grid;
app.layouts = {
  main: {
    template: `
      "leftPanel viewport" 2fr
      "leftPanel bottomPanel" 1fr
      / 25rem 1fr
    `,
    elements: { leftPanel, viewport, bottomPanel },
  },
};

app.layout = "main";
