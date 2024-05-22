import * as THREE from "three";
import * as OBC from "@thatopen/components";
import { LineBasicMaterial } from "three";
import { ClipStyle } from "./types";

export type LineStyles = {
  [name: string]: ClipStyle;
};

export class EdgesStyles implements OBC.Disposable, OBC.Updateable {
  readonly onDisposed = new OBC.Event();

  enabled = true;

  list: LineStyles = {};

  protected _defaultLineMaterial = new LineBasicMaterial({
    color: 0x000000,
    linewidth: 0.001,
  });

  onAfterUpdate = new OBC.Event<LineStyles>();
  onBeforeUpdate = new OBC.Event<LineStyles>();

  update(_delta: number) {
    this.onBeforeUpdate.trigger(this.list);
    this.onAfterUpdate.trigger(this.list);
  }

  // Creates a new style that applies to all clipping edges for generic models
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

  dispose() {
    const styles = Object.keys(this.list);
    for (const style of styles) {
      this.deleteStyle(style);
    }
    this.list = {};
    this.onDisposed.trigger();
    this.onDisposed.reset();
  }

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
