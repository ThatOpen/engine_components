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
import { Canvas } from "../../ui";
import { Components } from "../Components";
import { Disposer } from "../Disposer";
import { SimpleRenderer } from "../SimpleRenderer";
import { PostproductionRenderer } from "../../navigation";

// TODO: Make a scene manager as a Tool (so that it as an UUID)

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
    canvas: Canvas;
  }>();

  /** The camera controls that move around in the scene. */
  controls: OrbitControls;

  /** The camera that renders the scene. */
  readonly camera: THREE.OrthographicCamera;

  renderer: SimpleRenderer | PostproductionRenderer;

  private readonly _scene: THREE.Scene;
  private readonly _size = new THREE.Vector2();
  private readonly _frustumSize = 50;

  constructor(components: Components, postproduction = false) {
    super(components);

    if (!components.uiEnabled) {
      throw new Error(
        "The Simple2DScene component needs to use UI elements (TODO: Decouple from them)."
      );
    }

    const canvas = new Canvas(components);
    canvas.domElement.classList.remove("absolute");

    this.uiElement.set({ canvas });

    this._scene = new THREE.Scene();

    this._size.set(window.innerWidth, window.innerHeight);
    const { width, height } = this._size;

    // Creates the camera (point of view of the user)
    this.camera = new THREE.OrthographicCamera(75, width / height);
    this._scene.add(this.camera);
    this.camera.position.z = 10;

    if (postproduction) {
      this.renderer = new PostproductionRenderer(this.components, undefined, {
        canvas: canvas.get(),
      });
    } else {
      this.renderer = new SimpleRenderer(this.components, undefined, {
        canvas: canvas.get(),
      });
    }

    const renderer = this.renderer.get();
    renderer.localClippingEnabled = false;
    this.renderer.setupEvents(false);
    this.renderer.overrideScene = this._scene;
    this.renderer.overrideCamera = this.camera;

    this.controls = new OrbitControls(this.camera, renderer.domElement);
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

    // Creates the orbit controls (to navigate the scene)
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
    const disposer = await this.components.tools.get(Disposer);
    for (const child of this._scene.children) {
      const item = child as any;
      if (item instanceof THREE.Object3D) {
        disposer.destroy(item);
      }
    }
    await this.renderer.dispose();
    await this.uiElement.dispose();
  }

  /** {@link Updateable.update} */
  async update() {
    await this.onBeforeUpdate.trigger();
    this.controls.update();
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
