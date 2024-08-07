import * as THREE from "three";
import { SimpleScene, SimpleSceneConfig } from "../Worlds";
import { DistanceRenderer } from "./src";
import { Disposable } from "../Types";

/**
 * Configuration interface for the {@link SimpleScene}. Defines properties for directional and ambient lights.
 */
export interface ShadowedSceneConfig extends SimpleSceneConfig {
  shadows: {
    cascade: number;
    enabled: boolean;
    resolution: number;
  };
}

// TODO: Implement multiple shadow maps (the main problem to solve is the shadow camera rotation)

export class ShadowedScene extends SimpleScene implements Disposable {
  distanceRenderer?: DistanceRenderer;

  config: Required<ShadowedSceneConfig> = {
    directionalLight: {
      color: new THREE.Color("white"),
      intensity: 1.5,
      position: new THREE.Vector3(5, 10, 3),
    },
    ambientLight: {
      color: new THREE.Color("white"),
      intensity: 1,
    },
    shadows: {
      cascade: 1,
      enabled: true,
      resolution: 512,
    },
  };

  private _shadows = new Map<number, string>();

  private _isComputingShadows = false;

  private _shadowsEnabled = true;

  get shadowsEnabled() {
    return this._shadowsEnabled;
  }

  set shadowsEnabled(value: boolean) {
    this._shadowsEnabled = value;
    for (const [, light] of this.directionalLights) {
      light.castShadow = value;
    }
  }

  setup(config?: Partial<ShadowedSceneConfig>) {
    super.setup(config);

    this.config = { ...this.config, ...config };

    if (this.config.shadows.cascade <= 0) {
      throw new Error(
        "Config.shadows.cascade must be a natural number greater than 0!",
      );
    }

    if (this.config.shadows.cascade > 1) {
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

    if (!this.distanceRenderer) {
      this.distanceRenderer = new DistanceRenderer(
        this.components,
        this.currentWorld,
      );
      this.distanceRenderer.onDistanceComputed.add(this.recomputeShadows);
    }

    this._shadows.clear();

    // Create a light per shadow map
    for (let i = 0; i < this.config.shadows.cascade; i++) {
      const light = new THREE.DirectionalLight();
      light.intensity = this.config.directionalLight.intensity;
      light.color = this.config.directionalLight.color;
      light.position.copy(this.config.directionalLight.position);
      light.shadow.mapSize.width = this.config.shadows.resolution;
      light.shadow.mapSize.height = this.config.shadows.resolution;
      this.three.add(light, light.target);
      this.directionalLights.set(light.uuid, light);
      this._shadows.set(i, light.uuid);
      light.castShadow = true;
    }
  }

  dispose() {
    if (this.distanceRenderer) {
      this.distanceRenderer.dispose();
    }
    this._shadows.clear();
  }

  async updateShadows() {
    if (this._isComputingShadows || !this._shadowsEnabled) {
      return;
    }
    this._isComputingShadows = true;
    if (!this.distanceRenderer) {
      throw new Error("Component not initialized!");
    }
    await this.distanceRenderer.compute();
  }

  private recomputeShadows = (farthestDistance: number) => {
    if (!this._shadowsEnabled) {
      return;
    }

    const factor = 2;
    farthestDistance += factor;

    if (!this.currentWorld) {
      throw new Error(
        "A world needs to be assigned to the scene before computing shadows!",
      );
    }

    if (!this._shadows.size) {
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

    for (const [index, id] of this._shadows) {
      const light = this.directionalLights.get(id);
      if (!light) {
        throw new Error("Light not found.");
      }

      // First, compute the shadow center and radius
      const shadowCenter = new THREE.Vector3();
      shadowCenter.copy(camDirection);

      const isLastShadow = index === this._shadows.size - 1;
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
