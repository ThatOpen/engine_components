import * as THREE from "three";
import * as OBC from "@thatopen/components";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { GTAOPass } from "three/examples/jsm/postprocessing/GTAOPass.js";
import { OutputPass } from "three/examples/jsm/postprocessing/OutputPass.js";
import { SMAAPass } from "three/examples/jsm/postprocessing/SMAAPass.js";
import { EdgeDetectionPass } from "./edge-detection-pass";
import { SimpleOutlinePass } from "./simple-outline-pass";
import { ExcludedObjectsPass } from "./excluded-objects-pass";
import { PostproductionRenderer } from "..";
import { BasePass } from "./base-pass";

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

  private _enabled = false;
  private _initialized = false;

  private _composer?: EffectComposer;
  private _basePass?: BasePass;
  private _aoPass?: GTAOPass;
  private _outputPass?: OutputPass;
  private _edgeDetectionPass?: EdgeDetectionPass;
  private _smaaPass?: SMAAPass;
  private _simpleOutlinePass?: SimpleOutlinePass;
  private _excludedObjectsPass?: ExcludedObjectsPass;
  private _style = PostproductionAspect.COLOR;
  private _outlinesEnabled = false;
  private _excludedObjectsEnabled = false;
  private _components: OBC.Components;
  private _renderer: PostproductionRenderer;

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

  get style() {
    return this._style;
  }

  set style(value: PostproductionAspect) {
    if (!this._composer) return;
    if (
      !this._composer ||
      !this._basePass ||
      !this._smaaPass ||
      !this._outputPass ||
      !this._aoPass ||
      !this._edgeDetectionPass ||
      !this._simpleOutlinePass ||
      !this._excludedObjectsPass
    ) {
      return;
    }

    this._style = value;
    this.clearPasses();
    this.clearComposer();

    if (value === PostproductionAspect.COLOR) {
      this._composer.addPass(this._basePass);
      if (this._outlinesEnabled) {
        this._composer.addPass(this._simpleOutlinePass);
      }
      if (this._excludedObjectsEnabled) {
        this._composer.addPass(this._excludedObjectsPass);
      }
      this._composer.addPass(this._outputPass);
    }

    if (value === PostproductionAspect.PEN) {
      this._composer.addPass(this._edgeDetectionPass);
      if (this._outlinesEnabled) {
        this._composer.addPass(this._simpleOutlinePass);
      }
      if (this._excludedObjectsEnabled) {
        this._composer.addPass(this._excludedObjectsPass);
      }
    }

    if (value === PostproductionAspect.PEN_SHADOWS) {
      this._composer.addPass(this._basePass);
      this._composer.addPass(this._aoPass);
      this._aoPass.output = GTAOPass.OUTPUT.AO;
      this._composer.addPass(this._edgeDetectionPass);
      if (this._outlinesEnabled) {
        this._composer.addPass(this._simpleOutlinePass);
      }
      if (this._excludedObjectsEnabled) {
        this._composer.addPass(this._excludedObjectsPass);
      }
      this._composer.addPass(this._outputPass);
    }

    if (value === PostproductionAspect.COLOR_PEN) {
      this._composer.addPass(this._basePass);
      this._composer.addPass(this._edgeDetectionPass);
      if (this._outlinesEnabled) {
        this._composer.addPass(this._simpleOutlinePass);
      }
      if (this._excludedObjectsEnabled) {
        this._composer.addPass(this._excludedObjectsPass);
      }
      this._composer.addPass(this._outputPass);
    }

    if (value === PostproductionAspect.COLOR_SHADOWS) {
      this._composer.addPass(this._basePass);
      this._composer.addPass(this._aoPass);
      this._aoPass.output = GTAOPass.OUTPUT.Default;
      if (this._outlinesEnabled) {
        this._composer.addPass(this._simpleOutlinePass);
      }
      if (this._excludedObjectsEnabled) {
        this._composer.addPass(this._excludedObjectsPass);
      }
      this._composer.addPass(this._outputPass);
    }

    if (value === PostproductionAspect.COLOR_PEN_SHADOWS) {
      this._composer.addPass(this._basePass);
      this._composer.addPass(this._aoPass);
      this._aoPass.output = GTAOPass.OUTPUT.Default;
      this._composer.addPass(this._edgeDetectionPass);
      if (this._outlinesEnabled) {
        this._composer.addPass(this._simpleOutlinePass);
      }
      if (this._excludedObjectsEnabled) {
        this._composer.addPass(this._excludedObjectsPass);
      }
      this._composer.addPass(this._outputPass);
    }
  }

  constructor(components: OBC.Components, renderer: PostproductionRenderer) {
    this._components = components;
    this._renderer = renderer;
  }

  update() {
    if (!this._composer) return;
    for (const material of this.invisibleMaterials) {
      material.userData.wasVisibleForPostproduction = material.visible;
      material.visible = false;
    }
    this._composer.render();
    for (const material of this.invisibleMaterials) {
      material.visible = material.userData.wasVisibleForPostproduction;
    }
  }

  dispose() {
    this._composer?.dispose();
    this._aoPass?.dispose();
    this._outputPass?.dispose();
    this._edgeDetectionPass?.dispose();
    this._smaaPass?.dispose();
    this._simpleOutlinePass?.dispose();
    this._excludedObjectsPass?.dispose();
  }

  setSize(width: number, height: number) {
    if (width === 0 || height === 0) {
      return;
    }
    if (this._composer) {
      this._composer.setSize(width, height);
    }
    if (this._simpleOutlinePass) {
      this._simpleOutlinePass.setSize(width, height);
    }
    if (this._excludedObjectsPass) {
      this._excludedObjectsPass.setSize(width, height);
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

  private clearPasses() {
    if (!this._composer) return;
    const passes = [...this._composer.passes];
    for (const pass of passes) {
      this._composer.removePass(pass);
    }
  }

  private clearComposer() {
    if (!this._composer) return;
    this._renderer.three.setClearColor(0x000000, 0);
    this._renderer.three.setRenderTarget(this._composer.renderTarget1);
    this._renderer.three.clear();
    this._renderer.three.setRenderTarget(this._composer.renderTarget2);
    this._renderer.three.clear();
    this._renderer.three.setRenderTarget(null);
  }

  private initialize() {
    this._initialized = true;

    const scene = this._renderer.currentWorld!.scene.three as THREE.Scene;
    const camera = this._renderer.currentWorld!.camera.three;

    // Configure renderer for transparency
    this._renderer.three.setClearColor(0x000000, 0);

    this._composer = new EffectComposer(this._renderer.three);

    const basePass = new BasePass(scene, camera);
    this._basePass = basePass;

    this._smaaPass = new SMAAPass();

    this._aoPass = new GTAOPass(
      scene,
      camera,
      this._renderer.three.domElement.width,
      this._renderer.three.domElement.height,
    );
    this._aoPass.output = GTAOPass.OUTPUT.Default;

    const fragmentsManager = this._components.get(OBC.FragmentsManager);
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

    this.style = PostproductionAspect.COLOR;
  }
}
