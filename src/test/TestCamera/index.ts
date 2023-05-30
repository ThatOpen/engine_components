import { Components } from "../../core";
import { Component } from "../../base-types";
import * as THREE from "three";
import CameraControls from "camera-controls";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

export class TestCamera extends Component<
  THREE.PerspectiveCamera | THREE.OrthographicCamera
> {
  enabled: boolean = true;
  get(): THREE.PerspectiveCamera | THREE.OrthographicCamera {
    return this.activeCamera;
  }
  /** {@link Component.name} */
  name = "TestCamera";

  readonly components: Components;

  readonly controls: OrbitControls;

  activeCamera: THREE.PerspectiveCamera | THREE.OrthographicCamera;

  protected readonly _perspectiveCamera: THREE.PerspectiveCamera;

  constructor(components: Components) {
    super();

    this.components = components;

    this._perspectiveCamera = this.setup();
    this.activeCamera = this._perspectiveCamera;
    this.controls = this.setupControls();
  }

  private setup() {
    const aspect = window.innerWidth / window.innerHeight;
    const camera = new THREE.PerspectiveCamera(60, aspect, 1, 1000);
    camera.position.set(50, 50, 50);
    camera.lookAt(new THREE.Vector3(0, 0, 0));
    return camera;
  }

  private setupControls() {
    CameraControls.install({
      THREE: {
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
      },
    });

    const dom = this.components.renderer.get().domElement;

    if (dom.style === undefined) {
      // @ts-ignore
      dom.style = {};
    }

    const controls = new OrbitControls(this._perspectiveCamera, dom);

    controls.enabled = true;

    controls.dampingFactor = 0.2;

    controls.target.set(0, 0, 0);

    return controls;
  }
}
