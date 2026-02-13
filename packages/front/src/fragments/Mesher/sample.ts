/* MD
  ## Generating Meshes from Fragments ⚙️
  ---
  The Fragments Models from That Open Engine removes the ThreeJS geometry buffer data in order to save as much memory as possible. While this is perfect in most cases, there are certain situations where you need to access this information. In this tutorial you will learn how to use the Mesher component to create single ThreeJS meshes of your model items. Let's go ahead!
  
  ### 🖖 Importing our Libraries
  First things first, let's install all necessary dependencies to make this example work:
*/

import * as THREE from "three";
import * as OBC from "@thatopen/components";
import * as BUI from "@thatopen/ui";
import Stats from "stats.js";
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
  OBC.SimpleCamera,
  OBC.SimpleRenderer
>();

world.scene = new OBC.SimpleScene(components);
world.scene.setup();
world.scene.three.background = null;

const container = document.getElementById("container")!;
world.renderer = new OBC.SimpleRenderer(components, container);

world.camera = new OBC.SimpleCamera(components);
world.camera.controls.setLookAt(183, 11, -102, 27, -52, -11); // convenient position for the model we will load

components.init();

/* MD
  ### 🛠️ Setting Up Fragments
  Now, let's configure the Fragments Manager. This will allow us to load models effortlessly and start manipulating them with ease:
*/

// You have to copy `/node_modules/@thatopen/fragments/dist/Worker/worker.mjs` to your project directory
// and provide the relative path in `workerUrl`
// We use here the internal route of the worker in the library for simplicity purposes
const workerUrl =
  "/node_modules/@thatopen/fragments/dist/Worker/worker.mjs";
const fragments = components.get(OBC.FragmentsManager);
fragments.init(workerUrl);
world.camera.controls.addEventListener("rest", () =>
  fragments.core.update(true),
);

// Once a model is available in the list, we can tell what camera to use
// in order to perform the culling and LOD operations.
// Also, we add the model to the 3D scene.
fragments.list.onItemSet.add(({ value: model }) => {
  model.useCamera(world.camera.three);
  world.scene.three.add(model.object);
  // At the end, you tell fragments to update so the model can be seen given
  // the initial camera position
  fragments.core.update(true);
});

/* MD
  ### 📂 Loading a Fragments Model
  With the core setup complete, it's time to load a Fragments model into our scene. Fragments are optimized for fast loading and rendering, making them ideal for large-scale 3D models.

  :::info Where can I find Fragment files?

  You can use the sample Fragment files available in our repository for testing. If you have an IFC model you'd like to convert to Fragments, check out the IfcImporter tutorial for detailed instructions.

  :::
*/

const file = await fetch("https://thatopen.github.io/engine_components/resources/frags/school_arq.frag");
const buffer = await file.arrayBuffer();
await fragments.core.load(buffer, { modelId: "example" });

/* MD
  ### 👆 Setting Up Element Selection
  To enable element selection and information querying in this example, let's configure a straightforward highlighter:
*/

const casters = components.get(OBC.Raycasters);
casters.get(world);

const highlighter = components.get(OBF.Highlighter);
highlighter.setup({ world });

/* MD
  ### 🗒️ Creating Meshes
*/

const mesher = components.get(OBF.Mesher);
const createdMeshes: THREE.Mesh[] = [];
const material = new THREE.MeshLambertMaterial({ color: "purple" });
const createFromSelection = async () => {
  const { select } = highlighter.selection;
  if (Object.keys(select).length === 0) return null;
  const start = performance.now();
  const meshes = await mesher.get(select, { material });
  createdMeshes.push(...mesher.getMeshesFromResult(meshes));
  const end = performance.now();
  const duration = (end - start) / 1000;
  console.log(`Meshing time: ${duration}s`);
  const hider = components.get(OBC.Hider);
  await hider.set(false);
  return meshes;
};

const deleteGeometriesPool = () => {
  let count = 0;
  for (const [_, data] of mesher.geometries.entries()) {
    for (const [_, geometriesList] of data.entries()) {
      count += geometriesList.length;
    }
  }
  mesher.remove();
  return count;
};

/* MD
  ### 🧩 Adding User Interface (optional)
  We will use the `@thatopen/ui` library to add some simple and cool UI elements to our app. First, we need to call the `init` method of the `BUI.Manager` class to initialize the library:
*/

BUI.Manager.init();

/* MD
Now we will add some UI to handle the logic of this tutorial. For more information about the UI library, you can check the specific documentation for it!
*/

const panel = BUI.Component.create<BUI.PanelSection>(() => {
  const onCreateFromSelection = async ({ target }: { target: BUI.Button }) => {
    target.loading = true;
    const result = await createFromSelection();
    if (!result) return;
    const allMeshes: THREE.Mesh[] = [];
    const boundingSphere = new THREE.Sphere();
    for (const [_, data] of result.entries()) {
      for (const [_, meshes] of data.entries()) {
        for (const mesh of meshes) {
          mesh.geometry.computeBoundingSphere();
          const sphere = mesh.geometry.boundingSphere;
          if (sphere) {
            sphere.applyMatrix4(mesh.matrix);
            boundingSphere.union(sphere);
          }
          allMeshes.push(mesh);
        }
      }
    }
    world.scene.three.add(...allMeshes);
    boundingSphere.radius *= 0.75;
    world.camera.controls.fitToSphere(boundingSphere, true);
    console.log(allMeshes, boundingSphere);
    target.loading = false;
  };

  const onRemovePool = () => {
    const count = deleteGeometriesPool();
    console.log(`${count} geometries deleted from the pool.`);
  };

  const onReset = async ({ target }: { target: BUI.Button }) => {
    target.loading = true;
    for (const mesh of createdMeshes) {
      mesh.removeFromParent();
    }
    const hider = components.get(OBC.Hider);
    await hider.set(true);
    target.loading = false;
  };

  return BUI.html`
    <bim-panel id="controls-panel" active label="Model Information" class="options-menu">
      <bim-panel-section fixed label="Info">
        <bim-label style="white-space: normal;">💡 To better experience this tutorial, open your browser console to see the data logs.</bim-label>
      </bim-panel-section>
      <bim-panel-section fixed label="Controls">
        <bim-button label="Create From Selection" @click="${onCreateFromSelection}"></bim-button> 
        <bim-button label="Remove Pool" @click="${onRemovePool}"></bim-button> 
        <bim-button label="Reset Scene" @click="${onReset}"></bim-button> 
      </bim-panel-section>
    </bim-panel>
  `;
});

document.body.append(panel);

/* MD
  And we will make some logic that adds a button to the screen when the user is visiting our app from their phone, allowing to show or hide the menu. Otherwise, the menu would make the app unusable.
*/

const button = BUI.Component.create<BUI.PanelSection>(() => {
  const onClick = () => {
    if (panel.classList.contains("options-menu-visible")) {
      panel.classList.remove("options-menu-visible");
    } else {
      panel.classList.add("options-menu-visible");
    }
  };

  return BUI.html`
    <bim-button class="phone-menu-toggler" icon="solar:settings-bold"
      @click=${onClick}>
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
  ### 🎉 Congratulations!
  You've successfully mastered the art of retrieving information from your FragmentsModel! 🚀
  
  With this knowledge, you're now equipped to explore, manipulate, and extract valuable insights from your BIM models. Keep experimenting and building amazing applications! 💡
*/
