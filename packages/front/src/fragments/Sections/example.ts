/* MD
### 📐 Navigating sections
---

Sections are one of the most common ways of navigating BIM models, as they have been the most commonly used document before the digital era. In this tutorial, you'll learn how to do it with our libraries.

:::tip Sections?

Even though the BIM model defines the building perfectly, architects and engineers are still used to the clipped 2D representation that we have used for decades.

:::

In this tutorial, we will import:

- `three` to create some 3D items.
- `@thatopen/components` to set up the barebone of our app.
- `@thatopen/ui` to add some simple and cool UI menus.
- `@thatopen/components-front` to use some frontend-oriented components.
- `Stats.js` (optional) to measure the performance of our app.
*/

import * as THREE from "three";
import * as OBC from "@thatopen/components";
import * as BUI from "@thatopen/ui";
import Stats from "stats.js";
import * as OBCF from "@thatopen/components-front";

/* MD
  ### 🌎 Setting up a simple scene
  ---

  We will start by creating a simple scene with a camera and a renderer. If you don't know how to set up a scene, you can check the Worlds tutorial. Notice how we use the PostproductionRenderer in this case.
*/

const container = document.getElementById("container")!;

const components = new OBC.Components();

const worlds = components.get(OBC.Worlds);

const world = worlds.create<
  OBC.SimpleScene,
  OBC.OrthoPerspectiveCamera,
  OBCF.PostproductionRenderer
>();

world.scene = new OBC.SimpleScene(components);
world.renderer = new OBCF.PostproductionRenderer(components, container);
world.camera = new OBC.OrthoPerspectiveCamera(components);

world.renderer.postproduction.enabled = true;
world.renderer.postproduction.customEffects.outlineEnabled = true;

components.init();

world.camera.controls.setLookAt(12, 6, 8, 0, 0, -10);

world.scene.setup();

const grids = components.get(OBC.Grids);
const grid = grids.create(world);
grid.config.color.setHex(0x666666);
grid.three.position.y -= 1;
world.renderer.postproduction.customEffects.excludedMeshes.push(grid.three);

/* MD

  We'll make the background of the scene transparent so that it looks good in our docs page, but you don't have to do that in your app!

*/

world.scene.three.background = null;

/* MD
  ### 🧳 Loading a BIM model
  ---

 We'll start by adding a BIM model to our scene. That model is already converted to fragments, so it will load much faster than if we loaded the IFC file.

  :::tip Fragments?

    If you are not familiar with fragments, check out the IfcLoader tutorial!

  :::
*/

const fragments = components.get(OBC.FragmentsManager);
const file = await fetch(
  "https://thatopen.github.io/engine_components/resources/small.frag",
);
const data = await file.arrayBuffer();
const buffer = new Uint8Array(data);
const model = fragments.load(buffer);
world.scene.three.add(model);

const propsFile = await fetch(
  "https://thatopen.github.io/engine_components/resources/small.json",
);
const propsData = await propsFile.json();
model.setLocalProperties(propsData);

/* MD
  ### ⏱️ Measuring the performance (optional)
  ---

  We'll use the [Stats.js](https://github.com/mrdoob/stats.js) to measure the performance of our app. We will add it to the top left corner of the viewport. This way, we'll make sure that the memory consumption and the FPS of our app are under control.
*/

const stats = new Stats();
stats.showPanel(2);
document.body.append(stats.dom);
stats.dom.style.left = "0px";
stats.dom.style.zIndex = "unset";
world.renderer.onBeforeUpdate.add(() => stats.begin());
world.renderer.onAfterUpdate.add(() => stats.end());

/* MD
  ### 🖼️ Creating a section
  ---

 Now, we will get an instance of the sections component and create a section of the BIM model we just loaded.
*/

const sections = components.get(OBCF.Sections);
sections.world = world;
const section = sections.create({
  name: "Section 01",
  id: "1234",
  normal: new THREE.Vector3(-1, 0, 0),
  point: new THREE.Vector3(1.5, 0, 0),
});

/* MD
  ### 🔦 Setting up highlighting
  ---

 Now, let's set up highlighting so that the user can hover and select items on the BIM model.

  :::tip Highlighter?

    If you are not familiar with highlighter, check out its specific tutorial!

  :::
*/

const highlighter = components.get(OBCF.Highlighter);
highlighter.setup({ world });

/* MD
  ### 🐈‍⬛ Setting up culling
  ---

 Now, let's set up culling so that our scene becomes even more efficient.

  :::tip Culling?

    If you are not familiar with culling, check out its specific tutorial!

  :::
*/

const cullers = components.get(OBC.Cullers);
const culler = cullers.create(world);
for (const fragment of model.items) {
  culler.add(fragment.mesh);
}

culler.needsUpdate = true;

world.camera.controls.addEventListener("sleep", () => {
  culler.needsUpdate = true;
});

/* MD
  ### 🖌️ Defining styles
  ---

 Next, we need to define how we want the sections to look like. For that, we'll need to create a bunch of clipping styles, so that the walls and slabs have a thick section line and a filling, whereas the doors and windows have a thin section line. Of course, we also need to classifier to split the model to categories.

   :::tip Clipping? Classifier?

    If you are not familiar with the edges clipper or the classifier, check out that tutorial for more details about it!

  :::

  So let's create both:
*/

const classifier = components.get(OBC.Classifier);
const edges = components.get(OBCF.ClipEdges);

/* MD
  Now we will classify the model by model (to get all entities) and by entity (to split it by IFC category). Then we'll create some groups:
  - All the items in this model.
  - All the walls in this model.
  - All the doors, windows, plates and members in this model.
*/

classifier.byModel(model.uuid, model);
classifier.byEntity(model);

const modelItems = classifier.find({ models: [model.uuid] });

const thickItems = classifier.find({
  entities: ["IFCWALLSTANDARDCASE", "IFCWALL", "IFCSLAB"],
});

const thinItems = classifier.find({
  entities: ["IFCDOOR", "IFCWINDOW", "IFCPLATE", "IFCMEMBER"],
});

/* MD
  Awesome! Now, to create a style called "thick" for the walls, we can do the following:
*/

const grayFill = new THREE.MeshBasicMaterial({ color: "gray", side: 2 });
const blackLine = new THREE.LineBasicMaterial({ color: "black" });
const blackOutline = new THREE.MeshBasicMaterial({
  color: "black",
  opacity: 0.5,
  side: 2,
  transparent: true,
});

edges.styles.create(
  "thick",
  new Set(),
  world,
  blackLine,
  grayFill,
  blackOutline,
);

for (const fragID in thickItems) {
  const foundFrag = fragments.list.get(fragID);
  if (!foundFrag) continue;
  const { mesh } = foundFrag;
  edges.styles.list.thick.fragments[fragID] = new Set(thickItems[fragID]);
  edges.styles.list.thick.meshes.add(mesh);
}

/* MD
  Creating a style called "thin" for the rest follows the same pattern:
*/

edges.styles.create("thin", new Set(), world);

for (const fragID in thinItems) {
  const foundFrag = fragments.list.get(fragID);
  if (!foundFrag) continue;
  const { mesh } = foundFrag;
  edges.styles.list.thin.fragments[fragID] = new Set(thinItems[fragID]);
  edges.styles.list.thin.meshes.add(mesh);
}

/* MD
  Finally, let's update the edges to apply these changes.
*/

await edges.update(true);

/* MD
  ### 🧩 Adding some UI
  ---

  We will use the `@thatopen/ui` library to add some simple and cool UI elements to our app. First, we need to call the `init` method of the `BUI.Manager` class to initialize the library:
*/

BUI.Manager.init();

/* MD
Now we will add some UI to control the navigation across sections. For more information about the UI library, you can check the specific documentation for it!
*/

const panel = BUI.Component.create<BUI.PanelSection>(() => {
  return BUI.html`
  <bim-panel active label="Sections Tutorial" class="options-menu">
      <bim-panel-section collapsed name="sections" label="Section list">
      </bim-panel-section>
    </bim-panel>
    `;
});

document.body.append(panel);

/* MD
  Next, we will add a button for each section, so that when clicking on that button, we navigate to it and the look of the model becomes more "section-like" (black and white with outlines):
*/

const minGloss = world.renderer!.postproduction.customEffects.minGloss;

const whiteColor = new THREE.Color("white");

const panelSection = panel.querySelector(
  "bim-panel-section[name='sections']",
) as BUI.PanelSection;

const sectionButton = BUI.Component.create<BUI.Checkbox>(() => {
  return BUI.html`
      <bim-button checked label="${section.name}"
        @click="${() => {
          world.renderer!.postproduction.customEffects.minGloss = 0.1;
          highlighter.backupColor = whiteColor;
          classifier.setColor(modelItems, whiteColor);
          world.scene.three.background = whiteColor;
          sections.goTo(section.id);
          culler.needsUpdate = true;
        }}">
      </bim-button>
    `;
});
panelSection.append(sectionButton);

/* MD
  Finally, we will add a last button to exit the section mode, going back to the 3D view and making the appearance of the scene go back to normal.
*/

const defaultBackground = world.scene.three.background;

const exitButton = BUI.Component.create<BUI.Checkbox>(() => {
  return BUI.html`
      <bim-button checked label="Exit"
        @click="${() => {
          highlighter.backupColor = null;
          highlighter.clear();
          world.renderer!.postproduction.customEffects.minGloss = minGloss;
          classifier.resetColor(modelItems);
          world.scene.three.background = defaultBackground;
          sections.exit();
          culler.needsUpdate = true;
        }}">
      </bim-button>
    `;
});

panelSection.append(exitButton);

/* MD
  ### 🎉 Wrap up
  ---

  That's it! You have created an app that can generate sections of a BIM model and navigate across them in 2D mode with a nice black and white look. Congratulations!
*/
