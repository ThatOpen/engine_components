// Set up scene (see SimpleScene tutorial)

import * as THREE from "three";
import Stats from "stats.js";
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

rendererComponent.postproduction.enabled = true;

cameraComponent.controls.setLookAt(10, 10, 10, 0, 0, 0);

const grid = new OBC.SimpleGrid(components, new THREE.Color(0x666666));
const effects = rendererComponent.postproduction.customEffects;
effects.excludedMeshes.push(grid.get());

const dimensions = new OBC.VolumeMeasurement(components);

const fragments = new OBC.FragmentManager(components);
const file = await fetch("../../../resources/small.frag");
const data = await file.arrayBuffer();
const buffer = new Uint8Array(data);
fragments.load(buffer);

const highlighter = new OBC.FragmentHighlighter(components);
highlighter.setup();
highlighter.updateHighlight();

highlighter.events.select.onHighlight.add((event) => {
  const fragmentIDs = Object.keys(event);
  const meshes = [];
  for (const id of fragmentIDs) {
    const frags = fragments.list[id].fragments;
    if (frags.select) {
      meshes.push(frags.select.mesh);
    }
  }
  const volume = dimensions.getVolumeFromMeshes(meshes);
  console.log(volume);
});

highlighter.events.select.onClear.add(() => {
  dimensions.label.get().removeFromParent();
});

container.ondblclick = () => dimensions.create();
container.oncontextmenu = () => dimensions.endCreation();

window.onkeydown = (event) => {
  if (event.code === "Delete" || event.code === "Backspace") {
    // WORK IN PROGRESS
    // dimensions.delete();
  }
};

const mainToolbar = new OBC.Toolbar(components, {
  name: "Main Toolbar",
  position: "bottom",
});
mainToolbar.addChild(dimensions.uiElement.get("main"));
components.ui.addToolbar(mainToolbar);

// Set up stats

const stats = new Stats();
stats.showPanel(2);
document.body.append(stats.dom);
stats.dom.style.left = "0px";
rendererComponent.onBeforeUpdate.add(() => stats.begin());
rendererComponent.onAfterUpdate.add(() => stats.end());
