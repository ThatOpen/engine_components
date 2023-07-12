import * as THREE from "three";
import { Fragment } from "bim-fragment";
import { FragmentMesh } from "bim-fragment/fragment-mesh";
import { Component, Disposable, FragmentIdMap } from "../../base-types";
import { FragmentManager } from "../index";
import { Components } from "../../core";
import { PostproductionRenderer } from "../../navigation";

// TODO: Clean up and document
// TODO: Deduplicate logic with highlighter

export class FragmentOutliner
  extends Component<FragmentIdMap>
  implements Disposable
{
  name: string = "FragmentHighlighter";
  private _enabled = true;

  private _selection: FragmentIdMap = {};
  private _components: Components;
  private _fragments: FragmentManager;
  private _renderer: PostproductionRenderer;

  private _outlinedMeshes: { [fragID: string]: THREE.InstancedMesh } = {};

  private _tempMatrix = new THREE.Matrix4();

  private _selectOverrideMaterial = new THREE.MeshBasicMaterial({
    color: "white",
    depthTest: false,
    transparent: true,
  });

  get enabled() {
    return this._enabled;
  }

  set enabled(state: boolean) {
    this._enabled = state;
    this._renderer.postproduction.customEffects.outlineEnabled = state;
  }

  constructor(
    components: Components,
    fragments: FragmentManager,
    renderer: PostproductionRenderer
  ) {
    super();
    this._components = components;
    this._fragments = fragments;
    this._renderer = renderer;
    this.enabled = true;
  }

  get(): FragmentIdMap {
    return this._selection;
  }

  dispose() {
    this._selectOverrideMaterial.dispose();
    this._selection = {};
    for (const id in this._outlinedMeshes) {
      const mesh = this._outlinedMeshes[id];
      mesh.geometry.dispose();
    }
    (this._fragments as any) = null;
    (this._components as any) = null;
    (this._renderer as any) = null;
  }

  outline(removePrevious = true) {
    if (!this.enabled) return null;

    const fragments: Fragment[] = [];
    const meshes = this._fragments.meshes;
    const result = this._components.raycaster.castRay(meshes);

    if (!result) {
      this.clear();
      return null;
    }

    const mesh = result.object as FragmentMesh;
    const geometry = mesh.geometry;
    const index = result.face?.a;
    const instanceID = result.instanceId;
    if (!geometry || index === undefined || instanceID === undefined) {
      this.clear();
      return null;
    }

    if (removePrevious) {
      this._selection = {};
      this.clear();
    }

    if (!this._selection[mesh.uuid]) {
      this._selection[mesh.uuid] = new Set<string>();
    }

    fragments.push(mesh.fragment);
    const blockID = mesh.fragment.getVertexBlockID(geometry, index);
    const itemID = mesh.fragment.getItemID(instanceID, blockID);
    this._selection[mesh.uuid].add(itemID);

    this.updateFragmentHighlight(mesh.uuid);

    const group = mesh.fragment.group;
    if (group) {
      const idNum = parseInt(itemID, 10);
      const keys = group.data[idNum][0];
      for (let i = 0; i < keys.length; i++) {
        const fragKey = keys[i];
        const fragID = group.keyFragments[fragKey];
        fragments.push(this._fragments.list[fragID]);
        if (!this._selection[fragID]) {
          this._selection[fragID] = new Set<string>();
        }
        this._selection[fragID].add(itemID);
        this.updateFragmentHighlight(fragID);
      }
    }

    return { id: itemID, fragments };
  }

  // highlightByID(
  //   name: string,
  //   ids: { [fragmentID: string]: Set<string> | string[] },
  //   removePrevious = true
  // ) {
  //   if (!this.enabled) return;
  //   if (removePrevious) {
  //     this.clear(name);
  //   }
  //   const styles = this.selection[name];
  //   for (const fragID in ids) {
  //     if (!styles[fragID]) {
  //       styles[fragID] = new Set<string>();
  //     }
  //     for (const id of ids[fragID]) {
  //       styles[fragID].add(id);
  //     }
  //     this.updateFragmentHighlight(name, fragID);
  //   }
  // }

  clear() {
    this._selection = {};
    this._renderer.postproduction.customEffects.outlinedMeshes = [];
  }

  private updateFragmentHighlight(fragmentID: string) {
    const ids = this._selection[fragmentID];
    const fragment = this._fragments.list[fragmentID];
    if (!fragment) return;

    const geometry = fragment.mesh.geometry;

    // Create a copy of the original fragment mesh for outline
    if (!this._outlinedMeshes[fragmentID]) {
      const newMesh = new THREE.InstancedMesh(
        geometry.clone(),
        [this._selectOverrideMaterial],
        fragment.capacity
      );
      newMesh.frustumCulled = false;
      newMesh.renderOrder = 999;
      this._outlinedMeshes[fragmentID] = newMesh;
    }

    const outline = this._outlinedMeshes[fragmentID];
    const customEffects = this._renderer.postproduction.customEffects;
    customEffects.outlinedMeshes.push({ outline, fragment: fragment.mesh });

    const isBlockFragment = fragment.blocks.count > 1;

    if (isBlockFragment) {
      const groups: typeof outline.geometry.groups = [];
      for (const id of ids) {
        const { blockID } = fragment.getInstanceAndBlockID(id);
        // @ts-ignore
        const value = fragment.blocks.blocksMap.indices.map.get(blockID);
        if (value) {
          const [start, blockEnd] = value[0];
          const end = blockEnd + 1;
          const count = end - start;
          groups.push({ start, count, materialIndex: 0 });
        }
      }
      outline.geometry.groups = groups;
    } else {
      let counter = 0;
      for (const id of ids) {
        const { instanceID } = fragment.getInstanceAndBlockID(id);
        fragment.mesh.getMatrixAt(instanceID, this._tempMatrix);
        outline.setMatrixAt(counter++, this._tempMatrix);
      }
      outline.count = counter;
      outline.instanceMatrix.needsUpdate = true;
    }
  }
}
