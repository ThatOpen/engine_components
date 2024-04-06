import * as THREE from "three";
import CameraControls from "camera-controls";
import {
  Component,
  Updateable,
  UI,
  Disposable,
  Event,
  UIElement,
  Resizeable,
} from "../../base-types";
import { SimpleUIComponent } from "../../ui";
import { Components } from "../Components";
import { Disposer } from "../Disposer";
import { SimpleRenderer } from "../SimpleRenderer";
import { PostproductionRenderer } from "../../navigation/PostproductionRenderer";
import { Infinite2dGrid } from "./src";

// TODO: Make a scene manager as a Tool (so that it as an UUID)

/**
 * A simple floating 2D scene that you can use to easily draw 2D graphics
 * with all the power of Three.js.
 */
export class Simple2DScene
  extends Component<THREE.Group>
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

  /** {@link Disposable.onDisposed} */
  readonly onDisposed = new Event<string>();

  /** {@link UI.uiElement} */
  uiElement = new UIElement<{
    container: SimpleUIComponent;
  }>();

  /** The camera controls that move around in the scene. */
  readonly controls: CameraControls;

  /** The camera that renders the scene. */
  readonly camera: THREE.OrthographicCamera;

  readonly scene: THREE.Scene;

  renderer: SimpleRenderer | PostproductionRenderer;

  grid: Infinite2dGrid;

  private _scaleX = 1;
  private _scaleY = 1;
  private readonly _root = new THREE.Group();
  private readonly _size = new THREE.Vector2();
  private readonly _frustumSize = 50;

  get size() {
    return this._size.clone();
  }

  get scaleX() {
    return this._scaleX;
  }

  set scaleX(value: number) {
    this._scaleX = value;
    this._root.scale.x = value;
    this.grid.scaleX = value;
    this.grid.regenerate();
  }

  get scaleY() {
    return this._scaleY;
  }

  set scaleY(value: number) {
    this._scaleY = value;
    this._root.scale.y = value;
    this.grid.scaleY = value;
    this.grid.regenerate();
  }

  constructor(components: Components, postproduction = false) {
    super(components);

    if (!components.uiEnabled) {
      throw new Error(
        "The Simple2DScene component needs to use UI elements (TODO: Decouple from them)."
      );
    }

    const container = new SimpleUIComponent(components);
    container.domElement.classList.add("relative");
    this.uiElement.set({ container });

    this.scene = new THREE.Scene();

    this._size.set(window.innerWidth, window.innerHeight);
    const { width, height } = this._size;

    // Creates the camera (point of view of the user)
    const aspect = width / height;
    const halfSize = this._frustumSize * 0.5;

    this.camera = new THREE.OrthographicCamera(
      -halfSize * aspect,
      halfSize * aspect,
      halfSize,
      -halfSize,
      -1000,
      1000
    );

    this.scene.add(this.camera);
    this.camera.position.z = 10;

    const domContainer = container.domElement;

    this.scene.add(this._root);

    this.grid = new Infinite2dGrid(this.camera, domContainer);
    const gridObject = this.grid.get();
    this.scene.add(gridObject);

    if (postproduction) {
      this.renderer = new PostproductionRenderer(this.components, domContainer);
    } else {
      this.renderer = new SimpleRenderer(this.components, domContainer);
    }

    const renderer = this.renderer.get();
    renderer.localClippingEnabled = false;
    this.renderer.setupEvents(false);
    this.renderer.overrideScene = this.scene;
    this.renderer.overrideCamera = this.camera;

    this.controls = new CameraControls(this.camera, renderer.domElement);
    // this.controls.smoothTime = 0.6;
    this.controls.setTarget(0, 0, 0);
    this.controls.addEventListener("update", () => this.grid.regenerate());
    this.controls.mouseButtons.left = CameraControls.ACTION.TRUCK;
    this.controls.dollyToCursor = true;
    this.controls.restThreshold = 2;
    this.controls.smoothTime = 0.2;
  }

  /**
   * {@link Component.get}
   * @returns the 2D scene.
   */
  get() {
    return this._root;
  }

  /** {@link Disposable.dispose} */
  async dispose() {
    const disposer = this.components.tools.get(Disposer);
    for (const child of this.scene.children) {
      const item = child as any;
      if (item instanceof THREE.Object3D) {
        disposer.destroy(item);
      }
    }
    await this.renderer.dispose();
    await this.uiElement.dispose();
    await this.onDisposed.trigger(Simple2DScene.uuid);
    this.onDisposed.reset();
  }

  /** {@link Updateable.update} */
  async update() {
    await this.onBeforeUpdate.trigger();
    this.controls.update(1 / 60);
    await this.renderer.update();
    await this.onAfterUpdate.trigger();
  }

  /** {@link Resizeable.getSize} */
  getSize() {
    return new THREE.Vector2(this._size.width, this._size.height);
  }

  setSize(height: number, width: number) {
    this._size.width = width;
    this._size.height = height;
    this.resize();
  }

  /** {@link Resizeable.resize} */
  resize = () => {
    const { height, width } = this._size;
    const aspect = width / height;
    this.camera.left = (-this._frustumSize * aspect) / 2;
    this.camera.right = (this._frustumSize * aspect) / 2;
    this.camera.top = this._frustumSize / 2;
    this.camera.bottom = -this._frustumSize / 2;
    this.camera.updateProjectionMatrix();
    this.camera.updateProjectionMatrix();
    this.renderer.resize(this._size);
  };
}
