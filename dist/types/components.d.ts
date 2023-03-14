import * as THREE from "three";
import { Raycaster } from './index';
import { Component } from './component';
import { ToolComponents } from '../core/ToolsComponents';
import { RendererComponent } from '../core/RendererComponent';
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
export declare class Components {
    /**
     * {@link ToolComponents}
     */
    readonly tools: ToolComponents;
    /**
     * All the loaded [meshes](https://threejs.org/docs/#api/en/objects/Mesh).
     * This includes IFC models, fragments, 3D scans, etc.
     */
    readonly meshes: THREE.Mesh[];
    private _renderer?;
    private _scene?;
    private _camera?;
    private _raycaster?;
    private _clock;
    private _enabled;
    /**
     * The [Three.js renderer](https://threejs.org/docs/#api/en/renderers/WebGLRenderer)
     * used to render the scene. This library provides multiple renderer
     * components with pre-made functionality (e.g. rendering of 2D CSS elements.
     */
    get renderer(): RendererComponent;
    /**
     * This needs to be initialize before calling {@link init}.
     *
     * @example
     *
     * ```ts
     * import * as OBC from 'openbim-components';
     *
     * components.renderer = new OBC.SimpleRenderer(components, container);
     * ```
     */
    set renderer(renderer: RendererComponent);
    /**
     * The [Three.js scene](https://threejs.org/docs/#api/en/scenes/Scene)
     * where all the rendered items are placed.
     */
    get scene(): Component<THREE.Scene>;
    /**
     * This needs to be initialize before calling {@link init}.
     *
     * @example
     *
     * ```ts
     * import * as OBC from 'openbim-components';
     *
     * components.scene = new OBC.SimpleScene(components);
     * ```
     */
    set scene(scene: Component<THREE.Scene>);
    /**
     * The [Three.js camera](https://threejs.org/docs/#api/en/cameras/Camera)
     * that determines the point of view of the renderer.
     * ```
     */
    get camera(): Component<THREE.Camera>;
    /**
     * This needs to be initialize before calling {@link init}.
     *
     * @example
     *
     * ```ts
     * import * as OBC from 'openbim-components';
     *
     * components.scene = new OBC.SimpleCamera(components);
     * ```
     */
    set camera(camera: Component<THREE.Camera>);
    /**
     * A component using the [Three.js raycaster](https://threejs.org/docs/#api/en/core/Raycaster)
     * used primarily to pick 3D items with the mouse or a touch screen.
     */
    get raycaster(): Raycaster;
    /**
     * Although this is not necessary to make the library work, it's necessary
     * to initialize this if any component that needs a raycaster is used.
     *
     * ```ts
     * import * as OBC from 'openbim-components';
     *
     * components.raycaster = new COMPONENTS.SimpleRaycaster(components);
     * ```
     */
    set raycaster(raycaster: Raycaster);
    constructor();
    /**
     * Initializes the library. It should be called at the start of the app after
     * initializing the {@link scene}, the {@link renderer} and the
     * {@link camera}. Additionally, if any component that need a raycaster is
     * used, the {@link raycaster} will need to be initialized.
     */
    init(): void;
    /**
     * Disposes the memory of all the components and tools of this instance of
     * the library. A memory leak will be created if:
     *
     * - An instance of the library ends up out of scope and this function isn't
     * called. This is especially relevant in Single Page Applications (React,
     * Angular, Vue, etc).
     *
     * - Any of the objects of this instance (meshes, geometries, etc) is
     * referenced by a reference type (object or array). <br>
     *
     * You can learn more about how Three.js handles memory leaks
     * [here](https://threejs.org/docs/#manual/en/introduction/How-to-dispose-of-objects).
     *
     * @example
     *
     * ```ts
     * const components = new Components();
     *
     * // External array used to store a reference to the BIM models that we load
     * const storedModels = [];
     *
     * // The app executes and the user does many things. At some point:
     * storedModels.push(bimModel);
     *
     * // Now we want to get rid of this instance of the library:
     * // If this array is not emptied, we will create a memory leak:
     * storedModels = [];
     *
     * components.dispose();
     * ```
     */
    dispose(): void;
    private update;
    private static update;
    private static setupBVH;
}
