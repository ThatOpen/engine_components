import * as THREE from "three";
import * as dat from "three/examples/jsm/libs/lil-gui.module.min.js";
// eslint-disable-next-line import/no-extraneous-dependencies
import Stats from "stats.js";
import * as OBC from "../..";

const container = document.getElementById("container")!;

const components = new OBC.Components();

const worlds = components.get(OBC.Worlds);
const world = new OBC.SimpleWorld<
  OBC.SimpleScene,
  OBC.SimpleCamera,
  OBC.SimpleRenderer
>(components);

world.scene = new OBC.SimpleScene(components);
world.renderer = new OBC.SimpleRenderer(components, container);
world.camera = new OBC.SimpleCamera(components);

worlds.add(world);

components.init();

world.camera.controls.setLookAt(13, 13, 13, 0, 0, 0);

world.scene.setup();

/* MD
  ### 👨‍🎨 Seamless Material Control
  ---

  Have you ever had trouble handling multiple **Materials** for your BIM project?
  You may be asking why different **Materials** are required. Sometimes you need to highlight a mesh
  or group the meshes, and render them with different materials; the possibilities are limitless.💫

:::tip First, let's set up a simple scene!

  👀 If you haven't started there, check out [that tutorial first](SimpleScene.mdx)!

  :::

  In this tutorial, we use **MaterialManager** to control materials for various meshes.
  We will also show you how to adjust the background of your scene.🌗


  ### 🧱 Creating Multiple Meshes
  ---

  Now that our scene setup is done, let's add 3D elements to our scene as well.
  We will add [Box Geometry](https://threejs.org/docs/#api/en/geometries/BoxGeometry)
  and [Sphere Geometry](https://threejs.org/docs/#api/en/geometries/SphereGeometry) along with a material.🖌️

  #### Grouping the Meshes

  🗃️ To make things easier to understand and use, we will categorize and store meshes into **`cubes[]`** and **`spheres[]`**.

  */

const cubes: THREE.Mesh[] = [];
const spheres: THREE.Mesh[] = [];

const boxGeometry = new THREE.BoxGeometry(2, 2, 2);
const sphereGeometry = new THREE.SphereGeometry(2, 8, 8);
const material = new THREE.MeshLambertMaterial({ color: "#6528D7" });

/* MD

  #### Changing Positions

  We have made preparations for adding mesh to our scene; but, if we do not alter their placements,
  all the meshes will be rendered in the same location, which is `(0,0,0)`.📍

  :::info Randomising the Cube Placement

  We'll write a quick **utility** function that returns a random number between 0 and the specified upper limit.
  You can use this for a variety of purposes, but for this tutorial
  it will be used to generate random positions for cube and sphere placement.📌

  :::

    */
function getRandomNumber(limit: number) {
  return Math.random() * limit;
}

/* MD

  ### 🧪 Generating Cubes and Spheres

  Now, we will write a simple **`for loop`** which will generate **3 Cubes** and **3 Sphere** meshes.
  In addition, we will use the `getRandomNumber` function that we defined before and add the meshes to the scene with updated positions.🔮

    */

function generateCubes() {
  for (let i = 0; i < 3; i++) {
    const cube = new THREE.Mesh(boxGeometry, material);
    cube.position.x = getRandomNumber(10);
    cube.position.y = getRandomNumber(10);
    cube.position.z = getRandomNumber(10);
    cube.updateMatrix();
    world.scene.three.add(cube);
    cubes.push(cube);
  }
}

function generateSpheres() {
  for (let i = 0; i < 3; i++) {
    const sphere = new THREE.Mesh(sphereGeometry, material);
    sphere.position.x = getRandomNumber(10);
    sphere.position.y = getRandomNumber(10);
    sphere.position.z = getRandomNumber(10);
    sphere.updateMatrix();
    world.scene.three.add(sphere);
    spheres.push(sphere);
  }
}

generateCubes();
generateSpheres();

/* MD

  ### 🎨 Materials Made Easy
  ---

  Here comes the interesting part! We will now use **[Material Manager](../api/classes/components.MaterialManager)**
  for manipulating the materials and background. Let's create different materials for Cubes and Spheres.🎭

  */
const materials = components.get(OBC.Materials);

const backgroundColor = new THREE.Color("white");

const cubeColor = new THREE.Color(0x71d728);
const cubeMaterial = new THREE.MeshBasicMaterial({ color: cubeColor });

const sphereColor = new THREE.Color(0xd7286b);
const sphereMaterial = new THREE.MeshBasicMaterial({ color: sphereColor });

/* MD

  :::tip Syncing Components with your own theme!

  🔥 You may have noticed that we are also implementing `backgroundColor`,
  which will allow you to modify the background of your scene with a single call!

  With components, you can now modify the background of your BIM app to match the theme you're using.

  :::

  #### Storing the Material with Manager

  Now that the materials have been created, we will `name` them and use **`addMaterial`** to store them in `materialManager`.

  Next, we'll add the necessary meshes to help **materialManager** to choose which mesh to use when applying materials.🧮

*/
materials.addMaterial("cubeMaterial", cubeMaterial);
materials.addMeshes("cubeMaterial", cubes);

materials.addMaterial("sphereMaterial", sphereMaterial);
materials.addMeshes("sphereMaterial", spheres);

/* MD
  ### 🚦 Controlling the Manager Events
  ---

  With all the things in place, we will use `dat.GUI` for controlling the materials!

  - `materialManager.set(boolean, ["materialName", ..])` - You can use this API to change the active material for a mesh group.
  - `materialManager.setBackgroundColor(Color) - This API will help you to change the background of your scene.

  */

const gui = new dat.GUI();

const actions = {
  changeSphereMaterial: () => {
    materials.set(true, ["sphereMaterial"]);
  },
  changeCubeMaterial: () => {
    materials.set(true, ["cubeMaterial"]);
  },
  changeBackground: () => {
    materials.setBackgroundColor(backgroundColor, world);
  },
  reset: () => {
    materials.set(false, ["cubeMaterial", "sphereMaterial"]);
    materials.resetBackgroundColor(world);
  },
};

/* MD

  Great job! 🎉 Now you know how to manage multiple materials in your app using
  **[Material Manager](../api/classes/components.MaterialManager)** component! 💪
  Your BIM software can be made more visually appealing and aesthetically pleasing.
  Let's keep it up and check out another tutorials!

  */

gui.add(actions, "changeSphereMaterial").name("Change Sphere Material");
gui.add(actions, "changeCubeMaterial").name("Change Cube Material");
gui.add(actions, "changeBackground").name("Change Background");
gui.add(actions, "reset").name("Reset Material");

const stats = new Stats();
stats.showPanel(2);
document.body.append(stats.dom);
stats.dom.style.left = "0px";
world.renderer.onBeforeUpdate.add(() => stats.begin());
world.renderer.onAfterUpdate.add(() => stats.end());
