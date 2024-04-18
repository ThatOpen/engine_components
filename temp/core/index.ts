import { MeshBVH, acceleratedRaycast, computeBoundsTree, disposeBoundsTree } from "three-mesh-bvh";

// TODO: Find a better place to put this.
declare module 'three' {
  export interface BufferGeometry {
    boundsTree?: MeshBVH;
    computeBoundsTree: typeof computeBoundsTree;
    disposeBoundsTree: typeof disposeBoundsTree;
  }

  export interface Mesh {
    raycast: typeof acceleratedRaycast;
  }
}

export * from "./Disposer";
export * from "./SimpleScene";
export * from "./ToolsComponent";
export * from "./SimpleRenderer";
export * from "./SimpleCamera";
export * from "./SimpleRaycaster";
export * from "./SimpleGrid";
export * from "./Components";
export * from "./SimpleClipper";
export * from "./ScreenCuller";
export * from "./SimpleSVGViewport";
export * from "./Simple2DMarker";
export * from "./MaterialManager";
export * from "./Simple2DScene";
