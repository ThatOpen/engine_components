// Set up scene (see SimpleScene tutorial)

import * as THREE from "three";
// import Stats from "stats.js";
// @ts-ignore
import * as dat from "three/examples/jsm/libs/lil-gui.module.min";
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

const cube = new THREE.Mesh(new THREE.BoxGeometry());
world.scene.three.add(cube);

world.camera.controls.setLookAt(12, 6, 8, 0, 0, -10);

world.scene.setup();

/* MD
  ### 🧶 Managing Fragment Efficiently
  ---

  Until recently, we had been adding 3D objects to the **Scene** with the traditional `scene.add` API.
  We will now use **[Fragment](https://github.com/ThatOpen/engine_fragment)** to work with large BIM models.🏗️

  Fragment are faster and easier to use Geometric API, which reduces draw calls and speeds up the processing of 3D objects.
  In this tutorial, we will load and render `.frag` files using **Fragment Manager**.

  :::tip First, let's set up a simple scene!

  👀 If you haven't started there, check out [that tutorial first](SimpleScene.mdx)!

  :::

  ### 🧭 Fragment Powerhouse
  ---

  Let's begin by including [Fragment Manager](../api/classes/components.FragmentManager),
  which requires the parameter `component` to be provided to it.
  In terms of capabilities, Fragment Manager is a true powerhouse.🏭

  */

const fragments = new OBC.FragmentsManager(components);

/* MD

  ### 🧩 Add Fragment To Scene
  ---

  Using a single API, a Fragment can be quickly added to the scene.
  Everything else is taken care of by `fragment.load`, which makes it easier to render a **Fragment** file.💪💪

  */

let uuid: string = "";

async function loadFragments() {
  if (fragments.groups.size) {
    return;
  }
  const file = await fetch("https://thatopen.github.io/engine_components/resources/small.frag");
  const data = await file.arrayBuffer();
  const buffer = new Uint8Array(data);
  const group = fragments.load(buffer);
  world.scene.three.add(group);
  uuid = group.uuid;
  console.log(group);
}

/* MD

  :::tip Loading IFC files as Fragment

  You're probably wondering how IFC files can be loaded as Fragment.
  The same approach can be used to load an IFC file with a fragment;
  [view its own tutorial](./FragmentIfcLoader.mdx) for further information.

  :::

  ### 📤 Storing Fragment
  ---

  **Fragment Manager** provides us with option to export the Fragment we have used in our Scene.
  Fragment are exported to **[Blob](https://developer.mozilla.org/en-US/docs/Web/API/Blob/Blob)**,
  which can be used to generate a File and then download it.↗️

  Let's see how you can use `fragment.export` in your code.

  */

function download(file: File) {
  const link = document.createElement("a");
  link.href = URL.createObjectURL(file);
  link.download = file.name;
  document.body.appendChild(link);
  link.click();
  link.remove();
}

function exportFragments() {
  if (!fragments.groups.size) {
    return;
  }
  const group = fragments.groups.get(uuid);
  if (!group) {
    return;
  }
  const data = fragments.export(group);
  const blob = new Blob([data]);
  const file = new File([blob], "small.frag");
  download(file);
}

/* MD

  :::info Creating Dynamic URLs

  `URL.createObjectURL()` comes handy when you want to generate a URL for files that were generated programmatically.
  You can read more about it [here](https://developer.mozilla.org/en-US/docs/Web/API/URL/createObjectURL_static).

  :::

  ### 🧹 Discard Fragment and Clean the Scene
  ---

  At some point, you will require to render numerous Fragment and discard them when not needed.
  You can use `dispose()` method which will remove the Fragment Meshes from the Scene.✂️

  After using `fragments.dispose()`, you should reinitialize **Fragment Manager** to maintain it's original state for further uses.

  */

function disposeFragments() {
  fragments.dispose();
}

/* MD

  Loading a .zip fragment that you have locally is also quite easy:

  */

function importExternalFragment() {
  if (fragments.groups.size) {
    return;
  }
  const input = document.createElement("input");
  input.type = "file";
  input.onchange = async () => {
    if (!(input.files && input.files[0])) return;
    const file = input.files[0];
    if (file.name.includes(".frag")) {
      const url = URL.createObjectURL(file);
      const result = await fetch(url);
      const data = await result.arrayBuffer();
      const buffer = new Uint8Array(data);
      fragments.load(buffer);
    }
    input.remove();
  };
  input.click();
}

const gui = new dat.GUI();

const actions = {
  loadFragments: () => loadFragments(),
  disposeFragments: () => disposeFragments(),
  exportFragments: () => exportFragments(),
  importExternalFragment: () => importExternalFragment(),
};

gui.add(actions, "loadFragments").name("Load Fragments");
gui.add(actions, "disposeFragments").name("Dispose Fragments");
gui.add(actions, "exportFragments").name("Export Fragments");
gui.add(actions, "importExternalFragment").name("Import External Fragment");

/* MD

    **Congratulations** 🎉 on completing this short yet powerful tutorial!
    Now you can render or export Fragment files in your BIM Apps using **[Fragment Manager](../api/classes/components.FragmentManager)** 🎯
    Let's keep it up and check out another tutorial! 🎓

    */

// Set up stats

// const stats = new Stats();
// stats.showPanel(2);
// document.body.append(stats.dom);
// stats.dom.style.left = "0px";
// world.renderer.onBeforeUpdate.add(() => stats.begin());
// world.renderer.onAfterUpdate.add(() => stats.end());
