import * as THREE from "three";
import { LineBasicMaterial } from "three";
import { ClipStyle } from "./types";
import { Component, Disposable, Event, Updateable } from "../../../base-types";
import { Components } from "../../../core";

export type LineStyles = {
  [name: string]: ClipStyle;
};

export class EdgesStyles
  extends Component<LineStyles>
  implements Disposable, Updateable
{
  name = "EdgesStyles";

  enabled = true;

  protected _styles: LineStyles = {};

  protected _defaultLineMaterial = new LineBasicMaterial({
    color: 0x000000,
    linewidth: 0.001,
  });

  constructor(components: Components) {
    super(components);
  }

  onAfterUpdate = new Event<LineStyles>();
  onBeforeUpdate = new Event<LineStyles>();

  get(): LineStyles {
    return this._styles;
  }

  async update(_delta: number) {
    await this.onBeforeUpdate.trigger(this._styles);
    await this.onAfterUpdate.trigger(this._styles);
  }

  // Creates a new style that applies to all clipping edges for generic models
  create(
    name: string,
    meshes: Set<THREE.Mesh>,
    lineMaterial = this._defaultLineMaterial,
    fillMaterial?: THREE.Material,
    outlineMaterial?: THREE.MeshBasicMaterial
  ) {
    for (const mesh of meshes) {
      if (!mesh.geometry.boundsTree) mesh.geometry.computeBoundsTree();
    }

    const renderer = this.components.renderer;
    lineMaterial.clippingPlanes = renderer.clippingPlanes;
    const newStyle = {
      name,
      lineMaterial,
      meshes,
      fillMaterial,
      outlineMaterial,
      fragments: {},
    } as ClipStyle;
    this._styles[name] = newStyle;
    return newStyle;
  }

  async dispose() {
    const styles = Object.keys(this._styles);
    for (const style of styles) {
      this.deleteStyle(style);
    }
    this._styles = {};
  }

  deleteStyle(id: string, disposeMaterials = true) {
    const style = this._styles[id];
    if (style) {
      style.meshes.clear();
      if (disposeMaterials) {
        style.lineMaterial.dispose();
        style.fillMaterial?.dispose();
        style.outlineMaterial?.dispose();
      }
    }
    delete this._styles[id];
  }
}
