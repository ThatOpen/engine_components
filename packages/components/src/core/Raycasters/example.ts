import * as THREE from "three";
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

world.camera.controls.setLookAt(10, 10, 10, 0, 0, 0);

world.scene.setup();

// @ts-ignore
// const grid = new OBC.SimpleGrid(components);

/* MD
  ### 🤏 Touching things
  ___
  In this tutorial, we'll learn to **interact with our scene**. This will work both for a mouse 🐀 and for the touch
  screen of a phone 📱 or tablet 🍎. This might sound daunting, but it's actually very easy! Let's see **how to do that
  in 5 minutes**.

  :::tip First, let's set up a simple scene!

  If you haven't started there, check out [that tutorial first](SimpleScene.mdx)!

  :::

  Next, we will add some objects to pick. We need 5 meshes that can share the same cube geometry
  (as all the geometry of the cubes is the same).
  */

const cubeMaterial = new THREE.MeshStandardMaterial({ color: "#6528D7" });
const greenMaterial = new THREE.MeshStandardMaterial({ color: "#BCF124" });

const boxGeometry = new THREE.BoxGeometry(3, 3, 3);

const cube1 = new THREE.Mesh(boxGeometry, cubeMaterial);
const cube2 = new THREE.Mesh(boxGeometry, cubeMaterial);
const cube3 = new THREE.Mesh(boxGeometry, cubeMaterial);
world.scene.three.add(cube1, cube2, cube3);
const cubes = [cube1, cube2, cube3];

/* MD
  Let's give the cubes a different position so that we can see all of them in the scene:
  */

cube2.position.x = 5;
cube3.position.x = -5;

/* MD
     ### 🔄 Spinning up the cubes
     ___
  To spice things up a little, let's create an animation loop that rotates the cubes each frame. You can do this super
  easily by creating a function and adding it to the `beforeUpdate` event of the **RendererComponent** inside
  **Components** using the `on()` method:
  */

const oneDegree = Math.PI / 180;

function rotateCubes() {
  cube1.rotation.x += oneDegree;
  cube1.rotation.y += oneDegree;
  cube2.rotation.x += oneDegree;
  cube2.rotation.z += oneDegree;
  cube3.rotation.y += oneDegree;
  cube3.rotation.z += oneDegree;
}

world.renderer.onBeforeUpdate.add(rotateCubes);

/* MD

  :::info Turning off animations

  You can turn off animations simply by using the `off()` method.
  [This works for any event](../api/classes/components.Event)
  in the library! ⌚

  :::

  ### ⚡ Casting rays around
  ___

  Finally, we will use the raycaster. This is very easy using the
  **[raycaster component](../api/classes/components.SimpleRaycaster)**, which solves this for all screen sizes.
  We will create an event that fires every time that the user moves the mouse. 👇

  :::warning How does it really work?

  We will simply reset the material of the previous selection (if it exists), and then apply the green material to the
  found object (if any). This might sound like a lot, but it's actually very little code. 😉

  :::
  */

const casters = components.get(OBC.Raycasters);
const caster = casters.create(world);

let previousSelection: THREE.Mesh | null = null;

window.onmousemove = () => {
  const result = caster.castRay(cubes);
  if (previousSelection) {
    previousSelection.material = cubeMaterial;
  }
  if (!result || !(result.object instanceof THREE.Mesh)) {
    return;
  }
  result.object.material = greenMaterial;
  previousSelection = result.object;
};

/* MD
  Great job! 🎉 Now you know how to pick geometry in your 3D scene using a
  **[raycaster component](../api/classes/components.SimpleRaycaster)** component! 💪 You are now one step closer
  to build your own BIM software. Let's keep it up and check out another tutorials!
  */
