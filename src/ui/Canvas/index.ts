import * as THREE from "three";
import { generateUUID } from "three/src/math/MathUtils";
import { SimpleUIComponent } from "../SimpleUIComponent";
import { Components } from "../../core";
import { Resizeable } from "../../base-types";

export class Canvas
  extends SimpleUIComponent<HTMLCanvasElement>
  implements Resizeable
{
  name: string = "SimpleUICard";
  private _size = new THREE.Vector2(320, 160);
  private _canvas: HTMLCanvasElement;

  constructor(components: Components) {
    const id = generateUUID();
    const canvas = document.createElement("canvas");
    canvas.className =
      "absolute w-80 h-40 right-3 bottom-3 bg-ifcjs-120 border-transparent border border-solid";
    super(components, canvas, id);
    this._canvas = canvas;
  }

  getSize(): THREE.Vector2 {
    return this._size;
  }

  resize(size?: THREE.Vector2) {
    if (size) {
      this._size = size;
      this._canvas.style.width = `${size.x}px`;
      this._canvas.style.height = `${size.y}px`;
    }
  }
}
