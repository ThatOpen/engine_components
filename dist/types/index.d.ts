/**
 * Simple event handler by
 * [Jason Kleban](https://gist.github.com/JasonKleban/50cee44960c225ac1993c922563aa540).
 * Keep in mind that:
 * - If you want to remove it later, you might want to declare the callback as
 * an object.
 * - If you want to maintain the reference to `this`, you will need to declare
 * the callback as an arrow function.
 */
export declare class Event<T> {
    /**
     * Add a callback to this event instance.
     * @param handler - the callback to be added to this event.
     */
    on(handler: T extends void ? {
        (): void;
    } : {
        (data: T): void;
    }): void;
    /**
     * Removes a callback from this event instance.
     * @param handler - the callback to be removed from this event.
     */
    off(handler: T extends void ? {
        (): void;
    } : {
        (data: T): void;
    }): void;
    /**
     * Triggers all the callbacks assigned to this event.
     */
    trigger: T extends void ? {
        (): void;
    } : {
        (data?: T): void;
    };
    /**
     * Gets rid of all the suscribed events.
     */
    reset(): void;
    private handlers;
}
/**
 * Whether this component has to be manually destroyed once you are done with
 * it to prevent
 * [memory leaks](https://threejs.org/docs/#manual/en/introduction/How-to-dispose-of-objects).
 * This also ensures that the DOM events created by that component will be
 * cleaned up.
 */
export interface Disposable {
    /**
     * Destroys the object from memory to prevent a
     * [memory leak](https://threejs.org/docs/#manual/en/introduction/How-to-dispose-of-objects).
     */
    dispose: () => void;
}
/**
 * Whether the geometric representation of this component can be
 * hidden or shown in the
 * [Three.js scene](https://threejs.org/docs/#api/en/scenes/Scene).
 */
export interface Hideable {
    /** Whether the geometric representation of this component is
     * currently visible or not in the
     [Three.js scene](https://threejs.org/docs/#api/en/scenes/Scene). */
    visible: boolean;
}
/**
 * Whether this component can be resized. The meaning of this can vary depending
 * on the component: resizing a
 * [Renderer](https://threejs.org/docs/#api/en/renderers/WebGLRenderer)
 * component could mean changing its resolution, whereas resizing a
 * [Mesh](https://threejs.org/docs/#api/en/objects/Mesh) would change its scale.
 */
export interface Resizeable {
    /** Sets size of this component (e.g. the resolution of a
     * [Renderer](https://threejs.org/docs/#api/en/renderers/WebGLRenderer)
     * component. */
    resize: (size?: THREE.Vector2) => void;
    /** Gets the current size of this component (e.g. the resolution of a
     * [Renderer](https://threejs.org/docs/#api/en/renderers/WebGLRenderer)
     * component. */
    getSize: () => THREE.Vector2;
}
/** Whether this component should be updated each frame. */
export interface Updateable {
    /** Actions that should be executed after updating the component. */
    afterUpdate: Event<any>;
    /** Actions that should be executed before updating the component. */
    beforeUpdate: Event<any>;
    /**
     * Function used to update the state of this component each frame. For
     * instance, a renderer component will make a render each frame.
     */
    update(delta?: number): void;
}
/** Whether this component is able to cast rays. */
export interface Raycaster {
    castRay: (items?: THREE.Mesh[]) => THREE.Intersection | null;
}
/** Basic type to describe the progress of any kind of process. */
export interface Progress {
    /** The amount of things that have been done already. */
    current: number;
    /** The total amount of things to be done by the process. */
    total: number;
}
/**
 * Whether this component can be resized. The meaning of this can vary depending
 * on the component: resizing a
 * [Renderer](https://threejs.org/docs/#api/en/renderers/WebGLRenderer)
 * component could mean changing its resolution, whereas resizing a
 * [Mesh](https://threejs.org/docs/#api/en/objects/Mesh) would change its scale.
 */
export interface Resizeable {
    /** Sets size of this component (e.g. the resolution of a
     * [Renderer](https://threejs.org/docs/#api/en/renderers/WebGLRenderer)
     * component. */
    resize: (size?: THREE.Vector2) => void;
    /** Gets the current size of this component (e.g. the resolution of a
     * [Renderer](https://threejs.org/docs/#api/en/renderers/WebGLRenderer)
     * component. */
    getSize: () => THREE.Vector2;
}
