import * as THREE from "three";
import { Component, Components, Raycaster } from "../../types";
/**
 * A simple [raycaster](https://threejs.org/docs/#api/en/core/Raycaster)
 * that allows to easily get items from the scene using the mouse and touch
 * events.
 */
export declare class SimpleRaycaster extends Component<THREE.Raycaster> implements Raycaster {
    private components;
    /** {@link Component.name} */
    name: string;
    /** {@link Component.enabled} */
    enabled: boolean;
    private readonly _raycaster;
    private readonly _mouse;
    constructor(components: Components);
    /** {@link Component.get} */
    get(): THREE.Raycaster;
    /**
     * Throws a ray from the camera to the mouse or touch event point and returns
     * the first item found. This also takes into account the clipping planes
     * used by the renderer.
     *
     * @param items - the [meshes](https://threejs.org/docs/#api/en/objects/Mesh)
     * to query. If not provided, it will query all the meshes stored in
     * {@link Components.meshes}.
     */
    castRay(items?: THREE.Mesh[]): THREE.Intersection | null;
    private filterClippingPlanes;
}
