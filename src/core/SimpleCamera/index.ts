import * as THREE from "three";
import CameraControls from "camera-controls";
import {
  Component,
  Components,
  Disposable,
  Updateable,
  Event,
} from "../../types";

/**
 * A basic camera that uses
 * [yomotsu's cameracontrols](https://github.com/yomotsu/camera-controls) to
 * easily control the camera in 2D and 3D. Check out it's API to find out
 * what features it offers.
 */
export class SimpleCamera
  extends Component<THREE.PerspectiveCamera | THREE.OrthographicCamera>
  implements Updateable, Disposable
{
  /** {@link Component.name} */
  name = "SimpleCamera";

  /** {@link Updateable.beforeUpdate} */
  readonly beforeUpdate = new Event<SimpleCamera>();

  /** {@link Updateable.afterUpdate} */
  readonly afterUpdate = new Event<SimpleCamera>();

  /**
   * The object that controls the camera. An instance of
   * [yomotsu's cameracontrols](https://github.com/yomotsu/camera-controls).
   * Transforming the camera directly will have no effect: you need to use this
   * object to move, rotate, look at objects, etc.
   */
  readonly controls: CameraControls;

  /** {@link Component.enabled} */
  get enabled() {
    return this.controls.enabled;
  }

  /** {@link Component.enabled} */
  set enabled(enabled: boolean) {
    this.controls.enabled = enabled;
  }

  /**
   *  The camera that is being used now according to the current {@link CameraProjection}.
   */
  activeCamera: THREE.PerspectiveCamera | THREE.OrthographicCamera;

  protected readonly _perspectiveCamera: THREE.PerspectiveCamera;

  constructor(public components: Components) {
    super();
    this._perspectiveCamera = this.setupCamera();
    this.activeCamera = this._perspectiveCamera;
    this.controls = this.setupCameraControls();
    const scene = components.scene.get();
    scene.add(this._perspectiveCamera);
    this.setupEvents();
  }

  /** {@link Component.get} */
  get() {
    return this.activeCamera;
  }

  /** {@link Disposable.dispose} */
  dispose() {
    this.enabled = false;
    this.beforeUpdate.reset();
    this.afterUpdate.reset();
    this._perspectiveCamera.removeFromParent();
    this.controls.dispose();
  }

  /** {@link Updateable.update} */
  update(_delta: number): void {
    if (this.enabled) {
      this.beforeUpdate.trigger(this);
      this.controls.update(_delta);
      this.afterUpdate.trigger(this);
    }
  }

  /**
   * Updates the aspect of the camera to match the size of the
   * {@link Components.renderer}.
   */
  updateAspect() {
    if (this.components.renderer.isResizeable()) {
      const size = this.components.renderer.getSize();
      this._perspectiveCamera.aspect = size.width / size.height;
      this._perspectiveCamera.updateProjectionMatrix();
    }
  }

  private setupCamera() {
    const aspect = window.innerWidth / window.innerHeight;
    const camera = new THREE.PerspectiveCamera(60, aspect, 1, 1000);
    camera.position.set(50, 50, 50);
    camera.lookAt(new THREE.Vector3(0, 0, 0));
    return camera;
  }

  private setupCameraControls() {
    CameraControls.install({ THREE: SimpleCamera.getSubsetOfThree() });
    const dom = this.components.renderer.get().domElement;
    const controls = new CameraControls(this._perspectiveCamera, dom);
    controls.dampingFactor = 0.2;
    controls.dollyToCursor = true;
    controls.infinityDolly = true;
    controls.setTarget(0, 0, 0);
    return controls;
  }

  private setupEvents() {
    window.addEventListener("resize", () => {
      this.updateAspect();
    });
  }

  private static getSubsetOfThree() {
    return {
      MOUSE: THREE.MOUSE,
      Vector2: THREE.Vector2,
      Vector3: THREE.Vector3,
      Vector4: THREE.Vector4,
      Quaternion: THREE.Quaternion,
      Matrix4: THREE.Matrix4,
      Spherical: THREE.Spherical,
      Box3: THREE.Box3,
      Sphere: THREE.Sphere,
      Raycaster: THREE.Raycaster,
      MathUtils: THREE.MathUtils,
    };
  }
}
