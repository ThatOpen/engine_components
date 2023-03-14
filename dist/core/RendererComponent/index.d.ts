import * as THREE from "three";
import { Component } from "../../types/component";
import { Resizeable } from "../../types";
/**
 * A base component for components whose main mission is to render a scene.
 */
export declare abstract class RendererComponent extends Component<THREE.WebGLRenderer> implements Resizeable {
    /** {@link Component.name} */
    abstract name: string;
    /** {@link Component.enabled} */
    abstract enabled: boolean;
    /** {@link Component.get} */
    abstract get(): THREE.WebGLRenderer;
    /** {@link Resizeable.getSize}. */
    abstract getSize(): THREE.Vector2;
    /** {@link Resizeable.resize}. */
    abstract resize(): void;
    clippingPlanes: THREE.Plane[];
    /**
     * Adds or removes a
     * [clipping plane](https://threejs.org/docs/#api/en/renderers/WebGLRenderer.clippingPlanes)
     * to the renderer.
     */
    togglePlane(active: boolean, plane: THREE.Plane, isLocal?: boolean): void;
}
