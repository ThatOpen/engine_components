import * as THREE from "three";
import { Disposable, Event } from "../../Types";

/**
 * A helper to easily get the real position of the mouse in the Three.js canvas to work with tools like the [raycaster](https://threejs.org/docs/#api/en/core/Raycaster), even if it has been transformed through CSS or doesn't occupy the whole screen.
 */
export class Mouse implements Disposable {
  private _event?: MouseEvent | TouchEvent;
  private _position = new THREE.Vector2();

  /** {@link Disposable.onDisposed} */
  readonly onDisposed = new Event();

  constructor(public dom: HTMLCanvasElement) {
    this.setupEvents(true);
  }

  /**
   * The real position of the mouse or touch of the Three.js canvas.
   */
  get position() {
    this.updatePosition(false);
    return this._position.clone();
  }

  /**
   * The raw position of the mouse or touch of the Three.js canvas.
   */
  get rawPosition() {
    this.updatePosition(true);
    return this._position.clone();
  }

  /** {@link Disposable.dispose} */
  dispose() {
    this.setupEvents(false);
    this.onDisposed.trigger();
    this.onDisposed.reset();
  }

  private updatePosition(raw: boolean) {
    if (this._event) {
      const bounds = this.dom.getBoundingClientRect();
      this._position.x = this.getPositionX(bounds, this._event, raw);
      this._position.y = this.getPositionY(bounds, this._event, raw);
    }
  }

  private getPositionY(
    bound: DOMRect,
    event: MouseEvent | TouchEvent,
    raw: boolean,
  ) {
    const data = this.getDataObject(event);
    if (raw) {
      return data.clientY;
    }
    return -((data.clientY - bound.top) / (bound.bottom - bound.top)) * 2 + 1;
  }

  private getPositionX(
    bound: DOMRect,
    event: MouseEvent | TouchEvent,
    raw: boolean,
  ) {
    const data = this.getDataObject(event);
    if (raw) {
      return data.clientX;
    }
    return ((data.clientX - bound.left) / (bound.right - bound.left)) * 2 - 1;
  }

  private updateMouseInfo = (event: MouseEvent | TouchEvent) => {
    this._event = event;
  };

  private getDataObject(event: MouseEvent | TouchEvent) {
    return event instanceof MouseEvent ? event : event.touches[0];
  }

  private setupEvents(active: boolean) {
    if (active) {
      this.dom.addEventListener("pointermove", this.updateMouseInfo);
      this.dom.addEventListener("touchstart", this.updateMouseInfo);
    } else {
      this.dom.removeEventListener("pointermove", this.updateMouseInfo);
      this.dom.removeEventListener("touchstart", this.updateMouseInfo);
    }
  }
}
