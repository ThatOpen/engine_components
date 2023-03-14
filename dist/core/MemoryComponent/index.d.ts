import { Item3D } from "../GeometricComponent";
/**
 * A class to safely remove meshes and geometries from memory to
 * [prevent memory leaks](https://threejs.org/docs/#manual/en/introduction/How-to-dispose-of-objects).
 */
export declare class Disposer {
    /**
     * Removes a mesh, its geometry and its materials from memory. If you are
     * using any of these in other parts of the application, make sure that you
     * remove them from the mesh before disposing it.
     *
     * @param mesh - the [mesh](https://threejs.org/docs/#api/en/objects/Mesh)
     * to remove.
     *
     * @param materials - whether to dispose the materials of the mesh.
     *
     * @param recursive - whether to recursively dispose the children of the mesh.
     */
    dispose(mesh: Item3D, materials?: boolean, recursive?: boolean): void;
    /**
     * Disposes a geometry from memory.
     *
     * @param geometry - the
     * [geometry](https://threejs.org/docs/#api/en/core/BufferGeometry)
     * to remove.
     */
    disposeGeometry(geometry: THREE.BufferGeometry): void;
    private disposeGeometryAndMaterials;
    private disposeChildren;
    private static disposeMaterial;
}
