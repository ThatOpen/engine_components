import * as THREE from "three";
import { Component } from "../core";

/**
 * Minimal camera that can be used to create a BIM + GIS scene
 * with [Mapbox](https://www.mapbox.com/).
 * [See example](https://ifcjs.github.io/components/examples/mapbox.html).
 */
export class MapboxCamera extends Component<THREE.Camera> {
  /** {@link Component.enabled} */
  enabled = true;

  /** {@link Component.name} */
  name = "MapboxCamera";

  private _camera = new THREE.Camera();

  /** {@link Component.get} */
  get(): THREE.Camera {
    return this._camera;
  }
}
