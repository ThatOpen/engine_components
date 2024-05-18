import * as THREE from "three";
import * as OBC from "@thatopen/components";
import { Postproduction } from "./src/postproduction";
import { RendererWith2D } from "../Marker";

/**
 * Renderer that uses efficient postproduction effects (e.g. Ambient Occlusion).
 */
export class PostproductionRenderer extends RendererWith2D {
  private _postproduction?: Postproduction;

  /** Helper object to handle the postproduction effects applied. */
  get postproduction() {
    if (!this._postproduction) {
      throw new Error("Renderer not initialized yet with a world!");
    }
    return this._postproduction;
  }

  constructor(
    components: OBC.Components,
    container: HTMLElement,
    parameters?: Partial<THREE.WebGLRendererParameters>,
  ) {
    super(components, container, parameters);
    this.onResize.add((size) => this.resizePostproduction(size));

    this.onWorldChanged.add(() => {
      if (this.currentWorld) {
        if (this._postproduction) {
          this._postproduction.dispose();
        }
        this._postproduction = new Postproduction(
          components,
          this.three,
          this.currentWorld,
        );
        this.setPostproductionSize();
      }
    });
  }

  update() {
    if (!this.enabled) return;

    if (!this.currentWorld) {
      return;
    }

    this.onBeforeUpdate.trigger();

    const scene = this.currentWorld.scene.three;
    const camera = this.currentWorld.camera.three;

    if (this.postproduction.enabled) {
      this.postproduction.composer.render();
    } else {
      this.three.render(scene, camera);
    }
    if (scene instanceof THREE.Scene) {
      this.three2D.render(scene, camera);
    }
    this.onAfterUpdate.trigger();
  }

  /** {@link Disposable.dispose}. */
  dispose() {
    super.dispose();
    this.postproduction.dispose();
  }

  private resizePostproduction(size?: THREE.Vector2) {
    if (this.postproduction) {
      this.setPostproductionSize(size);
    }
  }

  private setPostproductionSize(size?: THREE.Vector2) {
    if (!this.container) return;
    const width = size ? size.x : this.container.clientWidth;
    const height = size ? size.y : this.container.clientHeight;
    this.postproduction.setSize(width, height);
  }
}
