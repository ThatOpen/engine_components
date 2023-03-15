import * as THREE from "three";
import { Component, Components, Disposable, Hideable } from "../../types";
import { Disposer } from "../MemoryComponent";

/**
 * A basic
 * [Three.js grid helper](https://threejs.org/docs/#api/en/helpers/GridHelper).
 */
export class SimpleGrid
  extends Component<THREE.GridHelper>
  implements Hideable, Disposable
{
  /** {@link Component.name} */
  name = "SimpleGrid";

  /** {@link Component.enabled} */
  enabled = true;

  /** {@link Hideable.visible} */
  get visible() {
    return this._grid.visible;
  }

  /** {@link Hideable.visible} */
  set visible(visible: boolean) {
    this._grid.visible = visible;
  }

  private readonly _grid: THREE.GridHelper;
  private _disposer = new Disposer();

  constructor(components: Components) {
    super();
    this._grid = new THREE.GridHelper(50, 50);
    const scene = components.scene.get();
    scene.add(this._grid);
  }

  /** {@link Component.get} */
  get() {
    return this._grid;
  }

  /** {@link Disposable.dispose} */
  dispose() {
    this._disposer.dispose(this._grid);
  }
}
