import { FragmentLoader } from "bim-fragment/fragment-loader";
import { Fragment } from "bim-fragment";
import { Mesh } from "three";
import { FragmentHighlighter } from "./fragment-highlighter";
import { FragmentCulling } from "./fragment-culling";
import { FragmentGrouper } from "./fragment-grouper";
import { FragmentEdges } from "./fragment-edges";
import { FragmentMaterials } from "./fragment-materials";
import { FragmentProperties } from "./fragment-properties";
import { FragmentSpatialTree } from "./fragment-spatial-tree";
import { Components } from "../index";
import { IfcFragmentLoader } from "./fragment-ifc-importer";

export interface FragmentConfig {
  culling: boolean;
}

export class Fragments {
  fragments: { [guid: string]: Fragment } = {};
  fragmentMeshes: Mesh[] = [];

  ifcLoader = new IfcFragmentLoader();
  loader = new FragmentLoader();
  groups = new FragmentGrouper();
  properties = new FragmentProperties();
  tree = new FragmentSpatialTree(this.properties);

  highlighter: FragmentHighlighter;
  edges: FragmentEdges;
  materials: FragmentMaterials;
  culler?: FragmentCulling;

  constructor(private components: Components, config?: FragmentConfig) {
    this.highlighter = new FragmentHighlighter(components, this);
    this.edges = new FragmentEdges(components);
    this.materials = new FragmentMaterials(this);
    if (!config || config.culling) {
      this.culler = new FragmentCulling(components, this);
    }
  }

  async load(geometryURL: string, dataURL: string) {
    const fragment = await this.loader.load(geometryURL, dataURL);
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
