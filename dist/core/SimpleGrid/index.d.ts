import * as THREE from "three";
import { Component, Components, Disposable, Hideable } from "../../types";
/**
 * A basic
 * [Three.js grid helper](https://threejs.org/docs/#api/en/helpers/GridHelper).
 */
export declare class SimpleGrid extends Component<THREE.GridHelper> implements Hideable, Disposable {
    /** {@link Component.name} */
    name: string;
    /** {@link Component.enabled} */
    enabled: boolean;
    /** {@link Hideable.visible} */
    get visible(): boolean;
    /** {@link Hideable.visible} */
    set visible(visible: boolean);
    private readonly _grid;
    private _disposer;
    constructor(components: Components);
    /** {@link Component.get} */
    get(): THREE.GridHelper;
    /** {@link Disposable.dispose} */
    dispose(): void;
}
