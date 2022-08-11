import { SimpleClipper } from "../../core";
import { EdgesPlane } from "./edges-plane";

export class EdgesClipper extends SimpleClipper<EdgesPlane> {
  updateEdges() {
    for (const plane of this.planes) {
      plane.edges.updateEdges();
    }
  }
}
