import * as THREE from "three";
import * as WEBIFC from "web-ifc";
import * as FRAGS from "bim-fragment";
import { Alignment } from "bim-fragment";
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

      for (const ifcAlign of civilItems.IfcAlignment) {
        const alignment = new Alignment();
        alignment.absolute = this.getCurves(ifcAlign.curve3D, alignment);
        alignment.horizontal = this.getCurves(ifcAlign.horizontal, alignment);
        alignment.vertical = this.getCurves(ifcAlign.vertical, alignment);
        alignments.set(alignments.size, alignment);
      }

      return { alignments, coordinationMatrix: new THREE.Matrix4() };
    }
    return undefined;
  }

  private getCurves(ifcAlignData: any, alignment: Alignment) {
    const curves: FRAGS.CivilCurve[] = [];
    let index = 0;
    for (const curve of ifcAlignData) {
      const data = {} as { [key: string]: string };
      if (curve.data) {
        for (const entry of curve.data) {
          const [key, value] = entry.split(": ");
          const numValue = parseFloat(value);
          data[key] = numValue || value;
        }
      }

      const { points } = curve;
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

      const mesh = new FRAGS.CurveMesh(
        index,
        data,
        alignment,
        geometry,
        this.defLineMat
      );

      curves.push(mesh.curve);
      index++;
    }
    return curves;
  }
}
