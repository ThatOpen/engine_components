import * as THREE from "three";
import { SimpleRenderer } from "../../core/SimpleRenderer";
import { Components } from "../../core/Components";
import { Postproduction } from "./src/postproduction";

/**
 * Renderer that uses efficient postproduction effects (e.g. Ambient Occlusion).
 */
export class PostproductionRenderer extends SimpleRenderer {
  /** Helper object to handle the postproduction effects applied. */
  postproduction: Postproduction;

  constructor(
    components: Components,
    container?: HTMLElement,
    parameters?: Partial<THREE.WebGLRendererParameters>
  ) {
    super(components, container, parameters);
    this.postproduction = new Postproduction(components, this._renderer);
    this.setPostproductionSize();
    this.onResize.add((size) => this.resizePostproduction(size));
  }

  /** {@link Updateable.update} */
  async update() {
    if (!this.enabled) return;
    await this.onBeforeUpdate.trigger();
    const scene = this.overrideScene || this.components.scene.get();
    const camera = this.overrideCamera || this.components.camera.get();
    if (!scene || !camera) return;
    if (this.postproduction.enabled) {
      this.postproduction.composer.render();
    } else {
      this._renderer.render(scene, camera);
    }
    this._renderer2D.render(scene, camera);
    await this.onAfterUpdate.trigger();
  }

  /** {@link Disposable.dispose}. */
  async dispose() {
    await super.dispose();
    await this.postproduction.dispose();
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
