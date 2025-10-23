/* MD
  ## 🔦 Making Items Pop
  ---
  

  ### 🖖 Importing our Libraries
  First things first, let's install all necessary dependencies to make this example work:
*/

import * as THREE from "three";
import Stats from "stats.js";
import * as OBC from "@thatopen/components";
import * as BUI from "@thatopen/ui";
// You have to import * as OBF from "@thatopen/components-front"
import * as OBF from "../..";

/* MD
  ### 🌎 Setting up a Simple Scene
  To get started, let's set up a basic ThreeJS scene. This will serve as the foundation for our application and allow us to visualize the 3D models effectively:
*/

const components = new OBC.Components();

const worlds = components.get(OBC.Worlds);
const world = worlds.create<
  OBC.SimpleScene,
  OBC.OrthoPerspectiveCamera,
  OBF.PostproductionRenderer
>();

world.scene = new OBC.SimpleScene(components);
world.scene.setup();
world.scene.three.background = null;

const container = document.getElementById("container")!;
world.renderer = new OBF.PostproductionRenderer(components, container);
world.camera = new OBC.OrthoPerspectiveCamera(components);
await world.camera.controls.setLookAt(68, 23, -8.5, 21.5, -5.5, 23);

components.init();

/* MD
  ### 🛠️ Setting Up Fragments
  Now, let's configure the FragmentsManager. This will allow us to load models effortlessly and start manipulating them with ease:
*/

const workerUrl =
  "https://thatopen.github.io/engine_fragment/resources/worker.mjs";
const fragments = components.get(OBC.FragmentsManager);
fragments.init(workerUrl);

world.camera.controls.addEventListener("rest", () =>
  fragments.core.update(true),
);

world.onCameraChanged.add((camera) => {
  for (const [, model] of fragments.list) {
    model.useCamera(camera.three);
  }
  fragments.core.update(true);
});

fragments.list.onItemSet.add(({ value: model }) => {
  model.useCamera(world.camera.three);
  world.scene.three.add(model.object);
  fragments.core.update(true);
});

/* MD
  ### 📂 Loading Fragments Models
  With the core setup complete, it's time to load a Fragments model into our scene. Fragments are optimized for fast loading and rendering, making them ideal for large-scale 3D models.

  :::info Where can I find Fragment files?

  You can use the sample Fragment files available in our repository for testing. If you have an IFC model you'd like to convert to Fragments, check out the IfcImporter tutorial for detailed instructions.

  :::
*/

const fragPaths = [
  "https://thatopen.github.io https://thatopen.github.io/engine_components/resources/frags/school_arq.frag",
];
await Promise.all(
  fragPaths.map(async (path) => {
    const modelId = path.split("/").pop()?.split(".").shift();
    if (!modelId) return null;
    const file = await fetch(path);
    const buffer = await file.arrayBuffer();
    return fragments.core.load(buffer, { modelId });
  }),
);

/* MD
  ### ✨ Using the Outliner Component
  With the foundational setup complete, let's begin working with the outliner. It's incredibly straightforward, and as always, the process starts by obtaining the component instance:
*/

const outliner = components.get(OBF.Outliner);

/* MD
  The outliner relies on a shader used in postproduction. In practice, this means you must use the Postproduction Renderer (as demonstrated in this example) and enable it. The setup is straightforward, and you can proceed as follows:
*/

const { postproduction } = world.renderer;
postproduction.enabled = true;

/* MD
  Once the postproduction is enabled, you can assign the same world used for postproduction to the outliner, configure it, and activate it:
*/

outliner.world = world;
outliner.color = new THREE.Color(0xbcf124);
outliner.fillColor = new THREE.Color("#9519c2");
outliner.fillOpacity = 0.5;
// As a best practice, enable it after it has been configured
outliner.enabled = true;

/* MD
  Now, the outliner is all about adding ModelIdMaps (That Open Engine's item selection representation) to it. Then, it just takes care of displaying them outlined based on the settings you have chosen. Let's take, for example, all elements matching a very simple query to then add them to the outliner:
*/

const addDoorItems = async () => {
  const finder = components.get(OBC.ItemsFinder);
  const doors = await finder.getItems([{ categories: [/DOOR/] }]);
  await outliner.addItems(doors);
};

/* MD
  :::note Need Help?

  If you're uncertain about the previous code snippet related to finding items, please refer to the ItemsFinder example in the documentation for additional guidance.

  :::

  A common approach to using the outliner is to combine it with the highlighter, allowing you to outline the selected elements. The setup can be implemented as follows:
*/

components.get(OBC.Raycasters).get(world);

const highlighter = components.get(OBF.Highlighter);
highlighter.setup({
  world,
  selectMaterialDefinition: null,
});

highlighter.events.select.onHighlight.add((modelIdMap) => {
  outliner.addItems(modelIdMap);
});

highlighter.events.select.onClear.add((modelIdMap) => {
  outliner.removeItems(modelIdMap);
});

/* MD
  :::note Highlighter?

  If you're unsure how to use the Highlighter, we recommend reviewing the corresponding tutorial in the documentation for detailed guidance.

  :::

  Finally, you can clear all outlines at any time. Let's create a helper function that can be executed from the UI later:
*/

const clearOutlines = () => {
  outliner.clean();
};

/* MD
  ### 🧩 Adding some UI (optional but recommended)
  We will use the `@thatopen/ui` library to add some simple and cool UI elements to our app. First, we need to call the `init` method of the `BUI.Manager` class to initialize the library:
*/

BUI.Manager.init();

/* MD
Now we will add some UI to play around with the actions in this tutorial. For more information about the UI library, you can check the specific documentation for it!
*/

const panel = BUI.Component.create<BUI.PanelSection>(() => {
  const onLineColorChange = ({ target }: { target: BUI.ColorInput }) => {
    outliner.color = new THREE.Color(target.color);
  };

  const onFillColorChange = ({ target }: { target: BUI.ColorInput }) => {
    outliner.fillColor = new THREE.Color(target.color);
  };

  const onOpacityChange = ({ target }: { target: BUI.NumberInput }) => {
    outliner.fillOpacity = target.value;
  };

  const onThicknessChange = ({ target }: { target: BUI.NumberInput }) => {
    outliner.thickness = target.value;
  };

  return BUI.html`
    <bim-panel active label="Outliner Tutorial" class="options-menu">
      <bim-panel-section label="General">
        <bim-button @click=${clearOutlines} label="Clear Outlines"></bim-button>
        <bim-color-input color="#${outliner.color.getHexString()}" label="Line Color" @input=${onLineColorChange}></bim-color-input>
        <bim-color-input color="#${outliner.fillColor.getHexString()}" label="Fill Color" @input=${onFillColorChange}></bim-color-input>
        <bim-number-input vertical value=${outliner.fillOpacity} min=0 max=1 step=0.01 slider label="Opacity" @change=${onOpacityChange}></bim-number-input>
        <bim-number-input vertical value=${outliner.thickness} min=1 max=5 step=0.1 slider label="Thickness" @change=${onThicknessChange}></bim-number-input>
      </bim-panel-section>
      <bim-panel-section label="Actions">
        <bim-button @click=${addDoorItems} label="Outline Items"></bim-button>
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
  ### ⏱️ Measuring the performance (optional)
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
  ### 🎉 Wrap up
  That's it! Now you're able to create a fully interactive 3D scene with outlines. Congratulations! Keep exploring more tutorials in the documentation to enhance your skills further.
*/
