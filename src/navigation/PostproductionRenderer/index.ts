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
    this.resize();
  }

  /** {@link Disposable.dispose}. */
  dispose() {
    super.dispose();
    this.postproduction.dispose();
  }

  /** {@link Resizeable.resize}. */
  resize() {
    super.resize();
    const width = this.container.clientWidth;
    const height = this.container.clientHeight;
    this.postproduction?.setSize(width, height);
  }
}
