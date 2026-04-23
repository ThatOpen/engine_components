/* MD
  ## 📄 Hovering Items
  ---
  Without dedicated hover feedback, users can't tell what they're about to click — especially in dense BIM models where elements overlap. Wiring mousemove raycasting and animated material overlays manually is boilerplate that every app would have to repeat.

  The Hoverer tracks the cursor automatically and applies an animated color overlay to whichever element is under the pointer, with no per-frame wiring required.

  This tutorial covers enabling the Hoverer on a world, assigning a material with color, transparency, and opacity (which drives the animation peak), and changing the hover color at runtime from a UI control.

  By the end, you'll have an animated hover highlight that follows the cursor across any loaded BIM model with a single component setup.

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

// `FragmentsManager.getWorker()` fetches the matching worker for this library version from unpkg and returns a blob URL.
// You can also pass your own URL to `fragments.init(...)` if you'd rather host the worker yourself.
const workerUrl = await OBC.FragmentsManager.getWorker();
const fragments = components.get(OBC.FragmentsManager);
fragments.init(workerUrl);

world.camera.controls.addEventListener("update", () => fragments.core.update());

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

// Remove z fighting
fragments.core.models.materials.list.onItemSet.add(({ value: material }) => {
  if (!("isLodMaterial" in material && material.isLodMaterial)) {
    material.polygonOffset = true;
    material.polygonOffsetUnits = 1;
    material.polygonOffsetFactor = Math.random();
  }
});

/* MD
  ### 📂 Loading Fragments Models
  With the core setup complete, it's time to load a Fragments model into our scene. Fragments are optimized for fast loading and rendering, making them ideal for large-scale 3D models.

  :::info Where can I find Fragment files?

  You can use the sample Fragment files available in our repository for testing. If you have an IFC model you'd like to convert to Fragments, check out the IfcImporter tutorial for detailed instructions.

  :::
*/

const fragPaths = ["https://thatopen.github.io/engine_components/resources/frags/school_arq.frag"];
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
  ### ✨ Using The Hoverer Component
  Using the component is extremely simple. The only thing you need to do is get the instance and configure it:
*/

const hoverer = components.get(OBF.Hoverer);
hoverer.world = world;
hoverer.enabled = true;
hoverer.material = new THREE.MeshBasicMaterial({
  color: 0x6528d7,
  transparent: true, // transparent must be true to allow the animation
  opacity: 0.5, // this will act as the maximum possible opacity when animating
  depthTest: false, // recommended to avoid z-fighting
});

/* MD
  ### 🎯 Combining hover with other transparent highlights
  When you combine the Hoverer with other Highlighter styles that are also transparent (for example a "status" overlay mixed with ghost mode), the hover highlight can look inconsistent at some camera angles: sometimes the hover color shows through a ghost element, other times the underlying status color does. That's three.js's transparent sort resolving ties differently per angle.

  The canonical fix is to tag each custom highlight style with a `customId` and tweak the material's depth settings when fragments creates it. Because fragments materials fire `materials.list.onItemSet` with the tag already in `material.userData.customId`, one hook can normalize all user-added highlight styles at once. First pick a stable id for the style:
*/

const STATUS_STYLE = "status";

/* MD
  Then react in the same material hook we used earlier for the random polygon offset. Keep depth-testing on so the overlay follows real 3D occlusion, but turn `depthWrite` off so it doesn't step on the Hoverer's `depthTest:false` draw at coplanar pixels:
*/

fragments.core.models.materials.list.onItemSet.add(({ value: material }) => {
  if (material.userData?.customId === STATUS_STYLE) {
    material.depthWrite = false;
    material.needsUpdate = true;
  }
});

/* MD
  Finally, register the style with the matching `customId` so the tag lands in the material's userData when fragments instantiates it:
*/

const highlighter = components.get(OBF.Highlighter);
highlighter.setup({ world });
highlighter.styles.set(STATUS_STYLE, {
  color: new THREE.Color(0xffaa00),
  opacity: 0.3,
  transparent: true,
  renderedFaces: 0,
});

/* MD
  This is the same pattern used in the Outliner / SimpleOutlinePass and in the IFCSPACE color workaround; whenever a fragments highlight needs material properties that `MaterialDefinition` does not expose directly, the `materials.list.onItemSet` hook is where you apply them.

  To verify it end to end, let's wire a double-click that applies the status style to the picked element. Hover over that element afterwards and the hover highlight should stay consistent no matter how you orbit the camera, instead of flipping to the status color at some angles.
*/

components.get(OBC.Raycasters).get(world);

window.addEventListener("dblclick", async (event) => {
  const [firstModel] = fragments.list.values();
  if (!firstModel) return;

  const mouse = new THREE.Vector2(event.clientX, event.clientY);
  const result = await firstModel.raycast({
    camera: world.camera.three,
    mouse,
    dom: world.renderer!.three.domElement,
  });
  if (!result || result.localId === undefined) return;

  await highlighter.highlightByID(
    STATUS_STYLE,
    { [firstModel.modelId]: new Set([result.localId]) },
    false,
  );
});

/* MD
  ### 🧩 Adding some UI (optional but recommended)
  We will use the `@thatopen/ui` library to add some simple and cool UI elements to our app. First, we need to call the `init` method of the `BUI.Manager` class to initialize the library:
*/

BUI.Manager.init();

/* MD
Now we will add some UI to play around with the actions in this tutorial. For more information about the UI library, you can check the specific documentation for it!
*/

const panel = BUI.Component.create<BUI.PanelSection>(() => {
  const onChange = ({ target }: { target: BUI.ColorInput }) => {
    if (
      !(
        "color" in hoverer.material &&
        hoverer.material.color instanceof THREE.Color
      )
    ) {
      return;
    }

    hoverer.material.color.set(target.color);
  };

  return BUI.html`
    <bim-panel active label="Hoverer Tutorial" class="options-menu">
      <bim-panel-section label="Controls">
        <bim-color-input color="#${((hoverer.material as any).color as THREE.Color).getHexString()}" label="Color" @input=${onChange}></bim-color-input>
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
  That's it! Now you're able to implement hovering functionality in your 3D applications. Congratulations! Keep exploring more tutorials in the documentation to enhance your skills further.
*/
