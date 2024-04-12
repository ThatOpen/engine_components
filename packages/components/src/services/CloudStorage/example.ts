// Set up scene (see SimpleScene tutorial)

import * as OBC from "../..";

const container = document.getElementById("container")!;

const components = new OBC.Components();

const sceneComponent = new OBC.SimpleScene(components);
sceneComponent.setup();
components.scene = sceneComponent;

const rendererComponent = new OBC.PostproductionRenderer(components, container);
components.renderer = rendererComponent;

const cameraComponent = new OBC.SimpleCamera(components);
components.camera = cameraComponent;

components.raycaster = new OBC.SimpleRaycaster(components);

components.init();

cameraComponent.controls.setLookAt(10, 10, 10, 0, 0, 0);

// @ts-ignore
const grid = new OBC.SimpleGrid(components);

// Set up cloud processor

const storage = new OBC.CloudStorage(components);
storage.token =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1IjoiNjUwNmYyZjk0NWM4YmM2YTk0Mzg0NjM4IiwiYSI6IjY1NTRjMTJjODRmZTUwOTk4Yzk2YWViYyJ9.orL8C6hAS4Lj6D_kDAeUiGytNVqgpPL2wV9a7sTMpAg";

// Get all the models

await storage.update();
const models = storage.get();
console.log(models);

// Delete models

for (const model of models) {
  storage.delete(model._id);
}

// Upload model

window.ondblclick = async () => {
  await storage.upload("../../../resources/small.ifc");
  console.log("Model uploaded! Starting processing...");
};

// Download model (after processing)

// @ts-ignore
const fragments = new OBC.FragmentManager(components);

async function loadModel(response: any) {
  console.log("Model process successful!");
  console.log(response);
}

storage.modelProcessed.add(loadModel);
