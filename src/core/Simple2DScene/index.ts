import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import {
  Component,
  Updateable,
  UI,
  Disposable,
  Event,
  UIElement,
} from "../../base-types";
import { Button, Canvas, FloatingWindow } from "../../ui";
import { Components } from "../Components";

// TODO: Decouple from UI components and make 2 variants: floating (this one) and drawer

export class Simple2DScene
  extends Component<THREE.Scene>
  implements UI, Updateable, Disposable
{
  static readonly uuid = "b48b7194-0f9a-43a4-a718-270b1522595f" as const;

  readonly onAfterUpdate = new Event();
  readonly onBeforeUpdate = new Event();

  /** {@link Component.enabled} */
  enabled = true;

  /** {@link UI.uiElement} */
  uiElement = new UIElement<{
    main: Button;
    mainWindow: FloatingWindow;
    canvas: Canvas;
  }>();

  controls: OrbitControls;

  private readonly _scene: THREE.Scene;
  private readonly _camera: THREE.OrthographicCamera;
  private readonly _renderer: THREE.WebGLRenderer;
  private readonly _grid: THREE.GridHelper;
  private readonly _size: { width: number; height: number };
  private readonly _frustumSize = 50;

  constructor(components: Components) {
    super(components);

    if (!components.ui.enabled) {
      throw new Error(
        "The Simple2DScene component needs to use UI elements (TODO: Decouple from them)."
      );
    }

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
    main.onClick.add(() => {
      mainWindow.visible = !mainWindow.visible;
    });

    this.uiElement.set({ mainWindow, main, canvas });

    this._scene = new THREE.Scene();

    this._grid = new THREE.GridHelper(1000, 1000);
    this._grid.rotation.x = Math.PI / 2;
    this._scene.add(this._grid);

    this._size = {
      width: mainWindow.domElement.clientWidth,
      height: mainWindow.domElement.clientHeight,
    };

    const { width, height } = this._size;

    // Creates the camera (point of view of the user)
    this._camera = new THREE.OrthographicCamera(75, width / height);
    this._camera.position.z = 10;

    this._renderer = new THREE.WebGLRenderer({ canvas: canvas.get() });
    this._renderer.setSize(width, height);
    this._renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Creates the orbit controls (to navigate the scene)

    this.controls = new OrbitControls(this._camera, this._renderer.domElement);
    this.controls.target.set(0, 0, 0);
    this.controls.enableRotate = false;
    this.controls.enableZoom = true;

    const parent = this.uiElement.get("canvas").parent;
    if (parent) {
      parent.domElement.classList.remove("p-4");
      parent.domElement.classList.remove("overflow-auto");
      parent.domElement.classList.add("overflow-hidden");
      parent.domElement.classList.add("h-full");
    }

    mainWindow.onResized.add(this.resize);

    mainWindow.domElement.style.width = "20rem";
    mainWindow.domElement.style.height = "20rem";
  }

  /** {@link Component.get} */
  get() {
    return this._scene;
  }

  async dispose() {
    this._renderer.dispose();
    this._grid.dispose();
    this.uiElement.dispose();
  }

  update() {
    this.controls.update();
    this._renderer.render(this._scene, this._camera);
  }

  resize = () => {
    const parent = this.uiElement.get("canvas").parent;
    if (!parent) return;
    const { clientWidth, clientHeight } = parent.domElement;
    this._size.width = clientWidth;
    this._size.height = clientHeight;
    const { width, height } = this._size;
    const aspect = width / height;
    this._camera.left = (-this._frustumSize * aspect) / 2;
    this._camera.right = (this._frustumSize * aspect) / 2;
    this._camera.top = this._frustumSize / 2;
    this._camera.bottom = -this._frustumSize / 2;
    this._camera.updateProjectionMatrix();
    this._camera.updateProjectionMatrix();
    this._renderer.setSize(this._size.width, this._size.height);
  };
}
