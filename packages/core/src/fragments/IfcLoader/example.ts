/* MD
  ## 📄 Loading IFC Models
  ---
  IFC is the most common format to share BIM data openly. Our libraries are able to load, navigate and even create and edit them directly. In this tutorial, you'll learn how to open an IFC model in the 3D scene.

  :::tip IFC?

  If you are not famliar with the construction industry, this might be the first time you come across this term. It stands for Industry Foundation Classes, and it's the most widespread standard for sharing BIM data freely, without depending on specific software manufacturers and their propietary formats.

  :::

  ### 🖖 Importing our Libraries
  First things first, let's install all necessary dependencies to make this example work:
*/

import Stats from "stats.js";
import * as BUI from "@thatopen/ui";
// You have to import * as OBC from "@thatopen/components"
import * as OBC from "../..";

/* MD
  ### 🌎 Setting up a Simple Scene
  To get started, let's set up a basic ThreeJS scene. This will serve as the foundation for our application and allow us to visualize the 3D models effectively:
*/

const components = new OBC.Components();

const worlds = components.get(OBC.Worlds);
const world = worlds.create<
  OBC.SimpleScene,
  OBC.OrthoPerspectiveCamera,
  OBC.SimpleRenderer
>();

world.scene = new OBC.SimpleScene(components);
world.scene.setup();
world.scene.three.background = null;

const container = document.getElementById("container")!;
world.renderer = new OBC.SimpleRenderer(components, container);
world.camera = new OBC.OrthoPerspectiveCamera(components);
await world.camera.controls.setLookAt(78, 20, -2.2, 26, -4, 25);

components.init();

components.get(OBC.Grids).create(world);

/* MD
  ### ✨ Using The IfcLoader Component
  With the basic world already set up, it's now time to bring it to life by loading some IFC files. That Open Engine does not directly load IFC files. When an IFC file is "loaded", the engine first converts it into something called Fragments and then loads it into the scene. The model you see is the result of this process.

  :::info Fragments?

  Fragments are That Open Company's open-source binary format for storing BIM models. They are built on top of Flatbuffers from Google, making them lightweight and highly efficient for storing vast amounts of BIM data.

  :::

  All That Open Engine works on top of Fragments, and that's why the conversion process must take place. So, let's start by getting the component instance:
*/

const ifcLoader = components.get(OBC.IfcLoader);

/* MD
  With the loader in place, it needs to be properly configured. This involves setting up web-ifc (the core library responsible for reading IFC files) to ensure it is ready to convert IFC files into Fragments:
*/

await ifcLoader.setup({
  autoSetWasm: false,
  wasm: {
    path: "https://unpkg.com/web-ifc@0.0.72/",
    absolute: true,
  },
});

/* MD
  When an IFC file is converted to Fragments, another component handles the converted file: the FragmentsManager. Therefore, it is essential to configure this component first before attempting to "load" any IFC file:
*/

const workerUrl =
  "https://thatopen.github.io/engine_fragment/resources/worker.mjs";
const fragments = components.get(OBC.FragmentsManager);
fragments.init(workerUrl);

world.camera.controls.addEventListener("rest", () =>
  fragments.core.update(true),
);

// Ensures that once the Fragments model is loaded
// (converted from the IFC in this case),
// it utilizes the world camera for updates
// and is added to the scene.
fragments.list.onItemSet.add(({ value: model }) => {
  model.useCamera(world.camera.three);
  world.scene.three.add(model.object);
  fragments.core.update(true);
});

/* MD
  :::info Need more details?

  For additional information about the FragmentsManager, refer to the corresponding component tutorial available in the documentation.

  :::

  Great! With everything configured, let's proceed to create a function that will load an IFC model into the viewer:
*/

const loadIfc = async (path: string) => {
  const file = await fetch(path);
  const data = await file.arrayBuffer();
  const buffer = new Uint8Array(data);
  await ifcLoader.load(buffer, false, "example", {
    processData: {
      progressCallback: (progress) => console.log(progress),
    },
  });
};

/* MD
  :::info Personalized Conversion

  The IfcLoader component provides a quick and convenient way to convert IFC files into Fragments and load them into the engine. However, for greater control over the conversion process, it is recommended to use the Fragments library directly. The conversion mechanism is the same, but the core library offers a less abstracted approach.

  :::

  Once the file is loaded, you can leverage any of the engine's components to interact with it. Each component is a specialized tool designed for specific tasks with Fragment Models. There are components for measurements, model classification, visibility operations, plan generation, and much more. Check out the full documentation to learn more!

  ### 🎁 Exporting the Fragments Model
  The primary goal of this process is to load the Fragments Model instead of the IFC file. This approach is more efficient because the time-consuming part is the conversion process, not the actual loading of the model into the scene. So, how can you obtain the Fragments Model resulting from the conversion? It's simple! Here's how:
*/

const downloadFragments = async () => {
  // fragments.list holds all the fragments loaded
  const [model] = fragments.list.values();
  if (!model) return;
  const fragsBuffer = await model.getBuffer(false);
  const file = new File([fragsBuffer], "school_str.frag");
  const link = document.createElement("a");
  link.href = URL.createObjectURL(file);
  link.download = file.name;
  link.click();
  URL.revokeObjectURL(link.href);
};

/* MD
  Now that you can download the Fragments Model, what's next? You should continue loading this file instead of the original IFC file. To learn how to consistently load Fragments Models instead of the original IFC file, refer to the FragmentsManager tutorial.

  ### 🧩 Adding some UI (optional but recommended)
  We will use the `@thatopen/ui` library to add some simple and cool UI elements to our app. First, we need to call the `init` method of the `BUI.Manager` class to initialize the library:
*/

BUI.Manager.init();

/* MD
Now we will add some UI to play around with the actions in this tutorial. For more information about the UI library, you can check the specific documentation for it!
*/

const [panel, updatePanel] = BUI.Component.create<BUI.PanelSection, {}>((_) => {
  let downloadBtn: BUI.TemplateResult | undefined;
  if (fragments.list.size > 0) {
    downloadBtn = BUI.html`
      <bim-button label="Download Fragments" @click=${downloadFragments}></bim-button>
    `;
  }

  let loadBtn: BUI.TemplateResult | undefined;
  if (fragments.list.size === 0) {
    const onLoadIfc = async ({ target }: { target: BUI.Button }) => {
      target.label = "Conversion in progress...";
      target.loading = true;
      await loadIfc("https://thatopen.github.io/engine_components/resources/ifc/school_str.ifc");
      target.loading = false;
      target.label = "Load IFC";
    };

    loadBtn = BUI.html`
      <bim-button label="Load IFC" @click=${onLoadIfc}></bim-button>
      <bim-label>Open the console to see the progress!</bim-label>
    `;
  }

  return BUI.html`
    <bim-panel active label="IfcLoader Tutorial" class="options-menu">
      <bim-panel-section label="Controls">
        ${loadBtn}
        ${downloadBtn}
      </bim-panel-section>
    </bim-panel>
  `;
}, {});

document.body.append(panel);
fragments.list.onItemSet.add(() => updatePanel());

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
  That's it! Now you're able to load IFC models, convert them to Fragments, and interact with them in a 3D scene. Congratulations! Keep going with more tutorials in the documentation.
*/
