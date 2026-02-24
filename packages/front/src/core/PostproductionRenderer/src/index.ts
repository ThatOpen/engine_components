import * as THREE from "three";
import * as OBC from "@thatopen/components";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { GTAOPass } from "three/examples/jsm/postprocessing/GTAOPass.js";
import { AOPass } from "./ao-pass";
import { OutputPass } from "three/examples/jsm/postprocessing/OutputPass.js";
import { SMAAPass } from "three/examples/jsm/postprocessing/SMAAPass.js";
import { EdgeDetectionPass } from "./edge-detection-pass";
import { SimpleOutlinePass } from "./simple-outline-pass";
import { ExcludedObjectsPass } from "./excluded-objects-pass";
import { PostproductionRenderer } from "..";
import { BasePass } from "./base-pass";
import { GlossPass } from "./gloss-pass";

// Export the GlossPass for external use
export { GlossPass };
export { AOPass } from "./ao-pass";
export { EdgeDetectionPassMode } from "./edge-detection-pass";

export enum PostproductionAspect {
  COLOR = 0,
  PEN = 1,
  PEN_SHADOWS = 2,
  COLOR_PEN = 3,
  COLOR_SHADOWS = 4,
  COLOR_PEN_SHADOWS = 5,
}

export class Postproduction {
  invisibleMaterials = new Set<THREE.Material>();
  composer?: EffectComposer;

  readonly onStyleChanged = new OBC.Event<PostproductionAspect>();

  private _enabled = false;
  private _initialized = false;

  private _basePass?: BasePass;
  private _aoPass?: AOPass;
  private _outputPass?: OutputPass;
  private _edgeDetectionPass?: EdgeDetectionPass;
  private _smaaPass?: SMAAPass;
  private _simpleOutlinePass?: SimpleOutlinePass;
  private _excludedObjectsPass?: ExcludedObjectsPass;
  private _glossPass?: GlossPass;
  private _style = PostproductionAspect.COLOR;
  private _outlinesEnabled = false;
  private _glossEnabled = false;
  private _smaaEnabled = false;
  private _excludedObjectsEnabled = false;
  private _components: OBC.Components;
  private _renderer: PostproductionRenderer;

  defaultAoParameters = {
    radius: 0.25,
    distanceExponent: 5.7,
    thickness: 10,
    scale: 2,
    samples: 16,
    distanceFallOff: 1,
    screenSpaceRadius: true,
  };

  get basePass() {
    if (!this._basePass) {
      throw new Error("Base pass not initialized");
    }
    return this._basePass;
  }

  get enabled() {
    return this._enabled;
  }

  set enabled(value: boolean) {
    this._enabled = value;
    if (value && !this._initialized) {
      this.initialize();
    }
    if (!value) {
      for (const material of this.basePass.isolatedMaterials) {
        material.visible = true;
      }
    }
  }

  get aoPass() {
    if (!this._aoPass) {
      throw new Error("AO pass not initialized");
    }
    return this._aoPass;
  }

  get outlinePass() {
    if (!this._simpleOutlinePass) {
      throw new Error("Outline pass not initialized");
    }
    return this._simpleOutlinePass;
  }

  get edgesPass() {
    if (!this._edgeDetectionPass) {
      throw new Error("Edge detection pass not initialized");
    }
    return this._edgeDetectionPass;
  }

  get excludedObjectsPass() {
    if (!this._excludedObjectsPass) {
      throw new Error("Excluded objects pass not initialized");
    }
    return this._excludedObjectsPass;
  }

  get glossPass() {
    if (!this._glossPass) {
      throw new Error("Gloss pass not initialized");
    }
    return this._glossPass;
  }

  get outlinesEnabled() {
    return this._outlinesEnabled;
  }

  set outlinesEnabled(value: boolean) {
    this._outlinesEnabled = value;
    this.style = this._style;
  }

  get excludedObjectsEnabled() {
    return this._excludedObjectsEnabled;
  }

  set excludedObjectsEnabled(value: boolean) {
    this._excludedObjectsEnabled = value;
    this.style = this._style;
  }

  get glossEnabled() {
    return this._glossEnabled;
  }

  set glossEnabled(value: boolean) {
    this._glossEnabled = value;
    this.style = this._style;
  }

  get smaaEnabled() {
    return this._smaaEnabled;
  }

  set smaaEnabled(value: boolean) {
    this._smaaEnabled = value;
    this.style = this._style;
  }

  get style() {
    return this._style;
  }

  set style(value: PostproductionAspect) {
    if (!this.composer) return;
    if (
      !this.composer ||
      !this._basePass ||
      !this._smaaPass ||
      !this._outputPass ||
      !this._aoPass ||
      !this._edgeDetectionPass ||
      !this._simpleOutlinePass ||
      !this._excludedObjectsPass ||
      !this._glossPass
    ) {
      return;
    }

    if (this._style === PostproductionAspect.PEN_SHADOWS) {
      this._aoPass.updateGtaoMaterial(this.defaultAoParameters);
    }

    this._style = value;
    this.clear();

    if (value === PostproductionAspect.COLOR) {
      this.composer.addPass(this._basePass);
      if (this._glossEnabled) {
        this.composer.addPass(this._glossPass);
      }
      if (this._outlinesEnabled) {
        this.composer.addPass(this._simpleOutlinePass);
      }
      if (this._excludedObjectsEnabled) {
        this.composer.addPass(this._excludedObjectsPass);
      }
      if (this._smaaEnabled) {
        this.composer.addPass(this._smaaPass);
      }
      this.composer.addPass(this._outputPass);
    }

    if (value === PostproductionAspect.PEN) {
      this.composer.addPass(this._edgeDetectionPass);
      if (this._outlinesEnabled) {
        this.composer.addPass(this._simpleOutlinePass);
      }
      if (this._excludedObjectsEnabled) {
        this.composer.addPass(this._excludedObjectsPass);
      }
      if (this._smaaEnabled) {
        this.composer.addPass(this._smaaPass);
      }
    }

    if (value === PostproductionAspect.PEN_SHADOWS) {
      this.composer.addPass(this._basePass);
      this.composer.addPass(this._aoPass);
      this._aoPass.output = GTAOPass.OUTPUT.AO;
      this.composer.addPass(this._edgeDetectionPass);
      if (this._outlinesEnabled) {
        this.composer.addPass(this._simpleOutlinePass);
      }
      if (this._excludedObjectsEnabled) {
        this.composer.addPass(this._excludedObjectsPass);
      }
      if (this._smaaEnabled) {
        this.composer.addPass(this._smaaPass);
      }
      this.composer.addPass(this._outputPass);
    }

    if (value === PostproductionAspect.COLOR_PEN) {
      this.composer.addPass(this._basePass);
      if (this._glossEnabled) {
        this.composer.addPass(this._glossPass);
      }
      this.composer.addPass(this._edgeDetectionPass);
      if (this._outlinesEnabled) {
        this.composer.addPass(this._simpleOutlinePass);
      }
      if (this._excludedObjectsEnabled) {
        this.composer.addPass(this._excludedObjectsPass);
      }
      if (this._smaaEnabled) {
        this.composer.addPass(this._smaaPass);
      }
      this.composer.addPass(this._outputPass);
    }

    if (value === PostproductionAspect.COLOR_SHADOWS) {
      this.composer.addPass(this._basePass);
      if (this._glossEnabled) {
        this.composer.addPass(this._glossPass);
      }
      this.composer.addPass(this._aoPass);
      this._aoPass.output = GTAOPass.OUTPUT.Default;
      if (this._outlinesEnabled) {
        this.composer.addPass(this._simpleOutlinePass);
      }
      if (this._excludedObjectsEnabled) {
        this.composer.addPass(this._excludedObjectsPass);
      }
      if (this._smaaEnabled) {
        this.composer.addPass(this._smaaPass);
      }
      this.composer.addPass(this._outputPass);
    }

    if (value === PostproductionAspect.COLOR_PEN_SHADOWS) {
      this.composer.addPass(this._basePass);
      if (this._glossEnabled) {
        this.composer.addPass(this._glossPass);
      }
      this.composer.addPass(this._aoPass);
      this._aoPass.output = GTAOPass.OUTPUT.Default;
      this.composer.addPass(this._edgeDetectionPass);
      if (this._outlinesEnabled) {
        this.composer.addPass(this._simpleOutlinePass);
      }
      if (this._excludedObjectsEnabled) {
        this.composer.addPass(this._excludedObjectsPass);
      }
      if (this._smaaEnabled) {
        this.composer.addPass(this._smaaPass);
      }
      this.composer.addPass(this._outputPass);
    }

    this.onStyleChanged.trigger(value);
  }

  constructor(components: OBC.Components, renderer: PostproductionRenderer) {
    this._components = components;
    this._renderer = renderer;
  }

  update() {
    if (!this.composer) return;
    for (const material of this.invisibleMaterials) {
      material.userData.wasVisibleForPostproduction = material.visible;
      material.visible = false;
    }
    this.composer.render();
    for (const material of this.invisibleMaterials) {
      material.visible = material.userData.wasVisibleForPostproduction;
    }
  }

  dispose() {
    this.composer?.dispose();
    this._aoPass?.dispose();
    this._outputPass?.dispose();
    this._edgeDetectionPass?.dispose();
    this._smaaPass?.dispose();
    this._simpleOutlinePass?.dispose();
    this._excludedObjectsPass?.dispose();
    this._glossPass?.dispose();
  }

  setSize(width: number, height: number) {
    if (width === 0 || height === 0) {
      return;
    }
    if (this.composer) {
      this.composer.setSize(width, height);
    }
    if (this._simpleOutlinePass) {
      this._simpleOutlinePass.setSize(width, height);
    }
    if (this._excludedObjectsPass) {
      this._excludedObjectsPass.setSize(width, height);
    }
    if (this._glossPass) {
      this._glossPass.setSize(width, height);
    }
  }

  updateCamera() {
    const camera = this._renderer.currentWorld!.camera.three;
    if (this._basePass) {
      this._basePass.camera = camera;
    }
    if (this._aoPass) {
      this._aoPass.camera = camera;
    }
  }

  clear() {
    if (!this.composer) return;
    const passes = [...this.composer.passes];
    for (const pass of passes) {
      this.composer.removePass(pass);
    }
    this._renderer.three.setClearColor(0x000000, 0);
    this._renderer.three.setRenderTarget(this.composer.renderTarget1);
    this._renderer.three.clear();
    this._renderer.three.setRenderTarget(this.composer.renderTarget2);
    this._renderer.three.clear();
    this._renderer.three.setRenderTarget(null);
  }

  private initialize() {
    this._initialized = true;

    const scene = this._renderer.currentWorld!.scene.three as THREE.Scene;
    const camera = this._renderer.currentWorld!.camera.three;

    // Configure renderer for transparency
    this._renderer.three.setClearColor(0x000000, 0);

    this.composer = new EffectComposer(this._renderer.three);

    const basePass = new BasePass(scene, camera);
    this._basePass = basePass;

    this._smaaPass = new SMAAPass();

    const fragmentsManager = this._components.get(OBC.FragmentsManager);

    this._aoPass = new AOPass(
      fragmentsManager,
      scene,
      camera,
      this._renderer.three.domElement.width,
      this._renderer.three.domElement.height,
    );
    this._aoPass.output = GTAOPass.OUTPUT.Default;
    this._edgeDetectionPass = new EdgeDetectionPass(
      this._renderer,
      fragmentsManager,
    );

    this._outputPass = new OutputPass();

    this._simpleOutlinePass = new SimpleOutlinePass(
      this._renderer.three.domElement.width,
      this._renderer.three.domElement.height,
      this._renderer.currentWorld!,
    );

    this._excludedObjectsPass = new ExcludedObjectsPass(
      this._renderer,
      this._renderer.currentWorld!,
    );

    this._glossPass = new GlossPass(
      new THREE.Vector2(
        this._renderer.three.domElement.width,
        this._renderer.three.domElement.height,
      ),
      this._renderer.currentWorld!,
    );

    this.style = PostproductionAspect.COLOR;
  }
}
