import * as THREE from "three";
import * as OBC from "@thatopen/components";
import { RendererWith2D } from "../Marker";
import { Postproduction } from "./src";

export { PostproductionAspect } from "./src";

/**
 * A class that extends RendererWith2D and adds post-processing capabilities. 📕 [Tutorial](https://docs.thatopen.com/Tutorials/Components/Front/PostproductionRenderer). 📘 [API](https://docs.thatopen.com/api/@thatopen/components-front/classes/PostproductionRenderer).
 */
export class PostproductionRenderer extends RendererWith2D {
  private _postproduction?: Postproduction;

  /**
   * Getter for the postproduction instance.
   * Throws an error if the postproduction instance is not yet initialized.
   *
   * @returns The initialized Postproduction instance.
   */
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

    this.onResize.add((size) => {
      this.setPostproductionSize(size);
    });

    this.onWorldChanged.add(() => {
      if (this.currentWorld) {
        if (this._postproduction) {
          this._postproduction.dispose();
        }
        this._postproduction = new Postproduction(components, this);
        this.setPostproductionSize();
      }
    });
  }

  /** {@link Updateable.update} */
  update() {
    if (!this.enabled) return;
    if (!this.currentWorld) {
      return;
    }
    this.onBeforeUpdate.trigger();
    const scene = this.currentWorld.scene.three;
    const camera = this.currentWorld.camera.three;
    if (this.postproduction.enabled) {
      this.postproduction.update();
    } else {
      this.three.render(scene, camera);
    }
    if (scene instanceof THREE.Scene) {
      this.three2D.render(scene, camera);
    }
    this.onAfterUpdate.trigger();
  }

  /** {@link OBC.Disposable.dispose}. */
  dispose() {
    super.dispose();
    this.postproduction.dispose();
  }

  private setPostproductionSize(size?: THREE.Vector2) {
    if (size) {
      if (size.x === 0 || size.y === 0) {
        return;
      }
    }
    if (!this.container || !this._postproduction) {
      return;
    }
    const ratio = Math.min(window.devicePixelRatio, 2);
    const width = size?.x ?? this.container.clientWidth * ratio;
    const height = size?.y ?? this.container.clientHeight * ratio;
    if (width === 0 || height === 0) {
      return;
    }
    this.postproduction.setSize(width, height);
  }
}
