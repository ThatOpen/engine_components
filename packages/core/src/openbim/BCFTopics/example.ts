// eslint-disable-next-line import/no-extraneous-dependencies
import * as BUI from "@thatopen/ui";
import * as OBC from "../..";

BUI.Manager.init();

const components = new OBC.Components();

const worlds = components.get(OBC.Worlds);
const world = worlds.create();

const sceneComponent = new OBC.SimpleScene(components);
sceneComponent.setup();
world.scene = sceneComponent;

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

const fragmentsManager = components.get(OBC.FragmentsManager);
fragmentsManager.onFragmentsLoaded.add(async (model) => {
  world.scene.three.add(model);
  if (model.hasProperties) await indexer.process(model);
});

const file = await fetch(
  "https://thatopen.github.io/engine_components/resources/small.ifc",
);
const data = await file.arrayBuffer();
const buffer = new Uint8Array(data);
const model = await ifcLoader.load(buffer);

const bcfTopics = components.get(OBC.BCFTopics);
bcfTopics.config.types = new Set(["Clash, Inquiry, Information, Coordination"]);
bcfTopics.config.statuses = new Set([
  "Active",
  "In Progress",
  "Completed",
  "In Review",
  "Closed",
]);
bcfTopics.config.priorities = new Set(["Low", "Normal", "High", "Critical"]);
bcfTopics.config.stages = new Set(["Planning", "Design", "Construction"]);

const topic = bcfTopics.createTopic();
topic.description = "It seems these elements are badly defined.";
topic.type = "Information";
topic.priority = "High";
topic.stage = "Design";

const viewpoints = components.get(OBC.Viewpoints);
const viewpoint = viewpoints.create(world);
viewpoint.addComponentsFromMap(model.getFragmentMap([186])); // You can provide a FragmentIdMap to the viewpoint selection
viewpoint.selectionComponents.add("2idC0G3ezCdhA9WVjWemcy"); // You can provide a GlobalId to the viewpoint selection
// viewpoint.selection gives the fragmentIdMap to select elements with the highlighter from @thatopen/components-front

topic.viewpoints.add(viewpoint);
topic.createComment("Hi there! I agree.");

const panel = BUI.Component.create(() => {
  const onUpdateViewpoint = () => {
    console.log({ ...viewpoint.camera });
    viewpoint.update();
    console.log({ ...viewpoint.camera });
  };

  const onBcfDownload = async () => {
    const bcf = await bcfTopics.export(new Set([topic]));
    const bcfFile = new File([bcf], "topics.bcf");
    const a = document.createElement("a");
    a.href = URL.createObjectURL(bcfFile);
    a.download = bcfFile.name;
    a.click();
    URL.revokeObjectURL(a.href);
  };

  return BUI.html`
   <bim-panel label="BCF Manager">
    <bim-panel-section label="Viewpoints">
     <bim-button label="Update Viewpoint" @click=${onUpdateViewpoint}></bim-button> 
     <bim-button label="Go" @click=${() => viewpoint.go()}></bim-button> 
    </bim-panel-section>
    <bim-panel-section label="Topics">
     <bim-button label="Download" @click=${onBcfDownload}></bim-button> 
    </bim-panel-section>
   </bim-panel> 
  `;
});

const app = document.getElementById("app") as BUI.Grid;
app.layouts = {
  main: {
    template: `
      "panel viewport"
      / 30rem 1fr
    `,
    elements: { panel, viewport },
  },
};

app.layout = "main";
