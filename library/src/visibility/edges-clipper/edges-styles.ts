import * as THREE from "three";
import { LineMaterial } from "three/examples/jsm/lines/LineMaterial";
import { LineStyle } from "./types";
import { Component, Disposable, Event, Updateable } from "../../core";
import { Components } from "../../components";

export type LineStyles = {
  [name: string]: LineStyle;
};

export class EdgesStyles
  extends Component<LineStyles>
  implements Disposable, Updateable
{
  name = "EdgesStyles";

  enabled = true;

  protected _styles: LineStyles = {};

  protected _defaultMaterial = new LineMaterial({
    color: 0x000000,
    linewidth: 0.001,
  });

  constructor(public components: Components) {
    super();
  }

  afterUpdate = new Event<LineStyles>();
  beforeUpdate = new Event<LineStyles>();

  get(): LineStyles {
    return this._styles;
  }

  update(_delta: number): void {
    this.beforeUpdate.trigger(this._styles);
    this.afterUpdate.trigger(this._styles);
  }

  // Creates a new style that applies to all clipping edges for generic models
  async create(
    name: string,
    meshes: THREE.Mesh[],
    material = this._defaultMaterial
  ) {
    for (const mesh of meshes) {
      if (!mesh.geometry.boundsTree) mesh.geometry.computeBoundsTree();
    }

    const renderer = this.components.renderer.get();
    material.clippingPlanes = renderer.clippingPlanes;
    this._styles[name] = {
      name,
      material,
      meshes,
    };
  }

  dispose() {
    const styles = Object.values(this._styles);
    for (const style of styles) {
      style.meshes.length = 0;
      style.material.dispose();
    }
    this._styles = {};
  }
}
