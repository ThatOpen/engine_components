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

/* MD
  ### 📃📜📄 Navigating our 3D world in 2D
  ___
  Before 3D existed, architects and engineers had to represent the
  built reality in 2D drawings. We still use those 2D representations,
  and floor plans are the king of this 2D realm. Creating and
  navigating floor plans is really easy! First, let's start an
  instance of the culler (check out its tutorial if you haven't
  already):
  */

const culler = new OBC.ScreenCuller(components);
culler.setup();

container.addEventListener(
  "mouseup",
  () => (culler.elements.needsUpdate = true),
);
container.addEventListener("wheel", () => (culler.elements.needsUpdate = true));

/* MD
  Next, let's load our classic fragment model and add it to the
  scene and to the culler:
  */

const fragments = new OBC.FragmentManager(components);
const file = await fetch("../../../resources/small.frag");
const data = await file.arrayBuffer();
const buffer = new Uint8Array(data);
const model = await fragments.load(buffer);
const properties = await fetch("../../../resources/small.json");
const props = await properties.json();
model.setLocalProperties(props);

for (const fragment of model.items) {
  culler.elements.add(fragment.mesh);
}

culler.elements.needsUpdate = true;

/* MD
  ### ✨ Styling our floorplans
  ___
  Now we will decide how we want our floorplans to look like. To do
  that, we will instantiate the `EdgesClipper` and define two styles:
  one for thick lines, and another one for thin lines:

  :::info Edges?

  If you haven't seen the tutorial of the edges clipper yet, check
  it out before continuing!

  :::

  */

const clipper = new OBC.EdgesClipper(components);
const sectionMaterial = new THREE.LineBasicMaterial({ color: "black" });
const fillMaterial = new THREE.MeshBasicMaterial({ color: "gray", side: 2 });
const fillOutline = new THREE.MeshBasicMaterial({
  color: "black",
  side: 1,
  opacity: 0.5,
  transparent: true,
});

clipper.styles.create(
  "filled",
  new Set(),
  sectionMaterial,
  fillMaterial,
  fillOutline,
);
clipper.styles.create("projected", new Set(), sectionMaterial);
const styles = clipper.styles.get();

/* MD
  Don't forget to enable the outline effect or you won't see the
  clipping outline!
  */

postproduction.customEffects.outlineEnabled = true;

/* MD
  We want to apply the styles depending on the category of each
  element. Luckily for us, the `FragmentClassifier` makes this
  task a piece of cake:
  */

const classifier = new OBC.FragmentClassifier(components);
classifier.byEntity(model);
classifier.byStorey(model);
const found = classifier.find({ entities: ["IFCWALLSTANDARDCASE", "IFCWALL"] });

/* MD
  Now we can assign each geometry to its corresponding style
  by using 2 simple loops:
  */

for (const fragID in found) {
  const { mesh } = fragments.list[fragID];
  styles.filled.fragments[fragID] = new Set(found[fragID]);
  styles.filled.meshes.add(mesh);
}

const meshes = [];
for (const fragment of model.items) {
  const { mesh } = fragment;
  meshes.push(mesh);
  styles.projected.meshes.add(mesh);
}

/* MD
  ### ⛄ Global white material
  ___
  As you might now, floorplans are usually white (as they were
  printed on paper). We can achieve this same effect by using
  the `MaterialManager`:
  */

const whiteColor = new THREE.Color("white");
const whiteMaterial = new THREE.MeshBasicMaterial({ color: whiteColor });
const materialManager = new OBC.MaterialManager(components);
materialManager.addMaterial("white", whiteMaterial);
materialManager.addMeshes("white", meshes);

/* MD
  ### 🤖 Generating the plans
  ___
  Creating the plans is super easy using the `FragmentPlans`
  tool. We can just use the `computeAllPlanViews` and it will
  process everything automatically!
  */

const plans = new OBC.FragmentPlans(components);
await plans.computeAllPlanViews(model);

/* MD
  Let's also add some functionality to our floorplans. We will allow
  the user to highlight and hide / show elements depending on their
  floorplan. To do that, we can start by starting the `FragmentHider`
  and `FragmentHighlighter`:
  */

const hider = new OBC.FragmentHider(components);
const highlighter = new OBC.FragmentHighlighter(components);

/* MD
  Then, set up the fragmentHighlighter like this:
  */

const highlightMat = new THREE.MeshBasicMaterial({
  depthTest: false,
  color: 0xbcf124,
  transparent: true,
  opacity: 0.3,
});

highlighter.add("default", [highlightMat]);
const canvas = rendererComponent.get().domElement;
canvas.addEventListener("click", () => highlighter.clear("default"));

highlighter.updateHighlight();

/* MD
    And let's add these features to the floorplans as extra commands
    and update the plan list to update the UI plan list that we
    will see in a moment:
    */

plans.commands = {
  Select: (plan) => {
    if (!plan) return;
    const found = classifier.find({ storeys: [plan.name] });
    highlighter.highlightByID("default", found);
  },
  Show: (plan) => {
    if (!plan) return;
    const found = classifier.find({ storeys: [plan.name] });
    hider.set(true, found);
  },
  Hide: (plan) => {
    if (!plan) return;
    const found = classifier.find({ storeys: [plan.name] });
    hider.set(false, found);
  },
};

plans.updatePlansList();

/* MD
  Now, the final piece: let's add the built-in plan list menu to our
  app. You can do it simply by creating a new `Toolbar` and adding
  the button that comes with the fragment plans component:
  */

const mainToolbar = new OBC.Toolbar(components);
mainToolbar.name = "Main Toolbar";
components.ui.addToolbar(mainToolbar);
mainToolbar.addChild(plans.uiElement.get("main"));

/* MD
  And don't forget to set up the events so that when you navigate
  into a floorplan, we the scene display is set up correctly:
  */

plans.onNavigated.add(() => {
  postproduction.customEffects.glossEnabled = false;
  materialManager.setBackgroundColor(whiteColor);
  materialManager.set(true, ["white"]);
  grid.visible = false;
});

plans.onExited.add(() => {
  postproduction.customEffects.glossEnabled = true;
  materialManager.resetBackgroundColor();
  materialManager.set(false, ["white"]);
  grid.visible = true;
});

/* MD
  Fantastic job! You have created a 3D app that can create and
  navigate 2D floorplans of fragments and IFC models. This will
  bring your BIM apps to the next level. See you in other tutorials
  of these docs!
  */

// Set up stats
const stats = new Stats();
stats.showPanel(2);
document.body.append(stats.dom);
stats.dom.style.left = "0px";
stats.dom.style.right = "auto";

rendererComponent.onBeforeUpdate.add(() => stats.begin());
rendererComponent.onAfterUpdate.add(() => stats.end());
