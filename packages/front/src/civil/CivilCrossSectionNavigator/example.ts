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

const fragments = new OBC.FragmentsManager(components);
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

const navigator = new OBC.CivilPlanNavigator(components);
const horizontalWindow = navigator.uiElement.get("floatingWindow");
horizontalWindow.visible = true;

navigator.draw(model);

const elevationNavigator = new OBC.CivilElevationNavigator(components);
const drawer = elevationNavigator.uiElement.get("drawer");
drawer.visible = true;

const navigator3D = new OBC.Civil3DNavigator(components);
navigator3D.draw(model);
navigator3D.setup();

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

/*
### 🌍 Exploring Civil Cross Sections with Navigators

**🔧 Setting up Civil Cross Section Navigator**
    ___
    The Cross Section Navigator is a tool that will allow you to clearly visualize
    the cross section of any civil IFC model, in any point selected in an alignment.
    Let's begin!

    **Important**: This tool requires the Civil 3D Navigator and the Civil Plan Navigator
    tools to be initialized beforehand. Make sure to check out those respective tutorials
    before proceeding.

    We'll start by setting up the navigator component within our scene.
*/

const crossNavigator = new OBC.CivilCrossSectionNavigator(components);

/*
**🌅 Defining the UI for the tool**
    ___
    The UI element to be used with this tool is a floating window, so let's
    define it and introduce it to our scene.
*/

const crossWindow = crossNavigator.uiElement.get("floatingWindow");
crossWindow.visible = true;

/*
  And that's it! You've successfully set up the Civil Cross Section Navigator.
  Go ahead and interact with the Horizontal Alignment Window in any point of an alignment,
  and the cross section of the selected area will be displayed in the Cross Section Window.
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

const classifier = new OBC.FragmentClassifier(components);
classifier.byEntity(model);

const classifications = classifier.get();

const clipper = components.tools.get(OBC.ClipEdges);
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
