import * as THREE from "three";

/** The name of the CSS class that styles the dimension label. */
export const DimensionLabelClassName = "that-open-dimension-label";

/** The name of the CSS class that styles the dimension label. */
export const DimensionPreviewClassName =
  "bg-ifcjs-100 rounded-full w-[8px] h-[8px]";

export interface DimensionData {
  start: THREE.Vector3;
  end: THREE.Vector3;
  lineMaterial: THREE.Material;
  endpointElement: HTMLElement;
}
