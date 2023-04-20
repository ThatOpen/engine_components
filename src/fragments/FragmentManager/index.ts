import { Fragment, Serializer } from "bim-fragment";
import * as THREE from "three";
import { Component, Disposable, Event } from "../../base-types";
import { Components } from "../../core";

/**
 * Object that can efficiently load binary files that contain
 * [fragment geometry](https://github.com/ifcjs/fragment).
 */
export class FragmentManager
  extends Component<Fragment[]>
  implements Disposable
{
  /** {@link Component.name} */
  name = "FragmentsComponent";

  /** {@link Component.enabled} */
  enabled = true;

  /** All the created [fragments](https://github.com/ifcjs/fragment). */
  list: { [guid: string]: Fragment } = {};

  onFragmentsLoaded: Event<string[]> = new Event()

  private _loader = new Serializer();
  private _components: Components;

  /** The list of meshes of the created fragments. */
  get meshes() {
    const allMeshes: THREE.Mesh[] = [];
    for (const fragID in this.list) {
      allMeshes.push(this.list[fragID].mesh);
    }
    return allMeshes;
  }

  constructor(components: Components) {
    super();
    this._components = components;
  }

  /** {@link Component.get} */
  get(): Fragment[] {
    return Object.values(this.list);
  }

  /** {@link Component.get} */
  dispose() {
    for (const fragID in this.list) {
      const fragment = this.list[fragID];
      this.removeFragmentMesh(fragment);
      fragment.dispose(true);
    }
    this.list = {};
  }

  /**
   * Loads one or many fragments into the scene.
   * @param data - the bytes containing the data for the fragments to load.
   * @returns the list of IDs of the loaded fragments.
   */
  load(data: Uint8Array) {
    const fragments = this._loader.import(data);
    const scene = this._components.scene.get();
    const ids: string[] = [];
    for (const fragment of fragments) {
      this.list[fragment.id] = fragment;
      scene.add(fragment.mesh);
      ids.push(fragment.id);
      this._components.meshes.push(fragment.mesh);
    }
    this.onFragmentsLoaded.trigger(ids)
    return ids;
  }

  /**
   * Export the specified fragments.
   * @param ids - the IDs of the fragments to export. By default, it's all the
   * IDs of the existing fragments of {@link list}.
   * @returns the exported data as binary buffer.
   */
  export(ids = Object.keys(this.list)) {
    const fragments: Fragment[] = [];
    for (const id of ids) {
      const fragment = this.list[id];
      if (fragment) {
        fragments.push(fragment);
      }
    }
    return this._loader.export(fragments);
  }

  private removeFragmentMesh(fragment: Fragment) {
    const meshes = this._components.meshes;
    const mesh = fragment.mesh;
    if (meshes.includes(mesh)) {
      meshes.splice(meshes.indexOf(mesh), 1);
    }
  }
}
