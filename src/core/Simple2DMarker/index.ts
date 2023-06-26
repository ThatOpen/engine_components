import { CSS2DObject } from "three/examples/jsm/renderers/CSS2DRenderer";
import { Component, Hideable, Disposable } from "../../base-types";
import { Components } from "../Components";

export class Simple2DMarker
  extends Component<CSS2DObject>
  implements Hideable, Disposable
{
  name: string = "Simple2DMarker";
  enabled: boolean = true;
  private _visible: boolean = true;
  private _components: Components;
  private _marker: CSS2DObject;

  set visible(value: boolean) {
    this._visible = value;
    this._marker.visible = value;
  }

  get visible() {
    return this._visible;
  }

  constructor(components: Components, marker?: HTMLElement) {
    super();
    this._components = components;
    let _marker: HTMLElement;
    if (marker) {
      _marker = marker;
    } else {
      _marker = document.createElement("div");
      _marker.className =
        "w-[15px] h-[15px] border-3 border-solid border-red-600";
    }
    this._marker = new CSS2DObject(_marker);
    this._components.scene.get().add(this._marker);
    this.visible = true;
  }

  dispose() {
    this._marker.removeFromParent();
    this._marker.element.remove();
  }

  get(): CSS2DObject {
    return this._marker;
  }
}
