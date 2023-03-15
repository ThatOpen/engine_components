import * as THREE from "three";
import { CSS2DRenderer } from "three/examples/jsm/renderers/CSS2DRenderer";
import { Event, Components, Disposable, Updateable, Resizeable, BaseRenderer } from "../../types";
/**
 * A basic renderer capable of rendering 3D and 2D objects
 * ([Objec3Ds](https://threejs.org/docs/#api/en/core/Object3D) and
 * [CSS2DObjects](https://threejs.org/docs/#examples/en/renderers/CSS2DRenderer)
 * respectively).
 */
export declare class SimpleRenderer extends BaseRenderer implements Disposable, Updateable, Resizeable {
    components: Components;
    container: HTMLElement;
    /** {@link Component.name} */
    name: string;
    /** {@link Component.enabled} */
    enabled: boolean;
    /** {@link Updateable.beforeUpdate} */
    beforeUpdate: Event<SimpleRenderer>;
    /** {@link Updateable.afterUpdate} */
    afterUpdate: Event<SimpleRenderer>;
    protected _renderer2D: CSS2DRenderer;
    protected _renderer: THREE.WebGLRenderer;
    constructor(components: Components, container: HTMLElement);
    /** {@link Component.get} */
    get(): THREE.WebGLRenderer;
    /** {@link Updateable.update} */
    update(_delta: number): void;
    /** {@link Disposable.dispose} */
    dispose(): void;
    /** {@link Resizeable.getSize}. */
    getSize(): THREE.Vector2;
    /** {@link Resizeable.resize}. */
    resize(): void;
    private setupRenderers;
    private setupEvents;
}
