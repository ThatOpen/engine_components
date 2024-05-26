/* MD
### 🧊 Playing with boxes
---

In this tutorial, you'll learn to easily create the bounding boxes of a BIM model. This can be useful for knowing the overall position and dimension of your models, which can be used, for instance, to make the camera fit a whole BIM model in the screen.

:::tip Bounding boxes?

Bounding boxes (AABB or Axis-Aligned Bounding Boxes) are the boxes aligned with the X, Y and Z axes of a 3D model that contain one or many objects. They are very common in 3D applications to make fast computations that require to know the whole dimension or position of one or many objects.

:::

In this tutorial, we will import:

- `@thatopen/components` to set up the barebone of our app.
- `Stats.js` (optional) to measure the performance of our app.
- `@thatopen/ui` to add some simple and cool UI menus.

*/

import Stats from "stats.js";
import * as BUI from "@thatopen/ui";
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

const fragments = components.get(OBC.FragmentsManager);
const file = await fetch(
  "https://thatopen.github.io/engine_components/resources/small.frag",
);
const data = await file.arrayBuffer();
const buffer = new Uint8Array(data);
const model = fragments.load(buffer);
world.scene.three.add(model);

/* MD
  ### 🎲 Creation of Bounding Boxes
  ---

  Now that our setup is done, lets see how you can create the bounding boxes of the model.

  BIM models are complex, but don't worry: creating the [bounding boxes](https://threejs.org/docs/?q=bound#api/en/math/Box3) is a piece of cake thanks to the `BoundingBoxer`.💪

  We can add models to the computation of the bounding box simply by using the `add()` method.
*/

const fragmentBbox = components.get(OBC.BoundingBoxer);
fragmentBbox.add(model);

/* MD

  #### 👓 Reading the Bounding Box data

  After adding the model, we can now read the mesh from bounding box using `getMesh()` method. 
  
  :::tip Don't forget to clean up after using it! 🧹

  It's a good practice to reset the bounding box after using it with the `reset()` method. Otherwise, if you add more models or meshes to the bounding boxer, the bounding box will compute a bounding box that includes everything (including the previously added models).

  :::
*/

const bbox = fragmentBbox.getMesh();
fragmentBbox.reset();

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
  Now we will create a new panel with an input to make the camera fit the model to the screen. For more information about the UI library, you can check the specific documentation for it!
*/

const panel = BUI.Component.create<BUI.PanelSection>(() => {
  return BUI.html`
    <bim-panel active label="Bounding Boxes Tutorial" class="options-menu">
      <bim-panel-section collapsed label="Controls">
         
        <bim-button 
          label="Fit BIM model" 
          @click="${() => {
            world.camera.controls.fitToSphere(bbox, true);
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

  That's it! You have created the bounding box of a BIM model and used it to make the camera fit the model to the screen. This also works with many models!

  */
