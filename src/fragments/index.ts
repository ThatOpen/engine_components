import { FragmentLoader } from "bim-fragment/fragment-loader";
import { Fragment, Serializer } from "bim-fragment";
import * as THREE from "three";
import { Component, Disposable } from "../base-types";
import { FragmentMaterials } from "./fragment-materials";
import { FragmentHighlighter } from "./fragment-highlighter";
import { IfcFragmentLoader } from "./fragment-ifc-importer";
import { FragmentProperties } from "./fragment-properties";
import { FragmentExploder } from "./fragment-exploder";
import { FragmentSpatialTree } from "./fragment-spatial-tree";
import { FragmentCulling } from "./fragment-culling";
import { FragmentGrouper } from "./fragment-grouper";
import { FragmentEdges } from "./fragment-edges";
import { Components } from "../core";

/**
 * Main object that manages all the components related to the
 * [fragment geometric system](https://github.com/ifcjs/fragment).
 */
export class Fragments extends Component<Fragment[]> implements Disposable {
  /** {@link Component.name} */
  name = "Fragments";

  /** {@link Component.enabled} */
  enabled = true;

  /** {@link Component.get} */
  get(): Fragment[] {
    return Object.values(this.list);
  }

  /** The list of meshes of the created fragments. */
  get meshes() {
    const allMeshes: THREE.Mesh[] = [];
    for (const fragID in this.list) {
      allMeshes.push(this.list[fragID].mesh);
    }
    return allMeshes;
  }

  /** All the created [fragments](https://github.com/ifcjs/fragment). */
  list: { [guid: string]: Fragment } = {};

  /** Helper object to convert IFC files to fragment. */
  ifcLoader = new IfcFragmentLoader(this);

  /** Helper object to index and store fragments. */
  groups = new FragmentGrouper(this);

  /** Helper object to index and store fragments. */
  properties = new FragmentProperties();

  /** Helper object to easily work with fragment properties. */
  tree = new FragmentSpatialTree(this.properties);

  /** Helper object to easily apply a highlight color to fragments. */
  highlighter: FragmentHighlighter;

  /** Helper object to vertically explode fragments per floorplan. */
  exploder: FragmentExploder;

  /** Helper object to apply
   * [edges](https://threejs.org/docs/#api/en/geometries/EdgesGeometry). */
  edges: FragmentEdges;

  /** Helper object to easily override/restore materials globally. */
  materials: FragmentMaterials;

  /**
   * Fragment manager to add/removefragments from the scene depending
   * on whether they are visible.
   */
  culler: FragmentCulling;

  /**
   * Serializer to import and export binary fragments.
   */
  serializer = new Serializer();

  private _loader = new FragmentLoader();

  constructor(private components: Components) {
    super();
    this.highlighter = new FragmentHighlighter(components, this);
    this.exploder = new FragmentExploder(this);
    this.edges = new FragmentEdges(components);
    this.materials = new FragmentMaterials(this);
    this.culler = new FragmentCulling(components, this);
  }

  /** {@link Component.get} */
  dispose() {
    this.disposeFragmentList();
    this.ifcLoader.dispose();
    this.groups.dispose();
    this.properties.dispose();
    this.highlighter.dispose();
    this.edges.dispose();
    this.exploder.dispose();
    this.materials.dispose();
    this.culler.dispose();
  }

  // TODO: decouple the add() function from loading a fragment
  // As loading now is done with flatbuffers
  /**
   * Adds a new fragment into the scene.
   *
   * @param geometryURL - the URL of the geometry of the fragment.
   * @param dataURL - the URL of the json data of the fragment.
   */
  async load(geometryURL: string, dataURL: string) {
    const fragment = await this._loader.load(geometryURL, dataURL);
    this.list[fragment.id] = fragment;
    this.culler.add(fragment);
    const scene = this.components.scene.get();
    scene.add(fragment.mesh);
    this.components.meshes.push(fragment.mesh);
    return fragment;
  }

  private disposeFragmentList() {
    for (const fragID in this.list) {
      const fragment = this.list[fragID];
      this.removeFragmentMesh(fragment);
      fragment.dispose(true);
    }
    this.list = {};
  }

  private removeFragmentMesh(fragment: Fragment) {
    const meshes = this.components.meshes;
    const mesh = fragment.mesh;
    if (meshes.includes(mesh)) {
      meshes.splice(meshes.indexOf(mesh), 1);
    }
  }
}
