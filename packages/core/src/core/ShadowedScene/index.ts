import * as THREE from "three";
import {
  SimpleScene,
  SimpleSceneConfig,
  SimpleSceneConfigManager,
} from "../Worlds";
import { DistanceRenderer } from "./src";
import { Configurable, Disposable } from "../Types";

/**
 * Configuration interface for the {@link ShadowedScene}. Defines properties for directional and ambient lights, as well as shadows.
 */
export interface ShadowedSceneConfig extends SimpleSceneConfig {
  shadows: {
    cascade: number;
    resolution: number;
  };
}

// TODO: Implement multiple cascade shadow maps (the main problem to solve is the shadow camera rotation)
// A trick to do this is that the camera direction vector is one of the axis of the camera shadow frustum
// when projected to the near frustum plane. So now we have 2 vectors (the vector of the light direction
// and this vector), so the third vector is known (cross product) and the frustum direction can be built
// as a matrix

/**
 * A scene that supports efficient cast shadows. 📕 [Tutorial](https://docs.thatopen.com/Tutorials/Components/Core/ShadowedScene). 📘 [API](https://docs.thatopen.com/api/@thatopen/components/classes/ShadowedScene).
 */
export class ShadowedScene
  extends SimpleScene
  implements
    Disposable,
    Configurable<SimpleSceneConfigManager, ShadowedSceneConfig>
{
  private _distanceRenderer?: DistanceRenderer;

  /**
   * Whether the bias property should be set automatically depending on the shadow distance.
   */
  autoBias = true;

  protected _defaultShadowConfig = {
    cascade: 1,
    resolution: 512,
  };

  private _lightsWithShadow = new Map<number, string>();

  private _isComputingShadows = false;

  private _shadowsEnabled = true;

  private _bias = 0;

  /**
   * The getter for the bias to prevent artifacts (stripes). It usually ranges between 0 and -0.005.
   */
  get bias() {
    return this._bias;
  }

  /**
   * The setter for the bias to prevent artifacts (stripes). It usually ranges between 0 and -0.005.
   */
  set bias(value: number) {
    this._bias = value;
    for (const [, id] of this._lightsWithShadow) {
      const light = this.directionalLights.get(id);
      if (light) {
        light.shadow.bias = value;
      }
    }
  }

  /**
   * Getter to see whether the shadows are enabled or not in this scene instance.
   */
  get shadowsEnabled() {
    return this._shadowsEnabled;
  }

  /**
   * Setter to control whether the shadows are enabled or not in this scene instance.
   */
  set shadowsEnabled(value: boolean) {
    this._shadowsEnabled = value;
    for (const [, light] of this.directionalLights) {
      light.castShadow = value;
    }
  }

  /**
   * Getter to get the renderer used to determine the farthest distance from the camera.
   */
  get distanceRenderer() {
    if (!this._distanceRenderer) {
      throw new Error(
        "You must set up this component before accessing the distance renderer!",
      );
    }
    return this._distanceRenderer;
  }

  /** {@link Configurable.setup} */
  setup(config?: Partial<ShadowedSceneConfig>) {
    super.setup(config);

    const fullConfig = {
      ...this._defaultConfig,
      ...this._defaultShadowConfig,
      ...config,
    };

    if (fullConfig.cascade <= 0) {
      throw new Error(
        "Config.shadows.cascade must be a natural number greater than 0!",
      );
    }

    if (fullConfig.cascade > 1) {
      throw new Error("Multiple shadows not supported yet!");
    }

    if (!this.currentWorld) {
      throw new Error(
        "A world needs to be assigned to the scene before setting it up!",
      );
    }

    // Reset directional lights
    for (const [, light] of this.directionalLights) {
      light.target.removeFromParent();
      light.removeFromParent();
      light.dispose();
    }
    this.directionalLights.clear();

    if (!this._distanceRenderer) {
      this._distanceRenderer = new DistanceRenderer(
        this.components,
        this.currentWorld,
      );
      this._distanceRenderer.onDistanceComputed.add(this.recomputeShadows);
    }

    this._lightsWithShadow.clear();

    // Create a light per shadow map
    for (let i = 0; i < fullConfig.cascade; i++) {
      const light = new THREE.DirectionalLight();
      light.intensity = this.config.directionalLight.intensity;
      light.color = this.config.directionalLight.color;
      light.position.copy(this.config.directionalLight.position);
      light.shadow.mapSize.width = fullConfig.resolution;
      light.shadow.mapSize.height = fullConfig.resolution;
      this.three.add(light, light.target);
      this.directionalLights.set(light.uuid, light);
      this._lightsWithShadow.set(i, light.uuid);
      light.castShadow = true;
      light.shadow.bias = this._bias;
    }
  }

  /** {@link Disposable.dispose} */
  dispose() {
    super.dispose();
    if (this._distanceRenderer) {
      this._distanceRenderer.dispose();
    }
    this._lightsWithShadow.clear();
  }

  /** Update all the shadows of the scene. */
  async updateShadows() {
    if (this._isComputingShadows || !this._shadowsEnabled) {
      return;
    }
    this._isComputingShadows = true;
    await this.distanceRenderer.compute();
  }

  private recomputeShadows = (farthestDistance: number) => {
    if (!this._shadowsEnabled) {
      return;
    }

    if (this.autoBias) {
      // src: https://discourse.threejs.org/t/hello-i-am-facing-the-problem-with-shadow-stripes-on-model/18065/10
      this.bias = -0.005;
    }

    const factor = 1.5;
    farthestDistance *= factor;

    if (!this.currentWorld) {
      throw new Error(
        "A world needs to be assigned to the scene before computing shadows!",
      );
    }

    if (!this._lightsWithShadow.size) {
      throw new Error("No shadows found!");
    }

    const camera = this.currentWorld.camera.three;
    if (
      !(camera instanceof THREE.PerspectiveCamera) &&
      !(camera instanceof THREE.OrthographicCamera)
    ) {
      throw new Error("Invalid camera type!");
    }

    const camDirection = new THREE.Vector3();
    camera.getWorldDirection(camDirection);

    // Strategy: split distance in 3 parts, where:
    // The first division is the center of the current shadow map
    // The second division is the end of the new segment to evaluate
    //     ____
    //   /      \   _
    // /         \/   \/\
    // ------------------ 📹
    // \        /\ _ /\/
    //  \______/
    //

    let currentDistance = farthestDistance;

    const lightDirection = new THREE.Vector3();
    lightDirection.copy(this.config.directionalLight.position);
    lightDirection.normalize();

    for (const [index, id] of this._lightsWithShadow) {
      const light = this.directionalLights.get(id);
      if (!light) {
        throw new Error("Light not found.");
      }

      // First, compute the shadow center and radius
      const shadowCenter = new THREE.Vector3();
      shadowCenter.copy(camDirection);

      const isLastShadow = index === this._lightsWithShadow.size - 1;
      const shadowOffset = isLastShadow
        ? currentDistance / 2
        : (currentDistance * 2) / 3;

      shadowCenter.multiplyScalar(shadowOffset);
      shadowCenter.add(camera.position);

      const shadowRadius = currentDistance - shadowOffset;

      // Then compute the light offset
      const lightOffset = new THREE.Vector3();
      lightOffset.copy(lightDirection);
      lightOffset.multiplyScalar(shadowRadius);

      // Finally, place and scale the light accordingly
      light.target.position.copy(shadowCenter);
      light.position.copy(shadowCenter);
      light.position.add(lightOffset);
      light.shadow.camera.right = shadowRadius;
      light.shadow.camera.left = -shadowRadius;
      light.shadow.camera.top = shadowRadius;
      light.shadow.camera.bottom = -shadowRadius;
      // Double this to make sure the shadow covers all
      light.shadow.camera.far = shadowRadius * 2;

      light.shadow.camera.updateProjectionMatrix();
      light.shadow.camera.updateMatrix();

      if (!isLastShadow) {
        currentDistance /= 3;
      }
    }

    this._isComputingShadows = false;
  };
}
