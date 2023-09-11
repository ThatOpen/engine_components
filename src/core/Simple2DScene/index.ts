import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { Component, Updateable, UI, Disposable, Event } from "../../base-types";
import { Button, Canvas, FloatingWindow } from "../../ui";
import { Components } from "../Components";

export class Simple2DScene
  extends Component<void>
  implements UI, Updateable, Disposable
{
  uiElement: {
    main: Button;
    mainWindow: FloatingWindow;
    canvas: Canvas;
  };

  enabled = true;

  afterUpdate = new Event();
  beforeUpdate = new Event();

  name = "Simple2DScene";

  scene: THREE.Scene;
  camera: THREE.OrthographicCamera;
  renderer: THREE.WebGLRenderer;
  grid: THREE.GridHelper;
  controls: OrbitControls;
  frustumSize = 50;

  size: { width: number; height: number };

  constructor(components: Components) {
    super();

    const canvas = new Canvas(components);
    canvas.domElement.classList.remove("absolute");

    const mainWindow = new FloatingWindow(components);
    components.ui.add(mainWindow);
    mainWindow.visible = false;
    mainWindow.domElement.style.height = "20rem";

    mainWindow.addChild(canvas);

    const main = new Button(components);
    main.materialIcon = "fact_check";
    main.tooltip = "2D scene";
    main.onclick = () => {
      mainWindow.visible = !mainWindow.visible;
    };

    this.uiElement = { mainWindow, main, canvas };

    this.scene = new THREE.Scene();

    this.grid = new THREE.GridHelper(1000, 1000);
    this.grid.rotation.x = Math.PI / 2;
    this.scene.add(this.grid);

    this.size = {
      width: mainWindow.domElement.clientWidth,
      height: mainWindow.domElement.clientHeight,
    };

    const { width, height } = this.size;

    // Creates the camera (point of view of the user)
    this.camera = new THREE.OrthographicCamera(75, width / height);
    this.camera.position.z = 10;

    this.renderer = new THREE.WebGLRenderer({ canvas: canvas.get() });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Creates the orbit controls (to navigate the scene)

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.target.set(0, 0, 0);
    this.controls.enableRotate = false;
    this.controls.enableZoom = true;

    const parent = this.uiElement.canvas.parent;
    if (parent) {
      parent.domElement.classList.remove("p-4");
      parent.domElement.classList.remove("overflow-auto");
      parent.domElement.classList.add("overflow-hidden");
      parent.domElement.classList.add("h-full");
    }

    mainWindow.onResized.on(this.resize);

    mainWindow.domElement.style.width = "20rem";
    mainWindow.domElement.style.height = "20rem";
  }

  get() {}

  dispose() {
    this.renderer.dispose();
    this.grid.dispose();
    this.uiElement.main.dispose();
    this.uiElement.canvas.dispose();
    this.uiElement.mainWindow.dispose();
  }

  update() {
    this.controls.update();
    this.renderer.render(this.scene, this.camera);
  }

  resize = () => {
    const parent = this.uiElement.canvas.parent;
    if (!parent) return;
    const { clientWidth, clientHeight } = parent.domElement;
    this.size.width = clientWidth;
    this.size.height = clientHeight;
    const { width, height } = this.size;
    const aspect = width / height;
    this.camera.left = (-this.frustumSize * aspect) / 2;
    this.camera.right = (this.frustumSize * aspect) / 2;
    this.camera.top = this.frustumSize / 2;
    this.camera.bottom = -this.frustumSize / 2;
    this.camera.updateProjectionMatrix();
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(this.size.width, this.size.height);
  };
}
