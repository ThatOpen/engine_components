// /* MD
// ### 📏 Getting measurement information
// ---

// Sometimes we need to know more about the geometry we are working with. For example, imagine you are building a takeoff and estimations app and need to give your user a tool to select the faces of different objects to take them into acccount in a specific takeoff computation. This is where the measurement utils of our libraries come in handy. In this tutorial, you'll learn to use them.

// :::tip Aren't faces easy?

// Not really. The geometry within an IFC file is implicit, and we convert it to triangles to be able to show it in 3D. That means that a simple wall with some windows and doors might have hundreds of triangles. How do you know which one of them, for instance, belong to the outer face? This is what we do for you.

// :::

// In this tutorial, we will import:

// - `three.js` to get create som 3D geometry.
// - `@thatopen/ui` to add some simple and cool UI menus.
// - `@thatopen/components` to set up the barebone of our app.
// - `Stats.js` (optional) to measure the performance of our app.
// */

// import * as THREE from "three";
// import Stats from "stats.js";
// // import OBC from "@thatopen/components";
// import * as OBC from "../..";

// /* MD
//   ### 🌎 Setting up a simple scene
//   ---

//   We will start by creating a simple scene with a camera and a renderer. If you don't know how to set up a scene, you can check the Worlds tutorial.
// */

// const container = document.getElementById("container")!;

// const components = new OBC.Components();

// const worlds = components.get(OBC.Worlds);

// const world = worlds.create<
//   OBC.SimpleScene,
//   OBC.SimpleCamera,
//   OBC.SimpleRenderer
// >();

// world.scene = new OBC.SimpleScene(components);
// world.renderer = new OBC.SimpleRenderer(components, container);
// world.camera = new OBC.SimpleCamera(components);

// components.init();

// world.camera.controls.setLookAt(12, 6, 8, 0, 0, -10);

// world.scene.setup();

// const grids = components.get(OBC.Grids);
// grids.create(world);

// /* MD

//   We'll make the background of the scene transparent so that it looks good in our docs page, but you don't have to do that in your app!

// */

// world.scene.three.background = null;

// /* MD
//   ### 🧳 Loading a BIM model
//   ---

//  We'll start by adding a BIM model to our scene. That model is already converted to fragments, so it will load much faster than if we loaded the IFC file.

//   :::tip Fragments?

//     If you are not familiar with fragments, check out the IfcLoader tutorial!

//   :::
// */

// const fragments = new OBC.FragmentsManager(components);
// const file = await fetch(
//   "https://thatopen.github.io/engine_components/resources/small.frag",
// );
// const data = await file.arrayBuffer();
// const buffer = new Uint8Array(data);
// const model = fragments.load(buffer);
// world.scene.three.add(model);

// /* MD
//   ### 🧊 Representing the data
//   ---

//  We're going to get the face information and represent it in 3D on top of the BIM model we just loaded when the user hover with the mouse over it. So first we need to create the 3D object that will show up on top of a hovered face. That's quite easy using three.js:
// */

// const edges = new THREE.EdgesGeometry();
// const material = new THREE.LineBasicMaterial({
//   color: 0xff0000,
//   depthTest: false,
// });
// const line = new THREE.LineSegments(edges, material);
// world.scene.three.add(line);

// /* MD
//   ### 📐 Setting up the measurements
//   ---

//  Now, to be able to make the user hover over the geometry, detect a face and get its ifnormation, we'll need to import 2 components: the measurements utils and the casters. We'll create a new caster in the current world.
// */

// const measurements = components.get(OBC.MeasurementUtils);
// const casters = components.get(OBC.Raycasters);
// const caster = casters.get(world);

// /* MD
//   And now we are going to add an event to the current renderer. The idea is quite simple:
//   1. Use the raycaster to get the face under the mouse of the user (if any).
//   2. Use the measurement utils to get the face data.
//   3. Update the 3D object with the face data.
// */

// if (world.renderer) {
//   const canvas = world.renderer.three.domElement;
//   canvas.addEventListener("pointermove", async () => {
//     const result = await caster.castRay([model]);

//     if (!result) return;
//     if (!(result.object instanceof THREE.Mesh)) return;
//     if (result.faceIndex === undefined) return;

//     const face = measurements.getFace(
//       result.object,
//       result.faceIndex,
//       result.instanceId,
//     );

//     if (face) {
//       const points: THREE.Vector3[] = [];
//       for (const edge of face.edges) {
//         points.push(...edge.points);
//       }
//       edges.setFromPoints(points);
//     }
//   });
// }

// /* MD
//   ### ⏱️ Measuring the performance (optional)
//   ---

//   We'll use the [Stats.js](https://github.com/mrdoob/stats.js) to measure the performance of our app. We will add it to the top left corner of the viewport. This way, we'll make sure that the memory consumption and the FPS of our app are under control.
// */

// const stats = new Stats();
// stats.showPanel(2);
// document.body.append(stats.dom);
// stats.dom.style.left = "0px";
// stats.dom.style.zIndex = "unset";
// world.renderer.onBeforeUpdate.add(() => stats.begin());
// world.renderer.onAfterUpdate.add(() => stats.end());

// /* MD
//   ### 🎉 Wrap up
//   ---

//   That's it! You have created an app that allows user to pick geometry faces and represent them in 3D. You can now use this data to build Takeoff and estimations apps!
// */
