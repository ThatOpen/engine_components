import * as THREE from "three";
import * as OBC from "@thatopen/components";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { N8AOPass } from "n8ao";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass.js";
import { GammaCorrectionShader } from "three/examples/jsm/shaders/GammaCorrectionShader.js";
import { CustomEffectsPass } from "./custom-effects-pass";

/**
 * Interface defining the settings for the post-processing effects.
 */
export interface PostproductionSettings {
  /**
   * Flag indicating whether to apply gamma correction.
   * Default: true
   */
  gamma?: boolean;

  /**
   * Flag indicating whether to apply custom effects.
   * Default: true
   */
  custom?: boolean;

  /**
   * Flag indicating whether to apply Ambient Occlusion (AO) effect.
   * Default: false
   */
  ao?: boolean;
}

//

/**
 * Class representing a post-processing effect manager for a 3D scene. It uses the EffectComposer from three.js to apply various post-processing effects. Thanks to [this](https://discourse.threejs.org/t/how-to-render-full-outlines-as-a-post-process-tutorial/22674).
 */
export class Postproduction {
  /**
   * The EffectComposer instance used for managing the post-processing effects.
   */
  readonly composer: EffectComposer;

  /**
   * Flag indicating whether to override the clipping planes of the renderer.
   * Default: false
   */
  overrideClippingPlanes = false;

  private readonly _components: OBC.Components;
  private readonly _world: OBC.World;
  private readonly _renderTarget: THREE.WebGLRenderTarget;

  private _enabled = false;
  private _initialized = false;
  private _n8ao?: any;
  private _customEffects?: CustomEffectsPass;
  private _basePass?: RenderPass;
  private _gammaPass?: ShaderPass;
  private _depthTexture?: THREE.DepthTexture;
  private _renderer: THREE.WebGLRenderer;

  private _settings: PostproductionSettings = {
    gamma: true,
    custom: true,
    ao: false,
  };

  /**
   * Getter for the base pass. Throws an error if the custom effects are not initialized.
   */
  get basePass() {
    if (!this._basePass) {
      throw new Error("Custom effects not initialized!");
    }
    return this._basePass;
  }

  /**
   * Getter for the gamma pass. Throws an error if the custom effects are not initialized.
   */
  get gammaPass() {
    if (!this._gammaPass) {
      throw new Error("Custom effects not initialized!");
    }
    return this._gammaPass;
  }

  /**
   * Getter for the custom effects pass. Throws an error if the custom effects are not initialized.
   */
  get customEffects() {
    if (!this._customEffects) {
      throw new Error("Custom effects not initialized!");
    }
    return this._customEffects;
  }

  /**
   * Getter for the N8AO pass. Throws an error if the custom effects are not initialized.
   */
  get n8ao() {
    if (!this._n8ao) {
      throw new Error("Custom effects not initialized!");
    }
    return this._n8ao;
  }

  /**
   * Getter for the enabled state of the post-processing effects.
   */
  get enabled() {
    return this._enabled;
  }

  /**
   * Setter for the enabled state of the post-processing effects.
   * If the custom effects are not initialized, it calls the initialize method.
   * @param {boolean} active - The new enabled state.
   */
  set enabled(active: boolean) {
    if (!this._initialized) {
      this.initialize();
    }
    this._enabled = active;
  }

  /**
   * Getter for the current post-processing settings.
   */
  get settings() {
    return { ...this._settings };
  }

  constructor(
    components: OBC.Components,
    renderer: THREE.WebGLRenderer,
    world: OBC.World,
  ) {
    if (!world.renderer) {
      throw new Error("The given world must have a renderer!");
    }

    this._components = components;
    this._renderer = renderer;
    this._world = world;

    this._renderTarget = new THREE.WebGLRenderTarget(
      window.innerWidth,
      window.innerHeight,
    );
    this._renderTarget.texture.colorSpace = "srgb-linear";

    this.composer = new EffectComposer(renderer, this._renderTarget);
    this.composer.setSize(window.innerWidth, window.innerHeight);
  }

  /**
   * Disposes of the resources held by the post-processing manager.
   * This method should be called when the post-processing manager is no longer needed.
   * It releases the memory occupied by the render target, depth texture, custom effects pass, gamma pass, and N8AO pass.
   */
  dispose() {
    this.composer.dispose();
    this._renderTarget.dispose();
    this._depthTexture?.dispose();
    this._customEffects?.dispose();
    this._gammaPass?.dispose();
    this._n8ao?.dispose();
  }

  /**
   * Sets the post-processing settings and updates the passes accordingly.
   * This method checks if the settings have changed before updating the passes.
   *
   * @param settings - The new post-processing settings.
   * @returns {void}
   */
  setPasses(settings: PostproductionSettings) {
    // This check can prevent some bugs
    let settingsChanged = false;
    for (const name in settings) {
      const key = name as keyof PostproductionSettings;
      if (this.settings[key] !== settings[key]) {
        settingsChanged = true;
        break;
      }
    }
    if (!settingsChanged) {
      return;
    }
    for (const name in settings) {
      const key = name as keyof PostproductionSettings;
      if (this._settings[key] !== undefined) {
        this._settings[key] = settings[key];
      }
    }
    this.updatePasses();
  }

  /**
   * Sets the size of the render target and all related passes.
   * This method should be called when the window size changes to ensure that the post-processing effects are rendered correctly.
   *
   * @param width - The new width of the render target.
   * @param height - The new height of the render target.
   * @returns {void}
   */
  setSize(width: number, height: number) {
    if (width === 0 || height === 0) {
      return;
    }
    if (this._initialized) {
      const customEnabled = this._settings.custom;
      if (customEnabled) {
        // For some reason, the custom pass quality degrades if it's resized while being active
        // Maybe we should investigate this at some point
        this.setPasses({ custom: false });
      }
      this.setPasses({ custom: false });
      this.composer.setSize(width, height);
      this.basePass.setSize(width, height);
      this.n8ao.setSize(width, height);
      this.customEffects.setSize(width, height);
      this.gammaPass.setSize(width, height);
      if (customEnabled) {
        this.setPasses({ custom: true });
      }
    }
  }

  /**
   * Updates the post-processing effects.
   * This method checks if the post-processing effects are enabled before rendering.
   * If the effects are enabled, it calls the `composer.render()` method to apply the effects.
   */
  update() {
    if (!this._enabled) return;
    this.composer.render();
  }

  /**
   * Updates the camera settings for the post-processing effects.
   * This method is called whenever the camera settings change.
   * It updates the camera settings for the N8AO pass, custom effects pass, and base pass.
   */
  updateCamera() {
    const camera = this._world.camera.three;
    if (this._n8ao) {
      this._n8ao.camera = camera;
    }
    if (this._customEffects) {
      this._customEffects.renderCamera = camera;
    }
    if (this._basePass) {
      this._basePass.camera = camera;
    }
  }

  /**
   * Updates the projection of the camera for the post-processing effects.
   * This method iterates over all passes in the EffectComposer and updates the camera property of each pass.
   * After updating the camera, it calls the update method to apply the changes.
   *
   * @param camera - The new camera to use for the post-processing effects.
   * @returns {void}
   */
  updateProjection(camera: THREE.Camera) {
    this.composer.passes.forEach((pass) => {
      // @ts-ignore
      pass.camera = camera;
    });
    this.update();
  }

  private initialize() {
    if (!this._world.renderer) {
      throw new Error("The given world must have a renderer!");
    }

    const scene = this._world.scene.three;
    const camera = this._world.camera.three;

    if (!(scene instanceof THREE.Scene)) {
      throw new Error("The given scene must have a THREE.Scene as core!");
    }

    const cameraManager = this._world.camera as OBC.OrthoPerspectiveCamera;
    if (cameraManager.projection) {
      cameraManager.projection.onChanged.add(() => {
        this.updateCamera();
      });
    }

    const renderer = this._world.renderer;
    if (!this.overrideClippingPlanes) {
      this._renderer.clippingPlanes = renderer.clippingPlanes;
    }
    this._renderer.outputColorSpace = "srgb";
    this._renderer.toneMapping = THREE.NoToneMapping;

    this.newBasePass(scene, camera);
    this.newSaoPass(scene, camera);
    this.newGammaPass();
    this.newCustomPass(scene, camera);

    this._initialized = true;
    this.updatePasses();
  }

  private updatePasses() {
    for (const pass of this.composer.passes) {
      this.composer.removePass(pass);
    }
    if (this._basePass) {
      this.composer.addPass(this.basePass);
    }
    if (this._settings.gamma) {
      this.composer.addPass(this.gammaPass);
    }
    if (this._settings.ao) {
      this.composer.addPass(this.n8ao);
    }
    if (this._settings.custom) {
      this.composer.addPass(this.customEffects);
    }
  }

  private newCustomPass(scene: THREE.Scene, camera: THREE.Camera) {
    this._customEffects = new CustomEffectsPass(
      new THREE.Vector2(window.innerWidth, window.innerHeight),
      this._components,
      this._world,
      scene,
      camera,
    );
  }

  private newGammaPass() {
    this._gammaPass = new ShaderPass(GammaCorrectionShader);
  }

  private newSaoPass(scene: THREE.Scene, camera: THREE.Camera) {
    if (!this._world.renderer) {
      throw new Error("The given world must have a renderer!");
    }

    const { width, height } = this._world.renderer.getSize();
    this._n8ao = new N8AOPass(scene, camera, width, height);
    // this.composer.addPass(this.n8ao);
    const { configuration } = this._n8ao;
    configuration.aoSamples = 16;
    configuration.denoiseSamples = 1;
    configuration.denoiseRadius = 13;
    configuration.aoRadius = 1;
    configuration.distanceFalloff = 4;
    configuration.aoRadius = 1;
    configuration.intensity = 4;
    configuration.halfRes = true;
    configuration.color = new THREE.Color().setHex(0xcccccc, "srgb-linear");
  }

  private newBasePass(scene: THREE.Scene, camera: THREE.Camera) {
    this._basePass = new RenderPass(scene, camera);
  }
}
