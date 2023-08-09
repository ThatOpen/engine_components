import { Fragment, FragmentsGroup, Serializer } from "bim-fragment";
import * as THREE from "three";
import { Component, Disposable, Event, UI } from "../../base-types";
import { Components } from "../../core";
import { Button, FloatingWindow, SimpleUICard } from "../../ui";

/**
 * Object that can efficiently load binary files that contain
 * [fragment geometry](https://github.com/ifcjs/fragment).
 */
export class FragmentManager
  extends Component<Fragment[]>
  implements Disposable, UI
{
  /** {@link Component.name} */
  name = "FragmentManager";

  /** {@link Component.enabled} */
  enabled = true;

  /** All the created [fragments](https://github.com/ifcjs/fragment). */
  list: { [guid: string]: Fragment } = {};

  groups: FragmentsGroup[] = [];

  onFragmentsLoaded: Event<FragmentsGroup> = new Event();

  uiElement: {
    main: Button;
    window: FloatingWindow;
  };

  private _loader = new Serializer();
  private _components: Components;
  private _cards: SimpleUICard[] = [];

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

    const window = new FloatingWindow(components);
    window.title = "Models";
    window.domElement.style.left = "70px";
    window.domElement.style.top = "100px";
    window.domElement.style.width = "340px";
    window.domElement.style.height = "400px";

    components.ui.add(window);
    window.visible = false;

    const main = new Button(components);
    main.tooltip = "Models";
    main.materialIcon = "inbox";
    main.onclick = () => {
      window.visible = !window.visible;
    };

    this.uiElement = { main, window };

    this.onFragmentsLoaded.on(() => this.updateWindow());
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

  private updateWindow() {
    for (const card of this._cards) {
      card.dispose();
    }
    for (const group of this.groups) {
      const card = new SimpleUICard(this._components);
      card.title = group.ifcMetadata.name;
      card.description = group.ifcMetadata.description;
      this.uiElement.window.addChild(card);
      this._cards.push(card);
    }
  }

  private removeFragmentMesh(fragment: Fragment) {
    const meshes = this._components.meshes;
    const mesh = fragment.mesh;
    if (meshes.includes(mesh)) {
      meshes.splice(meshes.indexOf(mesh), 1);
    }
  }
}
