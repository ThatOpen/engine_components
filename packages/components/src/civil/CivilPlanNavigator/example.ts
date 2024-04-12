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

rendererComponent.postproduction.enabled = true;
rendererComponent.postproduction.customEffects.outlineEnabled = true;

cameraComponent.controls.setLookAt(12, 6, 8, 0, 0, -10);

const grid = new OBC.SimpleGrid(components, new THREE.Color(0x666666));
const customEffects = rendererComponent.postproduction.customEffects;
customEffects.excludedMeshes.push(grid.get());

const fragments = new OBC.FragmentManager(components);
const fragmentIfcLoader = new OBC.FragmentIfcLoader(components);

fragmentIfcLoader.settings.wasm = {
  path: "https://unpkg.com/web-ifc@0.0.50/",
  absolute: true,
};

fragmentIfcLoader.settings.webIfc.COORDINATE_TO_ORIGIN = true;
fragmentIfcLoader.settings.webIfc.OPTIMIZE_PROFILES = true;

// 2. IFC 4 fragment integration

const file = await fetch("../../../resources/asdf.frag");
const data = await file.arrayBuffer();
const buffer = new Uint8Array(data);
const model = await fragments.load(buffer);

// 3. Horizontal alignment

const planNavigator = new OBC.CivilPlanNavigator(components);
const horizontalWindow = planNavigator.uiElement.get("floatingWindow");
horizontalWindow.visible = true;
planNavigator.draw(model);

// 4. Vertical alignment

const elevationNavigator = new OBC.CivilElevationNavigator(components);
const drawer = elevationNavigator.uiElement.get("drawer");
drawer.visible = true;

// 4.5 Set scene elevation in horizontal
// planNavigator.elevation = elevationNavigator.scene.scene;

// 5. 3D alignment

const navigator = new OBC.Civil3DNavigator(components);
navigator.draw(model);
navigator.setup();
navigator.highlighter.hoverCurve.material.color.set(1, 1, 1);
const { material: hoverPointsMaterial } = navigator.highlighter.hoverPoints;
if (Array.isArray(hoverPointsMaterial)) {
  const material = hoverPointsMaterial[0];
  if ("color" in material) (material.color as THREE.Color).set(1, 1, 1);
} else if ("color" in hoverPointsMaterial)
  (hoverPointsMaterial.color as THREE.Color).set(1, 1, 1);

// 6. Cross section

// const crossNavigator = new OBC.CivilCrossSectionNavigator(components);
// const crossWindow = crossNavigator.uiElement.get("floatingWindow");
// crossWindow.visible = true;

// const classifier = new OBC.FragmentClassifier(components);
// classifier.byEntity(model);

// const classifications = classifier.get();

// const clipper = components.tools.get(OBC.EdgesClipper);
// const styles = clipper.styles.get();

// for (const category in classifications.entities) {
//   const found = classifier.find({ entities: [category] });

//   const color = new THREE.Color(
//     Math.random(),
//     Math.random(),
//     Math.random()
//   );

//   const lineMaterial = new THREE.LineBasicMaterial({ color });
//   clipper.styles.create(category, new Set(), lineMaterial);

//   for (const fragID in found) {
//     const foundFrag = fragments.list[fragID];
//     if(!foundFrag) {
//       continue;
//     }
//     styles[category].fragments[fragID] = new Set(found[fragID]);
//     styles[category].meshes.add(foundFrag.mesh);
//   }
// }

// // 7. Synchronization

// const sphere = new THREE.Sphere(undefined, 20);

planNavigator.onHighlight.add(({ mesh }) => {
  elevationNavigator.clear();
  elevationNavigator.draw(model, [mesh.curve.alignment]);
  elevationNavigator.highlighter.select(mesh);

  navigator.highlighter.select(mesh);

  const index = mesh.curve.index;
  const curve3d = mesh.curve.alignment.absolute[index];
  curve3d.mesh.geometry.computeBoundingSphere();
  cameraComponent.controls.fitToSphere(
    curve3d.mesh.geometry.boundingSphere,
    true,
  );
});

// planNavigator.onMarkerChange.add(({ alignment, percentage, type, curve }) => {
//   elevationNavigator.setMarker(alignment, percentage, type);
//   navigator3D.setMarker(alignment, percentage, type);

//   if(type === "select") {
//     const mesh = curve.alignment.absolute[curve.index].mesh;
//     const point = alignment.getPointAt(percentage, "absolute");
//     crossNavigator.set(mesh, point);
//   }
// })

// window.addEventListener("keydown", () => {
//   elevationNavigator.scene.scaleY += 0.2;
// })

// const hider = new OBC.FragmentHider(components);
// await hider.loadCached();
// mainToolbar.addChild(hider.uiElement.get("main"));

const stats = new Stats();
stats.showPanel(2);
document.body.append(stats.dom);
stats.dom.style.left = "0px";
rendererComponent.onBeforeUpdate.add(() => stats.begin());
rendererComponent.onAfterUpdate.add(() => stats.end());
