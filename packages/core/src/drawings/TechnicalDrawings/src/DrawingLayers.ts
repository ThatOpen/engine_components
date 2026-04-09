import * as THREE from "three";
import * as FRAGS from "@thatopen/fragments";
import { DrawingLayer } from "./types";

/** Manages the named layers of a {@link TechnicalDrawing}. */
export class DrawingLayers extends FRAGS.DataMap<string, DrawingLayer> {
  private readonly _container: THREE.Group;

  /**
   * Accessible via `drawing.layers`. Each layer owns a `THREE.LineBasicMaterial`
   * that is shared across all projection `LineSegments` assigned to it —
   * mutating the material (e.g. via {@link setColor}) is reflected on every line
   * immediately without any scene traversal. Annotation systems always use their
   * own style material and are not affected by layer materials.
   *
   * Extends `DataMap<string, DrawingLayer>` so consumers get reactive events
   * (`onItemSet`, `onItemDeleted`, …) directly on `drawing.layers`.
   *
   * Layer `"0"` always exists and cannot be removed.
   *
   * ```ts
   * drawing.layers.create("walls", { material: new THREE.LineBasicMaterial({ color: 0x333333 }) });
   * drawing.layers.setColor("walls", 0x888888);
   * drawing.layers.setVisibility("walls", false);
   * ```
   */
  constructor(container: THREE.Group) {
    super();
    this._container = container;
    // Layer "0" is the default and cannot be deleted.
    this.deleteGuard = (key) => key !== "0";
    this.set("0", {
      name: "0",
      visible: true,
      material: new THREE.LineBasicMaterial({ color: 0x000000 }),
    });
  }

  /**
   * Creates a new layer. If a layer with the same name already exists, returns
   * the existing one without modifying it.
   *
   * @param name    - Unique layer name.
   * @param options - Optional material and visibility. If no material is given,
   *   a default black `LineBasicMaterial` is created. Visibility defaults to `true`.
   * @returns The (possibly pre-existing) layer object.
   */
  create(
    name: string,
    options?: { material?: THREE.LineBasicMaterial; visible?: boolean },
  ): DrawingLayer {
    if (!this.has(name)) {
      const layer: DrawingLayer = {
        name,
        visible: options?.visible ?? true,
        material:
          options?.material ??
          new THREE.LineBasicMaterial({ color: 0x000000 }),
      };
      this.set(name, layer);
    }
    return this.get(name)!;
  }

  /**
   * Updates the color of a layer's material and fires reactive events.
   *
   * Because all `LineSegments` on the same layer share the same material
   * instance, the change is reflected immediately on all of them — no scene
   * traversal is required.
   *
   * Does nothing if the layer does not exist.
   *
   * @param name  - Layer name.
   * @param color - Hex color (e.g. `0xff0000`).
   */
  setColor(name: string, color: number): void {
    const layer = this.get(name);
    if (!layer) return;
    layer.material.color.setHex(color);
    // Fire DataMap lifecycle events so reactive UIs update.
    this.set(name, layer);
  }

  /**
   * Replaces the material of a layer and updates all `LineSegments` currently
   * assigned to it. The previous material is disposed.
   *
   * Does nothing if the layer does not exist.
   *
   * @param name     - Layer name.
   * @param material - New material to assign.
   */
  setMaterial(name: string, material: THREE.LineBasicMaterial): void {
    const layer = this.get(name);
    if (!layer) return;
    const previous = layer.material;
    layer.material = material;
    this._container.traverse((child) => {
      if (child.userData.layer !== name) return;
      if (child.userData.isDimension) return;
      if ((child as THREE.LineSegments).isLineSegments) {
        (child as THREE.LineSegments).material = material;
      }
    });
    previous.dispose();
    this.set(name, layer);
  }

  /**
   * Shows or hides all objects assigned to the given layer.
   *
   * Does nothing if the layer does not exist.
   *
   * @param name    - Layer name.
   * @param visible - `true` to show, `false` to hide.
   */
  setVisibility(name: string, visible: boolean): void {
    const layer = this.get(name);
    if (!layer) return;
    layer.visible = visible;
    this._container.traverse((child) => {
      if (child.userData.layer === name) child.visible = visible;
    });
    this.set(name, layer);
  }

  /**
   * Assigns an object to a named layer, applies the layer's material (if the
   * object is a `LineSegments`), and immediately reflects the layer's current
   * visibility state.
   *
   * Use this instead of setting `object.userData.layer` directly so that
   * the material and visibility are always in sync at insertion time.
   *
   * Does nothing if the layer does not exist.
   *
   * @param object - The Three.js object to assign.
   * @param name   - Layer name.
   */
  assign(object: THREE.Object3D, name: string): void {
    const layer = this.get(name);
    if (!layer) return;
    object.userData.layer = name;
    if (!layer.visible) object.visible = false;
    if ((object as THREE.LineSegments).isLineSegments) {
      (object as THREE.LineSegments).material = layer.material;
    }
  }

  /** @internal Used by {@link DxfExporter} to read the layer color for DXF output. */
  resolveColor(name: string): number | undefined {
    const layer = this.get(name);
    if (!layer) return undefined;
    return layer.material.color.getHex();
  }
}
