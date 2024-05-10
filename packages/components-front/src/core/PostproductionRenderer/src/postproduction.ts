import * as THREE from "three";
import * as OBC from "@thatopen/components";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { N8AOPass } from "n8ao";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass.js";
import { GammaCorrectionShader } from "three/examples/jsm/shaders/GammaCorrectionShader.js";
import { CustomEffectsPass } from "./custom-effects-pass";

// TODO: Clean up and document this

export interface PostproductionSettings {
  gamma?: boolean;
  custom?: boolean;
  ao?: boolean;
}

// source: https://discourse.threejs.org/t/how-to-render-full-outlines-as-a-post-process-tutorial/22674

export class Postproduction {
  excludedItems = new Set<THREE.Object3D>();

  overrideClippingPlanes = false;

  readonly composer: EffectComposer;

  private _enabled = false;
  private _initialized = false;

  private _n8ao?: any;
  private _customEffects?: CustomEffectsPass;
  private _basePass?: RenderPass;
  private _gammaPass?: ShaderPass;
  private _depthTexture?: THREE.DepthTexture;

  private _settings: PostproductionSettings = {
    gamma: true,
    custom: true,
    ao: false,
  };

  private _renderer: THREE.WebGLRenderer;
  private readonly _components: OBC.Components;
  private readonly _world: OBC.World;

  private readonly _renderTarget: THREE.WebGLRenderTarget;

  get basePass() {
    if (!this._basePass) {
      throw new Error("Custom effects not initialized!");
    }
    return this._basePass;
  }

  get gammaPass() {
    if (!this._gammaPass) {
      throw new Error("Custom effects not initialized!");
    }
    return this._gammaPass;
  }

  get customEffects() {
    if (!this._customEffects) {
      throw new Error("Custom effects not initialized!");
    }
    return this._customEffects;
  }

  get n8ao() {
    if (!this._n8ao) {
      throw new Error("Custom effects not initialized!");
    }
    return this._n8ao;
  }

  get enabled() {
    return this._enabled;
  }

  set enabled(active: boolean) {
    if (!this._initialized) {
      this.initialize();
    }
    this._enabled = active;
  }

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

  dispose() {
    this._renderTarget.dispose();
    this._depthTexture?.dispose();
    this._customEffects?.dispose();
    this._gammaPass?.dispose();
    this._n8ao?.dispose();
    this.excludedItems.clear();
  }

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

  setSize(width: number, height: number) {
    if (this._initialized) {
      this.composer.setSize(width, height);
      this.basePass.setSize(width, height);
      this.n8ao.setSize(width, height);
      this.customEffects.setSize(width, height);
      this.gammaPass.setSize(width, height);
    }
  }

  update() {
    if (!this._enabled) return;
    this.composer.render();
  }

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

  private initialize() {
    if (!this._world.renderer) {
      throw new Error("The given world must have a renderer!");
    }

    const scene = this._world.scene.three;
    const camera = this._world.camera.three;

    if (!(scene instanceof THREE.Scene)) {
      throw new Error("The given scene must have a THREE.Scene as core!");
    }

    if (this._world.camera instanceof OBC.OrthoPerspectiveCamera) {
      this._world.camera.projection.onChanged.add(() => {
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

  updateProjection(camera: THREE.Camera) {
    this.composer.passes.forEach((pass) => {
      // @ts-ignore
      pass.camera = camera;
    });
    this.update();
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
