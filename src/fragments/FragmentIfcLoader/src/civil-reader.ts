import * as THREE from "three";
import * as WEBIFC from "web-ifc";
import * as FRAGS from "bim-fragment";
import { IfcCivil } from "./types";

export class CivilReader {
  defLineMat = new THREE.LineBasicMaterial({ color: 0xffffff });

  read(webIfc: WEBIFC.IfcAPI) {
    const IfcAlignment = webIfc.GetAllAlignments(0);
    const IfcCrossSection2D = webIfc.GetAllCrossSections2D(0);
    const IfcCrossSection3D = webIfc.GetAllCrossSections3D(0);

    const civilItems: IfcCivil = {
      IfcAlignment,
      IfcCrossSection2D,
      IfcCrossSection3D,
    };

    return this.get(civilItems);
  }

  get(civilItems: any) {
    if (civilItems.IfcAlignment) {

      const alignments = new Map<number, FRAGS.Alignment>();

      for (const alignment of civilItems.IfcAlignment) {
        const absolute = this.getCurves(alignment.curve3D);
        const horizontal = this.getCurves(alignment.horizontal);
        const vertical = this.getCurves(alignment.vertical);
        const count = alignments.size;
        alignments.set(count, { horizontal, vertical, absolute });
      }

      return { alignments };
    }
    return undefined;
  }

  private getCurves(alignment: any) {
    const curves: FRAGS.CivilCurve[] = [];
    for (const curve of alignment) {
      const mesh = this.getCurveMesh(curve.points);
      const data = {} as { [key: string]: string };
      if (curve.data) {
        for (const entry of curve.data) {
          const [key, value] = entry.split(": ");
          const numValue = parseFloat(value);
          data[key] = numValue || value;
        }
      }
      curves.push({ mesh, data });
    }
    return curves;
  }

  private getCurveMesh(points: { x: number; y: number; z?: number }[]) {
    const array = new Float32Array(points.length * 3);
    for (let i = 0; i < points.length; i++) {
      const { x, y, z } = points[i];
      array[i * 3] = x;
      array[i * 3 + 1] = y;
      array[i * 3 + 2] = z || 0;
    }

    const attr = new THREE.BufferAttribute(array, 3);
    const geometry = new THREE.EdgesGeometry();
    geometry.setAttribute("position", attr);
    return new THREE.LineSegments(geometry, this.defLineMat);
  }
}
