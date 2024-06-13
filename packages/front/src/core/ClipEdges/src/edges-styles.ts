import * as THREE from "three";
import * as OBC from "@thatopen/components";
import { LineBasicMaterial } from "three";
import { ClipStyle } from "./types";

/**
 * A type representing a dictionary of {@link ClipStyle} objects, where the keys are the names of the styles.
 */
export type LineStyles = {
  [name: string]: ClipStyle;
};

/**
 * A class representing styles for clipping edges in a 3D scene.
 */
export class EdgesStyles implements OBC.Disposable, OBC.Updateable {
  /** {@link OBC.Disposable.onDisposed} */
  readonly onDisposed = new OBC.Event();

  /**
   * A boolean indicating whether the styles are enabled.
   * Default value is `true`.
   */
  enabled = true;

  /**
   * A dictionary of {@link ClipStyle} objects, where the keys are the names of the styles.
   * Default value is an empty object.
   */
  list: LineStyles = {};

  protected _defaultLineMaterial = new LineBasicMaterial({
    color: 0x000000,
    linewidth: 0.001,
  });

  /** {@link OBC.Updateable.onAfterUpdate} */
  onAfterUpdate = new OBC.Event<LineStyles>();

  /** {@link OBC.Updateable.onBeforeUpdate} */
  onBeforeUpdate = new OBC.Event<LineStyles>();

  /** {@link OBC.Updateable.update} */
  update(_delta: number) {
    this.onBeforeUpdate.trigger(this.list);
    this.onAfterUpdate.trigger(this.list);
  }

  // Creates a new style that applies to all clipping edges for generic models
  /**
   * Creates a new style that applies to all clipping edges for generic models.
   *
   * @param name - The name of the style.
   * @param meshes - A set of meshes to apply the style to.
   * @param world - The world where the meshes are located.
   * @param lineMaterial - The material for the lines of the style. If not provided, the default material is used.
   * @param fillMaterial - The material for the fill of the style.
   * @param outlineMaterial - The material for the outline of the style.
   *
   * @returns The newly created style.
   *
   * @throws Will throw an error if the given world doesn't have a renderer.
   */
  create(
    name: string,
    meshes: Set<THREE.Mesh>,
    world: OBC.World,
    lineMaterial?: LineBasicMaterial,
    fillMaterial?: THREE.Material,
    outlineMaterial?: THREE.MeshBasicMaterial,
  ) {
    if (!world.renderer) {
      throw new Error("The given world doesn't have a renderer!");
    }

    if (!lineMaterial) {
      lineMaterial = this._defaultLineMaterial;
    }

    for (const mesh of meshes) {
      // @ts-ignore
      if (!mesh.geometry.boundsTree) mesh.geometry.computeBoundsTree();
    }

    const renderer = world.renderer;
    lineMaterial.clippingPlanes = renderer.clippingPlanes;
    const newStyle = {
      name,
      lineMaterial,
      meshes,
      fillMaterial,
      outlineMaterial,
      fragments: {},
    } as ClipStyle;
    this.list[name] = newStyle;
    return newStyle;
  }

  /** {@link OBC.Disposable.dispose} */
  dispose() {
    const styles = Object.keys(this.list);
    for (const style of styles) {
      this.deleteStyle(style);
    }
    this.list = {};
    this.onDisposed.trigger();
    this.onDisposed.reset();
  }

  /**
   * Deletes a style from the list and optionally disposes of its materials.
   *
   * @param id - The id of the style to delete.
   * @param disposeMaterials - A boolean indicating whether to dispose of the materials associated with the style.
   *                           Default value is `true`.
   *
   * @throws Will throw an error if the style with the given id doesn't exist in the list.
   */
  deleteStyle(id: string, disposeMaterials = true) {
    const style = this.list[id];
    if (style) {
      style.meshes.clear();
      if (disposeMaterials) {
        style.lineMaterial.dispose();
        style.fillMaterial?.dispose();
        style.outlineMaterial?.dispose();
      }
    }
    delete this.list[id];
  }
}
