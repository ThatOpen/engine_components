import * as THREE from "three";
// @ts-ignore
import createContext from "gl";
import { createCanvas } from "canvas";
import { BaseRenderer, Disposable } from "../../base-types";
import { WebGLRenderer } from "three";
import { WebGLRendererParameters } from "three/src/renderers/WebGLRenderer";

export class TestRenderer extends BaseRenderer implements Disposable {
  name = "TestRenderer";
  enabled: boolean = true;
  protected _renderer: THREE.WebGLRenderer;

  // @ts-ignore * uninitialized
  private container: HTMLElement;

  constructor(container: HTMLElement, options?: WebGLRendererParameters) {
    super();

    this.container = container;

    const { canvas, context } = this.getCanvasContext(container);

    this._renderer = new THREE.WebGLRenderer({ canvas, context, ...options });
  }

  dispose(): void {}

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
