import { Component } from "./component";
/**
 * A base component for components whose main mission is to render a scene.
 */
export class BaseRenderer extends Component {
    constructor() {
        super(...arguments);
        this.clippingPlanes = [];
    }
    /**
     * Adds or removes a
     * [clipping plane](https://threejs.org/docs/#api/en/renderers/WebGLRenderer.clippingPlanes)
     * to the renderer.
     */
    togglePlane(active, plane, isLocal) {
        plane.isLocal = isLocal;
        const index = this.clippingPlanes.indexOf(plane);
        if (active && index === -1) {
            this.clippingPlanes.push(plane);
        }
        else if (!active && index > -1) {
            this.clippingPlanes.splice(index, 1);
        }
        const renderer = this.get();
        renderer.clippingPlanes = this.clippingPlanes.filter((plane) => !plane.isLocal);
    }
}
//# sourceMappingURL=base-renderer.js.map