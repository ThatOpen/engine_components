import * as THREE from "three";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass";
import { N8AOPass } from "n8ao";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass";
import { FXAAShader } from "three/examples/jsm/shaders/FXAAShader";
import { Components } from "../../../core";
import { OrthoPerspectiveCamera } from "../../OrthoPerspectiveCamera";
import { CustomOutlinePass } from "./custom-outline-pass";

// TODO: Clean up and document this

// source: https://discourse.threejs.org/t/how-to-render-full-outlines-as-a-post-process-tutorial/22674

export class Postproduction {
  excludedItems = new Set<THREE.Object3D>();
  n8ao?: any;
  outlines?: CustomOutlinePass;

  readonly composer: EffectComposer;

  private _enabled = false;
  private _initialized = false;

  private _basePass?: RenderPass;
  private _fxaaPass?: ShaderPass;
  private _depthTexture?: THREE.DepthTexture;
  private _saoEnabled = true;
  private _outlinesEnabled = true;

  private readonly _renderTarget: THREE.WebGLRenderTarget;

  get enabled() {
    return this._enabled;
  }

  set enabled(active: boolean) {
    if (!this._initialized) {
      this.initialize();
    }
    this._enabled = active;
  }

  get saoEnabled() {
    return this._saoEnabled;
  }

  set saoEnabled(active: boolean) {
    this._saoEnabled = active;
    if (!this.n8ao) return;
    if (active) {
      this.composer.addPass(this.n8ao);
      if (this.outlines && this._outlinesEnabled) {
        this.composer.removePass(this.outlines);
        this.composer.addPass(this.outlines);
        this.outlines.correctColor = false;
      }
    } else {
      this.composer.removePass(this.n8ao);
      if (this.outlines) {
        this.outlines.correctColor = true;
      }
    }
  }

  get outlinesEnabled() {
    return this._outlinesEnabled;
  }

  set outlinesEnabled(active: boolean) {
    this._outlinesEnabled = active;
    if (!this.outlines) return;
    if (active) {
      this.composer.addPass(this.outlines);
    } else {
      this.composer.removePass(this.outlines);
    }
  }

  constructor(
    private components: Components,
    private renderer: THREE.WebGLRenderer
  ) {
    this._renderTarget = new THREE.WebGLRenderTarget(
      window.innerWidth,
      window.innerHeight
    );
    this._renderTarget.texture.colorSpace = "srgb-linear";

    this.composer = new EffectComposer(this.renderer, this._renderTarget);
    this.composer.setSize(window.innerWidth, window.innerHeight);
  }

  dispose() {
    this._renderTarget.dispose();
    this._depthTexture?.dispose();
    this.outlines?.dispose();
    this._fxaaPass?.dispose();
    this.n8ao?.dispose();
    this.excludedItems.clear();
  }

  setSize(width: number, height: number) {
    this.composer.setSize(width, height);
    this.n8ao?.setSize(width, height);
    this.outlines?.setSize(width, height);
    this._fxaaPass?.setSize(width, height);
  }

  update() {
    if (!this._enabled) return;
    this.composer.render();
  }

  updateCamera() {
    const camera = this.components.camera.get();
    if (this.n8ao) {
      this.n8ao.camera = camera;
    }
    if (this.outlines) {
      this.outlines.renderCamera = camera;
    }
    if (this._basePass) {
      this._basePass.camera = camera;
    }
  }

  private initialize() {
    const scene = this.components.scene.get();
    const camera = this.components.camera.get();
    if (!scene || !camera) return;

    if (this.components.camera instanceof OrthoPerspectiveCamera) {
      this.components.camera.projectionChanged.on(() => {
        this.updateCamera();
      });
    }

    const renderer = this.components.renderer;
    this.renderer.clippingPlanes = renderer.clippingPlanes;

    this.addBasePass(scene, camera);
    this.addSaoPass(scene, camera);
    this.addOutlinePass();
    this.addFXAAPass();

    this._initialized = true;
  }

  updateProjection(camera: THREE.Camera) {
    this.composer.passes.forEach((pass) => {
      // @ts-ignore
      pass.camera = camera;
    });
    this.update();
  }

  private addOutlinePass() {
    const customOutline = new CustomOutlinePass(
      new THREE.Vector2(window.innerWidth, window.innerHeight),
      this.components
    );

    this.outlines = customOutline;
    this.composer.addPass(customOutline);
  }

  addSaoPass(scene: THREE.Scene, camera: THREE.Camera) {
    const { width, height } = this.components.renderer.getSize();
    this.n8ao = new N8AOPass(scene, camera, width, height);
    this.composer.addPass(this.n8ao);
    const { configuration } = this.n8ao;
    configuration.aoSamples = 16;
    configuration.denoiseSamples = 1;
    configuration.denoiseRadius = 3;
    configuration.aoRadius = 1;
    configuration.distanceFalloff = 4;
    configuration.aoRadius = 1;
    configuration.intensity = 4;
    configuration.halfRes = true;
    configuration.color = new THREE.Color().setHex(0xcccccc, "srgb-linear");
  }

  private addFXAAPass() {
    const effectFXAA = new ShaderPass(FXAAShader);
    effectFXAA.uniforms.resolution.value.set(
      1 / window.innerWidth,
      1 / window.innerHeight
    );
    this._fxaaPass = effectFXAA;
    this.composer.addPass(effectFXAA);
  }

  private addBasePass(scene: THREE.Scene, camera: THREE.Camera) {
    this._basePass = new RenderPass(scene, camera);
    this.composer.addPass(this._basePass);
  }
}
