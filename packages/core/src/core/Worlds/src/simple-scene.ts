import * as THREE from "three";
import { BaseScene, Configurable, Event } from "../../Types";
import { Components } from "../../Components";
import { DistanceRenderer } from "../../Distances";

/**
 * Configuration interface for the {@link SimpleScene}. Defines properties for directional and ambient lights.
 */
export interface SimpleSceneConfig {
  directionalLight: {
    color: THREE.Color;
    intensity: number;
    position: THREE.Vector3;
  };
  ambientLight: {
    color: THREE.Color;
    intensity: number;
  };
}

/**
 * A basic 3D [scene](https://threejs.org/docs/#api/en/scenes/Scene) to add objects hierarchically, and easily dispose them when you are finished with it.
 */
export class SimpleScene extends BaseScene implements Configurable<{}> {
  /** {@link Configurable.isSetup} */
  isSetup = false;

  /**
   * The underlying Three.js scene object.
   * It is used to define the 3D space containing objects, lights, and cameras.
   */
  three: THREE.Scene;

  distanceRenderer?: DistanceRenderer;

  private _directionalLight?: THREE.DirectionalLight;

  private _sphere = new THREE.Mesh(
    new THREE.SphereGeometry(0.5),
    new THREE.MeshBasicMaterial({
      color: "red",
      side: 2,
      transparent: true,
      opacity: 0.5,
    }),
  );

  get directionalLight() {
    if (!this._directionalLight) {
      throw new Error("Scene not initialized!");
    }
    return this._directionalLight;
  }

  /** {@link Configurable.onSetup} */
  readonly onSetup = new Event<SimpleScene>();

  /**
   * Configuration interface for the {@link SimpleScene}.
   * Defines properties for directional and ambient lights.
   */
  config: Required<SimpleSceneConfig> = {
    directionalLight: {
      color: new THREE.Color("white"),
      intensity: 1.5,
      position: new THREE.Vector3(5, 10, 3),
    },
    ambientLight: {
      color: new THREE.Color("white"),
      intensity: 1,
    },
  };

  constructor(components: Components) {
    super(components);
    this.three = new THREE.Scene();
    this.three.background = new THREE.Color(0x202932);
  }

  /** {@link Configurable.setup} */
  setup(config?: Partial<SimpleSceneConfig>) {
    this.config = { ...this.config, ...config };
    this._directionalLight = new THREE.DirectionalLight(
      this.config.directionalLight.color,
      this.config.directionalLight.intensity,
    );
    this._directionalLight.position.copy(this.config.directionalLight.position);
    const ambientLight = new THREE.AmbientLight(
      this.config.ambientLight.color,
      this.config.ambientLight.intensity,
    );
    this.three.add(
      this._directionalLight,
      this._directionalLight.target,
      ambientLight,
    );
    this.isSetup = true;
    this.onSetup.trigger(this);

    // this.three.add(this._sphere);
  }

  async fitShadows() {
    if (!this.currentWorld) {
      throw new Error("No world found!");
    }

    if (!this.distanceRenderer) {
      this.distanceRenderer = new DistanceRenderer(
        this.components,
        this.currentWorld,
      );

      this.distanceRenderer.onDistanceComputed.add(this.updateShadows);

      // this.distanceRenderer.renderDebugFrame = true;
      // this.distanceRenderer.renderer.domElement.style.position = "absolute";
      // this.distanceRenderer.renderer.domElement.style.bottom = "0";
      // document.body.appendChild(this.distanceRenderer.renderer.domElement);
    }

    await this.distanceRenderer.compute();
  }

  private updateShadows = (farthestDistance: number) => {
    const light = this.directionalLight;

    const factor = 2;
    const distance = farthestDistance * factor;

    console.log(distance);

    if (!this.currentWorld) {
      throw new Error("No world found!");
    }

    const camera = this.currentWorld.camera.three;
    if (
      !(camera instanceof THREE.PerspectiveCamera) &&
      !(camera instanceof THREE.OrthographicCamera)
    ) {
      throw new Error("Invalid camera type!");
    }

    const sphere = new THREE.Sphere();

    const camDirection = new THREE.Vector3(); // create once and reuse it!
    camera.getWorldDirection(camDirection);

    const center = new THREE.Vector3();
    center.copy(camDirection);
    center.multiplyScalar(distance / 2);
    center.add(camera.position);

    sphere.set(center, distance / 2);

    this._sphere.position.copy(sphere.center);
    this._sphere.scale.x = sphere.radius * 2;
    this._sphere.scale.y = sphere.radius * 2;
    this._sphere.scale.z = sphere.radius * 2;

    const lightDirection = new THREE.Vector3();
    lightDirection.subVectors(light.position, light.target.position);
    lightDirection.normalize();
    lightDirection.multiplyScalar(sphere.radius);

    light.target.position.copy(sphere.center);

    light.position.copy(sphere.center);
    light.position.add(lightDirection);

    const shadowCamera = light.shadow.camera;
    shadowCamera.right = sphere.radius;
    shadowCamera.left = -sphere.radius;
    shadowCamera.top = sphere.radius;
    shadowCamera.bottom = -sphere.radius;
    shadowCamera.far = sphere.radius * factor;
    shadowCamera.updateProjectionMatrix();
  };
}
