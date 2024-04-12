// Set up scene (see SimpleScene tutorial)

import * as THREE from "three";
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
const gridMesh = grid.get();
rendererComponent.postproduction.customEffects.excludedMeshes.push(gridMesh);

const loader = new OBC.FragmentIfcLoader(components);
await loader.setup();

/* MD
  ### ✍ Edit properties at will!
  ___
  Viewing IFC files fast is great, but often the data inside
  them is not correct or complete. Luckily, we can now directly
  edit and add data super easily! First, let's start by adding
  our classic fragment model:
  */

const fragments = new OBC.FragmentManager(components);
const file = await fetch("../../../resources/small.frag");
const dataBlob = await file.arrayBuffer();
const buffer = new Uint8Array(dataBlob);
const model = await fragments.load(buffer);
const properties = await fetch("../../../resources/small.json");
const props = await properties.json();
model.setLocalProperties(props);

/* MD
  Then, we'll instance the tool that we need for editing properties:
  the `IfcPropertiesManager`! It's designed as an extension of the
  `IfcPropertiesProcessor`, so if you haven't seen that tutorial
  yet, check it out before reading further.
  */

const propsProcessor = new OBC.IfcPropertiesProcessor(components);
const propsManager = new OBC.IfcPropertiesManager(components);
propsProcessor.propertiesManager = propsManager;

/* MD
  The `IfcPropertiesManager` can edit IFCs and export new IFC models.
  Despite you can do it using the methods in the tool instance, 
  let's process the model using the `IfcPropertiesProcessor` to use 
  the built-in UI, because is easier!
  */

propsProcessor.process(model);

propsManager.onRequestFile.add(async () => {
  const fetched = await fetch("../../../resources/small.ifc");
  const buffer = await fetched.arrayBuffer();
  const ifc = await propsManager.saveToIfc(model, new Uint8Array(buffer));
  const a = document.createElement("a");
  const url = URL.createObjectURL(new Blob([ifc]));
  a.href = url;
  a.download = model.name;
  a.click();
  URL.revokeObjectURL(url);
});

/* MD
  ### ✨ Setting up highlighting and selecting
  ___
  Now, we will set up highlighting logic to make our app more
  interesting. It's done in a similar way to other tutorials,
  so wander around the docs if you haven't already!
  */

const highlighter = new OBC.FragmentHighlighter(components);
highlighter.setup();

rendererComponent.postproduction.customEffects.outlineEnabled = true;
highlighter.outlineEnabled = true;

const highlighterEvents = highlighter.events;
highlighterEvents.select.onClear.add(() => {
  propsProcessor.cleanPropertiesList();
});

/* MD
  Now, we will configure the highlighter so that each time that
  we cick on the model, the properties menu is updated to display
  its properties, just like we did in the `IfcPropertiesProcessor`
  tutorial:
  */

highlighterEvents.select.onHighlight.add((selection) => {
  const fragmentID = Object.keys(selection)[0];
  const expressID = [...selection[fragmentID]][0];
  const fragment = fragments.list[fragmentID];
  if (fragment.group) {
    propsProcessor.renderProperties(fragment.group, expressID);
  }
});

/* MD
  Finally, we will add the UI to the app by creating a simple
  toolbar:
  */

const mainToolbar = new OBC.Toolbar(components);
components.ui.addToolbar(mainToolbar);
mainToolbar.addChild(propsProcessor.uiElement.get("main"));

/* MD
  Great job! Now you know how to support IFC property editing and
  export in your apps. Check out the rest of the tutorials of
  these docs for other cool BIM features.
  */
