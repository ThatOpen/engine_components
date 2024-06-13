import * as THREE from "three";
import { CSS2DRenderer } from "three/examples/jsm/renderers/CSS2DRenderer.js";
import { Components, SimpleRenderer } from "@thatopen/components";

/**
 * A basic renderer capable of rendering 3D and 2D objects ([Objec3Ds](https://threejs.org/docs/#api/en/core/Object3D) and [CSS2DObjects](https://threejs.org/docs/#examples/en/renderers/CSS2DRenderer) respectively).
 */
export class RendererWith2D extends SimpleRenderer {
  /**
   * This renderer is used to render 2D objects (CSS2DObjects) in a 3D scene.
   */
  three2D = new CSS2DRenderer();

  constructor(
    components: Components,
    container: HTMLElement,
    parameters?: Partial<THREE.WebGLRendererParameters>,
  ) {
    super(components, container, parameters);

    this.onAfterUpdate.add(() => {
      this.onBeforeUpdate.trigger(this);
      if (!this.enabled || !this.currentWorld) return;
      const scene = this.currentWorld.scene.three;
      const camera = this.currentWorld.camera.three;
      if (scene instanceof THREE.Scene) {
        this.three2D.render(scene, camera);
      }
    });

    this.onDisposed.add(() => {
      this.three2D.domElement.remove();
    });

    this.onResize.add(({ x, y }) => {
      this.three2D.setSize(x, y);
    });

    this.setupHtmlRenderer();
    this.resize();
  }

  private setupHtmlRenderer() {
    this.three2D.domElement.style.position = "absolute";
    this.three2D.domElement.style.top = "0px";
    this.three2D.domElement.style.pointerEvents = "none";
    if (this.container) {
      this.container.appendChild(this.three2D.domElement);
    }
  }
}
