import { FragmentLoader } from "bim-fragment/fragment-loader";
import { Fragment } from "bim-fragment";
import { Mesh } from "three";
import { Components } from "../components";
import { FragmentHighlighter } from "./fragment-highlighter";
import { FragmentCulling } from "./fragment-culling";
import { FragmentGrouper } from "./fragment-grouper";
import { FragmentEdges } from "./fragment-edges";
import { FragmentMaterials } from "./fragment-materials";
import { FragmentProperties } from "./fragment-properties";
import { FragmentSpatialTree } from "./fragment-spatial-tree";

export * from "./fragment-culling";
export * from "./fragment-edges";
export * from "./fragment-grouper";
export * from "./fragment-highlighter";
export * from "./fragment-materials";

export class Fragments {
  fragments: { [guid: string]: Fragment } = {};
  fragmentMeshes: Mesh[] = [];

  loader = new FragmentLoader();
  groups = new FragmentGrouper();
  properties = new FragmentProperties();
  tree = new FragmentSpatialTree(this.properties);

  highlighter: FragmentHighlighter;
  culler: FragmentCulling;
  edges: FragmentEdges;
  materials: FragmentMaterials;

  constructor(private components: Components) {
    this.highlighter = new FragmentHighlighter(components, this);
    this.culler = new FragmentCulling(components, this);
    this.edges = new FragmentEdges(components);
    this.materials = new FragmentMaterials(this);
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
    this.culler.add(fragment);
    const scene = this.components.scene.getScene();
    scene.add(fragment.mesh);
  }
}
