import * as THREE from "three";
import {
  Resizeable,
  Updateable,
  World,
  Event,
  Disposable,
  Configurable,
} from "../../Types";
import { MiniMapConfig, MiniMapConfigManager } from "./mini-map-config";
import { Components } from "../../Components";

/**
 * A class representing a 2D minimap of a 3D world.
 */
export class MiniMap
  implements
    Resizeable,
    Updateable,
    Disposable,
    Configurable<MiniMapConfigManager, MiniMapConfig>
{
  /** {@link Disposable.onDisposed} */
  readonly onDisposed = new Event();

  /** {@link Updateable.onAfterUpdate} */
  readonly onAfterUpdate = new Event();

  /** {@link Updateable.onBeforeUpdate} */
  readonly onBeforeUpdate = new Event();

  /** {@link Resizeable.onResize} */
  readonly onResize = new Event<THREE.Vector2>();

  /** {@link Configurable.onSetup} */
  readonly onSetup = new Event();

  /**
   * The front offset of the minimap.
   * It determines how much the minimap's view is offset from the camera's view.
   * By pushing the map to the front, what the user sees on screen corresponds with what they see on the map
   */
  frontOffset = 0;

  /**
   * The override material for the minimap.
   * It is used to render the depth information of the world onto the minimap.
   */
  overrideMaterial = new THREE.MeshDepthMaterial();

  /**
   * The background color of the minimap.
   * It is used to set the background color of the minimap's renderer.
   */
  backgroundColor = new THREE.Color(0x06080a);

  /**
   * The WebGL renderer for the minimap.
   * It is used to render the minimap onto the screen.
   */
  renderer: THREE.WebGLRenderer;

  /**
   * A flag indicating whether the minimap is enabled.
   * If disabled, the minimap will not update or render.
   */
  enabled = true;

  /**
   * The world in which the minimap is displayed.
   * It provides access to the 3D scene, camera, and other relevant world elements.
   */
  world: World;

  /** {@link Configurable.config} */
  config: MiniMapConfigManager;

  /** {@link Configurable.isSetup} */
  isSetup = false;

  protected _defaultConfig: MiniMapConfig = {
    visible: true,
    lockRotation: false,
    zoom: 0.05,
    frontOffset: 0,
    sizeX: 320,
    sizeY: 160,
    backgroundColor: new THREE.Color(0x06080a),
  };

  private _lockRotation = true;
  private _size = new THREE.Vector2(320, 160);

  private _camera: THREE.OrthographicCamera;
  private _plane: THREE.Plane;
  private _tempVector1 = new THREE.Vector3();
  private _tempVector2 = new THREE.Vector3();
  private _tempTarget = new THREE.Vector3();

  private readonly down = new THREE.Vector3(0, -1, 0);

  /**
   * Gets or sets whether the minimap rotation is locked.
   * When rotation is locked, the minimap will always face the same direction as the camera.
   */
  get lockRotation() {
    return this._lockRotation;
  }

  /**
   * Sets whether the minimap rotation is locked.
   * When rotation is locked, the minimap will always face the same direction as the camera.
   * @param active - If `true`, rotation is locked. If `false`, rotation is not locked.
   */
  set lockRotation(active: boolean) {
    this._lockRotation = active;
    if (active) {
      this._camera.rotation.z = 0;
    }
  }

  /**
   * Gets the current zoom level of the minimap.
   * The zoom level determines how much of the world is visible on the minimap.
   * @returns The current zoom level of the minimap.
   */
  get zoom() {
    return this._camera.zoom;
  }

  /**
   * Sets the zoom level of the minimap.
   * The zoom level determines how much of the world is visible on the minimap.
   * @param value - The new zoom level of the minimap.
   */
  set zoom(value: number) {
    this._camera.zoom = value;
    this._camera.updateProjectionMatrix();
  }

  constructor(world: World, components: Components) {
    this.world = world;

    if (!this.world.renderer) {
      throw new Error("The given world must have a renderer!");
    }

    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setSize(this._size.x, this._size.y);

    const frustumSize = 1;
    const aspect = this._size.x / this._size.y;

    this._camera = new THREE.OrthographicCamera(
      (frustumSize * aspect) / -2,
      (frustumSize * aspect) / 2,
      frustumSize / 2,
      frustumSize / -2,
    );

    this.world.renderer.onClippingPlanesUpdated.add(this.updatePlanes);

    this._camera.position.set(0, 200, 0);
    this._camera.zoom = 0.1;
    this._camera.rotation.x = -Math.PI / 2;
    this._plane = new THREE.Plane(this.down, 200);
    this.updatePlanes();

    this.config = new MiniMapConfigManager(this, components, "MiniMap");
  }

  /** {@link Disposable.dispose} */
  dispose() {
    this.enabled = false;
    this.onBeforeUpdate.reset();
    this.onAfterUpdate.reset();
    this.onResize.reset();
    this.overrideMaterial.dispose();
    this.renderer.forceContextLoss();
    this.renderer.dispose();
    this.onDisposed.trigger();
    this.onDisposed.reset();
  }

  /** Returns the camera used by the MiniMap */
  get() {
    return this._camera;
  }

  /** {@link Updateable.update} */
  update() {
    if (!this.enabled) return;
    this.onBeforeUpdate.trigger();
    const scene = this.world.scene.three;
    const camera = this.world.camera;

    if (!camera.hasCameraControls()) {
      throw new Error("The given world must use camera controls!");
    }

    if (!(scene instanceof THREE.Scene)) {
      throw new Error("The given world must have a THREE.Scene as a root!");
    }

    const controls = camera.controls;
    controls.getPosition(this._tempVector1);

    this._camera.position.x = this._tempVector1.x;
    this._camera.position.z = this._tempVector1.z;

    if (this.frontOffset !== 0) {
      controls.getTarget(this._tempVector2);
      this._tempVector2.sub(this._tempVector1);
      this._tempVector2.normalize().multiplyScalar(this.frontOffset);
      this._camera.position.x += this._tempVector2.x;
      this._camera.position.z += this._tempVector2.z;
    }

    if (!this._lockRotation) {
      controls.getTarget(this._tempTarget);
      const angle = Math.atan2(
        this._tempTarget.x - this._tempVector1.x,
        this._tempTarget.z - this._tempVector1.z,
      );
      this._camera.rotation.z = angle + Math.PI;
    }

    this._plane.set(this.down, this._tempVector1.y);
    const previousBackground = scene.background;
    scene.background = this.backgroundColor;
    this.renderer.render(scene, this._camera);
    scene.background = previousBackground;
    this.onAfterUpdate.trigger();
  }

  /** {@link Resizeable.getSize} */
  getSize() {
    return this._size;
  }

  /** {@link Resizeable.resize} */
  resize(size: THREE.Vector2 = this._size) {
    this._size.copy(size);
    this.renderer.setSize(size.x, size.y);

    const aspect = size.x / size.y;
    const frustumSize = 1;

    this._camera.left = (frustumSize * aspect) / -2;
    this._camera.right = (frustumSize * aspect) / 2;
    this._camera.top = frustumSize / 2;
    this._camera.bottom = -frustumSize / 2;
    this._camera.updateProjectionMatrix();
    this.onResize.trigger(size);
  }

  /** {@link Configurable.setup} */
  setup(config?: Partial<MiniMapConfig>) {
    const fullConfig = { ...this._defaultConfig, ...config };

    this.config.visible = true;
    this.config.lockRotation = fullConfig.lockRotation;
    this.config.zoom = fullConfig.zoom;
    this.config.frontOffset = fullConfig.frontOffset;
    this.config.sizeX = fullConfig.sizeX;
    this.config.sizeY = fullConfig.sizeY;
    this.config.backgroundColor = fullConfig.backgroundColor;

    this.isSetup = true;
    this.onSetup.trigger();
  }

  private updatePlanes = () => {
    if (!this.world.renderer) {
      throw new Error("The given world must have a renderer!");
    }
    const planes: THREE.Plane[] = [];
    const renderer = this.world.renderer.three;
    for (const plane of renderer.clippingPlanes) {
      planes.push(plane);
    }
    planes.push(this._plane);
    this.renderer.clippingPlanes = planes;
  };
}
