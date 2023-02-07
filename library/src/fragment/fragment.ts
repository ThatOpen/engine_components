import { FragmentLoader } from "bim-fragment/fragment-loader";
import { Fragment } from "bim-fragment";
import * as THREE from "three";
import { FragmentHighlighter } from "./fragment-highlighter";
import { FragmentCulling } from "./fragment-culling";
import { FragmentGrouper } from "./fragment-grouper";
import { FragmentEdges } from "./fragment-edges";
import { FragmentMaterials } from "./fragment-materials";
import { FragmentProperties } from "./fragment-properties";
import { FragmentSpatialTree } from "./fragment-spatial-tree";
import { Components } from "../components";
import { Component, Disposable } from "../core";
import { IfcFragmentLoader } from "./fragment-ifc-importer";
import { MemoryCulling } from "./memory-culling";
import { FragmentExploder } from "./fragment-exploder";

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
   * Fragment manager to add/remove fragments from memory depending
   * on whether they are visible.
   */
  memoryCuller: MemoryCulling;

  private _loader = new FragmentLoader();

  constructor(private components: Components) {
    super();
    this.highlighter = new FragmentHighlighter(components, this);
    this.exploder = new FragmentExploder(this);
    this.edges = new FragmentEdges(components);
    this.materials = new FragmentMaterials(this);
    this.culler = new FragmentCulling(components, this);
    this.memoryCuller = new MemoryCulling(components);
  }

  /** {@link Component.get} */
  dispose() {
    for (const fragID in this.list) {
      const fragment = this.list[fragID];
      fragment.dispose(true);
    }
    this.list = {};
    this.ifcLoader.dispose();
    this.groups.dispose();
    this.properties.dispose();
    this.highlighter.dispose();
    this.edges.dispose();
    this.exploder.dispose();
    this.materials.dispose();
    this.culler.dispose();
    this.memoryCuller.dispose();
  }

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
    return fragment;
  }
}
