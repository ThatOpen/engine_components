import { SimpleRenderer } from "../../core/SimpleRenderer";
import { Components } from "../../core/Components";
import { Postproduction } from "./src/postproduction";

/**
 * Renderer that uses efficient postproduction effects (e.g. Ambient Occlusion).
 */
export class PostproductionRenderer extends SimpleRenderer {
  /** Helper object to handle the postproduction effects applied. */
  postproduction: Postproduction;

  constructor(components: Components, container: HTMLElement) {
    super(components, container);
    this.postproduction = new Postproduction(components, this._renderer);
    this.setPostproductionSize();
  }

  /** {@link Updateable.update} */
  update(_delta: number) {
    this.beforeUpdate.trigger(this);
    const scene = this.components.scene?.get();
    const camera = this.components.camera?.get();
    if (!scene || !camera) return;
    if (this.postproduction.enabled) {
      this.postproduction.composer.render();
    } else {
      this._renderer.render(scene, camera);
    }
    this._renderer2D.render(scene, camera);
    this.afterUpdate.trigger(this);
  }

  /** {@link Disposable.dispose}. */
  dispose() {
    super.dispose();
    this.postproduction.dispose();
  }

  /** {@link Resizeable.resize}. */
  resize() {
    super.resize();
    if (this.postproduction) {
      this.setPostproductionSize();
    }
  }

  private setPostproductionSize() {
    const { clientWidth, clientHeight } = this.container;
    this.postproduction.setSize(clientWidth, clientHeight);
  }
}
