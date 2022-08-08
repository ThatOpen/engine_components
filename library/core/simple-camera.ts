import {
  Box3,
  Camera,
  MathUtils,
  Matrix4,
  MOUSE,
  PerspectiveCamera,
  Quaternion,
  Raycaster,
  Sphere,
  Spherical,
  Vector2,
  Vector3,
  Vector4,
} from "three";
import CameraControls from "camera-controls";
import { CameraComponent } from "./base-types";
import { Components } from "../components";

const subsetOfTHREE = {
  MOUSE,
  Vector2,
  Vector3,
  Vector4,
  Quaternion,
  Matrix4,
  Spherical,
  Box3,
  Sphere,
  Raycaster,
  MathUtils: {
    DEG2RAD: MathUtils.DEG2RAD,
    clamp: MathUtils.clamp,
  },
};

export class SimpleCamera implements CameraComponent {
  perspectiveCamera: PerspectiveCamera;
  activeCamera: Camera;
  controls: CameraControls;

  constructor(private components: Components) {
    this.perspectiveCamera = this.setupCamera();
    this.activeCamera = this.perspectiveCamera;

    this.controls = this.setupCameraControls();

    components.scene?.getScene().add(this.perspectiveCamera);

    this.setupEvents();
  }

  private setupCamera() {
    const aspect = window.innerWidth / window.innerHeight;
    const camera = new PerspectiveCamera(60, aspect, 1, 1000);
    camera.position.set(50, 50, 0);
    return camera;
  }

  private setupCameraControls() {
    CameraControls.install({ THREE: subsetOfTHREE });
    const dom = this.components.renderer.renderer.domElement;
    const controls = new CameraControls(this.perspectiveCamera, dom);
    controls.dampingFactor = 0.2;
    controls.dollyToCursor = true;
    controls.infinityDolly = true;
    controls.setTarget(0, 0, 0);
    return controls;
  }

  getCamera(): PerspectiveCamera {
    return this.perspectiveCamera;
  }

  update(_delta: number): void {
    if (this.controls.enabled) {
      this.controls.update(_delta);
    }
  }

  resize() {
    const size = this.components.renderer.getSize();
    this.perspectiveCamera.aspect = size.width / size.height;
    this.perspectiveCamera.updateProjectionMatrix();
  }

  private setupEvents() {
    window.addEventListener("resize", () => {
      this.resize();
    });
  }
}
