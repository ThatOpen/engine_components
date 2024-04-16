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
### 🌍 Creating a 3D World with Civil 3D Navigator

**🔧 Setting up Civil 3D Navigator**
    ___
    Now that we've established our simple scene, let's integrate the
    Civil 3D Navigator to explore our 3D model further. First, we need to
    create an instance of the Civil 3D Navigator component. This will enable
    us to navigate through our 3D environment and interact with the model.
*/

const navigator = new OBC.Civil3DNavigator(components);
navigator.draw(model);
navigator.setup();

/*
**🖌️ Configuring Navigator Highlighting**
    ___
    To enhance user interaction, we'll configure highlighting for
    civil elements within the navigator. This will provide visual feedback
    when interacting with civil elements, making the experience more intuitive.
*/

navigator.highlighter.hoverCurve.material.color.set(1, 1, 1);

const { material: hoverPointsMaterial } = navigator.highlighter.hoverPoints;
if (Array.isArray(hoverPointsMaterial)) {
  const material = hoverPointsMaterial[0];
  if ("color" in material) (material.color as THREE.Color).set(1, 1, 1);
} else if ("color" in hoverPointsMaterial)
  (hoverPointsMaterial.color as THREE.Color).set(1, 1, 1);

/*
**⚪ Highlight Sphere**
    ___
    A sphere object is defined and introduced to the scene everytime the
    user interacts with the alignments. Try it out!
*/

const sphere = new THREE.Sphere(undefined, 20);

navigator.onHighlight.add(({ point }) => {
  sphere.center.copy(point);
  cameraComponent.controls.fitToSphere(sphere, true);
});

/*
  With that, we finished! You've successfully created a Navigator compatible
  with Civil elements and other Civil components.
*/

const stats = new Stats();
stats.showPanel(2);
document.body.append(stats.dom);
stats.dom.style.left = "0px";
rendererComponent.onBeforeUpdate.add(() => stats.begin());
rendererComponent.onAfterUpdate.add(() => stats.end());
