/* MD
## 📄 Managing Items Visibility
---
Many times, we just want to look at a specific part of a BIM model, without seeing the rest of it. BIM models are complex, and finding what we are looking for is not always easy. Luckily, the components library has tools to make it easier!

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

/* MD
  ### 🛠️ Setting Up Fragments
  Now, let's configure the FragmentsManager. This will allow us to load models effortlessly and start manipulating them with ease:
*/

const githubUrl =
  "https://thatopen.github.io/engine_fragment/resources/worker.mjs";
const fetchedUrl = await fetch(githubUrl);
const workerBlob = await fetchedUrl.blob();
const workerFile = new File([workerBlob], "worker.mjs", {
  type: "text/javascript",
});
const workerUrl = URL.createObjectURL(workerFile);
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
  "https://thatopen.github.io/engine_components/resources/frags/school_arq.frag",
  "https://thatopen.github.io/engine_components/resources/frags/school_str.frag",
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
  ### ✨ Using The Hider Component
  The Hider component is very handy, as it is the main tool used for isolating, hiding, or performing any other operation related to item visibility. First of all, let's get the instance:
*/

const hider = components.get(OBC.Hider);

/* MD
  Starting with isolation, let's create a handy function that let's isolate items based on the category:
*/

const isolateByCategory = async (categories: string[]) => {
  // An OBC.ModelIdMap represents selections within the engine.
  // Here, we are defining a selection of the loaded model
  // that includes all items belonging to the specified category.
  const modelIdMap: OBC.ModelIdMap = {};

  const categoriesRegex = categories.map((cat) => new RegExp(`^${cat}$`));

  for (const [, model] of fragments.list) {
    const items = await model.getItemsOfCategories(categoriesRegex);
    const localIds = Object.values(items).flat();
    modelIdMap[model.modelId] = new Set(localIds);
  }
  await hider.isolate(modelIdMap);
};

/* MD
  :::note Multi-Model Compatibility

  You don't need to worry about making the Hider component work with multiple models, it handles this automatically (as do all other components) using the modelIdMap.

  :::

  As you can see, it's quite straightforward. Now, let's create another helper function to hide items instead of isolating them:
*/

const hideByCategory = async (categories: string[]) => {
  const modelIdMap: OBC.ModelIdMap = {};

  const categoriesRegex = categories.map((cat) => new RegExp(`^${cat}$`));

  for (const [, model] of fragments.list) {
    const items = await model.getItemsOfCategories(categoriesRegex);
    const localIds = Object.values(items).flat();
    modelIdMap[model.modelId] = new Set(localIds);
  }

  await hider.set(false, modelIdMap);
};

/* MD
  :::tip Working with ModelIdMaps

  Managing the visibility with ModelIdMaps (selections in That Open Engine) becomes very powerful when combined with other components, such as the ItemsFinder. Check out the tutorial for that component!

  :::

  Finally, you can easily reset the visibility of all items as follows:
*/

const resetVisibility = async () => {
  await hider.set(true);
};

/* MD
  ### 🧩 Adding some UI (optional but recommended)
  We will use the `@thatopen/ui` library to add some simple and cool UI elements to our app. First, we need to call the `init` method of the `BUI.Manager` class to initialize the library:
*/

BUI.Manager.init();

/* MD
Now we will add some UI to play around with the actions in this tutorial. For more information about the UI library, you can check the specific documentation for it!
*/

const categoriesDropdownTemplate = () => {
  const onCreated = async (e?: Element) => {
    if (!e) return;

    const dropdown = e as BUI.Dropdown;

    const modelCategories = new Set<string>();
    for (const [, model] of fragments.list) {
      const categories = await model.getItemsWithGeometryCategories();
      for (const category of categories) {
        if (!category) continue;
        modelCategories.add(category);
      }
    }

    for (const category of modelCategories) {
      const option = BUI.Component.create(
        () => BUI.html`<bim-option label=${category}></bim-option>`,
      );
      dropdown.append(option);
    }
  };

  return BUI.html`
    <bim-dropdown multiple ${BUI.ref(onCreated)}></bim-dropdown>
  `;
};

const panel = BUI.Component.create<BUI.PanelSection>(() => {
  const categoriesDropdownA = BUI.Component.create<BUI.Dropdown>(
    categoriesDropdownTemplate,
  );

  const categoriesDropdownB = BUI.Component.create<BUI.Dropdown>(
    categoriesDropdownTemplate,
  );

  const onIsolateCategory = async ({ target }: { target: BUI.Button }) => {
    if (!categoriesDropdownA) return;
    const categories = categoriesDropdownA.value;
    if (categories.length === 0) return;
    target.loading = true;
    await isolateByCategory(categories);
    target.loading = false;
  };

  const onHideCategory = async ({ target }: { target: BUI.Button }) => {
    if (!categoriesDropdownB) return;
    const categories = categoriesDropdownB.value;
    if (categories.length === 0) return;
    target.loading = true;
    await hideByCategory(categories);
    target.loading = false;
  };

  const onResetVisibility = async ({ target }: { target: BUI.Button }) => {
    target.loading = true;
    await resetVisibility();
    target.loading = false;
  };

  return BUI.html`
    <bim-panel active label="Hider Tutorial" class="options-menu">
      <bim-panel-section style="width: 14rem" label="General">
        <bim-button label="Reset Visibility" @click=${onResetVisibility}></bim-button>
      </bim-panel-section>
      <bim-panel-section label="Isolation">
        ${categoriesDropdownA}
        <bim-button label="Isolate Category" @click=${onIsolateCategory}></bim-button>
      </bim-panel-section>
      <bim-panel-section label="Hiding">
        ${categoriesDropdownB}
        <bim-button label="Hide Category" @click=${onHideCategory}></bim-button>
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
  That's it! Now you're able to manage item visibility in BIM models using the Hider component. You learned how to use the Hider component to isolate, hide, and reset visibility of items. Congratulations! Keep going with more tutorials in the documentation.
*/
