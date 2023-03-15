import * as THREE from "three";
import { Disposable } from "./base-types";
/**
 * A helper to easily get the real position of the mouse in the Three.js canvas
 * to work with tools like the
 * [raycaster](https://threejs.org/docs/#api/en/core/Raycaster), even if it has
 * been transformed through CSS or doesn't occupy the whole screen.
 */
export declare class Mouse implements Disposable {
    dom: HTMLCanvasElement;
    private _event?;
    private _position;
    constructor(dom: HTMLCanvasElement);
    /**
     * The real position of the mouse of the Three.js canvas.
     */
    get position(): THREE.Vector2;
    /** {@link Disposable.dispose} */
    dispose(): void;
    private getPositionY;
    private getPositionX;
    private setupMousePositionUpdate;
    private updateMouseInfo;
}
