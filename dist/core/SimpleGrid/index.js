import * as THREE from "three";
import { Component } from "../../types";
import { Disposer } from "../MemoryComponent";
/**
 * A basic
 * [Three.js grid helper](https://threejs.org/docs/#api/en/helpers/GridHelper).
 */
export class SimpleGrid extends Component {
    constructor(components) {
        super();
        /** {@link Component.name} */
        this.name = "SimpleGrid";
        /** {@link Component.enabled} */
        this.enabled = true;
        this._disposer = new Disposer();
        this._grid = new THREE.GridHelper(50, 50);
        const scene = components.scene.get();
        scene.add(this._grid);
    }
    /** {@link Hideable.visible} */
    get visible() {
        return this._grid.visible;
    }
    /** {@link Hideable.visible} */
    set visible(visible) {
        this._grid.visible = visible;
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
//# sourceMappingURL=index.js.map