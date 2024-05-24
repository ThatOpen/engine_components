import * as THREE from "three";
import { Resizeable, Updateable, World, Event, Disposable } from "../../Types";

export class MiniMap implements Resizeable, Updateable, Disposable {
  /** {@link Disposable.onDisposed} */
  readonly onDisposed = new Event();

  readonly onAfterUpdate = new Event();
  readonly onBeforeUpdate = new Event();
  readonly onResize = new Event<THREE.Vector2>();

  // By pushing the map to the front, what the user sees on screen corresponds with what they see on the map
  frontOffset = 0;

  overrideMaterial = new THREE.MeshDepthMaterial();

  backgroundColor = new THREE.Color(0x06080a);

  renderer: THREE.WebGLRenderer;

  enabled = true;

  world: World;

  private _lockRotation = true;
  private _camera: THREE.OrthographicCamera;
  private _plane: THREE.Plane;
  private _size = new THREE.Vector2(320, 160);

  private _tempVector1 = new THREE.Vector3();
  private _tempVector2 = new THREE.Vector3();
  private _tempTarget = new THREE.Vector3();

  private readonly down = new THREE.Vector3(0, -1, 0);

  get lockRotation() {
    return this._lockRotation;
  }

  set lockRotation(active: boolean) {
    this._lockRotation = active;
    if (active) {
      this._camera.rotation.z = 0;
    }
  }

  get zoom() {
    return this._camera.zoom;
  }

  set zoom(value: number) {
    this._camera.zoom = value;
    this._camera.updateProjectionMatrix();
  }

  constructor(world: World) {
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
  }

  dispose() {
    this.enabled = false;
    this.onBeforeUpdate.reset();
    this.onAfterUpdate.reset();
    this.onResize.reset();
    this.overrideMaterial.dispose();
    this.renderer.dispose();
    this.onDisposed.trigger();
    this.onDisposed.reset();
  }

  get() {
    return this._camera;
  }

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

  getSize() {
    return this._size;
  }

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
