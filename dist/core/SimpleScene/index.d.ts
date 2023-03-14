import * as THREE from "three";
import { Components } from "../../types/components";
import { Component } from "../../types/component";
import { Disposable } from "../../types";
/**
 * A basic 3D [scene](https://threejs.org/docs/#api/en/scenes/Scene) to add
 * objects hierarchically.
 */
export declare class SimpleScene extends Component<THREE.Scene> implements Disposable {
    /** {@link Component.enabled} */
    enabled: boolean;
    /** {@link Component.name} */
    name: string;
    private readonly _scene;
    private readonly _disposer;
    constructor(_components: Components);
    /** {@link Component.get} */
    get(): THREE.Scene;
    /** {@link Disposable.dispose} */
    dispose(): void;
}
