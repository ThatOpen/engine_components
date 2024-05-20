import * as THREE from "three";
import { CSS2DObject } from "three/examples/jsm/renderers/CSS2DRenderer.js";
import * as OBC from "@thatopen/components";

export class Mark implements OBC.Hideable, OBC.Disposable {
  three: CSS2DObject;

  world: OBC.World;

  /** {@link Disposable.onDisposed} */
  readonly onDisposed = new OBC.Event();

  set visible(value: boolean) {
    this.three.visible = value;
  }

  get visible() {
    return this.three.visible;
  }

  // Define marker as setup configuration?
  constructor(
    world: OBC.World,
    element?: HTMLElement,
    parent?: THREE.Object3D,
  ) {
    this.world = world;

    let marker: HTMLElement;
    if (element) {
      marker = element;
    } else {
      marker = document.createElement("div");
      marker.style.width = "15px";
      marker.style.height = "15px";
      marker.style.border = "5px solid red";
    }

    this.three = new CSS2DObject(marker);

    const container = parent || world.scene.three;
    container.add(this.three);

    this.visible = true;
  }

  toggleVisibility() {
    this.visible = !this.visible;
  }

  dispose() {
    this.three.removeFromParent();
    this.three.element.remove();
    this.onDisposed.trigger();
    this.onDisposed.reset();
  }
}
