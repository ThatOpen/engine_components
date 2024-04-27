import * as THREE from "three";
import * as FRAGS from "bim-fragment";
import { Alignment, FragmentsGroup } from "bim-fragment";
import { CurveHighlighter } from "../CivilNavigator/src/curve-highlighter";
import { Component, Event } from "../../base-types";
import {
  Components,
  Simple2DMarker,
  SimpleCamera,
  SimpleRenderer,
  ToolComponent,
} from "../../core";
import { CivilMarkerType } from "../CivilNavigator";
import { KPManager } from "../CivilNavigator/src/kp-manager.ts";

export class Civil3DNavigator extends Component<any> {
  static readonly uuid = "0a59c09e-2b49-474a-9320-99f51f40f182" as const;

  readonly view = "absolute";

  readonly onHighlight = new Event<{
    curve: FRAGS.CurveMesh;
    point: THREE.Vector3;
    index: number;
  }>();

  highlighter: CurveHighlighter;

  enabled = true;

  mouseMarkers: {
    hover: Simple2DMarker;
    select: Simple2DMarker;
  };

  readonly onMarkerChange = new Event<{
    alignment: FRAGS.Alignment;
    percentage: number;
    type: CivilMarkerType;
    curve: FRAGS.CivilCurve;
  }>();

  readonly onMarkerHidden = new Event<{
    type: CivilMarkerType;
  }>();

  private _curves: FRAGS.CurveMesh[] = [];

  constructor(components: Components) {
    super(components);

    this.components.tools.add(Civil3DNavigator.uuid, this);

    const scene = this.components.scene.get();
    const camera = this.components.camera as SimpleCamera;

    const kpManager = new KPManager(
      components,
      this.components.renderer as SimpleRenderer,
      scene,
      camera.controls,
      this.view,
    );
    this.highlighter = new CurveHighlighter(scene, "absolute", kpManager);

    this.mouseMarkers = {
      select: this.newMouseMarker("#ffffff"),
      hover: this.newMouseMarker("#575757"),
    };
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
        await this.updateMarker(found, "select");
        const { point, index } = found;
        if (index !== undefined) {
          await this.onHighlight.trigger({ curve, point, index });
        }
        return;
      }
      this.highlighter.unSelect();
      this.mouseMarkers.hover.visible = false;
      await this.onMarkerHidden.trigger({ type: "hover" });
    });

    dom.addEventListener("mousemove", async (event: MouseEvent) => {
      if (!this.enabled) {
        return;
      }
      const camera = this.components.camera.get();
      const found = this.highlighter.castRay(event, camera, dom, this._curves);
      if (found) {
        this.highlighter.hover(found.object as FRAGS.CurveMesh);
        await this.updateMarker(found, "hover");
        return;
      }
      this.highlighter.unHover();
    });
  }

  private newMouseMarker(color: string) {
    const scene = this.components.scene.get();
    const root = document.createElement("div");
    root.style.backgroundColor = color;
    root.style.width = "1rem";
    root.style.height = "1rem";
    root.style.borderRadius = "1rem";
    const mouseMarker = new Simple2DMarker(this.components, root, scene);
    mouseMarker.visible = false;
    return mouseMarker;
  }

  setMarker(alignment: Alignment, percentage: number, type: CivilMarkerType) {
    const point = alignment.getPointAt(percentage, "absolute");
    this.mouseMarkers[type].visible = true;
    const marker = this.mouseMarkers[type].get();
    marker.position.copy(point);
  }

  hideMarker(type: CivilMarkerType) {
    const marker = this.mouseMarkers[type].get();
    marker.visible = false;
  }

  private async updateMarker(
    intersects: THREE.Intersection,
    type: CivilMarkerType,
  ) {
    const { point, object } = intersects;
    const mesh = object as FRAGS.CurveMesh;
    const curve = mesh.curve;
    const alignment = mesh.curve.alignment;
    const percentage = alignment.getPercentageAt(point, "absolute");
    this.mouseMarkers[type].visible = true;
    const marker = this.mouseMarkers[type].get();
    marker.position.copy(point);
    if (percentage !== null) {
      await this.onMarkerChange.trigger({ alignment, percentage, type, curve });
    }
  }
}

ToolComponent.libraryUUIDs.add(Civil3DNavigator.uuid);
