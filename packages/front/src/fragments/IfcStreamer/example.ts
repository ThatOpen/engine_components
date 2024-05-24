/* eslint import/no-extraneous-dependencies: 0 */

import Stats from "stats.js";
// @ts-ignore
import * as dat from "three/examples/jsm/libs/lil-gui.module.min";
import * as OBC from "@thatopen/components";
import * as OBCF from "../..";

// customEffects.excludedMeshes.push(grid.get());

// rendererComponent.postproduction.enabled = true;

// Set up scene (see SimpleScene tutorial)

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

world.scene.setup();

// rendererComponent.postproduction.enabled = true;

world.camera.controls.setLookAt(12, 6, 8, 0, 0, -10);

const grids = components.get(OBC.Grids);
grids.create(world);

const loader = new OBCF.IfcStreamer(components);
loader.world = world;
loader.url = "https://thatopen.github.io/engine_components/resources/streaming/";
// const fragments = components.get(OBC.FragmentsManager);

async function loadModel(geometryURL: string, propertiesURL?: string) {
  const rawGeometryData = await fetch(geometryURL);
  const geometryData = await rawGeometryData.json();
  let propertiesData;
  if (propertiesURL) {
    const rawPropertiesData = await fetch(propertiesURL);
    propertiesData = await rawPropertiesData.json();
  }

  const model = await loader.load(geometryData, true, propertiesData);

  console.log(model);
  const props = await model.getProperties(186);
  console.log(props);
}

await loadModel(
  "https://thatopen.github.io/engine_components/resources/streaming/small.ifc-processed.json",
  "https://thatopen.github.io/engine_components/resources/streaming/small.ifc-processed-properties.json",
);

/* MD
Now, streaming works by updating the scene depending on the user's perspective
and getting the necessary geometries from the backend. A simple way to achieve
this is by updating the scene each time the user stops the camera:
*/

world.camera.controls.addEventListener("sleep", () => {
  loader.culler.needsUpdate = true;
});

/* MD
As you can imagine, downloading the geometries from the server each time can
take time, especially for heavier geometries. This is why the stream loader
automatically caches the files locally to get them much faster. This means that
the loading experience the first time might be a bit slower, but then later
it will be much better. You can control this using the `useCache` property
and clear the cache using the `clearCache()` method:
*/

loader.useCache = true;

async function clearCache() {
  await loader.clearCache();
  window.location.reload();
}

/* MD
You can also customize the loader through the `culler` property:
- Threshold determines how bit an object must be in the screen to stream it.
- maxHiddenTime determines how long an object must be lost to remove it from the scene.
- maxLostTime determines how long an object must be lost to remove it from memory.
*/

loader.culler.threshold = 10;
loader.culler.maxHiddenTime = 1000;
loader.culler.maxLostTime = 40000;

/* MD
This is it! Now you should be able to stream your own IFC models and open them anywhere,
no matter how big they are! 💪 We will keep improving and making this API more powerful
to handle any model on any device smoothly.
*/

// DISPOSING ALL - OK

// async function dispose() {
//     await loader.dispose();
//     await fragments.dispose();
// }
//
// window.addEventListener("keydown", async ({code}) => {
//     if(code === "KeyP") {
//         await dispose();
//     } else if(code === "KeyO") {
//         await loadModel(
//             "https://thatopen.github.io/engine_components/resources/dm1_ark.ifc-processed.json",
//             // "https://thatopen.github.io/engine_components/resources/small.ifc-processed-properties.json"
//         );
//         await loadModel(
//             "https://thatopen.github.io/engine_components/resources/dm1_riv.ifc-processed.json",
//             // "https://thatopen.github.io/engine_components/resources/small.ifc-processed-properties.json"
//         );
//     }
// })

// DISPOSING JUST ONE MODEL - OK

// async function disposeOne() {
//     const first = fragments.groups[0];
//     await loader.remove(first.uuid);
//     await fragments.disposeGroup(first);
// }
//
// window.addEventListener("keydown", async ({code}) => {
//     if(code === "KeyP") {
//         await disposeOne();
//     } else if(code === "KeyO") {
//         await loadModel(
//             "https://thatopen.github.io/engine_components/resources/dm1_ark.ifc-processed.json",
//             // "https://thatopen.github.io/engine_components/resources/small.ifc-processed-properties.json"
//         );
//     }
// })

// COORDINATION - OK

// for(const group of fragments.groups) {
//     console.log(group);
//     const {uuid, matrix} = group;
//     loader.culler.setModelTransformation(uuid, matrix);
// }

// BOUNDINGBOX - OK

// const bbox = components.tools.get(OBC.FragmentBoundingBox);
//
// for(const box of loader.culler.boxes.values()) {
//     bbox.addMesh(box.mesh);
// }
//
// const sphere = bbox.getSphere();
//
// window.addEventListener("keydown", () => {
//     components.camera.controls.fitToSphere(sphere, true);
// })

// CLIPPING PLANES - OK

// const clipper = new OBC.EdgesClipper(components);
// clipper.enabled = true;
//
// const salmonFill = new THREE.MeshBasicMaterial({color: 'salmon', side: 2});
// const redLine = new THREE.LineBasicMaterial({ color: 'red' });
// const redOutline = new THREE.MeshBasicMaterial({color: 'red', opacity: 0.2, side: 2, transparent: true});
// const style = clipper.styles.create('Blue lines', new Set(), redLine, salmonFill, redOutline);
//
// loader.onFragmentsDeleted.add((frags) => {
//     for(const frag of frags) {
//         style.meshes.delete(frag.mesh);
//     }
//     clipper.fillsNeedUpdate = true;
// })
//
// loader.onFragmentsLoaded.add((frags) => {
//     for(const frag of frags) {
//         style.meshes.add(frag.mesh);
//     }
//     clipper.fillsNeedUpdate = true;
// })
//
// window.onkeydown = () => {
//     clipper.create();
// }

// FRAGMENT HIDER - OK

// const classifier = new OBC.FragmentClassifier(components);
// for(const model of fragments.groups) {
//     classifier.byStorey(model);
//     classifier.byEntity(model);
// }
//
// const classifications = classifier.get();
//
// const storeys = {};
// const storeyNames = Object.keys(classifications.storeys);
// for (const name of storeyNames) {
//     storeys[name] = true;
// }
//
// const classes = {};
// const classNames = Object.keys(classifications.entities);
// for (const name of classNames) {
//     classes[name] = true;
// }
//
const gui = new dat.GUI();

const actions = {
  clearCache,
};

gui.add(actions, "clearCache");

// const storeysGui = gui.addFolder("Storeys");
// for (const name in storeys) {
//     storeysGui.add(storeys, name).onChange(async (visible) => {
//         const found = await classifier.find({storeys: [name]});
//         loader.setVisibility(visible, found);
//     });
// }
//
// const entitiesGui = gui.addFolder("Classes");
// for (const name in classes) {
//     entitiesGui.add(classes, name).onChange(async (visible) => {
//         const found = await classifier.find({entities: [name]});
//         loader.setVisibility(visible, found);
//     });
// }

// FRAGMENT HIGHLIGHTER - OK

// const highlighter = new OBC.FragmentHighlighter(components, fragments);
// highlighter.setup();
// components.renderer.postproduction.customEffects.outlineEnabled = true;
// highlighter.outlinesEnabled = true;

// FRAGMENT PLANS - OK

// const plans = new OBC.FragmentPlans(components);
// const classifier = new OBC.FragmentClassifier(components);
//
// components.renderer.postproduction.customEffects.outlineEnabled = true;
//
// const whiteColor = new THREE.Color("white");
// const whiteMaterial = new THREE.MeshBasicMaterial({color: whiteColor});
// const materialManager = new OBC.MaterialManager(components);
// materialManager.addMaterial("white", whiteMaterial);
//
// const sectionMaterial = new THREE.LineBasicMaterial({color: 'black'});
// const fillMaterial = new THREE.MeshBasicMaterial({color: 'gray', side: 2});
// const fillOutline = new THREE.MeshBasicMaterial({color: 'black', side: 1, opacity: 0.5, transparent: true});
//
// const clipper = components.tools.get(OBC.EdgesClipper);
// clipper.enabled = true;
// clipper.styles.create("filled", new Set(), sectionMaterial, fillMaterial, fillOutline);
// clipper.styles.create("projected", new Set(), sectionMaterial);
// const styles = clipper.styles.get();
//
// for (const model of fragments.groups) {
//     await plans.computeAllPlanViews(model);
//     classifier.byEntity(model);
//     classifier.byStorey(model);
// }
//
// const found = classifier.find({entities: ["IFCWALLSTANDARDCASE", "IFCWALL"]});
// const walls = new Set(Object.keys(found));
//
// loader.onFragmentsLoaded.add((frags) => {
//     for(const frag of frags) {
//         if(walls.has(frag.id)) {
//             styles.filled.meshes.add(frag.mesh);
//         } else {
//             styles.projected.meshes.add(frag.mesh);
//         }
//         materialManager.addMeshes("white", [frag.mesh]);
//         if(plans.enabled) {
//             materialManager.set(true, ["white"]);
//         }
//         clipper.fillsNeedUpdate = true
//         clipper.updateEdges(true);
//     }
// })
//
// loader.onFragmentsDeleted.add((frags) => {
//     for(const frag of frags) {
//         if(walls.has(frag.id)) {
//             styles.filled.meshes.add(frag.mesh);
//         } else {
//             styles.projected.meshes.add(frag.mesh);
//         }
//         materialManager.removeMeshes("white", [frag.mesh]);
//     }
// })
//
// plans.updatePlansList();
//
// plans.onNavigated.add(() => {
//     components.renderer.postproduction.customEffects.glossEnabled = false;
//     materialManager.setBackgroundColor(whiteColor);
//     materialManager.set(true, ["white"]);
//     grid.visible = false;
// });
//
// plans.onExited.add(() => {
//     components.renderer.postproduction.customEffects.glossEnabled = true;
//     materialManager.resetBackgroundColor();
//     materialManager.set(false, ["white"]);
//     grid.visible = true;
// });
//
// const mainToolbar = new OBC.Toolbar(components);
// mainToolbar.name = "Main Toolbar";
// components.ui.addToolbar(mainToolbar);
// mainToolbar.addChild(plans.uiElement.get('main'));

// FRAGMENT CLIP STYLER

// const clipper = new OBC.EdgesClipper(components);
// clipper.enabled = true;
// const classifier = new OBC.FragmentClassifier(components);
// const styler = new OBC.FragmentClipStyler(components);
// await styler.setup();
//
// for(const model of fragments.groups) {
//     classifier.byEntity(model);
// }
//
// window.onkeydown = () => {
//     clipper.create();
// }
//
// let stylerNeedsUpdate = false;
// setInterval(async () => {
//     if(stylerNeedsUpdate) {
//         await styler.update();
//         stylerNeedsUpdate = false;
//     }
// }, 10000)
//
// loader.onFragmentsDeleted.add((frags) => {
//     stylerNeedsUpdate = true;
// })
//
// loader.onFragmentsLoaded.add((frags) => {
//     stylerNeedsUpdate = true;
// })
//
// const postproduction = components.renderer.postproduction;
// postproduction.customEffects.outlineEnabled = true;

// PROPERTIES PROCESSOR - OK

// const highlighter = new OBC.FragmentHighlighter(components, fragments);
// highlighter.setup();
// components.renderer.postproduction.customEffects.outlineEnabled = true;
// highlighter.outlinesEnabled = true;
//
// const propsProcessor = components.tools.get(OBC.IfcPropertiesProcessor);
// propsProcessor.uiElement.get("propertiesWindow").visible = true
//
// const highlighterEvents = highlighter.events;
// highlighterEvents.select.onClear.add(() => {
//     propsProcessor.cleanPropertiesList();
// });
//
// highlighterEvents.select.onHighlight.add(
//     (selection) => {
//         const fragmentID = Object.keys(selection)[0];
//         const expressID = [...selection[fragmentID]][0];
//         let model
//         for (const group of fragments.groups) {
//             for(const [_key, value] of group.keyFragments) {
//                 if(value === fragmentID) {
//                     model = group;
//                     break;
//                 }
//             }
//         }
//         if(model) {
//             propsProcessor.renderProperties(model, expressID);
//         }
//     }
// );

// loader.culler.renderDebugFrame = true;
// const debugFrame = loader.culler.renderer.domElement;
// document.body.appendChild(debugFrame);
// debugFrame.style.position = "fixed";
// debugFrame.style.left = "0";
// debugFrame.style.bottom = "0";

// Set up stats

const stats = new Stats();
stats.showPanel(2);
document.body.append(stats.dom);
stats.dom.style.left = "0px";
world.renderer.onBeforeUpdate.add(() => stats.begin());
world.renderer.onAfterUpdate.add(() => stats.end());
