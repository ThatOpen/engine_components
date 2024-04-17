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

<<<<<<< HEAD
const file = await fetch("../../../../../resources/civil-example.frag");
=======
const file = await fetch("../../../resources/asdf.frag");
>>>>>>> 1.6.0-that-open
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

/*
### 🌍 Exploring Civil Plan View with Navigators

**🔧 Setting up Civil Plan Navigator**
    ___
    The Plan Navigator is a tool that allows exploration and visualization of
    the alignments in a civil IFC file, by creating a window that shows their
    plan view. Let's explore it!

    **Important**: This tool requires the Civil 3D Navigator tool to be
    initialized beforehand. Make sure to check out that respective tutorial
    before proceeding.

    We'll start by setting up the navigator component within our scene and
    adding our civil model to it.
*/

const planNavigator = new OBC.CivilPlanNavigator(components);
planNavigator.draw(model);

/*
**🌅 Defining the UI for the tool**
    ___
    The UI element to be used with this tool is a floating window, so let's
    define it and introduce it to our scene.
*/

const horizontalWindow = planNavigator.uiElement.get("floatingWindow");
horizontalWindow.visible = true;

/*
**🖌️ Configuring Navigator Highlighting**
    ___
    Finally, we configure a highlighter to be able to interact with the
    alignments shown in the navigator. This will provide multiple visual objects
    when navigating through the model, making the experience more intuitive.
*/

planNavigator.onHighlight.add(({ mesh }) => {
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
  And we're done! You've successfully set up the Civil Plan Navigator.
  Now you can interact with the Horizontal Alignment Window. Now try adding
  some other compatible tools like the Civil Elevation Navigator and the
  Civil Cross Section Navigator.🚀
*/

const stats = new Stats();
stats.showPanel(2);
document.body.append(stats.dom);
stats.dom.style.left = "0px";
rendererComponent.onBeforeUpdate.add(() => stats.begin());
rendererComponent.onAfterUpdate.add(() => stats.end());
