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
const selection = model.getFragmentMap([186]);

// Viewpoints
const viewpoints = components.get(OBC.Viewpoints);
const viewpoint = viewpoints.create(world);
viewpoint.addComponentsFromMap(selection);
viewpoint.selectionComponents.add("2idC0G3ezCdhA9WVjWemcy");
// viewpoint.selection gives the fragmentIdMap to select elements with the highlighter from @thatopen/components-front

// BCF Manager
const bcfManager = components.get(OBC.BCFManager);
const topic = bcfManager.createTopic();
topic.viewpoints.add(viewpoint);

const panel = BUI.Component.create(() => {
  const onUpdateViewpoint = () => {
    console.log({ ...viewpoint.camera });
    viewpoint.update();
    console.log({ ...viewpoint.camera });
  };

  return BUI.html`
   <bim-panel label="BCF Manager">
    <bim-panel-section label="Viewpoints">
     <bim-button label="Update Viewpoint" @click=${onUpdateViewpoint}></bim-button> 
     <bim-button label="Go" @click=${() => viewpoint.go()}></bim-button> 
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
