import { FragmentLoader } from "bim-fragment/fragment-loader";
import { Fragment } from "bim-fragment";
import { Mesh } from "three";
import { Components } from "../components";
import { FragmentHighlighter } from "./fragment-highlighter";
import FragmentCulling from "./fragment-culling";
import { FragmentGrouper } from "./fragment-grouper";
import { FragmentEdges } from "./fragment-edges";

export class Fragments {
  fragments: { [guid: string]: Fragment } = {};
  fragmentMeshes: Mesh[] = [];

  loader = new FragmentLoader();
  groups = new FragmentGrouper();
  highlighter: FragmentHighlighter;
  culler: FragmentCulling;
  edges: FragmentEdges;

  constructor(private components: Components) {
    this.highlighter = new FragmentHighlighter(components, this);
    this.culler = new FragmentCulling(components, this);
    this.edges = new FragmentEdges(components);
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
    const scene = this.components.scene.getScene();
    scene.add(fragment.mesh);
  }
}
