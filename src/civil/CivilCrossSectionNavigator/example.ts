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

const file = await fetch("../../../resources/asdf.frag");
const data = await file.arrayBuffer();
const buffer = new Uint8Array(data);
const model = await fragments.load(buffer);
const properties = await fetch("../../../resources/asdf.json");
model.setLocalProperties(await properties.json());

const mainToolbar = new OBC.Toolbar(components, {
  name: "Main Toolbar",
  position: "bottom",
});
components.ui.addToolbar(mainToolbar);
mainToolbar.addChild(fragmentIfcLoader.uiElement.get("main"));

console.log(model);

/*
### 🌍 Exploring Civil Cross Sections with Navigators

**🔧 Setting up Civil Cross Section Navigator**
    ___
    Let's dive into exploring cross sections of our civil plans using the
    Civil Cross Section Navigator. We'll start by setting up the navigator
    component within our scene.
*/

const navigator = new OBC.CivilPlanNavigator(components);
const horizontalWindow = navigator.uiElement.get("floatingWindow");
horizontalWindow.visible = true;

/*
**🗺️ Drawing the Model**
    ___
    With the Civil Cross Section Navigator initialized, we can now draw our
    model within the navigator. This step prepares the model for exploration
    through cross sections.
*/

navigator.draw(model);

/*
**📈 Setting up Elevation Navigator**
    ___
    Next, we'll set up the Elevation Navigator component to explore
    elevation views of our model. Similar to the Civil Cross Section
    Navigator, we'll configure the drawer to be visible and draw the model.
*/

const elevationNavigator = new OBC.CivilElevationNavigator(components);
const drawer = elevationNavigator.uiElement.get("drawer");
drawer.visible = true;

/*
Civil 3D Navigator - Check out the tutorial for this specific tool
*/

const navigator3D = new OBC.Civil3DNavigator(components);
navigator3D.draw(model);
navigator3D.setup();

/*
**🎨 Customizing Highlighting**
    ___
    To enhance interaction, we'll configure highlighting for elements
    within the 3D scene and elevation views. This provides visual
    feedback during navigation and selection.
*/

navigator3D.highlighter.hoverCurve.material.color.set(1, 1, 1);
const { material: hoverPointsMaterial } = navigator.highlighter.hoverPoints;
if (Array.isArray(hoverPointsMaterial)) {
  const material = hoverPointsMaterial[0];
  if ("color" in material) (material.color as THREE.Color).set(1, 1, 1);
} else if ("color" in hoverPointsMaterial)
  (hoverPointsMaterial.color as THREE.Color).set(1, 1, 1);

navigator.onHighlight.add(({ mesh }) => {
  elevationNavigator.clear();
  elevationNavigator.draw(model, [mesh.curve.alignment]);
  elevationNavigator.highlighter.select(mesh);
  navigator3D.highlighter.select(mesh);

  const index = mesh.curve.index;
  const curve3d = mesh.curve.alignment.absolute[index];
  curve3d.mesh.geometry.computeBoundingSphere();
  cameraComponent.controls.fitToSphere(
    curve3d.mesh.geometry.boundingSphere,
    true,
  );
});

const crossNavigator = new OBC.CivilCrossSectionNavigator(components);
const crossWindow = crossNavigator.uiElement.get("floatingWindow");
crossWindow.visible = true;

/*
**📍 Marker Interaction**
    ___
    We'll set up marker interaction between different navigators.
    This allows for synchronized marker updates and selection across
    elevation, 3D, and cross-section views.
*/

navigator.onMarkerChange.add(({ alignment, percentage, type, curve }) => {
  elevationNavigator.setMarker(alignment, percentage, type);
  navigator3D.setMarker(alignment, percentage, type);

  if (type === "select") {
    const mesh = curve.alignment.absolute[curve.index].mesh;
    const point = alignment.getPointAt(percentage, "absolute");
    crossNavigator.set(mesh, point);
  }
});

navigator.onMarkerHidden.add(({ type }) => {
  elevationNavigator.hideMarker(type);
  navigator3D.hideMarker(type);
});

window.addEventListener("keydown", () => {
  elevationNavigator.scene.scaleY += 0.1;
});

/*
**🛠️ Customizing Fragment Classifications**
    ___
    Finally, we'll customize fragment classifications to categorize and
    style elements within the model. This step helps organize and visualize
    different components of the model.
*/

const classifier = new OBC.FragmentClassifier(components);
classifier.byEntity(model);

const classifications = classifier.get();

const clipper = components.tools.get(OBC.EdgesClipper);
const styles = clipper.styles.get();

for (const category in classifications.entities) {
  const found = classifier.find({ entities: [category] });

  const color = new THREE.Color(Math.random(), Math.random(), Math.random());

  const lineMaterial = new THREE.LineBasicMaterial({ color });
  clipper.styles.create(category, new Set(), lineMaterial);

  for (const fragID in found) {
    const foundFrag = fragments.list[fragID];
    if (!foundFrag) {
      continue;
    }
    styles[category].fragments[fragID] = new Set(found[fragID]);
    styles[category].meshes.add(foundFrag.mesh);
  }
}

const stats = new Stats();
stats.showPanel(2);
document.body.append(stats.dom);
stats.dom.style.left = "0px";
rendererComponent.onBeforeUpdate.add(() => stats.begin());
rendererComponent.onAfterUpdate.add(() => stats.end());
