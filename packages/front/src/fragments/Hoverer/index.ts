import * as THREE from "three";
import * as OBC from "@thatopen/components";
import * as FRAGS from "@thatopen/fragments";
import { DataSet } from "@thatopen/fragments";
import { Mesher } from "../Mesher";

/**
 * The `Hoverer` class is responsible for managing hover effects on 3D objects within a scene. It supports animations for fading in and out hover effects and manages the lifecycle of associated 3D meshes. 📕 [Tutorial](https://docs.thatopen.com/Tutorials/Components/Front/Hoverer). 📘 [API](https://docs.thatopen.com/api/@thatopen/components-front/classes/Hoverer).
 */
export class Hoverer extends OBC.Component implements OBC.Disposable {
  static uuid = "26fbd870-b1b2-4b71-b747-4063d484de1b" as const;

  private HOVERER_OPACITY_KEY = "_maxHoverOpacity";
  private _hoverTimeout: number | null = null;
  private _meshes = new DataSet<THREE.Mesh>();
  private _localId: number | null = null;
  private _fadeAnimation: {
    startTime: number;
    duration: number;
    fadeIn: boolean;
  } | null = null;

  private _world: OBC.World | null = null;
  set world(value: OBC.World | null) {
    if (value) {
      this.components.get(OBC.Raycasters).get(value); // init the raycaster
      this._world = value;
      this.setupEvents(true);
      for (const mesh of this._meshes) {
        value.scene.three.add(mesh);
      }
    } else {
      this.setupEvents(false);
      this._world = null;
      for (const mesh of this._meshes) {
        mesh.removeFromParent();
      }
    }
  }

  get world() {
    return this._world;
  }

  private _enabled = false;
  set enabled(value: boolean) {
    this.setupEvents(value);
    this._enabled = value;
  }

  get enabled() {
    return this._enabled;
  }

  private _material: THREE.Material = new THREE.MeshBasicMaterial({
    color: 0xffffff,
    transparent: true,
    opacity: 0.5,
    depthTest: false,
    userData: { [this.HOVERER_OPACITY_KEY]: 0.5 },
  });

  set material(value: THREE.Material) {
    value.userData[this.HOVERER_OPACITY_KEY] = value.opacity;
    for (const mesh of this._meshes) {
      mesh.material = value;
    }
    this._material.dispose();
    this._material = value;
  }

  get material() {
    return this._material;
  }

  readonly onDisposed = new OBC.Event();
  duration = 200;
  animation = true;

  constructor(components: OBC.Components) {
    super(components);
    components.add(Hoverer.uuid, this);

    this._meshes.onBeforeDelete.add((mesh) => {
      mesh.removeFromParent();
      mesh.geometry.dispose();
    });

    this._meshes.onItemAdded.add((mesh) => {
      if (!this.world) return;
      this.world.scene.three.add(mesh);
    });

    this._meshes.onCleared.add(() => {
      this._localId = null;
      if (this._hoverTimeout) {
        clearTimeout(this._hoverTimeout);
        this._hoverTimeout = null;
      }
    });
  }

  private setupEvents(active: boolean) {
    if (!this.world || this.world.isDisposing) return;

    if (!this.world.renderer) {
      throw new Error("The given world doesn't have a renderer!");
    }

    const container = this.world.renderer.three.domElement;
    container.removeEventListener("mousemove", this.onMouseMove);
    container.removeEventListener("mouseleave", this.onMouseMove);
    if (!active) return;
    container.addEventListener("mousemove", this.onMouseMove);
    container.addEventListener("mouseleave", this.onMouseLeave);
  }

  private mouseStopTimeout: number | null = null;

  private onMouseMove = () => {
    if (this.mouseStopTimeout !== null) {
      clearTimeout(this.mouseStopTimeout);
    }

    this.mouseStopTimeout = window.setTimeout(() => this.hover(), 50);
  };

  private onMouseLeave = () => {
    this._meshes.clear();
  };

  private animate = () => {
    if (!(this._fadeAnimation && this.animation && this.material.transparent))
      return;
    const { startTime, duration, fadeIn } = this._fadeAnimation;
    const elapsed = Date.now() - startTime;
    const progress = Math.min(elapsed / duration, 1);

    const value = fadeIn ? progress : 1 - progress;
    const maxOpacity = this.material.userData[this.HOVERER_OPACITY_KEY];
    const opacity = value * (maxOpacity !== undefined ? maxOpacity : 1);
    this.material.opacity = opacity;

    if (progress < 1) {
      requestAnimationFrame(this.animate);
    } else {
      if (!fadeIn) this._meshes.clear();
      this._fadeAnimation = null;
    }
  };

  async hover() {
    if (!this.enabled) return;
    if (!this.world) return;

    const casters = this.components.get(OBC.Raycasters);
    const caster = casters.get(this.world);
    const result = (await caster.castRay()) as unknown as {
      fragments: FRAGS.FragmentsModel;
      localId: number;
    } | null;

    if (!result) {
      this._meshes.clear();
      return;
    }

    const { fragments: model, localId } = result;

    if (this._localId === localId) return;
    this._meshes.clear();
    this._localId = localId;

    this._hoverTimeout = window.setTimeout(async () => {
      const modelIdMap = { [model.modelId]: new Set([localId]) };
      const mesher = this.components.get(Mesher);
      const meshes = await mesher.get(modelIdMap);

      for (const [_, data] of meshes.entries()) {
        const meshes = [...data.values()].flat();
        for (const mesh of meshes) {
          mesh.material = this.material;
          this._meshes.add(mesh);
        }
      }

      this._fadeAnimation = {
        startTime: Date.now(),
        duration: this.duration, // in milliseconds
        fadeIn: true,
      };

      this.animate();
    }, 100);
  }

  clear() {
    this._meshes.clear();
  }

  dispose() {
    this._enabled = false;
    this._meshes.clear();
    this._fadeAnimation = null;
    this._hoverTimeout = null;
    this.onDisposed.trigger();
  }
}
