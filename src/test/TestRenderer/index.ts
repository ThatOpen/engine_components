import * as THREE from "three";
// @ts-ignore
import createContext from "gl";
// eslint-disable-next-line import/no-extraneous-dependencies
import { createCanvas } from "canvas";
import { WebGLRenderer } from "three";
import { WebGLRendererParameters } from "three/src/renderers/WebGLRenderer";
import { BaseRenderer, Disposable } from "../../base-types";
import { Components } from "../../core";

export class TestRenderer extends BaseRenderer implements Disposable {
  name = "TestRenderer";
  enabled: boolean = true;
  protected _renderer: THREE.WebGLRenderer;

  // @ts-ignore * uninitialized
  private container: HTMLElement;

  constructor(
    components: Components,
    container: HTMLElement,
    options?: WebGLRendererParameters
  ) {
    super(components);

    this.container = container;

    const { canvas, context } = this.getCanvasContext(container);

    const div = document.createElement("div");
    div.appendChild(canvas);

    this._renderer = new THREE.WebGLRenderer({ canvas, context, ...options });
  }

  async dispose() {}

  resize(): void {}

  get(): WebGLRenderer {
    return this._renderer;
  }

  getSize(): THREE.Vector2 {
    return new THREE.Vector2(
      this._renderer.domElement.clientWidth,
      this._renderer.domElement.clientHeight
    );
  }

  private getCanvasContext(container: HTMLElement): {
    context: WebGLRenderingContext;
    canvas: HTMLCanvasElement;
  } {
    const context = createContext(1, 1);

    const canvas: HTMLCanvasElement = createCanvas(
      container.clientWidth,
      container.clientHeight
    ) as any;

    canvas.addEventListener = function () {};

    return { context, canvas };
  }
}
