/* MD
### 👓 Making things invisible
---

In this tutorial, you'll learn how control the visibility of the items of a BIM model.

:::tip Why make things invisible?

Many times, we just want to look at a specific part of a BIM model, without seeing the rest of it. BIM models are complex, and finding what we are looking for is not always easy. Luckily, the components library has tools to make it easier!

:::

In this tutorial, we will import:

- `@thatopen/ui` to add some simple and cool UI menus.
- `web-ifc` to get some IFC items.
- `@thatopen/components` to set up the barebone of our app.
- `Stats.js` (optional) to measure the performance of our app.
*/

import Stats from "stats.js";
import * as BUI from "@thatopen/ui";
import * as WEBIFC from "web-ifc";
import * as OBC from "@thatopen/components";

/* MD
  ### 🌎 Setting up a simple scene
  ---

  We will start by creating a simple scene with a camera and a renderer. If you don't know how to set up a scene, you can check the Worlds tutorial.
*/

const container = document.getElementById("container")!;

const components = new OBC.Components();

const worlds = components.get(OBC.Worlds);

const world = worlds.create<
  OBC.SimpleScene,
  OBC.SimpleCamera,
  OBC.SimpleRenderer
>();

world.scene = new OBC.SimpleScene(components);
world.renderer = new OBC.SimpleRenderer(components, container);
world.camera = new OBC.SimpleCamera(components);

components.init();

world.camera.controls.setLookAt(12, 6, 8, 0, 0, -10);

world.scene.setup();

const grids = components.get(OBC.Grids);
grids.create(world);

/* MD

  We'll make the background of the scene transparent so that it looks good in our docs page, but you don't have to do that in your app!

*/

world.scene.three.background = null;

/* MD
  ### 🔎 Custom filters for your BIM models
  ---
  
  First, let's start by creating a `FragmentManager` instance and
  loading a simple fragment. If you haven't checked out the tutorial
  for that component yet, do it before going forward!
*/

const fragments = components.get(OBC.FragmentsManager);
const file = await fetch(
  "https://thatopen.github.io/engine_components/resources/small.frag",
);
const data = await file.arrayBuffer();
const buffer = new Uint8Array(data);
const model = fragments.load(buffer);
world.scene.three.add(model);

const properties = await fetch(
  "https://thatopen.github.io/engine_components/resources/small.json",
);
model.setLocalProperties(await properties.json());

const indexer = components.get(OBC.IfcRelationsIndexer);
const relationsFile = await fetch(
  "https://thatopen.github.io/engine_components/resources/small-relations.json",
);
const relations = indexer.getRelationsMapFromJSON(await relationsFile.text());
indexer.setRelationMap(model, relations);

/* MD
  Now that we have our model, let's start the `FragmentHider`. You
  can use the `loadCached` method if you had used it before: it will
  automatically load all the filters you created in previous sessions,
  even after closing the browser and opening it again:
*/

const hider = components.get(OBC.Hider);

/* MD
  ### 📕📗📘 Setting up simple filters
  ---
  Next, we will classify data by category and by level using the `Classifier`. This will allow us to create a simple filter for both classifications.
*/

const classifier = components.get(OBC.Classifier);
classifier.byEntity(model);
await classifier.bySpatialStructure(model, {
  isolate: new Set([WEBIFC.IFCBUILDINGSTOREY]),
});

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
  ### 🧩 Adding some UI
  ---

  We will use the `@thatopen/ui` library to add some simple and cool UI elements to our app. First, we need to call the `init` method of the `BUI.Manager` class to initialize the library:
*/

BUI.Manager.init();

/* MD
  Next, we will create a simple object that we will use as the base for the floors filter. It will just be an object with the name of each storey as key and a boolean (true/false) as value:
*/

const spatialStructures: Record<string, any> = {};
const structureNames = Object.keys(classifier.list.spatialStructures);
for (const name of structureNames) {
  spatialStructures[name] = true;
}

/* MD
    Now, let's do the same for categories:
*/

const classes: Record<string, any> = {};
const classNames = Object.keys(classifier.list.entities);
for (const name of classNames) {
  classes[name] = true;
}

/* MD
Now we will add some UI to control the visibility of items per category and per floor using simple checkboxes. For more information about the UI library, you can check the specific documentation for it!
*/

const panel = BUI.Component.create<BUI.PanelSection>(() => {
  return BUI.html`
    <bim-panel active label="Hider Tutorial" class="options-menu">
      <bim-panel-section collapsed label="Controls">
      
      <bim-panel-section collapsed label="Floors" name="Floors"">
      </bim-panel-section>
      
      <bim-panel-section collapsed label="Categories" name="Categories"">
      </bim-panel-section>
      
    </bim-panel>
  `;
});

document.body.append(panel);

const floorSection = panel.querySelector(
  "bim-panel-section[name='Floors']",
) as BUI.PanelSection;

const categorySection = panel.querySelector(
  "bim-panel-section[name='Categories']",
) as BUI.PanelSection;

for (const name in spatialStructures) {
  const panel = BUI.Component.create<BUI.Checkbox>(() => {
    return BUI.html`
      <bim-checkbox checked label="${name}"
        @change="${({ target }: { target: BUI.Checkbox }) => {
          const found = classifier.list.spatialStructures[name];
          if (found && found.id !== null) {
            for (const [_id, model] of fragments.groups) {
              const foundIDs = indexer.getEntityChildren(model, found.id);
              const fragMap = model.getFragmentMap(foundIDs);
              hider.set(target.value, fragMap);
            }
          }
        }}">
      </bim-checkbox>
    `;
  });
  floorSection.append(panel);
}

for (const name in classes) {
  const checkbox = BUI.Component.create<BUI.Checkbox>(() => {
    return BUI.html`
      <bim-checkbox checked label="${name}"
        @change="${({ target }: { target: BUI.Checkbox }) => {
          const found = classifier.find({ entities: [name] });
          hider.set(target.value, found);
        }}">
      </bim-checkbox>
    `;
  });
  categorySection.append(checkbox);
}

/* MD
  And we will make some logic that adds a button to the screen when the user is visiting our app from their phone, allowing to show or hide the menu. Otherwise, the menu would make the app unusable.
*/

const button = BUI.Component.create<BUI.PanelSection>(() => {
  return BUI.html`
      <bim-button class="phone-menu-toggler" icon="solar:settings-bold"
        @click="${() => {
          if (panel.classList.contains("options-menu-visible")) {
            panel.classList.remove("options-menu-visible");
          } else {
            panel.classList.add("options-menu-visible");
          }
        }}">
      </bim-button>
    `;
});

document.body.append(button);

/* MD
### 🎉 Wrap up
---

  That's it! You have created an app with an UI that allows the user to control the visibility of items in a BIM model by floor and by category. Well done!
*/
