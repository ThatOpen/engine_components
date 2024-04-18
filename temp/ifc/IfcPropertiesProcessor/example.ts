// Set up scene (see SimpleScene tutorial)

import * as THREE from "three";
import * as OBC from "../..";

const container = document.getElementById("container")!;

const components = new OBC.Components();

components.scene = new OBC.SimpleScene(components);

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

/* MD
  ### 🧶 View all IFC properties FAST
  ___
  IFC elements have tons of data, and it's often indirectly
  bound to the elements. Luckily, getting all the data for any
  IFC element is trivial with these libraries. Let´s see how! First,
  as usually, we'll load our classic fragment model and set up
  the fragment highlighter:
  */

const fragments = new OBC.FragmentManager(components);
const file = await fetch("../../../resources/small.frag");
const dataBlob = await file.arrayBuffer();
const buffer = new Uint8Array(dataBlob);
const model = await fragments.load(buffer);
const properties = await fetch("../../../resources/small.json");
const props = await properties.json();
model.setLocalProperties(props);

const highlighter = new OBC.FragmentHighlighter(components);
highlighter.setup();
rendererComponent.postproduction.customEffects.outlineEnabled = true;
highlighter.outlineEnabled = true;

/* MD
  Next, we will create a new instance of the component to navigate
  IFC properties: the `IfcPropertiesProcessor`. We will also
  make its built-in floating window visible by default.
  */

const propsProcessor = new OBC.IfcPropertiesProcessor(components);
propsProcessor.uiElement.get("propertiesWindow").visible = true;

/* MD
  Now, to view the properties of a model we need to process it:
  */

propsProcessor.process(model);

/* MD
  And now, we will bind the highlihgter logic to the properties
  processor, so that each time that we click on an element, its
  properties will be shown:
  */

const highlighterEvents = highlighter.events;
highlighterEvents.select.onClear.add(() => {
  propsProcessor.cleanPropertiesList();
});

highlighterEvents.select.onHighlight.add((selection) => {
  const fragmentID = Object.keys(selection)[0];
  const expressID = [...selection[fragmentID]][0];
  const fragment = fragments.list[fragmentID];
  if (fragment.group) {
    propsProcessor.renderProperties(fragment.group, expressID);
  }
});

// console.log(propsProcessor._indexMap);
//
// setTimeout(
//     () => {
//         const toExport = {};
//         for(const fragID in propsProcessor._indexMap) {
//             const ids = propsProcessor._indexMap[fragID];
//             for(const expressID in ids) {
//                 const associatedIDs = ids[expressID];
//                 toExport[expressID] = [...associatedIDs];
//             }
//         }
//
//         console.log(JSON.stringify(toExport));
//     },
//     1000
// )

/* MD
  Finally, we will add the main built-in button of the properties
  processor to a simple toolbar at the bottom of our app:
  */

const mainToolbar = new OBC.Toolbar(components);
components.ui.addToolbar(mainToolbar);
mainToolbar.addChild(propsProcessor.uiElement.get("main"));

/* MD
  This is it! Congratulations, now you can see and navigate
  the properties of any IFC model you load in your apps. Now,
  let's continue navigating these docs for more cool open BIM tools!
  */
