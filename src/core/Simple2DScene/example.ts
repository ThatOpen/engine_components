import * as THREE from "three";
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

const scene = components.scene.get();

cameraComponent.controls.setLookAt(10, 10, 10, 0, 0, 0);

// @ts-ignore
const grid = new OBC.SimpleGrid(components);

const boxMaterial = new THREE.MeshStandardMaterial({ color: "#6528D7" });
const boxGeometry = new THREE.BoxGeometry(3, 3, 3);
const cube = new THREE.Mesh(boxGeometry, boxMaterial);
cube.position.set(0, 1.5, 0);
scene.add(cube);

/* MD
  ### 🎨 Draw in 2D on top of 3D!
  ___
  The `Simple2DScene` component is an easy way to represent 2D data
  using the same tools and API that you use for 3D. Using it is
  super simple: just create a new instance and you can start
  adding things to it!

  :::tip Drawing 2D with THREE.js?

  Yes! 2D is just a specific case of 3D. So we can use exactly the same
  libraries and tools to display 2D data easily.

  :::

  The first step is to create a instance of the `Simple2DScene` component:

  */

const simple2dScene = new OBC.Simple2DScene(components);

/* MD
  Great! Now we can start adding things to it, just like we would with the
  3D scene. We will create a cube some lights and a grid: 💡🧊
  */

const cube2 = new THREE.Mesh(boxGeometry, boxMaterial);
const scene2d = simple2dScene.get();
scene2d.add(cube2);

const directionalLight2 = new THREE.DirectionalLight();
directionalLight2.position.set(5, 10, 3);
directionalLight2.intensity = 0.5;
scene2d.add(directionalLight2);

const ambientLight2 = new THREE.AmbientLight();
ambientLight2.intensity = 0.5;
scene2d.add(ambientLight2);

// window.ondblclick = () => {
// 	simple2dScene.scaleY += 0.1;
// }

/* MD
  ### 💅 Creating the UI
  ___
  The `Simple2DScene` comes with a button to easily turn it on and off.
  Let's create a simple toolbar and add it to the scene:
  */

const mainWindow = new OBC.FloatingWindow(components);
components.ui.add(mainWindow);
mainWindow.visible = false;
mainWindow.domElement.style.height = "20rem";
mainWindow.addChild(simple2dScene.uiElement.get("container"));

mainWindow.onResized.add(() => simple2dScene.grid.regenerate());

rendererComponent.onAfterUpdate.add(() => {
  if (mainWindow.visible) {
    simple2dScene.update();
  }
});

mainWindow.slots.content.domElement.style.padding = "0";
mainWindow.slots.content.domElement.style.overflow = "hidden";

mainWindow.onResized.add(() => {
  const { width, height } = mainWindow.containerSize;
  simple2dScene.setSize(height, width);
});

mainWindow.domElement.style.width = "20rem";
mainWindow.domElement.style.height = "20rem";

mainWindow.onVisible.add(() => {
  if (mainWindow.visible) {
    const { width, height } = mainWindow.containerSize;
    simple2dScene.setSize(height, width);
    simple2dScene.grid.regenerate();
  }
});

const mainButton = new OBC.Button(components);
mainButton.materialIcon = "fact_check";
mainButton.tooltip = "2D scene";
mainButton.onClick.add(() => {
  mainWindow.visible = !mainWindow.visible;
});

const mainToolbar = new OBC.Toolbar(components);
components.ui.addToolbar(mainToolbar);
mainToolbar.addChild(mainButton);

/* MD
  That's it! Great work. Now you can easily draw 2D graphics with the same
  API and expose them to your end users. 🥳
  */
