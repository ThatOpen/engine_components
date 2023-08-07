import { FragmentManager, FragmentPlans } from "../../fragments";
import { EdgesClipper } from "../../navigation";
import { EdgeProjector } from "./src/edge-projector";

export class DXFExporter {
  _fragments: FragmentManager;
  _plans: FragmentPlans;
  _clipper: EdgesClipper;
  private _projector = new EdgeProjector();

  constructor(
    fragments: FragmentManager,
    plans: FragmentPlans,
    clipper: EdgesClipper
  ) {
    this._fragments = fragments;
    this._plans = plans;
    this._clipper = clipper;
  }

  async export(height: number) {
    const meshes = Object.values(this._fragments.list).map((frag) => frag.mesh);
    return this._projector.project(meshes, height);
  }
}
