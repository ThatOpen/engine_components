import { SimpleClipper } from "../../core";
import { EdgesPlane } from "./edges-plane";

export class EdgesClipper extends SimpleClipper<EdgesPlane> {
  updateEdges() {
    for (const plane of this._planes) {
      plane.edges.updateEdges();
    }
  }
}
