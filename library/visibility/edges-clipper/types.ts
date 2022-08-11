import { LineMaterial } from "three/examples/jsm/lines/LineMaterial";
import { LineSegmentsGeometry } from "three/examples/jsm/lines/LineSegmentsGeometry";
import { LineSegments2 } from "three/examples/jsm/lines/LineSegments2";
import { BufferGeometry, Mesh } from "three";

export interface Style {
  ids: string[];
  categories: number[];
  meshes: Mesh[];
  material: LineMaterial;
}

export interface StyleList {
  [styleName: string]: Style;
}

export interface BvhLineSegmentsGeometry extends LineSegmentsGeometry {
  boundsTree: any;
  disposeBoundsTree: () => void;
}

export interface EdgesItems {
  [styleName: string]: {
    generatorGeometry: BufferGeometry;
    mesh: LineSegments2;
  };
}
