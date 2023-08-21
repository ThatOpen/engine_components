import * as THREE from "three";
import {
  Event,
  Resizeable,
  UI,
  Updateable,
  Component,
  Disposable,
} from "../../base-types";
import { Canvas, Button, RangeInput } from "../../ui";
import { Components, SimpleCamera } from "../../core";

export class MiniMap
  extends Component<THREE.OrthographicCamera>
  implements UI, Resizeable, Updateable, Disposable
{
  name = "MiniMap";
  uiElement: { main: Button; canvas: Canvas };
  afterUpdate = new Event();
  beforeUpdate = new Event();

  overrideMaterial = new THREE.MeshDepthMaterial();

  backgroundColor = new THREE.Color(0x06080a);

  private _enabled = true;
  private _lockRotation = true;
  private _components: Components;
  private _camera: THREE.OrthographicCamera;
  private _renderer: THREE.WebGLRenderer;
  private _plane: THREE.Plane;
  private _size = new THREE.Vector2(320, 160);

  private _tempPosition = new THREE.Vector3();
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

  get enabled() {
    return this._enabled;
  }

  set enabled(active: boolean) {
    this._enabled = active;
    this.uiElement.canvas.visible = active;
  }

  constructor(components: Components) {
    super();

    this.uiElement = {
      main: new Button(components),
      canvas: new Canvas(components),
    };

    this.uiElement.main.materialIcon = "map";
    this.uiElement.main.onclick = () => {
      this.uiElement.canvas.visible = !this.uiElement.canvas.visible;
    };

    const range = new RangeInput(components);
    this.uiElement.canvas.addChild(range);

    this._components = components;
    const canvas = this.uiElement.canvas.get();
    this._renderer = new THREE.WebGLRenderer({ canvas });
    this._renderer.setSize(this._size.x, this._size.y);

    const frustumSize = 1;
    const aspect = this._size.x / this._size.y;

    this._camera = new THREE.OrthographicCamera(
      (frustumSize * aspect) / -2,
      (frustumSize * aspect) / 2,
      frustumSize / 2,
      frustumSize / -2
    );

    this._camera.position.set(0, 200, 0);
    this._camera.zoom = 0.1;
    this._camera.rotation.x = -Math.PI / 2;
    this._plane = new THREE.Plane(this.down, 200);
    this._renderer.clippingPlanes = [this._plane];
  }

  dispose() {
    this.enabled = false;
    this.uiElement.main.dispose();
    this.uiElement.canvas.dispose();
    this.beforeUpdate.reset();
    this.afterUpdate.reset();
    this.overrideMaterial.dispose();
    this._renderer.dispose();
    (this._components as any) = null;
  }

  get() {
    return this._camera;
  }

  update() {
    if (!this.enabled) return;
    this.beforeUpdate.trigger();
    const scene = this._components.scene.get();
    const cameraComponent = this._components.camera as SimpleCamera;
    const controls = cameraComponent.controls;
    controls.getPosition(this._tempPosition);
    this._camera.position.x = this._tempPosition.x;
    this._camera.position.z = this._tempPosition.z;

    if (!this._lockRotation) {
      controls.getTarget(this._tempTarget);
      const angle = Math.atan2(
        this._tempTarget.x - this._tempPosition.x,
        this._tempTarget.z - this._tempPosition.z
      );
      this._camera.rotation.z = angle + Math.PI;
    }

    this._plane.set(this.down, this._tempPosition.y);
    const previousBackground = scene.background;
    scene.background = this.backgroundColor;
    this._renderer.render(scene, this._camera);
    scene.background = previousBackground;
    this.afterUpdate.trigger();
  }

  getSize() {
    return this.uiElement.canvas.getSize();
  }

  resize(size?: THREE.Vector2) {
    if (size) {
      this._size.copy(size);
      this.uiElement.canvas.resize(size);
      this._renderer.setSize(size.x, size.y);

      const aspect = size.x / size.y;
      const frustumSize = 1;

      this._camera.left = (frustumSize * aspect) / -2;
      this._camera.right = (frustumSize * aspect) / 2;
      this._camera.top = frustumSize / 2;
      this._camera.bottom = -frustumSize / 2;
      this._camera.updateProjectionMatrix();
    }
  }
}
