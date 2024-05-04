import * as THREE from "three";
import * as FRAGS from "@thatopen/fragments";
import * as OBC from "@thatopen/components";
import { CurveHighlighter } from "../CivilNavigator/src/curve-highlighter";
import { CivilMarkerType } from "../CivilNavigator";
import { Mark } from "../../core";

export class Civil3DNavigator extends OBC.Component {
  static readonly uuid = "0a59c09e-2b49-474a-9320-99f51f40f182" as const;

  readonly onHighlight = new OBC.Event<{
    curve: FRAGS.CurveMesh;
    point: THREE.Vector3;
    index: number;
  }>();

  enabled = true;

  highlighter?: CurveHighlighter;

  mouseMarkers?: {
    hover: Mark;
    select: Mark;
  };

  readonly onMarkerChange = new OBC.Event<{
    alignment: FRAGS.Alignment;
    percentage: number;
    type: CivilMarkerType;
    curve: FRAGS.CivilCurve;
  }>();

  readonly onMarkerHidden = new OBC.Event<{
    type: CivilMarkerType;
  }>();

  private _curves: FRAGS.CurveMesh[] = [];

  private _world: OBC.World | null = null;

  get world() {
    return this._world;
  }

  set world(world: OBC.World | null) {
    if (world === this._world) {
      return;
    }

    if (this._world) {
      this.setupEvents(false);
    }

    this._world = world;

    this.highlighter?.dispose();
    this.mouseMarkers?.hover.dispose();
    this.mouseMarkers?.select.dispose();

    if (!world) {
      return;
    }

    const scene = world.scene.three;
    this.highlighter = new CurveHighlighter(scene, "absolute");

    this.mouseMarkers = {
      select: this.newMouseMarker("#ffffff", world),
      hover: this.newMouseMarker("#575757", world),
    };

    this.setupEvents(true);
  }

  constructor(components: OBC.Components) {
    super(components);
    this.components.add(Civil3DNavigator.uuid, this);
  }

  draw(model: FRAGS.FragmentsGroup) {
    if (!model.civilData) {
      throw new Error("Model must have civil data!");
    }
    if (!this.world) {
      throw new Error("A world must be given before drawing an alignment!");
    }
    const scene = this.world.scene.three;
    for (const [_id, alignment] of model.civilData.alignments) {
      for (const { mesh } of alignment.absolute) {
        scene.add(mesh);
        this._curves.push(mesh);
      }
    }
  }

  private newMouseMarker(color: string, world: OBC.World) {
    const scene = world.scene.three;
    const root = document.createElement("div");
    root.style.backgroundColor = color;
    root.style.width = "1rem";
    root.style.height = "1rem";
    root.style.borderRadius = "1rem";
    const mouseMarker = new Mark(world, root, scene);
    mouseMarker.visible = false;
    return mouseMarker;
  }

  setMarker(
    alignment: FRAGS.Alignment,
    percentage: number,
    type: CivilMarkerType,
  ) {
    if (!this.mouseMarkers) {
      throw new Error(
        "No mouse markers found! Initialize the world before using this.",
      );
    }
    const point = alignment.getPointAt(percentage, "absolute");
    this.mouseMarkers[type].visible = true;
    const marker = this.mouseMarkers[type].three;
    marker.position.copy(point);
  }

  hideMarker(type: CivilMarkerType) {
    if (!this.mouseMarkers) {
      throw new Error(
        "No mouse markers found! Initialize the world before using this.",
      );
    }
    const marker = this.mouseMarkers[type].three;
    marker.visible = false;
  }

  private setupEvents(active: boolean) {
    if (!this.world) {
      throw new Error("No world found!");
    }

    if (!this.world.renderer) {
      return;
    }
    const dom = this.world.renderer.three.domElement;

    if (active) {
      dom.addEventListener("click", this.onClick);
      dom.addEventListener("mousemove", this.onMouseMove);
    } else {
      dom.removeEventListener("click", this.onClick);
      dom.removeEventListener("mousemove", this.onMouseMove);
    }
  }

  private onClick = (event: MouseEvent) => {
    if (!this.enabled || !this.highlighter) {
      return;
    }

    if (!this.world) {
      throw new Error("No world found!");
    }

    if (!this.world.renderer) {
      return;
    }
    const dom = this.world.renderer.three.domElement;

    const camera = this.world.camera.three;
    const found = this.highlighter.castRay(event, camera, dom, this._curves);
    if (found) {
      const curve = found.object as FRAGS.CurveMesh;
      this.highlighter.select(curve);
      this.updateMarker(found, "select");
      const { point, index } = found;
      if (index !== undefined) {
        this.onHighlight.trigger({ curve, point, index });
      }
      return;
    }
    this.highlighter.unSelect();
    if (this.mouseMarkers) {
      this.mouseMarkers.hover.visible = false;
    }
    this.onMarkerHidden.trigger({ type: "hover" });
  };

  private onMouseMove = async (event: MouseEvent) => {
    if (!this.enabled || !this.highlighter) {
      return;
    }

    if (!this.world) {
      throw new Error("No world found!");
    }
    if (!this.world.renderer) {
      return;
    }
    const dom = this.world.renderer.three.domElement;

    const camera = this.world.camera.three;
    const found = this.highlighter.castRay(event, camera, dom, this._curves);

    if (found) {
      this.highlighter.hover(found.object as FRAGS.CurveMesh);
      this.updateMarker(found, "hover");
      return;
    }

    this.highlighter.unHover();
  };

  private updateMarker(intersects: THREE.Intersection, type: CivilMarkerType) {
    if (!this.mouseMarkers) return;
    const { point, object } = intersects;
    const mesh = object as FRAGS.CurveMesh;
    const curve = mesh.curve;
    const alignment = mesh.curve.alignment;
    const percentage = alignment.getPercentageAt(point, "absolute");
    this.mouseMarkers[type].visible = true;
    const marker = this.mouseMarkers[type].three;
    marker.position.copy(point);
    if (percentage !== null) {
      this.onMarkerChange.trigger({ alignment, percentage, type, curve });
    }
  }
}
