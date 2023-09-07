import * as THREE from "three";
import { MapControls } from "three/examples/jsm/controls/MapControls";
import { Component, Updateable, UI, Disposable, Event } from "../../base-types";
import { Button, Canvas, FloatingWindow, SimpleUIComponent } from "../../ui";
import { Components } from "../Components";
import { SimpleGrid } from "../SimpleGrid";

export class Simple2DScene
  extends Component<void>
  implements UI, Updateable, Disposable
{
  uiElement: {
    main: Button;
    mainWindow: FloatingWindow;
    container: SimpleUIComponent;
  };

  enabled = true;

  afterUpdate = new Event();
  beforeUpdate = new Event();

  name = "Simple2DScene";

  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  renderer: THREE.WebGLRenderer;
  grid: SimpleGrid;
  controls: MapControls;

  constructor(components: Components) {
    super();

    const container = new SimpleUIComponent(components);
    container.domElement.className = "h-screen max-h-full max-w-full";

    const canvas = new Canvas(components);
    container.addChild(canvas);

    const mainWindow = new FloatingWindow(components);
    components.ui.add(mainWindow);
    mainWindow.visible = false;
    mainWindow.domElement.style.height = "20rem";

    mainWindow.addChild(container);

    const main = new Button(components);
    main.materialIcon = "fact_check";
    main.tooltip = "2D scene";
    main.onclick = () => {
      mainWindow.visible = !mainWindow.visible;
    };

    this.uiElement = { mainWindow, main, container };

    this.scene = new THREE.Scene();

    this.grid = new SimpleGrid(components);
    const grid = this.grid.get();
    this.scene.add(grid);

    const size = {
      width: mainWindow.domElement.clientWidth,
      height: mainWindow.domElement.clientHeight,
    };

    // Creates the camera (point of view of the user)
    this.camera = new THREE.PerspectiveCamera(75, size.width / size.height);
    this.camera.position.z = 15;
    this.camera.position.y = 13;
    this.camera.position.x = 8;

    this.renderer = new THREE.WebGLRenderer({ canvas: canvas.get() });
    this.renderer.setSize(size.width, size.height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Creates the orbit controls (to navigate the scene)
    this.controls = new MapControls(this.camera, canvas.get());
    this.controls.enableDamping = true;
    this.controls.target.set(-2, 0, 0);
    this.controls.maxPolarAngle = Math.PI / 2;
    this.controls.minPolarAngle = Math.PI / 2;

    mainWindow.onResized.on(() => {
      size.width = container.domElement.clientWidth;
      size.height = container.domElement.clientHeight;
      this.camera.aspect = size.width / size.height;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(size.width, size.height);
    });
  }

  get() {}

  dispose() {
    this.renderer.dispose();
    this.grid.dispose();
  }

  update() {
    this.controls.update();
    this.renderer.render(this.scene, this.camera);
  }
}
