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
import { Component } from "../core";
import { IfcFragmentLoader } from "./fragment-ifc-importer";
import { MemoryCulling } from "./memory-culling";
import { FragmentExploder } from "./fragment-exploder";

// TODO: Clean up and document all this folder

export class Fragments extends Component<Fragment[]> {
  name = "Fragments";
  enabled = true;
  get(): Fragment[] {
    return Object.values(this.fragments);
  }

  fragments: { [guid: string]: Fragment } = {};
  fragmentMeshes: THREE.Mesh[] = [];

  ifcLoader = new IfcFragmentLoader();
  loader = new FragmentLoader();
  groups = new FragmentGrouper(this);
  properties = new FragmentProperties();
  tree = new FragmentSpatialTree(this.properties);

  highlighter: FragmentHighlighter;
  exploder: FragmentExploder;
  edges: FragmentEdges;
  materials: FragmentMaterials;
  culler: FragmentCulling;
  memoryCuller: MemoryCulling;

  constructor(private components: Components) {
    super();
    this.highlighter = new FragmentHighlighter(components, this);
    this.exploder = new FragmentExploder(this);
    this.edges = new FragmentEdges(components);
    this.materials = new FragmentMaterials(this);
    this.culler = new FragmentCulling(components, this);
    this.memoryCuller = new MemoryCulling(components);
  }

  async load(
    geometryURL: string,
    dataURL: string,
    matrix = new THREE.Matrix4()
  ) {
    const fragment = await this.loader.load(geometryURL, dataURL);
    if (matrix) {
      fragment.mesh.applyMatrix4(matrix);
    }
    this.add(fragment);
    return fragment;
  }

  add(fragment: Fragment) {
    this.fragments[fragment.id] = fragment;
    this.components.meshes.push(fragment.mesh);
    this.fragmentMeshes.push(fragment.mesh);
    this.culler?.add(fragment);
    const scene = this.components.scene.get();
    scene.add(fragment.mesh);
  }
}
