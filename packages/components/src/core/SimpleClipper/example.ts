// Set up scene (see SimpleScene tutorial)

import * as THREE from "three";
// @ts-ignore
import * as dat from "three/examples/jsm/libs/lil-gui.module.min";
import Stats from "stats.js";
import * as OBC from "../..";

const container = document.getElementById("container")!;

const components = new OBC.Components();

const sceneComponent = new OBC.SimpleScene(components);
sceneComponent.setup();
components.scene = sceneComponent;

const rendererComponent = new OBC.PostproductionRenderer(components, container);
components.renderer = rendererComponent;

const cameraComponent = new OBC.SimpleCamera(components);
components.camera = cameraComponent;

components.raycaster = new OBC.SimpleRaycaster(components);

components.init();

const scene = components.scene.get();

cameraComponent.controls.setLookAt(10, 10, 10, 0, 0, 0);

// @ts-ignore
const grid = new OBC.SimpleGrid(components);

/* MD
  ### ✂️ Clipping Tool
  ---
  The Clipping Tool is a powerful feature in 3D modelling that helps you dissect 3D objects.
  Clipping Tool is useful for inspecting and analyzing objects in detail.💪

  In this tutorial, we will use the Clipping Tool to dissect a Cube using planes and transformation controls.
  This tutorial will help you add Clipping functionality to your project easily.🚀

  :::tip First, let's set up a simple scene!

  👀 If you haven't started there, check out [that tutorial first](SimpleScene.mdx)!

  :::

  ### 🎲 Creating a Cube Mesh
  ---
  Let's start by adding a Cube, which we can dissect.
  We will create a [Cube](https://threejs.org/docs/index.html?q=box#api/en/geometries/BoxGeometry)
  with `3x3x3` dimensions and use red color for the material.
  */

const cubeGeometry = new THREE.BoxGeometry(3, 3, 3);
const cubeMaterial = new THREE.MeshStandardMaterial({ color: "#6528D7" });
const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
cube.position.set(0, 1.5, 0);

/* MD
  Now, we will add the Cube to the `Scene`. We must also add the **cube** to `components.meshes`,
  which is simply an array of all the meshes in the Scene 🗄️.
    */

scene.add(cube);
components.meshes.add(cube);

/* MD
  ### ⚙️ Adding Simple Clipper
  ---
  Here comes the interesting part, we will add a Simple Clipper to our scene 🥁
  A **[Simple Clipper](../api/classes/components.SimpleClipper)** requires two things: `components` and `Simple Plane`
  */

const clipper = new OBC.SimpleClipper(components);

/* MD

  :::info PLANE WITH TRANSFORMATION CONTROLS AND MORE

  **[Simple Plane](../api/classes/components.SimplePlane)** is useful in generating planes along with
  customizations.

  :::

  **SimpleClipper** includes everything needed to provide clipping capabilities,
  including the ability to build numerous clipping planes.

  SimpleClipper also controls the SimplePlane internally,
  allowing you to execute clipping on any 3D object by just dragging the planes.

  */

clipper.enabled = true;

/* MD

  ### ⏏️ Creating a Toolbar for the Clipper
  ---
  We'll make a **Toolbar Component** and set it at the bottom.
  In addition, we will add a clipper button to this toolbar that will be used to toggle the clipping state.
  */

const mainButton = clipper.uiElement.get<OBC.Button>("main");
const mainToolbar = new OBC.Toolbar(components, {
  name: "Main Toolbar",
  position: "bottom",
});
mainToolbar.addChild(mainButton);
components.ui.addToolbar(mainToolbar);

/* MD
  🎛️ Check **[Toolbar and UIManager](./UIManager.mdx)** tutorial if you have any doubts!

  ### 🤝 Performing Clipping Events
  ---
  Now, we need a way to create a Clipping Plane on demand, you can do it with a `Single Click` or
  `Double Click` of a mouse.

  For this tutorial, we will use **Double Click**, to create a Clipper that will generate a
  plane on the 3D object's face.

  */

container.ondblclick = () => clipper.create();

/* MD

  :::info Raycaster below the hood 🎩

  We use the **[Simple Raycaster](SimpleRaycaster.mdx)** to determine if the intersection has occurred.
  The clipper places a plane after detecting the face on which the mouse was clicked.
  Here, the SimpleClipper handles everything for you 😎

  :::

  ### 🧹 Deleting the Clipping Planes
  ---
  Now that we know how to make multiple clippers, we must also know how to delete them when necessary.
  Clipping planes can be removed using `clipper.delete()` or `clipper.delete(plane)`, which deletes a single plane.

  **clipper.delete()** deletes the plane on which your mouse pointer is now located.

  */

window.onkeydown = (event) => {
  if (event.code === "Delete" || event.code === "Backspace") {
    clipper.delete();
  }
};

/* MD

  :::tip Delete all the Clipping Planes
  ❎ If you want to safely delete all the clipping planes that were created you can simply call
  **`clipper.deleteAll()`**
  :::

  **Congratulations** 🎉 on completing this tutorial! Now you can inspect BIM Models or any 3D Object easily using
  **[Clipper Component](../api/classes/components.SimpleClipper)** 🧐
  Let's keep it up and check out another tutorial! 🎓
  */

// TODO: Add this to tutorial
const createButton = new OBC.Button(components);
createButton.label = "Add plane";
createButton.onClick.add(() => clipper.create());

const deleteButton = new OBC.Button(components);
deleteButton.label = "Delete plane";
deleteButton.onClick.add(() => clipper.delete());

components.ui.contextMenu.addChild(createButton, deleteButton);

// Set up stats

const stats = new Stats();
stats.showPanel(2);
document.body.append(stats.dom);
stats.dom.style.left = "0px";
rendererComponent.onBeforeUpdate.add(() => stats.begin());
rendererComponent.onAfterUpdate.add(() => stats.end());

// Set up dat.gui menu

const gui = new dat.GUI();

const shortcutsFolder = gui.addFolder("Shortcuts");

const shortcuts = {
  "Create clipping plane": "Double click",
  "Delete clipping plane": "Delete",
};
shortcutsFolder.add(shortcuts, "Create clipping plane");
shortcutsFolder.add(shortcuts, "Delete clipping plane");

const actionsFolder = gui.addFolder("Actions");

actionsFolder.add(clipper, "enabled").name("Toggle clipping planes enabled");
actionsFolder.add(clipper, "visible").name("Toggle clipping planes visible");

const color = {
  value: 0x000000,
};

const helperColor = new THREE.Color();
actionsFolder
  .addColor(color, "value")
  .name("Plane color")
  .onChange((value: number) => {
    helperColor.setHex(value);
    if ("color" in clipper.material) clipper.material.color = helperColor;
  });

actionsFolder.add(clipper, "size").name("Plane Size").min(0).max(15);
actionsFolder
  .add(clipper.material, "opacity")
  .name("Plane Opacity")
  .min(0)
  .max(1);

const actions = {
  "Delete all planes": () => {
    clipper.deleteAll();
  },
  "Rotate cube": () => {
    cube.rotation.x = 2 * Math.PI * Math.random();
    cube.rotation.y = 2 * Math.PI * Math.random();
    cube.rotation.z = 2 * Math.PI * Math.random();
  },
};

actionsFolder.add(actions, "Rotate cube");
actionsFolder.add(actions, "Delete all planes");
