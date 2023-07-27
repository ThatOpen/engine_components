import * as THREE from "three";
import { Fragment } from "bim-fragment";
import { FragmentMesh } from "bim-fragment/fragment-mesh";
import { Component, Disposable, FragmentIdMap } from "../../base-types";
import { FragmentManager } from "../index";
import { Components } from "../../core";
import { PostproductionRenderer } from "../../navigation";
import { toCompositeID } from "../../utils";

// TODO: Clean up and document
// TODO: Deduplicate logic with highlighter

export class FragmentOutliner
  extends Component<FragmentIdMap>
  implements Disposable
{
  name: string = "FragmentOutliner";
  private _enabled = true;

  private _invisibleMaterial = new THREE.MeshBasicMaterial({ visible: false });

  private _selection: FragmentIdMap = {};
  private _components: Components;
  private _fragments: FragmentManager;
  private _renderer: PostproductionRenderer;

  private _outlinedMeshes: { [fragID: string]: THREE.InstancedMesh } = {};

  outlineMaterial = new THREE.MeshBasicMaterial({
    color: "white",
    transparent: true,
    depthTest: false,
    depthWrite: false,
  });

  private _tempMatrix = new THREE.Matrix4();

  get enabled() {
    return this._enabled;
  }

  set enabled(state: boolean) {
    this._enabled = state;
    delete this._renderer.postproduction.customEffects.outlinedMeshes.fragments;
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

  get() {
    return this._selection;
  }

  dispose() {
    this._selection = {};
    for (const id in this._outlinedMeshes) {
      const mesh = this._outlinedMeshes[id];
      mesh.geometry.dispose();
    }
    this._invisibleMaterial.dispose();
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

    this.updateOutline(mesh.uuid);

    const group = mesh.fragment.group;
    if (group) {
      const keys = group.data[idNum][0];
      for (let i = 0; i < keys.length; i++) {
        const fragKey = keys[i];
        const fragID = group.keyFragments[fragKey];
        const fragment = this._fragments.list[fragID];
        fragments.push(this._fragments.list[fragID]);
        if (!this._selection[fragID]) {
          this._selection[fragID] = new Set<string>();
        }
        this._selection[fragID].add(itemID);
        this.updateOutline(fragID);
      }
    }

    return { id: trueID, fragments };
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
    const customEffects = this._renderer.postproduction.customEffects;
    const fragmentsOutline = customEffects.outlinedMeshes.fragments;
    if (fragmentsOutline) {
      fragmentsOutline.meshes.clear();
    }
    for (const fragID in this._outlinedMeshes) {
      const fragment = this._fragments.list[fragID];
      const isBlockFragment = fragment.blocks.count > 1;
      const mesh = this._outlinedMeshes[fragID];
      if (isBlockFragment) {
        mesh.geometry.setIndex([]);
      } else {
        mesh.count = 0;
      }
    }
  }

  private updateOutline(fragmentID: string) {
    if (!this._selection[fragmentID]) {
      return;
    }

    const ids = this._selection[fragmentID];
    const fragment = this._fragments.list[fragmentID];
    if (!fragment) return;

    const geometry = fragment.mesh.geometry;
    const customEffects = this._renderer.postproduction.customEffects;

    if (!customEffects.outlinedMeshes.fragments) {
      customEffects.outlinedMeshes.fragments = {
        meshes: new Set(),
        material: this.outlineMaterial,
      };
    }

    const outlineEffect = customEffects.outlinedMeshes.fragments;

    // Create a copy of the original fragment mesh for outline
    if (!this._outlinedMeshes[fragmentID]) {
      const newGeometry = new THREE.BufferGeometry();

      newGeometry.attributes = geometry.attributes;
      const newMesh = new THREE.InstancedMesh(
        newGeometry,
        this._invisibleMaterial,
        fragment.capacity
      );
      newMesh.frustumCulled = false;
      newMesh.renderOrder = 999;
      this._outlinedMeshes[fragmentID] = newMesh;

      const scene = this._components.scene.get();
      scene.add(newMesh);
    }

    const outlineMesh = this._outlinedMeshes[fragmentID];
    outlineEffect.meshes.add(outlineMesh);

    const isBlockFragment = fragment.blocks.count > 1;

    if (isBlockFragment) {
      const indices = fragment.mesh.geometry.index.array;
      const newIndex: number[] = [];
      const idsSet = new Set(ids);
      for (let i = 0; i < indices.length - 2; i += 3) {
        const index = indices[i];
        const blockID = fragment.mesh.geometry.attributes.blockID.array;
        const block = blockID[index];
        const itemID = fragment.mesh.fragment.getItemID(0, block);
        if (idsSet.has(itemID)) {
          newIndex.push(indices[i], indices[i + 1], indices[i + 2]);
        }
      }

      outlineMesh.geometry.setIndex(newIndex);
    } else {
      let counter = 0;
      for (const id of ids) {
        const { instanceID } = fragment.getInstanceAndBlockID(id);
        fragment.mesh.getMatrixAt(instanceID, this._tempMatrix);
        outlineMesh.setMatrixAt(counter++, this._tempMatrix);
      }
      outlineMesh.count = counter;
      outlineMesh.instanceMatrix.needsUpdate = true;
    }
  }
}
