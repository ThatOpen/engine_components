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

const file = await fetch("../../../../../resources/civil-example.frag");
const data = await file.arrayBuffer();
const buffer = new Uint8Array(data);
const model = await fragments.load(buffer);

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

const planNavigator = new OBC.CivilPlanNavigator(components);
const horizontalWindow = planNavigator.uiElement.get("floatingWindow");
horizontalWindow.visible = true;
planNavigator.draw(model);

/*
### 🌍 Exploring Civil Elevation View with Navigators

**🔧 Setting up Civil Elevation Navigator**
    ___
    The Elevation Navigator is a tool that allows exploration and visualization of
    the alignments in a civil IFC file, by creating a drawer that shows their
    its elevation view. Let's get into it!

    **Important**: This tool requires the Civil 3D Navigator and the Civil Plan Navigator
    tools to be initialized beforehand. Make sure to check out those respective tutorials
    before proceeding.

    We'll start by setting up the navigator component within our scene.
*/

const elevationNavigator = new OBC.CivilElevationNavigator(components);

/*
**🌅 Defining the UI for the tool**
    ___
    The UI element to be used with this tool is a drawer element, so let's
    define it and introduce it to our scene.
*/

const drawer = elevationNavigator.uiElement.get("drawer");
drawer.visible = true;

planNavigator.onHighlight.add(({ mesh }) => {
  /*
  **🖌️ Configuring Navigator Highlighting**
      ___
      Finally, the following lines are added to the highlighter tool defined
      previously for the Plan Navigator. These lines provide visual objects
      specific to the Elevation Navigator, improving user experience.
  */
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

/*
  That's it! We're done setting up the Civil Elevation Navigator. Now you can
  interact with any alignment in the Horizontal Alignment Window, and the Elevation
  View of that specific alignment will be displayed in the Elevation Window.
*/

const stats = new Stats();
stats.showPanel(2);
document.body.append(stats.dom);
stats.dom.style.left = "0px";
rendererComponent.onBeforeUpdate.add(() => stats.begin());
rendererComponent.onAfterUpdate.add(() => stats.end());
