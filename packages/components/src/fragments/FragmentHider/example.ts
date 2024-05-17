// Set up scene (see SimpleScene tutorial)

import * as THREE from "three";
import Stats from "stats.js";
// @ts-ignore
import * as dat from "three/examples/jsm/libs/lil-gui.module.min";
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

const scene = components.scene.get();

cameraComponent.controls.setLookAt(12, 6, 8, 0, 0, -10);

const directionalLight = new THREE.DirectionalLight();
directionalLight.position.set(5, 10, 3);
directionalLight.intensity = 0.5;
scene.add(directionalLight);

const ambientLight = new THREE.AmbientLight();
ambientLight.intensity = 0.5;
scene.add(ambientLight);

const grid = new OBC.SimpleGrid(components, new THREE.Color(0x666666));
const gridMesh = grid.get();
const effects = rendererComponent.postproduction.customEffects;
effects.excludedMeshes.push(gridMesh);

/* MD
  ### 🔎 Custom filters for your BIM models
  ___
  BIM models are complex, and finding what we are looking for is not
  always easy. Luckily, the components library has tools to make
  it easier, and one of them is the 'FragmentHider'. Let's
  check it out!

    :::info Complex IFC, complex filters

  Each IFC is a world. Data is always defined slightly differently,
  and defining pre-made filters only works for very basic things
  like categories. With the FragmentHider, you'll be able to find
  anything, even things defined in custom categories!

  :::

  First, let's start by creating a `FragmentManager` instance and
  loading a simple fragment. If you haven't checked out the tutorial
  for that component yet, do it before going forward!
  */

const fragments = new OBC.FragmentManager(components);
const file = await fetch("../../../resources/small.frag");
const dataBlob = await file.arrayBuffer();
const buffer = new Uint8Array(dataBlob);
const model = await fragments.load(buffer);
const properties = await fetch("../../../resources/small.json");
model.setLocalProperties(await properties.json());

/* MD
  Now that we have our model, let's start the `FragmentHider`. You
  can use the `loadCached` method if you had used it before: it will
  automatically load all the filters you created in previous sessions,
  even after closing the browser and opening it again:
  */

const hider = new OBC.FragmentHider(components);
await hider.loadCached();

/* MD
  ### 📕📗📘 Setting up simple filters
  ___
  Next, we will classify data by category and by level using the
  `FragmentClassifier`. This will allow us to create a simple
  filter for both classifications. Don't worry: we'll get to
  the more complex filters later!
  */

const classifier = new OBC.Classifier(components);
classifier.byStorey(model);
classifier.byEntity(model);

const classifications = classifier.get();

/* MD
  Next, we will create a simple object that we will use as the
  base for the floors filter. It will just be a JS object with
  the name of each storey as key and a boolean (true/false) as
  value:
  */

const storeys: Record<string, any> = {};
const storeyNames = Object.keys(classifications.storeys);
for (const name of storeyNames) {
  storeys[name] = true;
}

/* MD
    Now, let's do the same for categories:
    */

const classes: Record<string, any> = {};
const classNames = Object.keys(classifications.entities);
for (const name of classNames) {
  classes[name] = true;
}

/* MD
  Finally, we will set up a simple menu in dat.gui to control
  the visibility of storeys:
  */

const gui = new dat.GUI();

const storeysGui = gui.addFolder("Storeys");
for (const name in storeys) {
  storeysGui.add(storeys, name).onChange((visible: boolean) => {
    const found = classifier.find({ storeys: [name] });
    hider.set(visible, found);
  });
}

/* MD
  Again, for categories it's very similar:
  */

const entitiesGui = gui.addFolder("Classes");
for (const name in classes) {
  entitiesGui.add(classes, name).onChange((visible: boolean) => {
    const found = classifier.find({ entities: [name] });
    hider.set(visible, found);
  });
}

/* MD
  Congratulations! Now you know how to create filters for categories
  and levels. Easy, right? Well, believe it or not, creating
  complex filters is even easier.

  ### 📚📚 Complex filter queries
  ___

  To create complex filters you can just use the built-in `Button`
  that comes with the hider. Let's create a `Toolbar` and add it
  to it.
  */

const toolbar = new OBC.Toolbar(components);
components.ui.addToolbar(toolbar);
const hiderButton = hider.uiElement.get<OBC.Button>("main");
toolbar.addChild(hiderButton);

/* MD
  That's it! That button will open a floating menu that will allow
  you to create custom multi-filters that work even for custom
  property sets and quantity sets, including logical operators.
  Try them out in the example below, and check out more tutorials
  to bring your BIM apps to the next level!
  */

// Set up stats

const stats = new Stats();
stats.showPanel(2);
document.body.append(stats.dom);
stats.dom.style.left = "0px";
rendererComponent.onBeforeUpdate.add(() => stats.begin());
rendererComponent.onAfterUpdate.add(() => stats.end());
