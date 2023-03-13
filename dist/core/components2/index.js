import * as THREE from "three";
import { acceleratedRaycast, computeBoundsTree, disposeBoundsTree, } from "three-mesh-bvh";
/**
 * The entry point of Open BIM Components.
 * It contains the basic items to create a BIM 3D scene based on Three.js, as
 * well as all the tools provided by this library. It also manages the update
 * loop of everything. Each instance has to be initialized with {@link init}.
 *
 * @example
 *
 * ```ts
 * import * as OBC from 'openbim-components';
 *
 * const components = new OBC.Components();
 *
 * // The container is an HTML `<div>` element
 * const container = document.getElementById('container');
 *
 * // Initialize basic components necessary for initializing `Components`
 * components.scene = new OBC.SimpleScene(components);
 * components.renderer = new OBC.SimpleRenderer(components, container);
 * components.camera = new OBC.SimpleCamera(components);
 *
 * // Initialize `Components`, which starts the update loop
 * components.init();
 * ```
 */
export class Components {
    constructor() {
        console.log(THREE);
        console.log(acceleratedRaycast);
        console.log(computeBoundsTree);
        console.log(disposeBoundsTree);
    }
}
//# sourceMappingURL=index.js.map