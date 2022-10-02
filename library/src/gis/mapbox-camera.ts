import * as THREE from "three";
import { Camera } from "three";
import { Component } from "../core";

/**
 * Minimal camera that can be used to create a BIM + GIS scene
 * with [Mapbox](https://www.mapbox.com/).
 */
export class MapboxCamera extends Component<Camera> {
  /** {@link Component.name} */
  name = "MapboxCamera";

  /** {@link Component.enabled} */
  enabled = true;

  private _camera = new THREE.Camera();

  /** {@link Component.get} */
  get() {
    return this._camera;
  }
}
