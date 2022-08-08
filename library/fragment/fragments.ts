import { FragmentLoader } from "bim-fragment/fragment-loader";
import { Fragment } from "bim-fragment";
import { Components } from "../components";
import { FragmentHighlighter } from "./fragment-highlighter";
import FragmentCulling from "./fragment-culling";
import { FragmentGrouper } from "./fragment-grouper";

export class Fragments {
  fragments: { [guid: string]: Fragment } = {};
  loader = new FragmentLoader();
  groups = new FragmentGrouper();
  highlighter: FragmentHighlighter;
  culler: FragmentCulling;

  constructor(private components: Components) {
    this.highlighter = new FragmentHighlighter(components);
    this.culler = new FragmentCulling(components, this);
  }

  async load(geometryURL: string, dataURL: string) {
    const fragment = await this.loader.load(geometryURL, dataURL);
    this.add(fragment);
    return fragment;
  }

  updateHighlight() {
    this.highlighter.fragments = Object.values(this.fragments);
  }

  add(fragment: Fragment) {
    this.fragments[fragment.id] = fragment;
    this.components.meshes.push(fragment.mesh);
    const scene = this.components.scene.getScene();
    scene.add(fragment.mesh);
  }
}
