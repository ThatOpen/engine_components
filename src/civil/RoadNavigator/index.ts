import * as THREE from "three";
import { Lines } from "openbim-clay";
import { Components, Simple2DScene } from "../../core";
import { Component } from "../../base-types";

export class RoadNavigator extends Component<Lines> {
  /** {@link Component.uuid} */
  static readonly uuid = "85f2c89c-4c6b-4c7d-bc20-5b675874b228" as const;

  enabled = true;

  longSection: Simple2DScene;

  private _lines = new Lines();

  private _longProjection: Lines;

  // TODO: this should be handled better and allow to define lines per IFC model
  private _defaultID = "RoadNavigator";

  constructor(components: Components) {
    super(components);

    this.components.tools.add(RoadNavigator.uuid, this);
    this.components.tools.libraryUUIDs.add(RoadNavigator.uuid);

    const raycaster = this.components.raycaster.get();
    raycaster.params.Points = { threshold: 1 };
    this._lines.baseColor = new THREE.Color("#6528D7");
    const scene = components.scene.get();
    scene.add(this._lines.mesh);
    scene.add(this._lines.vertices.mesh);

    this.longSection = new Simple2DScene(components);
    this._longProjection = new Lines();
    const longSection = this.longSection.get();
    longSection.add(
      this._longProjection.mesh,
      this._longProjection.vertices.mesh
    );
  }

  get() {
    return this._lines;
  }

  drawPoint() {
    const found = this.components.raycaster.castRay();
    if (!found) return;
    const { x, y, z } = found.point;
    const [id] = this._lines.addPoints([[x, y, z]]);
    this._lines.vertices.mesh.geometry.computeBoundingSphere();

    const selected = Array.from(this._lines.vertices.selected.data);
    if (selected.length) {
      const previousPoint = selected[0];
      this._lines.add([previousPoint, id]);
    }

    this._lines.selectPoints(false);
    this._lines.selectPoints(true, [id]);

    this.updateLongProjection();
    this.cache();
  }

  select() {
    this._lines.selectPoints(false);
    // TODO: Fix cast ray type
    const found = this.components.raycaster.castRay([
      this._lines.vertices.mesh as any,
    ]);
    if (found && found.index !== undefined) {
      const id = this._lines.vertices.idMap.getId(found.index);
      this._lines.selectPoints(true, [id]);
    }
  }

  delete() {
    this._lines.removePoints();
    // TODO: Clay bug: The selected point keeps existing in vertices
    this._lines.vertices.selected.data.clear();
    this._lines.vertices.mesh.geometry.computeBoundingSphere();

    this.updateLongProjection();
    this.cache();
  }

  // TODO: All fragment clases should include built-in caching in dexie
  cache(id = this._defaultID) {
    const points: [number, number, number][] = [];
    const lines: [number, number][] = [];
    const newPointIDMap = new Map<number, number>();
    let pointCounter = 0;
    for (const key in this._lines.points) {
      const pointID = parseInt(key, 10);
      const coords = this._lines.vertices.get(pointID);
      if (!coords) continue;
      points.push(coords);
      newPointIDMap.set(pointID, pointCounter);
      pointCounter++;
    }
    for (const id in this._lines.list) {
      const line = this._lines.list[id];
      const newStart = newPointIDMap.get(line.start);
      const newEnd = newPointIDMap.get(line.end);
      if (newStart !== undefined && newEnd !== undefined) {
        lines.push([newStart, newEnd]);
      }
    }

    localStorage.setItem(id, JSON.stringify({ lines, points }));
  }

  loadCached(id = this._defaultID) {
    const cached = localStorage.getItem(id);
    if (!cached) return;
    const parsed = JSON.parse(cached);
    if (parsed.points && parsed.points.length) {
      this._lines.addPoints(parsed.points);
    }
    if (parsed.lines && parsed.lines.length) {
      for (const line of parsed.lines) {
        this._lines.add(line);
      }
    }
  }

  private updateLongProjection() {
    // Assuming that the lines of the road axis are sorted
    // TODO: Sort them in case they are not
    this._longProjection.clear();
    const vertices = this._lines.mesh.geometry.attributes.position;
    console.log(vertices);
    const v1 = new THREE.Vector3();
    const v2 = new THREE.Vector3();
    const points: [number, number, number][] = [];
    let accumulatedX = 0;
    for (let i = 0; i < vertices.count * 3 - 5; i += 6) {
      const x1 = vertices.array[i];
      const y1 = vertices.array[i + 1];
      const z1 = vertices.array[i + 2];
      const x2 = vertices.array[i + 3];
      const y2 = vertices.array[i + 4];
      const z2 = vertices.array[i + 5];
      v1.set(x1, y1, z1);
      v2.set(x2, y2, z2);
      const length = v1.distanceTo(v2);
      accumulatedX += length;
      points.push([accumulatedX, y2, 0]);
    }
    const ids = this._longProjection.addPoints(points);
    this._longProjection.add(ids);
  }
}
