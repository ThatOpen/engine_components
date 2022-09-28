import { SimpleRenderer } from "../../core";
import { Components } from "../../components";
import { Postproduction } from "./postproduction";

export class PostproductionRenderer extends SimpleRenderer {
  postproduction: Postproduction;

  constructor(components: Components, container: HTMLElement) {
    super(components, container);
    this.postproduction = new Postproduction(components, this._renderer);
    this.setSize();
  }

  setSize() {
    super.setSize();
    const width = this.container.clientWidth;
    const height = this.container.clientHeight;
    this.postproduction?.setSize(width, height);
  }
}
