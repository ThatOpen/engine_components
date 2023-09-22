import * as THREE from "three";
import { Component } from "../../base-types/component";
import { Components } from "../../core/Components";
import { Simple2DMarker } from "../../core/Simple2DMarker";
import { Disposable, Hideable } from "../../base-types/base-types";

export class GeometryVerticesMarker
  extends Component<Simple2DMarker[]>
  implements Disposable, Hideable
{
  name: string = "GeometryVerticesMarker";
  enabled: boolean = true;

  private _markers: Simple2DMarker[] = [];
  private _visible = true;

  set visible(value: boolean) {
    this._visible = value;
    for (const marker of this._markers) marker.visible = value;
  }

  get visible() {
    return this._visible;
  }

  constructor(components: Components, geometry: THREE.BufferGeometry) {
    super(components);
    const position = geometry.getAttribute("position");
    for (let index = 0; index < position.count; index++) {
      const marker = new Simple2DMarker(components);
      marker
        .get()
        .position.set(
          position.getX(index),
          position.getY(index),
          position.getZ(index)
        );
      this._markers.push(marker);
    }
  }

  async dispose() {
    for (const marker of this._markers) {
      await marker.dispose();
    }
    this._markers = [];
  }

  get(): Simple2DMarker[] {
    return this._markers;
  }
}
