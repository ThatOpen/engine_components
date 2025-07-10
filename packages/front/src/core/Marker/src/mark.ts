import * as THREE from "three";
import { CSS2DObject } from "three/examples/jsm/renderers/CSS2DRenderer.js";
import * as OBC from "@thatopen/components";

/**
 * Represents a marker in the 3D world.
 */
export class Mark implements OBC.Hideable, OBC.Disposable {
  /**
   * The CSS object representing the marker.
   */
  three: CSS2DObject;

  /**
   * The world in which the marker exists.
   */
  world: OBC.World;

  /** {@link OBC.Disposable.onDisposed} */
  readonly onDisposed = new OBC.Event();

  /** {@link OBC.Hideable.visible} */
  set visible(value: boolean) {
    this.three.visible = value;
  }

  /** {@link OBC.Hideable.visible} */
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
      const size = "6px";
      marker.style.color = "white";
      marker.style.height = size;
      marker.style.width = size;
      marker.style.borderRadius = "50%";
      marker.style.border = "2px solid rgb(122, 75, 209)";
      marker.style.zIndex = "-20";
    }

    this.three = new CSS2DObject(marker);

    const container = parent || world.scene.three;
    container.add(this.three);

    this.visible = true;
  }

  /**
   * Toggles the visibility of the marker.
   *
   * This method changes the `visible` property of the marker to its opposite value.
   * If the marker is currently visible, it will be hidden, and vice versa.
   */
  toggleVisibility() {
    this.visible = !this.visible;
  }

  /**
   * Never Display marker.
   *
   * This method changes the `visible` property of the marker to its false value.
   * Marker will never displayed.
   */
  notDisplay() {
    this.visible = false;
  }

  /** {@link OBC.Disposable.dispose} */
  dispose() {
    this.three.removeFromParent();
    this.three.element.remove();
    this.onDisposed.trigger();
    this.onDisposed.reset();
  }
}
