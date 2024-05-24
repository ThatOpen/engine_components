/* eslint import/no-extraneous-dependencies: 0 */

import Stats from "stats.js";
import * as BUI from "@thatopen/ui";
import * as OBC from "../..";

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

const fragments = new OBC.FragmentsManager(components);
const file = await fetch("https://thatopen.github.io/engine_components/resources/small.frag");
const data = await file.arrayBuffer();
const buffer = new Uint8Array(data);
const model = fragments.load(buffer);
world.scene.three.add(model);

/* MD
  Now that we have our model, let's start the `FragmentHider`. You
  can use the `loadCached` method if you had used it before: it will
  automatically load all the filters you created in previous sessions,
  even after closing the browser and opening it again:
*/

const hider = new OBC.FragmentHider(components);

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

/* MD
  Next, we will create a simple object that we will use as the
  base for the floors filter. It will just be a JS object with
  the name of each storey as key and a boolean (true/false) as
  value:
*/

const storeys: Record<string, any> = {};
const storeyNames = Object.keys(classifier.list.storeys);
for (const name of storeyNames) {
  storeys[name] = true;
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
  Finally, we will set up a simple menu to control
  the visibility of storeys:
*/

BUI.Manager.init();

const panel = BUI.Component.create<BUI.PanelSection>(() => {
  return BUI.html`
    <bim-panel active label="Hider Tutorial" 
      style="position: fixed; top: 5px; right: 5px">
      
      <bim-panel-section fixed name="Floors" style="padding-top: 10px;">
      </bim-panel-section>
      
      <bim-panel-section fixed name="Categories" style="padding-top: 10px;">
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

for (const name in storeys) {
  const panel = BUI.Component.create<BUI.Checkbox>(() => {
    return BUI.html`
      <bim-checkbox checked label="${name}"
        @change="${({ target }: { target: BUI.Checkbox }) => {
          const found = classifier.find({ storeys: [name] });
          hider.set(target.value, found);
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
world.renderer.onBeforeUpdate.add(() => stats.begin());
world.renderer.onAfterUpdate.add(() => stats.end());
