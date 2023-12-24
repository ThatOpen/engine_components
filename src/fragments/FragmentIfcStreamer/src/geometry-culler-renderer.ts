import * as THREE from "three";
import { Event } from "../../../base-types";
import {
  CullerRenderer,
  CullerRendererSettings,
} from "../../../core/ScreenCuller/src";
import { Components } from "../../../core";

/**
 * A renderer to determine a geometry visibility on screen
 */
export class GeometryCullerRenderer extends CullerRenderer {
  readonly onViewUpdated = new Event<{
    seen: Set<{ modelID: string; geometryID: number }>;
    unseen: Set<{ modelID: string; geometryID: number }>;
  }>();

  private _colorGeometryMap = new Map<
    string,
    { modelID: string; geometryID: number }
  >();

  // private _whiteMaterial = new THREE.MeshBasicMaterial({ color: "white" });

  constructor(components: Components, settings?: CullerRendererSettings) {
    super(components, settings);
    // this.worker.addEventListener("message", this.handleWorkerMessage);
    // if (this.autoUpdate) {
    //   window.setInterval(this.updateVisibility, this.updateInterval);
    // }
  }

  async dispose() {
    await super.dispose();
  }

  add(
    modelID: string,
    bBoxes: THREE.InstancedMesh,
    geometryPerInstance: number[]
  ): void {
    if (!this.enabled) return;

    const count = bBoxes.count;

    if (geometryPerInstance.length !== count) {
      throw new Error(
        "The length of geometryPerInstance doesn't match the InstanceMesh"
      );
    }

    const visitedGeometries = new Map<number, number[]>();

    const colorEnabled = THREE.ColorManagement.enabled;
    THREE.ColorManagement.enabled = false;

    const tempColor = new THREE.Color();
    for (let i = 0; i < geometryPerInstance.length; i++) {
      const geometryID = geometryPerInstance[i];
      if (!visitedGeometries.has(geometryID)) {
        const { r, g, b, code } = this.getNextColor();
        visitedGeometries.set(geometryID, [r, g, b]);
        this._colorGeometryMap.set(code, { modelID, geometryID });
      }
      const color = visitedGeometries.get(geometryID);
      if (!color) {
        throw new Error("Error setting color for bounding boxes");
      }
      const [r, g, b] = color;
      tempColor.set(`rgb(${r}, ${g}, ${b})`);
      bBoxes.setColorAt(i, tempColor);
    }

    bBoxes.instanceColor!.needsUpdate = true;
    THREE.ColorManagement.enabled = colorEnabled;
  }

  // private handleWorkerMessage = async (event: MessageEvent) => {
  //   const colors = event.data.colors as Set<string>;
  // };
}
