import * as WEBIFC from "web-ifc";
import * as THREE from "three";

export class Units {
  factor = 1;
  complement = 1;

  apply(matrix: THREE.Matrix4) {
    const scale = this.getScaleMatrix();
    const result = scale.multiply(matrix);
    matrix.copy(result);
  }

  setUp(webIfc: WEBIFC.IfcAPI) {
    this.factor = 1;
    const lengthUnits = this.getLengthUnits(webIfc);
    if (lengthUnits.Name.value === "FOOT") {
      this.factor = 0.3048;
    } else if (lengthUnits.Prefix?.value === "MILLI") {
      this.complement = 0.001;
    }
  }

  private getLengthUnits(webIfc: WEBIFC.IfcAPI) {
    const allUnits = webIfc.GetLineIDsWithType(0, WEBIFC.IFCUNITASSIGNMENT);
    const units = allUnits.get(0);
    const unitsProps = webIfc.GetLine(0, units);
    const lengthUnitsID = unitsProps.Units[0].value;
    return webIfc.GetLine(0, lengthUnitsID);
  }

  private getScaleMatrix() {
    return new THREE.Matrix4().fromArray([
      this.factor,
      0,
      0,
      0,
      0,
      this.factor,
      0,
      0,
      0,
      0,
      this.factor,
      0,
      0,
      0,
      0,
      1,
    ]);
  }
}
