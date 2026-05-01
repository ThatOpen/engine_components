import * as THREE from "three";
import * as OBC from "@thatopen/components";
import { Line } from "../../utils";
import { Measurement } from "../Measurement";
import { LengthMeasurerModes, LengthMeasurerTempData } from "./src";

/**
 * A basic dimension tool to measure distances between 2 points in 3D and display a 3D symbol displaying the numeric value. 📕 [Tutorial](https://docs.thatopen.com/Tutorials/Components/Front/LengthMeasurement). 📘 [API](https://docs.thatopen.com/api/@thatopen/components-front/classes/LengthMeasurement).
 */
export class LengthMeasurement extends Measurement<Line, "length"> {
  static uuid = "2f9bcacf-18a9-4be6-a293-e898eae64ea1" as const;

  private _temp: LengthMeasurerTempData = {
    isDragging: false,
    line: new Line(),
  };

  /** Last edge endpoints used to drive the preview in `edge` mode.
   *  When the new pick resolves to the same edge (same endpoints
   *  within a small epsilon), we skip the dimension rebuild that
   *  would otherwise fire every frame and visibly blink. */
  private _lastEdgeKey: string | null = null;

  /** Consecutive null/no-edge picks since the last good one. Used as
   *  a small grace window so a single sub-pixel pick miss doesn't
   *  hide the dimension line and visibly flicker the endpoint
   *  marker. */
  private _edgeMissStreak = 0;
  private static readonly EDGE_MISS_TOLERANCE = 3;


  /**
   * The possible modes in which a measurement of this type may be created.
   */
  modes: LengthMeasurerModes[number][] = ["free", "edge"];

  private _mode: LengthMeasurerModes[number] = "free";

  get mode(): LengthMeasurerModes[number] {
    return this._mode;
  }

  /**
   * Represents the current measurement mode being used.
   */
  set mode(value: LengthMeasurerModes[number]) {
    this._mode = value;
    this.cancelCreation();
    if (value === "edge") this.initPreview();
    this.onStateChanged.trigger(["mode"]);
  }

  get isDragging(): boolean {
    return this._temp.isDragging;
  }

  constructor(components: OBC.Components) {
    super(components, "length");
    components.add(LengthMeasurement.uuid, this);
    this.initHandlers();
  }

  private initHandlers() {
    this.list.onItemAdded.add((line) => {
      const element = this.createLineElement(line, this._temp.startNormal);
      element.createBoundingBox();
      this.lines.add(element);
    });

    this.list.onBeforeDelete.add((line) => {
      const lineElements = [...this.lines];
      const lineElement = lineElements.find((element) => element.line === line);
      if (lineElement) this.lines.delete(lineElement);
    });

    // The base class fires `onPointerMove` once per RAF after its
    // pick resolves, with the result available on `this.lastPick`.
    // We just consume that — no second pick on this frame.
    this.onPointerMove.add(() => this.updatePreviewLine());
    this.onEnabledChange.add((enabled) => {
      if (!enabled) return;
      if (this.mode === "edge") {
        this.initPreview();
      }
    });
  }

  private async initPreview() {
    if (!this.world) {
      throw new Error("Measurement: world is need!");
    }

    // Prefer the latest per-frame pick (matches what the snap marker
    // is showing), fall back to a fresh pick when the user clicks
    // before any pointer-move has fired in this session.
    const pickResult =
      this.lastPick ??
      (await this._vertexPicker.get({ snappingClasses: this.snappings }));

    if (this.mode === "free") {
      if (!pickResult?.point) return;
      const start = pickResult.point;
      this._temp.line.set(start, start.clone());
      this._temp.isDragging = true;
      this._temp.dimension = this.createLineElement(this._temp.line);
      this._temp.startNormal = pickResult.normal ?? undefined;
    } else if (this.mode === "edge") {
      const p1 = (pickResult as any)?.snappedEdgeP1 as
        | THREE.Vector3
        | undefined;

      const p2 = (pickResult as any)?.snappedEdgeP2 as
        | THREE.Vector3
        | undefined;

      const start = p1 || new THREE.Vector3();
      const end = start || p2;
      this._temp.line.set(start, end);
      this._temp.isDragging = true;
      this._temp.dimension = this.createLineElement(this._temp.line);
      this._temp.dimension.visible = !!(p1 && p2);
    }
  }

  private updatePreviewLine() {
    if (!this.world) {
      throw new Error("Measurement: world is need!");
    }

    const pickResult = this.lastPick;

    if (this.mode === "free") {
      if (!pickResult?.point) return;
      this._temp.line.end.copy(pickResult.point);
      if (!this._temp.dimension) return;
      this._temp.dimension.end = this._temp.line.end;
    } else if (this.mode === "edge") {
      const p1 = (pickResult as any)?.snappedEdgeP1 as
        | THREE.Vector3
        | undefined;

      const p2 = (pickResult as any)?.snappedEdgeP2 as
        | THREE.Vector3
        | undefined;

      if (!(p1 && p2)) {
        // Tolerate a few consecutive misses before hiding — picks
        // can flicker null at sub-pixel boundaries and that would
        // visibly blink the endpoint marker / measurement label.
        this._edgeMissStreak += 1;
        if (
          this._edgeMissStreak > LengthMeasurement.EDGE_MISS_TOLERANCE &&
          this._temp.dimension &&
          this._temp.dimension.visible
        ) {
          this._temp.dimension.visible = false;
          this._lastEdgeKey = null;
        }
        return;
      }
      this._edgeMissStreak = 0;
      // Short-circuit when the snap resolved to the same edge as
      // the previous frame. Without this, we re-assign the dimension
      // endpoints every RAF and the dimension visibly flickers even
      // though the geometry didn't change. Quantised key matches
      // `SnapResolver`'s 1mm grid.
      const key = edgeKey(p1, p2);
      if (key === this._lastEdgeKey) {
        // Still ensure visibility is on (e.g. coming back from a
        // null streak), but only flip it if needed — repeated
        // assignments to the same value can re-trigger painters.
        if (this._temp.dimension && !this._temp.dimension.visible) {
          this._temp.dimension.visible = true;
        }
        return;
      }
      this._lastEdgeKey = key;
      this._temp.line.start.copy(p1);
      this._temp.line.end.copy(p2);
      if (!this._temp.dimension) return;
      if (!this._temp.dimension.visible) this._temp.dimension.visible = true;
      this._temp.dimension.start = this._temp.line.start;
      this._temp.dimension.end = this._temp.line.end;
    }
  }

  create = async () => {
    if (!this.enabled) return;
    if (!this._temp.isDragging) {
      await this.initPreview();
      return;
    }
    this.endCreation();
  };

  endCreation = () => {
    if (!this.enabled) return;
    if (!this._temp.dimension) return;
    this.list.add(this._temp.line.clone());
    if (this.mode === "free") {
      this._temp.dimension.dispose();
      this._temp.dimension = undefined;
      this._temp.isDragging = false;
      this._temp.startNormal = undefined;
    }
  };

  cancelCreation = () => {
    if (!this.enabled) return;
    this._temp.isDragging = false;
    if (!this._temp.dimension) return;
    this._temp.dimension?.dispose();
    this._temp.dimension = undefined;
  };

  delete = () => {
    if (!this.enabled) return;
    if (this.list.size === 0 || !this.world) return;
    const boundingBoxes = this.getLineBoxes();

    const casters = this.components.get(OBC.Raycasters);
    const caster = casters.get(this.world);
    const intersect = caster.castRayToObjects(boundingBoxes);

    if (!intersect) return;

    const lineElements = [...this.lines];
    const lineElement = lineElements.find(
      (element) => element.boundingBox === intersect.object,
    );
    if (!lineElement) return;
    this.list.delete(lineElement.line);
  };
}

/**
 * Canonical key for an edge defined by two endpoints. Endpoints are
 * quantised to a 1mm grid (matches `SnapResolver`'s vertex bin) and
 * sorted so `(a, b)` and `(b, a)` collapse to the same key.
 */
function edgeKey(a: THREE.Vector3, b: THREE.Vector3): string {
  const Q = 1000;
  const ka = `${Math.round(a.x * Q)},${Math.round(a.y * Q)},${Math.round(a.z * Q)}`;
  const kb = `${Math.round(b.x * Q)},${Math.round(b.y * Q)},${Math.round(b.z * Q)}`;
  return ka < kb ? `${ka}|${kb}` : `${kb}|${ka}`;
}
