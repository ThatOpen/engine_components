import { Fragment, FragmentsGroup, Serializer } from "bim-fragment";
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
  name = "FragmentManager";

  /** {@link Component.enabled} */
  enabled = true;

  /** All the created [fragments](https://github.com/ifcjs/fragment). */
  list: { [guid: string]: Fragment } = {};

  groups: FragmentsGroup[] = [];

  onFragmentsLoaded: Event<FragmentsGroup> = new Event();

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
    for (const group of this.groups) {
      group.dispose(true);
    }
    this.groups = [];

    for (const fragID in this.list) {
      const fragment = this.list[fragID];
      this.removeFragmentMesh(fragment);
      fragment.dispose(true);
    }
    this.list = {};
  }

  /** Disposes all existing fragments */
  reset() {
    for (const id in this.list) {
      const fragment = this.list[id];
      fragment.dispose();
    }
    this.list = {};
  }

  /**
   * Loads one or many fragments into the scene.
   * @param data - the bytes containing the data for the fragments to load.
   * @returns the list of IDs of the loaded fragments.
   */
  load(data: Uint8Array) {
    const group = this._loader.import(data);
    const scene = this._components.scene.get();
    const ids: string[] = [];
    scene.add(group);
    for (const fragment of group.items) {
      fragment.group = group;
      this.list[fragment.id] = fragment;
      ids.push(fragment.id);
      this._components.meshes.push(fragment.mesh);
    }
    this.groups.push(group);
    this.onFragmentsLoaded.trigger(group);
    return group;
  }

  /**
   * Export the specified fragments.
   * @param group - the fragments group to be exported.
   * @returns the exported data as binary buffer.
   */
  export(group: FragmentsGroup) {
    return this._loader.export(group);
  }

  private removeFragmentMesh(fragment: Fragment) {
    const meshes = this._components.meshes;
    const mesh = fragment.mesh;
    if (meshes.includes(mesh)) {
      meshes.splice(meshes.indexOf(mesh), 1);
    }
  }
}
