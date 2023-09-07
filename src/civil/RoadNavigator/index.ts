import * as THREE from "three";
import { Lines } from "openbim-clay";
import { Components } from "../../core";

export class RoadNavigator {
  private _components: Components;
  private _lines = new Lines();

  // TODO: this should be handled better and allow to define lines per IFC model
  private _defaultID = "RoadNavigator";

  constructor(components: Components) {
    this._components = components;
    const raycaster = this._components.raycaster.get();
    raycaster.params.Points = { threshold: 1 };
    this._lines.baseColor = new THREE.Color("#6528D7");
    const scene = components.scene.get();
    scene.add(this._lines.mesh);
    scene.add(this._lines.vertices.mesh);
  }

  drawPoint() {
    const found = this._components.raycaster.castRay();
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

    this.cache();
  }

  select() {
    this._lines.selectPoints(false);
    // TODO: Fix cast ray type
    const found = this._components.raycaster.castRay([
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
}
