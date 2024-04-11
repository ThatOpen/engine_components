import * as THREE from "three";
import { CSS2DObject } from "three/examples/jsm/renderers/CSS2DRenderer";
import { Hideable, Disposable, Event } from "../../base-types";
import { Component } from "../../base-types/component";
import { Components } from "../Components";

export class Simple2DMarker
  extends Component<CSS2DObject>
  implements Hideable, Disposable
{
  /** {@link Component.enabled} */
  enabled: boolean = true;

  private _visible: boolean = true;
  private _marker: CSS2DObject;

  set visible(value: boolean) {
    this._visible = value;
    this._marker.visible = value;
  }

  get visible() {
    return this._visible;
  }

  // Define marker as setup configuration?
  constructor(
    components: Components,
    marker?: HTMLElement,
    parent?: THREE.Object3D
  ) {
    super(components);
    let _marker: HTMLElement;
    if (marker) {
      _marker = marker;
    } else {
      _marker = document.createElement("div");
      _marker.className =
        "w-[15px] h-[15px] border-3 border-solid border-red-600";
    }
    this._marker = new CSS2DObject(_marker);
    if (parent) {
      parent.add(this._marker);
    } else {
      this.components.scene.get().add(this._marker);
    }
    this.visible = true;
  }

  /** {@link Component.get} */
  get(): CSS2DObject {
    return this._marker;
  }

  toggleVisibility() {
    this.visible = !this.visible;
  }

  /** {@link Disposable.onDisposed} */
  readonly onDisposed = new Event<undefined>();

  async dispose() {
    this._marker.removeFromParent();
    this._marker.element.remove();
    await this.onDisposed.trigger();
    this.onDisposed.reset();
  }
}
