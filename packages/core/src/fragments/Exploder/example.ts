/* MD
### 🧨 Exploding BIM models
---

Sometimes we want to explode our BIM model by level, allowing us to see what's inside like if it was a toy. In this tutorial, we'll learn to do it.

:::tip Exploding, like bombs?

Nope! Exploding means offsetting the items of each floor a fixed distance. The effect makes the model look like it's "opened up", like a doll house. This effect is very interesting to have a bird view of both the inside and the outside of a BIM model.

:::

In this tutorial, we will import:

- `web-ifc` to get some IFC items.
- `@thatopen/ui` to add some simple and cool UI menus.
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
  ### 🧳 Loading a BIM model
  ---

 We'll start by adding a BIM model to our scene. That model is already converted to fragments, so it will load much faster than if we loaded the IFC file.

  :::tip Fragments?

    If you are not familiar with fragments, check out the IfcLoader tutorial!

  :::
*/

const fragments = new OBC.FragmentsManager(components);
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

/* MD
  ### 🤝 Setting up the relations
  ---

  We will need to set up the IFC relations in order to use the exploder effectively. You can check the relations indexer tutorial for more details about this!
*/

const indexer = components.get(OBC.IfcRelationsIndexer);
const relationsFile = await fetch(
  "https://thatopen.github.io/engine_components/resources/small-relations.json",
);
const relations = indexer.getRelationsMapFromJSON(await relationsFile.text());
indexer.setRelationMap(model, relations);

/* MD
  ### 🤯 Boom!
  ---

Exploding BIM models is very simple with components. The Exploder component does all the heavy lifting for us! We can get it using the get method of the components instance we are using in this app.
*/

const exploder = components.get(OBC.Exploder);

/* MD
Before being able to use it, we will need to get the classifier to classify the items of the model by storey.

  :::tip Classify?

    If you are not familiar with the classifier, check out its specific tutorial!

  :::
*/

const classifier = components.get(OBC.Classifier);
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
Now we will add some UI to explode and restore our BIM model, which can be easily done with a checkbox that determines whether a model is exploded or not. For more information about the UI library, you can check the specific documentation for it!
*/

const panel = BUI.Component.create<BUI.PanelSection>(() => {
  return BUI.html`
    <bim-panel active label="Exploder Tutorial" class="options-menu">
      <bim-panel-section collapsed label="Controls">
        <bim-checkbox 
          label="Explode model" 
          @change="${({ target }: { target: BUI.Checkbox }) => {
            exploder.set(target.value);
          }}">  
        </bim-checkbox>  

      </bim-panel-section>
    </bim-panel>
    `;
});

document.body.append(panel);

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

  That's it! You have created an app that can explode and restore a BIM model, allowing to have an overview of both the inside and the outside of a BIM model!
*/
