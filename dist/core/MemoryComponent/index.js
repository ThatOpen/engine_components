/**
 * A class to safely remove meshes and geometries from memory to
 * [prevent memory leaks](https://threejs.org/docs/#manual/en/introduction/How-to-dispose-of-objects).
 */
export class Disposer {
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
    dispose(mesh, materials = true, recursive = true) {
        mesh.removeFromParent();
        this.disposeGeometryAndMaterials(mesh, materials);
        if (recursive && mesh.children.length) {
            this.disposeChildren(mesh);
        }
        mesh.material = [];
        mesh.children.length = 0;
    }
    /**
     * Disposes a geometry from memory.
     *
     * @param geometry - the
     * [geometry](https://threejs.org/docs/#api/en/core/BufferGeometry)
     * to remove.
     */
    disposeGeometry(geometry) {
        if (geometry.boundsTree) {
            geometry.disposeBoundsTree();
        }
        geometry.dispose();
    }
    disposeGeometryAndMaterials(mesh, materials) {
        if (mesh.geometry) {
            this.disposeGeometry(mesh.geometry);
        }
        if (materials) {
            Disposer.disposeMaterial(mesh);
        }
    }
    disposeChildren(mesh) {
        for (const child of mesh.children) {
            this.dispose(child);
        }
    }
    static disposeMaterial(mesh) {
        if (mesh.material) {
            if (Array.isArray(mesh.material)) {
                for (const mat of mesh.material) {
                    mat.dispose();
                }
            }
            else {
                mesh.material.dispose();
            }
        }
    }
}
//# sourceMappingURL=index.js.map