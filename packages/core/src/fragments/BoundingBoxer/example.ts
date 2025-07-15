/* MD
  ## 📄 Playing with Boxes
  ---
  In this tutorial, you'll learn to easily create the bounding boxes of a Fragments Model. This can be useful for knowing the overall position and dimension of your models, which can be used, for instance, to make the camera fit a whole BIM model in the screen. Let's get started!

  :::tip Bounding boxes?

  Bounding boxes (AABB or Axis-Aligned Bounding Boxes) are the boxes aligned with the X, Y and Z axes of a 3D model that contain one or many objects. They are very common in 3D applications to make fast computations that require to know the whole dimension or position of one or many objects.

  :::

  ### 🖖 Importing our Libraries
  First things first, let's install all necessary dependencies to make this example work:
*/

import * as THREE from "three";
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
  ### ✨ Using The Bounding Boxer Component
  Now that our setup is done, lets see how you can create the bounding boxes of the model. BIM models are complex, but don't worry: creating the [bounding boxes](https://threejs.org/docs/?q=bound#api/en/math/Box3) is a piece of cake thanks to the `BoundingBoxer`. First, get an instance of the component:
*/

const boxer = components.get(OBC.BoundingBoxer);

/* MD
  Next, it's just a matter of adding items, entire models, or previously computed boxes to the component so the merged bounding boxes can be calculated. To keep it simple, let's create a function that retrieves the merged bounding box of all loaded models:
*/

const getLoadedModelsBoundings = () => {
  // As a good practice, always clean up the boxer list first
  // so no previous boxes added are taken into account
  boxer.list.clear();
  boxer.addFromModels();
  // This computes the merged box of the list.
  const box = boxer.get();
  // As a good practice, always clean up the boxer list after the calculation
  boxer.list.clear();
  return box;
};

/* MD
  While knowing the overall bounding box of the entire context is useful, it is often more practical to determine the bounding box of a specific collection of elements. For instance, this can be used to focus the camera on those elements for a close-up view. Let's dive in and create a function that, given a category, get the elements boundings in the architectural model.
*/

const getByCategory = async (category: string) => {
  const arqId = [...fragments.list.keys()].find((modelId) =>
    /arq/.test(modelId),
  );
  if (!arqId) return null;
  const model = fragments.list.get(arqId);
  if (!model) return null;
  const items = await model.getItemsOfCategories([new RegExp(`^${category}$`)]);
  const localIds = Object.values(items).flat();

  // As elements from categories are dispersed around the whole model
  // the camera fit based on the boundings will be very imperceptible.
  // For this reason, we will take the first element of the category
  // so its easier to see the result
  const effectiveIds = localIds.slice(0, 1);

  // An OBC.ModelIdMap represents selections within the engine.
  // Here, we are defining a selection for the architectural model
  // that includes all items belonging to the specified category.
  const modelIdMap: OBC.ModelIdMap = { [arqId]: new Set(effectiveIds) };
  boxer.list.clear();
  await boxer.addFromModelIdMap(modelIdMap);
  const box = boxer.get();
  boxer.list.clear();
  return box;
};

/* MD
  :::tip Adding from ModelIdMap

  Adding bounding boxes from a ModelIdMap (selections in That Open Engine) becomes very powerful when combined with other components, such as the ItemsFinder. Check out the tutorial for that component!

  :::

  ### 🛠️ Other Bounding Boxer Utilities
  Bounding boxes are incredibly versatile and, when used correctly, can be adapted to various workflows. One convenient use case is moving the camera to view the scene from specific angles, such as the bottom, top, left, right, front, or back of the entire viewer context. This operation is commonly combined with a view cube. The bounding boxer includes a built-in method that provides the necessary camera information to set the view perfectly. Here's how you can do it:
*/

const viewFromOrientation = async (
  orientation: "front" | "back" | "left" | "right" | "top" | "bottom",
) => {
  const camera = world.camera;
  if (!camera.hasCameraControls()) return;
  const { position, target } = await boxer.getCameraOrientation(orientation);
  await camera.controls.setLookAt(
    position.x,
    position.y,
    position.z,
    target.x,
    target.y,
    target.z,
    true,
  );
};

/* MD
  ### 📐 Bounding Helpers
  Visualizing the bounding box can often be very helpful. Fortunately, ThreeJS provides a convenient helper for this purpose. Let's create a function to generate a helper for a given bounding box:
*/

let helpers: THREE.Box3Helper[] = [];

const createBoxHelper = (box: THREE.Box3) => {
  const helper = new THREE.Box3Helper(box);
  world.scene.three.add(helper);
  helpers.push(helper);
};

const disposeHelpers = () => {
  const disposer = components.get(OBC.Disposer);
  for (const helper of helpers) {
    disposer.destroy(helper);
  }
  helpers = [];
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
  let categoriesDropdown: BUI.Dropdown | undefined;
  let orientationsDropdown: BUI.Dropdown | undefined;

  const onFitModels = ({ target }: { target: BUI.Button }) => {
    target.loading = true;
    const box = getLoadedModelsBoundings();
    const sphere = new THREE.Sphere();
    box.getBoundingSphere(sphere);
    world.camera.controls.fitToSphere(sphere, true);
    target.loading = false;
  };

  const onAddModelsHelper = () => {
    const box = getLoadedModelsBoundings();
    createBoxHelper(box);
  };

  const onAddCategoryHelper = async ({ target }: { target: BUI.Button }) => {
    if (!categoriesDropdown) return;
    target.loading = true;
    const [category] = categoriesDropdown.value;
    const box = await getByCategory(category);
    if (!box) {
      target.loading = false;
      return;
    }
    createBoxHelper(box);
    target.loading = false;
  };

  const onCategoriesDropdownCreated = async (e?: Element) => {
    if (!e) return;

    const arqId = [...fragments.list.keys()].find((modelId) =>
      /arq/.test(modelId),
    );
    if (!arqId) return;
    const model = fragments.list.get(arqId);
    if (!model) return;

    const dropdown = e as BUI.Dropdown;
    categoriesDropdown = dropdown;
    dropdown.innerHTML = "";

    const modelCategories = await model.getItemsWithGeometryCategories();
    for (const [index, category] of modelCategories.entries()) {
      const option = BUI.Component.create(
        () =>
          BUI.html`<bim-option ?checked=${index === 0} label=${category}></bim-option>`,
      );
      dropdown.append(option);
    }
  };

  const onFitCategoryItem = async ({ target }: { target: BUI.Button }) => {
    if (!categoriesDropdown) return;
    target.loading = true;
    const [category] = categoriesDropdown.value;
    const box = await getByCategory(category);
    if (!box) {
      target.loading = false;
      return;
    }
    const sphere = new THREE.Sphere();
    box.getBoundingSphere(sphere);
    world.camera.controls.fitToSphere(sphere, true);
    target.loading = false;
  };

  const onDisposeHelpers = () => {
    disposeHelpers();
  };

  const onOrientationsDropdownCreated = (e?: Element) => {
    if (!e) return;
    orientationsDropdown = e as BUI.Dropdown;
  };

  const onSetOrientation = async ({ target }: { target: BUI.Button }) => {
    if (!orientationsDropdown) return;
    target.loading = true;
    const [orientation] = orientationsDropdown.value;
    await viewFromOrientation(orientation);
    target.loading = false;
  };

  return BUI.html`
    <bim-panel active label="Bounding Boxer Tutorial" class="options-menu">
      <bim-panel-section label="General">
        <bim-label style="width: 15rem; white-space: normal;">Get rid of all helpers created, to prevent memory leaks.</bim-label>
        <bim-button label="Dispose Helpers" @click=${onDisposeHelpers}></bim-button>
      </bim-panel-section>
      <bim-panel-section label="By Models">
        <bim-button label="Fit Models" @click=${onFitModels}></bim-button>
        <bim-button label="Add Helper" @click=${onAddModelsHelper}></bim-button>
      </bim-panel-section>
      <bim-panel-section label="By Categories">
        <bim-label style="width: 15rem; white-space: normal;">As elements from categories are dispersed around the whole model, the camera fit will take the first element of the category so its easier to see the result.</bim-label>
        <bim-dropdown ${BUI.ref(onCategoriesDropdownCreated)} required></bim-dropdown>
        <bim-button label="Fit Category Item" @click=${onFitCategoryItem}></bim-button>
        <bim-button label="Add Helper" @click=${onAddCategoryHelper}></bim-button>
      </bim-panel-section>
      <bim-panel-section label="Orientation">
        <bim-label style="width: 15rem; white-space: normal;">Please, be aware there may be some discrepancies between Back, Front, Left and Right because of how the model was created in the authoring software.</bim-label>
        <bim-dropdown ${BUI.ref(onOrientationsDropdownCreated)} required>
          <bim-option label="Back" value="back"></bim-option>
          <bim-option label="Left" value="left"></bim-option>
          <bim-option label="Right" value="right"></bim-option>
          <bim-option label="Top" value="top"></bim-option>
          <bim-option label="Bottom" value="bottom"></bim-option>
        </bim-dropdown>
        <bim-button label="Set Camera Orientation" @click=${onSetOrientation}></bim-button>
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
  That's it! Now you're able to:

  - Compute and visualize bounding boxes for entire models or specific selections.
  - Use bounding boxes to adjust camera views dynamically.

  Congratulations! Keep going with more tutorials in the documentation.
*/
