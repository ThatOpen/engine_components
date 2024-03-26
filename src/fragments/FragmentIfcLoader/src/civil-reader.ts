import * as WEBIFC from "web-ifc";
import { IfcAlignmentData } from "bim-fragment";
import { IfcCivil } from "./types";

export class CivilReader {
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
      const horizontalAlignments = new IfcAlignmentData();
      const verticalAlignments = new IfcAlignmentData();
      const realAlignments = new IfcAlignmentData();
      let countH = 0;
      let countV = 0;
      let countR = 0;
      const valuesH: number[] = [];
      const valuesV: number[] = [];
      const valuesR: number[] = [];

      for (const alignment of civilItems.IfcAlignment) {
        horizontalAlignments.alignmentIndex.push(countH);
        verticalAlignments.alignmentIndex.push(countV);
        if (alignment.horizontal) {
          for (const hAlignment of alignment.horizontal) {
            horizontalAlignments.curveIndex.push(countH);
            for (const point of hAlignment.points) {
              valuesH.push(point.x);
              valuesH.push(point.y);
              countH++;
            }
          }
        }
        if (alignment.vertical) {
          for (const vAlignment of alignment.vertical) {
            verticalAlignments.curveIndex.push(countV);
            for (const point of vAlignment.points) {
              valuesV.push(point.x);
              valuesV.push(point.y);
              countV++;
            }
          }
        }
        if (alignment.curve3D) {
          for (const rAlignment of alignment.curve3D) {
            realAlignments.curveIndex.push(countR);
            for (const point of rAlignment.points) {
              valuesR.push(point.x);
              valuesR.push(point.y);
              valuesR.push(point.z);
              countR++;
            }
          }
        }
      }

      horizontalAlignments.coordinates = new Float32Array(valuesH);
      verticalAlignments.coordinates = new Float32Array(valuesV);
      realAlignments.coordinates = new Float32Array(valuesR);

      return {
        horizontalAlignments,
        verticalAlignments,
        realAlignments,
      };
    }
    return undefined;
  }
}
