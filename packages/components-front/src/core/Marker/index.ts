import * as THREE from "three";
import * as OBC from "@thatopen/components";
import { Mark } from "./src";

// TODO: Right now the clustering algorithm is probably n^2
// (compares all clusters with all clusters). Can we use a faster algo?)
// TODO: Optimize by computing clusters in worker
// TODO: Optimize by only computing visible marks


export interface IMarker {
  key: string;
  label: Mark;
  type?: string;
  merged: boolean;
  static: boolean;
}

export interface IGroupedMarkers {
  key: string;
  markerKeys: string[];
  label: Mark;
}

/**
 * Class for Managing Markers along with creating different types of markers
 * Every marker is a Simple2DMarker
 * For every marker that needs to be added, you can use the Manager to add the marker and change its look and feel
 */
export class Marker extends OBC.Component {
  static readonly uuid = "4079eb91-79b0-4ede-bcf2-15b837129236" as const;

  enabled = true;

  threshold = 50;

  autoCluster = true;

  protected list = new Map<string, IMarker>();

  protected clusterLabels: Set<IGroupedMarkers> = new Set<IGroupedMarkers>();

  protected currentKeys: Set<string> = new Set<string>();

  protected _color = "white";

  // TODO: Replace with UUID for the marker key
  protected _markerKey = 0;

  protected _clusterKey = 0;

  protected isNavigating = false;

  private _setupWorlds = new Set<string>();

  constructor(components: OBC.Components) {
    super(components);
    components.add(Marker.uuid, this);
  }

  get color() {
    return this._color;
  }

  set color(value: string) {
    this._color = value;
    for (const [_id, marker] of this.list) {
      marker.label.three.element.style.color = value;
    }
  }

  create(world: OBC.World, text: string, point: THREE.Vector3) {
    this.setupEvents(world, true);

    const span = document.createElement("span");
    span.innerHTML = text;
    span.style.color = this._color;
    const marker = new Mark(world, span);

    marker.three.position.copy(point);

    const key = this._markerKey.toString();

    this.list.set(key, {
      key,
      label: marker,
      merged: false,
      static: false,
    });

    this._markerKey++;

    return key;
  }

  delete(id: string) {
    const marker = this.list.get(id);
    if (marker) {
      marker.label.dispose();
    }
    this.list.delete(id);
  }

  clear(type?: string) {
    const ids = [...this.list.keys()];
    for (const id of ids) {
      const marker = this.list.get(id) as IMarker;
      if (type && marker.type !== type) {
        continue;
      }
      marker.label.dispose();
      this.list.delete(id);
    }
    this.list.clear();
    this._markerKey = 0;
  }

  dispose() {
    for (const [_id, marker] of this.list) {
      marker.label.dispose();
    }

    this.list.clear();
    this._markerKey = 0;

    for (const cluster of this.clusterLabels) {
      cluster.label.dispose();
    }

    this.clusterLabels.clear();
    this._clusterKey = 0;

    this.currentKeys.clear();
  }

  private setupEvents(world: OBC.World, enabled: boolean) {
    if (enabled && this._setupWorlds.has(world.uuid)) {
      return;
    }
    if (!world.camera.hasCameraControls()) {
      return;
    }
    if (enabled) {
      world.camera.controls.addEventListener("sleep", () => {
        this.manageCluster();
      });

      world.camera.controls.addEventListener("rest", () => {
        if (this.isNavigating) {
          this.manageCluster();
          this.isNavigating = false;
        }
      });
    } else {
      world.camera.controls.removeEventListener("sleep", () => {
        this.manageCluster();
      });

      world.camera.controls.removeEventListener("rest", () => {
        if (this.isNavigating) {
          this.manageCluster();
          this.isNavigating = false;
        }
      });
    }
  }

  private resetMarkers() {
    for (const [_id, marker] of this.list) {
      marker.merged = false;
    }
    for (const cluster of this.clusterLabels) {
      cluster.label.dispose();
    }
    this.clusterLabels.clear();
    this._clusterKey = 0;
  }

  private removeMergeMarkers() {
    for (const [_id, marker] of this.list) {
      if (marker.merged) {
        marker.label.dispose();
      } else {
        const scene = marker.label.world.scene.three;
        scene.add(marker.label.three);
      }
    }

    for (const cluster of this.clusterLabels) {
      if (cluster.markerKeys.length === 1) {
        const marker = this.list.get(cluster.markerKeys[0]);

        if (marker) {
          const scene = marker.label.world.scene.three;
          scene.add(marker.label.three);
          marker.merged = false;
        }

        cluster.label.dispose();
        this.clusterLabels.delete(cluster);
      }
    }
  }

  private manageCluster() {
    if (!this.autoCluster) return;
    this.resetMarkers();

    for (const [_id, marker] of this.list) {
      if (!marker.merged && !marker.static) {
        this.currentKeys.clear();
        for (const [_id, marker2] of this.list) {
          if (marker2.static) {
            continue;
          }
          if (marker.key !== marker2.key && !marker2.merged) {
            const distance = this.distance(marker.label, marker2.label);
            if (distance < this.threshold) {
              this.currentKeys.add(marker2.key);
              marker2.merged = true;
            }
          }
        }

        if (this.currentKeys.size > 0) {
          this.currentKeys.add(marker.key);
          marker.merged = true;
          const clusterGroup = Array.from(this.currentKeys);
          const averagePosition =
            this.getAveragePositionFromLabels(clusterGroup);

          const clusterLabel = new Mark(
            marker.label.world,
            this.createClusterElement(this._clusterKey.toString()),
          );

          const { element } = clusterLabel.three;
          element.textContent = clusterGroup.length.toString();

          clusterLabel.three.position.copy(averagePosition);

          this.clusterLabels.add({
            key: this._clusterKey.toString(),
            markerKeys: clusterGroup,
            label: clusterLabel,
          });

          this._clusterKey++;
        }
      }
    }

    this.removeMergeMarkers();
  }

  private getAveragePositionFromLabels(clusterGroup: string[]) {
    const positions = clusterGroup.map((key) => {
      const marker = this.list.get(key);
      if (marker) {
        return marker.label.three.position;
      }
      return new THREE.Vector3();
    });

    return positions
      .reduce((acc, curr) => acc.add(curr), new THREE.Vector3())
      .divideScalar(positions.length);
  }

  private createClusterElement(key: string) {
    const div = document.createElement("div");
    div.textContent = key;
    div.style.color = "#000000";
    div.style.background = "#FFFFFF";
    div.style.fontSize = "1.2rem";
    div.style.fontWeight = "500";
    div.style.pointerEvents = "auto";
    div.style.borderRadius = "50%";
    div.style.padding = "5px 11px";
    div.style.textAlign = "center";
    div.style.cursor = "pointer";
    // div.style.transition = "all 0.05s";
    div.addEventListener("pointerdown", () => {
      this.navigateToCluster(key);
    });
    div.addEventListener("pointerover", () => {
      div.style.background = "#BCF124";
    });
    div.addEventListener("pointerout", () => {
      div.style.background = "#FFFFFF";
    });
    return div;
  }

  private getScreenPosition(label: Mark) {
    const screenPosition = new THREE.Vector3();

    if (!label.world.renderer) {
      throw new Error("Renderer not found!");
    }

    const position = label.three.position.clone();
    position.project(label.world.camera.three);
    const dimensions = label.world.renderer.getSize();
    screenPosition.x = (position.x * dimensions.x) / 2 + dimensions.x / 2;
    screenPosition.y = -((position.y * dimensions.y) / 2) + dimensions.y / 2;

    return screenPosition;
  }

  private distance(label1: Mark, label2: Mark) {
    const screenPosition1 = this.getScreenPosition(label1);
    const screenPosition2 = this.getScreenPosition(label2);
    const dx = screenPosition1.x - screenPosition2.x;
    const dy = screenPosition1.y - screenPosition2.y;
    const distance = Math.sqrt(dx * dx + dy * dy) * 0.5;
    // Managing Overlapping Labels
    if (distance === 0) {
      return this.threshold + 1;
    }
    return distance;
  }

  private navigateToCluster(key: string) {
    const boundingRegion: number[] = [];

    const cluster = Array.from(this.clusterLabels).find(
      (cluster) => cluster.key === key,
    );

    if (!cluster) {
      return;
    }

    const camera = cluster.label.world.camera;
    if (!camera.hasCameraControls()) {
      console.warn("Zoom to clusters only supported with Camera Controls!");
      return;
    }

    for (const markerKey of cluster.markerKeys) {
      const marker = this.list.get(markerKey);
      if (marker) {
        const { x, y, z } = marker.label.three.position;
        boundingRegion.push(x, y, z);
      }
    }
    cluster.label.dispose();
    this.clusterLabels.delete(cluster);

    const geometry = new THREE.BufferGeometry();
    const buffer = new Float32Array(boundingRegion);
    const attr = new THREE.BufferAttribute(buffer, 3);
    geometry.setAttribute("position", attr);

    const mesh = new THREE.Mesh(geometry);
    mesh.geometry.computeBoundingSphere();
    const boundingSphere = mesh.geometry.boundingSphere;

    if (boundingSphere) {
      camera.controls.fitToSphere(mesh, true);
    }

    this.isNavigating = true;
    geometry.dispose();
    mesh.clear();

    boundingRegion.length = 0;
  }
}
