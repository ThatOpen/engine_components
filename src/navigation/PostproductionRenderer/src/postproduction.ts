import * as THREE from "three";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass";
import { N8AOPass } from "n8ao";
import { CustomOutlinePass } from "./custom-outline-pass";
import { Components } from "../../../core";

// TODO: Clean up and document this

// source: https://discourse.threejs.org/t/how-to-render-full-outlines-as-a-post-process-tutorial/22674

export class Postproduction {
  excludedItems = new Set<THREE.Object3D>();
  n8ao?: any;

  readonly composer: EffectComposer;

  private _enabled = false;
  private _initialized = false;

  private _basePass?: RenderPass;
  private _customOutline?: CustomOutlinePass;
  private _outlineUniforms: any;
  private _depthTexture?: THREE.DepthTexture;
  private readonly _renderTarget: THREE.WebGLRenderTarget;
  private readonly _visibilityField = "ifcjsPostproductionVisible";

  private _outlineParams = {
    mode: { Mode: 0 },
    FXAA: true,
    outlineColor: 0x777777,
    depthBias: 1,
    depthMult: 1,
    normalBias: 5,
    normalMult: 1,
  };

  get enabled() {
    return this._enabled;
  }

  set enabled(active: boolean) {
    if (!this._initialized) {
      this.initialize();
    }
    this._enabled = active;
  }

  get outlineColor() {
    return this._outlineParams.outlineColor;
  }

  set outlineColor(color: number) {
    this._outlineParams.outlineColor = color;
    if (this._outlineUniforms) {
      this._outlineUniforms.outlineColor.value.set(color);
    }
  }

  constructor(
    private components: Components,
    private renderer: THREE.WebGLRenderer
  ) {
    this._renderTarget = this.newRenderTarget();

    this.composer = new EffectComposer(this.renderer, this._renderTarget);
    this.composer.setSize(window.innerWidth, window.innerHeight);
  }

  dispose() {
    this._renderTarget.dispose();
    this._depthTexture?.dispose();
    this._customOutline?.dispose();
    this.excludedItems.clear();
  }

  setSize(width: number, height: number) {
    this.composer.setSize(width, height);
    console.log(this.n8ao);
  }

  update() {
    if (!this._enabled) return;
    this.hideExcludedItems();
    this.composer.render();
    this.showExcludedItems();
  }

  private hideExcludedItems() {
    for (const object of this.excludedItems) {
      object.userData[this._visibilityField] = object.visible;
      object.visible = false;
    }
  }

  private showExcludedItems() {
    for (const object of this.excludedItems) {
      if (object.userData[this._visibilityField] !== undefined) {
        object.visible = object.userData[this._visibilityField];
      }
    }
  }

  private initialize() {
    const scene = this.components.scene.get();
    const camera = this.components.camera.get() as THREE.PerspectiveCamera;
    if (!scene || !camera) return;

    const renderer = this.components.renderer;
    this.renderer.clippingPlanes = renderer.clippingPlanes;

    this.addBasePass(scene, camera);
    this.addSaoPass(scene, camera);
    // this.addOutlinePass(scene, camera);

    this._initialized = true;
  }

  updateProjection(camera: THREE.Camera) {
    this.composer.passes.forEach((pass) => {
      // @ts-ignore
      pass.camera = camera;
    });
    this.update();
  }

  // private addOutlinePass(scene: THREE.Scene, camera: THREE.PerspectiveCamera) {
  //   this._customOutline = new CustomOutlinePass(
  //     new THREE.Vector2(window.innerWidth, window.innerHeight),
  //     scene,
  //     camera
  //   );
  //
  //   // Initial values
  //   // @ts-ignore
  //   this._outlineUniforms = this._customOutline.fsQuad.material.uniforms;
  //   this._outlineUniforms.outlineColor.value.set(
  //     this._outlineParams.outlineColor
  //   );
  //   this._outlineUniforms.multiplierParameters.value.x =
  //     this._outlineParams.depthBias;
  //   this._outlineUniforms.multiplierParameters.value.y =
  //     this._outlineParams.depthMult;
  //   this._outlineUniforms.multiplierParameters.value.z =
  //     this._outlineParams.normalBias;
  //   this._outlineUniforms.multiplierParameters.value.w =
  //     this._outlineParams.normalMult;
  //
  //   this.composer.addPass(this._customOutline);
  // }

  private addSaoPass(scene: THREE.Scene, camera: THREE.PerspectiveCamera) {
    const { width, height } = this.components.renderer.getSize();
    this.n8ao = new N8AOPass(scene, camera, width, height);
    this.composer.addPass(this.n8ao);
  }

  private addBasePass(scene: THREE.Scene, camera: THREE.PerspectiveCamera) {
    this._basePass = new RenderPass(scene, camera);
    this.composer.addPass(this._basePass);
  }

  private newRenderTarget() {
    this._depthTexture = new THREE.DepthTexture(
      window.innerWidth,
      window.innerHeight
    );
    return new THREE.WebGLRenderTarget(window.innerWidth, window.innerHeight, {
      depthTexture: this._depthTexture,
      depthBuffer: true,
    });
  }
}
