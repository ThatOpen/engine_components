import * as THREE from "three";

/** The name of the CSS class that styles the dimension label. */
export const DimensionLabelClassName = "ifcjs-dimension-label";

/** The name of the CSS class that styles the dimension label. */
export const DimensionPreviewClassName = "ifcjs-dimension-preview";

export interface DimensionData {
  start: THREE.Vector3;
  end: THREE.Vector3;
  lineMaterial: THREE.Material;
  endpoint: THREE.Mesh;
}
