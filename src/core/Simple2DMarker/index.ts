import { CSS2DObject } from "three/examples/jsm/renderers/CSS2DRenderer";
import { Vector3 } from "three";
import { Component, Hideable } from "../../base-types";
import { Components } from "../Components";

export class Simple2DMarker extends Component<CSS2DObject> implements Hideable {
  name: string = "Simple2DMarker";
  enabled: boolean = true;
  visible: boolean = true;
  private _components: Components;
  private _marker: CSS2DObject;

  constructor(components: Components, position?: Vector3) {
    super();
    this._components = components;
    const marker = document.createElement("div");
    marker.className = "w-[15px] h-[15px] border-3 border-solid border-red-500";
    this._marker = new CSS2DObject(marker);
    this._marker.visible = this.visible;
    this._components.scene.get().add(this._marker);
    if (position) {
      this._marker.position.copy(position);
    }
  }

  get(): CSS2DObject {
    return this._marker;
  }
}
