import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import {
  Component,
  Updateable,
  UI,
  Disposable,
  Event,
  UIElement,
  Resizeable,
} from "../../base-types";
import { Button, Canvas, FloatingWindow } from "../../ui";
import { Components } from "../Components";

// TODO: Decouple from floating window so it can be used anywhere (eg. on drawers)

/**
 * A simple floating 2D scene that you can use to easily draw 2D graphics
 * with all the power of Three.js.
 */
export class Simple2DScene
  extends Component<THREE.Scene>
  implements UI, Updateable, Disposable, Resizeable
{
  static readonly uuid = "b48b7194-0f9a-43a4-a718-270b1522595f" as const;

  /** {@link Updateable.onAfterUpdate} */
  readonly onAfterUpdate = new Event();

  /** {@link Updateable.onBeforeUpdate} */
  readonly onBeforeUpdate = new Event();

  /** {@link Resizeable.onResize} */
  onResize = new Event<THREE.Vector2>();

  /** {@link Component.enabled} */
  enabled = true;

  /** {@link UI.uiElement} */
  uiElement = new UIElement<{
    main: Button;
    mainWindow: FloatingWindow;
    canvas: Canvas;
  }>();

  /** The camera controls that move around in the scene. */
  controls: OrbitControls;

  private readonly _scene: THREE.Scene;
  private readonly _camera: THREE.OrthographicCamera;
  private readonly _renderer: THREE.WebGLRenderer;
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

  /**
   * {@link Component.get}
   * @returns the 2D scene.
   */
  get() {
    return this._scene;
  }

  /** {@link Disposable.dispose} */
  async dispose() {
    this._renderer.dispose();
    await this.uiElement.dispose();
  }

  /** {@link Updateable.update} */
  async update() {
    await this.onBeforeUpdate.trigger();
    this.controls.update();
    this._renderer.render(this._scene, this._camera);
    await this.onAfterUpdate.trigger();
  }

  /** {@link Resizeable.getSize} */
  getSize() {
    return new THREE.Vector2(this._size.width, this._size.height);
  }

  /** {@link Resizeable.resize} */
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
