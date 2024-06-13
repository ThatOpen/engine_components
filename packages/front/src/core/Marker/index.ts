import * as THREE from "three";
import * as OBC from "@thatopen/components";
import { Mark } from "./src";

// TODO: Right now the clustering algorithm is probably n^2
// (compares all clusters with all clusters). Can we use a faster algo?)
// TODO: Optimize by computing clusters in worker
// TODO: Optimize by only computing visible marks

export * from "./src";

/**
 * Interface representing a marker object.
 */
export interface IMarker {
  /**
   * Unique identifier for the marker.
   */
  key: string;

  /**
   * Label of the marker.
   */
  label: Mark;

  /**
   * Optional type of the marker.
   */
  type?: string;

  /**
   * Indicates whether the marker is merged with other markers.
   */
  merged: boolean;

  /**
   * Indicates whether the marker is static and should not be clustered.
   */
  static: boolean;
}

/**
 * Interface representing a group of markers.
 */
export interface IGroupedMarkers {
  /**
   * Unique identifier for the group of markers.
   */
  key: string;

  /**
   * Array of keys of markers that belong to this group.
   */
  markerKeys: string[];

  /**
   * Label of the group of markers.
   */
  label: Mark;
}

/**
 * Component for Managing Markers along with creating different types of markers. Every marker is a Simple2DMarker. For every marker that needs to be added, you can use the Manager to add the marker and change its look and feel. 📕 [Tutorial](https://docs.thatopen.com/Tutorials/Components/Front/Marker). 📘 [API](https://docs.thatopen.com/api/@thatopen/components-front/classes/Marker).
 */
export class Marker extends OBC.Component implements OBC.Disposable {
  /**
   * A unique identifier for the component.
   * This UUID is used to register the component within the Components system.
   */
  static readonly uuid = "4079eb91-79b0-4ede-bcf2-15b837129236" as const;

  /** {@link OBC.Disposable.onDisposed} */
  readonly onDisposed = new OBC.Event();

  /** {@link OBC.Component.enabled} */
  enabled = true;

  /**
   * The distance threshold for clustering markers.
   * Markers within this distance will be considered for clustering.
   * Default value is 50.
   */
  threshold = 50;

  /**
   * Indicates whether markers should be automatically clustered.
   * If true, markers will be clustered based on the threshold value.
   * Default value is true.
   */
  autoCluster = true;

  /**
   * A Map containing the markers grouped by world UUID.
   * Each world can have its own set of markers.
   */
  list = new Map<string, Map<string, IMarker>>();

  protected clusterLabels: Set<IGroupedMarkers> = new Set<IGroupedMarkers>();

  protected currentKeys: Set<string> = new Set<string>();

  protected _color = "white";

  // TODO: Replace with UUID for the marker key
  protected _markerKey = 0;

  protected _clusterKey = 0;

  private _worldEvents = new Map<string, () => void>();

  private _setupWorlds = new Set<string>();

  /**
   * Getter for the color property.
   * Returns the current color of the markers.
   *
   * @returns {string} The current color of the markers.
   */
  get color() {
    return this._color;
  }

  /**
   * Setter for the color property.
   * Updates the color of all the markers to the new value.
   *
   * @param {string} value - The new color value for the markers.
   */
  set color(value: string) {
    this._color = value;
    for (const [_worldID, markers] of this.list) {
      for (const [_markerID, marker] of markers) {
        marker.label.three.element.style.color = value;
      }
    }
  }

  constructor(components: OBC.Components) {
    super(components);
    components.add(Marker.uuid, this);
  }

  /**
   * Creates a new marker at the specified point in the world.
   *
   * @param world - The world where the marker will be created.
   * @param text - The text content of the marker.
   * @param point - The 3D position where the marker will be placed.
   * @param isStatic - Indicates whether the marker should be static and not clustered.
   * @returns The unique key of the created marker.
   */
  create(
    world: OBC.World,
    text: string,
    point: THREE.Vector3,
    isStatic = false,
  ) {
    this.setupEvents(world, true);

    const key = this._markerKey.toString();

    const markers = this.getWorldMarkerList(world);

    if (markers.has(key)) {
      return;
    }

    const span = document.createElement("span");
    span.innerHTML = text;
    span.style.color = this._color;
    const marker = new Mark(world, span);
    marker.three.position.copy(point);

    markers.set(key, {
      key,
      label: marker,
      merged: false,
      static: isStatic,
    });

    this._markerKey++;

    return key;
  }

  /**
   * Deletes a marker with the specified ID from all worlds.
   *
   * @param id - The unique identifier of the marker to be deleted.
   *
   * @remarks
   * This method iterates through all the worlds and their respective markers.
   * If a marker with the specified ID is found, it disposes of the marker's label
   * and removes the marker from the world's marker list.
   *
   */
  delete(id: string) {
    for (const [_worldID, markers] of this.list) {
      const marker = markers.get(id);
      if (marker) {
        marker.label.dispose();
      }
      markers.delete(id);
    }
  }

  /**
   * Retrieves the list of markers associated with a specific world.
   * If the list does not exist for the given world, it creates a new one.
   *
   * @param world - The world for which the marker list is to be retrieved.
   * @returns A Map containing the markers associated with the given world.
   *
   * @remarks
   * This method is used to manage markers per world. It ensures that each world has its own set of markers.
   * If a marker list for the given world does not exist, it creates a new one and associates it with the world.
   */
  getWorldMarkerList(world: OBC.World) {
    if (!this.list.has(world.uuid)) {
      this.list.set(world.uuid, new Map());
    }

    return this.list.get(world.uuid) as Map<string, IMarker>;
  }

  /** {@link OBC.Disposable.dispose} */
  dispose(type?: string) {
    for (const [_worldID, markers] of this.list) {
      const ids = [...markers.keys()];
      for (const id of ids) {
        const marker = markers.get(id) as IMarker;
        if (type && marker.type !== type) {
          continue;
        }
        marker.label.dispose();
        markers.delete(id);
      }
    }
    if (!type) {
      this.list.clear();
      this._markerKey = 0;

      for (const cluster of this.clusterLabels) {
        cluster.label.dispose();
      }

      this.clusterLabels.clear();
      this._clusterKey = 0;

      this.currentKeys.clear();
    }

    this.onDisposed.trigger();
  }

  /**
   * Sets up event listeners for clustering markers in the given world.
   *
   * @param world - The world where the event listeners will be set up.
   * @param enabled - Indicates whether the event listeners should be enabled or disabled.
   *
   * @remarks
   * This method checks if the event listeners are already set up for the given world.
   * If the event listeners are already set up and the `enabled` parameter is true, the method returns without doing anything.
   * If the world does not have camera controls, the method returns without doing anything.
   *
   * The method then retrieves the event listener for the given world using the `getWorldEvent` method.
   * It removes the existing event listeners for the "sleep" and "rest" events from the world's camera controls.
   *
   * If the `enabled` parameter is true, the method adds the event listener for the "sleep" and "rest" events to the world's camera controls.
   */
  setupEvents(world: OBC.World, enabled: boolean) {
    if (enabled && this._setupWorlds.has(world.uuid)) return;
    if (!world.camera.hasCameraControls()) return;

    const event = this.getWorldEvent(world);
    world.camera.controls.removeEventListener("sleep", event);
    world.camera.controls.removeEventListener("rest", event);

    if (enabled) {
      world.camera.controls.addEventListener("sleep", event);
      world.camera.controls.addEventListener("rest", event);
    }
  }

  /**
   * Performs clustering of markers in the given world.
   *
   * @param world - The world where clustering will be performed.
   *
   */
  cluster(world: OBC.World) {
    if (!this.autoCluster) return;
    this.resetMarkers();

    const markers = this.list.get(world.uuid);
    if (!markers) return;

    for (const [_id, marker] of markers) {
      if (!marker.merged && !marker.static) {
        this.currentKeys.clear();
        for (const [_id, marker2] of markers) {
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

    this.removeMergeMarkers(world);
  }

  private getWorldEvent(world: OBC.World) {
    if (!this._worldEvents.has(world.uuid)) {
      const event = () => {
        this.cluster(world);
      };
      this._worldEvents.set(world.uuid, event);
    }
    return this._worldEvents.get(world.uuid)!;
  }

  private resetMarkers() {
    for (const [_worldID, markers] of this.list) {
      for (const [_id, marker] of markers) {
        marker.merged = false;
      }
    }

    for (const cluster of this.clusterLabels) {
      cluster.label.dispose();
    }

    this.clusterLabels.clear();
    this._clusterKey = 0;
  }

  private removeMergeMarkers(world: OBC.World) {
    const markers = this.list.get(world.uuid);
    if (!markers) return;

    for (const [_id, marker] of markers) {
      if (marker.merged) {
        marker.label.dispose();
      } else {
        const scene = marker.label.world.scene.three;
        scene.add(marker.label.three);
      }
    }

    for (const cluster of this.clusterLabels) {
      if (cluster.markerKeys.length === 1) {
        for (const [_worldID, markers] of this.list) {
          const marker = markers.get(cluster.markerKeys[0]);

          if (!marker) continue;

          const scene = marker.label.world.scene.three;
          scene.add(marker.label.three);
          marker.merged = false;
        }
        cluster.label.dispose();
        this.clusterLabels.delete(cluster);
      }
    }
  }

  private getAveragePositionFromLabels(clusterGroup: string[]) {
    const positions = clusterGroup.map((key) => {
      for (const [_worldID, markers] of this.list) {
        const marker = markers.get(key);
        if (marker) {
          return marker.label.three.position;
        }
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
      for (const [_worldID, markers] of this.list) {
        const marker = markers.get(markerKey);
        if (marker) {
          const { x, y, z } = marker.label.three.position;
          boundingRegion.push(x, y, z);
        }
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

    geometry.dispose();
    mesh.clear();

    boundingRegion.length = 0;
  }
}
