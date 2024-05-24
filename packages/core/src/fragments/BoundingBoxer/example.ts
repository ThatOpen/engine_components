/* eslint import/no-extraneous-dependencies: 0 */

// Set up scene (see SimpleScene tutorial)

// @ts-ignore
import * as dat from "three/examples/jsm/libs/lil-gui.module.min";
import Stats from "stats.js";
import * as BUI from "@thatopen/ui";
import * as OBC from "../..";

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
  ### 🧳 Gathering BIM Data
  ---

  Fragment help you to render your BIM files faster than ever.🚅 [**Fragment**](https://github.com/ThatOpen/engine_fragment) is a group of `FragmentMeshes`
  which are clubbed together to visualize the BIM model.

  When working with **large** BIM models, you may need to quit the navigation to see the whole model.📌
  To accomplish this, we must extract Mesh data from the Fragment and use `control` APIs to display the complete Fragment.

  :::tip First, let's set up a simple scene!

  👀 If you haven't started there, check out [that tutorial first](SimpleScene.mdx)!

  :::

  For this tutorial, we'll use the `FragmentBoundingBox` component, which will provide us with the **mesh** by using the Fragment Model.

  ### 🧩 Adding Fragments
  ---
  We'll start by adding a **Fragment** to our scene using **[FragmentManager](../api/classes/components.FragmentManager)**.

  We'll use a simple fragment for the purposes of this tutorial, but the code is capable of handling big files as well.🏗️

    */

const fragments = new OBC.FragmentsManager(components);

const file = await fetch("https://thatopen.github.io/engine_components/resources/small.frag");
const data = await file.arrayBuffer();
const buffer = new Uint8Array(data);
const model = fragments.load(buffer);
world.scene.three.add(model);

/* MD
  ### 🎲 Creation of Bounding Boxes
  ---

  Now that our setup is done, lets see how you can use **[`FragmentBoundingBox()`](../api/classes/components.FragmentBoundingBox)**.

  You will be amazed to see how easy it is to create [bounding box](https://threejs.org/docs/?q=bound#api/en/math/Box3) using **components**.💪

  We will use `OBC.FragmentBoundingBox()` and add the Fragment model to it using `add(model)`.

    */

const fragmentBbox = components.get(OBC.BoundingBoxer);
fragmentBbox.add(model);

/* MD

  #### 👓 Reading the Mesh Data

  After adding the model, we can now read the mesh from bounding box using **`getMesh()`**

  */
const bbox = fragmentBbox.getMesh();
fragmentBbox.reset();

/* MD

  ### 🎮 Managing Zoom Events
  ---

  Now that all the setup is done, we need to trigger the zoom event on a button click.🖱

  We will use `fitToSphere` from **[camera.controls](../api/classes/components.SimpleCamera#controls)**,
  which takes the `mesh` as a parameter and zooms to it.

  Also, we will enable a nice transition effect while zooming to the mesh by setting the last parameter as **true**

  */

BUI.Manager.init();

const panel = BUI.Component.create<BUI.PanelSection>(() => {
  return BUI.html`
    <bim-panel active label="Bounding Boxes Tutorial" 
      style="position: fixed; top: 5px; right: 5px">
      <bim-panel-section style="padding-top: 10px;">
         
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

  **Congratulations** 🎉 on completing this short yet useful tutorial!
  You can now easily zoom to Fragment **Mesh** using **[FragmentBoundingBox](../api/classes/components.FragmentBoundingBox)**😎
  Let's keep it up and check out another tutorial! 🎓

  */

// Set up stats
const stats = new Stats();
stats.showPanel(2);
document.body.append(stats.dom);
stats.dom.style.left = "0px";
stats.dom.style.right = "auto";

world.renderer.onBeforeUpdate.add(() => stats.begin());
world.renderer.onAfterUpdate.add(() => stats.end());
