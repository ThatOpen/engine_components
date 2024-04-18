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
cameraComponent.controls.setLookAt(12, 6, 8, 0, 0, -10);

components.raycaster = new OBC.SimpleRaycaster(components);

components.init();

const { postproduction } = rendererComponent;
postproduction.enabled = true;

const grid = new OBC.SimpleGrid(components, new THREE.Color(0x666666));
const gridMesh = grid.get();
postproduction.customEffects.excludedMeshes.push(gridMesh);

const fragments = new OBC.FragmentManager(components);

/* MD
  ### 💄 Styling those fills and edges
  ___
  You might have noticed that the `EdgesClipper` has support for fills
  and edges of various colors and thicknesses. That's great, but how can
  we set it up for our BIM app? Luckily, the `FragmentClipStyler` comes
  to the rescue!

  :::info Your app, your look

  We are used to seeing BIM software that looks exactly the same. Use
  this component to make yours look different and identifiable with
  your brand!

  :::

  Let's start by enabling the outlines in the `PostproductionRenderer`. If
  you haven't checked out that tutorial yet, you should before going
  forward!
  */

postproduction.customEffects.outlineEnabled = true;

/* MD
  Next, we will intialize the `EdgesClipper`, the `FragmentClassifier` and the
  `FragmentClipStyler`.
  */

const clipper = new OBC.EdgesClipper(components);
clipper.enabled = true;
const classifier = new OBC.FragmentClassifier(components);
const styler = new OBC.FragmentClipStyler(components);
await styler.setup();

/* MD
  Great! Now, adding it to the scene is as easy as creating a
  `Toolbar` and adding the built-in `Button` included in the styler:
  */

const toolbar = new OBC.Toolbar(components);
toolbar.name = "Main toolbar";
components.ui.addToolbar(toolbar);
const stylerButton = styler.uiElement.get<OBC.Button>("mainButton");
toolbar.addChild(stylerButton);

/* MD
  Fantastic! Now your styler is ready to be used.

  ### 🏠 Loading a model
  ___

  Of course, we won't be able to see anything until we load a model.
  We will load a simple fragment that you can find in the `resources`
  folder of the Components repository. Alternatively, you can use
  the `FragmentIfcLoader` to load an IFC file directly.
  */

const file = await fetch("../../../resources/small.frag");
const data = await file.arrayBuffer();
const buffer = new Uint8Array(data);
const model = await fragments.load(buffer);
const properties = await fetch("../../../resources/small.json");
model.setLocalProperties(await properties.json());

/* MD
  Great, now we have something in our scene. Now, let's see the
  styler in action.

  ### 🔥 Spinning up the styler
  ___

  To use the styler, we need to classify the model by entity using
  the `FragmentClassifier`. That will index all the geometry by
  IFC category for the styler. Then, we can simply call the `update`
  method to make it affect the model we just loaded:
  */

classifier.byEntity(model);
await styler.update();

/* MD
  And one last thing: we need a way to create clipping planes! In
  this example, we will just use the global double click event. In
  other words: each time you double click, a new clipping plane
  will be created:
  */

window.ondblclick = () => {
  clipper.create();
};

/* MD
    And voilà! Now you can create a clipping plane, open the styler menu
    and see the section fill and edges update in real time. You can
    create styles and apply them per category. See you in another
    tutorial. 🚀
    */

// Set up stats
const stats = new Stats();
stats.showPanel(2);
document.body.append(stats.dom);
stats.dom.style.left = "0px";
stats.dom.style.right = "auto";

rendererComponent.onBeforeUpdate.add(() => stats.begin());
rendererComponent.onAfterUpdate.add(() => stats.end());
