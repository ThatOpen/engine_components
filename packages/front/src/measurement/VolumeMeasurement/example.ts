/* MD
### 📐 Measuring volumes
---

Space control is one of the most important elements of BIM applications. In this tutorial, you'll learn how to expose an volume measurement tool to your end users.

We will import:

- `@thatopen/components` to set up the barebone of our app.
- `@thatopen/components-front` to use some frontend-oriented components.
- `Stats.js` (optional) to measure the performance of our app.
*/

import Stats from "stats.js";
import * as OBC from "@thatopen/components";
import * as BUI from "@thatopen/ui";
import * as OBCF from "@thatopen/components-front";

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
  OBCF.PostproductionRenderer
>();

world.scene = new OBC.SimpleScene(components);
world.renderer = new OBCF.PostproductionRenderer(components, container);
world.camera = new OBC.SimpleCamera(components);

components.init();

world.camera.controls.setLookAt(5, 5, 5, 0, 0, 0);

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

/* MD 
  ### 🛠️ Getting the volume measurements
  ---
  
  First, let's get an instance of the volume measurement component and initialize it. 
*/

const dimensions = components.get(OBCF.VolumeMeasurement);
dimensions.world = world;
dimensions.enabled = true;

/* MD 
  ### 🔦 Getting the highlighter
  ---
  
  Now, let's get an instance of the highlighter component and initialize it to be able to highlight the computed volume.

  :::tip Highlighter?

    If you are not familiar with the highlighter component, check out the highlighter tutorial!

  :::
*/

const highlighter = components.get(OBCF.Highlighter);
highlighter.setup({ world });

/* MD 
  Now we'll simply take the computed volume and log it in the console. Also, when the highlighter is cleared, we'll also clear the volume dimension.
*/

highlighter.events.select.onHighlight.add((event) => {
  const volume = dimensions.getVolumeFromFragments(event);
  console.log(volume);
});

highlighter.events.select.onClear.add(() => {
  dimensions.clear();
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
Now we will add some UI to have some control over the dimensions we create. For more information about the UI library, you can check the specific documentation for it!
*/

const panel = BUI.Component.create<BUI.PanelSection>(() => {
  return BUI.html`
  <bim-panel active label="Volume Measurement Tutorial" class="options-menu">
      <bim-panel-section collapsed label="Controls">
          <bim-label>Create dimension: Left click</bim-label>  
          <bim-label>Delete dimension: Left click el</bim-label>  
      </bim-panel-section>
      
      <bim-panel-section collapsed label="Others"> 
        
        <bim-button label="Delete all"
          @click="${() => {
            dimensions.clear();
            highlighter.clear();
          }}">
        </bim-button>

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

  That's it! You have created an app that can create and delete volume dimensions on any 3D object. Congratulations!
*/
