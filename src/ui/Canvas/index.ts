import * as THREE from "three";
import { SimpleUIComponent } from "../SimpleUIComponent";
import { Components } from "../../core";
import { Resizeable, Event } from "../../base-types";

export class Canvas
  extends SimpleUIComponent<HTMLCanvasElement>
  implements Resizeable
{
  name: string = "Canvas";
  readonly onResize = new Event<THREE.Vector2>();

  private _size = new THREE.Vector2(320, 160);

  constructor(components: Components) {
    const template = `
        <canvas class="absolute w-80 h-40 right-8 bottom-4 bg-ifcjs-120 
        border-transparent border border-solid rounded-lg"></canvas> 
    `;
    super(components, template);
  }

  getSize(): THREE.Vector2 {
    return this._size;
  }

  resize(size?: THREE.Vector2) {
    if (size) {
      this._size = size;
      this.domElement.style.width = `${size.x}px`;
      this.domElement.style.height = `${size.y}px`;
      this.onResize.trigger(size);
    }
  }
}
