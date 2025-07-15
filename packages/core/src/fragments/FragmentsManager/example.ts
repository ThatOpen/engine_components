/* MD
  ## 📄 Managing Fragments Models
  ---
  In this tutorial, you'll learn how to load your BIM models in Fragment format. Fragment is an [open source geometry system](https://github.com/ThatOpen/engine_fragment/) that we created on top of [Three.js](https://threejs.org/) to display BIM models fast, while keeping control over the individual items of the model. The idea is simple: a BIM model is a FragmentsGroup, which is (like the name implies) a collection of fragments. A fragment is a set of identical geometries instantiated around the scene.

  :::tip How do I get a BIM model in Fragment format?

  The IfcLoader component does exactly that! It converts IFC models to Fragments. Check out that tutorial if you are starting out with IFC files. Of course, you can just use the IfcLoader in your app, but loading fragments is more than x10 faster than loading IFC files. Our recommendation is to convert your IFC files to fragments just once, store the fragment somewhere (frontent of backend) and then load the fragments instead of teh IFC models directly.

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
  ### ✨ Utilizing the FragmentsManager Component
  Great! With the base viewer setup complete, let's dive into using the FragmentsManager component. This component serves as a convenient wrapper around the core FragmentsModels class from the `@thatopen/fragments` library. One of the key advantages of using Fragments in That Open Engine is its worker-based architecture, which offloads most operations (data retrieval, visibility management, color adjustments, etc.) to a separate thread. This ensures that the app remains responsive during processing. To get started, the first step is to specify the URL of the Fragments worker:
*/

// One option, if you prefer not to rely on an external worker file,
// is to copy the worker file into your project's public directory.
// This ensures the worker file is bundled with your app during the build process,
// and you can provide the corresponding path to it.
const githubUrl =
  "https://thatopen.github.io/engine_fragment/resources/worker.mjs";
const fetchedUrl = await fetch(githubUrl);
const workerBlob = await fetchedUrl.blob();
const workerFile = new File([workerBlob], "worker.mjs", {
  type: "text/javascript",
});
const workerUrl = URL.createObjectURL(workerFile);

/* MD
  Once initialization is complete, you can safely retrieve the component instance and proceed with its setup:
*/

const fragments = components.get(OBC.FragmentsManager);
fragments.init(workerUrl);

/* MD
  :::tip Manager Initialization

  The initialization should only be performed once for the entire application instance.

  :::

  Since the manager has already been initialized, we can proceed with its configuration. Fragments utilize culling and LOD (Level of Detail in 3D graphics, not LOD from BIM) to optimize geometry rendering by offloading parts that are not visible to the user. A common approach is to apply culling and LOD based on camera movements. By leveraging the world's camera controls, we can detect when the camera is about to stop moving (rest) and instruct the manager to update the visual state of all models accordingly:
*/

world.camera.controls.addEventListener("rest", () =>
  fragments.core.update(true),
);

/* MD
  ### 🗂️ Fragments List
  When a model is loaded, it is added to memory and the manager's list. This list serves as a centralized place to manage all loaded fragments. Use it to detect when models are added or removed. Usually, that is used to tell the loaded model which camera to use for culling and LOD updates, and add it to the ThreeJS scene:
*/

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

const loadFragments = async () => {
  // you can provide as many files as you need
  const fragPaths = [
    "https://thatopen.github.io/engine_components/resources/frags/school_arq.frag",
    "https://thatopen.github.io/engine_components/resources/frags/school_str.frag",
  ];

  // Promise.all loads models concurrently for faster execution.
  await Promise.all(
    fragPaths.map(async (path) => {
      const modelId = path.split("/").pop()?.split(".").shift();
      if (!modelId) return null;
      const file = await fetch(path);
      const buffer = await file.arrayBuffer();
      // this is the main function to load the fragments
      return fragments.core.load(buffer, { modelId });
    }),
  );
};

/* MD
  ### 🎁 Exporting the Fragments Model
  At any point, you can download the models that have been loaded (although it may be unnecessary since you already have the original files used to load them). Exporting the models is straightforward and can be done as follows:
*/

const downloadFragments = async () => {
  for (const [, model] of fragments.list) {
    const fragsBuffer = await model.getBuffer(false);
    const file = new File([fragsBuffer], `${model.modelId}.frag`);
    const link = document.createElement("a");
    link.href = URL.createObjectURL(file);
    link.download = file.name;
    link.click();
    URL.revokeObjectURL(link.href);
  }
};

/* MD
  ### 🗑️ Deleting Models
  You can delete loaded models at any time to free up memory when they are no longer needed. Once a model is deleted, it is removed from memory and the fragments list. Deleting models is simple and can be done as follows:
*/

const deleteArchModel = () => {
  const modelIds = [...fragments.list.keys()];
  const modelId = modelIds.find((key) => /arq/.test(key));
  if (!modelId) return;
  fragments.core.disposeModel(modelId);
};

const deleteAllModels = () => {
  for (const [modelId] of fragments.list) {
    fragments.core.disposeModel(modelId);
  }
};

/* MD
  ### 🧩 Adding some UI (optional but recommended)
  We will use the `@thatopen/ui` library to add some simple and cool UI elements to our app. First, we need to call the `init` method of the `BUI.Manager` class to initialize the library:
*/

BUI.Manager.init();

/* MD
Now we will add some UI to play around with the actions in this tutorial. For more information about the UI library, you can check the specific documentation for it!
*/

const [panel, updatePanel] = BUI.Component.create<BUI.PanelSection, {}>((_) => {
  const onLoadFragments = async ({ target }: { target: BUI.Button }) => {
    target.loading = true;
    await loadFragments();
    target.loading = false;
  };

  let loadFragmentsBtn: BUI.TemplateResult | undefined;
  if (fragments.list.size === 0) {
    loadFragmentsBtn = BUI.html`
      <bim-button label="Load fragments" @click=${onLoadFragments}></bim-button>
    `;
  }

  let disposeArchModelBtn: BUI.TemplateResult | undefined;
  if ([...fragments.list.keys()].some((key) => /arq/.test(key))) {
    disposeArchModelBtn = BUI.html`
      <bim-button label="Dispose Arch Model" @click=${deleteArchModel}></bim-button>
      `;
  }

  let downloadFragmentsBtn: BUI.TemplateResult | undefined;
  let disposeModelsBtn: BUI.TemplateResult | undefined;
  if (fragments.list.size > 0) {
    disposeModelsBtn = BUI.html`
      <bim-button label="Dispose All Models" @click=${deleteAllModels}></bim-button>
    `;

    downloadFragmentsBtn = BUI.html`
      <bim-button label="Export fragments" @click=${downloadFragments}></bim-button>
    `;
  }

  return BUI.html`
    <bim-panel active label="FragmentsManager Tutorial" class="options-menu">
      <bim-panel-section label="Controls">
        ${loadFragmentsBtn}
        ${disposeArchModelBtn}
        ${disposeModelsBtn}
        ${downloadFragmentsBtn}
      </bim-panel-section>
    </bim-panel>
  `;
}, {});

const updateFunction = () => updatePanel();
fragments.list.onItemSet.add(updateFunction);
fragments.list.onItemDeleted.add(updateFunction);

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
  That's it! Now you're able to load, manage, and interact with Fragments models in your application. Congratulations! Keep going with more tutorials in the documentation.
*/
