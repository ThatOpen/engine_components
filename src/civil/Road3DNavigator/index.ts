import * as THREE from "three";
import * as FRAGS from "bim-fragment";
import { FragmentsGroup } from "bim-fragment";
import { CurveHighlighter } from "../RoadNavigator/src/curve-highlighter";
import { Component, Event } from "../../base-types";
import { Components, ToolComponent } from "../../core";

export class Road3DNavigator extends Component<any> {
  static readonly uuid = "0a59c09e-2b49-474a-9320-99f51f40f182" as const;

  readonly onHighlight = new Event<{
    curve: FRAGS.CurveMesh;
    point: THREE.Vector3;
    index: number;
  }>();

  highlighter: CurveHighlighter;

  enabled = true;

  private _curves: FRAGS.CurveMesh[] = [];

  constructor(components: Components) {
    super(components);

    this.components.tools.add(Road3DNavigator.uuid, this);

    const scene = this.components.scene.get();
    this.highlighter = new CurveHighlighter(scene, "absolute");
  }

  get(): any {
    return null as any;
  }

  draw(model: FragmentsGroup) {
    if (!model.civilData) {
      throw new Error("Model must have civil data!");
    }
    const scene = this.components.scene.get();
    for (const [_id, alignment] of model.civilData.alignments) {
      for (const { mesh } of alignment.absolute) {
        scene.add(mesh);
        this._curves.push(mesh);
      }
    }
  }

  setup() {
    const dom = this.components.renderer.get().domElement;

    dom.addEventListener("click", async (event: MouseEvent) => {
      if (!this.enabled) {
        return;
      }
      const camera = this.components.camera.get();
      const found = this.highlighter.castRay(event, camera, dom, this._curves);
      if (found) {
        const curve = found.object as FRAGS.CurveMesh;
        this.highlighter.select(curve);
        const { point, index } = found;
        if (index !== undefined) {
          await this.onHighlight.trigger({ curve, point, index });
        }
        return;
      }
      this.highlighter.unSelect();
    });

    dom.addEventListener("mousemove", (event: MouseEvent) => {
      if (!this.enabled) {
        return;
      }
      const camera = this.components.camera.get();
      const found = this.highlighter.castRay(event, camera, dom, this._curves);
      if (found) {
        this.highlighter.hover(found.object as FRAGS.CurveMesh);
        return;
      }
      this.highlighter.unHover();
    });
  }
}

ToolComponent.libraryUUIDs.add(Road3DNavigator.uuid);
