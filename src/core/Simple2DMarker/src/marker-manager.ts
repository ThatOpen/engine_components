import * as FRAGS from "bim-fragment";
import * as THREE from "three";
import { Components, Simple2DScene, Simple2DMarker } from "../..";
import { FragmentBoundingBox } from "../../../fragments";

type CivilLabels =
  | "Station"
  | "Radius"
  | "Length"
  | "InitialKP"
  | "FinalKP"
  | "Coordinate"
  | "InitialKPV"
  | "FinalKPV"
  | "Slope";

interface IMarker {
  key: string;
  label: Simple2DMarker;
  mesh: FRAGS.CurveMesh | THREE.Mesh;
  type?: CivilLabels;
  merged: boolean;
}

interface IGroupedLabels {
  key: string;
  markerKeys: string[];
  label: Simple2DMarker;
}

/**
 * Class for Managing Markers along with creating different types of markers
 * Every marker is a Simple2DMarker
 * For every marker that needs to be added, you can use the Manager to add the marker and change its look and feel
 */
export class MarkerManager {
  private markers: Set<IMarker> = new Set<IMarker>();
  private clusterLabels: Set<IGroupedLabels> = new Set<IGroupedLabels>();

  private currentKeys: Set<string> = new Set<string>();

  private scene: Simple2DScene | undefined;
  private _clusterOnZoom = true;
  private _color = "white";

  // TODO: Replace with UUID for the marker key
  private _markerKey = 0;
  private _clusterKey = 0;

  private _clusterThreeshold = 50;

  private boundingB: FragmentBoundingBox;

  private isNavigating = false;

  constructor(private components: Components, scene?: Simple2DScene) {
    if (scene) {
      this.scene = scene;
    }
    this.boundingB = this.components.tools.get(FragmentBoundingBox);
    this.setupEvents();
  }

  set clusterOnZoom(value: boolean) {
    this._clusterOnZoom = value;
  }

  get clusterOnZoom() {
    return this._clusterOnZoom;
  }

  set color(value: string) {
    this._color = value;
    this.markers.forEach((marker) => {
      marker.label.get().element.style.color = value;
    });
  }

  set clusterThreeshold(value: number) {
    this._clusterThreeshold = value;
  }

  get clusterThreeshold() {
    return this._clusterThreeshold;
  }

  private setupEvents() {
    if (this.scene) {
      this.scene.controls.addEventListener("sleep", () => {
        this.manageCluster();
      });

      this.scene.controls.addEventListener("rest", () => {
        if (this.isNavigating) {
          this.manageCluster();
          this.isNavigating = false;
        }
      });
    }
  }

  private resetMarkers() {
    this.markers.forEach((marker) => {
      marker.merged = false;
    });
    this.clusterLabels.forEach((cluster) => {
      this.scene?.get().remove(cluster.label.get());
    });
    this.clusterLabels.clear();
    this._clusterKey = 0;
  }

  private removeMergeMarkers() {
    this.markers.forEach((marker) => {
      if (marker.merged) {
        this.scene?.get().remove(marker.label.get());
      } else {
        this.scene?.get().add(marker.label.get());
      }
    });
    this.clusterLabels.forEach((cluster) => {
      if (cluster.markerKeys.length === 1) {
        const marker = Array.from(this.markers).find(
          (marker) => marker.key === cluster.markerKeys[0]
        );

        if (marker) {
          this.scene?.get().add(marker.label.get());
          marker.merged = false;
        }

        this.scene?.get().remove(cluster.label.get());
        this.clusterLabels.delete(cluster);
      }
    });
  }

  private manageCluster() {
    this.resetMarkers();

    this.markers.forEach((marker) => {
      if (!marker.merged) {
        this.currentKeys.clear();
        this.markers.forEach((marker2) => {
          if (marker.key !== marker2.key && !marker2.merged) {
            const distance = this.distance(marker.label, marker2.label);
            if (distance < this._clusterThreeshold) {
              this.currentKeys.add(marker2.key);
              marker2.merged = true;
            }
          }
        });
        if (this.currentKeys.size > 0) {
          this.currentKeys.add(marker.key);
          marker.merged = true;
          const clusterGroup = Array.from(this.currentKeys);
          const averagePosition =
            this.getAveragePositionFromLabels(clusterGroup);
          const clusterLabel = new Simple2DMarker(
            this.components,
            this.createClusterElement(this._clusterKey.toString()),
            this.scene
          );
          clusterLabel.get().element.textContent =
            clusterGroup.length.toString();
          clusterLabel.get().position.copy(averagePosition);
          this.clusterLabels.add({
            key: this._clusterKey.toString(),
            markerKeys: clusterGroup,
            label: clusterLabel,
          });
          this._clusterKey++;
        }
      }
    });

    this.removeMergeMarkers();
  }

  getAveragePositionFromLabels(clusterGroup: string[]) {
    const positions = clusterGroup.map((key) => {
      const marker = Array.from(this.markers).find(
        (marker: IMarker) => marker.key === key
      );
      if (marker) {
        return marker.label.get().position;
      }
      return new THREE.Vector3();
    });
    const averagePosition = positions
      .reduce((acc, curr) => acc.add(curr), new THREE.Vector3())
      .divideScalar(positions.length);
    return averagePosition;
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
    div.style.transition = "all 0.05s";
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

  addMarker(text: string, mesh: THREE.Mesh) {
    const span = document.createElement("span");
    span.innerHTML = text;
    span.style.color = this._color;

    const marker = new Simple2DMarker(this.components, span, this.scene);

    marker.get().position.copy(mesh.position);
    this.markers.add({
      label: marker,
      mesh,
      key: this._markerKey.toString(),
      merged: false,
    });
    this._markerKey++;
  }

  addCivilMarker(text: string, mesh: FRAGS.CurveMesh, type: CivilLabels) {
    const span = document.createElement("span");
    span.innerHTML = text;
    span.style.color = this._color;

    const marker = new Simple2DMarker(this.components, span, this.scene);

    if (type === "InitialKP") {
      const pX = mesh.geometry.attributes.position.getX(0);
      const pY = mesh.geometry.attributes.position.getY(0);
      const pZ = mesh.geometry.attributes.position.getZ(0);
      marker.get().position.set(pX + 2, pY + 2, pZ);
    } else if (type === "FinalKP") {
      const pX = mesh.geometry.attributes.position.getX(
        mesh.geometry.attributes.position.count - 1
      );
      const pY = mesh.geometry.attributes.position.getY(
        mesh.geometry.attributes.position.count - 1
      );
      const pZ = mesh.geometry.attributes.position.getZ(
        mesh.geometry.attributes.position.count - 1
      );
      marker.get().position.set(pX + 2, pY - 2, pZ);
    } else if (type === "Length") {
      const pointStart = new THREE.Vector3();
      pointStart.x = mesh.geometry.attributes.position.getX(0);
      pointStart.y = mesh.geometry.attributes.position.getY(0);
      pointStart.z = mesh.geometry.attributes.position.getZ(0);

      const pointEnd = new THREE.Vector3();
      pointEnd.x = mesh.geometry.attributes.position.getX(
        mesh.geometry.attributes.position.count - 1
      );
      pointEnd.y = mesh.geometry.attributes.position.getY(
        mesh.geometry.attributes.position.count - 1
      );
      pointEnd.z = mesh.geometry.attributes.position.getZ(
        mesh.geometry.attributes.position.count - 1
      );

      const length = pointStart.distanceTo(pointEnd);
      marker.get().element.innerText = length.toFixed(2);
      marker
        .get()
        .position.copy(pointEnd.clone().add(pointStart).divideScalar(2));
    } else if (type === "Coordinate") {
      const span = document.createElement("span");
      span.innerHTML = text;
      span.style.color = this._color;

      const marker = new Simple2DMarker(this.components, span, this.scene);

      const { position } = mesh.geometry.attributes;
      const setArray = position.array.length / 3;

      const firstIndex = (setArray - 1) * 3;
      const lastIndex = position.array.slice(firstIndex, firstIndex + 3);

      marker.get().position.set(lastIndex[0], lastIndex[1] + 10, lastIndex[2]);
    } else if (type === "InitialKPV") {
      const { position } = mesh.geometry.attributes;
      const pX = position.getX(0);
      const pY = position.getY(0);
      const pZ = position.getZ(0);
      marker.get().position.set(pX - 20, pY, pZ);
    } else if (type === "FinalKPV") {
      const { position } = mesh.geometry.attributes;

      const pX = position.getX(mesh.geometry.attributes.position.count - 1);
      const pY = position.getY(mesh.geometry.attributes.position.count - 1);
      const pZ = position.getZ(mesh.geometry.attributes.position.count - 1);
      marker.get().position.set(pX + 20, pY, pZ);
    } else if (type === "Slope") {
      span.style.color = "grey";

      const { position } = mesh.geometry.attributes;

      const pointStart = new THREE.Vector3();
      pointStart.x = position.getX(0);
      pointStart.y = position.getY(0);
      pointStart.z = position.getZ(0);

      const pointEnd = new THREE.Vector3();
      pointEnd.x = position.getX(position.count - 1);
      pointEnd.y = position.getY(position.count - 1);
      pointEnd.z = position.getZ(position.count - 1);

      const midPoint = new THREE.Vector3();
      midPoint.addVectors(pointStart, pointEnd).multiplyScalar(0.5);

      marker.get().position.set(midPoint.x, midPoint.y - 10, midPoint.z);
    }
    this.markers.add({
      label: marker,
      mesh,
      key: this._markerKey.toString(),
      type,
      merged: false,
    });
    this._markerKey++;

    return marker;
  }

  private getScreenPosition(label: Simple2DMarker) {
    const screenPosition = new THREE.Vector3();
    if (!this.scene) {
      const labelPosition = label
        .get()
        .position.clone()
        .project(this.components.camera.get());
      const dimensions = this.components.renderer.getSize();
      screenPosition.x =
        (labelPosition.x * dimensions.x) / 2 + dimensions.x / 2;
      screenPosition.y =
        -((labelPosition.y * dimensions.y) / 2) + dimensions.y / 2;
    } else {
      const labelPosition = label
        .get()
        .position.clone()
        .project(this.scene?.camera);
      const dimensions = this.scene?.renderer.getSize();
      screenPosition.x =
        (labelPosition.x * dimensions.x) / 2 + dimensions.x / 2;
      screenPosition.y =
        -((labelPosition.y * dimensions.y) / 2) + dimensions.y / 2;
    }
    return screenPosition;
  }

  private distance(label1: Simple2DMarker, label2: Simple2DMarker) {
    const screenPosition1 = this.getScreenPosition(label1);
    const screenPosition2 = this.getScreenPosition(label2);
    const dx = screenPosition1.x - screenPosition2.x;
    const dy = screenPosition1.y - screenPosition2.y;
    const distance = Math.sqrt(dx * dx + dy * dy) * 0.5;
    // Managing Overlapping Labels
    // if (distance === 0) {
    //   const updateDistance = this._clusterThreeshold + 1;
    //   return updateDistance;
    // }
    return distance;
  }

  private navigateToCluster(key: string) {
    this.boundingB.reset();

    const cluster = Array.from(this.clusterLabels).find(
      (cluster) => cluster.key === key
    );
    if (cluster) {
      cluster.markerKeys.forEach((markerKey) => {
        const marker = Array.from(this.markers).find(
          (marker) => marker.key === markerKey
        );
        if (marker) {
          this.boundingB.addMesh(marker.mesh as THREE.Mesh);
        }
      });
      this.scene?.get().remove(cluster?.label.get());
      this.clusterLabels.delete(cluster);
    }
    if (this.scene) {
      this.scene.controls.fitToSphere(this.boundingB.getSphere(), true);
      this.isNavigating = true;
    }
  }

  dispose() {
    this.markers.forEach((marker) => {
      marker.label.dispose();
    });
    this.markers.clear();
    this._markerKey = 0;

    this.clusterLabels.forEach((cluster) => {
      cluster.label.dispose();
    });
    this.clusterLabels.clear();
    this._clusterKey = 0;

    this.currentKeys.clear();
  }
}
