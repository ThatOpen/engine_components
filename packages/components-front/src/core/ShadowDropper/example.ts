// Set up scene (see SimpleScene tutorial)

import * as THREE from "three";
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

/* MD
  ### 🌒 Adding Realism
  ---
  Have you ever wondered what makes a scene look realistic?
  Adding **Shadow** to 3D objects may quickly add depth to your creations.😎

  In this tutorial, we'll show you how to use Shadow Dropper to quickly apply shadows.
  In less than 5 minutes, you can create realistic shadows for all the meshes inside your scene.⏱️

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

  **`components.meshes`** acts as a store to help you manage your elements centrally.

  */

scene.background = new THREE.Color("gray");
scene.add(cube);
components.meshes.add(cube);

/* MD
  ### 🌚 Adding Beautiful Shadow
  ---
  This completes our scene setup. Let's now include Shadows,
  we'll use **`ShadowDropper`** and pass `components` as an argument to it.🔗

  */

const shadows = new OBC.ShadowDropper(components);

/* MD

  Shadow Dropper Component not only adds shadows to the scene, but it also helps you manage the **Shadows**.
  To obtain the required results, you can alter the `ShadowDropper` parameters.🔧

  */

shadows.shadowExtraScaleFactor = 15;
shadows.darkness = 2;
shadows.shadowOffset = 0.1;

/* MD
  - `shadowExtraScalarFactor` - With this, the shadow's area of impact can be adjusted.
  - `darkness` - This is used to increase or decrease the intensity of Shadow.

  :::info SHADOW and realism ✨

  Read the **Shadow Dropper** API for more on this.
  The Shadow Dropper API offers more configuration options to render realistic shadows.

  :::

  ### 🎨 Rendering Shadow
  ---
  Now, we will use Shadow Dropper to create shadows for the element.
  We will use **`renderShadow()`** to generate shadow for the `cube` we created.

  */

shadows.renderShadow([cube], "example");

/* MD

  **renderShadow** requires two parameter, the `element` and a `shadowID`.
  **shadowID** needs to be unique for the entire scene.

  :::tip Deleting Shadows

  ❎ If you want to safely delete the shadow using **shadowID** you can call
  **`shadows.deleteShadow(shadowId);`**

  :::

  **Congratulations** 🎉 on completing this tutorial!
  Now you can add shadows to BIM Models or any 3D Object in minutes using
  **Shadow Dropper** 🌗
  Let's keep it up and check out another tutorial! 🎓
  */

// Set up stats

const stats = new Stats();
stats.showPanel(2);
document.body.append(stats.dom);
stats.dom.style.left = "0px";
rendererComponent.onBeforeUpdate.add(() => stats.begin());
rendererComponent.onAfterUpdate.add(() => stats.end());
